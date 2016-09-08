
/* Navigation Item */

var NavigationItem = (function() {

	/**
	 * Naviagation Item constructor
	 * @param parameters {object}
	 * @param page {Element}
	 * @constructor
	 */
	function NavigationItem(parameters, page) {

		this.name = parameters.itemName;
		this.title = parameters.itemTitle;
		this.url = parameters.itemURL;

		this.isHome = parameters.isHome || false;

		this.stateClass = parameters.stateClass || false;

		this.action = parameters.action || false;

		this.page = page;

	}

	return NavigationItem;

})();