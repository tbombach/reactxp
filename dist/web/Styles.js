"use strict";
/**
* Styles.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of style functions.
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
var AppConfig_1 = require("../common/AppConfig");
var RX = require("../common/Interfaces");
var StyleLeakDetector_1 = require("../common/StyleLeakDetector");
var Styles = /** @class */ (function (_super) {
    __extends(Styles, _super);
    function Styles() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Use memoize to cache the result after the first call.
        _this._createDummyElement = _.memoize(function () {
            return document.createElement('testCss');
        });
        _this._getCssPropertyAliasesJsStyle = _.memoize(function () {
            var props = [
                'flex',
                'flexDirection',
                'alignItems',
                'justifyContent',
                'alignSelf',
                'alignContent',
                'transform',
                'transition',
                'animationDuration',
                'animationTimingFunction',
                'animationDirection',
                'animationDelay',
                'animationIterationCount',
                'animationName',
                'hyphens',
                'filter',
                'appRegion'
            ];
            var aliases = {};
            props.forEach(function (prop) {
                var alias = _this._getCssPropertyAlias(prop);
                if (alias && prop !== alias) {
                    aliases[prop] = alias;
                }
            });
            return aliases;
        });
        _this._cssPropertyAliasesCssStyle = memoize(function () {
            var jsStyleAliases = _this._getCssPropertyAliasesJsStyle();
            var aliases = {};
            _.each(_.keys(jsStyleAliases), function (prop) {
                aliases[prop] = _this.convertJsToCssStyle(jsStyleAliases[prop]);
            });
            return aliases;
        });
        return _this;
    }
    // Combines a set of styles
    Styles.prototype.combine = function (ruleSet1, ruleSet2) {
        if (!ruleSet1 && !ruleSet2) {
            return undefined;
        }
        var ruleSet = ruleSet1 ? (ruleSet2 ? [ruleSet1, ruleSet2] : ruleSet1) : ruleSet2;
        if (ruleSet instanceof Array) {
            var combinedStyles = {};
            for (var i = 0; i < ruleSet.length; i++) {
                var subRuleSet = this.combine(ruleSet[i]);
                combinedStyles = _.extend(combinedStyles, subRuleSet);
            }
            if (AppConfig_1.default.isDevelopmentMode()) {
                if ((combinedStyles.marginLeft !== undefined || combinedStyles.marginRight !== undefined ||
                    combinedStyles.marginTop !== undefined || combinedStyles.marginBottom !== undefined) &&
                    combinedStyles.margin !== undefined) {
                    console.error('Conflicting rules for margin specified.');
                    delete combinedStyles.margin;
                }
                if ((combinedStyles.paddingLeft !== undefined || combinedStyles.paddingRight !== undefined ||
                    combinedStyles.paddingTop !== undefined || combinedStyles.paddingBottom !== undefined) &&
                    combinedStyles.padding !== undefined) {
                    console.error('Conflicting rules for padding specified.');
                    delete combinedStyles.padding;
                }
            }
            if (combinedStyles.borderWidth ||
                combinedStyles.borderTopWidth || combinedStyles.borderRightWidth ||
                combinedStyles.borderBottomWidth || combinedStyles.borderLeftWidth) {
                // If the caller specified a non-zero border width
                // but no border color or style, set the defaults to
                // match those of React Native platforms.
                if (combinedStyles.borderColor === undefined) {
                    combinedStyles.borderColor = 'black';
                }
                if (combinedStyles.borderStyle === undefined) {
                    combinedStyles.borderStyle = 'solid';
                }
            }
            return combinedStyles;
        }
        return ruleSet;
    };
    // Creates opaque styles that can be used for View
    Styles.prototype.createViewStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for View
    Styles.prototype.createAnimatedViewStyle = function (ruleSet) {
        return this._adaptStyles(ruleSet, false);
    };
    // Creates opaque styles that can be used for ScrollView
    Styles.prototype.createScrollViewStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for Button
    Styles.prototype.createButtonStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for WebView
    Styles.prototype.createWebViewStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for Text
    Styles.prototype.createTextStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for Text
    Styles.prototype.createAnimatedTextStyle = function (ruleSet) {
        return this._adaptStyles(ruleSet, false);
    };
    // Creates opaque styles that can be used for TextInput
    Styles.prototype.createTextInputStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for TextInput
    Styles.prototype.createAnimatedTextInputStyle = function (ruleSet) {
        return this._adaptStyles(ruleSet, false);
    };
    // Creates opaque styles that can be used for Link
    Styles.prototype.createLinkStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for Image
    Styles.prototype.createImageStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Creates opaque styles that can be used for Image
    Styles.prototype.createAnimatedImageStyle = function (ruleSet) {
        return this._adaptStyles(ruleSet, false);
    };
    // Creates opaque styles that can be used for Picker
    Styles.prototype.createPickerStyle = function (ruleSet, cacheStyle) {
        if (cacheStyle === void 0) { cacheStyle = true; }
        return this._adaptStyles(ruleSet, cacheStyle);
    };
    // Returns the name of a CSS property or its alias. Returns undefined if the property is not supported.
    Styles.prototype._getCssPropertyAlias = function (name) {
        // If we're inside unit tests, document may not be defined yet. We don't need prefixes for tests
        if (typeof document === 'undefined') {
            return undefined;
        }
        var upperName = name.charAt(0).toUpperCase() + name.slice(1);
        var propsToTest = [name, upperName];
        propsToTest = propsToTest.concat(['Webkit', 'webkit', 'Moz', 'O', 'ms'].map(function (prefix) { return prefix + upperName; }));
        var testElement = this._createDummyElement();
        var styleObj = testElement.style;
        for (var i = 0; i < propsToTest.length; i++) {
            var prop = propsToTest[i];
            if (styleObj[prop] !== undefined) {
                return prop;
            }
        }
        return undefined;
    };
    // Converts a property from JavaScript style (camel-case) to CSS style (lowercase with hyphens).
    Styles.prototype.convertJsToCssStyle = function (prop) {
        var cssString = '';
        if (prop) {
            for (var i = 0; i < prop.length; i++) {
                var lowerChar = prop[i].toLowerCase();
                if (lowerChar === prop[i]) {
                    cssString += lowerChar;
                }
                else {
                    cssString += '-' + lowerChar;
                }
            }
        }
        return cssString;
    };
    Styles.prototype.getCssPropertyAliasesCssStyle = function () {
        return this._cssPropertyAliasesCssStyle();
    };
    Styles.prototype.getParentComponentName = function (component) {
        var parentConstructor;
        var internalInstance = component['_reactInternalInstance'];
        if (internalInstance && internalInstance._currentElement &&
            internalInstance._currentElement._owner && internalInstance._currentElement._owner._instance) {
            parentConstructor = internalInstance._currentElement._owner._instance.constructor;
        }
        if (!parentConstructor) {
            return '';
        }
        return parentConstructor.name ? parentConstructor.name : parentConstructor;
    };
    Styles.prototype._adaptStyles = function (def, validate) {
        if (validate) {
            StyleLeakDetector_1.default.detectLeaks(def);
        }
        // Expand composite types.
        if (def.font) {
            if (def.font.fontFamily !== undefined) {
                def.fontFamily = def.font.fontFamily;
            }
            if (def.font.fontWeight !== undefined) {
                def.fontWeight = def.font.fontWeight;
            }
            if (def.font.fontStyle !== undefined) {
                def.fontStyle = def.font.fontStyle;
            }
            delete def.font;
        }
        if (def.flex !== undefined) {
            var flexValue = def.flex;
            delete def.flex;
            if (flexValue > 0) {
                // p 1 auto
                def.flexGrow = flexValue;
                def.flexShrink = 1;
            }
            else if (flexValue < 0) {
                // 0 -n auto
                def.flexGrow = 0;
                def.flexShrink = -flexValue;
            }
            else {
                // 0 0 auto
                def.flexGrow = 0;
                def.flexShrink = 0;
            }
        }
        if (def.transform) {
            var transformStrings_1 = [];
            var animatedTransforms_1 = {};
            var staticTransforms_1 = {};
            _.each(def.transform, function (t) {
                _.each(_.keys(t), function (key) {
                    // Animated transforms use Animated.Value objects rather
                    // than strings. We need to store these separately.
                    if (typeof t[key] === 'object') {
                        animatedTransforms_1[key] = t[key];
                    }
                    else {
                        var value = t[key].toString();
                        if (key.indexOf('rotate') === 0) {
                            value += 'deg';
                        }
                        else if (key.indexOf('translate') === 0) {
                            value += 'px';
                        }
                        transformStrings_1.push(key + '(' + value + ')');
                        staticTransforms_1[key] = value;
                    }
                });
            });
            delete def.transform;
            if (transformStrings_1.length > 0) {
                def['transform'] = transformStrings_1.join(' ');
            }
            if (_.keys(animatedTransforms_1).length > 0) {
                def['animatedTransforms'] = animatedTransforms_1;
                def['staticTransforms'] = staticTransforms_1;
            }
        }
        if (def.shadowOffset !== undefined || def.shadowRadius !== undefined || def.shadowColor !== undefined) {
            var width = 0;
            var height = 0;
            var radius = 0;
            var color = 'black';
            if (def.shadowOffset !== undefined) {
                width = def.shadowOffset.width;
                height = def.shadowOffset.height;
                delete def.shadowOffset;
            }
            if (def.shadowRadius !== undefined) {
                radius = def.shadowRadius;
                delete def.shadowRadius;
            }
            if (def.shadowColor !== undefined) {
                color = def.shadowColor;
                delete def.shadowColor;
            }
            def['boxShadow'] = width + 'px ' + height + 'px ' + radius + 'px 0px ' + color;
        }
        // CSS (and React JS) support lineHeight defined as either a multiple of the font
        // size or a pixel count. The Types interface always uses a pixel count. We need to
        // convert to the string notation to make CSS happy.
        if (def.lineHeight !== undefined) {
            def['lineHeight'] = def.lineHeight + 'px';
        }
        // Add default border width if border style or some subset of border widths
        // were provided. Otherwise the browser will default to a two-pixel border.
        if (def.borderStyle || def.borderTopWidth || def.borderRightWidth || def.borderBottomWidth || def.borderLeftWidth) {
            if (def.borderWidth === undefined) {
                if (def.borderTopWidth === undefined) {
                    def.borderTopWidth = 0;
                }
                if (def.borderRightWidth === undefined) {
                    def.borderRightWidth = 0;
                }
                if (def.borderBottomWidth === undefined) {
                    def.borderBottomWidth = 0;
                }
                if (def.borderLeftWidth === undefined) {
                    def.borderLeftWidth = 0;
                }
            }
        }
        // CSS doesn't support vertical/horizontal margins or padding.
        if (def.marginVertical !== undefined) {
            def.marginTop = def.marginVertical;
            def.marginBottom = def.marginVertical;
            delete def.marginVertical;
        }
        if (def.marginHorizontal !== undefined) {
            def.marginLeft = def.marginHorizontal;
            def.marginRight = def.marginHorizontal;
            delete def.marginHorizontal;
        }
        if (AppConfig_1.default.isDevelopmentMode()) {
            if ((def.marginHorizontal !== undefined || def.marginVertical !== undefined ||
                def.marginLeft !== undefined || def.marginRight !== undefined ||
                def.marginTop !== undefined || def.marginBottom !== undefined) && def.margin !== undefined) {
                console.error('Conflicting rules for margin specified.');
                delete def.margin;
            }
        }
        if (def.paddingVertical !== undefined) {
            def.paddingTop = def.paddingVertical;
            def.paddingBottom = def.paddingVertical;
            delete def.paddingVertical;
        }
        if (def.paddingHorizontal !== undefined) {
            def.paddingLeft = def.paddingHorizontal;
            def.paddingRight = def.paddingHorizontal;
            delete def.paddingHorizontal;
        }
        if (AppConfig_1.default.isDevelopmentMode()) {
            if ((def.paddingHorizontal !== undefined || def.paddingVertical !== undefined ||
                def.paddingLeft !== undefined || def.paddingRight !== undefined ||
                def.paddingTop !== undefined || def.paddingBottom !== undefined) && def.padding !== undefined) {
                console.error('Conflicting rules for padding specified.');
                delete def.padding;
            }
        }
        // CSS doesn't support 'textDecorationLine'
        if (def.textDecorationLine !== undefined) {
            def['textDecoration'] = def.textDecorationLine;
            delete def.textDecorationLine;
        }
        // Add common aliases if necessary.
        var jsAliases = this._getCssPropertyAliasesJsStyle();
        for (var prop in jsAliases) {
            if (def[prop] !== undefined && jsAliases[prop]) {
                def[jsAliases[prop]] = def[prop];
            }
        }
        // Add IE-specific word wrap property.
        if (def.wordBreak === 'break-word') {
            def['wordWrap'] = 'break-word';
        }
        return AppConfig_1.default.isDevelopmentMode() ? Object.freeze(def) : def;
    };
    return Styles;
}(RX.Styles));
exports.Styles = Styles;
function memoize(func, resolver) {
    return _.memoize(func, resolver);
}
exports.memoize = memoize;
exports.default = new Styles();
