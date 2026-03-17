// Wait for HTML to load, then run JavaScript
window.addEventListener('DOMContentLoaded', () => {
	// Check if barcode scanner is detected
	try {
		// If the scanner is not available then display a warning message.
		initProperties();

		document.getElementById("disabled").onfocus = disableTrigsHelper;
		document.getElementById("disabled").onblur = enableTrigsHelper;
		document.getElementById("softkb_show").onclick = function () {
			setSoftKeyboard(true);
		};
		document.getElementById("softkb_hide").onclick = function () {
			setSoftKeyboard(false);
		};
	} catch (e) {
		if (e instanceof ReferenceError && e.message.includes("_DLKeyboardMgr")) {
			console.error(e)
			console.log("ERROR: DLKeyboardMgr not injected. Barcode scanning functions may not work as expected.");
			alert("Error: DLKeyboardMgr not detected. SDK calls may not work as expected. For full functionality, use a Datalogic mobile scanner and the latest version of Enterprise Browser.");
		}
		if (e instanceof ReferenceError && e.message.includes("_DLBarcodeMgr")) {
			console.error(e)
			console.log("ERROR: DLBarcodeMgr not injected. Barcode scanning functions may not work as expected.");
			alert("Error: DLBarcodeMgr not detected. SDK calls may not work as expected. For full functionality, use a Datalogic mobile scanner and the latest version of Enterprise Browser.");
		}
	}

	// Event assignable helper to enable triggers
	function enableTrigsHelper() {
		enableTrigs(true);
	}

	// Event assignable helper to disable triggers
	function disableTrigsHelper() {
		enableTrigs(false);
	}

	// Sets the trigger status for the page.
	function setTriggerStatus(message) {
		document.getElementById('trig_status').innerHTML = message;
	}

	// Enables triggers
	function enableTrigs(enable) {
		if (DLKeyboardMgr.enableTriggers(enable)) {
			if (enable) {
				setTriggerStatus("Triggers enabled.");
			}
			else {
				setTriggerStatus("Triggers disabled.");
			}
		}
		else {
			if (enable) {
				setTriggerStatus("Error enabling triggers!");
			}
			else {
				setTriggerStatus("Error disabling triggers!");
			}
		}
	}

	// Sets the soft keyboard status for the page.
	function setSoftKeyboardStatus(message) {
		document.getElementById("softkb_status").innerHTML = message;
	}

	// Shows the soft keyboard
	function setSoftKeyboard(show) {
		if (DLKeyboardMgr.showSoftKeyboard(show)) {
			setSoftKeyboardStatus(show ? "Requested keyboard show." : "Requested keyboard hide.");
		}
		else {
			setSoftKeyboardStatus("Keyboard request failed.");
		}
	}

	function initProperties() {
		DLBarcodeMgr.setProperty(BcdPropIds.WEDGE_KEYBOARD_ENABLE, true);
		enableTrigs(true);
		setSoftKeyboard(false);
	}
});