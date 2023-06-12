// Wait for HTML to load, then run JavaScript
window.addEventListener('DOMContentLoaded', () => {
	// Disable the scanned data passing to the ui button when it has focus.
	try {
		initProperties();

		document.getElementById("read").addEventListener("click", read);
		document.getElementById("write").addEventListener("click", write);
		document.getElementById("data")
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

	function read() {
		setStatus("Reading from cradle");
		message = DLCradleMgr.readCustomArea();
		setStatus("'" + message + "'" + " read from cradle");
	}

	function write() {
		setStatus("Writing to cradle");
		success = DLCradleMgr.writeCustomArea(document.getElementById("data").value);
		// success = DLCradleMgr.writeCustomArea("Hello World");
		if (success) {
			setStatus("Successfully written to cradle");
		}
		else {
			setStatus("Failed to write to cradle");
		}
	}

	function initProperties() {
		DLCradleMgr.getInsertionState();
	}
});