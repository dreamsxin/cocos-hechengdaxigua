export class GCocos {
    show(name: string, data?) {
        var node = cc.find("Canvas/" + name);
        if (node) {
            node.active = true;
            var js = node.getComponent(name);
            if (js) {
                js['onShow'] && js['onShow'](data);
            }
        }
    }
    hide(name: string, data?) {
        var node = cc.find("Canvas/" + name);
        if (node) {
            node.active = false;
            var js = node.getComponent(name);
            if (js) {
                js['onHide'] && js['onHide'](data);
            }
        }
    }
    get(name: string) {
        var node = cc.find("Canvas/" + name);
        if (node) {
            return node.getComponent(name);
        }
    }
    refresh(name: string, data?) {
        var node = cc.find("Canvas/" + name);
        if (node) {
            var js = node.getComponent(name);
            if (js) {
                js['onRefresh'] && js['onRefresh'](data);
            }
        }
    }

    local = {
        _cache: {},
        set(key, value) {
            if (typeof key === 'string' && typeof value !== 'undefined') {
                try {
                    let data = JSON.stringify(value);
                    cc.sys.localStorage.setItem(key, data);
                    // 设置缓存
                    this._cache[key] = data;
                    return true;
                } catch (err) {

                }
            } else {
                cc.error('error');
            }
            return false;
        },
        get(key) {
            // 先读取缓存
            if (typeof this._cache[key] !== 'undefined') {
                return JSON.parse(this._cache[key]);
            }
            let result = null;
            try {
                let data = cc.sys.localStorage.getItem(key);
                if (data && typeof data === 'string') {
                    // 设置缓存
                    this._cache[key] = data;
                    result = JSON.parse(data);
                } else if (data !== '' && data !== null) {
                    result = undefined;
                }
            } catch (e) {
                result = undefined;
            }
            return result;
        },
        clear() {
            try {
                cc.sys.localStorage.clear();
                cc.js.clear(this._cache);
                return true;
            } catch (err) {
                return false;
            }
        }
    };
}
/**暴露全局提示 */
declare global {

    const GCocos: GCocos;
}
window['GCocos'] = new GCocos();