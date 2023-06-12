// Wait for HTML to load, then run JavaScript
window.addEventListener('DOMContentLoaded', () => {
	// Disable the scanned data passing to the ui button when it has focus.
	try {
		initProperties();

		document.getElementById("on").addEventListener("click", ledOn);
		document.getElementById("off").addEventListener("click", ledOff);
		document.getElementById("blink-fast").addEventListener("click", blinkFast);
		document.getElementById("blink-slow").addEventListener("click", blinkSlow);
		document.getElementById("toggle").addEventListener("click", toggleLed);
	} catch (e) {
		if (e instanceof ReferenceError && e.message.includes("_DLCradleMgr")) {
			console.error(e)
			console.log("ERROR: DLCradleMgr not injected. Cradle functions may not work as expected.");
			alert("Error: DLCradleMgr not detected. SDK calls may not work as expected. For full functionality, use a Datalogic mobile scanner and the latest version of Enterprise Browser.");
		}
	}

	// Sets the status string for the page
	function setStatus(message) {
		document.getElementById('status').innerHTML = message;
	}

	function ledOff() {
        if (DLCradleMgr.controlLed(LedAction.LED_OFF)) {
            setStatus("Turning off LED");
        }
        else {
            setStatus("Error: Could not turn LED off");
        }
	}

	function ledOn() {
        if (DLCradleMgr.controlLed(LedAction.LED_ON)) {
            setStatus("Turning LED on");
        }
        else {
            setStatus("Error: Could not turn LED on");
        }
	}

	function blinkFast() {
        if (DLCradleMgr.controlLed(LedAction.BLINK_FAST)) {
            setStatus("Set LED to blink fast");
        }
        else {
            setStatus("Error: Could not set LED to blink fast");
        }
	}

	function blinkSlow() {
        if (DLCradleMgr.controlLed(LedAction.BLINK_SLOW)) {
            setStatus("Set LED to blink slow");
        }
        else {
            setStatus("Error: Could not set LED to blink slow");
        }
	}

	function toggleLed() {
        if (DLCradleMgr.controlLed(LedAction.TOGGLE)) {
            setStatus("LED toggled");
        }
        else {
            setStatus("Error: Could not toggle LED");
        }
	}

	// Sets the properties for the cradle
	function initProperties() {
		DLCradleMgr.controlLed(LedAction.LED_OFF);
	}
});