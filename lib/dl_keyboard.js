// Interface for keyboard functions.

class DLKbdMgr {
    /**
     * Enable/disable all triggers on the device.
     * @param {Boolean} enable Enable/disable all triggers.
     * @returns {Boolean} True if all triggers on the device have been successfully enabled/disabled.
     */
    enableTriggers(enable) { 
        return _DLKeyboardMgr.enableTriggers(enable); 
    }
}

const DLKeyboardMgr = new DLKbdMgr();