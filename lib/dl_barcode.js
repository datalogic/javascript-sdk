// Interface for barcode functions.

const DL_BARCODE_MGR_VER = 4;

	/**
	 * Internal data member. Attach a callback function to the barcode scan event, hold on to remove later.
	 */
	dlScanCallback = null;

	/**
	 * Internal data member. Attach a callback function to the barcode timeout event, hold on to remove later.
	 */
	dlTimeoutCallback = null;


class DLBcdMgr {
	/**
	 * Internal method to return an instance of DLBarcodeMgr.
	 * @returns {DLBcdMgr} An instance of DLBcdMgr.
	 * @throws {ReferenceError} If _DLBarcodeMgr is not injected by Datalogic Enterprise Browser.
	 */
	getDLBarcodeMgr() {
		try {
			return _DLBarcodeMgr;
		} catch(e) {
			throw ReferenceError("_DLBarcodeMgr has not been injected by Datalogic Enterprise Browser");
		}
	}

	/**
	 * Internal method to return the appropriate type.
	 * @param {string} text A String with a prefixed type and value.
	 * @returns {any} A specified type with a given value.
	 */
	getType(text) {
		let prefix = text.slice(0, 4);
		let value = text.slice(4, text.length);
		switch (prefix) {
			case "UND:":
				return undefined;
			case "STR:":
				return value;
			case "INT:":
				return parseInt(value, 10);
			case "BOL:":
				return ((value === "true") || (value === "1"));
			case "FLO:":
				return parseFloat(value);
			case "OBJ:":
				return JSON.parse(value);
			case "NUL:":
				return null;
			case "SYM:":
				return Symbol(value);
			default:
				return undefined;
		}
	}

	/**
	 * Get the value of a property.
	 * @param {number} id A property ID from {@link BcdPropIds}.
	 * @returns {any} The current value of the given id.
	 */
	getProperty(id) {
		return this.getType(this.getDLBarcodeMgr().getProperty(id));
	}

	/**
	 * Set the value of a property.
	 * @param {number} id A property ID from {@link BcdPropIds}.
	 * @param {any} value The value to set the property to.
	 * @returns {boolean} True if property is set.
	 */
	setProperty(id, value) {
		if (typeof value === "string") {
			return this.getDLBarcodeMgr().setPropertyString(id, value);
		}
		else if (typeof value === "boolean") {
			if (value) {
				return this.getDLBarcodeMgr().setPropertyInt(id, 1);
			}
			else {
				return this.getDLBarcodeMgr().setPropertyInt(id, 0);
			}
		}
		else {
			return this.getDLBarcodeMgr().setPropertyInt(id, value);
		}
	}

	/**
	 * Set the values of multiple properties.
	 * @param {Array<number>} ids List of PropertyIDs.
	 * @param {Array<any>} values List of values to set properties to.
	 * @returns {boolean} True if all properties are set.
	 */
	setProperties(ids, values) {
		if (ids.length != values.length) {
			 return false;
		}

		let success = true;
		for (let i = 0; i < ids.length; i++) {
			if (!this.setProperty(ids[i], values[i])) {
				success = false;
			}
		}
		return success;
	}

	/**
	 * Checks if a specific property is available.
	 * @param {number} id A property ID from {@link BcdPropIds}.
	 * @returns {boolean} True if property is available.
	 */
	isAvailable(id) {
		return this.getDLBarcodeMgr().isAvailable(id);
	}

	/**
	 * Get the minimum value of a property.
	 * @param {number} id A property ID from {@link BcdPropIds}.
	 * @returns {any} The minimum value of the property.
	 */
	getMin(id) {
		return this.getType(this.getDLBarcodeMgr().getMin(id));
	}

	/**
	 * Get the maximum value of a property.
	 * @param {number} id A property ID from {@link BcdPropIds}.
	 * @returns {any} The maximum value of the property.
	 */
	getMax(id) {
		return this.getType(this.getDLBarcodeMgr().getMax(id));
	}

	/**
	 * Commit decode properties to be saved in a persistent way across system reboot.
	 * @returns {boolean} True if barcode properties have been successfully committed.
	 */
	commitProperties() {
		return this.getDLBarcodeMgr().commitProperties();
	}

