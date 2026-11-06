<?php
// Handles both "Отправить заявку" (order/) and "Претензия" (claim/) forms —
// they post different field sets, so this just formats whatever arrived
// rather than hardcoding either form's fields.
//
// Written for PHP 5.3 (this hosting account runs PHP 5.3.29 for this
// domain) — no scalar type hints, no return types, no ??, no random_bytes().

// Portfolio demo: never connect to SMTP or accept uploaded files.
header('Content-Type: text/html; charset=UTF-8');
render_page('Демонстрационная форма', 'Это портфолио. Данные не сохраняются и письма не отправляются.');
exit;

$form_stage = 'startup';
register_shutdown_function('form_shutdown');

function form_shutdown()
{
    $error = error_get_last();
    if (!$error || !in_array($error['type'], array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR), true)) {
        return;
    }
    $stage = isset($GLOBALS['form_stage']) ? $GLOBALS['form_stage'] : 'unknown';
    error_log('send-form.php fatal at ' . $stage . ': ' . $error['message']);
    if (!headers_sent()) {
        header('HTTP/1.1 500 Internal Server Error');
    }
    $location = basename($error['file']) . ':' . (int) $error['line'];
    render_page(
        'Не удалось отправить заявку',
        'Произошла ошибка сервера. Код диагностики: ' . htmlspecialchars($stage, ENT_QUOTES, 'UTF-8')
        . ', строка ' . htmlspecialchars($location, ENT_QUOTES, 'UTF-8')
        . '. Позвоните нам: <a href="tel:+7 (000) 000-00-00">+7 (000) 000-00-00</a>'
    );
}

$to_email = 'demo@example.com';
$site_name = 'PumpCare';
$upload_dir = dirname(__FILE__) . '/uploads/incoming/';
$max_file_bytes = 10 * 1024 * 1024; // 10 MB per file
$allowed_ext = array('jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx');

// SMTP credentials deliberately live outside this file.  Copy
// smtp-config.php.example to smtp-config.php and enter the password there.
// This keeps a secret out of the file that is normally uploaded or archived.
$smtp_config = dirname(__FILE__) . '/smtp-config.php';
if (is_file($smtp_config)) {
    $form_stage = 'loading_config';
    require_once $smtp_config;
}
$form_stage = 'config_loaded';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    exit('Method not allowed');
}

if (!defined('SMTP_HOST') || !defined('SMTP_PORT') || !defined('SMTP_USER')
    || !defined('SMTP_PASS') || trim(SMTP_PASS) === '') {
    header('HTTP/1.1 503 Service Unavailable');
    error_log('send-form.php: SMTP is not configured');
    render_page(
        'Приём заявок временно недоступен',
        'Пожалуйста, позвоните нам напрямую: <a href="tel:+7 (000) 000-00-00">+7 (000) 000-00-00</a>'
    );
    exit;
}

