"use strict";
/**
* FocusManager.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Manages focusable elements for better keyboard navigation (RN desktop version)
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
var FocusManager_1 = require("../../common/utils/FocusManager");
var AppConfig_1 = require("../../common/AppConfig");
var Platform_1 = require("../../native-common/Platform");
var UserInterface_1 = require("../UserInterface");
var isNativeWindows = Platform_1.default.getType() === 'windows';
var _isNavigatingWithKeyboard;
UserInterface_1.default.keyboardNavigationEvent.subscribe(function (isNavigatingWithKeyboard) {
    _isNavigatingWithKeyboard = isNavigatingWithKeyboard;
});
var FocusManager = /** @class */ (function (_super) {
    __extends(FocusManager, _super);
    function FocusManager(parent) {
        return _super.call(this, parent) || this;
    }
    FocusManager.prototype.addFocusListenerOnComponent = function (component, onFocus) {
        // We intercept the "onFocus" all the focusable elements have to have
        component.onFocusSink = onFocus;
    };
    FocusManager.prototype.removeFocusListenerFromComponent = function (component, onFocus) {
        delete component.onFocusSink;
    };
    FocusManager.prototype.focusComponent = function (component) {
        if (component && component.focus) {
            component.focus();
            return true;
        }
        return false;
    };
    FocusManager.focusFirst = function () {
        var focusable = Object.keys(FocusManager._allFocusableComponents)
            .map(function (componentId) { return FocusManager._allFocusableComponents[componentId]; })
            .filter(function (storedComponent) { return !storedComponent.removed && !storedComponent.restricted && !storedComponent.limitedCount; });
        if (focusable.length) {
            focusable.sort(function (a, b) {
                // This function does its best, but contrary to DOM-land we have no idea on where the native components
                // ended up on screen, unless some expensive measuring is done on them.
                // So we defer to less than optimal "add focusable component" order. A lot of factors (absolute positioning,
                // instance replacements, etc.) can alter the correctness of this method, but I see no other way.
                if (a === b) {
                    return 0;
                }
                if (a.numericId < b.numericId) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
            var fc = focusable[0].component;
            if (fc && fc.focus) {
                fc.focus();
            }
        }
    };
    FocusManager.prototype.resetFocus = function () {
        if (FocusManager._resetFocusTimer) {
            clearTimeout(FocusManager._resetFocusTimer);
            FocusManager._resetFocusTimer = undefined;
        }
        if (_isNavigatingWithKeyboard) {
            // When we're in the keyboard navigation mode, we want to have the
            // first focusable component to be focused straight away, without the
            // necessity to press Tab.
            // Defer the focusing to let the view finish its initialization and to allow for manual focus setting (if any)
            // to be processed (the asynchronous nature of focus->onFocus path requires a delay)
            FocusManager._resetFocusTimer = setTimeout(function () {
                FocusManager._resetFocusTimer = undefined;
                // Check if the currently focused component is without limit/restriction.
                // We skip setting focus on "first" component in that case because:
                // - focusFirst has its limits, to say it gently
                // - We ended up in resetFocus for a reason that is not true anymore (mostly because focus was set manually)
                var storedComponent = FocusManager._currentFocusedComponent;
                if (!storedComponent || storedComponent.removed || storedComponent.restricted || (storedComponent.limitedCount > 0)) {
                    FocusManager.focusFirst();
                }
            }, 500);
        }
    };
    FocusManager.prototype._updateComponentFocusRestriction = function (storedComponent) {
        if ((storedComponent.restricted || (storedComponent.limitedCount > 0)) && !('origTabIndex' in storedComponent)) {
            storedComponent.origTabIndex = FocusManager._setComponentTabIndexOverride(storedComponent.component, -1);
            FocusManager._callFocusableComponentStateChangeCallbacks(storedComponent, true);
        }
        else if (!storedComponent.restricted && !storedComponent.limitedCount && ('origTabIndex' in storedComponent)) {
            FocusManager._removeComponentTabIndexOverride(storedComponent.component);
            delete storedComponent.origTabIndex;
            FocusManager._callFocusableComponentStateChangeCallbacks(storedComponent, false);
        }
    };
    FocusManager._setComponentTabIndexOverride = function (component, tabIndex) {
        // Save the override on a custom property
        component.tabIndexOverride = tabIndex;
        // Refresh the native view
        updateNativeTabIndex(component);
        // Original value is not used for desktop implementation
        return undefined;
    };
    FocusManager._removeComponentTabIndexOverride = function (component) {
        // Remove any override
        delete component.tabIndexOverride;
        // Refresh the native view
        updateNativeTabIndex(component);
    };
    return FocusManager;
}(FocusManager_1.FocusManager));
exports.FocusManager = FocusManager;
function updateNativeTabIndex(component) {
    // Call special method on component avoiding state changes/re-renderings
    if (component.updateNativeTabIndex) {
        component.updateNativeTabIndex();
    }
    else {
        if (AppConfig_1.default.isDevelopmentMode()) {
            console.error('FocusableComponentMixin: updateNativeTabIndex doesn\'t exist!');
        }
    }
}
function applyFocusableComponentMixin(Component, isConditionallyFocusable) {
    // Call base
    // This adds the basic "monitor focusable components" functionality.
    FocusManager_1.applyFocusableComponentMixin(Component, isConditionallyFocusable);
    // Hook 'onFocus'
    inheritMethod('onFocus', function (origCallback) {
        if (this.onFocusSink) {
            this.onFocusSink();
        }
        else {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.error('FocusableComponentMixin: onFocusSink doesn\'t exist!');
            }
        }
        origCallback.call(this);
    });
    // Hook 'getTabIndex'
    inheritMethod('getTabIndex', function (origCallback) {
        // Check local override first, then focus manager one
        if (this.tabIndexLocalOverride !== undefined) {
            // Local override available, use this one
            return this.tabIndexLocalOverride;
        }
        else if (this.tabIndexOverride !== undefined) {
            // Override available, use this one
            return this.tabIndexOverride;
        }
        else {
            // Override not available, defer to original handler to return the prop
            return origCallback.call(this);
        }
    });
    if (isNativeWindows) {
        // UWP platform (at least) is slightly stricter with regard to tabIndex combinations. The "component focusable but not in tab order"
        // case (usually encoded with tabIndex<0 for browsers) is not supported. A negative tabIndex disables focusing/keyboard input
        // completely instead (though a component already having keyboard focus doesn't lose it right away).
        // We try to simulate the right behavior through a trick.
        inheritMethod('focus', function (origCallback) {
            var _this = this;
            var tabIndex = this.getTabIndex();
            // Check effective tabIndex
            if (tabIndex !== undefined && tabIndex < 0) {
                // A negative tabIndex maps to non focusable in UWP.
                // We temporary apply a local override of "tabIndex=0", and then forward the focus command.
                // A timer makes sure the tabIndex returns back to "non-overriden" state.
                // - If the component is not under FocusManager control (a View with tabIndex===-1, for ex.), the only action
                // available for user is to tab out.
                // - If the component is under FocusManager control, the "tabIndex===-1" is usually due to a limit imposed on the component,
                // and that limit is usually removed when component aquires focus. If not, the user has again one only choice left: to
                // tab out.
                // A more accurate solution would require tracking onBlur and other state.
                this.tabIndexLocalOverride = 0;
                // Refresh the native view
                updateNativeTabIndex(this);
                this.tabIndexLocalOverrideTimer = setTimeout(function () {
                    if (_this.tabIndexLocalOverrideTimer !== undefined) {
                        _this.tabIndexLocalOverrideTimer = undefined;
                        // Remove override
                        delete _this.tabIndexLocalOverride;
                        // Refresh the native view
                        updateNativeTabIndex(_this);
                    }
                }, 500);
            }
            // To original
            return origCallback.call(this);
        });
        inheritMethod('componentWillUnmount', function (origCallback) {
            // Reset any pending local override timer
            delete this.tabIndexLocalOverrideTimer;
            // To original (base mixin already has an implementation)
            return origCallback.call(this);
        });
    }
    function inheritMethod(methodName, action) {
        var origCallback = Component.prototype[methodName];
        if (origCallback) {
            Component.prototype[methodName] = function () {
                return action.call(this, origCallback, arguments);
            };
        }
        else {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.error('FocusableComponentMixin: ' + methodName + ' is expected to exist and it doesn\'t!');
            }
        }
    }
}
exports.applyFocusableComponentMixin = applyFocusableComponentMixin;
exports.default = FocusManager;