	/**
	 * Enable/disable all symbologies depending on passed in enable value.
	 * @param {boolean} enable Enable/disable all symbologies.
	 * @returns {boolean} True if all symbologies have been successfully enabled/disabled.
	 */
	enableAllSymbologies(enable) {
		return this.getDLBarcodeMgr().enableAllSymbologies(enable);
	}

	/**
	 * Set decode properties to system defaults.
	 * @returns {boolean} True if all decode properties have been successfully set to default values.
	 */
	setDefaults() {
		return this.getDLBarcodeMgr().setDefaults();
	}

	/**
	 * Checks if the Scanner Service is correctly initialized.
	 * @returns {boolean} True if the Scanner Service is correctly initialized.
	 */
	isInitialized() {
		return this.getDLBarcodeMgr().isInitialized();
	}

	/**
	 * Attach a callback function to the scan event. 
	 * @param {(state: {id: number, rawData: string, text: string}) => void} callback function to be called when a scan event occurs. Scan results passed as an argument with the following parameters:
	 *  * id - Represents the scanned symbology. Name of symbology can be retrieved from the {@link SymIds} object.
	 *  * rawData - Byte data from the scan.
	 *  * text - The readable text of the barcode scanned.
	 * @returns {boolean} True if a scan listener has been successfully added.
	 */
	onScan(callback) {
		let success = this.getDLBarcodeMgr().addReadListener();
		if (dlScanCallback !== null) {
			window.removeEventListener('scan', dlScanCallback); 
		}
		dlScanCallback = function(event) {
			callback(event.detail.scan);
		};
		window.addEventListener('scan', dlScanCallback);
		return success;
	}

	/**
	 * Remove the scan event listener.
	 * @returns {boolean} True if the read listener has been successfully removed.
	 */
	ignoreScan() {    
		if (dlScanCallback !== null) {
			window.removeEventListener('scan', dlScanCallback);
			dlScanCallback = null;     
		}
		return this.getDLBarcodeMgr().removeReadListener();
	}

	/**
	 * Attach a callback function to the timeout event.
	 * @param {() => void} callback function to be called when a timeout event occurs.
	 * @returns {boolean} True if a timeout listener has been successfully added.
	 */
	onTimeout(callback) {
		let success = this.getDLBarcodeMgr().addTimeoutListener();
		if (dlTimeoutCallback !== null) {
			window.removeEventListener('timeout', dlTimeoutCallback); 
		}
		dlTimeoutCallback = callback;
		window.addEventListener('timeout', dlTimeoutCallback);
		return success;
	}

	/**
	 * Remove the timeout event listener.
	 * @returns {boolean} True if the timeout listener has been successfully removed.
	 */
	ignoreTimeout() {
		if (dlTimeoutCallback !== null) {
			window.removeEventListener('timeout', dlTimeoutCallback);
			dlTimeoutCallback = null;     
		}
		return this.getDLBarcodeMgr().removeTimeoutListener();
	}

	/**
	 * Activate the trigger and begin decoding.
	 * @param {number} timeout The number of milliseconds before a timeout event. 5000 if unspecified.
	 * @returns {boolean} True if decoding has successfully begun.
	 */
	startDecode(timeout) {
		if (typeof timeout === 'undefined') {
			return this.getDLBarcodeMgr().startDecode(5000);
		}
		else {
			return this.getDLBarcodeMgr().startDecode(timeout);
		}
	}

	/**
	 * Stop any data acquisition currently in progress.
	 * @returns {boolean} True if decoding has successfully stopped, or the scanner is not actively decoding.
	 */
	stopDecode() {
		return this.getDLBarcodeMgr().stopDecode();
	}
};

