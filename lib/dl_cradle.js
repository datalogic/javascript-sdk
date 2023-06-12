// Interface for cradle functions.

const DL_CRADLE_MGR_VER = 1;

/**
 * Internal data member. Attach a callback function to the cradle insertion event, hold on to remove later.
 */
dlCradleInsertionCallback = null;

/**
 * Internal data member. Attach a callback function to the trolley insertion event, hold on to remove later.
 */
dlTrolleyInsertionCallback = null;

/**
 * Internal data member. Attach a callback function to the cradle extraction event, hold on to remove later.
 */
dlCradleExtractionCallback = null;

/**
 * Internal data member. Attach a callback function to the trolley extraction event, hold on to remove later.
 */
dlTrolleyExtractionCallback = null;

class DLCdlMgr {
	/**
	 * Internal method to return an instance of DLCradleMgr.
	 * @returns {DLCradleMgr} An instance of DLCdlMgr.
	 * @throws {ReferenceError} If DLCradleMgr is not injected by Datalogic Enterprise Browser.
	 */
	getDLCradleMgr() {
		try {
			return _DLCradleMgr;
		} catch (e) {
			throw ReferenceError("_DLCradleMgr has not been injected by Datalogic Enterprise Browser");
		}
	}

	/**
	 * Lock/unlock the device from the cradle.
	 * @param {LockAction} action Enable/disable lock.
	 * @returns {Boolean} True if lock action has been successfully set.
	 */
	controlLock(action) {
		return this.getDLCradleMgr().controlLock(action);
	}

	/**
	 * Sets an action for the cradle LED.
	 * @param {LedAction} action LED action to set.
	 * @returns {Boolean} True if LED action has been successfully set.
	 */
	controlLed(action) {
		return this.getDLCradleMgr().controlLed(action);
	}

	/**
	 * Gets the current insertion state of the device.
	 * @returns {Int} Current device state.
	 */
	getInsertionState() {
		return this.getDLCradleMgr().getInsertionState();
	}

	/**
	 * Gets the cradle slot in which the device is inserted.
	 * @returns {Int} Current cradle slot index.
	 */
	getSlotIndex() {
		return this.getDLCradleMgr().getSlotIndex();
	}

	/**
	 * Checks if a device is inserted into a trolley.
	 * @returns {Boolean} True if the device is inserted in the trolley.
	 */
	isDeviceInTrolley() {
		return this.getDLCradleMgr().isDeviceInTrolley();
	}

	/**
	 * Attach a callback function to the cradle insertion event.
	 * @param {(dlCradleInsertion: {id: number}) => void} callback function to be called when the device is inserted into the cradle. State results passed as an argument with the following parameters:
	 *  * id - Represents the insertion state of the device.
	 */
	onCradleInsertion(callback) {
		let success = this.getDLCradleMgr().addCradleInsertionListener();

		if (dlCradleInsertionCallback !== null) {
			window.removeEventListener('dlCradleInsertion', dlCradleInsertionCallback);
		}
		dlCradleInsertionCallback = function (event) {
			callback(event.detail.state);
		};
		window.addEventListener('dlCradleInsertion', dlCradleInsertionCallback);

		return success;
	}

	/**
	 * Removes cradle insertion event listener and callback function.
	 * @returns {Boolean} True if the cradle insertion event listener has been successfully removed.
	 */
	ignoreCradleInsertion() {
		if (dlCradleInsertionCallback !== null) {
			window.removeEventListener('dlCradleInsertion', dlCradleInsertionCallback);
			dlCradleInsertionCallback = null;
		}
		return this.getDLCradleMgr().removeCradleInsertionListener();
	}

	/**
	 * Attach a callback function to the cradle extraction event.
	 * @param {(dlExtractionInsertion: {id: number}) => void} callback function to be called when the device is extracted from the cradle. State results passed as an argument with the following parameters:
	 *  * id - Represents the insertion state of the device.
	 */
	onCradleExtraction(callback) {
		let success = this.getDLCradleMgr().addCradleExtractionListener();

		if (dlCradleExtractionCallback !== null) {
			window.removeEventListener('dlCradleExtraction', dlCradleExtractionCallback);
		}
		dlCradleExtractionCallback = function (event) {
			callback(event.detail.state);
		};
		window.addEventListener('dlCradleExtraction', dlCradleExtractionCallback);

		return success;
	}

