(function ($) {
    "use strict";

    function bindConsent(checkboxId, buttonId) {
        var checkbox = document.getElementById(checkboxId);
        var button = document.getElementById(buttonId);
        if (!checkbox || !button) {
            return;
        }
        function update() {
            button.disabled = !checkbox.checked;
            button.style.opacity = checkbox.checked ? '1' : '0.5';
        }
        $(checkbox).on('change', update);
        $(window).on('pageshow', update);
        update();
    }

    $(function () {
        bindConsent('policy', 'btn_submit');
        bindConsent('policy2', 'btn_submit2');
    });
})(jQuery);
