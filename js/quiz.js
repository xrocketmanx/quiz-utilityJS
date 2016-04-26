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

	this.loadQuiz = function() {
		quizDOMLoader.loadQuizDOM(questions.length);
		bindHandlers();
	};

	this.startQuiz = function() {

	};

	function bindHandlers() {

	}
}