// Barcode property identifiers
const BcdPropIds = {
	AIM_ENABLE                            : 8,
	AUSTRALIAN_CODE_USER_ID               : 2351,
	AUSTRALIAN_POST_ENABLE                : 2327,
	AZTEC_CHARACTER_SET_MODE              : 2842,
	AZTEC_ENABLE                          : 2840,
	AZTEC_LENGTH1                         : 2860,
	AZTEC_LENGTH2                         : 2861,
	AZTEC_LENGTH_CONTROL                  : 2862,
	AZTEC_USER_ID                         : 2863,
	CODABAR_CLSI                          : 774,
	CODABAR_ENABLE                        : 768,
	CODABAR_ENABLE_CHECK                  : 770,
	CODABAR_LENGTH1                       : 800,
	CODABAR_LENGTH2                       : 801,
	CODABAR_LENGTH_CONTROL                : 802,
	CODABAR_SEND_CHECK                    : 771,
	CODABAR_SEND_START                    : 773,
	CODABAR_SHORT_QUIET_ZONES             : 804,
	CODABAR_USER_ID                       : 803,
	CODE128_AGGRESSIVENESS                : 1065,
	CODE128_ENABLE                        : 1032,
	CODE128_GS1_ENABLE                    : 1036,
	CODE128_GS1_USER_ID                   : 1064,
	CODE128_LENGTH1                       : 1060,
	CODE128_LENGTH2                       : 1061,
	CODE128_LENGTH_CONTROL                : 1062,
	CODE128_SHORT_QUIET_ZONES             : 1066,
	CODE128_USER_ID                       : 1063,
	CODE32_ENABLE                         : 272,
	CODE32_USER_ID                        : 295,
	CODE39_AGGRESSIVENESS                 : 292,
	CODE39_ENABLE                         : 256,
	CODE39_ENABLE_CHECK                   : 258,
	CODE39_FULL_ASCII                     : 261,
	CODE39_LENGTH1                        : 288,
	CODE39_LENGTH2                        : 289,
	CODE39_LENGTH_CONTROL                 : 290,
	CODE39_SEND_CHECK                     : 259,
	CODE39_SHORT_QUIET_ZONES              : 257,
	CODE39_USER_ID                        : 291,
	CODE93_ENABLE                         : 1024,
	CODE93_LENGTH1                        : 1056,
	CODE93_LENGTH2                        : 1057,
	CODE93_LENGTH_CONTROL                 : 1058,
	CODE93_SHORT_QUIET_ZONES              : 1067,
	CODE93_USER_ID                        : 1059,
	COMPOSITE_EAN_UPC_MODE                : 2610,
	COMPOSITE_ENABLE                      : 2608,
	COMPOSITE_GS1_128_MODE                : 2611,
	COMPOSITE_LINEAR_TRANSMISSION_ENABLE  : 2612,
	COMPOSITE_USER_ID                     : 2643,
	D25_ENABLE                            : 512,
	D25_LENGTH1                           : 544,
	D25_LENGTH2                           : 545,
	D25_LENGTH_CONTROL                    : 546,
	D25_USER_ID                           : 547,
	DATAMATRIX_AGGRESSIVENESS             : 2822,
	DATAMATRIX_CHARACTER_SET_MODE         : 2818,
	DATAMATRIX_ENABLE                     : 2816,
	DATAMATRIX_GS1_ENABLE                 : 2821,
	DATAMATRIX_LENGTH1                    : 2848,
	DATAMATRIX_LENGTH2                    : 2849,
	DATAMATRIX_LENGTH_CONTROL             : 2850,
	DATAMATRIX_MIRROR                     : 2820,
	DATAMATRIX_OPERATING_MODE             : 2819,
	DATAMATRIX_USER_ID                    : 2851,
	DECODE_TIMEOUT                        : 45,
	DIGIMARC_ENABLE                       : 65536,
	DISPLAY_MODE_ENABLE                   : 6,
	DISPLAY_NOTIFICATION_ENABLE           : 49,
	DOTCODE_CHARACTER_SET_MODE            : 3074,
	DOTCODE_ENABLE                        : 3072,
	DOTCODE_LENGTH1                       : 3104,
	DOTCODE_LENGTH2                       : 3105,
	DOTCODE_LENGTH_CONTROL                : 3106,
	DOTCODE_USER_ID                       : 3107,
	DOUBLE_READ_TIMEOUT                   : 102,
	EAN13_COMPOSITE_ENABLE                : 1302,
	EAN13_ENABLE                          : 1296,
	EAN13_SEND_CHECK                      : 1298,
	EAN13_SEND_SYS                        : 1299,
	EAN13_TO_ISBN                         : 1300,
	EAN13_TO_ISSN                         : 1301,
	EAN13_USER_ID                         : 1317,
	EAN8_COMPOSITE_ENABLE                 : 1320,
	EAN8_ENABLE                           : 1304,
	EAN8_SEND_CHECK                       : 1306,
	EAN8_TO_EAN13                         : 1307,
	EAN8_USER_ID                          : 1319,
	EAN_EXT_ENABLE_2_DIGIT                : 1308,
	EAN_EXT_ENABLE_5_DIGIT                : 1309,
	EAN_EXT_REQUIRE                       : 1311,
	ECI_POLICY                            : 262656,
	EXTERNAL_FORMATTING_ENABLE            : 262144,
	GOOD_READ_AUDIO_CHANNEL               : 52,
	GOOD_READ_AUDIO_FILE                  : 48,
	GOOD_READ_AUDIO_MODE                  : 51,
	GOOD_READ_AUDIO_VOLUME                : 47,
	GOOD_READ_COUNT                       : 32,
	GOOD_READ_DURATION                    : 34,
	GOOD_READ_ENABLE                      : 16,
	GOOD_READ_INTERVAL                    : 46,
	GOOD_READ_LED_ENABLE                  : 19,
	GOOD_READ_VIBRATE_ENABLE              : 18,
	GREEN_SPOT_ENABLE                     : 17,
	GS1_14_ENABLE                         : 2048,
	GS1_14_GS1_128_MODE                   : 2051,
	GS1_14_USER_ID                        : 2081,
	GS1_EXP_ENABLE                        : 2064,
	GS1_EXP_GS1_128_MODE                  : 2067,
	GS1_EXP_LENGTH1                       : 2084,
	GS1_EXP_LENGTH2                       : 2085,
	GS1_EXP_LENGTH_CONTROL                : 2086,
	GS1_EXP_USER_ID                       : 2087,
	GS1_LIMIT_ENABLE                      : 2056,
	GS1_LIMIT_GS1_128_MODE                : 2059,
	GS1_LIMIT_USER_ID                     : 2083,
	GS_SUBSTITUTION                       : 44,
	I25_AGGRESSIVENESS                    : 557,
	I25_ENABLE                            : 528,
	I25_ENABLE_CHECK                      : 530,
	I25_LENGTH1                           : 552,
	I25_LENGTH2                           : 553,
	I25_LENGTH_CONTROL                    : 554,
	I25_SEND_CHECK                        : 531,
	I25_SHORT_QUIET_ZONES                 : 558,
	I25_USER_ID                           : 555,
	ILLUMINATION_ENABLE                   : 7,
	ILLUMINATION_TIME                     : 103,
	ILLUMINATION_TYPE                     : 14,
	IMAGE_CAPTURE_PROFILE                 : 12,
	INVERSE_1D_SYMBOLOGIES                : 96,
	INVERSE_2D_SYMBOLOGIES                : 97,
	ISBT_128_COMMONLY_CONCATENATED_PAIRS  : 3330,
	ISBT_128_ENABLE                       : 3328,
	ISBT_128_MODE                         : 3331,
	ISBT_128_USER_ID                      : 3329,
	ITF14_ENABLE                          : 556,
	JAPANESE_POST_CODE_USER_ID            : 2353,
	JAPANESE_POST_ENABLE                  : 2329,
	KIX_CODE_ENABLE                       : 2328,
	KIX_CODE_USER_ID                      : 2352,
	LABEL_PREFIX                          : 38,
	LABEL_SUFFIX                          : 39,
	M25_ENABLE                            : 520,
	M25_LENGTH1                           : 548,
	M25_LENGTH2                           : 549,
	M25_LENGTH_CONTROL                    : 550,
	M25_SHORT_QUIET_ZONES                 : 559,
	M25_USER_ID                           : 551,
	MAXICODE_ENABLE                       : 2824,
	MAXICODE_LENGTH1                      : 2852,
	MAXICODE_LENGTH2                      : 2853,
	MAXICODE_LENGTH_CONTROL               : 2854,
	MAXICODE_USER_ID                      : 2855,
	MICROPDF417_CHARACTER_SET_MODE        : 2570,
	MICROPDF417_ENABLE                    : 2568,
	MICROPDF417_LENGTH1                   : 2596,
	MICROPDF417_LENGTH2                   : 2597,
	MICROPDF417_LENGTH_CONTROL            : 2598,
	MICROPDF417_USER_ID                   : 2599,
	MICRO_QR_CHARACTER_SET_MODE           : 2838,
	MICRO_QR_ENABLE                       : 2836,
	MICRO_QR_LENGTH1                      : 2864,
	MICRO_QR_LENGTH2                      : 2865,
	MICRO_QR_LENGTH_CONTROL               : 2866,
	MICRO_QR_USER_ID                      : 2867,
	MSI_AGGRESSIVENESS                    : 1576,
	MSI_CHECK_2_MOD_11                    : 1548,
	MSI_ENABLE                            : 1544,
	MSI_LENGTH1                           : 1572,
	MSI_LENGTH2                           : 1573,
	MSI_LENGTH_CONTROL                    : 1574,
	MSI_REQUIRE_2_CHECK                   : 1546,
	MSI_SEND_CHECK                        : 1547,
	MSI_SHORT_QUIET_ZONES                 : 1577,
	MSI_USER_ID                           : 1575,
	MULTISCAN_ENABLE                      : 80,
	MULTISCAN_NOTIFICATION_ENABLE         : 82,
	MULTISCAN_PARTIAL_RESULT_MODE         : 83,
	MULTISCAN_REQUIRED_LABELS             : 81,
	OCR_CONFIDENCE                        : 262916,
	OCR_ENABLE                            : 262912,
	OCR_ID_ENABLE                         : 262915,
	OCR_MULTIFRAME                        : 262917,
	OCR_PASSPORT_ENABLE                   : 262914,
	OCR_USER_ID                           : 262913,
	PDF417_CHARACTER_SET_MODE             : 2562,
	PDF417_ENABLE                         : 2560,
	PDF417_LENGTH1                        : 2592,
	PDF417_LENGTH2                        : 2593,
	PDF417_LENGTH_CONTROL                 : 2594,
	PDF417_USER_ID                        : 2595,
	PICKLIST_ENABLE                       : 10,
	PRESENTATION_MODE_AIMER_ENABLE        : 99,
	PRESENTATION_MODE_ENABLE              : 98,
	PRESENTATION_MODE_SENSITIVITY         : 100,
	QRCODE_CHARACTER_SET_MODE             : 2834,
	QRCODE_ENABLE                         : 2832,
	QRCODE_GS1_ENABLE                     : 2835,
	QRCODE_LENGTH1                        : 2856,
	QRCODE_LENGTH2                        : 2857,
	QRCODE_LENGTH_CONTROL                 : 2858,
	QRCODE_S2D_ENABLE                     : 200258,
	QRCODE_USER_ID                        : 2859,
	QRCODE_WIFI_ENABLE                    : 200257,
	REMOVE_NON_PRINTABLE_CHARS            : 24,
	ROYAL_MAIL_CODE_USER_ID               : 2350,
	ROYAL_MAIL_ENABLE                     : 2325,
	ROYAL_MAIL_SEND_CHECK                 : 2326,
	SCAN_MODE                             : 101,
	SEND_CODE_ID                          : 37,
	TARGET_MODE                           : 9,
	TARGET_MODE_ENABLE                    : 11,
	TARGET_RELEASE_TIMEOUT                : 42,
	TARGET_TIMEOUT                        : 41,
	TRIOPTIC_ENABLE                       : 264,
	TRIOPTIC_USER_ID                      : 293,
	UPCA_COMPOSITE_ENABLE                 : 1285,
	UPCA_ENABLE                           : 1280,
	UPCA_SEND_CHECK                       : 1282,
	UPCA_SEND_SYS                         : 1283,
	UPCA_TO_EAN13                         : 1284,
	UPCA_USER_ID                          : 1313,
	UPCE1_ENABLE                          : 1289,
	UPCE_COMPOSITE_ENABLE                 : 1293,
	UPCE_ENABLE                           : 1288,
	UPCE_SEND_CHECK                       : 1290,
	UPCE_SEND_SYS                         : 1291,
	UPCE_TO_UPCA                          : 1292,
	UPCE_USER_ID                          : 1315,
	UPC_EAN_AGGRESSIVENESS                : 1318,
	UPC_EAN_SHORT_QUIET_ZONES             : 1312,
	USPS_4STATE_CODE_USER_ID              : 2348,
	USPS_4STATE_ENABLE                    : 2323,
	US_PLANET_CODE_USER_ID                : 2346,
	US_PLANET_ENABLE                      : 2321,
	US_POSTNET_CODE_USER_ID               : 2347,
	US_POSTNET_ENABLE                     : 2320,
	WEDGE_INTENT_ACTION_NAME              : 200001,
	WEDGE_INTENT_CATEGORY_NAME            : 200002,
	WEDGE_INTENT_DELIVERY_MODE            : 200003,
	WEDGE_INTENT_ENABLE                   : 200000,
	WEDGE_INTENT_EXTRA_BARCODE_DATA       : 200004,
	WEDGE_INTENT_EXTRA_BARCODE_STRING     : 200006,
	WEDGE_INTENT_EXTRA_BARCODE_TYPE       : 200005,
	WEDGE_KEYBOARD_DELIVERY_MODE          : 70002,
	WEDGE_KEYBOARD_ENABLE                 : 70000,
	WEDGE_KEYBOARD_ONLY_ON_FOCUS          : 70001,
	WEDGE_WEB_ENABLE                      : 200256
};

