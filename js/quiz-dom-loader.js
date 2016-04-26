"use strict";

/**
 * @class
 * Loads DOM objects for quiz if they are ommited
 */
function QuizDOMLoader() {

	var FORM_CLASS = 'qu-form';
	var NAV_CLASS = 'qu-nav';
	var MAIN_CLASS = 'qu-main';
	var BUTTON_CLASS = 'qu-btn-';
	var BUTTON_TYPES = ['previous', 'skip', 'answer', 'next', 'end'];

	this.loadQuizDOM = function(questionsCount) {
		var form = document.getElementsByClassName(FORM_CLASS)[0];
		loadNav(form, questionsCount);
		loadMain(form);
		loadButtons(form);
	}

	this.loadQuestion = function(question) {

	}

	function loadNav(form, questionsCount) {
		if (document.getElementsByClassName(NAV_CLASS).length > 0) return;

		var nav = document.createElement('nav');
		nav.classList.add(NAV_CLASS);
		var ul = document.createElement('ul');
		nav.appendChild(ul);
		for (var i = 0; i < questionsCount; i++) {
			var li = document.createElement('li');
			li.appendChild(document.createTextNode(i + 1));
			ul.appendChild(li);
		}
		form.appendChild(nav);
	}

	function loadMain(form) {
		if (document.getElementsByClassName(MAIN_CLASS).length > 0) return;

		var main = document.createElement('div');
		main.classList.add(MAIN_CLASS);
		form.appendChild(main);
	}

	function loadButtons(form) {
		if (document.querySelector('[class^=' + BUTTON_CLASS + ']')) return;

		for (var i = 0; i < BUTTON_TYPES.length; i++) {
			var button = document.createElement('div');
			button.appendChild(document.createTextNode(capitalizeFirst(BUTTON_TYPES[i])));
			button.classList.add(BUTTON_CLASS + BUTTON_TYPES[i]);
			form.appendChild(button);
		}
	}

	function capitalizeFirst(str) {
		return str[0].toUpperCase() + str.slice(1);
	}
}