// Tap/click a photo inside any [data-lightbox] gallery, or any .content-gallery
// photo (service pages, about, etc.), to open it full-screen. Catalog product
// photos (.catalog-item-gallery) are excluded — they already have their own
// quickview popup via the magnifier button, so a second full-screen zoom on a
// plain photo click would be redundant/conflicting.
function initLightbox() {
	var overlay = document.createElement('div');
	overlay.className = 'lightbox-overlay';
	overlay.innerHTML = '<span class="lightbox-close">&times;</span><img class="lightbox-img" alt="" />';
	document.body.appendChild(overlay);

	var img = overlay.querySelector('.lightbox-img');

	function open(src, alt) {
		img.src = src;
		img.alt = alt || '';
		overlay.classList.add('is-open');
		document.body.classList.add('lightbox-locked');
	}

	function close() {
		overlay.classList.remove('is-open');
		document.body.classList.remove('lightbox-locked');
		img.src = '';
	}

	document.addEventListener('click', function (e) {
		var target = e.target.closest('[data-lightbox] img, .content-gallery img');
		if (!target) return;
		// A photo that's itself a link (e.g. a certificate thumbnail linking
		// to its source PDF) already has a real destination on click — let
		// that happen instead of also popping the zoom overlay on top of it.
		var link = target.closest('a[href]');
		if (link) return;
		open(target.currentSrc || target.src, target.alt);
	});

	overlay.addEventListener('click', close);

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') close();
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initLightbox);
} else {
	initLightbox();
}
