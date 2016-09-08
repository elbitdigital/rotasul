
/* NavigationState */

var NavigationState = (function () {

	/**
	 * Navigation State constructor
	 * @param item {object}
	 * @constructor
	 */
	function NavigationState(item) {

		this.name = item.name || false;
		this.title = item.title || false;
		this.url = item.url || false;

		this.stateClass = item.stateClass || false;

	}

	return NavigationState;

})();