	/**
	 * Removes cradle extraction event listener and callback function.
	 * @returns {Boolean} True if the cradle insertion event listener has been successfully removed.
	 */
	ignoreCradleExtraction() {
		if (dlCradleExtractionCallback !== null) {
			window.removeEventListener('dlCradleExtraction', dlCradleExtractionCallback);
			dlCradleExtractionCallback = null;
		}
		return this.getDLCradleMgr().removeCradleExtractionListener();
	}

	/**
	 * Attach a callback function to the trolley insertion event.
	 * @param {(dlTrolleyInsertion: {id: number}) => void} callback function to be called when the device is inserted into the trolley. State results passed as an argument with the following parameters:
	 *  * id - Represents the insertion state of the device.
	 */
	onTrolleyInsertion(callback) {
		let success = this.getDLCradleMgr().addTrolleyInsertionListener();

		if (dlTrolleyInsertionCallback !== null) {
			window.removeEventListener('dlTrolleyInsertion', dlTrolleyInsertionCallback);
		}
		dlTrolleyInsertionCallback = function (event) {
			callback(event.detail.state);
		};
		window.addEventListener('dlTrolleyInsertion', dlTrolleyInsertionCallback);

		return success;
	}

	/**
	 * Removes trolley insertion event listener and callback function.
	 * @returns {Boolean} True if the cradle insertion event listener has been successfully removed.
	 */
	ignoreTrolleyInsertion() {
		if (dlTrolleyInsertionCallback !== null) {
			window.removeEventListener('dlTrolleyInsertion', dlTrolleyInsertionCallback);
			dlTrolleyInsertionCallback = null;
		}
		return this.getDLCradleMgr().removeTrolleyInsertionListener();
	}

	/**
	 * Attach a callback function to the cradle extraction event.
	 * @param {(dlTrolleyExtraction: {id: number}) => void} callback function to be called when the device is extracted from the trolley. State results passed as an argument with the following parameters:
	 *  * id - Represents the insertion state of the device.
	 */
	onTrolleyExtraction(callback) {
		let success = this.getDLCradleMgr().addTrolleyExtractionListener();

		if (dlTrolleyExtractionCallback !== null) {
			window.removeEventListener('dlTrolleyExtraction', dlTrolleyExtractionCallback);
		}
		dlTrolleyExtractionCallback = function (event) {
			callback(event.detail.state);
		};
		window.addEventListener('dlTrolleyExtraction', dlTrolleyExtractionCallback);

		return success;
	}

	/**
	 * Removes trolley extraction event listener and callback function.
	 * @returns {Boolean} True if the trolley insertion event listener has been successfully removed.
	 */
	ignoreTrolleyExtraction() {
		if (dlTrolleyExtractionCallback !== null) {
			window.removeEventListener('dlTrolleyExtraction', dlTrolleyExtractionCallback);
			dlTrolleyExtractionCallback = null;
		}
		return this.getDLCradleMgr().removeTrolleyExtractionListener();
	}

	/**
	 * Reads the cradle's custom area.
	 * @returns {String} Message stored in the cradle. Returns undefined if no message is stored.
	 */
	readCustomArea() {
		return this.getDLCradleMgr().readCustomArea();
	}

	/**
	 * Writes a message to the cradle's custom area.
	 * @param {String} message Message to write to the cradle. Message cannot exceed 512 characters.
	 * @returns {Boolean} True if the message was successfully written to the cradle.
	 */
	writeCustomArea(message) {
		return this.getDLCradleMgr().writeCustomArea(message);
	}
}

const LedAction = {
	BLINK_FAST: 0,
	BLINK_SLOW: 1,
	LED_OFF: 2,
	LED_ON: 3,
	TOGGLE: 4
};

const LockAction = {
	LOCK: 0,
	LOCK_WITH_LED_OFF: 1,
	UNLOCK: 2,
	UNLOCK_WITH_LED_ON: 3
};

const InsertState = {
	INSERTION_UNKNOWN: 0,
	DEVICE_INSERTION_NOT_SUPPORTED: 1,
	INSERTED_CORRECTLY: 2,
	INSERTED_WRONGLY: 3,
	EXTRACTED: 4
}

const DLCradleMgr = new DLCdlMgr();