/// <reference types="react" />
/**
* Interfaces.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Defines the template for the ReactXP interface that needs to be
* implemented for each platform.
*/
import React = require('react');
import SubscribableEvent from 'subscribableevent';
import SyncTasks = require('synctasks');
import Types = require('./Types');
export import Types = Types;
export declare abstract class ActivityIndicator extends React.Component<Types.ActivityIndicatorProps, any> {
}
export declare abstract class Alert {
    abstract show(title: string, message?: string, buttons?: Types.AlertButtonSpec[], options?: Types.AlertOptions): void;
}
export declare abstract class AnimatedComponent<P extends Types.CommonProps, T> extends React.Component<P, T> {
    abstract setNativeProps(props: P): void;
}
export declare abstract class AnimatedImage extends AnimatedComponent<Types.AnimatedImageProps, {}> {
}
export declare abstract class AnimatedText extends AnimatedComponent<Types.AnimatedTextProps, {}> {
}
export declare abstract class AnimatedTextInput extends AnimatedComponent<Types.AnimatedTextInputProps, {}> {
}
export declare abstract class AnimatedView extends AnimatedComponent<Types.AnimatedViewProps, {}> {
    abstract focus(): void;
    abstract setFocusRestricted(restricted: boolean): void;
    abstract setFocusLimited(limited: boolean): void;
}
export declare abstract class App {
    initialize(debug: boolean, development: boolean): void;
    abstract getActivationState(): Types.AppActivationState;
    activationStateChangedEvent: SubscribableEvent<(state: Types.AppActivationState) => void>;
    memoryWarningEvent: SubscribableEvent<() => void>;
}
export declare abstract class UserInterface {
    abstract setMainView(element: React.ReactElement<any>): void;
    abstract registerRootView(viewKey: string, getComponentFunc: Function): void;
    abstract useCustomScrollbars(enable?: boolean): void;
    abstract isHighPixelDensityScreen(): boolean;
    abstract getPixelRatio(): number;
    abstract measureLayoutRelativeToWindow(component: React.Component<any, any>): SyncTasks.Promise<Types.LayoutInfo>;
    abstract measureLayoutRelativeToAncestor(component: React.Component<any, any>, ancestor: React.Component<any, any>): SyncTasks.Promise<Types.LayoutInfo>;
    abstract measureWindow(): Types.Dimensions;
    abstract getContentSizeMultiplier(): SyncTasks.Promise<number>;
    contentSizeMultiplierChangedEvent: SubscribableEvent<(multiplier: number) => void>;
    abstract setMaxContentSizeMultiplier(maxContentSizeMultiplier: number): void;
    abstract dismissKeyboard(): void;
    abstract enableTouchLatencyEvents(latencyThresholdMs: number): void;
    touchLatencyEvent: SubscribableEvent<(observedLatencyMs: number) => void>;
    abstract isNavigatingWithKeyboard(): boolean;
    keyboardNavigationEvent: SubscribableEvent<(isNavigatingWithKeyboard: boolean) => void>;
}
export declare abstract class Modal {
    abstract isDisplayed(modalId?: string): boolean;
    abstract show(modal: React.ReactElement<Types.ViewProps>, modalId: string, options?: Types.ModalOptions): void;
    abstract dismiss(modalId: string): void;
    abstract dismissAll(): void;
}
export declare abstract class Popup {
    abstract show(options: Types.PopupOptions, popupId: string, delay?: number): boolean;
    abstract autoDismiss(popupId: string, delay?: number): void;
    abstract dismiss(popupId: string): void;
    abstract dismissAll(): void;
    abstract isDisplayed(popupId?: string): boolean;
}
export declare abstract class Linking {
    abstract getInitialUrl(): SyncTasks.Promise<string | undefined>;
    deepLinkRequestEvent: SubscribableEvent<(url: string) => void>;
    abstract openUrl(url: string): SyncTasks.Promise<void>;
    abstract launchSms(smsData: Types.SmsInfo): SyncTasks.Promise<void>;
    abstract launchEmail(emailData: Types.EmailInfo): SyncTasks.Promise<void>;
    protected abstract _createEmailUrl(emailInfo: Types.EmailInfo): string;
}
export declare abstract class Accessibility {
    abstract isScreenReaderEnabled(): boolean;
    abstract isHighContrastEnabled(): boolean;
    abstract announceForAccessibility(announcement: string): void;
    screenReaderChangedEvent: SubscribableEvent<(isEnabled: boolean) => void>;
    highContrastChangedEvent: SubscribableEvent<(isEnabled: boolean) => void>;
}
export declare abstract class Button extends React.Component<Types.ButtonProps, any> {
    abstract focus(): void;
    abstract blur(): void;
}
export declare abstract class Picker extends React.Component<Types.PickerProps, {}> {
}
export declare class Component<P, T> extends React.Component<P, T> {
}
export interface ImageConstructor {
    new (props: Types.ImageProps): Image;
    prefetch(url: string): SyncTasks.Promise<boolean>;
}
export declare abstract class Image extends React.Component<Types.ImageProps, any> {
    abstract getNativeWidth(): number | undefined;
    abstract getNativeHeight(): number | undefined;
}
export declare abstract class Clipboard {
    abstract setText(text: string): void;
    abstract getText(): SyncTasks.Promise<string>;
}
export declare abstract class Link extends React.Component<Types.LinkProps, any> {
}
export declare abstract class Storage {
    abstract getItem(key: string): SyncTasks.Promise<string | undefined>;
    abstract setItem(key: string, value: string): SyncTasks.Promise<void>;
    abstract removeItem(key: string): SyncTasks.Promise<void>;
    abstract clear(): SyncTasks.Promise<void>;
}
export declare abstract class Location {
    abstract isAvailable(): boolean;
    abstract setConfiguration(config: LocationConfiguration): void;
    abstract getCurrentPosition(options?: PositionOptions): SyncTasks.Promise<Position>;
    abstract watchPosition(successCallback: Types.LocationSuccessCallback, errorCallback?: Types.LocationFailureCallback, options?: PositionOptions): SyncTasks.Promise<Types.LocationWatchId>;
    abstract clearWatch(watchID: Types.LocationWatchId): void;
}
export interface LocationConfiguration {
    skipPermissionRequests: boolean;
}
export declare abstract class Network {
    abstract isConnected(): SyncTasks.Promise<boolean>;
    abstract getType(): SyncTasks.Promise<Types.DeviceNetworkType>;
    connectivityChangedEvent: SubscribableEvent<(isConnected: boolean) => void>;
}
export declare abstract class Platform {
    abstract getType(): Types.PlatformType;
    abstract select<T>(specifics: {
        [platform in Types.PlatformType | 'default']?: T;
    }): T | undefined;
}
export declare abstract class Input {
    backButtonEvent: SubscribableEvent<() => boolean>;
    keyDownEvent: SubscribableEvent<(e: Types.KeyboardEvent) => boolean>;
    keyUpEvent: SubscribableEvent<(e: Types.KeyboardEvent) => boolean>;
}
export interface ScrollViewConstructor {
    new (props: Types.ScrollViewProps): ScrollView;
}
export interface ScrollView extends React.Component<Types.ScrollViewProps, any> {
    setScrollTop(scrollTop: number, animate?: boolean): void;
    setScrollLeft(scrollLeft: number, animate?: boolean): void;
    addToScrollTop(deltaTop: number, animate?: boolean): void;
    addToScrollLeft(deltaLeft: number, animate?: boolean): void;
}
export declare abstract class StatusBar {
    abstract isOverlay(): boolean;
    abstract setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void;
    abstract setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void;
    abstract setNetworkActivityIndicatorVisible(value: boolean): void;
    abstract setBackgroundColor(color: string, animated: boolean): void;
    abstract setTranslucent(translucent: boolean): void;
}
export declare abstract class Styles {
    abstract combine<T>(ruleSet1: Types.StyleRuleSetRecursive<T> | undefined, ruleSet2?: Types.StyleRuleSetRecursive<T>): Types.StyleRuleSetOrArray<T> | undefined;
    abstract createViewStyle(ruleSet: Types.ViewStyle, cacheStyle?: boolean): Types.ViewStyleRuleSet;
    abstract createAnimatedViewStyle(ruleSet: Types.AnimatedViewStyle): Types.AnimatedViewStyleRuleSet;
    abstract createScrollViewStyle(ruleSet: Types.ScrollViewStyle, cacheStyle?: boolean): Types.ScrollViewStyleRuleSet;
    abstract createButtonStyle(ruleSet: Types.ButtonStyle, cacheStyle?: boolean): Types.ButtonStyleRuleSet;
    abstract createWebViewStyle(ruleSet: Types.WebViewStyle, cacheStyle?: boolean): Types.WebViewStyleRuleSet;
    abstract createTextStyle(ruleSet: Types.TextStyle, cacheStyle?: boolean): Types.TextStyleRuleSet;
    abstract createAnimatedTextStyle(ruleSet: Types.AnimatedTextStyle): Types.AnimatedTextStyleRuleSet;
    abstract createTextInputStyle(ruleSet: Types.TextInputStyle, cacheStyle?: boolean): Types.TextInputStyleRuleSet;
    abstract createAnimatedTextInputStyle(ruleSet: Types.AnimatedTextInputStyle): Types.AnimatedTextInputStyleRuleSet;
    abstract createImageStyle(ruleSet: Types.ImageStyle, cacheStyle?: boolean): Types.ImageStyleRuleSet;
    abstract createAnimatedImageStyle(ruleSet: Types.AnimatedImageStyle): Types.AnimatedImageStyleRuleSet;
    abstract createLinkStyle(ruleSet: Types.LinkStyleRuleSet, cacheStyle?: boolean): Types.LinkStyleRuleSet;
    abstract createPickerStyle(ruleSet: Types.PickerStyle, cacheStyle?: boolean): Types.PickerStyleRuleSet;
    abstract getCssPropertyAliasesCssStyle(): {
        [key: string]: string;
    };
}
export declare abstract class Text extends React.Component<Types.TextProps, any> {
    abstract focus(): void;
    abstract blur(): void;
}
export declare abstract class TextInput extends React.Component<Types.TextInputProps, any> {
    abstract blur(): void;
    abstract focus(): void;
    abstract setAccessibilityFocus(): void;
    abstract isFocused(): boolean;
    abstract selectAll(): void;
    abstract selectRange(start: number, end: number): void;
    abstract getSelectionRange(): {
        start: number;
        end: number;
    };
    abstract setValue(value: string): void;
}
export declare abstract class UserPresence {
    abstract isUserPresent(): boolean;
    userPresenceChangedEvent: SubscribableEvent<(isPresent: boolean) => void>;
}
export declare abstract class ViewBase<P, S> extends React.Component<P, S> {
}
export declare abstract class View extends ViewBase<Types.ViewProps, any> {
    abstract focus(): void;
    abstract setFocusRestricted(restricted: boolean): void;
    abstract setFocusLimited(limited: boolean): void;
}
export declare abstract class GestureView extends ViewBase<Types.GestureViewProps, any> {
}
export interface WebViewConstructor {
    new (props: Types.WebViewProps): WebView;
}
export interface WebView extends ViewBase<Types.WebViewProps, any> {
    postMessage(message: string, targetOrigin?: string): void;
    reload(): void;
    goBack(): void;
    goForward(): void;
}
export interface Animated {
    Image: typeof AnimatedImage;
    Text: typeof AnimatedText;
    TextInput: typeof AnimatedTextInput;
    View: typeof AnimatedView;
    Easing: Types.Animated.Easing;
    timing: Types.Animated.TimingFunction;
    parallel: Types.Animated.ParallelFunction;
    sequence: Types.Animated.SequenceFunction;
    Value: typeof Types.AnimatedValue;
    createValue: (initialValue: number) => Types.AnimatedValue;
    interpolate: (value: Types.AnimatedValue, inputRange: number[], outputRange: string[]) => Types.InterpolatedValue;
}
export interface International {
    allowRTL(allow: boolean): void;
    forceRTL(force: boolean): void;
    isRTL(): boolean;
}
