"use strict";
/**
* RootView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The top-most view that's used for proper layering or modals and popups.
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var RN = require("react-native");
var _ = require("./lodashMini");
var Accessibility_1 = require("./Accessibility");
var AccessibilityUtil_1 = require("./AccessibilityUtil");
var App_1 = require("./App");
var AppConfig_1 = require("../common/AppConfig");
var FrontLayerViewManager_1 = require("./FrontLayerViewManager");
var MainViewStore_1 = require("./MainViewStore");
var Styles_1 = require("./Styles");
var Types = require("../common/Types");
var _styles = {
    rootViewStyle: Styles_1.default.createViewStyle({
        flex: 1,
        alignItems: 'stretch',
        overflow: 'visible'
    }),
    liveRegionContainer: Styles_1.default.createViewStyle({
        position: 'absolute',
        opacity: 0,
        top: -30,
        bottom: 0,
        left: 0,
        right: 0,
        height: 30
    })
};
// Abstract RootView class which handles rendering, front layer view changes and announcement
// changes. Subclasses must set the mainView state value.
var BaseRootView = /** @class */ (function (_super) {
    __extends(BaseRootView, _super);
    function BaseRootView(props) {
        var _this = _super.call(this, props) || this;
        _this._mainViewProps = _this._getPropsForMainView();
        return _this;
    }
    BaseRootView.prototype.componentWillMount = function () {
        var _this = this;
        this._frontLayerViewChangedSubscription = FrontLayerViewManager_1.default.event_changed.subscribe(function () {
            // Setting empty state will trigger a render.
            _this.setState({});
        });
        // Update announcement text.
        this._newAnnouncementEventChangedSubscription =
            Accessibility_1.default.newAnnouncementReadyEvent.subscribe(function (announcement) {
                _this.setState({
                    announcementText: announcement
                });
            });
        this._memoryWarningEventSubscription = App_1.default.memoryWarningEvent.subscribe(function () {
            FrontLayerViewManager_1.default.releaseCachedPopups();
            _this.forceUpdate();
        });
    };
    BaseRootView.prototype.componentWillUnmount = function () {
        if (this._frontLayerViewChangedSubscription) {
            this._frontLayerViewChangedSubscription.unsubscribe();
            this._frontLayerViewChangedSubscription = undefined;
        }
        if (this._newAnnouncementEventChangedSubscription) {
            this._newAnnouncementEventChangedSubscription.unsubscribe();
            this._newAnnouncementEventChangedSubscription = undefined;
        }
        if (this._memoryWarningEventSubscription) {
            this._memoryWarningEventSubscription.unsubscribe();
            this._memoryWarningEventSubscription = undefined;
        }
    };
    BaseRootView.prototype.render = function () {
        var modalLayerView = FrontLayerViewManager_1.default.getModalLayerView(this._rootViewId);
        var popupLayerView = FrontLayerViewManager_1.default.getPopupLayerView(this._rootViewId);
        // When showing a modal/popup we want to hide the mainView shown behind from an accessibility
        // standpoint to ensure that it won't get the focus and the screen reader's attention.
        var importantForAccessibility = (modalLayerView || popupLayerView) ?
            AccessibilityUtil_1.default.importantForAccessibilityToString(Types.ImportantForAccessibility.NoHideDescendants) :
            undefined; // default
        return (React.createElement(RN.Animated.View, { style: _styles.rootViewStyle },
            React.createElement(RN.View, { style: _styles.rootViewStyle, importantForAccessibility: importantForAccessibility }, this.state.mainView),
            modalLayerView,
            popupLayerView,
            React.createElement(RN.View, { style: _styles.liveRegionContainer, accessibilityLabel: this.state.announcementText, accessibilityLiveRegion: AccessibilityUtil_1.default.accessibilityLiveRegionToString(Types.AccessibilityLiveRegion.Polite) })));
    };
    return BaseRootView;
}(React.Component));
exports.BaseRootView = BaseRootView;
// BaseRootView implementation that uses MainStore to set the main view.
var RootViewUsingStore = /** @class */ (function (_super) {
    __extends(RootViewUsingStore, _super);
    function RootViewUsingStore(props) {
        var _this = _super.call(this, props) || this;
        _this._changeListener = _this._onChange.bind(_this);
        _this.state = {
            mainView: undefined,
            announcementText: ''
        };
        return _this;
    }
    RootViewUsingStore.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        MainViewStore_1.default.subscribe(this._changeListener);
        this.setState(this._getStateFromStore());
    };
    RootViewUsingStore.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        MainViewStore_1.default.unsubscribe(this._changeListener);
    };
    RootViewUsingStore.prototype._onChange = function () {
        this.setState(this._getStateFromStore());
    };
    RootViewUsingStore.prototype._getStateFromStore = function () {
        var mainView = MainViewStore_1.default.getMainView();
        if (mainView && !_.isEqual(mainView.props, this._mainViewProps)) {
            mainView = React.cloneElement(mainView, this._mainViewProps);
        }
        return {
            mainView: mainView
        };
    };
    RootViewUsingStore.prototype._getPropsForMainView = function () {
        var _a = this.props, reactxp_rootViewId = _a.reactxp_rootViewId, mainViewProps = __rest(_a, ["reactxp_rootViewId"]);
        return mainViewProps;
    };
    return RootViewUsingStore;
}(BaseRootView));
exports.RootView = RootViewUsingStore;
// BaseRootView implementation that uses the value in props to set main view.
var RootViewUsingProps = /** @class */ (function (_super) {
    __extends(RootViewUsingProps, _super);
    function RootViewUsingProps(props) {
        var _this = _super.call(this, props) || this;
        if (!props.reactxp_rootViewId) {
            if (AppConfig_1.default.isDevelopmentMode()) {
                console.warn('Some APIs require a value for reactxp_rootViewId');
            }
            _this._rootViewId = null;
        }
        else {
            _this._rootViewId = props.reactxp_rootViewId;
        }
        _this.state = {
            mainView: React.createElement(props.reactxp_mainViewType, _this._mainViewProps),
            announcementText: ''
        };
        return _this;
    }
    RootViewUsingProps.prototype._getPropsForMainView = function () {
        var _a = this.props, reactxp_mainViewType = _a.reactxp_mainViewType, reactxp_rootViewId = _a.reactxp_rootViewId, mainViewProps = __rest(_a, ["reactxp_mainViewType", "reactxp_rootViewId"]);
        return mainViewProps;
    };
    return RootViewUsingProps;
}(BaseRootView));
exports.RootViewUsingProps = RootViewUsingProps;
exports.default = RootViewUsingStore;