// Symbology identifiers
const SymIds = {
	NOT_DEFINED             : 0,
	CODE39                  : 1,
	DISCRETE25              : 2,
	MATRIX25                : 3,
	INTERLEAVED25           : 4,
	CODABAR                 : 5,
	CODE93                  : 6,
	CODE128                 : 7,
	UPCA                    : 8,
	UPCA_ADDON2             : 9,
	UPCA_ADDON5             : 10,
	UPCE                    : 11,
	UPCE_ADDON2             : 12,
	UPCE_ADDON5             : 13,
	UPCE1                   : 14,
	UPCE1_ADDON2            : 15,
	UPCE1_ADDON5            : 16,
	EAN13                   : 17,
	EAN13_ADDON2            : 18,
	EAN13_ADDON5            : 19,
	EAN8                    : 20,
	EAN8_ADDON2             : 21,
	EAN8_ADDON5             : 22,
	MSI                     : 23,
	GS1_14                  : 24,
	GS1_LIMIT               : 25,
	GS1_EXP                 : 26,
	PDF417                  : 27,
	DATAMATRIX              : 28,
	MAXICODE                : 29,
	TRIOPTIC                : 30,
	CODE32                  : 31,
	MICROPDF417             : 32,
	QRCODE                  : 33,
	AZTEC                   : 34,
	POSTAL_PLANET           : 35,
	POSTAL_POSTNET          : 36,
	POSTAL_4STATE           : 37,
	POSTAL_ROYALMAIL        : 38,
	POSTAL_AUSTRALIAN       : 39,
	POSTAL_KIX              : 40,
	POSTAL_JAPAN            : 41,
	GS1_128                 : 42,
	CODE39_FULLASCII        : 43,
	EAN13_ISBN              : 44,
	EAN13_ISSN              : 45,
	MICRO_QR                : 46,
	COMPOSITE_GS1_128_A     : 47,
	COMPOSITE_GS1_128_B     : 48,
	COMPOSITE_GS1_128_C     : 49,
	COMPOSITE_GS1_14_A      : 50,
	COMPOSITE_GS1_14_B      : 51,
	COMPOSITE_GS1_LIMIT_A   : 52,
	COMPOSITE_GS1_LIMIT_B   : 53,
	COMPOSITE_GS1_EXP_A     : 54,
	COMPOSITE_GS1_EXP_B     : 55,
	COMPOSITE_CC_A          : 56,
	COMPOSITE_CC_B          : 57,
	DOTCODE                 : 58,
	ISBT_128                : 59,
	ISBT_128_CONCATENATED   : 60,
	GS1_DATAMATRIX          : 61,
	OCR                     : 62,
	GS1_QRCODE              : 63,
	ITF14                   : 64
};

