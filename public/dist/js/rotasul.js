/*!
 * Mowe {ProjectName} Project v0.0.0 (http://letsmowe.org/)
 * Copyright 2013-2015 Mowe Developers
 * Licensed under MIT (https://github.com/mowekabanas/base/blob/master/LICENSE)
*/



	/* Contact */

	/* Contact email manipulation */

	var formSentCount = 0;
	var formSentCountLimit = 2;

	var requestURL = 'http://service.elbit.com.br/mailman/rotasul/';
	var formLocked = false;

	var form = {
		viewport: document.getElementById('cForm')
	};

	form.fields = {};
	form.sendButton = {};

	form.fields.cName = document.getElementById('cName');
	// form.fields.cCity = document.getElementById('cCity');
	// form.fields.cAddress = document.getElementById('cAddress');
	form.fields.cPhone = document.getElementById('cPhone');
	form.fields.cEmail = document.getElementById('cEmail');
	form.fields.cMessage = document.getElementById('cMessage');
	form.sendButton.viewport = document.getElementById('cSubmit');

	form.states = [
		'is-error',
		'is-fail',
		'is-sending',
		'is-success'
	];

	form.changeState = function (state) {

		if (form.viewport) {

			for (var i = form.states.length; i--; )
				form.viewport.classList.remove(form.states[i])

			form.viewport.classList.add(state);

		}

	};

	// send the ajax request
	form.sendRequest = function(requestData) {

		if (requestData) {

			// vanilla js
			var xhr = new XMLHttpRequest();

			// "beforeSend"
			formLocked = true;
			form.changeState('is-sending');

			xhr.ontimeout = function (e) {
				console.log(e);
				form.changeState('is-fail');
			};

			xhr.onerror = function() {
				form.changeState('is-error');
				//form.send(requestData, 5000);
			};

			xhr.onreadystatechange = function(e) {

				if (xhr.readyState == 4) {

					if (xhr.status == 200) {
						console.log(xhr.responseText);
						form.changeState('is-success');
					} else {
						form.changeState('is-error');
					}

				}

				formLocked = false;

			};

			xhr.withCredentials = true;
			xhr.open('GET', requestURL + "?" + form.requestParams(requestData), true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.timeout = 12000;

			xhr.send(null);

		}

	};

	// transform object into uri string
	form.requestParams = function (requestData) {

		var y = '', e = encodeURIComponent;

		for (var x in requestData) {
			y += '&' + e(x) + '=' + e(requestData[x]);
		}

		//&_t= ==> equals to cache: false;
		return y.slice(1) + '&_t=' + new Date().getTime();

	};

	// control the time delay to init the ajax request
	form.send = function(requestData, delay) {

		if (requestData) {

			if (delay) {
				setTimeout(function() {
					form.sendRequest(requestData);
				}, delay)
			} else {
				form.sendRequest(requestData);
			}

		}

	};

	// form submit button listener
	form.sendButton.viewport.addEventListener('click', function (ev) {

		ev.preventDefault();

		if (!formLocked) {

			if (formSentCount < formSentCountLimit) {

				var allow = !!(form.fields.cName.value && (form.fields.cPhone.value || form.fields.cEmail.value) && form.fields.cMessage.value);

				if (allow) {

					// lock the form
					formLocked = true;

					// count the request
					formSentCount++;

					// get object data
					var requestData = {
						cName: form.fields.cName.value,
						cPhone: form.fields.cPhone.value,
						cEmail: form.fields.cEmail.value,
						cAddress: "",
						cCity: "",
						cMessage: form.fields.cMessage.value
					};

					// send
					form.send(requestData, false);

				} else {
					form.changeState('is-error');
				}

			}

		}

	});

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

/* Required fields */

var RequiredField = (function () {

	/**
	 * Required Field constructor
	 * @constructor
	 */
	function RequiredField(viewport, fieldClass) {

		var self = this;

		this.viewport = viewport;

		this.input = {};
		this.fieldClass = fieldClass;

		this.onClick = function () {

			try {

				self.input.viewport.focus();

			} catch ( e ) { }

		};

		this.onFocus = function () {

			self.viewport.classList.add('has-focus');

			if (self.input.viewport.value)
				self.viewport.classList.remove('is-empty');

		};

		this.onBlur = function () {

			self.viewport.classList.remove('has-focus');

			if (!self.input.viewport.value)
				self.viewport.classList.add('is-empty');
			else
				self.viewport.classList.remove('is-empty');

		};

		this.onInput = function () {

			if (self.input.viewport.value) {
				self.viewport.classList.remove('is-empty');
				self.viewport.classList.add('has-label');
				self.viewport.classList.add('is-valid');
			} else {
				self.viewport.classList.remove('has-label');
				self.viewport.classList.remove('is-valid');
			}

		};

		if (this.viewport)
			this.init();

	}

	/**
	 * Normalize
	 */
	RequiredField.prototype.normalize = function () {

		if (this.input.viewport.value)
			this.viewport.classList.add('has-label');

	};

	/**
	 * Add the listeners
	 * It support IE8
	 */
	RequiredField.prototype.addListeners = function () {

		try {

			this.viewport.addEventListener('click', this.onClick, false);

			this.input.viewport.addEventListener('focus', this.onFocus, false);
			this.input.viewport.addEventListener('blur', this.onBlur, false);
			this.input.viewport.addEventListener('input', this.onInput, false);

		} catch ( e ) {	}

	};

	/**
	 * Get the input element
	 * @return {boolean}
	 */
	RequiredField.prototype.getInputElement = function () {

		this.input.viewport = this.viewport.querySelector(this.fieldClass);

		return !!this.input.viewport;

	};

	/**
	 * Init the instance
	 */
	RequiredField.prototype.init = function () {

		if (this.getInputElement())
			this.addListeners();

		this.normalize();

	};

	return RequiredField;

})();