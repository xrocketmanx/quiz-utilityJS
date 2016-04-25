"use strict";
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