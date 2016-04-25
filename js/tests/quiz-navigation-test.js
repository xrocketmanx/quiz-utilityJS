"use strict";
var assert = chai.assert;
describe('QuizNavigator', function() {
	var questions = [{q:'q1'}, {q:'q2'}, {q:'q3'}, {q:'q4'}];
	var quizNavigator = new QuizNavigator(questions);

	describe('getCurrent', function() {
		it('should get first question when navigator initialized', function() {
			assert.equal(quizNavigator.getCurrent().q, 'q1');
		});
	});

	describe('getCursor', function() {
		it('should return 0 when navigator initialized', function() {
			assert.equal(quizNavigator.getCursor(), 0);
		});
	});

	describe('setCursor', function() {
		it('should set cursor to 1', function() {
			quizNavigator.setCursor(1);
			assert.equal(quizNavigator.getCursor(), 1);
		});

		it('should set cursor to 0 when set to negative num = -length', function() {
			quizNavigator.setCursor(-questions.length);
			assert.equal(quizNavigator.getCursor(), 0);
		});
	});

	describe('next', function() {
		it('should move to question 2 after navigator initialized', function() {
			quizNavigator.next();
			assert.equal(quizNavigator.getCursor(), 1);
		});

		it('should move to first question if current is last question', function() {
			quizNavigator.setCursor(questions.length - 1);
			quizNavigator.next();
			assert.equal(quizNavigator.getCursor(), 0);
		});
	});

	describe('prev', function() {
		it('should move to question 1 from question 2', function() {
			quizNavigator.setCursor(1);
			quizNavigator.prev();
			assert.equal(quizNavigator.getCursor(), 0);
		});

		it('should move to last question if current is first question', function() {
			quizNavigator.setCursor(0);
			quizNavigator.prev();
			assert.equal(quizNavigator.getCursor(), questions.length - 1);
		});
	});

	describe('nextUnanswered', function() {
		it('should move from question 1 to question 3 if its only unanswered', function() {
			for (var i = 0; i < questions.length; i++) {
				if (i !== 2) {
					questions[i].answers = 'a';
				}
			}
			quizNavigator.setCursor(0);
			quizNavigator.nextUnanswered();
			assert.equal(quizNavigator.getCursor(), 2);
		});

		it('should stay at current question if it is only unanswered', function() {
			quizNavigator.nextUnanswered();
			assert.equal(quizNavigator.getCursor(), 2);
		});

		it('should move from last question to question 3 if its only unanswered', function() {
			quizNavigator.setCursor(questions.length - 1);
			quizNavigator.nextUnanswered();
			assert.equal(quizNavigator.getCursor(), 2);
		});
	});
});