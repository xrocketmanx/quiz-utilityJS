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
		var nextBtn = document.querySelector('.qu-btn-next');
		nextBtn.addEventListener('click', function() {
			quizNavigator.next();
			quizDOMLoader.loadQuestion(quizNavigator.getCurrent());
		}); 

		var skipBtn = document.querySelector('.qu-btn-skip');
		skipBtn.addEventListener('click', function() {
			quizNavigator.nextUnanswered();
			quizDOMLoader.loadQuestion(quizNavigator.getCurrent());
		}); 

		var prevBtn = document.querySelector('.qu-btn-previous');
		prevBtn.addEventListener('click', function() {
			quizNavigator.prev();
			quizDOMLoader.loadQuestion(quizNavigator.getCurrent());
		});

		var nav = document.querySelector('.qu-nav'); 
		var onNavClick = function() {
			quizNavigator.setCursor(this.innerHTML - 1);
			quizDOMLoader.loadQuestion(quizNavigator.getCurrent());
		};
		for (var i = 0; i < nav.childNodes.length; i++) {
			nav.childNodes[i].addEventListener('click', onNavClick);
		}
	}
}