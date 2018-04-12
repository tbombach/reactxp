/// <reference types="react" />
/**
* RootView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The top-most view that's used for proper layering or modals and popups.
*/
import React = require('react');
import RN = require('react-native');
interface BaseRootViewProps {
    reactxp_rootViewId?: string;
}
interface RootViewPropsWithMainViewType extends BaseRootViewProps {
    reactxp_mainViewType: string;
}
interface RootViewState {
    mainView?: RN.ReactElement<any>;
    announcementText?: string;
}
declare abstract class BaseRootView<P extends BaseRootViewProps> extends React.Component<P, RootViewState> {
    private _frontLayerViewChangedSubscription;
    private _newAnnouncementEventChangedSubscription;
    private _memoryWarningEventSubscription;
    protected _mainViewProps: {};
    protected _rootViewId?: string | null;
    protected abstract _getPropsForMainView(): {};
    constructor(props: P);
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
declare class RootViewUsingStore extends BaseRootView<BaseRootViewProps> {
    private _changeListener;
    constructor(props: BaseRootViewProps);
    componentWillMount(): void;
    componentWillUnmount(): void;
    private _onChange();
    private _getStateFromStore();
    protected _getPropsForMainView(): {};
}
declare class RootViewUsingProps extends BaseRootView<RootViewPropsWithMainViewType> {
    constructor(props: RootViewPropsWithMainViewType);
    protected _getPropsForMainView(): {};
}
export { BaseRootViewProps, RootViewPropsWithMainViewType, RootViewState, BaseRootView, RootViewUsingStore as RootView, RootViewUsingProps };
export default RootViewUsingStore;
