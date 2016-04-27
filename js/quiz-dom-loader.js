"use strict";

/**
 * @class
 * Loads DOM objects for quiz if they are ommited
 */
function QuizDOMLoader() {

	var FORM_CLASS = 'qu-form';
	var NAV_CLASS = 'qu-nav';
	var MAIN_CLASS = 'qu-main';
	var QUESTION_CLASS = 'qu-question';
	var BUTTON_CLASS = 'qu-btn-';
	var BUTTON_TYPES = ['previous', 'skip', 'answer', 'next', 'end'];

	/**
	 * Loads DOM objects for quiz except questions
	 * @param  {Number} questionsCount for navigation bar
	 */
	this.loadQuizDOM = function(questionsCount) {
		var form = document.getElementsByClassName(FORM_CLASS)[0];
		loadNav(form, questionsCount);
		loadMain(form);
		loadButtons(form);
	};

	/**
	 * Loads Question in DOM
	 * @param  {Question} question 
	 */
	this.loadQuestion = function(question) {
		var main = document.getElementsByClassName(MAIN_CLASS)[0];
		main.innerHTML = '';
		var p = document.createElement('p');
		p.classList.add(QUESTION_CLASS);
		p.appendChild(document.createTextNode(question.text));
		main.appendChild(p);
		switch(question.type) {
			case 'multiple': {
				loadOptions(main, question.options, 'checkbox');
				break;
			}
			case 'single': {
				loadOptions(main, question.options, 'radio');
				break;
			}
		}
	};

	function loadOptions(main, options, type) {
		for (var i = 0; i < options.length; i++) {
			var input = document.createElement('input');
			input.type = type;
			input.name = 'answer';
			input.id = 'answer' + i;
			var label = document.createElement('label');
			label.htmlFor = 'answer' + i;
			label.appendChild(document.createTextNode(options[i]));
			main.appendChild(input);
			main.appendChild(label);
		}
	}

	function loadNav(form, questionsCount) {
		if (document.querySelector('.' + NAV_CLASS)) return;

		var ul = document.createElement('ul');
		ul.classList.add(NAV_CLASS);
		for (var i = 0; i < questionsCount; i++) {
			var li = document.createElement('li');
			li.appendChild(document.createTextNode(i + 1));
			ul.appendChild(li);
		}
		form.appendChild(ul);
	}

	function loadMain(form) {
		if (document.querySelector('.' + MAIN_CLASS)) return;

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