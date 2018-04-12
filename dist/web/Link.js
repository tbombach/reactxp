"use strict";
/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Link abstraction.
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
var React = require("react");
var Styles_1 = require("./Styles");
var FocusManager_1 = require("./utils/FocusManager");
var _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch',
        overflowWrap: 'break-word',
        msHyphens: 'auto'
    },
    ellipsis: {
        position: 'relative',
        display: 'inline',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
        overflow: 'hidden',
        alignItems: 'stretch',
        whiteSpace: 'pre',
        textOverflow: 'ellipsis'
    }
};
var _longPressTime = 1000;
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onClick = function (e) {
            e.stopPropagation();
            if (_this.props.onPress) {
                e.preventDefault();
                _this.props.onPress(e, _this.props.url);
            }
        };
        _this._onMouseDown = function (e) {
            if (_this.props.onLongPress) {
                e.persist();
                _this._longPressTimer = setTimeout(function () {
                    _this._longPressTimer = undefined;
                    if (_this.props.onLongPress) {
                        _this.props.onLongPress(e, _this.props.url);
                    }
                }, _longPressTime);
            }
        };
        _this._onMouseUp = function (e) {
            if (_this._longPressTimer) {
                clearTimeout(_this._longPressTimer);
                _this._longPressTimer = undefined;
            }
        };
        return _this;
    }
    Link.prototype.render = function () {
        // SECURITY WARNING:
        //   Note the use of rel='noreferrer'
        //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
        //   See: https://mathiasbynens.github.io/rel-noopener/
        return (React.createElement("a", { style: this._getStyles(), title: this.props.title, href: this.props.url, target: '_blank', rel: 'noreferrer', onClick: this._onClick, onMouseEnter: this.props.onHoverStart, onMouseLeave: this.props.onHoverEnd, onMouseDown: this._onMouseDown, onMouseUp: this._onMouseUp, tabIndex: this.props.tabIndex }, this.props.children));
    };
    Link.prototype._getStyles = function () {
        // There's no way in HTML to properly handle numberOfLines > 1,
        // but we can correctly handle the common case where numberOfLines is 1.
        var combinedStyles = Styles_1.default.combine([this.props.numberOfLines === 1 ? _styles.ellipsis : _styles.defaultStyle,
            this.props.style]);
        // Handle cursor styles
        if (this.props.selectable) {
            combinedStyles['userSelect'] = 'text';
            combinedStyles['WebkitUserSelect'] = 'text';
            combinedStyles['MozUserSelect'] = 'text';
            combinedStyles['msUserSelect'] = 'text';
        }
        combinedStyles['cursor'] = 'pointer';
        return combinedStyles;
    };
    return Link;
}(React.Component));
exports.Link = Link;
FocusManager_1.applyFocusableComponentMixin(Link);
exports.default = Link;
