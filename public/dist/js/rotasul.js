/*!
 * Mowe {ProjectName} Project v0.0.0 (http://letsmowe.org/)
 * Copyright 2013-2015 Mowe Developers
 * Licensed under MIT (https://github.com/mowekabanas/base/blob/master/LICENSE)
*/



/* GalleryItem */

var GalleryItem = (function () {

	/**
	 * GalleryItem constructor
	 * @constructor
	 */
	function GalleryItem(element) {

		this.element = element;

		this.config = {
			backgroundElementSelector: '.GalleryItem-background',
			backgroundElementClassName: 'GalleryItem-background',
			imageElementSelector: '.GalleryItem-image',
			imageElementClassName: 'GalleryItem-image',
			innerElementSelector: '.GalleryItem-inner',
			innerElementClassName: 'GalleryItem-inner',
			figureElementSelector: '.GalleryItem-figure',
			figureElementClassName: 'GalleryItem-figure',
			imgElementSelector: '.GalleryItem-figure img',
			imgElementClassName: 'GalleryItem-figure img',
			state: {
				isPrevious: 'is-previous',
				isCurrent: 'is-current',
				isNext: 'is-next'
			}
		};

		if (this.element)
			this.init();

	}

	GalleryItem.prototype.isPrevious = function () {

		this.element.classList.remove(this.config.state.isCurrent);
		this.element.classList.remove(this.config.state.isNext);

		this.element.classList.add(this.config.state.isPrevious);

	};

	GalleryItem.prototype.isCurrent = function () {

		this.element.classList.remove(this.config.state.isPrevious);
		this.element.classList.remove(this.config.state.isNext);

		this.element.classList.add(this.config.state.isCurrent);

	};

	GalleryItem.prototype.isNext = function () {

		this.element.classList.remove(this.config.state.isPrevious);
		this.element.classList.remove(this.config.state.isCurrent);

		this.element.classList.add(this.config.state.isNext);

	};

	GalleryItem.prototype.getItemID = function () {

		return this.element.dataset.id;

	};

	GalleryItem.prototype.setItemID = function (ID) {

		this.element.dataset.id = ID;

	};

	GalleryItem.prototype.setImageBackground = function () {

		if (this.img && this.background)
			this.image.style.backgroundImage = 'url("' + this.img.src + '")';

	};

	GalleryItem.prototype.getElements = function () {

		this.background = this.element.querySelector(this.config.backgroundElementSelector);
		this.image = this.element.querySelector(this.config.imageElementSelector);
		this.inner = this.element.querySelector(this.config.innerElementSelector);
		this.figure = this.element.querySelector(this.config.figureElementSelector);
		this.img = this.element.querySelector(this.config.imgElementSelector);

	};

	GalleryItem.prototype.init = function () {

		this.getElements();
		this.setImageBackground();

	};

	return GalleryItem;

})();

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

/* Gallery */

var Gallery = (function () {

	/**
	 * Gallery constructor
	 * @constructor
	 */
	function Gallery(element) {

		this.element = element;

		this.config = {
			backgroundElementSelector: '.Gallery-background',
			innerElementSelector: '.Gallery-inner',
			navigationElementSelector: '.Gallery-navigation',
			itemElementsSelector: '.GalleryItem'
		};

		if (this.element)
			this.init();

	}

	Gallery.prototype.giveItemsAnID = function () {

		for (var i = this.items.length; i--; )
			if (!this.items[i].getItemID())
				this.items[i].setItemID(i);

	};

	Gallery.prototype.getItems = function () {

		var items = [];

		var itemElements = this.element.querySelectorAll(this.config.itemElementsSelector);

		for (var i = 0; i < itemElements.length; i++)
			items.push(new GalleryItem(itemElements[i]));

		return items;

	};

	Gallery.prototype.getElements = function () {

		this.backgroundElement = this.element.querySelector(this.config.backgroundElementSelector);
		this.innerElement = this.element.querySelector(this.config.innerElementSelector);
		this.navigationElement = this.element.querySelector(this.config.navigationElementSelector);

	};

	Gallery.prototype.init = function () {

		this.getElements();
		this.items = this.getItems();
		this.navigation = new GalleryNavigation(this.navigationElement, this);
		this.navigation.start();

	};

	return Gallery;

})();

/* Mowe Logo 1.6 */

var Logo = (function () {

	/**
	 * SVG Logo request
	 * @param viewport {Element}
	 * @param url {string}
	 * @param fallback {object}
	 * @constructor
	 */
	function Logo(viewport, url, fallback) {

		var self = this;

		this.viewport = viewport;
		this.url = url;
		this.fallback = fallback;

		this.get();

	}

	/**
	 * Append to element
	 * @param toElement {Element}
	 * @param before {Element}
	 */
	Logo.prototype.appendTo = function (toElement, before) {

		if (!before)
			toElement.appendChild(this.viewport);
		else
			toElement.insertBefore(this.viewport, before);

	};

	/**
	 * Clone the logo and append to element
	 * @param toElement {Element}
	 */
	Logo.prototype.cloneTo = function (toElement) {

		toElement.innerHTML = this.content;

	};

	Logo.prototype.get = function () {

		var self = this;

		if (this.viewport && this.url) {

			var request = new XMLHttpRequest();
			request.open('GET', this.url, true);

			request.onreadystatechange = function() {

				if (this.readyState === 4)
					if (this.status == 200)
						if (this.responseText) {

							try {

								self.content = this.responseText;
								self.viewport.innerHTML = self.content;
								if (self.fallback)
									self.fallback();

							} catch (e) { }

						}

			};

			request.send();
			request = null;

		}

	};

	return Logo;

})();