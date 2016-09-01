/*!
 * Mowe {ProjectName} Project v0.0.0 (http://letsmowe.org/)
 * Copyright 2013-2015 Mowe Developers
 * Licensed under MIT (https://github.com/mowekabanas/base/blob/master/LICENSE)
*/



/* Contact */

var Contact = (function () {

	/**
	 * Contact constructor
	 * @constructor
	 */
	function Contact() {

		/* Contact email manipulation */

		var formSentCount = 0;
		var formSentCountLimit = 2;

		var requestURL = 'http://mailman.letsmowe.com/citodon/';
		var formLocked = false;

		var form = {
			viewport: document.getElementById('cForm')
		};

		form.fields = {};
		form.sendButton = {};

		form.fields.cName = document.getElementById('cName');
		form.fields.cCity = document.getElementById('cCity');
		form.fields.cPhone = document.getElementById('cPhone');
		form.fields.cEmail = document.getElementById('cEmail');
		form.fields.cMessage = document.getElementById('cMessage');
		form.sendButton.viewport = document.getElementById('cSubmit');
		// form.fields.cAddress = document.getElementById('cAddress');

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

				// ajax request
				$.ajax({
					cache: false,
					crossDomain: true,
					data: requestData,
					method: 'get',
					beforeSend: function() {
						formLocked = true;
						form.changeState('is-sending');
					},
					error: function (data) {
						console.log(data);
						form.changeState('is-fail');
						form.send(requestData, 5000);
					},
					success: function (data) {
						console.log(data);
						if (data.sent)
							form.changeState('is-success');
						else
							form.changeState('is-error');
						formLocked = false;
					},
					timeout: 12000,
					url: requestURL
				});

			}

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

					var allow = !!(form.fields.cName.value && (form.fields.cPhone.value || form.fields.cEmail.value) && form.fields.cCity.value && form.fields.cMessage.value);

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
							cCity: form.fields.cCity.value,
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

	}

	return Contact;

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