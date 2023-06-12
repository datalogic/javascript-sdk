// Wait for HTML to load, then run JavaScript
window.addEventListener('DOMContentLoaded', () => {
	// Disable the scanned data passing to the ui button when it has focus.
	try {
		initProperties();

		document.getElementById("unlock").addEventListener("click", unlock);
		document.getElementById("lock").addEventListener("click", lock);
	} catch (e) {
		if (e instanceof ReferenceError && e.message.includes("_DLCradleMgr")) {
			console.error(e)
			console.log("ERROR: DLCradleMgr not injected. Barcode scanning functions may not work as expected.");
			alert("Error: DLCradleMgr not detected. SDK calls may not work as expected. For full functionality, use a Datalogic mobile scanner and the latest version of Enterprise Browser.");
		}
	}

	// Sets the status string for the page
	function setStatus(message) {
		document.getElementById('status').innerHTML = message;
	}

	function unlock() {
		if (document.getElementById("enableLed").checked) {
			DLCradleMgr.controlLock(LockAction.UNLOCK_WITH_LED_ON);
			setStatus("Unlocking with LED on");
		}
		else {
			DLCradleMgr.controlLock(LockAction.UNLOCK);
			setStatus("Unlocking with LED off");
		}
	}

	function lock() {
        if (document.getElementById("enableLed").checked) {
            DLCradleMgr.controlLock(LockAction.LOCK);
            setStatus("Locking with LED on");
        }
        else {
            DLCradleMgr.controlLock(LockAction.LOCK_WITH_LED_OFF);
            setStatus("Locking with LED off");
        }
	}

	// Sets the properties for the cradle
	function initProperties() {
		DLCradleMgr.controlLock(LockAction.LOCK);
	}
});