/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comewmyy1soxui5/yy1soxui5/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
