// Interface for keyboard functions.

const DL_KEYBOARD_MGR_VER = 1;

class DLKbdMgr {
    /**
     * Enable/disable all triggers on the device.
     * @param {boolean} enable Enable/disable all triggers.
     * @returns {boolean} True if all triggers on the device have been successfully enabled/disabled.
     */
    enableTriggers(enable) {
        return _DLKeyboardMgr.enableTriggers(enable);
    }
}

const DLKeyboardMgr = new DLKbdMgr();