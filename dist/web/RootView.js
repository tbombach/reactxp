"use strict";
/**
* RootView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The top-most view (rendered into window.body) that's used for proper
* layering or modals, etc. in the web implementation of the ReactXP
* cross-platform library.
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
var _ = require("./utils/lodashMini");
var React = require("react");
var ReactDOM = require("react-dom");
var PropTypes = require("prop-types");
var AccessibilityAnnouncer_1 = require("./AccessibilityAnnouncer");
var Input_1 = require("./Input");
var ModalContainer_1 = require("./ModalContainer");
var FocusManager_1 = require("./utils/FocusManager");
var UserInterface_1 = require("./UserInterface");
var PopupContainer_1 = require("./PopupContainer");
var PopupDescriptor = /** @class */ (function () {
    function PopupDescriptor(popupId, popupOptions) {
        this.popupId = popupId;
        this.popupOptions = popupOptions;
    }
    return PopupDescriptor;
}());
exports.PopupDescriptor = PopupDescriptor;
// Width of the "alley" around popups so they don't get too close to the boundary of the window.
var _popupAlleyWidth = 8;
// How close to the edge of the popup should we allow the anchor offset to get before
// attempting a different position?
var _minAnchorOffset = 16;
// Button code for when right click is pressed in a mouse event
var _rightClickButtonCode = 2;
var KEY_CODE_TAB = 9;
var KEY_CODE_ESC = 27;
// Setting the expected default box-sizing for everything.
if (typeof document !== 'undefined') {
    var defaultBoxSizing = '*, *:before, *:after { box-sizing: border-box; }';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(defaultBoxSizing));
    document.head.appendChild(style);
}
var RootView = /** @class */ (function (_super) {
    __extends(RootView, _super);
    function RootView(props) {
        var _this = _super.call(this, props) || this;
        _this._clickHandlerInstalled = false;
        _this._keyboardHandlerInstalled = false;
        _this._isNavigatingWithKeyboard = false;
        _this._shouldEnableKeyboardNavigationModeOnFocus = false;
        _this._applicationIsNotActive = false;
        _this._onMount = function (component) {
            _this._mountedComponent = component ? ReactDOM.findDOMNode(component) : undefined;
        };
        _this._tryClosePopup = function (e) {
            // Dismiss a visible popup if there's a click outside.
            var popupContainer = _this._mountedComponent;
            if (!popupContainer) {
                return;
            }
            var clickInPopup = false;
            var el = e.target;
            while (el) {
                if (el === popupContainer) {
                    clickInPopup = true;
                    break;
                }
                el = el.parentElement || undefined;
            }
            if (!clickInPopup && e.button !== _rightClickButtonCode) {
                _.defer(function () {
                    if (_this.props.activePopup) {
                        var anchorReference = _this.props.activePopup.popupOptions.getAnchor();
                        var isClickOnAnchor = _this._determineIfClickOnElement(anchorReference, e.srcElement);
                        var isClickOnContainer = false;
                        if (!isClickOnAnchor && _this.props.activePopup.popupOptions.getElementTriggeringPopup) {
                            var containerRef = _this.props.activePopup.popupOptions.getElementTriggeringPopup();
                            isClickOnContainer = _this._determineIfClickOnElement(containerRef, e.srcElement);
                        }
                        if (isClickOnAnchor || isClickOnContainer) {
                            // If the press event was on the anchor, we can notify the caller about it.
                            // Showing another animation while dimissing the popup creates a conflict in the UI making it not doing one of the
                            // two animations (i.e.: Opening an actionsheet while dismissing a popup). We introduce this delay to make sure
                            // the popup dimissing animation has finished before we call the event handler.
                            if (_this.props.activePopup.popupOptions.onAnchorPressed) {
                                setTimeout(function () {
                                    // We can't pass through the DOM event argument to the anchor event handler as the event we have at this
                                    // point is a DOM Event and the anchor expect a Synthetic event. There doesn't seem to be any way to convert
                                    // between them. Passing null for now.
                                    _this.props.activePopup.popupOptions.onAnchorPressed(undefined);
                                }, 500);
                            }
                            // If the popup is meant to behave like a toggle, we should not dimiss the popup from here since the event came
                            // from the anchor/container of the popup. The popup will be dismissed during the click handling of the
                            // anchor/container.
                            if (_this.props.activePopup.popupOptions.dismissIfShown) {
                                return;
                            }
                        }
                        if (_this.props.activePopup.popupOptions.preventDismissOnPress) {
                            return;
                        }
                    }
                    _this._dismissPopup();
                });
            }
        };
        _this._onMouseDownCapture = function (e) {
            if (e &&
                (e.clientX === 0) && (e.clientY === 0) &&
                (e.screenX === 0) && (e.screenY === 0)) {
                // This is most likely an event triggered by NVDA when Enter or
                // Space is pressed, do not dismiss the keyboard navigation mode.
                return;
            }
            _this._shouldEnableKeyboardNavigationModeOnFocus = false;
            _this._updateKeyboardNavigationState(false);
        };
        _this._onKeyDownCapture = function (e) {
            if (e.keyCode === KEY_CODE_TAB) {
                _this._updateKeyboardNavigationState(true);
            }
            if (e.keyCode === KEY_CODE_ESC) {
                // If Esc is pressed and the focused element stays the same after some time,
                // switch the keyboard navigation off to dismiss the outline.
                var activeElement_1 = document.activeElement;
                if (_this._isNavigatingWithKeyboardUpateTimer) {
                    clearTimeout(_this._isNavigatingWithKeyboardUpateTimer);
                }
                _this._isNavigatingWithKeyboardUpateTimer = window.setTimeout(function () {
                    _this._isNavigatingWithKeyboardUpateTimer = undefined;
                    if ((document.activeElement === activeElement_1) && activeElement_1 && (activeElement_1 !== document.body)) {
                        _this._updateKeyboardNavigationState(false);
                    }
                }, 500);
            }
        };
        _this._onFocusIn = function (e) {
            // When the screen reader is being used, we need to enable the keyboard navigation
            // mode. It's not possible to detect the screen reader on web. To work it around we
            // apply the following assumption: if the focus is moved without using the mouse and
            // not from the application code with focus() method, it is most likely moved by the
            // screen reader.
            _this._cancelApplicationIsNotActive();
            var target = e.target;
            var prev = _this._prevFocusedElement;
            var curShouldEnable = _this._shouldEnableKeyboardNavigationModeOnFocus;
            _this._prevFocusedElement = target;
            _this._shouldEnableKeyboardNavigationModeOnFocus = true;
            if (_this._applicationIsNotActive) {
                _this._applicationIsNotActive = false;
                return;
            }
            if ((prev === target) || (target === FocusManager_1.default.getLastFocusedProgrammatically(true))) {
                return;
            }
            if (!_this._isNavigatingWithKeyboard && curShouldEnable) {
                _this._updateKeyboardNavigationState(true);
            }
        };
        _this._onFocusOut = function (e) {
            // If the focus is out and nothing is focused after some time, most likely
            // the application has been deactivated, so the next focusin will be about
            // activating the application back again and should be ignored.
            // This is a safety pillow for checking that _prevFocusedElement is changed,
            // as _prevFocusedElement might be gone while the application is not active.
            _this._requestApplicationIsNotActive();
        };
        _this._onKeyDown = function (e) {
            Input_1.default.dispatchKeyDown(e);
        };
        _this._onKeyUp = function (e) {
            if (_this.props.activePopup && (e.keyCode === KEY_CODE_ESC)) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                _this._dismissPopup();
                return;
            }
            Input_1.default.dispatchKeyUp(e);
        };
        _this.state = _this._getInitialState();
        // Initialize the root FocusManager which is aware of all
        // focusable elements.
        _this._focusManager = new FocusManager_1.default(undefined);
        return _this;
    }
    RootView.prototype.getChildContext = function () {
        // Provide the context with root FocusManager to all descendants.
        return {
            focusManager: this._focusManager
        };
    };
    RootView.prototype._getInitialState = function () {
        return {
            isMeasuringPopup: true,
            anchorPosition: 'left',
            anchorOffset: 0,
            popupTop: 0,
            popupLeft: 0,
            popupWidth: 0,
            popupHeight: 0,
            constrainedPopupWidth: 0,
            constrainedPopupHeight: 0,
            isMouseInPopup: false,
            focusClass: this.props.mouseFocusOutline
        };
    };
    RootView.prototype.componentWillReceiveProps = function (prevProps) {
        if (this.props.activePopup !== prevProps.activePopup) {
            this._stopHidePopupTimer();
            // If the popup changes, reset our state.
            this.setState(this._getInitialState());
        }
    };
    RootView.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.props.activePopup) {
            this._stopHidePopupTimer();
            this._recalcPosition();
            if (!this._respositionPopupTimer) {
                this._startRepositionPopupTimer();
            }
            if (!this.state.isMouseInPopup) {
                this._startHidePopupTimer();
            }
            if (!this._clickHandlerInstalled) {
                document.addEventListener('mousedown', this._tryClosePopup);
                document.addEventListener('touchstart', this._tryClosePopup);
                this._clickHandlerInstalled = true;
            }
        }
        else {
            this._stopRepositionPopupTimer();
            if (this._clickHandlerInstalled) {
                document.removeEventListener('mousedown', this._tryClosePopup);
                document.removeEventListener('touchstart', this._tryClosePopup);
                this._clickHandlerInstalled = false;
            }
        }
    };
    RootView.prototype.componentDidMount = function () {
        if (this.props.activePopup) {
            this._recalcPosition();
        }
        if (!this.state.isMouseInPopup) {
            this._startHidePopupTimer();
        }
        if (this.props.activePopup) {
            this._startRepositionPopupTimer();
        }
        if (!this._keyboardHandlerInstalled) {
            window.addEventListener('keydown', this._onKeyDown);
            window.addEventListener('keyup', this._onKeyUp);
            window.addEventListener('keydown', this._onKeyDownCapture, true); // Capture!
            window.addEventListener('mousedown', this._onMouseDownCapture, true); // Capture!
            window.addEventListener('focusin', this._onFocusIn);
            window.addEventListener('focusout', this._onFocusOut);
            this._keyboardHandlerInstalled = true;
        }
    };
    RootView.prototype.componentWillUnmount = function () {
        this._stopHidePopupTimer();
        this._stopRepositionPopupTimer();
        if (this._keyboardHandlerInstalled) {
            window.removeEventListener('keydown', this._onKeyDown);
            window.removeEventListener('keyup', this._onKeyUp);
            window.removeEventListener('keydown', this._onKeyDownCapture, true);
            window.removeEventListener('mousedown', this._onMouseDownCapture, true);
            window.removeEventListener('focusin', this._onFocusIn);
            window.removeEventListener('focusout', this._onFocusOut);
            this._keyboardHandlerInstalled = false;
        }
    };
    RootView.prototype._renderPopup = function (popup, hidden) {
        var _this = this;
        var popupContainerStyle = {
            display: 'flex',
            position: 'fixed',
            zIndex: 100001
        };
        if (!hidden) {
            popupContainerStyle['top'] = this.state.popupTop;
            popupContainerStyle['left'] = this.state.popupLeft;
            // Are we artificially constraining the width and/or height?
            if (this.state.constrainedPopupWidth && this.state.constrainedPopupWidth !== this.state.popupWidth) {
                popupContainerStyle['width'] = this.state.constrainedPopupWidth;
            }
            if (this.state.constrainedPopupHeight && this.state.constrainedPopupHeight !== this.state.popupHeight) {
                popupContainerStyle['height'] = this.state.constrainedPopupHeight;
            }
        }
        var key = (popup.popupOptions.cacheable ? 'CP:' : 'P:') + popup.popupId;
        var renderedPopup = (hidden ?
            popup.popupOptions.renderPopup('top', 0, 0, 0) :
            popup.popupOptions.renderPopup(this.state.anchorPosition, this.state.anchorOffset, this.state.constrainedPopupWidth, this.state.constrainedPopupHeight));
        return (React.createElement(PopupContainer_1.default, { key: key, style: popupContainerStyle, hidden: hidden, ref: hidden ? undefined : this._onMount, onMouseEnter: function (e) { return _this._onMouseEnter(e); }, onMouseLeave: function (e) { return _this._onMouseLeave(e); } }, renderedPopup));
    };
    RootView.prototype.render = function () {
        var _this = this;
        var rootViewStyle = {
            width: '100%',
            height: '100%',
            display: 'flex',
            cursor: 'default'
        };
        var optionalPopups = [];
        if (this.props.activePopup) {
            optionalPopups.push(this._renderPopup(this.props.activePopup, false));
        }
        if (this.props.cachedPopup) {
            this.props.cachedPopup.map(function (popup) { return optionalPopups.push(_this._renderPopup(popup, true)); });
        }
        var optionalModal = null;
        if (this.props.modal) {
            optionalModal = (React.createElement(ModalContainer_1.default, null, this.props.modal));
        }
        return (React.createElement("div", { className: this.state.focusClass, style: rootViewStyle },
            this.props.mainView,
            optionalModal,
            optionalPopups,
            React.createElement(AccessibilityAnnouncer_1.default, null)));
    };
    RootView.prototype._determineIfClickOnElement = function (elementReference, eventSource) {
        var element = ReactDOM.findDOMNode(elementReference);
        var isClickOnElement = element && !!eventSource && element.contains(eventSource);
        return isClickOnElement;
    };
    RootView.prototype._requestApplicationIsNotActive = function () {
        var _this = this;
        this._cancelApplicationIsNotActive();
        this._applicationIsNotActiveTimer = setTimeout(function () {
            _this._applicationIsNotActiveTimer = undefined;
            _this._applicationIsNotActive = true;
        }, 100);
    };
    RootView.prototype._cancelApplicationIsNotActive = function () {
        if (this._applicationIsNotActiveTimer) {
            clearTimeout(this._applicationIsNotActiveTimer);
            this._applicationIsNotActiveTimer = undefined;
        }
    };
    RootView.prototype._updateKeyboardNavigationState = function (isNavigatingWithKeyboard) {
        if (this._isNavigatingWithKeyboardUpateTimer) {
            clearTimeout(this._isNavigatingWithKeyboardUpateTimer);
            this._isNavigatingWithKeyboardUpateTimer = undefined;
        }
        if (this._isNavigatingWithKeyboard !== isNavigatingWithKeyboard) {
            this._isNavigatingWithKeyboard = isNavigatingWithKeyboard;
            UserInterface_1.default.keyboardNavigationEvent.fire(isNavigatingWithKeyboard);
            var focusClass = isNavigatingWithKeyboard ? this.props.keyBoardFocusOutline : this.props.mouseFocusOutline;
            if (this.state.focusClass !== focusClass) {
                this.setState({ focusClass: focusClass });
            }
        }
    };
    RootView.prototype._onMouseEnter = function (e) {
        this.setState({
            isMouseInPopup: true
        });
        this._stopHidePopupTimer();
    };
    RootView.prototype._onMouseLeave = function (e) {
        this.setState({
            isMouseInPopup: false
        });
        this._startHidePopupTimer();
    };
    RootView.prototype._startHidePopupTimer = function () {
        var _this = this;
        if (this.props.autoDismiss) {
            // Should we immediately hide it, or did the caller request a delay?
            if (!_.isUndefined(this.props.autoDismissDelay) && this.props.autoDismissDelay > 0) {
                this._hidePopupTimer = window.setTimeout(function () {
                    _this._hidePopupTimer = undefined;
                    _this._dismissPopup();
                }, this.props.autoDismissDelay);
            }
            else {
                this._dismissPopup();
            }
        }
    };
    RootView.prototype._stopHidePopupTimer = function () {
        if (this._hidePopupTimer) {
            clearTimeout(this._hidePopupTimer);
            this._hidePopupTimer = undefined;
        }
    };
    RootView.prototype._dismissPopup = function () {
        if (this.props.onDismissPopup) {
            this.props.onDismissPopup();
        }
    };
    RootView.prototype._startRepositionPopupTimer = function () {
        var _this = this;
        this._respositionPopupTimer = setInterval(function () {
            _this._recalcPosition();
        }, 500);
    };
    RootView.prototype._stopRepositionPopupTimer = function () {
        if (this._respositionPopupTimer) {
            clearInterval(this._respositionPopupTimer);
            this._respositionPopupTimer = undefined;
        }
    };
    // Recalculates the position and constrained size of the popup based on the current position of the anchor and the
    // window size. If necessary, it also measures the unconstrained size of the popup.
    RootView.prototype._recalcPosition = function () {
        // Make a copy of the old state.
        var newState = _.extend({}, this.state);
        if (this.state.isMeasuringPopup) {
            // Get the width/height of the popup.
            var popup = this._mountedComponent;
            if (!popup) {
                return;
            }
            newState.isMeasuringPopup = false;
            newState.popupHeight = popup.clientHeight;
            newState.popupWidth = popup.clientWidth;
        }
        // Get the anchor element.
        var anchorComponent = this.props.activePopup.popupOptions.getAnchor();
        // if the anchor is unmounted, dismiss the popup.
        // Prevents app crash when we try to get dom node from unmounted Component
        if (!anchorComponent) {
            this._dismissPopup();
            return;
        }
        var anchor = ReactDOM.findDOMNode(anchorComponent);
        // If the anchor has disappeared, dismiss the popup.
        if (!anchor) {
            this._dismissPopup();
            return;
        }
        // Start by assuming that we'll be unconstrained.
        newState.constrainedPopupHeight = newState.popupHeight;
        newState.constrainedPopupWidth = newState.popupWidth;
        // Get the width/height of the full window.
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        // Calculate the absolute position of the anchor element's top/left.
        var anchorRect = anchor.getBoundingClientRect();
        // If the anchor is no longer in the window's bounds, cancel the popup.
        if (anchorRect.left >= windowWidth || anchorRect.right <= 0 ||
            anchorRect.bottom <= 0 || anchorRect.top >= windowHeight) {
            this._dismissPopup();
            return;
        }
        var positionsToTry = this.props.activePopup.popupOptions.positionPriorities;
        if (!positionsToTry || positionsToTry.length === 0) {
            positionsToTry = ['bottom', 'right', 'top', 'left'];
        }
        if (this.props.activePopup.popupOptions.useInnerPositioning) {
            // If the popup is meant to be shown inside the anchor we need to recalculate
            // the position differently.
            this._recalcInnerPosition(anchorRect, newState);
            return;
        }
        var foundPerfectFit = false;
        var foundPartialFit = false;
        positionsToTry.forEach(function (pos) {
            if (!foundPerfectFit) {
                var absLeft = 0;
                var absTop = 0;
                var anchorOffset = 0;
                var constrainedWidth = 0;
                var constrainedHeight = 0;
                switch (pos) {
                    case 'bottom':
                        absTop = anchorRect.bottom;
                        absLeft = anchorRect.left + (anchorRect.width - newState.popupWidth) / 2;
                        anchorOffset = newState.popupWidth / 2;
                        if (newState.popupHeight <= windowHeight - _popupAlleyWidth - anchorRect.bottom) {
                            foundPerfectFit = true;
                        }
                        else if (!foundPartialFit) {
                            constrainedHeight = windowHeight - _popupAlleyWidth - anchorRect.bottom;
                        }
                        break;
                    case 'top':
                        absTop = anchorRect.top - newState.popupHeight;
                        absLeft = anchorRect.left + (anchorRect.width - newState.popupWidth) / 2;
                        anchorOffset = newState.popupWidth / 2;
                        if (newState.popupHeight <= anchorRect.top - _popupAlleyWidth) {
                            foundPerfectFit = true;
                        }
                        else if (!foundPartialFit) {
                            constrainedHeight = anchorRect.top - _popupAlleyWidth;
                        }
                        break;
                    case 'right':
                        absLeft = anchorRect.right;
                        absTop = anchorRect.top + (anchorRect.height - newState.popupHeight) / 2;
                        anchorOffset = newState.popupHeight / 2;
                        if (newState.popupWidth <= windowWidth - _popupAlleyWidth - anchorRect.right) {
                            foundPerfectFit = true;
                        }
                        else if (!foundPartialFit) {
                            constrainedWidth = windowWidth - _popupAlleyWidth - anchorRect.right;
                        }
                        break;
                    case 'left':
                        absLeft = anchorRect.left - newState.popupWidth;
                        absTop = anchorRect.top + (anchorRect.height - newState.popupHeight) / 2;
                        anchorOffset = newState.popupHeight / 2;
                        if (newState.popupWidth <= anchorRect.left - _popupAlleyWidth) {
                            foundPerfectFit = true;
                        }
                        else if (!foundPartialFit) {
                            constrainedWidth = anchorRect.left - _popupAlleyWidth;
                        }
                        break;
                }
                var effectiveWidth = constrainedWidth || newState.popupWidth;
                var effectiveHeight = constrainedHeight || newState.popupHeight;
                // Make sure we're not hanging off the bounds of the window.
                if (absLeft < _popupAlleyWidth) {
                    if (pos === 'top' || pos === 'bottom') {
                        anchorOffset -= _popupAlleyWidth - absLeft;
                        if (anchorOffset < _minAnchorOffset || anchorOffset > effectiveWidth - _minAnchorOffset) {
                            foundPerfectFit = false;
                        }
                    }
                    absLeft = _popupAlleyWidth;
                }
                else if (absLeft > windowWidth - _popupAlleyWidth - effectiveWidth) {
                    if (pos === 'top' || pos === 'bottom') {
                        anchorOffset -= (windowWidth - _popupAlleyWidth - effectiveWidth - absLeft);
                        if (anchorOffset < _minAnchorOffset || anchorOffset > effectiveWidth - _minAnchorOffset) {
                            foundPerfectFit = false;
                        }
                    }
                    absLeft = windowWidth - _popupAlleyWidth - effectiveWidth;
                }
                if (absTop < _popupAlleyWidth) {
                    if (pos === 'right' || pos === 'left') {
                        anchorOffset += absTop - _popupAlleyWidth;
                        if (anchorOffset < _minAnchorOffset || anchorOffset > effectiveHeight - _minAnchorOffset) {
                            foundPerfectFit = false;
                        }
                    }
                    absTop = _popupAlleyWidth;
                }
                else if (absTop > windowHeight - _popupAlleyWidth - effectiveHeight) {
                    if (pos === 'right' || pos === 'left') {
                        anchorOffset -= (windowHeight - _popupAlleyWidth - effectiveHeight - absTop);
                        if (anchorOffset < _minAnchorOffset || anchorOffset > effectiveHeight - _minAnchorOffset) {
                            foundPerfectFit = false;
                        }
                    }
                    absTop = windowHeight - _popupAlleyWidth - effectiveHeight;
                }
                if (foundPerfectFit || effectiveHeight > 0 || effectiveWidth > 0) {
                    newState.popupTop = absTop;
                    newState.popupLeft = absLeft;
                    newState.anchorOffset = anchorOffset;
                    newState.anchorPosition = pos;
                    newState.constrainedPopupWidth = effectiveWidth;
                    newState.constrainedPopupHeight = effectiveHeight;
                    foundPartialFit = true;
                }
            }
        });
        if (!_.isEqual(newState, this.state)) {
            this.setState(newState);
        }
    };
    RootView.prototype._recalcInnerPosition = function (anchorRect, newState) {
        // For inner popups we only accept the first position of the priorities since there should always be room for the bubble.
        var pos = this.props.activePopup.popupOptions.positionPriorities[0];
        switch (pos) {
            case 'top':
                newState.popupTop = anchorRect.top + anchorRect.height - newState.constrainedPopupHeight;
                newState.popupLeft = anchorRect.left + anchorRect.height / 2 - newState.constrainedPopupWidth / 2;
                newState.anchorOffset = newState.popupWidth / 2;
                break;
            case 'bottom':
                newState.popupTop = anchorRect.top + newState.constrainedPopupHeight;
                newState.popupLeft = anchorRect.left + anchorRect.height / 2 - newState.constrainedPopupWidth / 2;
                newState.anchorOffset = newState.popupWidth / 2;
                break;
            case 'left':
                newState.popupTop = anchorRect.top + anchorRect.height / 2 - newState.constrainedPopupHeight / 2;
                newState.popupLeft = anchorRect.left + anchorRect.width - newState.constrainedPopupWidth;
                newState.anchorOffset = newState.popupHeight / 2;
                break;
            case 'right':
                newState.popupTop = anchorRect.top + anchorRect.height / 2 - newState.constrainedPopupHeight / 2;
                newState.popupLeft = anchorRect.left;
                newState.anchorOffset = newState.popupHeight / 2;
                break;
        }
        newState.anchorPosition = pos;
        if (!_.isEqual(newState, this.state)) {
            this.setState(newState);
        }
    };
    RootView.childContextTypes = {
        focusManager: PropTypes.object
    };
    return RootView;
}(React.Component));
exports.RootView = RootView;
exports.default = RootView;
