var config = {
    ver: 'v1.0.1',
    gameid: 'hcdxg', //合成大西瓜
    adUnitId: 'adunit-0962db6f5f64227e',
    adUnitIdBanner: 'adunit-c657987ad0dd2c34',
    adUnitIdInterstitial: 'adunit-c83e928d371ea96f',
    serverHost: 'https://minigame.ucpopo.com/matrix/',
    shareData: {
        title: "有人@你 进来和我一起玩!",
        imageUrl: "http://cos.ucpopo.com/zqcgc/share_xigua.jpg"
        //imageUrl: 'res/share.png',
    },
};

export class GSdk {
    version = 'v1.0.1';
    isInit = false;
    user = {
        openid: null, //用户的openid
        sessid: null, //用户的sessid
    };
    init() {
        if (window['wx'] && !this.isInit) {
            console.log('GSdk init');
            this.isInit = true;
            // 初始化激励视频组件
            this.video.init();
            //this.banner.init();
            this.interstitial.create();
            this.onShareAppMessage();
            window['wx'].setKeepScreenOn({ keepScreenOn: true });
            this.updateNew();
        }
    }
    updateNew() {
        if (window['wx']) {
            const updateManager = window['wx'].getUpdateManager();
            updateManager.onUpdateReady(function () {
                updateManager.applyUpdate();
            });
        }
    };
    //监听用户点击右上角菜单的「转发」按钮时触发的事件
    onShareAppMessage() {
        if (window['wx']) {
            let query = 'shareid=' + this.user.openid;
            window['wx'].showShareMenu({
                withShareTicket: true
            });
            window['wx'].onShareAppMessage(() => ({
                title: config.shareData.title,
                imageUrl: config.shareData.imageUrl,
                query: query,
            }));
        }
    };
    //主动拉起转发，进入选择通讯录界面。
    shareAppMessage(params) {
        if (window['wx']) {
            if (!params) {
                params = {};
                params.title = config.shareData.title;
                params.imageUrl = config.shareData.imageUrl;
                params.query = 'shareid=' + this.user.openid;
            }
            window['wx'].shareAppMessage({
                title: params.title,
                imageUrl: params.imageUrl,
                query: params.query,
            });
        }
    };
    video = {
        isInit: false,
        errCode: false,
        isLoad: false, //从微信拉取信息，更新是否可看视频状态
        _video: null,
        cb: null, //播放回调
        init() {
            this.isInit = true;
            this._video = window['wx'].createRewardedVideoAd({ adUnitId: config.adUnitId });
            // 监听激励视频广告加载事件
            this._video.onLoad(() => { this.isLoad = true; });
            // 监听激励视频广告关闭事件
            this._video.onClose(res => {
                if (res && res.isEnded || res === undefined) {
                    this.cb && this.cb(null, true);
                } else {
                    console.log('播放中途退出，不下发游戏奖励');
                    this.cb && this.cb(true, null);
                }
                this.cb = null;
            });
            //监听激励视频错误事件
            this._video.onError((res) => {
                if (res.errCode >= 1004 && res.errCode <= 1008) {
                    this.errCode = res.errCode;
                }
            });
        },
        show(cb) {
            if (!window['wx']) {
                cb && cb('不在微信环境下', null);
                return;
            }
            if (!this.errCode) {
                this._video.load()
                    .then(() => {
                        //this._hide();
                        this.cb = cb;
                        this._video.show();
                    })
                    .catch((res) => {
                        //本次视频播放失败，更新可播放状态
                        this._video.load();
                        if (res.errCode) {
                            cb && cb('暂无视频可看(' + res.errCode + ')', null);
                        } else {
                            cb && cb('点太快了', null);
                        }
                    });
            } else {
                cb && cb('暂无视频可看', null);
            }
        }
    };
    interstitial = {
        closeCb: null, //关闭回调
        item: null,
        create() {
            let item = window['wx'].createInterstitialAd({
                adUnitId: config.adUnitIdInterstitial
            });
            item.onLoad(() => {
                this.item = item;
                this.item.onClose(() => {
                    this.closeCb && this.closeCb();
                    this.create();
                });
            });
        },
        show(cb?) {
            this.closeCb = cb || null;
            this.item && this.item.show();
        }
    };
    storage = {
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
    /**
     * 视频广告模块
     */
    const GSdk: GSdk;
}
window['GSdk'] = new GSdk();