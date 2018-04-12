"use strict";
/**
* FocusManager.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages focusable elements for better keyboard navigation.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var PropTypes = require("prop-types");
var AppConfig_1 = require("../../common/AppConfig");
var Types = require("../../common/Types");
var _lastComponentId = 0;
var FocusManager = /** @class */ (function () {
    function FocusManager(parent) {
        this._isFocusLimited = Types.LimitFocusType.Unlimited;
        this._myFocusableComponentIds = {};
        if (parent) {
            this._parent = parent;
        }
        else if (FocusManager._rootFocusManager) {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.error('FocusManager: root is already set');
            }
        }
        else {
            FocusManager._rootFocusManager = this;
        }
    }
    // Whenever the focusable element is mounted, we let the application
    // know so that FocusManager could account for this element during the
    // focus restriction.
    FocusManager.prototype.addFocusableComponent = function (component) {
        if (component.focusableComponentId) {
            return;
        }
        var numericComponentId = ++_lastComponentId;
        var componentId = 'fc-' + numericComponentId;
        var storedComponent = {
            id: componentId,
            numericId: numericComponentId,
            component: component,
            restricted: false,
            limitedCount: 0,
            limitedCountAccessible: 0,
            onFocus: function () {
                FocusManager._currentFocusedComponent = storedComponent;
            }
        };
        component.focusableComponentId = componentId;
        FocusManager._allFocusableComponents[componentId] = storedComponent;
        var withinRestrictionOwner = false;
        for (var parent_1 = this; parent_1; parent_1 = parent_1._parent) {
            parent_1._myFocusableComponentIds[componentId] = true;
            if (FocusManager._currentRestrictionOwner === parent_1) {
                withinRestrictionOwner = true;
            }
            if (parent_1._isFocusLimited === Types.LimitFocusType.Accessible) {
                storedComponent.limitedCountAccessible++;
            }
            else if (parent_1._isFocusLimited === Types.LimitFocusType.Limited) {
                storedComponent.limitedCount++;
            }
        }
        if (!withinRestrictionOwner && FocusManager._currentRestrictionOwner) {
            storedComponent.restricted = true;
        }
        this._updateComponentFocusRestriction(storedComponent);
        this.addFocusListenerOnComponent(component, storedComponent.onFocus);
    };
    FocusManager.prototype.removeFocusableComponent = function (component) {
        if (!component.focusableComponentId) {
            return;
        }
        var componentId = component.focusableComponentId;
        if (componentId) {
            var storedComponent = FocusManager._allFocusableComponents[componentId];
            this.removeFocusListenerFromComponent(component, storedComponent.onFocus);
            storedComponent.removed = true;
            storedComponent.restricted = false;
            storedComponent.limitedCount = 0;
            storedComponent.limitedCountAccessible = 0;
            this._updateComponentFocusRestriction(storedComponent);
            delete storedComponent.callbacks;
            for (var parent_2 = this; parent_2; parent_2 = parent_2._parent) {
                delete parent_2._myFocusableComponentIds[componentId];
            }
            delete FocusManager._allFocusableComponents[componentId];
            delete component.focusableComponentId;
        }
    };
    FocusManager.prototype.restrictFocusWithin = function (noFocusReset) {
        var _this = this;
        // Limit the focus received by the keyboard navigation to all
        // the descendant focusable elements by setting tabIndex of all
        // other elements to -1.
        if (FocusManager._currentRestrictionOwner === this) {
            return;
        }
        if (FocusManager._currentRestrictionOwner) {
            this._removeFocusRestriction();
        }
        if (!this._prevFocusedComponent) {
            this._prevFocusedComponent = FocusManager._pendingPrevFocusedComponent || FocusManager._currentFocusedComponent;
        }
        FocusManager._clearRestoreRestrictionTimeout();
        FocusManager._restrictionStack.push(this);
        FocusManager._currentRestrictionOwner = this;
        Object.keys(FocusManager._allFocusableComponents).forEach(function (componentId) {
            if (!(componentId in _this._myFocusableComponentIds)) {
                var storedComponent = FocusManager._allFocusableComponents[componentId];
                storedComponent.restricted = true;
                _this._updateComponentFocusRestriction(storedComponent);
            }
        });
        if (!noFocusReset) {
            this.resetFocus();
        }
    };
    FocusManager.prototype.removeFocusRestriction = function () {
        var _this = this;
        // Restore the focus to the previous view with restrictFocusWithin or
        // remove the restriction if there is no such view.
        FocusManager._restrictionStack = FocusManager._restrictionStack.filter(function (focusManager) { return focusManager !== _this; });
        if (FocusManager._currentRestrictionOwner === this) {
            // We'll take care of setting the proper focus below,
            // no need to do a regular check for focusout.
            FocusManager._skipFocusCheck = true;
            var prevFocusedComponent_1 = this._prevFocusedComponent;
            this._prevFocusedComponent = undefined;
            this._removeFocusRestriction();
            FocusManager._currentRestrictionOwner = undefined;
            // Defer the previous restriction restoration to wait for the current view
            // to be unmounted, or for the next restricted view to be mounted (like
            // showing a modal after a popup).
            FocusManager._clearRestoreRestrictionTimeout();
            FocusManager._pendingPrevFocusedComponent = prevFocusedComponent_1;
            FocusManager._restoreRestrictionTimer = setTimeout(function () {
                FocusManager._restoreRestrictionTimer = undefined;
                FocusManager._pendingPrevFocusedComponent = undefined;
                var prevRestrictionOwner = FocusManager._restrictionStack.pop();
                var needsFocusReset = true;
                var currentFocusedComponent = FocusManager._currentFocusedComponent;
                if (currentFocusedComponent && !currentFocusedComponent.removed &&
                    !(currentFocusedComponent.id in _this._myFocusableComponentIds)) {
                    // The focus has been manually moved to something outside of the current
                    // restriction scope, we should skip focusing the component which was
                    // focused before the restriction and keep the focus as it is.
                    prevFocusedComponent_1 = undefined;
                    needsFocusReset = false;
                }
                if (prevFocusedComponent_1 &&
                    !prevFocusedComponent_1.removed &&
                    !prevFocusedComponent_1.restricted &&
                    prevFocusedComponent_1.limitedCount === 0 &&
                    prevFocusedComponent_1.limitedCountAccessible === 0) {
                    // If possible, focus the previously focused component.
                    needsFocusReset = !_this.focusComponent(prevFocusedComponent_1.component);
                }
                if (prevRestrictionOwner) {
                    prevRestrictionOwner.restrictFocusWithin(true);
                }
                if (needsFocusReset) {
                    _this.resetFocus();
                }
            }, 100);
        }
    };
    FocusManager.prototype.limitFocusWithin = function (limitType) {
        var _this = this;
        if (this._isFocusLimited !== Types.LimitFocusType.Unlimited ||
            (limitType !== Types.LimitFocusType.Limited &&
                limitType !== Types.LimitFocusType.Accessible)) {
            return;
        }
        this._isFocusLimited = limitType;
        Object.keys(this._myFocusableComponentIds).forEach(function (componentId) {
            var storedComponent = FocusManager._allFocusableComponents[componentId];
            if (limitType === Types.LimitFocusType.Accessible) {
                storedComponent.limitedCountAccessible++;
            }
            else if (limitType === Types.LimitFocusType.Limited) {
                storedComponent.limitedCount++;
            }
            _this._updateComponentFocusRestriction(storedComponent);
        });
    };
    FocusManager.prototype.removeFocusLimitation = function () {
        var _this = this;
        if (this._isFocusLimited === Types.LimitFocusType.Unlimited) {
            return;
        }
        Object.keys(this._myFocusableComponentIds).forEach(function (componentId) {
            var storedComponent = FocusManager._allFocusableComponents[componentId];
            if (_this._isFocusLimited === Types.LimitFocusType.Accessible) {
                storedComponent.limitedCountAccessible--;
            }
            else if (_this._isFocusLimited === Types.LimitFocusType.Limited) {
                storedComponent.limitedCount--;
            }
            _this._updateComponentFocusRestriction(storedComponent);
        });
        this._isFocusLimited = Types.LimitFocusType.Unlimited;
    };
    FocusManager.prototype.release = function () {
        this.removeFocusRestriction();
        this.removeFocusLimitation();
    };
    FocusManager.prototype.subscribe = function (component, callback) {
        var storedComponent = FocusManager._getStoredComponent(component);
        if (storedComponent) {
            if (!storedComponent.callbacks) {
                storedComponent.callbacks = [];
            }
            storedComponent.callbacks.push(callback);
        }
    };
    FocusManager.prototype.unsubscribe = function (component, callback) {
        var storedComponent = FocusManager._getStoredComponent(component);
        if (storedComponent && storedComponent.callbacks) {
            storedComponent.callbacks = storedComponent.callbacks.filter(function (cb) {
                return cb !== callback;
            });
        }
    };
    FocusManager.prototype.isComponentFocusRestrictedOrLimited = function (component) {
        var storedComponent = FocusManager._getStoredComponent(component);
        return !!storedComponent &&
            (storedComponent.restricted || storedComponent.limitedCount > 0 || storedComponent.limitedCountAccessible > 0);
    };
    FocusManager.getCurrentFocusedComponent = function () {
        return FocusManager._currentFocusedComponent ? FocusManager._currentFocusedComponent.id : undefined;
    };
    FocusManager._getStoredComponent = function (component) {
        var componentId = component.focusableComponentId;
        if (componentId) {
            return FocusManager._allFocusableComponents[componentId];
        }
        return undefined;
    };
    FocusManager._callFocusableComponentStateChangeCallbacks = function (storedComponent, restrictedOrLimited) {
        if (!storedComponent.callbacks) {
            return;
        }
        storedComponent.callbacks.forEach(function (callback) {
            callback.call(storedComponent.component, restrictedOrLimited);
        });
    };
    FocusManager.prototype._removeFocusRestriction = function () {
        var _this = this;
        Object.keys(FocusManager._allFocusableComponents).forEach(function (componentId) {
            var storedComponent = FocusManager._allFocusableComponents[componentId];
            storedComponent.restricted = false;
            _this._updateComponentFocusRestriction(storedComponent);
        });
    };
    FocusManager._clearRestoreRestrictionTimeout = function () {
        if (FocusManager._restoreRestrictionTimer) {
            clearTimeout(FocusManager._restoreRestrictionTimer);
            FocusManager._restoreRestrictionTimer = undefined;
            FocusManager._pendingPrevFocusedComponent = undefined;
        }
    };
    FocusManager._restrictionStack = [];
    FocusManager._allFocusableComponents = {};
    FocusManager._skipFocusCheck = false;
    return FocusManager;
}());
exports.FocusManager = FocusManager;
// A mixin for the focusable elements, to tell the views that
// they exist and should be accounted during the focus restriction.
//
// isConditionallyFocusable is an optional callback which will be
// called for componentDidMount() or for componentWillUpdate() to
// determine if the component is actually focusable.
function applyFocusableComponentMixin(Component, isConditionallyFocusable) {
    var contextTypes = Component.contextTypes || {};
    contextTypes.focusManager = PropTypes.object;
    Component.contextTypes = contextTypes;
    inheritMethod('componentDidMount', function (focusManager) {
        if (!isConditionallyFocusable || isConditionallyFocusable.call(this)) {
            focusManager.addFocusableComponent(this);
        }
    });
    inheritMethod('componentWillUnmount', function (focusManager) {
        focusManager.removeFocusableComponent(this);
    });
    inheritMethod('componentWillUpdate', function (focusManager, origArgs) {
        if (isConditionallyFocusable) {
            var isFocusable = isConditionallyFocusable.apply(this, origArgs);
            if (isFocusable && !this.focusableComponentId) {
                focusManager.addFocusableComponent(this);
            }
            else if (!isFocusable && this.focusableComponentId) {
                focusManager.removeFocusableComponent(this);
            }
        }
    });
    function inheritMethod(methodName, action) {
        var origCallback = Component.prototype[methodName];
        Component.prototype[methodName] = function () {
            var focusManager = this._focusManager || (this.context && this.context.focusManager);
            if (focusManager) {
                action.call(this, focusManager, arguments);
            }
            else {
                if (AppConfig_1.default.isDevelopmentMode()) {
                    console.error('FocusableComponentMixin: context error!');
                }
            }
            if (origCallback) {
                origCallback.apply(this, arguments);
            }
        };
    }
}
exports.applyFocusableComponentMixin = applyFocusableComponentMixin;
exports.default = FocusManager;
