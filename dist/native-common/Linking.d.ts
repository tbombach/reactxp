import SyncTasks = require('synctasks');
import { Linking as CommonLinking } from '../common/Linking';
import Types = require('../common/Types');
export declare class Linking extends CommonLinking {
    constructor();
    protected _openUrl(url: string): SyncTasks.Promise<void>;
    getInitialUrl(): SyncTasks.Promise<string>;
    launchEmail(emailInfo: Types.EmailInfo): SyncTasks.Promise<void>;
}
declare const _default: Linking;
export default _default;
