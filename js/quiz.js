"use strict";

/**
 * @class
 * Quiz that has timer. After timeout or test end
 * callback function is called. Changes questions
 * @param {Array}    questions 
 * @param {Number}   time      time for quiz timer
 * @param {Function} callback  called after testing
 * with questions answers as parameter
 */
function Quiz(questions, time, callback) {

	var quizNavigator = new QuizNavigator(questions);
	var quizDOMLoader = new QuizDOMLoader();

	/**
	 * Loads quiz DOM and bind handlers
	 */
	this.loadQuiz = function() {
		quizDOMLoader.loadQuizDOM(questions.length);
		bindHandlers();
	};

	/**
	 * Starts quiz timer and loads first question
	 */
	this.startQuiz = function() {
		quizDOMLoader.loadQuestion(quizNavigator.getCurrent());
	};

	function bindHandlers() {
		var nav = document.querySelector('.' + Quiz.CLASSES.NAV_CLASS); 
		var onNavClick = function() {
			quizNavigator.setCursor(this.innerHTML - 1);
			quizDOMLoader.loadQuestion(quizNavigator.getCurrent());
		};
		for (var i = 0; i < nav.childNodes.length; i++) {
			nav.childNodes[i].addEventListener('click', onNavClick);
		}

		var nextBtn = document.querySelector('.' + Quiz.CLASSES.BUTTON_CLASSES.Next);
		nextBtn.addEventListener('click', function() {
			quizNavigator.next();
			quizDOMLoader.loadQuestion(quizNavigator.getCurrent());
		}); 

		var skipBtn = document.querySelector('.' + Quiz.CLASSES.BUTTON_CLASSES.Skip);
		skipBtn.addEventListener('click', function() {
			quizNavigator.nextUnanswered();
			quizDOMLoader.loadQuestion(quizNavigator.getCurrent());
		}); 

		var prevBtn = document.querySelector('.' + Quiz.CLASSES.BUTTON_CLASSES.Previous);
		prevBtn.addEventListener('click', function() {
			quizNavigator.prev();
			quizDOMLoader.loadQuestion(quizNavigator.getCurrent());
		});

		var answerBtn = document.querySelector('.' + Quiz.CLASSES.BUTTON_CLASSES.Answer);
		answerBtn.addEventListener('click', function() {

		}); 
	}
}

Quiz.CLASSES = {
	FORM_CLASS: 'qu-form',
	NAV_CLASS: 'qu-nav',
	MAIN_CLASS: 'qu-main',
	QUESTION_CLASS: 'qu-question',
	OPTIONS_CLASS: 'qu-options',
	BUTTON_CLASSES: {
		'Previous': 'qu-btn-previous',
		'Skip': 'qu-btn-skip',
		'Answer': 'qu-btn-answer',
		'Next': 'qu-btn-next',
		'End': 'qu-btn-end'
	}
};

/**
 * @class
 * Loads DOM objects for quiz if they are ommited
 */
function QuizDOMLoader() {

	/**
	 * Loads DOM objects for quiz except questions
	 * @param  {Number} questionsCount for navigation bar
	 */
	this.loadQuizDOM = function(questionsCount) {
		var form = document.querySelector('.' + Quiz.CLASSES.FORM_CLASS);
		loadNav(form, questionsCount);
		loadMain(form);
		loadButtons(form);
	};

	/**
	 * Loads Question in DOM
	 * @param  {Question} question 
	 */
	this.loadQuestion = function(question) {
		var p = document.querySelector('.' + Quiz.CLASSES.QUESTION_CLASS);
		p.innerHTML = '';
		p.appendChild(document.createTextNode(question.text));

		var optionsForm = document.querySelector('.' + Quiz.CLASSES.OPTIONS_CLASS);
		optionsForm.innerHTML = '';
		switch(question.type) {
			case 'multiple': {
				loadOptions(optionsForm, question.options, 'checkbox');
				break;
			}
			case 'single': {
				loadOptions(optionsForm, question.options, 'radio');
				break;
			}
		}
	};

	function loadOptions(form, options, type) {
		for (var i = 0; i < options.length; i++) {
			var input = document.createElement('input');
			input.type = type;
			input.name = 'answer';
			input.id = 'answer' + i;
			var label = document.createElement('label');
			label.htmlFor = 'answer' + i;
			label.appendChild(document.createTextNode(options[i]));
			form.appendChild(input);
			form.appendChild(label);
		}
	}

	function loadNav(form, questionsCount) {
		if (document.querySelector('.' + Quiz.CLASSES.NAV_CLASS)) return;

		var ul = document.createElement('ul');
		ul.classList.add(Quiz.CLASSES.NAV_CLASS);
		for (var i = 0; i < questionsCount; i++) {
			var li = document.createElement('li');
			li.appendChild(document.createTextNode(i + 1));
			ul.appendChild(li);
		}
		form.appendChild(ul);
	}

	function loadMain(form) {
		if (document.querySelector('.' + Quiz.CLASSES.MAIN_CLASS)) return;

		var main = document.createElement('div');
		main.classList.add(Quiz.CLASSES.MAIN_CLASS);
		var question = document.createElement('p');
		question.classList.add(Quiz.CLASSES.QUESTION_CLASS);
		main.appendChild(question);
		var optionsForm = document.createElement('div');
		optionsForm.classList.add(Quiz.CLASSES.OPTIONS_CLASS);
		main.appendChild(optionsForm);
		form.appendChild(main);
	}

	function loadButtons(form) {
		if (document.querySelector('[class^=qu-btn-]')) return;

		for (var key in Quiz.CLASSES.BUTTON_CLASSES) {
			var button = document.createElement('div');
			button.appendChild(document.createTextNode(key));
			button.classList.add(Quiz.CLASSES.BUTTON_CLASSES[key]);
			form.appendChild(button);
		}
	}
}

