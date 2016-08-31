/* Gallery Navigation */

var GalleryNavigation = (function () {

	/**
	 * Gallery Navigation constructor
	 * @constructor
	 */
	function GalleryNavigation(element, gallery) {

		var self = this;

		this.element = element;
		this.gallery = gallery;

		this.delay = false;
		this.current = 0;

		this.config = {
			footerElementClassName: 'GalleryNavigation-footer',
			footerElementSelector: '.GalleryNavigation-footer',
			footerControlsElementClassName: 'GalleryNavigation-footer-controls',
			footerControlsElementSelector: '.GalleryNavigation-footer-controls',
			sideControlsElementClassName: 'GalleryNavigation-side-controls',
			sideControlsElementSelector: '.GalleryNavigation-side-controls',
			pillElementClassName: 'GalleryNavigationPill',
			pillElementSelector: '.GalleryNavigationPill',
			state: {
				isPrevious: 'is-previous',
				isCurrent: 'is-current',
				isNext: 'is-next'
			}
		};

		this.pillOnClick = function () {

			if (this.dataset.targetItemId)
				self.goTo(this.dataset.targetItemId);

		};

		if (this.gallery)
			this.init();

	}

	GalleryNavigation.prototype.goTo = function (galleryItemID) {

		var currentFound = false;

		for (var i = 0; i < this.gallery.items.length; i++)
			if (this.gallery.items[i]) {

				if (currentFound) // is next
					this.gallery.items[i].isNext();
				else // is previous
					this.gallery.items[i].isPrevious();

				if (this.gallery.items[i].getItemID() == galleryItemID) { // is current

					this.gallery.items[i].isCurrent();
					currentFound = true;

				}

			}

		this.activeCurrentPill(galleryItemID);

		this.resetDelay();

	};

	GalleryNavigation.prototype.activeCurrentPill = function (galleryItemID) {

		for (var i = this.pills.length; i--; ) {

			if (this.pills[i].dataset.targetItemId == galleryItemID)
				this.pills[i].classList.add('is-active');
			else
				this.pills[i].classList.remove('is-active');

		}

	};

	GalleryNavigation.prototype.resetDelay = function () {

		var self = this;

		if (this.delay)
			clearInterval(this.delay);

		this.delay = setInterval(function () {

			if (self.current + 1 > self.gallery.items.length)
				self.current = 0;

			self.goTo(self.current++);

		}, 4000);

	};

	GalleryNavigation.prototype.start = function () {

		this.goTo(this.current++);

	};

	GalleryNavigation.prototype.build = function () {

		this.pills = [];

		if (this.footerControlsElement)
			for (var i = 0; i < this.gallery.items.length; i++) {

				var pillElement = document.createElement('div');
				pillElement.dataset.targetItemId = this.gallery.items[i].getItemID();
				pillElement.className = this.config.pillElementClassName;
				pillElement.addEventListener('click', this.pillOnClick, false);

				this.footerControlsElement.appendChild(pillElement);

				this.pills.push(pillElement);

			}

	};

	GalleryNavigation.prototype.getElements = function () {

		this.footerElement = this.element.querySelector(this.config.footerElementSelector);
		this.footerControlsElement = this.element.querySelector(this.config.footerControlsElementSelector);
		this.sideControlsElement = this.element.querySelector(this.config.sideControlsElementSelector);

	};

	GalleryNavigation.prototype.init = function () {

		this.getElements();
		this.gallery.giveItemsAnID();
		this.build();

	};

	return GalleryNavigation;

})();