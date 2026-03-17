// Interface for keyboard functions.

const DL_KEYBOARD_MGR_VER = 5;

class DLKbdMgr {
	/**
	 * Internal method to return an instance of DLKeyboardMgr.
	 * @returns {DLKbdMgr} An instance of DLKbdMgr.
	 * @throws {ReferenceError} If _DLKeyboardMgr is not injected by Datalogic Enterprise Browser.
	 */
	getDLKeyboardMgr() {
		try {
			return _DLKeyboardMgr;
		} catch(e) {
			throw ReferenceError("_DLKeyboardMgr has not been injected by Datalogic Enterprise Browser");
		}
	}

	/**
	 * Enable/disable all physical triggers on the device.
	 * @param {boolean} enable Enable/disable all physical triggers.
	 * @returns {boolean} True if all physical triggers on the device have been successfully enabled/disabled.
	 */
	enableTriggers(enable) {
		return this.getDLKeyboardMgr().enableTriggers(enable);
	}

	/**
	 * Show/Hide the soft keyboard.
	 * @param {boolean} show Set to true to show, false to hide the keyboard.
	 * @returns {boolean} True if the keyboard operation was accepted.
	 */
	showSoftKeyboard(show) {
		return this.getDLKeyboardMgr().showSoftKeyboard(show);
	}
}

const DLKeyboardMgr = new DLKbdMgr();