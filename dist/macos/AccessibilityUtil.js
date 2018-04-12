"use strict";
/**
* AccessibilityUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* MacOS-specific accessibility utils.
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
var RN = require("react-native");
var Accessibility_1 = require("../native-common/Accessibility");
var AccessibilityUtil_1 = require("../common/AccessibilityUtil");
var AccessibilityUtil = /** @class */ (function (_super) {
    __extends(AccessibilityUtil, _super);
    function AccessibilityUtil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AccessibilityUtil.prototype.setAccessibilityFocus = function (component) {
        if (Accessibility_1.default.isScreenReaderEnabled() && RN.AccessibilityInfo && RN.AccessibilityInfo.setAccessibilityFocus) {
            var nodeHandle = RN.findNodeHandle(component);
            if (nodeHandle) {
                RN.AccessibilityInfo.setAccessibilityFocus(nodeHandle);
            }
            else {
                console.warn('Could not find node handle to set accessibility focus.');
            }
        }
    };
    return AccessibilityUtil;
}(AccessibilityUtil_1.AccessibilityPlatformUtil));
exports.AccessibilityUtil = AccessibilityUtil;
exports.default = new AccessibilityUtil();
