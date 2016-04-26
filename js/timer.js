"use strict";
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