const BeamMode = {
	TARGET_TIMEOUT  : 0,
	RELEASE_SCAN    : 1
};

const CharacterSetMode = {
	BIG_5           : 0,
	EUC_CN          : 1,
	EUC_KR          : 2,
	GB18030         : 3,
	GBK             : 4,
	IBM_437         : 5,
	ISO_8859_1      : 6,
	ISO_8859_2      : 7,
	ISO_8859_3      : 8,
	ISO_8859_4      : 9,
	ISO_8859_5      : 10,
	ISO_8859_6      : 11,
	ISO_8859_7      : 12,
	ISO_8859_8      : 13,
	ISO_8859_9      : 14,
	ISO_8859_11     : 15,
	ISO_8859_13     : 16,
	ISO_8859_14     : 17,
	ISO_8859_15     : 18,
	SHIFT_JIS       : 19,
	US_ASCII        : 20,
	UTF_8           : 21,
	UTF_16          : 22,
	WINDOWS_1250    : 23,
	WINDOWS_1251    : 24,
	WINDOWS_1252    : 25,
	WINDOWS_1254    : 26,
	WINDOWS_1256    : 27
};

const Code128Aggressiveness = {
	VERY_LOW    : 0,
	LOW         : 1,
	MEDIUM      : 2,
	HIGH        : 3,
	VERY_HIGH   : 4
};

