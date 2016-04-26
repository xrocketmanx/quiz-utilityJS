var assert = chai.assert;

describe('Timer', function() {

	describe('convertToSeconds', function() {
		it('should convert 2h 5m 3s correctly', function() {
			assert.equal(Timer.convertToSeconds(2, 5, 3), 7503);
		});
	});

	describe('getSecondsFromTime', function() {
		it('should get seconds correctly', function() {
			assert.equal(Timer.getSecondsFromTime(130), 10);
		});
		it('should get 0 if no seconds in time', function() {
			assert.equal(Timer.getSecondsFromTime(120), 0);
		});
	});

	describe('getMinutesFromTime', function() {
		it('should get minutes correctly', function() {
			assert.equal(Timer.getMinutesFromTime(130), 2);
		});
		it('should get 0 if no minutes in time', function() {
			assert.equal(Timer.getMinutesFromTime(3600), 0);
		});
	});

	describe('getHoursFromTime', function() {
		it('should get hours correctly', function() {
			assert.equal(Timer.getHoursFromTime(3700), 1);
		});
		it('should get 0 if no hours in time', function() {
			assert.equal(Timer.getHoursFromTime(3500), 0);
		});
	});

	describe('Timer', function() {
		var timer = new Timer();

		describe('start', function() {
			it('should start timeout of 1s correctly', function(done) {
				this.timeout(5000);
				timer.start(1, function() {} , function() {
					assert.equal(timer.getSeconds(), 0);
					done();
				});
			});

			it('should restart timeout in 0.1s correctly', function(done) {
				this.timeout(5000);
				timer.start(1, function() {}, function() {
					assert.equal(timer.getSeconds(), 0);
					done();
				});
				setTimeout(function() {
					timer.stop();
					assert.equal(timer.getSeconds(), 1);
					timer.start();
				}, 100);
			});

		});

		describe('stop', function() {
			it('should stop timeout in 0.1s correctly', function(done) {
				this.timeout(5000);
				timer.start(1, function() {}, function() {
					assert.equal(timer.getSeconds(), 0);
				});
				setTimeout(function() {
					timer.stop();
					assert.equal(timer.getSeconds(), 1);
					done();
				}, 100);
			});
		});

		describe('continue', function() {
			it('should continue timeout of 1s correctly', function(done) {
				this.timeout(5000);
				timer.start(1, function() {}, function() {
					assert.equal(timer.getSeconds(), 0);
					done();
				});
				timer.stop();
				assert.equal(timer.getSeconds(), 1);
				timer.continue();
			});
		});
	});
});