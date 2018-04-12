"use strict";
/**
* UserInterface.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the ReactXP interfaces related to
* UI (layout measurements, etc.).
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
var ReactDOM = require("react-dom");
var ScrollViewConfig_1 = require("./ScrollViewConfig");
var SyncTasks = require("synctasks");
var FrontLayerViewManager_1 = require("./FrontLayerViewManager");
var RX = require("../common/Interfaces");
var UserInterface = /** @class */ (function (_super) {
    __extends(UserInterface, _super);
    function UserInterface() {
        var _this = _super.call(this) || this;
        _this._isNavigatingWithKeyboard = false;
        _this._keyboardNavigationStateChanged = function (isNavigatingWithKeyboard) {
            _this._isNavigatingWithKeyboard = isNavigatingWithKeyboard;
        };
        _this.keyboardNavigationEvent.subscribe(_this._keyboardNavigationStateChanged);
        return _this;
    }
    UserInterface.prototype.measureLayoutRelativeToWindow = function (component) {
        var deferred = SyncTasks.Defer();
        var componentDomNode = ReactDOM.findDOMNode(component);
        if (!componentDomNode) {
            deferred.reject('measureLayoutRelativeToWindow failed');
        }
        else {
            var componentBoundingRect = componentDomNode.getBoundingClientRect();
            deferred.resolve({
                x: componentBoundingRect.left,
                y: componentBoundingRect.top,
                width: componentBoundingRect.width,
                height: componentBoundingRect.height
            });
        }
        return deferred.promise();
    };
    UserInterface.prototype.measureLayoutRelativeToAncestor = function (component, ancestor) {
        var deferred = SyncTasks.Defer();
        var componentDomNode = ReactDOM.findDOMNode(component);
        var ancestorDomNode = ReactDOM.findDOMNode(ancestor);
        if (!componentDomNode || !ancestorDomNode) {
            deferred.reject('measureLayoutRelativeToAncestor failed');
        }
        else {
            var componentBoundingRect = componentDomNode.getBoundingClientRect();
            var ancestorBoundingRect = ancestorDomNode.getBoundingClientRect();
            deferred.resolve({
                x: componentBoundingRect.left - ancestorBoundingRect.left,
                y: componentBoundingRect.top - ancestorBoundingRect.top,
                width: componentBoundingRect.width,
                height: componentBoundingRect.height
            });
        }
        return deferred.promise();
    };
    UserInterface.prototype.measureWindow = function () {
        return {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    };
    UserInterface.prototype.getContentSizeMultiplier = function () {
        // Browsers don't support font-specific scaling. They scale all of their
        // UI elements the same.
        return SyncTasks.Resolved(1);
    };
    UserInterface.prototype.getMaxContentSizeMultiplier = function () {
        // Browsers don't support font-specific scaling. They scale all of their
        // UI elements the same.
        return SyncTasks.Resolved(0);
    };
    UserInterface.prototype.setMaxContentSizeMultiplier = function (maxContentSizeMultiplier) {
        // Browsers don't support font-specific scaling. They scale all of their
        // UI elements the same.
        // No-op.
    };
    UserInterface.prototype.isHighPixelDensityScreen = function () {
        return this.getPixelRatio() > 1;
    };
    UserInterface.prototype.getPixelRatio = function () {
        var pixelRatio = 0;
        if (window.devicePixelRatio) {
            pixelRatio = window.devicePixelRatio;
        }
        return pixelRatio;
    };
    UserInterface.prototype.setMainView = function (element) {
        FrontLayerViewManager_1.default.setMainView(element);
    };
    UserInterface.prototype.registerRootView = function (viewKey, getComponentFunc) {
        // Nothing to do
    };
    UserInterface.prototype.useCustomScrollbars = function (enable) {
        if (enable === void 0) { enable = true; }
        ScrollViewConfig_1.default.setUseCustomScrollbars(enable);
    };
    UserInterface.prototype.dismissKeyboard = function () {
        // Nothing to do
    };
    UserInterface.prototype.enableTouchLatencyEvents = function (latencyThresholdMs) {
        // Nothing to do
    };
    UserInterface.prototype.evaluateTouchLatency = function (e) {
        // Nothing to do
    };
    UserInterface.prototype.isNavigatingWithKeyboard = function () {
        return this._isNavigatingWithKeyboard;
    };
    return UserInterface;
}(RX.UserInterface));
exports.UserInterface = UserInterface;
exports.default = new UserInterface();
