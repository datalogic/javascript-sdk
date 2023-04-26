// Interface for keyboard functions.

const DL_KEYBOARD_MGR_VER = 2;

class DLKbdMgr {
    /**
     * Private method to return an instance of DLKeyboardMgr.
     * @returns {DLKbdMgr} An instance of DLKbdMgr.
     * @throws {ReferenceError} If _DLKeyboardMgr is not injected by Datalogic Enterprise Browser.
     */
    #getDLKeybardMgr() {
        try {
            return _DLKeyboardMgr;
        } catch(e) {
            throw ReferenceError("_DLKeyboardMgr has not been injected by Datalogic Enterprise Browser");
        }
    }

    /**
     * Enable/disable all triggers on the device.
     * @param {boolean} enable Enable/disable all triggers.
     * @returns {boolean} True if all triggers on the device have been successfully enabled/disabled.
     */
    enableTriggers(enable) {
        return this.#getDLKeybardMgr().enableTriggers(enable);
    }
}

const DLKeyboardMgr = new DLKbdMgr();