function render_page($title, $message)
{
    $success = $title === 'Спасибо!';
    $page_title = $success ? 'Заявка отправлена' : $title;
    $safe_title = htmlspecialchars($page_title, ENT_QUOTES, 'UTF-8');
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-store');
    echo '<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<meta name="robots" content="noindex, nofollow">'
        . '<title>' . $safe_title . ' | PumpCare</title>';
    echo <<<'FORM_STYLE'
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;min-height:100svh;background:#16355e;color:#2a3548;font-family:Arial,Helvetica,sans-serif;display:flex;flex-direction:column}
.brand{padding:28px 24px;text-align:center}
.brand a{display:inline-block;border-radius:8px}
.brand img{display:block;width:158px;max-width:100%;height:auto}
main{flex:1;display:flex;align-items:center;justify-content:center;padding:24px 20px 56px}
.card{width:100%;max-width:600px;background:#0d6a9f;border:1px solid #398bb9;border-radius:24px;padding:48px 40px;text-align:center;box-shadow:0 18px 60px rgba(22,53,94,.10)}
.status{display:flex;align-items:center;justify-content:center;width:80px;height:80px;margin:0 auto 28px;border-radius:50%;background:#ffffff1f;color:#fff}
.status.error{background:#fff2e9;color:#ab5924}
.status svg{width:38px;height:38px}
.eyebrow{margin:0 0 12px;color:#d5ecff;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
h1{color:#fff;margin:0 0 18px;font-size:36px;line-height:1.2;letter-spacing:-.8px;overflow-wrap:anywhere}
.message{margin:0 auto;color:#edf6ff;font-size:17px;line-height:1.7;overflow-wrap:anywhere}
a{color:#0d6a9f;text-underline-offset:4px}
.next{margin:26px 0 0;padding:18px;background:#095985;border-radius:12px;font-size:14px;line-height:1.6;color:#edf6ff}
.next strong{display:block;margin-bottom:4px;color:#fff;font-size:15px}
.message a{color:#fff}.actions{margin-top:30px}
.button{display:inline-block;padding:16px 28px;border-radius:10px;background:#fff;color:#0d6a9f;text-decoration:none;font-size:15px;font-weight:700;transition:background .15s}
.button:hover{background:#e4f1fc}
a:focus-visible{outline:3px solid #fff;outline-offset:5px}
footer{padding:0 20px 28px;text-align:center;color:#d5e2f1;font-size:13px;line-height:1.8}
footer a{white-space:nowrap;color:#fff}
@media(max-width:480px){.brand{padding:24px 20px 8px}.brand img{width:132px}main{padding:24px 16px 32px}.card{padding:32px 22px;border-radius:18px}h1{font-size:29px}.message{font-size:16px}.status{width:68px;height:68px;margin-bottom:24px}.button{width:100%;padding:16px 12px}}
</style></head><body>
<header class="brand"><a href="/" aria-label="PumpCare — на главную"><img src="/templates/des/images/logo.png" alt="PumpCare"></a></header>
<main><section class="card" aria-labelledby="result-title">
FORM_STYLE;
    if ($success) {
        echo '<div class="status" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M10 20l7 7 14-15" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'
            . '<p class="eyebrow">PumpCare · Обращение принято</p>';
    } else {
        echo '<div class="status error" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M20 10v13m0 6v1" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></div>';
    }
    echo '<h1 id="result-title">' . $safe_title . '</h1>';
    if ($success) {
        echo '<p class="message">Спасибо за обращение! Мы получили вашу заявку и свяжемся с вами в ближайшее время.</p>'
            . '<div class="next"><strong>Что дальше?</strong>Наш специалист уточнит детали и поможет с решением вашего вопроса.</div>';
    } else {
        echo '<p class="message">' . $message . '</p>';
    }
    echo '<div class="actions"><a class="button" href="/">Вернуться на главную</a></div>'
        . '</section></main><footer>Нужна помощь? <a href="tel:+7 (000) 000-00-00">+7 (000) 000-00-00</a><br>ООО «PumpCare»</footer></body></html>';
}

// Honeypot: a field named "website" that's hidden from real visitors via
// CSS — bots that auto-fill every input tend to fill it too.
if (!empty($_POST['website'])) {
    render_page('Спасибо!', 'Ваша заявка отправлена, мы свяжемся с вами в ближайшее время.');
    exit;
}

$skip_fields = array(
    'check_form_1', 'form_id', 'contact_action',
    'secure_image_id', 'secure_code', 'sometext', 'sometext2',
    'website', 'policy', 'subject',
);

$lines = array();
$form_stage = 'form_fields';
foreach ($_POST as $key => $value) {
    if (in_array($key, $skip_fields, true)) {
        continue;
    }
    if (is_array($value)) {
        $value = implode(', ', $value);
    }
    $value = trim((string) $value);
    if ($value === '') {
        continue;
    }
    $label = str_replace('_', ' ', $key);
    $lines[] = $label . ': ' . $value;
}

if (empty($lines)) {
    header('HTTP/1.1 400 Bad Request');
    render_page('Пустая форма', 'Заполните хотя бы одно поле и попробуйте снова.');
    exit;
}

// Uploaded files: saved on the server rather than emailed as attachments
// (keeps this script dependency-free — no PHPMailer/MIME building needed).
// The upload folder itself has its own .htaccess disabling script execution,
// so a malicious upload can't be run even if the extension check below is
// somehow bypassed.
$saved_files = array();
$form_stage = 'file_uploads';
if (!empty($_FILES)) {
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    foreach ($_FILES as $file) {
        $names = is_array($file['name']) ? $file['name'] : array($file['name']);
        $tmp_names = is_array($file['tmp_name']) ? $file['tmp_name'] : array($file['tmp_name']);
        $errors = is_array($file['error']) ? $file['error'] : array($file['error']);
        $sizes = is_array($file['size']) ? $file['size'] : array($file['size']);

        foreach ($names as $i => $orig_name) {
            if ($orig_name === '' || $errors[$i] !== UPLOAD_ERR_OK) {
                continue;
            }
            if ($sizes[$i] > $max_file_bytes) {
                continue;
            }
            $ext = strtolower(pathinfo($orig_name, PATHINFO_EXTENSION));
            if (!in_array($ext, $allowed_ext, true)) {
                continue;
            }
            $safe_name = date('Ymd_His') . '_' . substr(md5(uniqid(mt_rand(), true)), 0, 6) . '.' . $ext;
            if (move_uploaded_file($tmp_names[$i], $upload_dir . $safe_name)) {
                $saved_files[] = $safe_name;
            }
        }
    }
}

$subject = !empty($_POST['subject']) ? (string) $_POST['subject'] : 'Заявка с сайта ' . $site_name;

$form_stage = 'message_body';
$body = implode("\n", $lines);
if ($saved_files) {
    $body .= "\n\nПриложенные файлы (сохранены на сервере в uploads/incoming/):\n" . implode("\n", $saved_files);
}

// Reply-To comes straight from user input, so it must be stripped of any
// CR/LF and validated as a real address before touching the headers —
// otherwise a submitted value like "demo@example.com\r\nBcc: spam@..." could inject
// arbitrary extra headers into the outgoing mail.
$reply_to = '';
$form_stage = 'reply_to';
foreach ($_POST as $key => $value) {
    if (is_string($value) && strpos($key, 'mail') !== false && strpos($value, '@') !== false) {
        $candidate = str_replace(array("\r", "\n"), '', $value);
        if (function_exists('filter_var') && filter_var($candidate, FILTER_VALIDATE_EMAIL)) {
            $reply_to = $candidate;
            break;
        }
    }
}

$encoded_subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$form_stage = 'mail_headers';
$mail_headers = "MIME-Version: 1.0\r\n";
$mail_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$mail_headers .= "From: {$site_name} <" . SMTP_USER . ">\r\n";
$mail_headers .= "To: <{$to_email}>\r\n";
$mail_headers .= "Subject: {$encoded_subject}\r\n";
if ($reply_to !== '') {
    $mail_headers .= "Reply-To: {$reply_to}\r\n";
}

$raw_message = $mail_headers . "\r\n" . $body;
$form_stage = 'smtp_connect';
$result = smtp_send(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_USER, $to_email, $raw_message);

if ($result === true) {
    render_page('Спасибо!', 'Ваша заявка отправлена, мы свяжемся с вами в ближайшее время.');
} else {
    header('HTTP/1.1 500 Internal Server Error');
    // $result holds the failure reason (see smtp_send below) — logged, not
    // shown to the visitor, so a misconfigured password etc. doesn't leak.
    error_log('send-form.php SMTP failure: ' . $result);
    render_page(
        'Не удалось отправить',
        'Код диагностики: ' . htmlspecialchars($form_stage, ENT_QUOTES, 'UTF-8')
        . '. Попробуйте ещё раз позже или позвоните нам: <a href="tel:+7 (000) 000-00-00">+7 (000) 000-00-00</a>'
    );
}

// ---- Minimal dependency-free SMTP client (PHP 5.3-safe) ----
// Handles exactly what this script needs: connect, STARTTLS, AUTH LOGIN,
// send one plain-text message, quit. Returns true on success, or a string
// describing what failed (connection, auth, etc.) for the error_log above.

function smtp_read($fp)
{
    $data = '';
    while (($line = fgets($fp, 515)) !== false) {
        $data .= $line;
        if (!isset($line[3]) || $line[3] === ' ') {
            break;
        }
    }
    return $data;
}

function smtp_code($response)
{
    return (int) substr($response, 0, 3);
}

function smtp_tls_client_method()
{
    // On older PHP, TLS_CLIENT can force TLS 1.0. Prefer an explicit TLS 1.2
    // method when available. PHP 5.3's SSLv23_CLIENT asks OpenSSL to negotiate
    // the newest protocol it supports (including TLS 1.2 when available).
    if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
        $GLOBALS['form_tls_mode'] = 'tls12';
        return STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
    }
    if (defined('STREAM_CRYPTO_METHOD_SSLv23_CLIENT')) {
        $GLOBALS['form_tls_mode'] = 'auto';
        return STREAM_CRYPTO_METHOD_SSLv23_CLIENT;
    }
    if (defined('STREAM_CRYPTO_METHOD_TLS_CLIENT')) {
        $GLOBALS['form_tls_mode'] = 'tls_legacy';
        return STREAM_CRYPTO_METHOD_TLS_CLIENT;
    }
    if (defined('STREAM_CRYPTO_METHOD_TLSv1_CLIENT')) {
        $GLOBALS['form_tls_mode'] = 'tls1';
        return STREAM_CRYPTO_METHOD_TLSv1_CLIENT;
    }
    return false;
}

function smtp_send($host, $port, $username, $password, $from_email, $to_email, $raw_message)
{
    $GLOBALS['form_stage'] = 'smtp_connect';
    $errno = 0;
    $errstr = '';
    $fp = @fsockopen($host, $port, $errno, $errstr, 10);
    if (!$fp) {
        // Show a safe, short network diagnostic when the hosting account
        // cannot open an SMTP socket. Never expose credentials or raw errors.
        $reason = 'other';
        $connect_error = strtolower($errstr);
        if (strpos($connect_error, 'getaddrinfo') !== false
            || strpos($connect_error, 'php_network_getaddresses') !== false
            || strpos($connect_error, 'name or service not known') !== false) {
            $reason = 'dns';
        } elseif (strpos($connect_error, 'timed out') !== false
            || strpos($connect_error, 'timeout') !== false) {
            $reason = 'timeout';
        } elseif (strpos($connect_error, 'refused') !== false) {
            $reason = 'refused';
        } elseif (strpos($connect_error, 'permission denied') !== false
            || strpos($connect_error, 'access denied') !== false) {
            $reason = 'denied';
        } elseif (strpos($connect_error, 'unreachable') !== false) {
            $reason = 'unreachable';
        }
        $GLOBALS['form_stage'] = 'smtp_connect_' . $reason . '_' . (int) $errno;
        return 'connect failed: ' . $errstr;
    }
    stream_set_timeout($fp, 10);

    $GLOBALS['form_stage'] = 'smtp_greeting';
    if (smtp_code(smtp_read($fp)) !== 220) {
        fclose($fp);
        return 'no SMTP greeting';
    }

    $GLOBALS['form_stage'] = 'smtp_ehlo';
    fwrite($fp, "EHLO example.com\r\n");
    if (smtp_code(smtp_read($fp)) !== 250) {
        fclose($fp);
        return 'EHLO failed';
    }

    $GLOBALS['form_stage'] = 'smtp_starttls';
    fwrite($fp, "STARTTLS\r\n");
    if (smtp_code(smtp_read($fp)) !== 220) {
        fclose($fp);
        return 'STARTTLS refused';
    }

    $GLOBALS['form_stage'] = 'smtp_tls_handshake';
    $crypto_method = smtp_tls_client_method();
    if ($crypto_method === false) {
        fclose($fp);
        return 'TLS is unavailable in this PHP installation';
    }
    $GLOBALS['form_stage'] = 'smtp_tls_configuration';
    if (!@stream_context_set_option($fp, 'ssl', 'verify_peer', true)
        || !@stream_context_set_option($fp, 'ssl', 'allow_self_signed', false)
        || !@stream_context_set_option($fp, 'ssl', 'CN_match', $host)) {
        fclose($fp);
        return 'could not configure TLS peer verification';
    }
    $GLOBALS['form_stage'] = 'smtp_tls_handshake_' . $GLOBALS['form_tls_mode'];
    // Discard earlier OpenSSL errors so the log describes this handshake only.
    if (function_exists('openssl_error_string')) {
        while (openssl_error_string() !== false) {}
    }
    if (!@stream_socket_enable_crypto($fp, true, $crypto_method)) {
        $tls_error = error_get_last();
        if ($tls_error && isset($tls_error['message'])) {
            error_log('send-form.php TLS: ' . $tls_error['message']);
        }
        if (function_exists('openssl_error_string')) {
            while (($openssl_error = openssl_error_string()) !== false) {
                error_log('send-form.php OpenSSL: ' . $openssl_error);
            }
        }
        fclose($fp);
        return 'TLS handshake failed';
    }

    $GLOBALS['form_stage'] = 'smtp_ehlo_tls';
    fwrite($fp, "EHLO example.com\r\n");
    if (smtp_code(smtp_read($fp)) !== 250) {
        fclose($fp);
        return 'EHLO after STARTTLS failed';
    }

    $GLOBALS['form_stage'] = 'smtp_auth';
    fwrite($fp, "AUTH LOGIN\r\n");
    if (smtp_code(smtp_read($fp)) !== 334) {
        fclose($fp);
        return 'AUTH LOGIN refused';
    }

    $GLOBALS['form_stage'] = 'smtp_username';
    fwrite($fp, base64_encode($username) . "\r\n");
    if (smtp_code(smtp_read($fp)) !== 334) {
        fclose($fp);
        return 'username rejected';
    }

    $GLOBALS['form_stage'] = 'smtp_password';
    fwrite($fp, base64_encode($password) . "\r\n");
    if (smtp_code(smtp_read($fp)) !== 235) {
        fclose($fp);
        return 'authentication failed — check SMTP_PASS';
    }

    $GLOBALS['form_stage'] = 'smtp_sender';
    fwrite($fp, "MAIL FROM:<{$from_email}>\r\n");
    if (smtp_code(smtp_read($fp)) !== 250) {
        fclose($fp);
        return 'MAIL FROM rejected';
    }

    $GLOBALS['form_stage'] = 'smtp_recipient';
    fwrite($fp, "RCPT TO:<{$to_email}>\r\n");
    $code = smtp_code(smtp_read($fp));
    if ($code !== 250 && $code !== 251) {
        fclose($fp);
        return 'RCPT TO rejected';
    }

    $GLOBALS['form_stage'] = 'smtp_data';
    fwrite($fp, "DATA\r\n");
    if (smtp_code(smtp_read($fp)) !== 354) {
        fclose($fp);
        return 'DATA refused';
    }

    $GLOBALS['form_stage'] = 'smtp_delivery';
    // Lines starting with "." must be doubled per RFC 5321 (dot-stuffing).
    $escaped = preg_replace('/^\./m', '..', $raw_message);
    fwrite($fp, $escaped . "\r\n.\r\n");
    if (smtp_code(smtp_read($fp)) !== 250) {
        fclose($fp);
        return 'message rejected by server';
    }

    fwrite($fp, "QUIT\r\n");
    fclose($fp);
    return true;
}