const Code39Aggressiveness = {
	VERY_LOW    : 0,
	LOW         : 1,
	MEDIUM      : 2,
	HIGH        : 3,
	VERY_HIGH   : 4
};

const DatamatrixAggressiveness = {
	LOW         : 0,
	HIGH        : 1
};

const DatamatrixMirror = {
	REGULAR_ONLY    : 0,
	MIRROR_ONLY     : 1,
	BOTH            : 2
};

const DatamatrixOpMode = {
	VERY_FAST   : 0,
	FAST        : 1,
	ROBUST      : 2,
	VERY_ROBUST : 3
};

const ECIPolicy = {
	TRASMIT : 0,
	REMOVE  : 1
};

const IlluminationTime = {
	SHORT_PULSE : 0,
	LONG_PULSE  : 1
};

const IlluminationType = {
	AUTO    : 0,
	RED     : 1,
	WHITE   : 2
};

const ImageCaptureProfile = {
	AUTOMATIC_BY_ENABLED_SYMBOLOGIES    : 0,
	MOTION_TOLERANCE                    : 1,
	REFLECTIONS_TOLERANCE               : 2,
	CUSTOM                              : 3
};

const IntentDeliveryMode = {
	START_ACTIVITY  : 0,
	START_SERVICE   : 1,
	BROADCAST       : 2
};

