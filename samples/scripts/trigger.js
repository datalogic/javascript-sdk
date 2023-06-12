// Wait for HTML to load, then run JavaScript
window.addEventListener('DOMContentLoaded', () => {
	// Check if barcode scanner is detected
	try {
		// If the scanner is not available then display a warning message.
		initProperties();

		document.getElementById("disabled").onfocus = disableTrigsHelper;
		document.getElementById("disabled").onblur = enableTrigsHelper;
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

	// Sets the status for the page.
	function setStatus(message) {
		document.getElementById('status').innerHTML = message;
	}

	// Enables triggers
	function enableTrigs(enable) {
		if (DLKeyboardMgr.enableTriggers(enable)) {
			if (enable) {
				setStatus("Triggers enabled.");
			}
			else {
				setStatus("Triggers disabled.");
			}
		}
		else {
			if (enable) {
				setStatus("Error enabling triggers!");
			}
			else {
				setStatus("Error disabling triggers!");
			}
		}
	}

	function initProperties() {
		DLBarcodeMgr.setProperty(BcdPropIds.WEDGE_KEYBOARD_ENABLE, true);
		enableTrigs(true);
	}
});