/**
 * @class 
 * Navigates through the questions using
 * cursor(index of current question)
 * @param {Array} questions Array of questions
 */
function QuizNavigator(questions) {
	var length = questions.length;
	var cursor = 0;

	/**
	 * Returns current question
	 * @return {Question}
	 */
	this.getCurrent = function() {
		return questions[cursor];
	};

	/**
	 * Moves to next question.
	 * If next question doesnt exists
	 * moves to first question.
	 */
	this.next = function() {
		cursor = (cursor + 1) % length;
	};

	/**
	 * Moves to next unanswered question.
	 * Based on existing user's answers on
	 * questions.
	 */
	this.nextUnanswered = function() {
		var current = questions[cursor];
		this.next();
		while (questions[cursor] !== current && questions[cursor].answers) {
			this.next();
		}
	};

	/**
	 * Movers to previous question.
	 * If previous question doesnt exist
	 * moves to last question
	 */
	this.prev = function() {
		cursor = cursor - 1 < 0 ? length - 1 : cursor - 1;
	};

	/**
	 * Sets cursor position. Can be negative
	 * @param {Number} index new cursor position
	 */
	this.setCursor = function(index) {
		cursor = index < 0 ? length + index : index % length;
	};

	/**
	 * Returns cursor
	 * @return {Number}
	 */
	this.getCursor = function() {
		return cursor;
	};
}

/**
 * Sets timer that will call action every
 * second and give it current seconds and
 * in the end calls callback;
 * has time converting static methods
 * @class
 * @param {Number}   seconds  timeout in seconds
 * @param {Function} action   actions every second
 * @param {Function} callback actions in the end
 */
function QuizTimer(seconds, action, callback) {
	var interval;
	var initialSeconds = seconds;

	/**
	 * Starts timer or restarts if arguments are ommited
	 * (all parameters are optional)
	 * @param  {Number} _seconds  timeout in seconds
	 * @param  {Function} _action   action every second
	 * @param  {Function} _callback actions in the end
	 */
	this.start = function(_seconds, _action, _callback) {
		if (_seconds) {
			initialSeconds = _seconds;
		}
		if (_action) {
			action = _action;
		}
		if (_callback) {
			callback = _callback;
		}
		seconds = initialSeconds;
		start();
	};

	/**
	 * Continues timer execution
	 */
	this.continue = function() {
		start();
	};

	/**
	 * Stops execution of timer
	 */
	this.stop = function() {
		if (interval) {
			clearInterval(interval);
		}
	};

	/**
	 * Returns seconds of current QuizTimer
	 * state
	 * @return {Number} seconds
	 */
	this.getSeconds = function() {
		return seconds;
	}

	/**
	 * Sets timeout in seconds
	 * @param {Number} _seconds timeout
	 */
	this.setTimeout = function(_seconds) {
		initialSeconds = _seconds;
	}

	function start() {
		action(seconds);
		interval = setInterval(function() {
			action(--seconds);
			if (seconds === 0) {
				clearInterval(interval);
				if (callback) callback();
				return;
			}
		}, 1000);
	};
}

/**
 * Convert time to seconds
 * @param  {Number} hours   
 * @param  {Number} minutes 
 * @param  {Number} seconds 
 * @return {Number}         time in seconds
 */
QuizTimer.convertToSeconds = function(hours, minutes, seconds) {
	return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Gets seconds from time in seconds
 * @param  {Number} seconds time in seconds
 * @return {Number}         seconds
 */
QuizTimer.getSecondsFromTime = function(seconds) {
	return seconds % 60;
};

/**
 * Gets minutes from time in seconds
 * @param  {Number} minutes time in seconds
 * @return {Number}         minutes
 */
QuizTimer.getMinutesFromTime = function(seconds) {
	return Math.floor(seconds / 60) % 60;
};

/**
 * Gets hours from time in seconds
 * @param  {Number} hours time in seconds
 * @return {Number}       hours
 */
QuizTimer.getHoursFromTime = function(seconds) {
	return Math.floor(seconds / 3600);
};