const Interleaved25Aggressiveness = {
	VERY_LOW    : 0,
	LOW         : 1,
	MEDIUM      : 2,
	HIGH        : 3,
	VERY_HIGH   : 4
};

const InverseMode = {
	REGULAR_ONLY    : 0,
	REVERSE_ONLY    : 1,
	BOTH            : 2
};

const Isbt128Mode = {
	SINGLE_ONLY         : 0,
	CONCATENATED_ONLY   : 1,
	BOTH                : 2
};

const KeyWedgeMode = {
	TEXT_INJECTION  : 0,
	KEY_PRESSURE    : 1,
	COMMIT_TEXT     : 2
};

const LengthControlMode = {
	NONE        : 0,
	ONE_FIXED   : 1,
	TWO_FIXED   : 2,
	RANGE       : 3
};

const MsiAggressiveness = {
	VERY_LOW    : 0,
	LOW         : 1,
	MEDIUM      : 2,
	HIGH        : 3,
	VERY_HIGH   : 4
};

const PartialResultMode = {
	NEVER   : 0,
	TIMEOUT : 1,
	RELEASE : 2,
	BOTH    : 3
};

const ScanMode = {
	SINGLE          : 0,
	HOLD_MULTIPLE   : 1,
	PULSE_MULTIPLE  : 2,
	ALWAYS_ON       : 3
};

const SendCodeID = {
	NONE                                : 0,
	DATALOGIC_IDENTIFIER_BEFORE_LABEL   : 1,
	AIM_IDENTIFIER_BEFORE_LABEL         : 2,
	USERDEFINED_IDENTIFIER_BEFORE_LABEL : 3,
	DATALOGIC_IDENTIFIER_AFTER_LABEL    : 4,
	USERDEFINED_IDENTIFIER_AFTER_LABEL  : 5
};

const ToneNotificationChannel = {
	SCANNER     : 0,
	MUSIC       : 1,
	VOICE_CALL  : 2,
	ALARM       : 3,
	RING        : 4
};

const ToneNotificationMode = {
	NONE        : 0,
	BEEP        : 1,
	AUDIO_FILE  : 2,
	VIPER       : 3,
	BAROQUE     : 4
};

const UpcEanAggressiveness = {
	VERY_LOW    : 0,
	LOW         : 1,
	MEDIUM      : 2,
	HIGH        : 3,
	VERY_HIGH   : 4
};

const UpcEanCompositeMode = {
	AUTO            : 0,
	ALWAYS_LINKED   : 1,
	NEVER_LINKED    : 2
};

const DLBarcodeMgr = new DLBcdMgr();
