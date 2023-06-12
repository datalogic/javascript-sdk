// Wait for HTML to load, then run JavaScript
window.addEventListener('DOMContentLoaded', () => {
	// Disable the scanned data passing to the ui button when it has focus.
	try {
		initListeners();

		document.getElementById("remove-insertion-listeners").addEventListener("click", removeCradleInsertionListeners);
		document.getElementById("remove-extraction-listeners").addEventListener("click", removeCradleExtractionListeners);
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

	// Sets the callback string for the page
	function setCallback(state) {
		var message = "Cradle State: ";
		switch (state) {
			case 0:
				message += "Unknown";
				break;
			case 1:
				message += "Insertion State not supported";
				break;
			case 2:
				message += "Inserted correctly";
				break;
			case 3:
				message += "Inserted wrongly";
				break;
			case 4:
				message += "Extracted";
				break;

		}
		document.getElementById('callback').innerHTML = message;
	}

	// Adds the listeners for the cradle
	function initListeners() {
		if (!DLCradleMgr.onCradleInsertion(cradleInsertionCallback)) {
			setStatus("Could not set the insertion callback");
		}
		else if (!DLCradleMgr.onCradleExtraction(cradleExtractionCallback)) {
			setStatus("Could not set the extraction callback");
		}
		else {
			setStatus("Callbacks set");

			// Setup unload event so callbacks are removed on unload.
			addEventListener('unload', removeCradleInsertionListeners);
			addEventListener('unload', removeCradleExtractionListeners);
		}
	}

	// Removes the insertion listener for the cradle
	function removeCradleInsertionListeners() {
		if (DLCradleMgr.ignoreCradleInsertion()) {
			setStatus("Insertion listener removed");
			document.getElementById('callback').innerHTML = "";
		}
		else {
			setStatus("Could not remove insertion listener");
		}
	}

	// Removes the insertion listener for the cradle
	function removeCradleExtractionListeners() {
		if (DLCradleMgr.ignoreCradleExtraction()) {
			setStatus("Extraction listener removed");
			document.getElementById('callback').innerHTML = "";
		}
		else {
			setStatus("Could not remove extraction listener");
		}
	}

	// Callback for the cradle insertion event
	function cradleInsertionCallback(params) {
		setCallback(params.id);
		setStatus("insertionCallback event called");
	}

	// Callback for the cradle extracted insertion event
	function cradleExtractionCallback(params) {
		setCallback(params.id);
		setStatus("extractionCallback event called");
	}
});