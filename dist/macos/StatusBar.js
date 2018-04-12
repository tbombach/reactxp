"use strict";
/**
* StatusBar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* MacOS-specific implementation of StatusBar APIs.
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var RX = require("../common/Interfaces");
var StatusBar = /** @class */ (function (_super) {
    __extends(StatusBar, _super);
    function StatusBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StatusBar.prototype.isOverlay = function () {
        // No status bar support on MacOS
        return false;
    };
    StatusBar.prototype.setHidden = function (hidden, showHideTransition) {
        // Nothing to do on MacOS
    };
    StatusBar.prototype.setBackgroundColor = function (color, animated) {
        // Nothing to do on MacOS
    };
    StatusBar.prototype.setTranslucent = function (translucent) {
        // Nothing to do on MacOS
    };
    StatusBar.prototype.setBarStyle = function (style, animated) {
        // Nothing to do on MacOS
    };
    StatusBar.prototype.setNetworkActivityIndicatorVisible = function (value) {
        // Nothing to do on MacOS
    };
    return StatusBar;
}(RX.StatusBar));
exports.StatusBar = StatusBar;
exports.default = new StatusBar();
