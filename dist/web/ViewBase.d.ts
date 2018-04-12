/// <reference types="react" />
import RX = require('../common/Interfaces');
import SyncTasks = require('synctasks');
import Types = require('../common/Types');
export declare abstract class ViewBase<P extends Types.ViewProps, S> extends RX.ViewBase<P, S> {
    private static _viewCheckingTimer;
    private static _isResizeHandlerInstalled;
    private static _viewCheckingList;
    private static _appActivationState;
    abstract render(): JSX.Element;
    protected abstract _getContainer(): HTMLElement | null;
    private _isMounted;
    private _isPopupDisplayed;
    static setActivationState(newState: Types.AppActivationState): void;
    componentWillReceiveProps(nextProps: Types.ViewProps): void;
    protected static _checkViews(): void;
    private static _layoutReportList;
    private static _layoutReportingTimer;
    private static _reportLayoutChange(func);
    protected static _reportDeferredLayoutChanges(): void;
    protected _lastX: number;
    protected _lastY: number;
    protected _lastWidth: number;
    protected _lastHeight: number;
    protected _checkAndReportLayout(): SyncTasks.Promise<void>;
    private _checkViewCheckerBuild();
    private _checkViewCheckerUnbuild();
    componentDidMount(): void;
    componentDidUpdate(): void;
    private static _onResize();
    componentWillUnmount(): void;
    blur(): void;
    focus(): void;
}
export default ViewBase;
