// Wait for HTML to load, then run JavaScript
window.addEventListener('DOMContentLoaded', () => {
    try {
        // If the scanner is not available then display a warning message.
        if (!DLBarcodeMgr.isInitialized()) {
            setStatus("Scanner not initialized!");
            document.getElementById("get").disabled = true;
            document.getElementById("commit").disabled = true;
            document.getElementById("default").disabled = true;
        }
        else {
            // Reset Code 39 settings to default values.
            loadSampleSettings();
            refreshSettings();
            enableUserID();
        }
    } catch (e) {
        if (e instanceof ReferenceError && e.message.includes("_DLBarcodeMgr")) {
            console.error(e)
            console.log("ERROR: DLBarcodeMgr not injected. Barcode scanning functions may not work as expected.");
            alert("Error: DLBarcodeMgr not detected. SDK calls may not work as expected. For full functionality, use a Datalogic mobile scanner and the latest version of Enterprise Browser.");
        }
    }

    document.getElementById("data").onfocus = clearData;
    document.getElementById("get").onclick = setButton;
    document.getElementById("commit").onclick = commitButton;
    document.getElementById("default").onclick = defaultButton;

    const configInputs = document.querySelectorAll("config-input");
    configInputs.forEach((input) => {
        input.addEventListener.onfocus = resetStatus;
    });

    // Sets the status for the page.
    function setStatus(message) {
        document.getElementById('status').innerHTML = message;
    }

    // Sets the status for the page.
    function resetStatus() {
        setStatus("&nbsp");
    }

    // Clears any scanned barcode data
    function clearData() {
        document.getElementById('data').value = "";
    }

    // Refreshes the displayed settings to the current values.
    function refreshSettings() {
        document.getElementById("enable").checked = DLBarcodeMgr.getProperty(BcdPropIds.CODE39_ENABLE);
        document.getElementById("l1").value = DLBarcodeMgr.getProperty(BcdPropIds.CODE39_LENGTH1);
        document.getElementById("l2").value = DLBarcodeMgr.getProperty(BcdPropIds.CODE39_LENGTH2);
        document.getElementById("id").value = String.fromCharCode(DLBarcodeMgr.getProperty(BcdPropIds.CODE39_USER_ID));
        document.getElementById("prefix").value = DLBarcodeMgr.getProperty(BcdPropIds.LABEL_PREFIX);
    }

    // Enable the user ID.
    function enableUserID() {
        // Set scanner so the user ID is output.
        if (!DLBarcodeMgr.setProperty(BcdPropIds.SEND_CODE_ID, SendCodeID.USERDEFINED_IDENTIFIER_BEFORE_LABEL)) {
            setStatus("Could not enable user code ID!");
        }
    }

    // Set button handler
    function setButton() {
        // Create the arrays we will use to set the properties
        let i = 0;
        let propVal;
        let propStr;
        let ids = [];
        let values = [];

        // Add the enable property
        ids[i] = BcdPropIds.CODE39_ENABLE;
        values[i++] = Number(document.getElementById("enable").checked);

        // If valid, add the l1 property
        propVal = parseInt(document.getElementById("l1").value, 10);
        if (!isNaN(propVal)) {
            ids[i] = BcdPropIds.CODE39_LENGTH1;
            values[i++] = propVal;
        }

        // If valid, add the l2 property
        propVal = parseInt(document.getElementById("l2").value, 10);
        if (!isNaN(propVal)) {
            ids[i] = BcdPropIds.CODE39_LENGTH2;
            values[i++] = propVal;
        }

        // If valid, add the user ID
        propStr = document.getElementById("id").value;
        propVal = propStr.charCodeAt(0);
        if (!isNaN(propVal)) {
            ids[i] = BcdPropIds.CODE39_USER_ID;
            values[i++] = propVal;
        }

        // Add the prefix property
        ids[i] = BcdPropIds.LABEL_PREFIX;
        values[i++] = document.getElementById("prefix").value;

        // Call set properties to update the settings
        DLBarcodeMgr.setProperties(ids, values);

        // Refresh settings to match what the current settings.
        refreshSettings();

        // Output status message
        setStatus("Properties set.");
    }

    // Commit button handler
    function commitButton() {
        if (DLBarcodeMgr.commitProperties()) {
            setStatus("Properties committed.");
        }
        else {
            setStatus("Error committing properties!");
        }

        // Refresh settings to match what the current settings.
        refreshSettings();
    }

    // Default button handler
    function defaultButton() {
        if (DLBarcodeMgr.setDefaults()) {
            setStatus("Properties set to default.");
        }
        else {
            setStatus("Error setting defaults!");
        }

        // Enable the user ID
        enableUserID();

        // Refresh settings to match what the current settings.
        refreshSettings();
    }

    function loadSampleSettings() {
        // Set the settings to the values we want to use for the sample.
        DLBarcodeMgr.setProperty(BcdPropIds.CODE39_ENABLE, true);
        DLBarcodeMgr.setProperty(BcdPropIds.CODE39_LENGTH1, 1);
        DLBarcodeMgr.setProperty(BcdPropIds.CODE39_LENGTH2, 20);
        DLBarcodeMgr.setProperty(BcdPropIds.CODE39_USER_ID, "C");
        DLBarcodeMgr.setProperty(BcdPropIds.LABEL_PREFIX, "");
    }
});