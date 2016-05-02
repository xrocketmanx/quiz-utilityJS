"use strict";

/**
 * Scope of Quiz Library
 * @return {Quiz} 
 */
var Quiz = (function() {

	/**
	 * @class
	 * Quiz that has timer. After timeout or test end
	 * callback function is called. Changes questions
	 * @param {Array}    questions 
	 * @param {Number}   time      time for quiz timer in minutes
	 * @param {Function} callback  called after testing
	 * with questions answers as parameter
	 */
	function Quiz(questions, time, callback) {

		var quizNavigator = new QuizNavigator(questions);
		var docManipulator = new DocumentManipulator();
		var quizElements;
		var timer;

		/**
		 * Loads quiz DOM and bind handlers
		 */
		this.loadQuiz = function() {
			quizElements = docManipulator.loadQuizDOM(questions.length);
			bindHandlers();
			initTimer();
		};

		/**
		 * Starts quiz timer and loads first question
		 */
		this.startQuiz = function() {
			docManipulator.setActiveQuestion(0, 'add');
			docManipulator.loadQuestion(quizNavigator.getCurrent());
			timer.start();
		};

		function bindHandlers() { 
			var onNavClick = function() {
				moveDecorator(quizNavigator.setCursor, this.innerHTML - 1);
			};
			for (var i = 0; i < quizElements.nav.childNodes.length; i++) {
				quizElements.nav.childNodes[i].addEventListener('click', onNavClick);
			}

			quizElements.buttons.Next.addEventListener('click', moveNext); 

			quizElements.buttons.Skip.addEventListener('click', moveNextUnanswered); 

			quizElements.buttons.Previous.addEventListener('click', movePrev);

			quizElements.buttons.End.addEventListener('click', endQuiz);

			var askToEnd = true;
			quizElements.buttons.Answer.addEventListener('click', function() {
				saveAnswer();
				if (askToEnd) {
					if (!moveNextUnanswered()) {
						askToEnd = false;
						var message = "You have answered all questions. End test?";
						var choose = confirm(message);
						if (choose) {
							endQuiz();
							return;
						} 
						moveNext();
					}
				} else {
					moveNext();
				}
			}); 
		}

		function moveDecorator(moveFunction) {
			docManipulator.setActiveQuestion(quizNavigator.getCursor(), 'remove');

			var args = [];
			for (var i = 1; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			var success = moveFunction.call(quizNavigator, args);

			docManipulator.loadQuestion(quizNavigator.getCurrent());
			docManipulator.setActiveQuestion(quizNavigator.getCursor(), 'add');
			return success;
		}

		function moveNext() {
			moveDecorator(quizNavigator.next);
		}

		function moveNextUnanswered() {
			return moveDecorator(quizNavigator.nextUnanswered);
		}

		function movePrev() {
			moveDecorator(quizNavigator.prev);
		}

		function saveAnswer() {
			var question = quizNavigator.getCurrent();
			var answers = [];
			
			switch(question.type) {
				case 'single':
				case 'multiple': {
					for (var i = 0; i < question.options.length; i++) {
						var input = docManipulator.selectInput(i);
						if (input.checked) {
							answers.push(question.options[i]);
						}
					}
					break;
				}
				case 'field': {
					var input = docManipulator.selectInput();
					if (input.value) {
						answers.push(input.value);
					}
					break;
				}
			}

			if (answers.length > 0) {
				question.answers = answers;
				docManipulator.setAnsweredQuestion(quizNavigator.getCursor(), 'add');
			} else {
				question.answers = null;
				docManipulator.setAnsweredQuestion(quizNavigator.getCursor(), 'remove');
			}
		}

		function initTimer() {
			timer = new Timer(Timer.convertToSeconds(0, time, 0), function(seconds) {
				showTime(seconds);
			}, endQuiz);
		}

		function showTime(seconds) {
			var minutes = Timer.getMinutesFromTime(seconds)
				.toLocaleString('en-US', { minimumIntegerDigits: 2 });
			var secs = Timer.getSecondsFromTime(seconds)
				.toLocaleString('en-US', { minimumIntegerDigits: 2 });
			quizElements.timerForm.innerHTML = minutes + ':' + secs;
		}

		function endQuiz() {
			timer.stop();
			callback(questions);
		}
	}

	/**
	 * @class
	 * Loads DOM objects for quiz if they are ommited
	 * and manipulates DOM
	 */
	function DocumentManipulator() {

		var CLASSES = {
			FORM_CLASS: 'qu-form',
			TIMER_CLASS: 'qu-timer',
			NAV_CLASS: 'qu-nav',
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
		var INPUT_ID = "answer";

		var quizElements;

		/**
		 * Loads DOM objects for quiz except questions
		 * @param  {Number} questionsCount for navigation bar
		 */
		this.loadQuizDOM = function(questionsCount) {
			quizElements = {};
			var form = document.querySelector('.' + CLASSES.FORM_CLASS);

			quizElements.nav = loadNav(form, questionsCount);
			quizElements.timerForm = loadTimer(form);
			quizElements.main = loadMain(form);
			quizElements.buttons = loadButtons(form);

			return quizElements;
		};

		/**
		 * Loads Question in DOM
		 * @param  {Question} question 
		 */
		this.loadQuestion = function(question) {
			var questionForm = quizElements.main.question;
			questionForm.innerHTML = '';
			questionForm.appendChild(document.createTextNode(question.text));

			var optionsForm = quizElements.main.optionsForm;
			optionsForm.innerHTML = '';
			switch(question.type) {
				case 'multiple': {
					loadOptions(optionsForm, question, 'checkbox');
					break;
				}
				case 'single': {
					loadOptions(optionsForm, question, 'radio');
					break;
				}
				case 'field': {
					loadField(optionsForm, question);
				}
			}
		};

		/**
		 * Selects inputs on test form by index
		 * if its specified
		 * @param  {Number} index index of input
		 * @return {NodeElement}       input
		 */
		this.selectInput = function(index) {
			var form = quizElements.main.optionsForm;
			return index !== undefined ? 
				form.querySelector('#' + INPUT_ID + index) : form.querySelector('#' + INPUT_ID);
		}

		/**
		 * Sets nav of question active class
		 * @param {Number} questionIndex 
		 * @param {String} method 'add' or 'remove'        
		 */
		this.setActiveQuestion = function(questionIndex, method) {
			quizElements.nav.childNodes[questionIndex].classList[method]('active');
		}

		/**
		 * Sets nav of question answered class
		 * @param {Number} questionIndex 
		 * @param {String} method 'add' or 'remove'        
		 */
		this.setAnsweredQuestion = function(questionIndex, method) {
			quizElements.nav.childNodes[questionIndex].classList[method]('answered');
		}

		function loadOptions(form, question, type) {
			var options = question.options;
			for (var i = 0; i < options.length; i++) {
				var input = document.createElement('input');
				input.type = type;
				input.name = INPUT_ID;
				input.id = INPUT_ID + i;
				var label = document.createElement('label');
				label.htmlFor = INPUT_ID + i;
				label.appendChild(document.createTextNode(options[i]));
				form.appendChild(input);
				form.appendChild(label);
			}

			if (question.answers) {
				for (var i = 0; i < options.length; i++) {
					if (question.answers.indexOf(options[i]) >= 0) {
						var input = document.querySelector('#' + INPUT_ID + i); 
						input.checked = true;
					}
				}
			}
		}

		function loadField(form, question) {
			var input = document.createElement('input');
			input.type = 'text';
			input.id = INPUT_ID;
			input.name = INPUT_ID;
			form.appendChild(input);

			if (question.answers) {
				input.value = question.answers[0];
			}	
		}

		function loadNav(form, questionsCount) {
			var ul = document.querySelector('.' + CLASSES.NAV_CLASS);

			if (!ul) {
				ul = document.createElement('ul');
				ul.classList.add(CLASSES.NAV_CLASS);
				form.appendChild(ul);
			}

			for (var i = 0; i < questionsCount; i++) {
				var li = document.createElement('li');
				li.appendChild(document.createTextNode(i + 1));
				ul.appendChild(li);
			}

			return ul;
		}

		function loadTimer(form) {
			var timerForm = document.querySelector('.' + CLASSES.TIMER_CLASS);
			if (timerForm) return timerForm;

			timerForm = document.createElement('span');
			timerForm.classList.add(CLASSES.TIMER_CLASS);
			form.appendChild(timerForm);

			return timerForm;
		}

		function loadMain(form) {
			var main = {};

			var question = document.querySelector('.' + CLASSES.QUESTION_CLASS);
			if (!question) {
				question = document.createElement('p');
				question.classList.add(CLASSES.QUESTION_CLASS);
				form.appendChild(question);
			}

			var optionsForm = document.querySelector('.' + CLASSES.OPTIONS_CLASS);
			if (!optionsForm) {
				optionsForm = document.createElement('div');
				optionsForm.classList.add(CLASSES.OPTIONS_CLASS);
				form.appendChild(optionsForm);
			}

			main.question = question;
			main.optionsForm = optionsForm;
			return main;
		}

		function loadButtons(form) {
			var buttons = {};

			for (var key in CLASSES.BUTTON_CLASSES) {
				var button = document.querySelector('.' + CLASSES.BUTTON_CLASSES[key]);
				if (!button) {
					button = document.createElement('div');
					button.appendChild(document.createTextNode(key));
					button.classList.add(CLASSES.BUTTON_CLASSES[key]);
					form.appendChild(button);
				}
				buttons[key] = button;
			}

			return buttons;
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
			while (questions[cursor].answers) {
				if (questions[cursor] === current) {
					return false;
				}
				this.next();
			}
			return true;
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
	 * @class 
	 * Sets timer that will call action every
	 * second and give it current seconds and
	 * in the end calls callback;
	 * has time converting static methods
	 * @param {Number}   seconds  timeout in seconds
	 * @param {Function} action   actions every second
	 * @param {Function} callback actions in the end
	 */
	function Timer(seconds, action, callback) {
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
		 * Returns seconds of current Timer
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
	Timer.convertToSeconds = function(hours, minutes, seconds) {
		return hours * 3600 + minutes * 60 + seconds;
	};

	/**
	 * Gets seconds from time in seconds
	 * @param  {Number} seconds time in seconds
	 * @return {Number}         seconds
	 */
	Timer.getSecondsFromTime = function(seconds) {
		return seconds % 60;
	};

	/**
	 * Gets minutes from time in seconds
	 * @param  {Number} minutes time in seconds
	 * @return {Number}         minutes
	 */
	Timer.getMinutesFromTime = function(seconds) {
		return Math.floor(seconds / 60) % 60;
	};

	/**
	 * Gets hours from time in seconds
	 * @param  {Number} hours time in seconds
	 * @return {Number}       hours
	 */
	Timer.getHoursFromTime = function(seconds) {
		return Math.floor(seconds / 3600);
	};

	/**
	 * for Testing only
	 */
	Quiz.__testOnly__ = {
		navigator: QuizNavigator,
		timer: Timer
	};

	return Quiz;

})();



