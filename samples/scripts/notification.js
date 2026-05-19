// Wait for HTML to load, then run JavaScript
window.addEventListener('DOMContentLoaded', () => {
	try {
		// Verify the device manager is available.
		DLNotificationMgr.hasVibrator();

		document.getElementById("has-vibrator").addEventListener("click", checkVibrator);
		document.getElementById("vibrate").addEventListener("click", vibrateSimple);
		document.getElementById("pattern-vibrate").addEventListener("click", vibratePattern);
		document.getElementById("cancel").addEventListener("click", vibrateCancel);
	} catch (e) {
		if (e instanceof ReferenceError && e.message.includes("_DLNotificationMgr")) {
			console.error(e);
			console.log("ERROR: DLNotificationMgr not injected. Notification functions may not work as expected.");
			alert("Error: DLNotificationMgr not detected. SDK calls may not work as expected. For full functionality, use a Datalogic mobile scanner and the latest version of Enterprise Browser.");
		}
	}

	// Sets the status string for the page.
	function setStatus(message) {
		document.getElementById('status').innerHTML = message;
	}

	// Check if the device has a vibrator.
	function checkVibrator() {
		var info = document.getElementById('vib_info');
		var has = DLNotificationMgr.hasVibrator();
		info.innerHTML = has ? "&#x2714; Vibrator available" : "&#x2718; No vibrator";
		info.style.color = has ? "#4CAF50" : "#cf4242";
		setStatus("Has vibrator: " + has);
	}

	// Vibrate for a given duration.
	function vibrateSimple() {
		var ms = parseInt(document.getElementById('duration').value) || 500;
		if (DLNotificationMgr.vibrate(ms)) {
			setStatus("Vibrating for " + ms + " ms.");
		}
		else {
			setStatus("Error: Vibrate request failed.");
		}
	}

	// Vibrate with a pattern.
	function vibratePattern() {
		var pattern = document.getElementById('pattern').value;
		var repeat = parseInt(document.getElementById('repeat').value);
		if (isNaN(repeat)) repeat = -1;
		if (DLNotificationMgr.vibratePattern(pattern, repeat)) {
			setStatus("Vibrating with pattern.");
		}
		else {
			setStatus("Error: Pattern vibration failed.");
		}
	}

	// Cancel any ongoing vibration.
	function vibrateCancel() {
		if (DLNotificationMgr.vibrateCancel()) {
			setStatus("Vibration cancelled.");
		}
		else {
			setStatus("Error: Cancel failed.");
		}
	}
});

