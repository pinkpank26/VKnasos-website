// Category filter + pagination for the product catalog
// ("Автоматика и принадлежности"). Pure client-side: no data, no backend —
// just show/hide the .catalog-item cards already in the page markup.
function initCatalog() {
	var root = document.querySelector('.catalog-layout');
	if (!root) return;

	var categoryLinks = root.querySelectorAll('.catalog-cat');
	var items = Array.prototype.slice.call(root.querySelectorAll('.catalog-item'));
	var pager = root.querySelector('.catalog-pagination');
	var main = root.querySelector('.catalog-main');
	var perPage = 9;
	var currentCat = 'all';
	var currentPage = 1;

	function render() {
		var filtered = items.filter(function (item) {
			return currentCat === 'all' || item.getAttribute('data-cat') === currentCat;
		});
		var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
		if (currentPage > totalPages) currentPage = totalPages;

		items.forEach(function (item) {
			item.style.display = 'none';
		});
		filtered.forEach(function (item, i) {
			var page = Math.floor(i / perPage) + 1;
			if (page === currentPage) item.style.display = '';
		});

		pager.innerHTML = '';
		if (totalPages > 1) {
			for (var p = 1; p <= totalPages; p++) {
				var btn = document.createElement('button');
				btn.type = 'button';
				btn.textContent = String(p);
				btn.className = 'catalog-page' + (p === currentPage ? ' is-active' : '');
				(function (page) {
					btn.addEventListener('click', function () {
						currentPage = page;
						render();
						main.scrollIntoView({ behavior: 'smooth', block: 'start' });
					});
				})(p);
				pager.appendChild(btn);
			}
		}
	}

	categoryLinks.forEach(function (link) {
		link.addEventListener('click', function (e) {
			e.preventDefault();
			currentCat = this.getAttribute('data-cat');
			currentPage = 1;
			categoryLinks.forEach(function (l) {
				l.classList.remove('is-active');
			});
			this.classList.add('is-active');
			render();
		});
	});

	render();
}

// Product cards with more than one photo: show one at a time. No visible
// arrows or dead zones — the cursor position across the whole photo maps
// straight to a photo index (left third → photo 1, middle third → photo 2,
// etc.), so scanning the mouse left-to-right previews all of them smoothly.
// Resets to the first photo when the mouse leaves.
function initCatalogSliders() {
	var galleries = document.querySelectorAll('.catalog-item-gallery');

	galleries.forEach(function (gallery) {
		var imgs = Array.prototype.slice.call(gallery.querySelectorAll('img'));
		if (imgs.length <= 1) return;

		var current = 0;
		imgs.forEach(function (img, i) {
			img.style.display = i === 0 ? '' : 'none';
		});
		gallery.classList.add('has-slider');

		function show(index) {
			if (index === current) return;
			imgs[current].style.display = 'none';
			current = index;
			imgs[current].style.display = '';
		}

		gallery.addEventListener('mousemove', function (e) {
			var rect = gallery.getBoundingClientRect();
			var ratio = (e.clientX - rect.left) / rect.width;
			var index = Math.min(imgs.length - 1, Math.max(0, Math.floor(ratio * imgs.length)));
			show(index);
			gallery.style.cursor = ratio < 0.5 ? 'w-resize' : 'e-resize';
		});

		gallery.addEventListener('mouseleave', function () {
			show(0);
			gallery.style.cursor = '';
		});
	});
}

// Magnifier button on each card opens a centered popup with the photo
// (plus click-through dots) and the product name/category on the side.
function initCatalogQuickview() {
	var items = document.querySelectorAll('.catalog-item');
	if (!items.length) return;

	var overlay = document.createElement('div');
	overlay.className = 'quickview-overlay';
	overlay.innerHTML =
		'<div class="quickview-box">' +
			'<span class="quickview-close">&times;</span>' +
			'<div class="quickview-photo">' +
				'<button type="button" class="quickview-arrow quickview-arrow-prev" aria-label="Предыдущее фото">&#10094;</button>' +
				'<img class="quickview-img" alt="" />' +
				'<button type="button" class="quickview-arrow quickview-arrow-next" aria-label="Следующее фото">&#10095;</button>' +
				'<div class="quickview-dots"></div>' +
			'</div>' +
			'<div class="quickview-info">' +
				'<div class="quickview-cat"></div>' +
				'<h2 class="quickview-name"></h2>' +
				'<div class="quickview-desc"></div>' +
				'<a href="../../order/index.html" class="quickview-cta">Оставить заявку</a>' +
			'</div>' +
		'</div>';
	document.body.appendChild(overlay);

	var img = overlay.querySelector('.quickview-img');
	var dotsWrap = overlay.querySelector('.quickview-dots');
	var catEl = overlay.querySelector('.quickview-cat');
	var nameEl = overlay.querySelector('.quickview-name');
	var descEl = overlay.querySelector('.quickview-desc');
	var prevArrow = overlay.querySelector('.quickview-arrow-prev');
	var nextArrow = overlay.querySelector('.quickview-arrow-next');
	var photos = [];
	var current = 0;

	function close() {
		overlay.classList.remove('is-open');
		document.body.classList.remove('lightbox-locked');
	}

	function show(index) {
		current = (index + photos.length) % photos.length;
		img.src = photos[current].getAttribute('src');
		img.alt = photos[current].alt;
		var dots = dotsWrap.querySelectorAll('.quickview-dot');
		for (var i = 0; i < dots.length; i++) {
			dots[i].classList.toggle('is-active', i === current);
		}
	}

	prevArrow.addEventListener('click', function () {
		show(current - 1);
	});
	nextArrow.addEventListener('click', function () {
		show(current + 1);
	});

	function openFor(item) {
		photos = Array.prototype.slice.call(item.querySelectorAll('.catalog-item-gallery img'));
		var catSource = item.querySelector('.catalog-item-cat');
		var nameSource = item.querySelector('h3');
		var descSource = item.querySelector('.catalog-item-desc');
		catEl.textContent = catSource ? catSource.textContent : '';
		nameEl.textContent = nameSource ? nameSource.textContent : '';
		descEl.innerHTML = descSource ? descSource.innerHTML : '';

		dotsWrap.innerHTML = '';
		photos.forEach(function (photo, index) {
			var dot = document.createElement('button');
			dot.type = 'button';
			dot.className = 'quickview-dot';
			dot.setAttribute('aria-label', 'Фото ' + (index + 1));
			dot.addEventListener('click', function () {
				show(index);
			});
			dotsWrap.appendChild(dot);
		});
		var hasMultiple = photos.length > 1;
		dotsWrap.style.display = hasMultiple ? '' : 'none';
		prevArrow.style.display = hasMultiple ? '' : 'none';
		nextArrow.style.display = hasMultiple ? '' : 'none';

		show(0);
		overlay.classList.add('is-open');
		document.body.classList.add('lightbox-locked');
	}

	items.forEach(function (item) {
		var btn = item.querySelector('.catalog-item-zoom');
		if (!btn) return;
		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			openFor(item);
		});
	});

	overlay.querySelector('.quickview-close').addEventListener('click', close);
	overlay.addEventListener('click', function (e) {
		if (e.target === overlay) close();
	});
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') close();
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', function () {
		initCatalog();
		initCatalogSliders();
		initCatalogQuickview();
	});
} else {
	initCatalog();
	initCatalogSliders();
	initCatalogQuickview();
}
