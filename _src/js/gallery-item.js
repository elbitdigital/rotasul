
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
