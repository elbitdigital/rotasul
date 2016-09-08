
/* Navigation */

var Navigation = (function () {

	function Navigation(viewport, documentTarget, menu) {

		var self = this;

		this.viewport = viewport;
		this.document = documentTarget;
		this.menu = menu || false;

		this.transition = {};
		this.transitionDelay = {};

		this.title = {};

		this.title.default = 'La Dorni';
		this.title.defaultPrefix = 'La Dorni | ';
		this.title.defaultPostfix = ' | La Dorni';

		this.navigationItems = [];

		// Default pages
		this.home = false;
		this.error = false;

		this.current = false;
		this.changePageCount = 0;

		this.onNavigationItemClick = function(ev) {

			if (this.dataset.navigationTarget) {

				if (self.menu)
					if (self.menu.isActive)
						self.menu.close();

				ev.preventDefault();

				var item = self.queryNavigationItem(this.dataset.navigationTarget);

				if (item)
					self.change(item, false);

				try {

					ga('send', 'event', {
						eventCategory: 'Click em item de navegação',
						eventAction: 'click',
						eventLabel: this.href,
						eventValue: 101
					});

				} catch ( e ) {  }

			}

		};

		this.onPopStateCtrl = function (ev) {

			var item = self.queryNavigationItem(history.state.name);

			if (item)
				self.change(item, true);

			try {

				ga('send', 'event', {
					eventCategory: 'Ação de avançar ou voltar',
					eventAction: 'popstate',
					eventLabel: window.location.href,
					eventValue: 102
				});

			} catch ( e ) {  }

		};

	}

	Navigation.prototype.pushItem = function(item, pageViewport) {

		var navigationItem = new NavigationItem(item, pageViewport);

		if (navigationItem.isHome)
			this.home = navigationItem;

		this.navigationItems.push(navigationItem);

	};

	Navigation.prototype.matchURL = function(pageURL) {

		return !!window.location.href.match(new RegExp(pageURL, 'g'));

	};

	Navigation.prototype.queryCurrentPage = function () {

		for (var i = this.navigationItems.length; i--; )
			if (this.matchURL(this.navigationItems[i].url))
				return this.navigationItems[i];

		return this.home;

	};

	/**
	 * Build and return the new page title
	 * @param stateTitle {string|boolean}
	 * @return {*}
	 */
	Navigation.prototype.buildTitle = function(stateTitle) {

		if (this.title) {

			if (stateTitle) {

				if (this.title.defaultPostfix)
					return stateTitle + this.title.defaultPostfix;
				else if (this.title.defaultPrefix)
					return this.title.defaultPostfix + stateTitle;
				else
					return stateTitle;

			} else {

				return this.title.default;

			}

		} else {

			if (!stateTitle)
				return '';

		}

		return stateTitle;


	};

	/**
	 * Remove a state class to document element
	 * @param state {string}
	 */
	Navigation.prototype.removeDocumentState = function (state) {

		if (this.document.viewport)
			this.document.viewport.classList.remove(state);

	};

	/**
	 * Add a state class to document element
	 * @param state {string}
	 */
	Navigation.prototype.addDocumentState = function (state) {

		if (this.document.viewport)
			this.document.viewport.classList.add(state);

	};

	/**
	 * Get the new title and set it
	 * @param state {object}
	 */
	Navigation.prototype.setTitle = function (state) {

		if (state)
			document.title = this.buildTitle(state.title);

	};

	/**
	 * Set the current Page
	 * @param oldPage {object}
	 * @param newPage {object}
	 */
	Navigation.prototype.setCurrentPage = function (oldPage, newPage) {

		/* REMOVE OLD PAGE */

		for (var i = this.navigationItems.length; i--; ) {

			// remove stateClass from 'document' element
			if (this.navigationItems[i].stateClass)
				this.document.viewport.classList.remove(this.navigationItems[i].stateClass);

			// remove 'is-active' class from page
			this.navigationItems[i].page.setActive(false);

		}

		// if has oldPage
		if (oldPage) {

			// if oldPage has item
			if (oldPage.item) {

				// if has after action function, call this!
				if (oldPage.item.action)
					if (oldPage.item.action.after)
						oldPage.item.action.after(this);

			}

		}

		/* ADD NEW PAGE */

		// if has newPage
		if (newPage) {

			// if newPage has state
			if (newPage.state) {

				// add stateClass to 'document' element
				if (newPage.state.stateClass)
					this.document.viewport.classList.add(newPage.state.stateClass);

				// change title
				this.setTitle(newPage.state);

			}


			// if newPage has item
			if (newPage.item) {

				// if newPage has before action function, call this!
				if (newPage.item.action)
					if (newPage.item.action.before)
						newPage.item.action.before(this);

				// add 'is-active' class to page
				if (newPage.item.page)
					newPage.item.page.setActive(true);

			}

		}

		// plus one
		this.changePageCount++;

	};

	/**
	 * Set the current State
	 * @param state {object}
	 * @param replace {boolean}
	 */
	Navigation.prototype.setCurrentState = function (state, replace) {

		if (replace)
			history.replaceState(state, state.title, state.url);
		else
			history.pushState(state, state.title, state.url);

	};

	/**
	 * Change the current state/page
	 * Is based on a Navigation Item object
	 * The var 'isPop' defines the history 'change state' type (replace or push)
	 * @param item {object}
	 * @param isPop {boolean}
	 */
	Navigation.prototype.change = function (item, isPop) {

		var self = this;

		var oldPage = {};
		var newPage = {};

		newPage.item = item;
		newPage.state = new NavigationState(item);

		// Get the 'oldPage' based on 'current' attr or a 'query page' function
		if (this.current) {

			oldPage = this.current;

		} else {

			oldPage.item = this.queryCurrentPage();
			oldPage.state = history.state || false;

		}


		if (newPage.state) {

			this.setCurrentState(newPage.state, isPop);

			if (!isPop) {

				if (oldPage.state) {

					if (oldPage.state.name != newPage.state.name) {

						if (this.transition) {

							this.transition.start();

							setTimeout(function () {

								self.setCurrentPage(oldPage, newPage);

							}, 700);

						}

					} else {

						self.setCurrentPage(oldPage, newPage);

					}

				} else {

					self.setCurrentPage(oldPage, newPage);

				}


			} else {

				this.setCurrentPage(oldPage, newPage);

			}

		}

		this.current = newPage;

	};

	Navigation.prototype.queryNavigationItem = function(name) {

		for (var i = this.navigationItems.length; i--; )
			if (this.navigationItems[i].name == name)
				return this.navigationItems[i];

		return false;

	};

	Navigation.prototype.getTransition = function () {

		var transition = this.viewport.querySelector('.Transition');

		if (transition)
			this.transition = new Transition(transition, this);

	};

	Navigation.prototype.addListeners = function () {

		window.addEventListener('popstate', this.onPopStateCtrl, false);

		var navAnchors = this.document.viewport.querySelectorAll('.NavigationItem');

		for (var i = navAnchors.length; i--; )
			navAnchors[i].addEventListener('click', this.onNavigationItemClick, false);

	};

	Navigation.prototype.init = function() {

		this.addListeners();

		this.getTransition();

		// query the current page and change this
		// here we really start the page
		if (this.navigationItems.length)
			this.change(this.queryCurrentPage(), false);

	};

	return Navigation;

})();