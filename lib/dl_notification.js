// Interface for notification functions.

const DL_NOTIFICATION_MGR_VER = 1;

class DLNotifMgr {
	/**
	 * Internal method to return an instance of DLNotificationMgr.
	 * @returns {DLNotifMgr} An instance of DLNotifMgr.
	 * @throws {ReferenceError} If _DLNotificationMgr is not injected by Datalogic Enterprise Browser.
	 */
	getDLNotificationMgr() {
		try {
			return _DLNotificationMgr;
		} catch(e) {
			throw ReferenceError("_DLNotificationMgr has not been injected by Datalogic Enterprise Browser");
		}
	}

	/**
	 * Check if the device has a vibrator.
	 * @returns {boolean} True if the device has vibration hardware.
	 */
	hasVibrator() {
		return this.getDLNotificationMgr().hasVibrator();
	}

	/**
	 * Vibrate the device for the specified duration in milliseconds.
	 * @param {number} durationMs Duration in milliseconds.
	 * @returns {boolean} True if vibration was started successfully.
	 */
	vibrate(durationMs) {
		return this.getDLNotificationMgr().vibrate(durationMs);
	}

	/**
	 * Vibrate the device with a pattern.
	 * @param {string} pattern Comma-separated list of durations (wait,vibrate,wait,vibrate,...).
	 * @param {number} repeat Index into pattern to repeat from, or -1 for no repeat.
	 * @returns {boolean} True if vibration pattern was started successfully.
	 */
	vibratePattern(pattern, repeat) {
		return this.getDLNotificationMgr().vibratePattern(pattern, repeat);
	}

	/**
	 * Cancel any ongoing vibration.
	 * @returns {boolean} True if cancel was successful.
	 */
	vibrateCancel() {
		return this.getDLNotificationMgr().vibrateCancel();
	}
}

const DLNotificationMgr = new DLNotifMgr();

