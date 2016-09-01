
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