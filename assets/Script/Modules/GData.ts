const userKey = 'userData';
//数据过滤相关接口
type PickBy<Base, TargetType> = {
    [Key in keyof Base]: Base[Key] extends TargetType ? Key : never;
}[keyof Base];
/**
 * 玩家数据中心，玩家数据的获取，设置，改变及其他相关逻辑
 */
export class GData {
    private _allData = {
        maxScore: 0,    //最高分
        money: 0,
    };
    _isNew: boolean = false;
    /**获取玩家的数据
         * @param key 要获取的属性
         * @example
         * GData.get("Money");
         */
    get<T extends keyof GData['_allData']>(key: T): GData['_allData'][T] {
        return this._allData[key];
    }

    /**设置玩家的数据
     * @param key 要设置的属性
     * @param value 要设置的值
     * @example
     * GData.set("Money", 100);
     */
    set<T extends keyof GData['_allData']>(key: T, value: GData['_allData'][T]) {
        this._allData[key] = value;
        //可以添加其他逻辑，如：发射事件出去，改变ui表现，实现数据和表现的绑定
        //将当前玩家变化的属性字段，作为事件名（如"Money"）发送出去
        //GEvent.emit(key);
    }
    /**改变玩家数值类型的数据，返回当前的数值
     * @param key 要改变的属性
     * @param changes 变化值  >0表示增加  <0表示减小
     * @param canNegative 改变后的值是否能为负数，可选，默认不能为负数
     * @example
     * //通用：
     * GData.change("Money", -100); // 改变后的值如果为负数则会报错，并且改变不生效
     * //特殊：
     * GData.change("Money", -100, true); // 改变后的值可以为负数了，改变直接生效
     */

    change(key: PickBy<GData['_allData'], number>, changes: number, canNegative = false) {
        let oldData = this.get(key);
        //数据类型检查
        if (typeof oldData == 'number') {
            let newData = oldData + changes;
            //数据范围检查
            if (canNegative || newData >= 0) {
                this.set(key, newData);
            } else {
                console.error('数值变化后为不合法的负数，此次改变不生效!');
            }
        } else {
            console.error('要改变值不是数字类型!');
        }
        return this.get(key);
    }

    /**重置这个单例，数据还原 */
    reset() {
        window[this['__proto__'].constructor.name] = new this['__proto__'].constructor();
    }

    //从本地获取
    init() {
        var localData = GCocos.local.get(userKey);
        if (localData) {
            for (var i in localData) {
                this._allData[i] = localData[i];
            }
        } else {
            this._isNew = true;
        }
        //hide的时候保存一下数据
        cc.game.on(cc.game.EVENT_HIDE, this.saveLocal, this);
    }
    //保存到本地
    saveLocal() {
        GCocos.local.set(userKey, this._allData);
    }
}
/**暴露全局提示 */
declare global {
    /**
     * 玩家数据中心，玩家数据的获取，设置，改变及其他相关逻辑
     */
    const GData: GData;
}
window['GData'] = new GData();