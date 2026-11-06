(function() {

	document.addEventListener('DOMContentLoaded', function() {

		var slider = document.getElementById('slider');
		if (!slider) {
			return;
		}

		var slides = slider.querySelectorAll('.sl-slide');
		var tabs = slider.parentNode.querySelectorAll('.slider-tab');
		var prevBtn = slider.parentNode.querySelector('.slider-arrow-prev');
		var nextBtn = slider.parentNode.querySelector('.slider-arrow-next');
		var total = slides.length;
		var current = 0;
		var interval = 6000;
		var timer = null;

		if (total < 1) {
			return;
		}

		function goTo(index) {
			slides[current].classList.remove('is-active');
			if (tabs[current]) {
				tabs[current].classList.remove('is-active');
			}

			current = (index + total) % total;

			slides[current].classList.add('is-active');
			if (tabs[current]) {
				tabs[current].classList.add('is-active');
			}
		}

		function next() {
			goTo(current + 1);
		}

		function prev() {
			goTo(current - 1);
		}

		function startAutoplay() {
			stopAutoplay();
			timer = setInterval(next, interval);
		}

		function stopAutoplay() {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		}

		tabs.forEach(function(tab, i) {
			tab.addEventListener('click', function() {
				goTo(i);
				startAutoplay();
			});
		});

		if (nextBtn) {
			nextBtn.addEventListener('click', function() {
				next();
				startAutoplay();
			});
		}

		if (prevBtn) {
			prevBtn.addEventListener('click', function() {
				prev();
				startAutoplay();
			});
		}

		startAutoplay();

	});

})();
