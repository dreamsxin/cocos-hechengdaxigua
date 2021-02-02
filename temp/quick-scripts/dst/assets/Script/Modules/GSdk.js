
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Modules/GSdk.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxNb2R1bGVzXFxHU2RrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUksTUFBTSxHQUFHO0lBQ1QsR0FBRyxFQUFFLFFBQVE7SUFDYixNQUFNLEVBQUUsT0FBTztJQUNmLFFBQVEsRUFBRSx5QkFBeUI7SUFDbkMsY0FBYyxFQUFFLHlCQUF5QjtJQUN6QyxvQkFBb0IsRUFBRSx5QkFBeUI7SUFDL0MsVUFBVSxFQUFFLHFDQUFxQztJQUNqRCxTQUFTLEVBQUU7UUFDUCxLQUFLLEVBQUUsZUFBZTtRQUN0QixRQUFRLEVBQUUsNkNBQTZDO1FBQ3ZELDRCQUE0QjtLQUMvQjtDQUNKLENBQUM7QUFFRjtJQUFBO1FBQ0ksWUFBTyxHQUFHLFFBQVEsQ0FBQztRQUNuQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsU0FBSSxHQUFHO1lBQ0gsTUFBTSxFQUFFLElBQUk7WUFDWixNQUFNLEVBQUUsSUFBSTtTQUNmLENBQUM7UUFvREYsVUFBSyxHQUFHO1lBQ0osTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSxLQUFLO1lBQ2IsTUFBTSxFQUFFLElBQUk7WUFDWixFQUFFLEVBQUUsSUFBSTtZQUNSLElBQUk7Z0JBQUosaUJBcUJDO2dCQXBCRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ2hGLGVBQWU7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBUSxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxlQUFlO2dCQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxD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LE1BQU0sQ0FBQyxLQUFLLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ2hEO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQztnQkFDekIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO2dCQUNuQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7Z0JBQ3pCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSzthQUN0QixDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFBQSxDQUFDO0lBMkhOLFdBQUM7QUFBRCxDQXBMQSxBQW9MQyxJQUFBO0FBcExZLG9CQUFJO0FBNExqQixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjb25maWcgPSB7XHJcbiAgICB2ZXI6ICd2MS4wLjEnLFxyXG4gICAgZ2FtZWlkOiAnaGNkeGcnLCAvL+WQiOaIkOWkp+ilv+eTnFxyXG4gICAgYWRVbml0SWQ6ICdhZHVuaXQtMDk2MmRiNmY1ZjY0MjI3ZScsXHJcbiAgICBhZFVuaXRJZEJhbm5lcjogJ2FkdW5pdC1jNjU3OTg3YWQwZGQyYzM0JyxcclxuICAgIGFkVW5pdElkSW50ZXJzdGl0aWFsOiAnYWR1bml0LWM4M2U5MjhkMzcxZWE5NmYnLFxyXG4gICAgc2VydmVySG9zdDogJ2h0dHBzOi8vbWluaWdhbWUudWNwb3BvLmNvbS9tYXRyaXgvJyxcclxuICAgIHNoYXJlRGF0YToge1xyXG4gICAgICAgIHRpdGxlOiBcIuacieS6ukDkvaAg6L+b5p2l5ZKM5oiR5LiA6LW3546pIVwiLFxyXG4gICAgICAgIGltYWdlVXJsOiBcImh0dHA6Ly9jb3MudWNwb3BvLmNvbS96cWNnYy9zaGFyZV94aWd1YS5qcGdcIlxyXG4gICAgICAgIC8vaW1hZ2VVcmw6ICdyZXMvc2hhcmUucG5nJyxcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgR1NkayB7XHJcbiAgICB2ZXJzaW9uID0gJ3YxLjAuMSc7XHJcbiAgICBpc0luaXQgPSBmYWxzZTtcclxuICAgIHVzZXIgPSB7XHJcbiAgICAgICAgb3BlbmlkOiBudWxsLCAvL+eUqOaIt+eahG9wZW5pZFxyXG4gICAgICAgIHNlc3NpZDogbnVsbCwgLy/nlKjmiLfnmoRzZXNzaWRcclxuICAgIH07XHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIGlmICh3aW5kb3dbJ3d4J10gJiYgIXRoaXMuaXNJbml0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHU2RrIGluaXQnKTtcclxuICAgICAgICAgICAgdGhpcy5pc0luaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAvLyDliJ3lp4vljJbmv4DlirHop4bpopHnu4Tku7ZcclxuICAgICAgICAgICAgdGhpcy52aWRlby5pbml0KCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5iYW5uZXIuaW5pdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmludGVyc3RpdGlhbC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5vblNoYXJlQXBwTWVzc2FnZSgpO1xyXG4gICAgICAgICAgICB3aW5kb3dbJ3d4J10uc2V0S2VlcFNjcmVlbk9uKHsga2VlcFNjcmVlbk9uOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU5ldygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZU5ldygpIHtcclxuICAgICAgICBpZiAod2luZG93Wyd3eCddKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZU1hbmFnZXIgPSB3aW5kb3dbJ3d4J10uZ2V0VXBkYXRlTWFuYWdlcigpO1xyXG4gICAgICAgICAgICB1cGRhdGVNYW5hZ2VyLm9uVXBkYXRlUmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlTWFuYWdlci5hcHBseVVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy/nm5HlkKznlKjmiLfngrnlh7vlj7PkuIrop5Loj5zljZXnmoTjgIzovazlj5HjgI3mjInpkq7ml7bop6blj5HnmoTkuovku7ZcclxuICAgIG9uU2hhcmVBcHBNZXNzYWdlKCkge1xyXG4gICAgICAgIGlmICh3aW5kb3dbJ3d4J10pIHtcclxuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gJ3NoYXJlaWQ9JyArIHRoaXMudXNlci5vcGVuaWQ7XHJcbiAgICAgICAgICAgIHdpbmRvd1snd3gnXS5zaG93U2hhcmVNZW51KHtcclxuICAgICAgICAgICAgICAgIHdpdGhTaGFyZVRpY2tldDogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgd2luZG93Wyd3eCddLm9uU2hhcmVBcHBNZXNzYWdlKCgpID0+ICh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogY29uZmlnLnNoYXJlRGF0YS50aXRsZSxcclxuICAgICAgICAgICAgICAgIGltYWdlVXJsOiBjb25maWcuc2hhcmVEYXRhLmltYWdlVXJsLFxyXG4gICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8v5Li75Yqo5ouJ6LW36L2s5Y+R77yM6L+b5YWl6YCJ5oup6YCa6K6v5b2V55WM6Z2i44CCXHJcbiAgICBzaGFyZUFwcE1lc3NhZ2UocGFyYW1zKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvd1snd3gnXSkge1xyXG4gICAgICAgICAgICBpZiAoIXBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge307XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMudGl0bGUgPSBjb25maWcuc2hhcmVEYXRhLnRpdGxlO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmltYWdlVXJsID0gY29uZmlnLnNoYXJlRGF0YS5pbWFnZVVybDtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5xdWVyeSA9ICdzaGFyZWlkPScgKyB0aGlzLnVzZXIub3BlbmlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpbmRvd1snd3gnXS5zaGFyZUFwcE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IHBhcmFtcy50aXRsZSxcclxuICAgICAgICAgICAgICAgIGltYWdlVXJsOiBwYXJhbXMuaW1hZ2VVcmwsXHJcbiAgICAgICAgICAgICAgICBxdWVyeTogcGFyYW1zLnF1ZXJ5LFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmlkZW8gPSB7XHJcbiAgICAgICAgaXNJbml0OiBmYWxzZSxcclxuICAgICAgICBlcnJDb2RlOiBmYWxzZSxcclxuICAgICAgICBpc0xvYWQ6IGZhbHNlLCAvL+S7juW+ruS/oeaLieWPluS/oeaBr++8jOabtOaWsOaYr+WQpuWPr+eci+inhumikeeKtuaAgVxyXG4gICAgICAgIF92aWRlbzogbnVsbCxcclxuICAgICAgICBjYjogbnVsbCwgLy/mkq3mlL7lm57osINcclxuICAgICAgICBpbml0KCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzSW5pdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZGVvID0gd2luZG93Wyd3eCddLmNyZWF0ZVJld2FyZGVkVmlkZW9BZCh7IGFkVW5pdElkOiBjb25maWcuYWRVbml0SWQgfSk7XHJcbiAgICAgICAgICAgIC8vIOebkeWQrOa/gOWKseinhumikeW5v+WRiuWKoOi9veS6i+S7tlxyXG4gICAgICAgICAgICB0aGlzLl92aWRlby5vbkxvYWQoKCkgPT4geyB0aGlzLmlzTG9hZCA9IHRydWU7IH0pO1xyXG4gICAgICAgICAgICAvLyDnm5HlkKzmv4DlirHop4bpopHlub/lkYrlhbPpl63kuovku7ZcclxuICAgICAgICAgICAgdGhpcy5fdmlkZW8ub25DbG9zZShyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuaXNFbmRlZCB8fCByZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2IgJiYgdGhpcy5jYihudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+aSreaUvuS4remAlOmAgOWHuu+8jOS4jeS4i+WPkea4uOaIj+WlluWKsScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2IgJiYgdGhpcy5jYih0cnVlLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY2IgPSBudWxsO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy/nm5HlkKzmv4DlirHop4bpopHplJnor6/kuovku7ZcclxuICAgICAgICAgICAgdGhpcy5fdmlkZW8ub25FcnJvcigocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLmVyckNvZGUgPj0gMTAwNCAmJiByZXMuZXJyQ29kZSA8PSAxMDA4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJDb2RlID0gcmVzLmVyckNvZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2hvdyhjYikge1xyXG4gICAgICAgICAgICBpZiAoIXdpbmRvd1snd3gnXSkge1xyXG4gICAgICAgICAgICAgICAgY2IgJiYgY2IoJ+S4jeWcqOW+ruS/oeeOr+Wig+S4iycsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5lcnJDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92aWRlby5sb2FkKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5faGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNiID0gY2I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZGVvLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5pys5qyh6KeG6aKR5pKt5pS+5aSx6LSl77yM5pu05paw5Y+v5pKt5pS+54q25oCBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZGVvLmxvYWQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5lcnJDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYiAmJiBjYign5pqC5peg6KeG6aKR5Y+v55yLKCcgKyByZXMuZXJyQ29kZSArICcpJywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYiAmJiBjYign54K55aSq5b+r5LqGJywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNiICYmIGNiKCfmmoLml6Dop4bpopHlj6/nnIsnLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBpbnRlcnN0aXRpYWwgPSB7XHJcbiAgICAgICAgY2xvc2VDYjogbnVsbCwgLy/lhbPpl63lm57osINcclxuICAgICAgICBpdGVtOiBudWxsLFxyXG4gICAgICAgIGNyZWF0ZSgpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB3aW5kb3dbJ3d4J10uY3JlYXRlSW50ZXJzdGl0aWFsQWQoe1xyXG4gICAgICAgICAgICAgICAgYWRVbml0SWQ6IGNvbmZpZy5hZFVuaXRJZEludGVyc3RpdGlhbFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXRlbS5vbkxvYWQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5vbkNsb3NlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQ2IgJiYgdGhpcy5jbG9zZUNiKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNob3coY2I/KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2VDYiA9IGNiIHx8IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0uc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBzdG9yYWdlID0ge1xyXG4gICAgICAgIF9jYWNoZToge30sXHJcbiAgICAgICAgc2V0KGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6K6+572u57yT5a2YXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVba2V5XSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYy5lcnJvcignZXJyb3InKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXQoa2V5KSB7XHJcbiAgICAgICAgICAgIC8vIOWFiOivu+WPlue8k+WtmFxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2NhY2hlW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLl9jYWNoZVtrZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7nvJPlrZhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZVtrZXldID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhICE9PSAnJyAmJiBkYXRhICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsZWFyKCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgY2MuanMuY2xlYXIodGhpcy5fY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4vKirmmrTpnLLlhajlsYDmj5DnpLogKi9cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgLyoqXHJcbiAgICAgKiDop4bpopHlub/lkYrmqKHlnZdcclxuICAgICAqL1xyXG4gICAgY29uc3QgR1NkazogR1NkaztcclxufVxyXG53aW5kb3dbJ0dTZGsnXSA9IG5ldyBHU2RrKCk7Il19