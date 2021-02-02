"use strict";
cc._RF.push(module, '2b3c4S7bu9CYYlRPXlWODVg', 'GSdk');
// Script/Modules/GSdk.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSdk = void 0;
var config = {
    ver: 'v1.0.1',
    gameid: 'hcdxg',
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
var GSdk = /** @class */ (function () {
    function GSdk() {
        this.version = 'v1.0.1';
        this.isInit = false;
        this.user = {
            openid: null,
            sessid: null,
        };
        this.video = {
            isInit: false,
            errCode: false,
            isLoad: false,
            _video: null,
            cb: null,
            init: function () {
                var _this = this;
                this.isInit = true;
                this._video = window['wx'].createRewardedVideoAd({ adUnitId: config.adUnitId });
                // 监听激励视频广告加载事件
                this._video.onLoad(function () { _this.isLoad = true; });
                // 监听激励视频广告关闭事件
                this._video.onClose(function (res) {
                    if (res && res.isEnded || res === undefined) {
                        _this.cb && _this.cb(null, true);
                    }
                    else {
                        console.log('播放中途退出，不下发游戏奖励');
                        _this.cb && _this.cb(true, null);
                    }
                    _this.cb = null;
                });
                //监听激励视频错误事件
                this._video.onError(function (res) {
                    if (res.errCode >= 1004 && res.errCode <= 1008) {
                        _this.errCode = res.errCode;
                    }
                });
            },
            show: function (cb) {
                var _this = this;
                if (!window['wx']) {
                    cb && cb('不在微信环境下', null);
                    return;
                }
                if (!this.errCode) {
                    this._video.load()
                        .then(function () {
                        //this._hide();
                        _this.cb = cb;
                        _this._video.show();
                    })
                        .catch(function (res) {
                        //本次视频播放失败，更新可播放状态
                        _this._video.load();
                        if (res.errCode) {
                            cb && cb('暂无视频可看(' + res.errCode + ')', null);
                        }
                        else {
                            cb && cb('点太快了', null);
                        }
                    });
                }
                else {
                    cb && cb('暂无视频可看', null);
                }
            }
        };
        this.interstitial = {
            closeCb: null,
            item: null,
            create: function () {
                var _this = this;
                var item = window['wx'].createInterstitialAd({
                    adUnitId: config.adUnitIdInterstitial
                });
                item.onLoad(function () {
                    _this.item = item;
                    _this.item.onClose(function () {
                        _this.closeCb && _this.closeCb();
                        _this.create();
                    });
                });
            },
            show: function (cb) {
                this.closeCb = cb || null;
                this.item && this.item.show();
            }
        };
        this.storage = {
            _cache: {},
            set: function (key, value) {
                if (typeof key === 'string' && typeof value !== 'undefined') {
                    try {
                        var data = JSON.stringify(value);
                        cc.sys.localStorage.setItem(key, data);
                        // 设置缓存
                        this._cache[key] = data;
                        return true;
                    }
                    catch (err) {
                    }
                }
                else {
                    cc.error('error');
                }
                return false;
            },
            get: function (key) {
                // 先读取缓存
                if (typeof this._cache[key] !== 'undefined') {
                    return JSON.parse(this._cache[key]);
                }
                var result = null;
                try {
                    var data = cc.sys.localStorage.getItem(key);
                    if (data && typeof data === 'string') {
                        // 设置缓存
                        this._cache[key] = data;
                        result = JSON.parse(data);
                    }
                    else if (data !== '' && data !== null) {
                        result = undefined;
                    }
                }
                catch (e) {
                    result = undefined;
                }
                return result;
            },
            clear: function () {
                try {
                    cc.sys.localStorage.clear();
                    cc.js.clear(this._cache);
                    return true;
                }
                catch (err) {
                    return false;
                }
            }
        };
    }
    GSdk.prototype.init = function () {
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
    };
    GSdk.prototype.updateNew = function () {
        if (window['wx']) {
            var updateManager_1 = window['wx'].getUpdateManager();
            updateManager_1.onUpdateReady(function () {
                updateManager_1.applyUpdate();
            });
        }
    };
    ;
    //监听用户点击右上角菜单的「转发」按钮时触发的事件
    GSdk.prototype.onShareAppMessage = function () {
        if (window['wx']) {
            var query_1 = 'shareid=' + this.user.openid;
            window['wx'].showShareMenu({
                withShareTicket: true
            });
            window['wx'].onShareAppMessage(function () { return ({
                title: config.shareData.title,
                imageUrl: config.shareData.imageUrl,
                query: query_1,
            }); });
        }
    };
    ;
    //主动拉起转发，进入选择通讯录界面。
    GSdk.prototype.shareAppMessage = function (params) {
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
    ;
    return GSdk;
}());
exports.GSdk = GSdk;
window['GSdk'] = new GSdk();

cc._RF.pop();