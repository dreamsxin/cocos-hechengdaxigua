type NameType = string | symbol | number;
/**全局的事件发送监听中心 (发布订阅者模式)
 * 建议配合GEventName文件用 symbol 类型的事件名，防止事件冲突
 */
export class GEvent {
    /**所有事件及其信息 */
    private _allEventInfo: Map<NameType, Map<object, { handler: Function; context: object }>> = new Map();
    /**所有脚本下面的事件记录 */
    private _allContextInfo: Map<object, Array<NameType>> = new Map();

    /**开始一个事件监听
     * @param {NameType} eventName 事件名  GEventName里面的枚举类型
     * @param {Function} handler 事件响应函数
     * @param {object} context 当前脚本 this
     * @example
     * GEvent.on(GEventName.Test, this[GEventName.Test], this);
     */
    private on(eventName: NameType, handler: Function, context: object) {
        //参数检查
        if (typeof handler != 'function') {
            console.error('没有事件响应函数！');
            return;
        }
        //记录当前脚本的事件 方便移除当前脚本注册的所有事件
        if (!this._allContextInfo.has(context)) {
            this._allContextInfo.set(context, []);
        }
        this._allContextInfo.get(context).push(eventName);
        //保存事件信息
        if (!this._allEventInfo.has(eventName)) {
            this._allEventInfo.set(eventName, new Map());
        }
        this._allEventInfo.get(eventName).set(context, { handler, context });
    }

    /**用数组的形式开始多个事件监听（推荐）
     * @param {NameType[]} eventNameArray 事件名  GEventName里面的枚举类型数组
     * @param {object} context 当前脚本 this
     * @example
     * GEvent.onByArray([GEventName.Test1, GEventName.Test.Test2, ], this);
     */
    onByArray(eventNameArray: NameType[], context: object) {
        for (let one of eventNameArray) {
            this.on(one, context[one], context);
        }
    }

    /**关闭一个事件监听
     * @param {NameType} eventName 事件名  GEventName里面的枚举类型
     * @param {object} context 当前脚本 this
     * @example
     * GEvent.off(GEventName.Test, this);
     */
    off(eventName: NameType, context: object) {
        if (!this._allEventInfo.has(eventName)) {
            console.warn('事件已经关闭监听或从未开始监听！');
        }
        this._allEventInfo.get(eventName).delete(context);
    }

    /**关闭当前脚本所有事件监听（推荐）
    * @param {object} context 当前脚本 this   
    * @example 
      onDestroy(){
          GEvent.offAll(this);
      }
    */
    offAll(context: object) {
        if (!this._allContextInfo.has(context)) {
            console.warn('当前脚本事件已经关闭监听或从未开始监听！');
        }

        let contextInfo = this._allContextInfo.get(context);
        if (Array.isArray(contextInfo)) {
            for (let one of contextInfo) {
                this.off(one, context);
            }
        }
        this._allContextInfo.delete(context);
    }

    /**发送事件
     * 参数个数不限，第一个参数为事件名，其余为传递给响应函数的参数
     * @param {NameType} eventName 事件名  GEventName里面的枚举类型
     * @param args 传递给响应函数的参数集，可以为空
     * @example
     * GEvent.emit(GEventName.Test, "test");
     */
    emit(eventName: NameType, ...args: any[]) {
        let eventInfo = this._allEventInfo.get(eventName);
        if (eventInfo) {
            eventInfo.forEach((data) => data.handler.call(data.context, ...args));
        } else {
            console.warn('还没有添加对应的事件监听!');
        }
    }
}
/**暴露全局提示 */
declare global {
    /**全局的事件发送监听中心 (发布订阅者模式)
     * 建议配合GEventName文件用 symbol 类型的事件名，防止事件冲突
     */
    const GEvent: GEvent;
}
window['GEvent'] = new GEvent();
