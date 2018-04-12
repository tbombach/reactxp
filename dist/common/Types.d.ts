/// <reference types="react" />
/**
* Types.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definitions for ReactXP framework.
*/
import React = require('react');
import RX = require('./Interfaces');
export { default as SubscribableEvent, SubscriptionToken } from 'subscribableevent';
export declare type ReactNode = React.ReactNode;
export declare type ReactInterface = {
    createElement<P>(type: string, props?: P, ...children: ReactNode[]): React.ReactElement<P>;
};
export interface FlexboxParentStyle {
    flexDirection?: 'column' | 'row' | 'column-reverse' | 'row-reverse';
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch';
    borderWidth?: number;
    borderTopWidth?: number;
    borderRightWidth?: number;
    borderBottomWidth?: number;
    borderLeftWidth?: number;
    height?: number;
    width?: number;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number;
    flex?: number;
    maxHeight?: number;
    maxWidth?: number;
    minHeight?: number;
    minWidth?: number;
    margin?: number;
    marginHorizontal?: number;
    marginVertical?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    padding?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    position?: 'absolute' | 'relative';
}
export interface FlexboxChildrenStyle {
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
    alignContent?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch';
    flexWrap?: 'wrap' | 'nowrap';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
}
export interface FlexboxStyle extends FlexboxParentStyle, FlexboxChildrenStyle {
}
export declare type InterpolationConfig = {
    inputRange: number[];
    outputRange: number[] | string[];
};
export declare abstract class AnimatedValue {
    constructor(val: number);
    abstract setValue(value: number): void;
    abstract interpolate(config: InterpolationConfig): InterpolatedValue;
}
export declare abstract class InterpolatedValue {
}
export interface AnimatedFlexboxStyle {
    height?: AnimatedValue | InterpolatedValue;
    width?: AnimatedValue | InterpolatedValue;
    top?: AnimatedValue | InterpolatedValue;
    right?: AnimatedValue | InterpolatedValue;
    bottom?: AnimatedValue | InterpolatedValue;
    left?: AnimatedValue | InterpolatedValue;
}
export interface TransformStyle {
    transform?: {
        perspective?: number;
        rotate?: string;
        rotateX?: string;
        rotateY?: string;
        rotateZ?: string;
        scale?: number;
        scaleX?: number;
        scaleY?: number;
        translateX?: number;
        translateY?: number;
    }[];
}
export interface AnimatedTransformStyle {
    transform?: {
        perspective?: AnimatedValue | InterpolatedValue;
        rotate?: AnimatedValue | InterpolatedValue;
        rotateX?: AnimatedValue | InterpolatedValue;
        rotateY?: AnimatedValue | InterpolatedValue;
        rotateZ?: AnimatedValue | InterpolatedValue;
        scale?: AnimatedValue | InterpolatedValue;
        scaleX?: AnimatedValue | InterpolatedValue;
        scaleY?: AnimatedValue | InterpolatedValue;
        translateX?: AnimatedValue | InterpolatedValue;
        translateY?: AnimatedValue | InterpolatedValue;
    }[];
}
export declare type StyleRuleSet<T> = T | number | undefined;
export declare type StyleRuleSetOrArray<T> = StyleRuleSet<T> | Array<StyleRuleSet<T>>;
export interface StyleRuleSetRecursiveArray<T> extends Array<StyleRuleSetOrArray<T> | StyleRuleSetRecursiveArray<T>> {
}
export declare type StyleRuleSetRecursive<T> = StyleRuleSet<T> | StyleRuleSetRecursiveArray<T>;
export interface ViewAndImageCommonStyle extends FlexboxStyle, TransformStyle {
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    borderTopRightRadius?: number;
    borderBottomRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderTopLeftRadius?: number;
    overflow?: 'visible' | 'hidden';
    backgroundColor?: string;
    opacity?: number;
}
export interface AnimatedViewAndImageCommonStyle extends AnimatedFlexboxStyle, AnimatedTransformStyle {
    borderRadius?: AnimatedValue | InterpolatedValue;
    backgroundColor?: InterpolatedValue;
    opacity?: AnimatedValue | InterpolatedValue;
}
export interface ShadowOffset {
    width: number;
    height: number;
}
export interface ViewStyle extends ViewAndImageCommonStyle {
    borderStyle?: 'solid' | 'dotted' | 'dashed' | 'none';
    wordBreak?: 'break-all' | 'break-word';
    appRegion?: 'drag' | 'no-drag';
    cursor?: 'pointer' | 'default';
    shadowOffset?: ShadowOffset;
    shadowOpacity?: number;
    shadowRadius?: number;
    shadowColor?: string;
    elevation?: number;
    acrylicOpacityUWP?: number;
    acrylicSourceUWP?: 'host' | 'app';
    acrylicTintColorUWP?: string;
}
export declare type ViewStyleRuleSet = StyleRuleSet<ViewStyle>;
export interface AnimatedViewStyle extends AnimatedViewAndImageCommonStyle {
}
export declare type AnimatedViewStyleRuleSet = StyleRuleSet<AnimatedViewStyle>;
export interface ScrollViewStyle extends FlexboxParentStyle, TransformStyle {
    overflow?: 'visible' | 'hidden';
    backgroundColor?: string;
    opacity?: number;
}
export declare type ScrollViewStyleRuleSet = StyleRuleSet<ScrollViewStyle>;
export interface ButtonStyle extends ViewStyle {
}
export declare type ButtonStyleRuleSet = StyleRuleSet<ButtonStyle>;
export interface WebViewStyle extends ViewStyle {
}
export declare type WebViewStyleRuleSet = StyleRuleSet<WebViewStyle>;
export interface ActivityIndicatorStyle extends ViewStyle {
}
export declare type ActivityIndicatorStyleRuleSet = StyleRuleSet<ActivityIndicatorStyle>;
export interface FontInfo {
    fontFamily?: string;
    fontStyle?: 'normal' | 'italic';
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}
export interface TextStyle extends ViewStyle {
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: 'normal' | 'italic';
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    font?: FontInfo;
    letterSpacing?: number;
    lineHeight?: number;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
    textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
    textDecorationColor?: string;
    writingDirection?: 'auto' | 'ltr' | 'rtl';
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
    includeFontPadding?: boolean;
}
export declare type TextStyleRuleSet = StyleRuleSet<TextStyle>;
export interface AnimatedTextStyle extends AnimatedViewAndImageCommonStyle {
    color?: InterpolatedValue;
    fontSize?: AnimatedValue | InterpolatedValue;
}
export declare type AnimatedTextStyleRuleSet = StyleRuleSet<AnimatedTextStyle>;
export interface TextInputStyle extends TextStyle {
}
export declare type TextInputStyleRuleSet = StyleRuleSet<TextInputStyle>;
export interface AnimatedTextInputStyle extends AnimatedViewAndImageCommonStyle {
    color?: InterpolatedValue;
    fontSize?: AnimatedValue | InterpolatedValue;
}
export declare type AnimatedTextInputStyleRuleSet = StyleRuleSet<AnimatedTextInputStyle>;
export interface LinkStyle extends TextStyle {
}
export declare type LinkStyleRuleSet = StyleRuleSet<LinkStyle>;
export interface ImageStyle extends ViewAndImageCommonStyle, FlexboxStyle {
    overlayColor?: string;
}
export declare type ImageStyleRuleSet = StyleRuleSet<ImageStyle>;
export interface AnimatedImageStyle extends AnimatedViewAndImageCommonStyle, AnimatedFlexboxStyle {
}
export declare type AnimatedImageStyleRuleSet = StyleRuleSet<AnimatedImageStyle>;
export interface PickerStyle extends ViewStyle {
    color?: string;
}
export declare type PickerStyleRuleSet = StyleRuleSet<PickerStyle>;
export declare type ComponentBase = React.Component<any, any>;
export interface CommonProps {
    ref?: string | ((obj: ComponentBase | null) => void);
    key?: string | number;
    children?: ReactNode | ReactNode[];
}
export interface Stateless {
}
export interface CommonAccessibilityProps {
    importantForAccessibility?: ImportantForAccessibility;
    accessibilityLabel?: string;
    accessibilityTraits?: AccessibilityTrait | AccessibilityTrait[];
    tabIndex?: number;
    ariaValueNow?: number;
    accessibilityActions?: string[];
    onAccessibilityAction?: (e: SyntheticEvent) => void;
}
export declare enum ImportantForAccessibility {
    Auto = 1,
    Yes = 2,
    No = 3,
    NoHideDescendants = 4,
}
export declare type AriaLive = 'off' | 'assertive' | 'polite';
export declare enum AccessibilityLiveRegion {
    None = 0,
    Polite = 1,
    Assertive = 2,
}
export declare enum AccessibilityTrait {
    Summary = 0,
    Adjustable = 1,
    Button = 2,
    Tab = 3,
    Selected = 4,
    Radio_button_checked = 5,
    Radio_button_unchecked = 6,
    Link = 7,
    Header = 8,
    Search = 9,
    Image = 10,
    Plays = 11,
    Key = 12,
    Text = 13,
    Disabled = 14,
    FrequentUpdates = 15,
    StartsMedia = 16,
    AllowsDirectInteraction = 17,
    PageTurn = 18,
    Menu = 19,
    MenuItem = 20,
    MenuBar = 21,
    TabList = 22,
    List = 23,
    ListItem = 24,
    ListBox = 25,
    Group = 26,
    CheckBox = 27,
    Checked = 28,
    ComboBox = 29,
    Log = 30,
    Status = 31,
    Dialog = 32,
    HasPopup = 33,
    Option = 34,
    Switch = 35,
    None = 36,
}
export interface CommonStyledProps<T> extends CommonProps {
    style?: StyleRuleSetRecursive<T>;
}
export interface ButtonProps extends CommonStyledProps<ButtonStyleRuleSet>, CommonAccessibilityProps {
    title?: string;
    disabled?: boolean;
    delayLongPress?: number;
    onAccessibilityTapIOS?: Function;
    onContextMenu?: (e: MouseEvent) => void;
    onPress?: (e: SyntheticEvent) => void;
    onPressIn?: (e: SyntheticEvent) => void;
    onPressOut?: (e: SyntheticEvent) => void;
    onLongPress?: (e: SyntheticEvent) => void;
    onHoverStart?: (e: SyntheticEvent) => void;
    onHoverEnd?: (e: SyntheticEvent) => void;
    onKeyPress?: (e: KeyboardEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    shouldRasterizeIOS?: boolean;
    disableTouchOpacityAnimation?: boolean;
    activeOpacity?: number;
    underlayColor?: string;
    id?: string;
    ariaControls?: string;
}
export interface PickerPropsItem {
    label: string;
    value: string;
}
export interface PickerProps extends CommonProps {
    items: PickerPropsItem[];
    selectedValue: string;
    onValueChange: (itemValue: string, itemPosition: number) => void;
    style?: StyleRuleSetRecursive<PickerStyleRuleSet>;
    mode?: 'dialog' | 'dropdown';
}
export interface ImagePropsShared extends CommonProps {
    source: string;
    headers?: {
        [headerName: string]: string;
    };
    accessibilityLabel?: string;
    resizeMode?: 'stretch' | 'contain' | 'cover' | 'auto' | 'repeat';
    resizeMethod?: 'auto' | 'resize' | 'scale';
    title?: string;
    onLoad?: (size: Dimensions) => void;
    onError?: (err?: Error) => void;
    shouldRasterizeIOS?: boolean;
}
export interface ImageProps extends ImagePropsShared {
    style?: StyleRuleSetRecursive<ImageStyleRuleSet>;
}
export interface AnimatedImageProps extends ImagePropsShared {
    style?: StyleRuleSetRecursive<AnimatedImageStyleRuleSet | ImageStyleRuleSet>;
}
export interface TextPropsShared extends CommonProps {
    selectable?: boolean;
    numberOfLines?: number;
    allowFontScaling?: boolean;
    maxContentSizeMultiplier?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail';
    textBreakStrategy?: 'highQuality' | 'simple' | 'balanced';
    importantForAccessibility?: ImportantForAccessibility;
    onPress?: (e: SyntheticEvent) => void;
    id?: string;
    onContextMenu?: (e: MouseEvent) => void;
}
export interface TextProps extends TextPropsShared {
    style?: StyleRuleSetRecursive<TextStyleRuleSet>;
}
export interface AnimatedTextProps extends TextPropsShared {
    style?: StyleRuleSetRecursive<AnimatedTextStyleRuleSet | TextStyleRuleSet>;
}
export declare type ViewLayerType = 'none' | 'software' | 'hardware';
export declare enum LimitFocusType {
    Unlimited = 0,
    Limited = 1,
    Accessible = 2,
}
export interface ViewPropsShared extends CommonProps, CommonAccessibilityProps {
    title?: string;
    ignorePointerEvents?: boolean;
    blockPointerEvents?: boolean;
    shouldRasterizeIOS?: boolean;
    viewLayerTypeAndroid?: ViewLayerType;
    restrictFocusWithin?: boolean;
    limitFocusWithin?: LimitFocusType;
    importantForLayout?: boolean;
    id?: string;
    ariaLabelledBy?: string;
    ariaRoleDescription?: string;
    accessibilityLiveRegion?: AccessibilityLiveRegion;
    animateChildEnter?: boolean;
    animateChildLeave?: boolean;
    animateChildMove?: boolean;
    onAccessibilityTapIOS?: Function;
    onLayout?: (e: ViewOnLayoutEvent) => void;
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
    onDragEnter?: (e: DragEvent) => void;
    onDragOver?: (e: DragEvent) => void;
    onDragLeave?: (e: DragEvent) => void;
    onDrop?: (e: DragEvent) => void;
    onMouseOver?: (e: MouseEvent) => void;
    onMouseMove?: (e: MouseEvent) => void;
    onPress?: (e: SyntheticEvent) => void;
    onLongPress?: (e: SyntheticEvent) => void;
    onKeyPress?: (e: KeyboardEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    disableTouchOpacityAnimation?: boolean;
    activeOpacity?: number;
    underlayColor?: string;
    onContextMenu?: (e: MouseEvent) => void;
    onStartShouldSetResponder?: (e: SyntheticEvent) => boolean;
    onMoveShouldSetResponder?: (e: SyntheticEvent) => boolean;
    onStartShouldSetResponderCapture?: (e: SyntheticEvent) => boolean;
    onMoveShouldSetResponderCapture?: (e: SyntheticEvent) => boolean;
    onResponderGrant?: (e: SyntheticEvent) => void;
    onResponderReject?: (e: SyntheticEvent) => void;
    onResponderRelease?: (e: SyntheticEvent) => void;
    onResponderStart?: (e: TouchEvent) => void;
    onResponderMove?: (e: TouchEvent) => void;
    onResponderEnd?: (e: TouchEvent) => void;
    onResponderTerminate?: (e: SyntheticEvent) => void;
    onResponderTerminationRequest?: (e: SyntheticEvent) => boolean;
}
export interface ViewProps extends ViewPropsShared {
    style?: StyleRuleSetRecursive<ViewStyleRuleSet>;
}
export interface AnimatedViewProps extends ViewPropsShared {
    style?: StyleRuleSetRecursive<AnimatedViewStyleRuleSet | ViewStyleRuleSet>;
}
export interface GestureState {
    timeStamp: number;
}
export interface MultiTouchGestureState extends GestureState {
    initialCenterClientX: number;
    initialCenterClientY: number;
    initialCenterPageX: number;
    initialCenterPageY: number;
    initialWidth: number;
    initialHeight: number;
    initialDistance: number;
    initialAngle: number;
    centerClientX: number;
    centerClientY: number;
    centerPageX: number;
    centerPageY: number;
    velocityX: number;
    velocityY: number;
    width: number;
    height: number;
    distance: number;
    angle: number;
    isComplete: boolean;
}
export interface ScrollWheelGestureState extends GestureState {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    scrollAmount: number;
}
export interface PanGestureState extends GestureState {
    initialClientX: number;
    initialClientY: number;
    initialPageX: number;
    initialPageY: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    velocityX: number;
    velocityY: number;
    isComplete: boolean;
}
export interface TapGestureState extends GestureState {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
}
export declare enum GestureMouseCursor {
    Default = 0,
    Pointer = 1,
    Grab = 2,
    Move = 3,
}
export declare enum PreferredPanGesture {
    Horizontal = 0,
    Vertical = 1,
}
export interface GestureViewProps extends CommonStyledProps<ViewStyleRuleSet>, CommonAccessibilityProps {
    onPinchZoom?: (gestureState: MultiTouchGestureState) => void;
    onRotate?: (gestureState: MultiTouchGestureState) => void;
    onScrollWheel?: (gestureState: ScrollWheelGestureState) => void;
    mouseOverCursor?: GestureMouseCursor;
    onPan?: (gestureState: PanGestureState) => void;
    onPanVertical?: (gestureState: PanGestureState) => void;
    onPanHorizontal?: (gestureState: PanGestureState) => void;
    onTap?: (gestureState: TapGestureState) => void;
    onDoubleTap?: (gestureState: TapGestureState) => void;
    preferredPan?: PreferredPanGesture;
    panPixelThreshold?: number;
    releaseOnRequest?: boolean;
}
export interface ScrollIndicatorInsets {
    top: number;
    left: number;
    bottom: number;
    right: number;
}
export interface ScrollViewProps extends ViewProps {
    style?: StyleRuleSetRecursive<ScrollViewStyleRuleSet>;
    children?: ReactNode;
    vertical?: boolean;
    horizontal?: boolean;
    justifyEnd?: boolean;
    onLayout?: (e: ViewOnLayoutEvent) => void;
    onContentSizeChange?: (width: number, height: number) => void;
    onScroll?: (newScrollTop: number, newScrollLeft: number) => void;
    onScrollBeginDrag?: () => void;
    onScrollEndDrag?: () => void;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    scrollEnabled?: boolean;
    keyboardDismissMode?: 'none' | 'interactive' | 'on-drag';
    keyboardShouldPersistTaps?: boolean;
    scrollEventThrottle?: number;
    bounces?: boolean;
    pagingEnabled?: boolean;
    snapToInterval?: number;
    scrollsToTop?: boolean;
    overScrollMode?: 'always' | 'always-if-content-scrolls' | 'never';
    scrollIndicatorInsets?: ScrollIndicatorInsets;
    tabNavigation?: 'local' | 'cycle' | 'once';
}
export interface LinkProps extends CommonStyledProps<LinkStyleRuleSet> {
    title?: string;
    url: string;
    children?: ReactNode;
    selectable?: boolean;
    numberOfLines?: number;
    allowFontScaling?: boolean;
    maxContentSizeMultiplier?: number;
    tabIndex?: number;
    onPress?: (e: RX.Types.SyntheticEvent, url: string) => void;
    onLongPress?: (e: RX.Types.SyntheticEvent, url: string) => void;
    onHoverStart?: (e: SyntheticEvent) => void;
    onHoverEnd?: (e: SyntheticEvent) => void;
}
export interface TextInputPropsShared extends CommonProps, CommonAccessibilityProps {
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    autoFocus?: boolean;
    blurOnSubmit?: boolean;
    defaultValue?: string;
    editable?: boolean;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'number-pad';
    maxLength?: number;
    multiline?: boolean;
    placeholder?: string;
    placeholderTextColor?: string;
    secureTextEntry?: boolean;
    value?: string;
    allowFontScaling?: boolean;
    maxContentSizeMultiplier?: number;
    keyboardAppearance?: 'default' | 'light' | 'dark';
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
    disableFullscreenUI?: boolean;
    spellCheck?: boolean;
    selectionColor?: string;
    onKeyPress?: (e: KeyboardEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: () => void;
    onPaste?: (e: ClipboardEvent) => void;
    onChangeText?: (newValue: string) => void;
    onSelectionChange?: (start: number, end: number) => void;
    onSubmitEditing?: () => void;
    onScroll?: (newScrollLeft: number, newScrollTop: number) => void;
}
export interface TextInputProps extends TextInputPropsShared {
    style?: StyleRuleSetRecursive<TextInputStyleRuleSet>;
}
export interface AnimatedTextInputProps extends TextInputPropsShared {
    style?: StyleRuleSetRecursive<AnimatedTextInputStyleRuleSet | TextInputStyleRuleSet>;
}
export interface ActivityIndicatorProps extends CommonStyledProps<ActivityIndicatorStyleRuleSet> {
    color: string;
    size?: 'large' | 'medium' | 'small' | 'tiny';
    deferTime?: number;
}
export interface WebViewNavigationState extends Event {
    canGoBack: boolean;
    canGoForward: boolean;
    loading: boolean;
    url: string;
    title: string;
}
export interface WebViewErrorState extends WebViewNavigationState {
    description: string;
    domain: string;
    code: string;
}
export declare enum WebViewSandboxMode {
    None = 0,
    AllowForms = 1,
    AllowModals = 2,
    AllowOrientationLock = 4,
    AllowPointerLock = 8,
    AllowPopups = 16,
    AllowPopupsToEscapeSandbox = 32,
    AllowPresentation = 64,
    AllowSameOrigin = 128,
    AllowScripts = 256,
    AllowTopNavigation = 512,
}
export interface WebViewSource {
    html: string;
    baseUrl?: string;
}
export interface WebViewProps extends CommonStyledProps<WebViewStyleRuleSet> {
    url?: string;
    source?: WebViewSource;
    headers?: {
        [key: string]: string;
    };
    onLoad?: (e: SyntheticEvent) => void;
    onNavigationStateChange?: (navigationState: WebViewNavigationState) => void;
    scalesPageToFit?: boolean;
    injectedJavaScript?: string;
    javaScriptEnabled?: boolean;
    startInLoadingState?: boolean;
    domStorageEnabled?: boolean;
    onShouldStartLoadWithRequest?: (shouldStartLoadEvent: WebViewShouldStartLoadEvent) => boolean;
    onLoadStart?: (e: SyntheticEvent) => void;
    onError?: (e: SyntheticEvent) => void;
    onMessage?: (e: WebViewMessageEvent) => void;
    sandbox?: WebViewSandboxMode;
}
export declare type PopupPosition = 'top' | 'right' | 'bottom' | 'left';
export interface PopupOptions {
    getAnchor: () => React.Component<any, any>;
    renderPopup: (anchorPosition: PopupPosition, anchorOffset: number, popupWidth: number, popupHeight: number) => ReactNode;
    getElementTriggeringPopup?: () => React.Component<any, any>;
    onDismiss?: () => void;
    positionPriorities?: PopupPosition[];
    useInnerPositioning?: boolean;
    onAnchorPressed?: (e?: RX.Types.SyntheticEvent) => void;
    dismissIfShown?: boolean;
    preventDismissOnPress?: boolean;
    cacheable?: boolean;
    rootViewId?: string;
}
export interface ModalOptions {
    rootViewId?: string;
}
export interface AlertButtonSpec {
    text?: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}
export interface AlertModalTheme {
    bodyStyle?: StyleRuleSet<ViewStyle>;
    titleTextStyle?: StyleRuleSet<TextStyle>;
    messageTextStyle?: StyleRuleSet<TextStyle>;
    buttonStyle?: StyleRuleSet<ButtonStyle>;
    buttonHoverStyle?: StyleRuleSet<ButtonStyle>;
    buttonTextStyle?: StyleRuleSet<TextStyle>;
    cancelButtonStyle?: StyleRuleSet<ButtonStyle>;
    cancelButtonHoverStyle?: StyleRuleSet<ButtonStyle>;
    cancelButtonTextStyle?: StyleRuleSet<TextStyle>;
}
export interface AlertOptions {
    icon?: string;
    theme?: AlertModalTheme;
}
export declare enum LocationErrorType {
    PermissionDenied = 1,
    PositionUnavailable = 2,
    Timeout = 3,
}
export declare type LocationWatchId = number;
export declare type LocationSuccessCallback = (position: Position) => void;
export declare type LocationFailureCallback = (error: LocationErrorType) => void;
export declare module Animated {
    type ValueListenerCallback = (value: number | string) => void;
    type EndResult = {
        finished: boolean;
    };
    type EndCallback = (result: EndResult) => void;
    type CompositeAnimation = {
        start: (callback?: EndCallback) => void;
        stop: () => void;
    };
    interface LoopConfig {
        restartFrom: number;
    }
    interface AnimationConfig {
        useNativeDriver?: boolean;
        isInteraction?: boolean;
    }
    interface TimingAnimationConfig extends AnimationConfig {
        toValue: number;
        easing?: EasingFunction;
        duration?: number;
        delay?: number;
        loop?: LoopConfig;
    }
    interface InterpolationConfigType {
        inputRange: number[];
        outputRange: (number | string)[];
    }
    type TimingFunction = (value: RX.Types.AnimatedValue | RX.Types.InterpolatedValue, config: TimingAnimationConfig) => CompositeAnimation;
    var timing: TimingFunction;
    type SequenceFunction = (animations: Array<CompositeAnimation>) => CompositeAnimation;
    var sequence: SequenceFunction;
    type ParallelFunction = (animations: Array<CompositeAnimation>) => CompositeAnimation;
    var parallel: ParallelFunction;
    type EasingFunction = {
        cssName: string;
        function: (input: number) => number;
    };
    interface Easing {
        Default(): EasingFunction;
        Linear(): EasingFunction;
        Out(): EasingFunction;
        In(): EasingFunction;
        InOut(): EasingFunction;
        InBack(): EasingFunction;
        OutBack(): EasingFunction;
        InOutBack(): EasingFunction;
        StepStart(): EasingFunction;
        StepEnd(): EasingFunction;
        Steps(intervals: number, end?: boolean): EasingFunction;
        CubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction;
    }
}
export declare type SyntheticEvent = {
    readonly bubbles: boolean;
    readonly cancelable: boolean;
    readonly defaultPrevented: boolean;
    readonly timeStamp: number;
    readonly nativeEvent: any;
    preventDefault(): void;
    stopPropagation(): void;
};
export interface ClipboardEvent extends SyntheticEvent {
    clipboardData: DataTransfer;
}
export declare type FocusEvent = SyntheticEvent;
export interface MouseEvent extends SyntheticEvent {
    altKey: boolean;
    button: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    pageX?: number;
    pageY?: number;
}
export interface DragEvent extends MouseEvent {
    dataTransfer: DataTransfer;
}
export interface Touch {
    identifier: number;
    locationX: number;
    locationY: number;
    screenX: number;
    screenY: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
}
export interface TouchList {
    [index: number]: Touch;
    length: number;
    item(index: number): Touch;
    identifiedTouch(identifier: number): Touch;
}
export interface TouchEvent extends SyntheticEvent {
    altKey: boolean;
    changedTouches: TouchList;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    targetTouches: TouchList;
    locationX?: number;
    locationY?: number;
    pageX?: number;
    pageY?: number;
    touches: TouchList;
}
export interface WheelEvent extends SyntheticEvent {
    deltaMode: number;
    deltaX: number;
    deltaY: number;
    deltaZ: number;
}
export interface WebViewShouldStartLoadEvent extends SyntheticEvent {
    url: string;
}
export interface WebViewNavigationEvent extends SyntheticEvent {
    nativeEvent: WebViewNavigationState;
}
export interface WebViewErrorEvent extends SyntheticEvent {
    nativeEvent: WebViewErrorState;
}
export declare type ViewOnLayoutEvent = {
    x: number;
    y: number;
    height: number;
    width: number;
};
export interface KeyboardEvent extends SyntheticEvent {
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    keyCode: number;
    metaKey: boolean;
    key: string;
}
export interface WebViewMessageEvent extends SyntheticEvent {
    data: string;
    origin: string;
}
export declare var Children: React.ReactChildren;
export declare type Dimensions = {
    width: number;
    height: number;
};
export interface EmailInfo {
    to?: string[];
    cc?: string[];
    bcc?: string[];
    subject?: string;
    body?: string;
}
export interface SmsInfo {
    phoneNumber?: string;
    body?: string;
}
export declare enum LinkingErrorCode {
    NoAppFound = 0,
    UnexpectedFailure = 1,
    Blocked = 2,
    InitialUrlNotFound = 3,
}
export interface LinkingErrorInfo {
    code: LinkingErrorCode;
    url: string;
    description?: string;
}
export declare enum AppActivationState {
    Active = 1,
    Background = 2,
    Inactive = 3,
    Extension = 4,
}
export interface LayoutInfo {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare type PlatformType = 'web' | 'ios' | 'android' | 'windows' | 'macos';
export declare enum DeviceNetworkType {
    Unknown = 0,
    None = 1,
    Wifi = 2,
    Mobile2G = 3,
    Mobile3G = 4,
    Mobile4G = 5,
}
