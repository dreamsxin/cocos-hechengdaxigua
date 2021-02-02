
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/Script/AudioManager');
require('./assets/Script/AutoRotationSc');
require('./assets/Script/BallSc');
require('./assets/Script/Component/BannerShow');
require('./assets/Script/Component/InterstitialShow');
require('./assets/Script/Component/WxSubShow');
require('./assets/Script/GameUI');
require('./assets/Script/Modules/GCocos');
require('./assets/Script/Modules/GData');
require('./assets/Script/Modules/GEvent');
require('./assets/Script/Modules/GSdk');
require('./assets/Script/WaterEffectSc');

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
//------QC-SOURCE-SPLIT------

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
        //子域通信
        this.sub = {
            showRank: function (node) {
                window['wx'] && window['wx'].getOpenDataContext().postMessage({
                    event: 'updateViewPort',
                    box: node.getBoundingBoxToWorld(),
                    winSize: cc.winSize,
                });
            },
            //上传分数
            uploadScore: function (score) {
                window['wx'] && window['wx'].getOpenDataContext().postMessage({
                    event: 'score',
                    score: score,
                });
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
    //轻微震动
    GSdk.prototype.vibrateShort = function () {
        window['wx'] && window['wx'].vibrateShort({ type: 'medium' }); //震动强度类型，有效值为：heavy、medium、light
    };
    ;
    GSdk.prototype.vibrateLong = function () {
        window['wx'] && window['wx'].vibrateLong();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxNb2R1bGVzXFxHU2RrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUksTUFBTSxHQUFHO0lBQ1QsR0FBRyxFQUFFLFFBQVE7SUFDYixNQUFNLEVBQUUsT0FBTztJQUNmLFFBQVEsRUFBRSx5QkFBeUI7SUFDbkMsY0FBYyxFQUFFLHlCQUF5QjtJQUN6QyxvQkFBb0IsRUFBRSx5QkFBeUI7SUFDL0MsVUFBVSxFQUFFLHFDQUFxQztJQUNqRCxTQUFTLEVBQUU7UUFDUCxLQUFLLEVBQUUsZUFBZTtRQUN0QixRQUFRLEVBQUUsNkNBQTZDO1FBQ3ZELDRCQUE0QjtLQUMvQjtDQUNKLENBQUM7QUFFRjtJQUFBO1FBQ0ksWUFBTyxHQUFHLFFBQVEsQ0FBQztRQUNuQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsU0FBSSxHQUFHO1lBQ0gsTUFBTSxFQUFFLElBQUk7WUFDWixNQUFNLEVBQUUsSUFBSTtTQUNmLENBQUM7UUEyREYsVUFBSyxHQUFHO1lBQ0osTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSxLQUFLO1lBQ2IsTUFBTSxFQUFFLElBQUk7WUFDWixFQUFFLEVBQUUsSUFBSTtZQUNSLElBQUk7Z0JBQUosaUJBcUJDO2dCQXBCRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ2hGLGVBQWU7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBUSxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxlQUFlO2dCQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztvQkFDbkIsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO3dCQUN6QyxLQUFJLENBQUMsRUFBRSxJQUFJLEtBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUNsQzt5QkFBTTt3QkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7d0JBQzlCLEtBQUksQ0FBQyxFQUFFLElBQUksS0FBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ2xDO29CQUNELEtBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixDQUFDLENBQUMsQ0FBQztnQkFDSCxZQUFZO2dCQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztvQkFDcEIsSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRTt3QkFDNUMsS0FBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO3FCQUM5QjtnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxJQUFJLFlBQUMsRUFBRTtnQkFBUCxpQkF3QkM7Z0JBdkJHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2YsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzFCLE9BQU87aUJBQ1Y7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7eUJBQ2IsSUFBSSxDQUFDO3dCQUNGLGVBQWU7d0JBQ2YsS0FBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7d0JBQ2IsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDdkIsQ0FBQyxDQUFDO3lCQUNELEtBQUssQ0FBQyxVQUFDLEdBQUc7d0JBQ1Asa0JBQWtCO3dCQUNsQixLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNuQixJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7NEJBQ2IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7eUJBQ2pEOzZCQUFNOzRCQUNILEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO3lCQUMxQjtvQkFDTCxDQUFDLENBQUMsQ0FBQztpQkFDVjtxQkFBTTtvQkFDSCxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDNUI7WUFDTCxDQUFDO1NBQ0osQ0FBQztRQUNGLGlCQUFZLEdBQUc7WUFDWCxPQUFPLEVBQUUsSUFBSTtZQUNiLElBQUksRUFBRSxJQUFJO1lBQ1YsTUFBTTtnQkFBTixpQkFXQztnQkFWRyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsb0JBQW9CLENBQUM7b0JBQ3pDLFFBQVEsRUFBRSxNQUFNLENBQUMsb0JBQW9CO2lCQUN4QyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDUixLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDakIsS0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7d0JBQ2QsS0FBSSxDQUFDLE9BQU8sSUFBSSxLQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBQy9CLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDbEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBQ0QsSUFBSSxFQUFKLFVBQUssRUFBRztnQkFDSixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQyxDQUFDO1NBQ0osQ0FBQztRQUNGLE1BQU07UUFDTixRQUFHLEdBQUc7WUFDRixRQUFRLFlBQUMsSUFBSTtnQkFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsV0FBVyxDQUFDO29CQUMxRCxLQUFLLEVBQUUsZ0JBQWdCO29CQUN2QixHQUFHLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixFQUFFO29CQUNqQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU87aUJBQ3RCLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxNQUFNO1lBQ04sV0FBVyxFQUFYLFVBQVksS0FBYTtnQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFdBQVcsQ0FBQztvQkFDMUQsS0FBSyxFQUFFLE9BQU87b0JBQ2QsS0FBSyxFQUFFLEtBQUs7aUJBQ2YsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztTQUNKLENBQUE7SUFDTCxDQUFDO0lBckpHLG1CQUFJLEdBQUo7UUFDSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNuQixZQUFZO1lBQ1osSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQixxQkFBcUI7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3BCO0lBQ0wsQ0FBQztJQUNELHdCQUFTLEdBQVQ7UUFDSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNkLElBQU0sZUFBYSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3RELGVBQWEsQ0FBQyxhQUFhLENBQUM7Z0JBQ3hCLGVBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUFBLENBQUM7SUFDRiwwQkFBMEI7SUFDMUIsZ0NBQWlCLEdBQWpCO1FBQ0ksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDZCxJQUFJLE9BQUssR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQztnQkFDdkIsZUFBZSxFQUFFLElBQUk7YUFDeEIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLGNBQU0sT0FBQSxDQUFDO2dCQUNsQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLO2dCQUM3QixRQUFRLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRO2dCQUNuQyxLQUFLLEVBQUUsT0FBSzthQUNmLENBQUMsRUFKbUMsQ0FJbkMsQ0FBQyxDQUFDO1NBQ1A7SUFDTCxDQUFDO0lBQUEsQ0FBQztJQUNGLG1CQUFtQjtJQUNuQiw4QkFBZSxHQUFmLFVBQWdCLE1BQU07UUFDbEIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNULE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ1osTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDdEMsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztnQkFDNUMsTUFBTSxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7YUFDaEQ7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDO2dCQUN6QixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUs7Z0JBQ25CLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTtnQkFDekIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO2FBQ3RCLENBQUMsQ0FBQztTQUNOO0lBQ0wsQ0FBQztJQUFBLENBQUM7SUFDRixNQUFNO0lBQ04sMkJBQVksR0FBWjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQSxnQ0FBZ0M7SUFDbEcsQ0FBQztJQUFBLENBQUM7SUFDRiwwQkFBVyxHQUFYO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBQUEsQ0FBQztJQTRGTixXQUFDO0FBQUQsQ0E1SkEsQUE0SkMsSUFBQTtBQTVKWSxvQkFBSTtBQW9LakIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY29uZmlnID0ge1xyXG4gICAgdmVyOiAndjEuMC4xJyxcclxuICAgIGdhbWVpZDogJ2hjZHhnJywgLy/lkIjmiJDlpKfopb/nk5xcclxuICAgIGFkVW5pdElkOiAnYWR1bml0LTA5NjJkYjZmNWY2NDIyN2UnLFxyXG4gICAgYWRVbml0SWRCYW5uZXI6ICdhZHVuaXQtYzY1Nzk4N2FkMGRkMmMzNCcsXHJcbiAgICBhZFVuaXRJZEludGVyc3RpdGlhbDogJ2FkdW5pdC1jODNlOTI4ZDM3MWVhOTZmJyxcclxuICAgIHNlcnZlckhvc3Q6ICdodHRwczovL21pbmlnYW1lLnVjcG9wby5jb20vbWF0cml4LycsXHJcbiAgICBzaGFyZURhdGE6IHtcclxuICAgICAgICB0aXRsZTogXCLmnInkurpA5L2gIOi/m+adpeWSjOaIkeS4gOi1t+eOqSFcIixcclxuICAgICAgICBpbWFnZVVybDogXCJodHRwOi8vY29zLnVjcG9wby5jb20venFjZ2Mvc2hhcmVfeGlndWEuanBnXCJcclxuICAgICAgICAvL2ltYWdlVXJsOiAncmVzL3NoYXJlLnBuZycsXHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIEdTZGsge1xyXG4gICAgdmVyc2lvbiA9ICd2MS4wLjEnO1xyXG4gICAgaXNJbml0ID0gZmFsc2U7XHJcbiAgICB1c2VyID0ge1xyXG4gICAgICAgIG9wZW5pZDogbnVsbCwgLy/nlKjmiLfnmoRvcGVuaWRcclxuICAgICAgICBzZXNzaWQ6IG51bGwsIC8v55So5oi355qEc2Vzc2lkXHJcbiAgICB9O1xyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICBpZiAod2luZG93Wyd3eCddICYmICF0aGlzLmlzSW5pdCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR1NkayBpbml0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNJbml0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy8g5Yid5aeL5YyW5r+A5Yqx6KeG6aKR57uE5Lu2XHJcbiAgICAgICAgICAgIHRoaXMudmlkZW8uaW5pdCgpO1xyXG4gICAgICAgICAgICAvL3RoaXMuYmFubmVyLmluaXQoKTtcclxuICAgICAgICAgICAgdGhpcy5pbnRlcnN0aXRpYWwuY3JlYXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25TaGFyZUFwcE1lc3NhZ2UoKTtcclxuICAgICAgICAgICAgd2luZG93Wyd3eCddLnNldEtlZXBTY3JlZW5Pbih7IGtlZXBTY3JlZW5PbjogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVOZXcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGVOZXcoKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvd1snd3gnXSkge1xyXG4gICAgICAgICAgICBjb25zdCB1cGRhdGVNYW5hZ2VyID0gd2luZG93Wyd3eCddLmdldFVwZGF0ZU1hbmFnZXIoKTtcclxuICAgICAgICAgICAgdXBkYXRlTWFuYWdlci5vblVwZGF0ZVJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZU1hbmFnZXIuYXBwbHlVcGRhdGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8v55uR5ZCs55So5oi354K55Ye75Y+z5LiK6KeS6I+c5Y2V55qE44CM6L2s5Y+R44CN5oyJ6ZKu5pe26Kem5Y+R55qE5LqL5Lu2XHJcbiAgICBvblNoYXJlQXBwTWVzc2FnZSgpIHtcclxuICAgICAgICBpZiAod2luZG93Wyd3eCddKSB7XHJcbiAgICAgICAgICAgIGxldCBxdWVyeSA9ICdzaGFyZWlkPScgKyB0aGlzLnVzZXIub3BlbmlkO1xyXG4gICAgICAgICAgICB3aW5kb3dbJ3d4J10uc2hvd1NoYXJlTWVudSh7XHJcbiAgICAgICAgICAgICAgICB3aXRoU2hhcmVUaWNrZXQ6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdpbmRvd1snd3gnXS5vblNoYXJlQXBwTWVzc2FnZSgoKSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IGNvbmZpZy5zaGFyZURhdGEudGl0bGUsXHJcbiAgICAgICAgICAgICAgICBpbWFnZVVybDogY29uZmlnLnNoYXJlRGF0YS5pbWFnZVVybCxcclxuICAgICAgICAgICAgICAgIHF1ZXJ5OiBxdWVyeSxcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvL+S4u+WKqOaLiei1t+i9rOWPke+8jOi/m+WFpemAieaLqemAmuiur+W9leeVjOmdouOAglxyXG4gICAgc2hhcmVBcHBNZXNzYWdlKHBhcmFtcykge1xyXG4gICAgICAgIGlmICh3aW5kb3dbJ3d4J10pIHtcclxuICAgICAgICAgICAgaWYgKCFwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnRpdGxlID0gY29uZmlnLnNoYXJlRGF0YS50aXRsZTtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5pbWFnZVVybCA9IGNvbmZpZy5zaGFyZURhdGEuaW1hZ2VVcmw7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMucXVlcnkgPSAnc2hhcmVpZD0nICsgdGhpcy51c2VyLm9wZW5pZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aW5kb3dbJ3d4J10uc2hhcmVBcHBNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBwYXJhbXMudGl0bGUsXHJcbiAgICAgICAgICAgICAgICBpbWFnZVVybDogcGFyYW1zLmltYWdlVXJsLFxyXG4gICAgICAgICAgICAgICAgcXVlcnk6IHBhcmFtcy5xdWVyeSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8v6L275b6u6ZyH5YqoXHJcbiAgICB2aWJyYXRlU2hvcnQoKSB7XHJcbiAgICAgICAgd2luZG93Wyd3eCddICYmIHdpbmRvd1snd3gnXS52aWJyYXRlU2hvcnQoeyB0eXBlOiAnbWVkaXVtJyB9KTsvL+mch+WKqOW8uuW6puexu+Wei++8jOacieaViOWAvOS4uu+8mmhlYXZ544CBbWVkaXVt44CBbGlnaHRcclxuICAgIH07XHJcbiAgICB2aWJyYXRlTG9uZygpIHtcclxuICAgICAgICB3aW5kb3dbJ3d4J10gJiYgd2luZG93Wyd3eCddLnZpYnJhdGVMb25nKCk7XHJcbiAgICB9O1xyXG4gICAgdmlkZW8gPSB7XHJcbiAgICAgICAgaXNJbml0OiBmYWxzZSxcclxuICAgICAgICBlcnJDb2RlOiBmYWxzZSxcclxuICAgICAgICBpc0xvYWQ6IGZhbHNlLCAvL+S7juW+ruS/oeaLieWPluS/oeaBr++8jOabtOaWsOaYr+WQpuWPr+eci+inhumikeeKtuaAgVxyXG4gICAgICAgIF92aWRlbzogbnVsbCxcclxuICAgICAgICBjYjogbnVsbCwgLy/mkq3mlL7lm57osINcclxuICAgICAgICBpbml0KCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzSW5pdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZGVvID0gd2luZG93Wyd3eCddLmNyZWF0ZVJld2FyZGVkVmlkZW9BZCh7IGFkVW5pdElkOiBjb25maWcuYWRVbml0SWQgfSk7XHJcbiAgICAgICAgICAgIC8vIOebkeWQrOa/gOWKseinhumikeW5v+WRiuWKoOi9veS6i+S7tlxyXG4gICAgICAgICAgICB0aGlzLl92aWRlby5vbkxvYWQoKCkgPT4geyB0aGlzLmlzTG9hZCA9IHRydWU7IH0pO1xyXG4gICAgICAgICAgICAvLyDnm5HlkKzmv4DlirHop4bpopHlub/lkYrlhbPpl63kuovku7ZcclxuICAgICAgICAgICAgdGhpcy5fdmlkZW8ub25DbG9zZShyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuaXNFbmRlZCB8fCByZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2IgJiYgdGhpcy5jYihudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+aSreaUvuS4remAlOmAgOWHuu+8jOS4jeS4i+WPkea4uOaIj+WlluWKsScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2IgJiYgdGhpcy5jYih0cnVlLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY2IgPSBudWxsO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy/nm5HlkKzmv4DlirHop4bpopHplJnor6/kuovku7ZcclxuICAgICAgICAgICAgdGhpcy5fdmlkZW8ub25FcnJvcigocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLmVyckNvZGUgPj0gMTAwNCAmJiByZXMuZXJyQ29kZSA8PSAxMDA4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJDb2RlID0gcmVzLmVyckNvZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2hvdyhjYikge1xyXG4gICAgICAgICAgICBpZiAoIXdpbmRvd1snd3gnXSkge1xyXG4gICAgICAgICAgICAgICAgY2IgJiYgY2IoJ+S4jeWcqOW+ruS/oeeOr+Wig+S4iycsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5lcnJDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92aWRlby5sb2FkKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5faGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNiID0gY2I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZGVvLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5pys5qyh6KeG6aKR5pKt5pS+5aSx6LSl77yM5pu05paw5Y+v5pKt5pS+54q25oCBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZGVvLmxvYWQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5lcnJDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYiAmJiBjYign5pqC5peg6KeG6aKR5Y+v55yLKCcgKyByZXMuZXJyQ29kZSArICcpJywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYiAmJiBjYign54K55aSq5b+r5LqGJywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNiICYmIGNiKCfmmoLml6Dop4bpopHlj6/nnIsnLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBpbnRlcnN0aXRpYWwgPSB7XHJcbiAgICAgICAgY2xvc2VDYjogbnVsbCwgLy/lhbPpl63lm57osINcclxuICAgICAgICBpdGVtOiBudWxsLFxyXG4gICAgICAgIGNyZWF0ZSgpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB3aW5kb3dbJ3d4J10uY3JlYXRlSW50ZXJzdGl0aWFsQWQoe1xyXG4gICAgICAgICAgICAgICAgYWRVbml0SWQ6IGNvbmZpZy5hZFVuaXRJZEludGVyc3RpdGlhbFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXRlbS5vbkxvYWQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5vbkNsb3NlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQ2IgJiYgdGhpcy5jbG9zZUNiKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNob3coY2I/KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2VDYiA9IGNiIHx8IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0uc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvL+WtkOWfn+mAmuS/oVxyXG4gICAgc3ViID0ge1xyXG4gICAgICAgIHNob3dSYW5rKG5vZGUpIHtcclxuICAgICAgICAgICAgd2luZG93Wyd3eCddICYmIHdpbmRvd1snd3gnXS5nZXRPcGVuRGF0YUNvbnRleHQoKS5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgICAgICBldmVudDogJ3VwZGF0ZVZpZXdQb3J0JyxcclxuICAgICAgICAgICAgICAgIGJveDogbm9kZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKSwsXHJcbiAgICAgICAgICAgICAgICB3aW5TaXplOiBjYy53aW5TaXplLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5LiK5Lyg5YiG5pWwXHJcbiAgICAgICAgdXBsb2FkU2NvcmUoc2NvcmU6IG51bWJlcikge1xyXG4gICAgICAgICAgICB3aW5kb3dbJ3d4J10gJiYgd2luZG93Wyd3eCddLmdldE9wZW5EYXRhQ29udGV4dCgpLnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgIGV2ZW50OiAnc2NvcmUnLFxyXG4gICAgICAgICAgICAgICAgc2NvcmU6IHNjb3JlLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoq5pq06Zyy5YWo5bGA5o+Q56S6ICovXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIC8qKlxyXG4gICAgICogd3ggc2Rr5qih5Z2XXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IEdTZGs6IEdTZGs7XHJcbn1cclxud2luZG93WydHU2RrJ10gPSBuZXcgR1NkaygpOyJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/WaterEffectSc.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'cd5d8rJ+QRIdpg05zYhfmq5', 'WaterEffectSc');
// Script/WaterEffectSc.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var WaterEffectSc = /** @class */ (function (_super) {
    __extends(WaterEffectSc, _super);
    function WaterEffectSc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WaterEffectSc.prototype.start = function () {
        this.node.scale = 0;
        cc.tween(this.node)
            .to(0.15, { scale: 1 }, { easing: cc.easeBackOut().easing })
            .delay(0.3)
            .to(0.3, { opacity: 0 })
            .removeSelf()
            .start();
        this.node.angle = Math.random() * 360;
    };
    WaterEffectSc = __decorate([
        ccclass
    ], WaterEffectSc);
    return WaterEffectSc;
}(cc.Component));
exports.default = WaterEffectSc;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxXYXRlckVmZmVjdFNjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNNLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBRzVDO0lBQTJDLGlDQUFZO0lBQXZEOztJQVlBLENBQUM7SUFWRyw2QkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNkLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzNELEtBQUssQ0FBQyxHQUFHLENBQUM7YUFDVixFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ3ZCLFVBQVUsRUFBRTthQUNaLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUMxQyxDQUFDO0lBWGdCLGFBQWE7UUFEakMsT0FBTztPQUNhLGFBQWEsQ0FZakM7SUFBRCxvQkFBQztDQVpELEFBWUMsQ0FaMEMsRUFBRSxDQUFDLFNBQVMsR0FZdEQ7a0JBWm9CLGFBQWEiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdGVyRWZmZWN0U2MgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5zY2FsZSA9IDA7XHJcbiAgICAgICAgY2MudHdlZW4odGhpcy5ub2RlKVxyXG4gICAgICAgICAgICAudG8oMC4xNSwgeyBzY2FsZTogMSB9LCB7IGVhc2luZzogY2MuZWFzZUJhY2tPdXQoKS5lYXNpbmcgfSlcclxuICAgICAgICAgICAgLmRlbGF5KDAuMylcclxuICAgICAgICAgICAgLnRvKDAuMywgeyBvcGFjaXR5OiAwIH0pXHJcbiAgICAgICAgICAgIC5yZW1vdmVTZWxmKClcclxuICAgICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmFuZ2xlID0gTWF0aC5yYW5kb20oKSAqIDM2MDtcclxuICAgIH1cclxufVxyXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Component/BannerShow.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b2b34asKT9JzpGBiZ8RItlI', 'BannerShow');
// Script/Component/BannerShow.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EChannel = cc.Enum({
    'NONE': 0,
    'wx': 1,
});
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BannerShow = /** @class */ (function (_super) {
    __extends(BannerShow, _super);
    function BannerShow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.channel = 'wx';
        _this.adUnitIdBanner = null;
        _this.updateTime = 50;
        _this.noBanner = false;
        _this._bannerAd = null; //banner缓存池
        _this._poolMax = 10;
        _this._pool = [];
        _this.setBannerStyle = function (ad) {
            var btnRect = this.node.getBoundingBoxToWorld();
            var anchorX = this.node.anchorX;
            var anchorY = this.node.anchorY;
            var frameSize = cc.view.getFrameSize(); // 屏幕尺寸
            var winSize = cc.winSize; // 实际分辨率
            var nodeX = btnRect.xMin + anchorX * btnRect.width;
            var nodeY = btnRect.yMin + anchorY * btnRect.height;
            var bannerHeight = ad.style.realHeight;
            var bannerWidth = ad.style.realWidth;
            var x = nodeX / winSize.width * frameSize.width;
            var y = (winSize.height - nodeY) / winSize.height * frameSize.height;
            var left = x - bannerWidth * anchorX;
            var top = y - bannerHeight * (1 - anchorY);
            ad.style.left = left;
            ad.style.top = top;
        };
        return _this;
    }
    BannerShow.prototype.onLoad = function () {
        this.bannerCreator();
    };
    BannerShow.prototype.onEnable = function () {
        var _this = this;
        this.bannerShow();
        this.schedule(function () {
            _this.bannerShow();
            _this.bannerCreator();
        }, this.updateTime);
    };
    BannerShow.prototype.onDisable = function () {
        this.unscheduleAllCallbacks();
        this.bannerHide();
    };
    BannerShow.prototype.bannerCreator = function () {
        var _this = this;
        if (this._pool.length > this._poolMax || this.noBanner) {
            return;
        }
        if (window[this.channel] && this.adUnitIdBanner) {
            var banner_1 = window[this.channel].createBannerAd({ adUnitId: this.adUnitIdBanner, style: { left: 0, top: 0, width: 360, } });
            banner_1.onError(function (res) { _this.noBanner = true; });
            banner_1.onLoad(function () {
                _this._pool.unshift(banner_1); //添加到数组的第一个
                if (_this.node.active && !_this._bannerAd) {
                    _this.bannerShow();
                }
            });
        }
    };
    BannerShow.prototype.bannerShow = function () {
        this.bannerHide();
        if (this._pool.length > 0) {
            this._bannerAd = this._pool.shift();
            this.setBannerStyle(this._bannerAd);
            this._bannerAd.show();
        }
    };
    BannerShow.prototype.bannerHide = function () {
        if (this._bannerAd) {
            this._bannerAd.hide();
            this._pool.push(this._bannerAd);
            this._bannerAd = null;
        }
    };
    __decorate([
        property({ displayName: '渠道' })
    ], BannerShow.prototype, "channel", void 0);
    __decorate([
        property
    ], BannerShow.prototype, "adUnitIdBanner", void 0);
    BannerShow = __decorate([
        ccclass
    ], BannerShow);
    return BannerShow;
}(cc.Component));
exports.default = BannerShow;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxDb21wb25lbnRcXEJhbm5lclNob3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztJQUNuQixNQUFNLEVBQUUsQ0FBQztJQUNULElBQUksRUFBRSxDQUFDO0NBQ1YsQ0FBQyxDQUFDO0FBQ0csSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFHNUM7SUFBd0MsOEJBQVk7SUFBcEQ7UUFBQSxxRUE4RUM7UUEzRUcsYUFBTyxHQUFXLElBQUksQ0FBQztRQUV2QixvQkFBYyxHQUFXLElBQUksQ0FBQztRQUV0QixnQkFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixjQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLGVBQVMsR0FBUSxJQUFJLENBQUMsQ0FBQyxXQUFXO1FBQ2xDLGNBQVEsR0FBVyxFQUFFLENBQUM7UUFDdEIsV0FBSyxHQUFVLEVBQUUsQ0FBQztRQWtEMUIsb0JBQWMsR0FBRyxVQUFVLEVBQU87WUFDOUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ2hELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ2hDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ2hDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQSxPQUFPO1lBQzlDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQSxRQUFRO1lBQ2pDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFD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QUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRUQsK0JBQVUsR0FBVjtRQUNJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUN6QjtJQUNMLENBQUM7SUF4REQ7UUFEQyxRQUFRLENBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUM7K0NBQ1Q7SUFFdkI7UUFEQyxRQUFRO3NEQUNxQjtJQUxiLFVBQVU7UUFEOUIsT0FBTztPQUNhLFVBQVUsQ0E4RTlCO0lBQUQsaUJBQUM7Q0E5RUQsQUE4RUMsQ0E5RXVDLEVBQUUsQ0FBQyxTQUFTLEdBOEVuRDtrQkE5RW9CLFVBQVUiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRUNoYW5uZWwgPSBjYy5FbnVtKHtcclxuICAgICdOT05FJzogMCxcclxuICAgICd3eCc6IDEsXHJcbn0pO1xyXG5jb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFubmVyU2hvdyBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgQHByb3BlcnR5KHsgZGlzcGxheU5hbWU6ICfmuKDpgZMnIH0pXHJcbiAgICBjaGFubmVsOiBzdHJpbmcgPSAnd3gnO1xyXG4gICAgQHByb3BlcnR5XHJcbiAgICBhZFVuaXRJZEJhbm5lcjogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVRpbWU6IG51bWJlciA9IDUwO1xyXG4gICAgcHJpdmF0ZSBub0Jhbm5lcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfYmFubmVyQWQ6IGFueSA9IG51bGw7IC8vYmFubmVy57yT5a2Y5rGgXHJcbiAgICBwcml2YXRlIF9wb29sTWF4OiBudW1iZXIgPSAxMDtcclxuICAgIHByaXZhdGUgX3Bvb2w6IGFueVtdID0gW107XHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5iYW5uZXJDcmVhdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25FbmFibGUoKSB7XHJcbiAgICAgICAgdGhpcy5iYW5uZXJTaG93KCk7XHJcbiAgICAgICAgdGhpcy5zY2hlZHVsZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYmFubmVyU2hvdygpO1xyXG4gICAgICAgICAgICB0aGlzLmJhbm5lckNyZWF0b3IoKTtcclxuICAgICAgICB9LCB0aGlzLnVwZGF0ZVRpbWUpO1xyXG4gICAgfVxyXG4gICAgb25EaXNhYmxlKCkge1xyXG4gICAgICAgIHRoaXMudW5zY2hlZHVsZUFsbENhbGxiYWNrcygpO1xyXG4gICAgICAgIHRoaXMuYmFubmVySGlkZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGJhbm5lckNyZWF0b3IoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Bvb2wubGVuZ3RoID4gdGhpcy5fcG9vbE1heCB8fCB0aGlzLm5vQmFubmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHdpbmRvd1t0aGlzLmNoYW5uZWxdICYmIHRoaXMuYWRVbml0SWRCYW5uZXIpIHtcclxuICAgICAgICAgICAgbGV0IGJhbm5lciA9IHdpbmRvd1t0aGlzLmNoYW5uZWxdLmNyZWF0ZUJhbm5lckFkKHsgYWRVbml0SWQ6IHRoaXMuYWRVbml0SWRCYW5uZXIsIHN0eWxlOiB7IGxlZnQ6IDAsIHRvcDogMCwgd2lkdGg6IDM2MCwgfSB9KTtcclxuICAgICAgICAgICAgYmFubmVyLm9uRXJyb3IoKHJlcykgPT4geyB0aGlzLm5vQmFubmVyID0gdHJ1ZTsgfSk7XHJcbiAgICAgICAgICAgIGJhbm5lci5vbkxvYWQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9vbC51bnNoaWZ0KGJhbm5lcik7Ly/mt7vliqDliLDmlbDnu4TnmoTnrKzkuIDkuKpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuYWN0aXZlICYmICF0aGlzLl9iYW5uZXJBZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFubmVyU2hvdygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYmFubmVyU2hvdygpIHtcclxuICAgICAgICB0aGlzLmJhbm5lckhpZGUoKTtcclxuICAgICAgICBpZiAodGhpcy5fcG9vbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhbm5lckFkID0gdGhpcy5fcG9vbC5zaGlmdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEJhbm5lclN0eWxlKHRoaXMuX2Jhbm5lckFkKTtcclxuICAgICAgICAgICAgdGhpcy5fYmFubmVyQWQuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiYW5uZXJIaWRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9iYW5uZXJBZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9iYW5uZXJBZC5oaWRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Bvb2wucHVzaCh0aGlzLl9iYW5uZXJBZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhbm5lckFkID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QmFubmVyU3R5bGUgPSBmdW5jdGlvbiAoYWQ6IGFueSkge1xyXG4gICAgICAgIHZhciBidG5SZWN0ID0gdGhpcy5ub2RlLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xyXG4gICAgICAgIHZhciBhbmNob3JYID0gdGhpcy5ub2RlLmFuY2hvclg7XHJcbiAgICAgICAgdmFyIGFuY2hvclkgPSB0aGlzLm5vZGUuYW5jaG9yWTtcclxuICAgICAgICBsZXQgZnJhbWVTaXplID0gY2Mudmlldy5nZXRGcmFtZVNpemUoKTsvLyDlsY/luZXlsLrlr7hcclxuICAgICAgICBsZXQgd2luU2l6ZSA9IGNjLndpblNpemU7Ly8g5a6e6ZmF5YiG6L6o546HXHJcbiAgICAgICAgbGV0IG5vZGVYID0gYnRuUmVjdC54TWluICsgYW5jaG9yWCAqIGJ0blJlY3Qud2lkdGg7XHJcbiAgICAgICAgbGV0IG5vZGVZID0gYnRuUmVjdC55TWluICsgYW5jaG9yWSAqIGJ0blJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiYW5uZXJIZWlnaHQgPSBhZC5zdHlsZS5yZWFsSGVpZ2h0O1xyXG4gICAgICAgIGxldCBiYW5uZXJXaWR0aCA9IGFkLnN0eWxlLnJlYWxXaWR0aDtcclxuICAgICAgICBsZXQgeCA9IG5vZGVYIC8gd2luU2l6ZS53aWR0aCAqIGZyYW1lU2l6ZS53aWR0aDtcclxuICAgICAgICBsZXQgeSA9ICh3aW5TaXplLmhlaWdodCAtIG5vZGVZKSAvIHdpblNpemUuaGVpZ2h0ICogZnJhbWVTaXplLmhlaWdodDtcclxuICAgICAgICBsZXQgbGVmdCA9IHggLSBiYW5uZXJXaWR0aCAqIGFuY2hvclg7XHJcbiAgICAgICAgbGV0IHRvcCA9IHkgLSBiYW5uZXJIZWlnaHQgKiAoMSAtIGFuY2hvclkpO1xyXG4gICAgICAgIGFkLnN0eWxlLmxlZnQgPSBsZWZ0O1xyXG4gICAgICAgIGFkLnN0eWxlLnRvcCA9IHRvcDtcclxuICAgIH07XHJcbn0iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/AudioManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b561fB2inFKfb/PGjnIpSV7', 'AudioManager');
// Script/AudioManager.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AutoManager = /** @class */ (function (_super) {
    __extends(AutoManager, _super);
    function AutoManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dropClip = null;
        _this.leveUpClip = null;
        return _this;
    }
    AutoManager.prototype.start = function () {
        var _this = this;
        cc.game.on('game-ball-drop', function () {
            cc.audioEngine.playEffect(_this.dropClip, false);
        });
        cc.game.on('game-ball-levelup', function () {
            cc.audioEngine.playEffect(_this.leveUpClip, false);
            GSdk.vibrateShort();
        });
    };
    __decorate([
        property({ type: cc.AudioClip })
    ], AutoManager.prototype, "dropClip", void 0);
    __decorate([
        property({ type: cc.AudioClip })
    ], AutoManager.prototype, "leveUpClip", void 0);
    AutoManager = __decorate([
        ccclass
    ], AutoManager);
    return AutoManager;
}(cc.Component));
exports.default = AutoManager;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxBdWRpb01hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ00sSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFHNUM7SUFBeUMsK0JBQVk7SUFBckQ7UUFBQSxxRUFpQkM7UUFkRyxjQUFRLEdBQWlCLElBQUksQ0FBQztRQUU5QixnQkFBVSxHQUFpQixJQUFJLENBQUM7O0lBWXBDLENBQUM7SUFYRywyQkFBSyxHQUFMO1FBQUEsaUJBU0M7UUFSRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBWkQ7UUFEQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO2lEQUNIO0lBRTlCO1FBREMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQzttREFDRDtJQUxmLFdBQVc7UUFEL0IsT0FBTztPQUNhLFdBQVcsQ0FpQi9CO0lBQUQsa0JBQUM7Q0FqQkQsQUFpQkMsQ0FqQndDLEVBQUUsQ0FBQyxTQUFTLEdBaUJwRDtrQkFqQm9CLFdBQVciLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvTWFuYWdlciBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG5cbiAgICBAcHJvcGVydHkoeyB0eXBlOiBjYy5BdWRpb0NsaXAgfSlcbiAgICBkcm9wQ2xpcDogY2MuQXVkaW9DbGlwID0gbnVsbDtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBjYy5BdWRpb0NsaXAgfSlcbiAgICBsZXZlVXBDbGlwOiBjYy5BdWRpb0NsaXAgPSBudWxsO1xuICAgIHN0YXJ0KCkge1xuICAgICAgICBjYy5nYW1lLm9uKCdnYW1lLWJhbGwtZHJvcCcsICgpID0+IHtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5kcm9wQ2xpcCwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjYy5nYW1lLm9uKCdnYW1lLWJhbGwtbGV2ZWx1cCcsICgpID0+IHtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5sZXZlVXBDbGlwLCBmYWxzZSk7XG4gICAgICAgICAgICBHU2RrLnZpYnJhdGVTaG9ydCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/AutoRotationSc.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f8cc9TbhXtP8KO4rqgN1AO4', 'AutoRotationSc');
// Script/AutoRotationSc.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AutoRotationSc = /** @class */ (function (_super) {
    __extends(AutoRotationSc, _super);
    function AutoRotationSc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutoRotationSc.prototype.update = function (dt) {
        this.node.angle += dt * 100;
    };
    AutoRotationSc = __decorate([
        ccclass
    ], AutoRotationSc);
    return AutoRotationSc;
}(cc.Component));
exports.default = AutoRotationSc;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxBdXRvUm90YXRpb25TYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDTSxJQUFBLEtBQXNCLEVBQUUsQ0FBQyxVQUFVLEVBQWxDLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBaUIsQ0FBQztBQUcxQztJQUE0QyxrQ0FBWTtJQUF4RDs7SUFJQSxDQUFDO0lBSEcsK0JBQU0sR0FBTixVQUFRLEVBQUU7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ2hDLENBQUM7SUFIZ0IsY0FBYztRQURsQyxPQUFPO09BQ2EsY0FBYyxDQUlsQztJQUFELHFCQUFDO0NBSkQsQUFJQyxDQUoyQyxFQUFFLENBQUMsU0FBUyxHQUl2RDtrQkFKb0IsY0FBYyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5jb25zdCB7Y2NjbGFzcywgcHJvcGVydHl9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9Sb3RhdGlvblNjIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuICAgIHVwZGF0ZSAoZHQpIHtcclxuICAgICAgICB0aGlzLm5vZGUuYW5nbGUgKz0gZHQgKiAxMDA7XHJcbiAgICB9XHJcbn1cclxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Component/InterstitialShow.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'e5918Qyz1tJEIR/2On5NagB', 'InterstitialShow');
// Script/Component/InterstitialShow.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var InterstitialShow = /** @class */ (function (_super) {
    __extends(InterstitialShow, _super);
    function InterstitialShow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InterstitialShow.prototype.onEnable = function () {
        GSdk.interstitial.show();
    };
    InterstitialShow = __decorate([
        ccclass
    ], InterstitialShow);
    return InterstitialShow;
}(cc.Component));
exports.default = InterstitialShow;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxDb21wb25lbnRcXEludGVyc3RpdGlhbFNob3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQU0sSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFFNUM7SUFBOEMsb0NBQVk7SUFBMUQ7O0lBSUEsQ0FBQztJQUhHLG1DQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFIZ0IsZ0JBQWdCO1FBRHBDLE9BQU87T0FDYSxnQkFBZ0IsQ0FJcEM7SUFBRCx1QkFBQztDQUpELEFBSUMsQ0FKNkMsRUFBRSxDQUFDLFNBQVMsR0FJekQ7a0JBSm9CLGdCQUFnQiIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVyc3RpdGlhbFNob3cgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG4gICAgb25FbmFibGUoKSB7XHJcbiAgICAgICAgR1Nkay5pbnRlcnN0aXRpYWwuc2hvdygpO1xyXG4gICAgfVxyXG59Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/BallSc.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '78865+Mpe5EM6BE/wT+qO8t', 'BallSc');
// Script/BallSc.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var GameUI_1 = require("./GameUI");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BallSc = /** @class */ (function (_super) {
    __extends(BallSc, _super);
    function BallSc() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.BallIndex = 1;
        /** 不要用它检查是否结束游戏 */
        _this.isNotCheckOver = false;
        /** 是不是丢出去的,影响声音处理 */
        _this.isDrop = false;
        return _this;
    }
    BallSc_1 = BallSc;
    BallSc.prototype.start = function () {
        this.getComponent(cc.PhysicsCollider).restitution = 0.1;
    };
    BallSc.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.getComponent(BallSc_1)) {
            this.isNotCheckOver = true;
            if (otherCollider.getComponent(BallSc_1).BallIndex == selfCollider.getComponent(BallSc_1).BallIndex) {
                // 看看是不是球
                var target = selfCollider;
                var other = otherCollider;
                if (otherCollider.node.y <= selfCollider.node.y) {
                    target = otherCollider;
                    other = selfCollider;
                }
                if (cc.find('Canvas/GameUI').getComponent(GameUI_1.default).BallLevelUp(target.node, other.node)) {
                    other.node.removeComponent(BallSc_1);
                }
            }
        }
        else if (!this.isDrop) {
            //仅响一次
            this.isDrop = true;
            cc.game.emit('game-ball-drop');
        }
    };
    var BallSc_1;
    __decorate([
        property
    ], BallSc.prototype, "BallIndex", void 0);
    BallSc = BallSc_1 = __decorate([
        ccclass
    ], BallSc);
    return BallSc;
}(cc.Component));
exports.default = BallSc;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxCYWxsU2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsbUNBQThCO0FBRXhCLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBRzVDO0lBQW9DLDBCQUFZO0lBQWhEO1FBQUEscUVBaUNDO1FBOUJHLGVBQVMsR0FBVyxDQUFDLENBQUM7UUFDdEIsbUJBQW1CO1FBQ25CLG9CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLHFCQUFxQjtRQUNyQixZQUFNLEdBQUcsS0FBSyxDQUFDOztJQTBCbkIsQ0FBQztlQWpDb0IsTUFBTTtJQVF2QixzQkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztJQUM1RCxDQUFDO0lBRUQsK0JBQWMsR0FBZCxVQUFlLE9BQU8sRUFBRSxZQUFnQyxFQUFFLGFBQWlDO1FBQ3ZGLElBQUksYUFBYSxDQUFDLFlBQVksQ0FBQyxRQUFNLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztZQUMzQixJQUFJLGFBQWEsQ0FBQyxZQUFZLENBQUMsUUFBTSxDQUFDLENBQUMsU0FBUyxJQUFJLFlBQVksQ0FBQyxZQUFZLENBQUMsUUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFO2dCQUM3RixTQUFTO2dCQUNULElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQztnQkFDMUIsSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDO2dCQUMxQixJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO29CQUM3QyxNQUFNLEdBQUcsYUFBYSxDQUFDO29CQUN2QixLQUFLLEdBQUcsWUFBWSxDQUFDO2lCQUN4QjtnQkFDRCxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsWUFBWSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3BGLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQU0sQ0FBQyxDQUFDO2lCQUN0QzthQUNKO1NBQ0o7YUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNyQixNQUFNO1lBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbkIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNsQztJQUNMLENBQUM7O0lBN0JEO1FBREMsUUFBUTs2Q0FDYTtJQUhMLE1BQU07UUFEMUIsT0FBTztPQUNhLE1BQU0sQ0FpQzFCO0lBQUQsYUFBQztDQWpDRCxBQWlDQyxDQWpDbUMsRUFBRSxDQUFDLFNBQVMsR0FpQy9DO2tCQWpDb0IsTUFBTSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgR2FtZVVJIGZyb20gXCIuL0dhbWVVSVwiO1xyXG5cclxuY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhbGxTYyBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgQHByb3BlcnR5XHJcbiAgICBCYWxsSW5kZXg6IG51bWJlciA9IDE7XHJcbiAgICAvKiog5LiN6KaB55So5a6D5qOA5p+l5piv5ZCm57uT5p2f5ri45oiPICovXHJcbiAgICBpc05vdENoZWNrT3ZlciA9IGZhbHNlO1xyXG4gICAgLyoqIOaYr+S4jeaYr+S4ouWHuuWOu+eahCzlvbHlk43lo7Dpn7PlpITnkIYgKi9cclxuICAgIGlzRHJvcCA9IGZhbHNlO1xyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUGh5c2ljc0NvbGxpZGVyKS5yZXN0aXR1dGlvbiA9IDAuMTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJlZ2luQ29udGFjdChjb250YWN0LCBzZWxmQ29sbGlkZXI6IGNjLlBoeXNpY3NDb2xsaWRlciwgb3RoZXJDb2xsaWRlcjogY2MuUGh5c2ljc0NvbGxpZGVyKSB7XHJcbiAgICAgICAgaWYgKG90aGVyQ29sbGlkZXIuZ2V0Q29tcG9uZW50KEJhbGxTYykpIHtcclxuICAgICAgICAgICAgdGhpcy5pc05vdENoZWNrT3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmIChvdGhlckNvbGxpZGVyLmdldENvbXBvbmVudChCYWxsU2MpLkJhbGxJbmRleCA9PSBzZWxmQ29sbGlkZXIuZ2V0Q29tcG9uZW50KEJhbGxTYykuQmFsbEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAvLyDnnIvnnIvmmK/kuI3mmK/nkINcclxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXQgPSBzZWxmQ29sbGlkZXI7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3RoZXIgPSBvdGhlckNvbGxpZGVyO1xyXG4gICAgICAgICAgICAgICAgaWYgKG90aGVyQ29sbGlkZXIubm9kZS55IDw9IHNlbGZDb2xsaWRlci5ub2RlLnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBvdGhlckNvbGxpZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIG90aGVyID0gc2VsZkNvbGxpZGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNjLmZpbmQoJ0NhbnZhcy9HYW1lVUknKS5nZXRDb21wb25lbnQoR2FtZVVJKS5CYWxsTGV2ZWxVcCh0YXJnZXQubm9kZSwgb3RoZXIubm9kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdGhlci5ub2RlLnJlbW92ZUNvbXBvbmVudChCYWxsU2MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc0Ryb3ApIHtcclxuICAgICAgICAgICAgLy/ku4Xlk43kuIDmrKFcclxuICAgICAgICAgICAgdGhpcy5pc0Ryb3AgPSB0cnVlO1xyXG4gICAgICAgICAgICBjYy5nYW1lLmVtaXQoJ2dhbWUtYmFsbC1kcm9wJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Modules/GCocos.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a83e1s5bz9MW5yx8jIWXrGs', 'GCocos');
// Script/Modules/GCocos.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCocos = void 0;
var GCocos = /** @class */ (function () {
    function GCocos() {
        this.local = {
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
    GCocos.prototype.show = function (name, data) {
        var node = cc.find("Canvas/" + name);
        if (node) {
            node.active = true;
            var js = node.getComponent(name);
            if (js) {
                js['onShow'] && js['onShow'](data);
            }
        }
    };
    GCocos.prototype.hide = function (name, data) {
        var node = cc.find("Canvas/" + name);
        if (node) {
            node.active = false;
            var js = node.getComponent(name);
            if (js) {
                js['onHide'] && js['onHide'](data);
            }
        }
    };
    GCocos.prototype.get = function (name) {
        var node = cc.find("Canvas/" + name);
        if (node) {
            return node.getComponent(name);
        }
    };
    GCocos.prototype.refresh = function (name, data) {
        var node = cc.find("Canvas/" + name);
        if (node) {
            var js = node.getComponent(name);
            if (js) {
                js['onRefresh'] && js['onRefresh'](data);
            }
        }
    };
    return GCocos;
}());
exports.GCocos = GCocos;
window['GCocos'] = new GCocos();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxNb2R1bGVzXFxHQ29jb3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7SUFBQTtRQXFDSSxVQUFLLEdBQUc7WUFDSixNQUFNLEVBQUUsRUFBRTtZQUNWLEdBQUcsWUFBQyxHQUFHLEVBQUUsS0FBSztnQkFDVixJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7b0JBQ3pELElBQUk7d0JBQ0EsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDakMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDdkMsT0FBTzt3QkFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQzt3QkFDeEIsT0FBTyxJQUFJLENBQUM7cUJBQ2Y7b0JBQUMsT0FBTyxHQUFHLEVBQUU7cUJBRWI7aUJBQ0o7cUJBQU07b0JBQ0gsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDckI7Z0JBQ0QsT0FBTyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUNELEdBQUcsWUFBQyxHQUFHO2dCQUNILFFBQVE7Z0JBQ1IsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxFQUFFO29CQUN6QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUN2QztnQkFDRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLElBQUk7b0JBQ0EsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM1QyxJQUFJLElBQUksSUFB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ZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEdDb2NvcyB7XHJcbiAgICBzaG93KG5hbWU6IHN0cmluZywgZGF0YT8pIHtcclxuICAgICAgICB2YXIgbm9kZSA9IGNjLmZpbmQoXCJDYW52YXMvXCIgKyBuYW1lKTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICBub2RlLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciBqcyA9IG5vZGUuZ2V0Q29tcG9uZW50KG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoanMpIHtcclxuICAgICAgICAgICAgICAgIGpzWydvblNob3cnXSAmJiBqc1snb25TaG93J10oZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBoaWRlKG5hbWU6IHN0cmluZywgZGF0YT8pIHtcclxuICAgICAgICB2YXIgbm9kZSA9IGNjLmZpbmQoXCJDYW52YXMvXCIgKyBuYW1lKTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICBub2RlLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIganMgPSBub2RlLmdldENvbXBvbmVudChuYW1lKTtcclxuICAgICAgICAgICAgaWYgKGpzKSB7XHJcbiAgICAgICAgICAgICAgICBqc1snb25IaWRlJ10gJiYganNbJ29uSGlkZSddKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBub2RlID0gY2MuZmluZChcIkNhbnZhcy9cIiArIG5hbWUpO1xyXG4gICAgICAgIGlmIChub2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlLmdldENvbXBvbmVudChuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZWZyZXNoKG5hbWU6IHN0cmluZywgZGF0YT8pIHtcclxuICAgICAgICB2YXIgbm9kZSA9IGNjLmZpbmQoXCJDYW52YXMvXCIgKyBuYW1lKTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICB2YXIganMgPSBub2RlLmdldENvbXBvbmVudChuYW1lKTtcclxuICAgICAgICAgICAgaWYgKGpzKSB7XHJcbiAgICAgICAgICAgICAgICBqc1snb25SZWZyZXNoJ10gJiYganNbJ29uUmVmcmVzaCddKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvY2FsID0ge1xyXG4gICAgICAgIF9jYWNoZToge30sXHJcbiAgICAgICAgc2V0KGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6K6+572u57yT5a2YXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVba2V5XSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYy5lcnJvcignZXJyb3InKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXQoa2V5KSB7XHJcbiAgICAgICAgICAgIC8vIOWFiOivu+WPlue8k+WtmFxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2NhY2hlW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLl9jYWNoZVtrZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7nvJPlrZhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZVtrZXldID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhICE9PSAnJyAmJiBkYXRhICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsZWFyKCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgY2MuanMuY2xlYXIodGhpcy5fY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4vKirmmrTpnLLlhajlsYDmj5DnpLogKi9cclxuZGVjbGFyZSBnbG9iYWwge1xyXG5cclxuICAgIGNvbnN0IEdDb2NvczogR0NvY29zO1xyXG59XHJcbndpbmRvd1snR0NvY29zJ10gPSBuZXcgR0NvY29zKCk7Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/GameUI.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a24e3sZyp9GJoX+eE54dcEO', 'GameUI');
// Script/GameUI.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BallSc_1 = require("./BallSc");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameState;
(function (GameState) {
    GameState[GameState["start"] = 0] = "start";
    GameState[GameState["gaming"] = 1] = "gaming";
    GameState[GameState["over"] = 2] = "over";
})(GameState || (GameState = {}));
var GameUI = /** @class */ (function (_super) {
    __extends(GameUI, _super);
    function GameUI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scoreLabel = null;
        _this.ballsLayer = null;
        _this.waterEffectPrefab = null;
        _this.ballsPrefab = [];
        _this.deadLine = null;
        _this.randomArray = [0, 0, 0, 0, 1, 1, 2, 3];
        _this.currentBall = null;
        _this.currentBallIndex = 0;
        _this._gameState = GameState.gaming;
        _this._winner = false;
        _this._score = 0;
        _this.ballColors = [
            new cc.Color().fromHEX("#862274"),
            new cc.Color().fromHEX("#ff0925"),
            new cc.Color().fromHEX("#ff8e1c"),
            new cc.Color().fromHEX("#ffe614"),
            new cc.Color().fromHEX("#6de42e"),
            new cc.Color().fromHEX("#e61933"),
            new cc.Color().fromHEX("#fab36d"),
            new cc.Color().fromHEX("#ffe350"),
            new cc.Color().fromHEX("#fffaea"),
            new cc.Color().fromHEX("#fc7b97"),
            new cc.Color().fromHEX("#52d135")
        ];
        return _this;
    }
    Object.defineProperty(GameUI.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (v) {
            this._score = v;
            this.scoreLabel.string = v.toFixed(0);
            if (this._score > GData.get('maxScore')) {
                GData.set('maxScore', this._score);
                GSdk.sub.uploadScore(this._score);
            }
        },
        enumerable: false,
        configurable: true
    });
    GameUI.prototype.onLoad = function () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -1280);
        GData.init();
        GSdk.init();
    };
    GameUI.prototype.start = function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.CreateNewBall();
        //死亡线在球接近的时候闪烁
        this.deadLine.active = false;
        cc.tween(this.deadLine).repeatForever(cc.tween(this.deadLine)
            .to(0.3, { opacity: 0 })
            .to(0.3, { opacity: 255 })).start();
    };
    /** 松开弹射 */
    GameUI.prototype.onTouchEnd = function (e) {
        var _this = this;
        if (this._gameState !== GameState.gaming) {
            return;
        }
        if (!this.currentBall) {
            return;
        }
        var ball = this.currentBall;
        ball.addComponent(BallSc_1.default).BallIndex = this.currentBallIndex;
        this.currentBall = null;
        var x = this.ballsLayer.convertToNodeSpaceAR(e.getLocation()).x;
        if (x > 720 / 2 - ball.width / 2) {
            x = 720 / 2 - ball.width / 2;
        }
        else if (x < -720 / 2 + ball.width / 2) {
            x = -720 / 2 + ball.width / 2;
        }
        var speed = 1 / 1000;
        cc.tween(ball)
            .to(Math.abs(speed * x), { x: x })
            .call(function () {
            ball.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
            ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -300);
            _this.CreateNewBall();
        })
            .start();
    };
    GameUI.prototype.onTouchMove = function (e) {
        if (this._gameState == GameState.gaming) {
            if (this.currentBall) {
                var x = this.ballsLayer.convertToNodeSpaceAR(e.getLocation()).x;
                if (x > 720 / 2 - this.currentBall.width / 2) {
                    x = 720 / 2 - this.currentBall.width / 2;
                }
                else if (x < -720 / 2 + this.currentBall.width / 2) {
                    x = -720 / 2 + this.currentBall.width / 2;
                }
                this.currentBall.x = x;
            }
        }
    };
    /** 创建一个新的球在等待射击的位置上 */
    GameUI.prototype.CreateNewBall = function () {
        var _this = this;
        // 如果之前的球存在则销毁它
        if (this.currentBall) {
            this.currentBall.destroy();
        }
        var randomIndex = this.randomArray[Math.floor(Math.random() * this.randomArray.length)];
        var ball = cc.instantiate(this.ballsPrefab[randomIndex]);
        this.currentBallIndex = ball.getComponent(BallSc_1.default).BallIndex;
        ball.removeComponent(BallSc_1.default);
        ball.y = 566;
        ball.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        //this.currentBall
        ball.scale = 0;
        cc.tween(ball)
            .delay(0.2)
            .call(function () {
            _this.ballsLayer.addChild(ball);
        })
            .to(0.2, { scale: 1 })
            .call(function () {
            _this.currentBall = ball;
        }).start();
    };
    GameUI.prototype.BallLevelUp = function (target, other) {
        var _this = this;
        var index = target.getComponent(BallSc_1.default).BallIndex + 1;
        if (index <= this.ballsPrefab.length) {
            cc.game.emit('game-ball-levelup');
            other.getComponent(cc.PhysicsCollider).enabled = false;
            cc.tween(other).to(0.15, { x: target.x, y: target.y }).removeSelf()
                .call(function () {
                var newBall = cc.instantiate(_this.ballsPrefab[index - 1]);
                newBall.position = target.position;
                _this.ballsLayer.addChild(newBall);
                target.removeFromParent(true);
                var eff = cc.instantiate(_this.waterEffectPrefab);
                eff.x = newBall.x;
                eff.y = newBall.y;
                eff.color = _this.ballColors[index - 1];
                _this.ballsLayer.addChild(eff);
                if (index == _this.ballsPrefab.length && _this._winner == false) {
                    _this._winner = true;
                    cc.find('Canvas/WinUI').active = true;
                }
            })
                .start();
            this.score += target.getComponent(BallSc_1.default).BallIndex;
            // 对随机范围作扩充
            if (this.randomArray.findIndex(function (value) {
                return value == index - 1;
            }) < 0) {
                this.randomArray = this.randomArray.concat(JSON.parse(JSON.stringify(this.randomArray))).sort(function (a, b) { return a - b; });
                //console.log(this.randomArray);
                this.randomArray.push(index - 1);
            }
            return true;
        }
        else {
            return false;
        }
    };
    GameUI.prototype.update = function (dt) {
        if (this._gameState == GameState.gaming) {
            var arr = this.ballsLayer.getComponentsInChildren(BallSc_1.default);
            var warning = false;
            var over = false;
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var ball = arr_1[_i];
                if (!ball.isNotCheckOver)
                    continue;
                if (ball.node.y >= this.deadLine.y - ball.node.height / 2) {
                    warning = true;
                }
                if (ball.node.y >= this.deadLine.y) {
                    over = true;
                    break;
                }
            }
            this.deadLine.active = warning;
            if (over) {
                this._gameState = GameState.over;
                console.log("Game Over");
                cc.find('Canvas/OverUI').active = true;
            }
        }
    };
    GameUI.prototype.replay = function () {
        var _this = this;
        cc.find('Canvas/OverUI').active = false;
        this._gameState = GameState.start;
        var arr = this.ballsLayer.getComponentsInChildren(BallSc_1.default);
        var _loop_1 = function (i) {
            cc.tween(arr[i].node).delay(0.1 * i).call(function () {
                var eff = cc.instantiate(_this.waterEffectPrefab);
                eff.x = arr[i].node.x;
                eff.y = arr[i].node.y;
                eff.color = _this.ballColors[arr[i].BallIndex - 1];
                _this.ballsLayer.addChild(eff);
            }).removeSelf().start();
        };
        for (var i = arr.length - 1; i >= 0; i--) {
            _loop_1(i);
        }
        cc.tween(this).delay(arr.length * 0.1)
            .call(function () {
            _this._gameState = GameState.gaming;
            /** 恢复到原始状态 */
            _this.randomArray = [0, 0, 0, 0, 1, 1, 2, 3];
            _this.CreateNewBall();
        }).start();
        this.score = 0;
        this._winner = false;
    };
    GameUI.prototype.closeWin = function () {
        cc.find('Canvas/WinUI').active = false;
        GSdk.interstitial.show();
    };
    GameUI.prototype.onBtn = function (evt, str) {
        switch (str) {
            case 'openRank':
                GCocos.show('rankUI');
                break;
            case 'closeRank':
                GCocos.hide('rankUI');
                break;
            default:
                break;
        }
    };
    __decorate([
        property(cc.Label)
    ], GameUI.prototype, "scoreLabel", void 0);
    __decorate([
        property(cc.Node)
    ], GameUI.prototype, "ballsLayer", void 0);
    __decorate([
        property(cc.Prefab)
    ], GameUI.prototype, "waterEffectPrefab", void 0);
    __decorate([
        property([cc.Prefab])
    ], GameUI.prototype, "ballsPrefab", void 0);
    __decorate([
        property(cc.Node)
    ], GameUI.prototype, "deadLine", void 0);
    GameUI = __decorate([
        ccclass
    ], GameUI);
    return GameUI;
}(cc.Component));
exports.default = GameUI;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxHYW1lVUkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThCO0FBRXhCLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBRTVDLElBQUssU0FFSjtBQUZELFdBQUssU0FBUztJQUNWLDJDQUFLLENBQUE7SUFBRSw2Q0FBTSxDQUFBO0lBQUUseUNBQUksQ0FBQTtBQUN2QixDQUFDLEVBRkksU0FBUyxLQUFULFNBQVMsUUFFYjtBQUVEO0lBQW9DLDBCQUFZO0lBQWhEO1FBQUEscUVBcVBDO1FBbFBHLGdCQUFVLEdBQWEsSUFBSSxDQUFDO1FBRTVCLGdCQUFVLEdBQVksSUFBSSxDQUFDO1FBRTNCLHVCQUFpQixHQUFjLElBQUksQ0FBQztRQUVwQyxpQkFBVyxHQUFnQixFQUFFLENBQUM7UUFFOUIsY0FBUSxHQUFZLElBQUksQ0FBQztRQUVqQixpQkFBVyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLGlCQUFXLEdBQVksSUFBSSxDQUFDO1FBQzVCLHNCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixnQkFBVSxHQUFjLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDekMsYUFBTyxHQUFHLEtBQUssQ0FBQztRQUVoQixZQUFNLEdBQVcsQ0FBQyxDQUFDO1FBK0luQixnQkFBVSxHQUFlO1lBQzdCLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDakMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNqQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFP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TztPQUNhLE1BQU0sQ0FxUDFCO0lBQUQsYUFBQztDQXJQRCxBQXFQQyxDQXJQbUMsRUFBRSxDQUFDLFNBQVMsR0FxUC9DO2tCQXJQb0IsTUFBTSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYWxsU2MgZnJvbSBcIi4vQmFsbFNjXCI7XHJcblxyXG5jb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuZW51bSBHYW1lU3RhdGUge1xyXG4gICAgc3RhcnQsIGdhbWluZywgb3ZlclxyXG59XHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVVSSBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgQHByb3BlcnR5KGNjLkxhYmVsKVxyXG4gICAgc2NvcmVMYWJlbDogY2MuTGFiZWwgPSBudWxsO1xyXG4gICAgQHByb3BlcnR5KGNjLk5vZGUpXHJcbiAgICBiYWxsc0xheWVyOiBjYy5Ob2RlID0gbnVsbDtcclxuICAgIEBwcm9wZXJ0eShjYy5QcmVmYWIpXHJcbiAgICB3YXRlckVmZmVjdFByZWZhYjogY2MuUHJlZmFiID0gbnVsbDtcclxuICAgIEBwcm9wZXJ0eShbY2MuUHJlZmFiXSlcclxuICAgIGJhbGxzUHJlZmFiOiBjYy5QcmVmYWJbXSA9IFtdO1xyXG4gICAgQHByb3BlcnR5KGNjLk5vZGUpXHJcbiAgICBkZWFkTGluZTogY2MuTm9kZSA9IG51bGw7XHJcblxyXG4gICAgcHJpdmF0ZSByYW5kb21BcnJheSA9IFswLCAwLCAwLCAwLCAxLCAxLCAyLCAzXTtcclxuICAgIHByaXZhdGUgY3VycmVudEJhbGw6IGNjLk5vZGUgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50QmFsbEluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfZ2FtZVN0YXRlOiBHYW1lU3RhdGUgPSBHYW1lU3RhdGUuZ2FtaW5nO1xyXG4gICAgcHJpdmF0ZSBfd2lubmVyID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2NvcmU6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgZ2V0IHNjb3JlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njb3JlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgc2NvcmUodjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fc2NvcmUgPSB2O1xyXG4gICAgICAgIHRoaXMuc2NvcmVMYWJlbC5zdHJpbmcgPSB2LnRvRml4ZWQoMCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Njb3JlID4gR0RhdGEuZ2V0KCdtYXhTY29yZScpKSB7XHJcbiAgICAgICAgICAgIEdEYXRhLnNldCgnbWF4U2NvcmUnLCB0aGlzLl9zY29yZSk7XHJcbiAgICAgICAgICAgIEdTZGsuc3ViLnVwbG9hZFNjb3JlKHRoaXMuX3Njb3JlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFBoeXNpY3NNYW5hZ2VyKCkuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5ncmF2aXR5ID0gY2MudjIoMCwgLTEyODApO1xyXG5cclxuICAgICAgICBHRGF0YS5pbml0KCk7XHJcbiAgICAgICAgR1Nkay5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hNb3ZlLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uVG91Y2hFbmQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLm9uVG91Y2hNb3ZlLCB0aGlzKTtcclxuICAgICAgICB0aGlzLkNyZWF0ZU5ld0JhbGwoKTtcclxuICAgICAgICAvL+atu+S6oee6v+WcqOeQg+aOpei/keeahOaXtuWAmemXqueDgVxyXG4gICAgICAgIHRoaXMuZGVhZExpbmUuYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGNjLnR3ZWVuKHRoaXMuZGVhZExpbmUpLnJlcGVhdEZvcmV2ZXIoXHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKHRoaXMuZGVhZExpbmUpXHJcbiAgICAgICAgICAgICAgICAudG8oMC4zLCB7IG9wYWNpdHk6IDAgfSlcclxuICAgICAgICAgICAgICAgIC50bygwLjMsIHsgb3BhY2l0eTogMjU1IH0pXHJcbiAgICAgICAgKS5zdGFydCgpO1xyXG4gICAgfVxyXG4gICAgLyoqIOadvuW8gOW8ueWwhCAqL1xyXG4gICAgcHJpdmF0ZSBvblRvdWNoRW5kKGU6IGNjLkV2ZW50LkV2ZW50VG91Y2gpIHtcclxuICAgICAgICBpZiAodGhpcy5fZ2FtZVN0YXRlICE9PSBHYW1lU3RhdGUuZ2FtaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRCYWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGJhbGwgPSB0aGlzLmN1cnJlbnRCYWxsO1xyXG4gICAgICAgIGJhbGwuYWRkQ29tcG9uZW50KEJhbGxTYykuQmFsbEluZGV4ID0gdGhpcy5jdXJyZW50QmFsbEluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJhbGwgPSBudWxsO1xyXG4gICAgICAgIGxldCB4ID0gdGhpcy5iYWxsc0xheWVyLmNvbnZlcnRUb05vZGVTcGFjZUFSKGUuZ2V0TG9jYXRpb24oKSkueDtcclxuXHJcbiAgICAgICAgaWYgKHggPiA3MjAgLyAyIC0gYmFsbC53aWR0aCAvIDIpIHtcclxuICAgICAgICAgICAgeCA9IDcyMCAvIDIgLSBiYWxsLndpZHRoIC8gMjtcclxuICAgICAgICB9IGVsc2UgaWYgKHggPCAtNzIwIC8gMiArIGJhbGwud2lkdGggLyAyKSB7XHJcbiAgICAgICAgICAgIHggPSAtNzIwIC8gMiArIGJhbGwud2lkdGggLyAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwZWVkID0gMSAvIDEwMDA7XHJcbiAgICAgICAgY2MudHdlZW4oYmFsbClcclxuICAgICAgICAgICAgLnRvKE1hdGguYWJzKHNwZWVkICogeCksIHsgeCB9KVxyXG4gICAgICAgICAgICAuY2FsbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBiYWxsLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLnR5cGUgPSBjYy5SaWdpZEJvZHlUeXBlLkR5bmFtaWM7XHJcbiAgICAgICAgICAgICAgICBiYWxsLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLmxpbmVhclZlbG9jaXR5ID0gY2MudjIoMCwgLTMwMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNyZWF0ZU5ld0JhbGwoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblRvdWNoTW92ZShlOiBjYy5FdmVudC5FdmVudFRvdWNoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2dhbWVTdGF0ZSA9PSBHYW1lU3RhdGUuZ2FtaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRCYWxsKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgeCA9IHRoaXMuYmFsbHNMYXllci5jb252ZXJ0VG9Ob2RlU3BhY2VBUihlLmdldExvY2F0aW9uKCkpLng7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+IDcyMCAvIDIgLSB0aGlzLmN1cnJlbnRCYWxsLndpZHRoIC8gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHggPSA3MjAgLyAyIC0gdGhpcy5jdXJyZW50QmFsbC53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHggPCAtNzIwIC8gMiArIHRoaXMuY3VycmVudEJhbGwud2lkdGggLyAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IC03MjAgLyAyICsgdGhpcy5jdXJyZW50QmFsbC53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCYWxsLnggPSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqIOWIm+W7uuS4gOS4quaWsOeahOeQg+WcqOetieW+heWwhOWHu+eahOS9jee9ruS4iiAqL1xyXG4gICAgcHJpdmF0ZSBDcmVhdGVOZXdCYWxsKCkge1xyXG4gICAgICAgIC8vIOWmguaenOS5i+WJjeeahOeQg+WtmOWcqOWImemUgOavgeWug1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRCYWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJhbGwuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IHRoaXMucmFuZG9tQXJyYXlbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5yYW5kb21BcnJheS5sZW5ndGgpXTtcclxuICAgICAgICBjb25zdCBiYWxsID0gY2MuaW5zdGFudGlhdGUodGhpcy5iYWxsc1ByZWZhYltyYW5kb21JbmRleF0pO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJhbGxJbmRleCA9IGJhbGwuZ2V0Q29tcG9uZW50KEJhbGxTYykuQmFsbEluZGV4O1xyXG4gICAgICAgIGJhbGwucmVtb3ZlQ29tcG9uZW50KEJhbGxTYyk7XHJcbiAgICAgICAgYmFsbC55ID0gNTY2O1xyXG4gICAgICAgIGJhbGwuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkudHlwZSA9IGNjLlJpZ2lkQm9keVR5cGUuU3RhdGljO1xyXG4gICAgICAgIC8vdGhpcy5jdXJyZW50QmFsbFxyXG4gICAgICAgIGJhbGwuc2NhbGUgPSAwO1xyXG4gICAgICAgIGNjLnR3ZWVuKGJhbGwpXHJcbiAgICAgICAgICAgIC5kZWxheSgwLjIpXHJcbiAgICAgICAgICAgIC5jYWxsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmFsbHNMYXllci5hZGRDaGlsZChiYWxsKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRvKDAuMiwgeyBzY2FsZTogMSB9KVxyXG4gICAgICAgICAgICAuY2FsbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCYWxsID0gYmFsbDtcclxuICAgICAgICAgICAgfSkuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgQmFsbExldmVsVXAodGFyZ2V0OiBjYy5Ob2RlLCBvdGhlcjogY2MuTm9kZSkge1xyXG4gICAgICAgIGxldCBpbmRleCA9IHRhcmdldC5nZXRDb21wb25lbnQoQmFsbFNjKS5CYWxsSW5kZXggKyAxO1xyXG4gICAgICAgIGlmIChpbmRleCA8PSB0aGlzLmJhbGxzUHJlZmFiLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjYy5nYW1lLmVtaXQoJ2dhbWUtYmFsbC1sZXZlbHVwJyk7XHJcblxyXG4gICAgICAgICAgICBvdGhlci5nZXRDb21wb25lbnQoY2MuUGh5c2ljc0NvbGxpZGVyKS5lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKG90aGVyKS50bygwLjE1LCB7IHg6IHRhcmdldC54LCB5OiB0YXJnZXQueSB9KS5yZW1vdmVTZWxmKClcclxuICAgICAgICAgICAgICAgIC5jYWxsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdCYWxsID0gY2MuaW5zdGFudGlhdGUodGhpcy5iYWxsc1ByZWZhYltpbmRleCAtIDFdKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdCYWxsLnBvc2l0aW9uID0gdGFyZ2V0LnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFsbHNMYXllci5hZGRDaGlsZChuZXdCYWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlRnJvbVBhcmVudCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlZmYgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLndhdGVyRWZmZWN0UHJlZmFiKTtcclxuICAgICAgICAgICAgICAgICAgICBlZmYueCA9IG5ld0JhbGwueDtcclxuICAgICAgICAgICAgICAgICAgICBlZmYueSA9IG5ld0JhbGwueTtcclxuICAgICAgICAgICAgICAgICAgICBlZmYuY29sb3IgPSB0aGlzLmJhbGxDb2xvcnNbaW5kZXggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxzTGF5ZXIuYWRkQ2hpbGQoZWZmKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gdGhpcy5iYWxsc1ByZWZhYi5sZW5ndGggJiYgdGhpcy5fd2lubmVyID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dpbm5lciA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5maW5kKCdDYW52YXMvV2luVUknKS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuc3RhcnQoKTtcclxuICAgICAgICAgICAgdGhpcy5zY29yZSArPSB0YXJnZXQuZ2V0Q29tcG9uZW50KEJhbGxTYykuQmFsbEluZGV4O1xyXG4gICAgICAgICAgICAvLyDlr7npmo/mnLrojIPlm7TkvZzmianlhYVcclxuICAgICAgICAgICAgaWYgKHRoaXMucmFuZG9tQXJyYXkuZmluZEluZGV4KCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09IGluZGV4IC0gMTtcclxuICAgICAgICAgICAgfSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmRvbUFycmF5ID0gdGhpcy5yYW5kb21BcnJheS5jb25jYXQoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLnJhbmRvbUFycmF5KSkpLnNvcnQoKGEsIGIpID0+IHsgcmV0dXJuIGEgLSBiOyB9KTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codGhpcy5yYW5kb21BcnJheSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmRvbUFycmF5LnB1c2goaW5kZXggLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmFsbENvbG9yczogY2MuQ29sb3JbXSA9IFtcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiIzg2MjI3NFwiKSxcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiI2ZmMDkyNVwiKSxcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiI2ZmOGUxY1wiKSxcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiI2ZmZTYxNFwiKSxcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiIzZkZTQyZVwiKSxcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiI2U2MTkzM1wiKSxcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiI2ZhYjM2ZFwiKSxcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiI2ZmZTM1MFwiKSxcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiI2ZmZmFlYVwiKSxcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiI2ZjN2I5N1wiKSxcclxuICAgICAgICBuZXcgY2MuQ29sb3IoKS5mcm9tSEVYKFwiIzUyZDEzNVwiKVxyXG4gICAgXTtcclxuXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICBpZiAodGhpcy5fZ2FtZVN0YXRlID09IEdhbWVTdGF0ZS5nYW1pbmcpIHtcclxuICAgICAgICAgICAgY29uc3QgYXJyID0gdGhpcy5iYWxsc0xheWVyLmdldENvbXBvbmVudHNJbkNoaWxkcmVuKEJhbGxTYyk7XHJcbiAgICAgICAgICAgIGxldCB3YXJuaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBvdmVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGJhbGwgb2YgYXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJhbGwuaXNOb3RDaGVja092ZXIpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJhbGwubm9kZS55ID49IHRoaXMuZGVhZExpbmUueSAtIGJhbGwubm9kZS5oZWlnaHQgLyAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2FybmluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoYmFsbC5ub2RlLnkgPj0gdGhpcy5kZWFkTGluZS55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kZWFkTGluZS5hY3RpdmUgPSB3YXJuaW5nO1xyXG4gICAgICAgICAgICBpZiAob3Zlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVN0YXRlID0gR2FtZVN0YXRlLm92ZXI7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdhbWUgT3ZlclwiKTtcclxuICAgICAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcy9PdmVyVUknKS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlcGxheSgpIHtcclxuICAgICAgICBjYy5maW5kKCdDYW52YXMvT3ZlclVJJykuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZ2FtZVN0YXRlID0gR2FtZVN0YXRlLnN0YXJ0O1xyXG4gICAgICAgIGNvbnN0IGFyciA9IHRoaXMuYmFsbHNMYXllci5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihCYWxsU2MpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBhcnIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgY2MudHdlZW4oYXJyW2ldLm5vZGUpLmRlbGF5KDAuMSAqIGkpLmNhbGwoXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWZmID0gY2MuaW5zdGFudGlhdGUodGhpcy53YXRlckVmZmVjdFByZWZhYik7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmLnggPSBhcnJbaV0ubm9kZS54O1xyXG4gICAgICAgICAgICAgICAgICAgIGVmZi55ID0gYXJyW2ldLm5vZGUueTtcclxuICAgICAgICAgICAgICAgICAgICBlZmYuY29sb3IgPSB0aGlzLmJhbGxDb2xvcnNbYXJyW2ldLkJhbGxJbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFsbHNMYXllci5hZGRDaGlsZChlZmYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApLnJlbW92ZVNlbGYoKS5zdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYy50d2Vlbih0aGlzKS5kZWxheShhcnIubGVuZ3RoICogMC4xKVxyXG4gICAgICAgICAgICAuY2FsbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nYW1lU3RhdGUgPSBHYW1lU3RhdGUuZ2FtaW5nO1xyXG4gICAgICAgICAgICAgICAgLyoqIOaBouWkjeWIsOWOn+Wni+eKtuaAgSAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5kb21BcnJheSA9IFswLCAwLCAwLCAwLCAxLCAxLCAyLCAzXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ3JlYXRlTmV3QmFsbCgpO1xyXG4gICAgICAgICAgICB9KS5zdGFydCgpO1xyXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xyXG4gICAgICAgIHRoaXMuX3dpbm5lciA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlV2luKCkge1xyXG4gICAgICAgIGNjLmZpbmQoJ0NhbnZhcy9XaW5VSScpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIEdTZGsuaW50ZXJzdGl0aWFsLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJ0bihldnQsIHN0cikge1xyXG4gICAgICAgIHN3aXRjaCAoc3RyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ29wZW5SYW5rJzpcclxuICAgICAgICAgICAgICAgIEdDb2Nvcy5zaG93KCdyYW5rVUknKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdjbG9zZVJhbmsnOlxyXG4gICAgICAgICAgICAgICAgR0NvY29zLmhpZGUoJ3JhbmtVSScpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Modules/GData.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f1e10kHfXREDYqp8u6woTSw', 'GData');
// Script/Modules/GData.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GData = void 0;
var userKey = 'userData';
/**
 * 玩家数据中心，玩家数据的获取，设置，改变及其他相关逻辑
 */
var GData = /** @class */ (function () {
    function GData() {
        this._allData = {
            maxScore: 0,
            money: 0,
        };
        this._isNew = false;
    }
    /**获取玩家的数据
         * @param key 要获取的属性
         * @example
         * GData.get("Money");
         */
    GData.prototype.get = function (key) {
        return this._allData[key];
    };
    /**设置玩家的数据
     * @param key 要设置的属性
     * @param value 要设置的值
     * @example
     * GData.set("Money", 100);
     */
    GData.prototype.set = function (key, value) {
        this._allData[key] = value;
        //可以添加其他逻辑，如：发射事件出去，改变ui表现，实现数据和表现的绑定
        //将当前玩家变化的属性字段，作为事件名（如"Money"）发送出去
        //GEvent.emit(key);
    };
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
    GData.prototype.change = function (key, changes, canNegative) {
        if (canNegative === void 0) { canNegative = false; }
        var oldData = this.get(key);
        //数据类型检查
        if (typeof oldData == 'number') {
            var newData = oldData + changes;
            //数据范围检查
            if (canNegative || newData >= 0) {
                this.set(key, newData);
            }
            else {
                console.error('数值变化后为不合法的负数，此次改变不生效!');
            }
        }
        else {
            console.error('要改变值不是数字类型!');
        }
        return this.get(key);
    };
    /**重置这个单例，数据还原 */
    GData.prototype.reset = function () {
        window[this['__proto__'].constructor.name] = new this['__proto__'].constructor();
    };
    //从本地获取
    GData.prototype.init = function () {
        var localData = GCocos.local.get(userKey);
        if (localData) {
            for (var i in localData) {
                this._allData[i] = localData[i];
            }
        }
        else {
            this._isNew = true;
        }
        //hide的时候保存一下数据
        cc.game.on(cc.game.EVENT_HIDE, this.saveLocal, this);
    };
    //保存到本地
    GData.prototype.saveLocal = function () {
        GCocos.local.set(userKey, this._allData);
    };
    return GData;
}());
exports.GData = GData;
window['GData'] = new GData();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxNb2R1bGVzXFxHRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLE9BQU8sR0FBRyxVQUFVLENBQUM7QUFLM0I7O0dBRUc7QUFDSDtJQUFBO1FBQ1ksYUFBUSxHQUFHO1lBQ2YsUUFBUSxFQUFFLENBQUM7WUFDWCxLQUFLLEVBQUUsQ0FBQztTQUNYLENBQUM7UUFDRixXQUFNLEdBQVksS0FBSyxDQUFDO0lBd0U1QixDQUFDO0lBdkVHOzs7O1dBSU87SUFDUCxtQkFBRyxHQUFILFVBQXVDLEdBQU07UUFDekMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILG1CQUFHLEdBQUgsVUFBdUMsR0FBTSxFQUFFLEtBQTJCO1FBQ3RFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzNCLHFDQUFxQztRQUNyQyxrQ0FBa0M7UUFDbEMsbUJBQW1CO0lBQ3ZCLENBQUM7SUFDRDs7Ozs7Ozs7O09BU0c7SUFFSCxzQkFBTSxHQUFOLFVBQU8sR0FBc0MsRUFBRSxPQUFlLEVBQUUsV0FBbUI7UUFBbkIsNEJBQUEsRUFBQSxtQkFBbUI7UUFDL0UsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixRQUFRO1FBQ1IsSUFBSSxPQUFPLE9BQU8sSUFBSSxRQUFRLEVBQUU7WUFDNUIsSUFBSSxPQUFPLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUNoQyxRQUFRO1lBQ1IsSUFBSSxXQUFXLElBQUksT0FBTyxJQUFJLENBQUMsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDMUI7aUJBQU07Z0JBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2FBQzFDO1NBQ0o7YUFBTTtZQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDaEM7UUFDRCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELGlCQUFpQjtJQUNqQixxQkFBSyxHQUFMO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckYsQ0FBQztJQUVELE9BQU87SUFDUCxvQkFBSSxHQUFKO1FBQ0ksSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsSUFBSSxTQUFTLEVBQUU7WUFDWCxLQUFLLElBQUksQ0FBQyxJQUFJLFNBQVMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkM7U0FDSjthQUFNO1lBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDdEI7UUFDRCxlQUFlO1FBQ2YsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQ0QsT0FBTztJQUNQLHlCQUFTLEdBQVQ7UUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0E3RUEsQUE2RUMsSUFBQTtBQTdFWSxzQkFBSztBQXFGbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB1c2VyS2V5ID0gJ3VzZXJEYXRhJztcclxuLy/mlbDmja7ov4fmu6Tnm7jlhbPmjqXlj6NcclxudHlwZSBQaWNrQnk8QmFzZSwgVGFyZ2V0VHlwZT4gPSB7XHJcbiAgICBbS2V5IGluIGtleW9mIEJhc2VdOiBCYXNlW0tleV0gZXh0ZW5kcyBUYXJnZXRUeXBlID8gS2V5IDogbmV2ZXI7XHJcbn1ba2V5b2YgQmFzZV07XHJcbi8qKlxyXG4gKiDnjqnlrrbmlbDmja7kuK3lv4PvvIznjqnlrrbmlbDmja7nmoTojrflj5bvvIzorr7nva7vvIzmlLnlj5jlj4rlhbbku5bnm7jlhbPpgLvovpFcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHRGF0YSB7XHJcbiAgICBwcml2YXRlIF9hbGxEYXRhID0ge1xyXG4gICAgICAgIG1heFNjb3JlOiAwLCAgICAvL+acgOmrmOWIhlxyXG4gICAgICAgIG1vbmV5OiAwLFxyXG4gICAgfTtcclxuICAgIF9pc05ldzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoq6I635Y+W546p5a6255qE5pWw5o2uXHJcbiAgICAgICAgICogQHBhcmFtIGtleSDopoHojrflj5bnmoTlsZ7mgKdcclxuICAgICAgICAgKiBAZXhhbXBsZVxyXG4gICAgICAgICAqIEdEYXRhLmdldChcIk1vbmV5XCIpO1xyXG4gICAgICAgICAqL1xyXG4gICAgZ2V0PFQgZXh0ZW5kcyBrZXlvZiBHRGF0YVsnX2FsbERhdGEnXT4oa2V5OiBUKTogR0RhdGFbJ19hbGxEYXRhJ11bVF0ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hbGxEYXRhW2tleV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6K6+572u546p5a6255qE5pWw5o2uXHJcbiAgICAgKiBAcGFyYW0ga2V5IOimgeiuvue9rueahOWxnuaAp1xyXG4gICAgICogQHBhcmFtIHZhbHVlIOimgeiuvue9rueahOWAvFxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIEdEYXRhLnNldChcIk1vbmV5XCIsIDEwMCk7XHJcbiAgICAgKi9cclxuICAgIHNldDxUIGV4dGVuZHMga2V5b2YgR0RhdGFbJ19hbGxEYXRhJ10+KGtleTogVCwgdmFsdWU6IEdEYXRhWydfYWxsRGF0YSddW1RdKSB7XHJcbiAgICAgICAgdGhpcy5fYWxsRGF0YVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgLy/lj6/ku6Xmt7vliqDlhbbku5bpgLvovpHvvIzlpoLvvJrlj5HlsITkuovku7blh7rljrvvvIzmlLnlj5h1aeihqOeOsO+8jOWunueOsOaVsOaNruWSjOihqOeOsOeahOe7keWumlxyXG4gICAgICAgIC8v5bCG5b2T5YmN546p5a625Y+Y5YyW55qE5bGe5oCn5a2X5q6177yM5L2c5Li65LqL5Lu25ZCN77yI5aaCXCJNb25leVwi77yJ5Y+R6YCB5Ye65Y67XHJcbiAgICAgICAgLy9HRXZlbnQuZW1pdChrZXkpO1xyXG4gICAgfVxyXG4gICAgLyoq5pS55Y+Y546p5a625pWw5YC857G75Z6L55qE5pWw5o2u77yM6L+U5Zue5b2T5YmN55qE5pWw5YC8XHJcbiAgICAgKiBAcGFyYW0ga2V5IOimgeaUueWPmOeahOWxnuaAp1xyXG4gICAgICogQHBhcmFtIGNoYW5nZXMg5Y+Y5YyW5YC8ICA+MOihqOekuuWinuWKoCAgPDDooajnpLrlh4/lsI9cclxuICAgICAqIEBwYXJhbSBjYW5OZWdhdGl2ZSDmlLnlj5jlkI7nmoTlgLzmmK/lkKbog73kuLrotJ/mlbDvvIzlj6/pgInvvIzpu5jorqTkuI3og73kuLrotJ/mlbBcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiAvL+mAmueUqO+8mlxyXG4gICAgICogR0RhdGEuY2hhbmdlKFwiTW9uZXlcIiwgLTEwMCk7IC8vIOaUueWPmOWQjueahOWAvOWmguaenOS4uui0n+aVsOWImeS8muaKpemUme+8jOW5tuS4lOaUueWPmOS4jeeUn+aViFxyXG4gICAgICogLy/nibnmrorvvJpcclxuICAgICAqIEdEYXRhLmNoYW5nZShcIk1vbmV5XCIsIC0xMDAsIHRydWUpOyAvLyDmlLnlj5jlkI7nmoTlgLzlj6/ku6XkuLrotJ/mlbDkuobvvIzmlLnlj5jnm7TmjqXnlJ/mlYhcclxuICAgICAqL1xyXG5cclxuICAgIGNoYW5nZShrZXk6IFBpY2tCeTxHRGF0YVsnX2FsbERhdGEnXSwgbnVtYmVyPiwgY2hhbmdlczogbnVtYmVyLCBjYW5OZWdhdGl2ZSA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IG9sZERhdGEgPSB0aGlzLmdldChrZXkpO1xyXG4gICAgICAgIC8v5pWw5o2u57G75Z6L5qOA5p+lXHJcbiAgICAgICAgaWYgKHR5cGVvZiBvbGREYXRhID09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdEYXRhID0gb2xkRGF0YSArIGNoYW5nZXM7XHJcbiAgICAgICAgICAgIC8v5pWw5o2u6IyD5Zu05qOA5p+lXHJcbiAgICAgICAgICAgIGlmIChjYW5OZWdhdGl2ZSB8fCBuZXdEYXRhID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgbmV3RGF0YSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCfmlbDlgLzlj5jljJblkI7kuLrkuI3lkIjms5XnmoTotJ/mlbDvvIzmraTmrKHmlLnlj5jkuI3nlJ/mlYghJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCfopoHmlLnlj5jlgLzkuI3mmK/mlbDlrZfnsbvlnoshJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKumHjee9rui/meS4quWNleS+i++8jOaVsOaNrui/mOWOnyAqL1xyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgd2luZG93W3RoaXNbJ19fcHJvdG9fXyddLmNvbnN0cnVjdG9yLm5hbWVdID0gbmV3IHRoaXNbJ19fcHJvdG9fXyddLmNvbnN0cnVjdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/ku47mnKzlnLDojrflj5ZcclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdmFyIGxvY2FsRGF0YSA9IEdDb2Nvcy5sb2NhbC5nZXQodXNlcktleSk7XHJcbiAgICAgICAgaWYgKGxvY2FsRGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpIGluIGxvY2FsRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWxsRGF0YVtpXSA9IGxvY2FsRGF0YVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzTmV3ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9oaWRl55qE5pe25YCZ5L+d5a2Y5LiA5LiL5pWw5o2uXHJcbiAgICAgICAgY2MuZ2FtZS5vbihjYy5nYW1lLkVWRU5UX0hJREUsIHRoaXMuc2F2ZUxvY2FsLCB0aGlzKTtcclxuICAgIH1cclxuICAgIC8v5L+d5a2Y5Yiw5pys5ZywXHJcbiAgICBzYXZlTG9jYWwoKSB7XHJcbiAgICAgICAgR0NvY29zLmxvY2FsLnNldCh1c2VyS2V5LCB0aGlzLl9hbGxEYXRhKTtcclxuICAgIH1cclxufVxyXG4vKirmmrTpnLLlhajlsYDmj5DnpLogKi9cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgLyoqXHJcbiAgICAgKiDnjqnlrrbmlbDmja7kuK3lv4PvvIznjqnlrrbmlbDmja7nmoTojrflj5bvvIzorr7nva7vvIzmlLnlj5jlj4rlhbbku5bnm7jlhbPpgLvovpFcclxuICAgICAqL1xyXG4gICAgY29uc3QgR0RhdGE6IEdEYXRhO1xyXG59XHJcbndpbmRvd1snR0RhdGEnXSA9IG5ldyBHRGF0YSgpOyJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Modules/GEvent.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '413eeyY5alMh58pZSNFxx8K', 'GEvent');
// Script/Modules/GEvent.ts

"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEvent = void 0;
/**全局的事件发送监听中心 (发布订阅者模式)
 * 建议配合GEventName文件用 symbol 类型的事件名，防止事件冲突
 */
var GEvent = /** @class */ (function () {
    function GEvent() {
        /**所有事件及其信息 */
        this._allEventInfo = new Map();
        /**所有脚本下面的事件记录 */
        this._allContextInfo = new Map();
    }
    /**开始一个事件监听
     * @param {NameType} eventName 事件名  GEventName里面的枚举类型
     * @param {Function} handler 事件响应函数
     * @param {object} context 当前脚本 this
     * @example
     * GEvent.on(GEventName.Test, this[GEventName.Test], this);
     */
    GEvent.prototype.on = function (eventName, handler, context) {
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
        this._allEventInfo.get(eventName).set(context, { handler: handler, context: context });
    };
    /**用数组的形式开始多个事件监听（推荐）
     * @param {NameType[]} eventNameArray 事件名  GEventName里面的枚举类型数组
     * @param {object} context 当前脚本 this
     * @example
     * GEvent.onByArray([GEventName.Test1, GEventName.Test.Test2, ], this);
     */
    GEvent.prototype.onByArray = function (eventNameArray, context) {
        for (var _i = 0, eventNameArray_1 = eventNameArray; _i < eventNameArray_1.length; _i++) {
            var one = eventNameArray_1[_i];
            this.on(one, context[one], context);
        }
    };
    /**关闭一个事件监听
     * @param {NameType} eventName 事件名  GEventName里面的枚举类型
     * @param {object} context 当前脚本 this
     * @example
     * GEvent.off(GEventName.Test, this);
     */
    GEvent.prototype.off = function (eventName, context) {
        if (!this._allEventInfo.has(eventName)) {
            console.warn('事件已经关闭监听或从未开始监听！');
        }
        this._allEventInfo.get(eventName).delete(context);
    };
    /**关闭当前脚本所有事件监听（推荐）
    * @param {object} context 当前脚本 this
    * @example
      onDestroy(){
          GEvent.offAll(this);
      }
    */
    GEvent.prototype.offAll = function (context) {
        if (!this._allContextInfo.has(context)) {
            console.warn('当前脚本事件已经关闭监听或从未开始监听！');
        }
        var contextInfo = this._allContextInfo.get(context);
        if (Array.isArray(contextInfo)) {
            for (var _i = 0, contextInfo_1 = contextInfo; _i < contextInfo_1.length; _i++) {
                var one = contextInfo_1[_i];
                this.off(one, context);
            }
        }
        this._allContextInfo.delete(context);
    };
    /**发送事件
     * 参数个数不限，第一个参数为事件名，其余为传递给响应函数的参数
     * @param {NameType} eventName 事件名  GEventName里面的枚举类型
     * @param args 传递给响应函数的参数集，可以为空
     * @example
     * GEvent.emit(GEventName.Test, "test");
     */
    GEvent.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var eventInfo = this._allEventInfo.get(eventName);
        if (eventInfo) {
            eventInfo.forEach(function (data) {
                var _a;
                return (_a = data.handler).call.apply(_a, __spreadArrays([data.context], args));
            });
        }
        else {
            console.warn('还没有添加对应的事件监听!');
        }
    };
    return GEvent;
}());
exports.GEvent = GEvent;
window['GEvent'] = new GEvent();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxNb2R1bGVzXFxHRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztHQUVHO0FBQ0g7SUFBQTtRQUNJLGNBQWM7UUFDTixrQkFBYSxHQUF1RSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3RHLGlCQUFpQjtRQUNULG9CQUFlLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7SUF3RnRFLENBQUM7SUF0Rkc7Ozs7OztPQU1HO0lBQ0ssbUJBQUUsR0FBVixVQUFXLFNBQW1CLEVBQUUsT0FBaUIsRUFBRSxPQUFlO1FBQzlELE1BQU07UUFDTixJQUFJLE9BQU8sT0FBTyxJQUFJLFVBQVUsRUFBRTtZQUM5QixPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNCLE9BQU87U0FDVjtRQUNELDJCQUEyQjtRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELFFBQVE7UUFDUixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztTQUNoRDtRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPLFNBQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsMEJBQVMsR0FBVCxVQUFVLGNBQTBCLEVBQUUsT0FBZTtRQUNqRCxLQUFnQixVQUFjLEVBQWQsaUNBQWMsRUFBZCw0QkFBYyxFQUFkLElBQWMsRUFBRTtZQUEzQixJQUFJLEdBQUcsdUJBQUE7WUFDUixJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDdkM7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxvQkFBRyxHQUFILFVBQUksU0FBbUIsRUFBRSxPQUFlO1FBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDcEM7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVEOzs7Ozs7TUFNRTtJQUNGLHVCQUFNLEdBQU4sVUFBTyxPQUFlO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDNUIsS0FBZ0IsVUFBVyxFQUFYLDJCQUFXLEVBQVgseUJBQVcsRUFBWCxJQUFXLEVBQUU7Z0JBQXhCLElBQUksR0FBRyxvQkFBQTtnQkFDUixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUMxQjtTQUNKO1FBQ0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILHFCQUFJLEdBQUosVUFBSyxTQUFtQjtRQUFFLGNBQWM7YUFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO1lBQWQsNkJBQWM7O1FBQ3BDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELElBQUksU0FBUyxFQUFFO1lBQ1gsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7O2dCQUFLLE9BQUEsQ0FBQSxLQUFBLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxJQUFJLDJCQUFDLElBQUksQ0FBQyxPQUFPLEdBQUssSUFBSTtZQUF2QyxDQUF3QyxDQUFDLENBQUM7U0FDekU7YUFBTTtZQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDakM7SUFDTCxDQUFDO0lBQ0wsYUFBQztBQUFELENBNUZBLEFBNEZDLElBQUE7QUE1Rlksd0JBQU07QUFvR25CLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsidHlwZSBOYW1lVHlwZSA9IHN0cmluZyB8IHN5bWJvbCB8IG51bWJlcjtcclxuLyoq5YWo5bGA55qE5LqL5Lu25Y+R6YCB55uR5ZCs5Lit5b+DICjlj5HluIPorqLpmIXogIXmqKHlvI8pXHJcbiAqIOW7uuiurumFjeWQiEdFdmVudE5hbWXmlofku7bnlKggc3ltYm9sIOexu+Wei+eahOS6i+S7tuWQje+8jOmYsuatouS6i+S7tuWGsueqgVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEdFdmVudCB7XHJcbiAgICAvKirmiYDmnInkuovku7blj4rlhbbkv6Hmga8gKi9cclxuICAgIHByaXZhdGUgX2FsbEV2ZW50SW5mbzogTWFwPE5hbWVUeXBlLCBNYXA8b2JqZWN0LCB7IGhhbmRsZXI6IEZ1bmN0aW9uOyBjb250ZXh0OiBvYmplY3QgfT4+ID0gbmV3IE1hcCgpO1xyXG4gICAgLyoq5omA5pyJ6ISa5pys5LiL6Z2i55qE5LqL5Lu26K6w5b2VICovXHJcbiAgICBwcml2YXRlIF9hbGxDb250ZXh0SW5mbzogTWFwPG9iamVjdCwgQXJyYXk8TmFtZVR5cGU+PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAvKirlvIDlp4vkuIDkuKrkuovku7bnm5HlkKxcclxuICAgICAqIEBwYXJhbSB7TmFtZVR5cGV9IGV2ZW50TmFtZSDkuovku7blkI0gIEdFdmVudE5hbWXph4zpnaLnmoTmnprkuL7nsbvlnotcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIg5LqL5Lu25ZON5bqU5Ye95pWwXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dCDlvZPliY3ohJrmnKwgdGhpc1xyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIEdFdmVudC5vbihHRXZlbnROYW1lLlRlc3QsIHRoaXNbR0V2ZW50TmFtZS5UZXN0XSwgdGhpcyk7XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb24oZXZlbnROYW1lOiBOYW1lVHlwZSwgaGFuZGxlcjogRnVuY3Rpb24sIGNvbnRleHQ6IG9iamVjdCkge1xyXG4gICAgICAgIC8v5Y+C5pWw5qOA5p+lXHJcbiAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcign5rKh5pyJ5LqL5Lu25ZON5bqU5Ye95pWw77yBJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy/orrDlvZXlvZPliY3ohJrmnKznmoTkuovku7Yg5pa55L6/56e76Zmk5b2T5YmN6ISa5pys5rOo5YaM55qE5omA5pyJ5LqL5Lu2XHJcbiAgICAgICAgaWYgKCF0aGlzLl9hbGxDb250ZXh0SW5mby5oYXMoY29udGV4dCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYWxsQ29udGV4dEluZm8uc2V0KGNvbnRleHQsIFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYWxsQ29udGV4dEluZm8uZ2V0KGNvbnRleHQpLnB1c2goZXZlbnROYW1lKTtcclxuICAgICAgICAvL+S/neWtmOS6i+S7tuS/oeaBr1xyXG4gICAgICAgIGlmICghdGhpcy5fYWxsRXZlbnRJbmZvLmhhcyhldmVudE5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FsbEV2ZW50SW5mby5zZXQoZXZlbnROYW1lLCBuZXcgTWFwKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hbGxFdmVudEluZm8uZ2V0KGV2ZW50TmFtZSkuc2V0KGNvbnRleHQsIHsgaGFuZGxlciwgY29udGV4dCB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKirnlKjmlbDnu4TnmoTlvaLlvI/lvIDlp4vlpJrkuKrkuovku7bnm5HlkKzvvIjmjqjojZDvvIlcclxuICAgICAqIEBwYXJhbSB7TmFtZVR5cGVbXX0gZXZlbnROYW1lQXJyYXkg5LqL5Lu25ZCNICBHRXZlbnROYW1l6YeM6Z2i55qE5p6a5Li+57G75Z6L5pWw57uEXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dCDlvZPliY3ohJrmnKwgdGhpc1xyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIEdFdmVudC5vbkJ5QXJyYXkoW0dFdmVudE5hbWUuVGVzdDEsIEdFdmVudE5hbWUuVGVzdC5UZXN0MiwgXSwgdGhpcyk7XHJcbiAgICAgKi9cclxuICAgIG9uQnlBcnJheShldmVudE5hbWVBcnJheTogTmFtZVR5cGVbXSwgY29udGV4dDogb2JqZWN0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgb25lIG9mIGV2ZW50TmFtZUFycmF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMub24ob25lLCBjb250ZXh0W29uZV0sIGNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirlhbPpl63kuIDkuKrkuovku7bnm5HlkKxcclxuICAgICAqIEBwYXJhbSB7TmFtZVR5cGV9IGV2ZW50TmFtZSDkuovku7blkI0gIEdFdmVudE5hbWXph4zpnaLnmoTmnprkuL7nsbvlnotcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0IOW9k+WJjeiEmuacrCB0aGlzXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogR0V2ZW50Lm9mZihHRXZlbnROYW1lLlRlc3QsIHRoaXMpO1xyXG4gICAgICovXHJcbiAgICBvZmYoZXZlbnROYW1lOiBOYW1lVHlwZSwgY29udGV4dDogb2JqZWN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9hbGxFdmVudEluZm8uaGFzKGV2ZW50TmFtZSkpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCfkuovku7blt7Lnu4/lhbPpl63nm5HlkKzmiJbku47mnKrlvIDlp4vnm5HlkKzvvIEnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYWxsRXZlbnRJbmZvLmdldChldmVudE5hbWUpLmRlbGV0ZShjb250ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKirlhbPpl63lvZPliY3ohJrmnKzmiYDmnInkuovku7bnm5HlkKzvvIjmjqjojZDvvIlcclxuICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQg5b2T5YmN6ISa5pysIHRoaXMgICBcclxuICAgICogQGV4YW1wbGUgXHJcbiAgICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgICAgR0V2ZW50Lm9mZkFsbCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgKi9cclxuICAgIG9mZkFsbChjb250ZXh0OiBvYmplY3QpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2FsbENvbnRleHRJbmZvLmhhcyhjb250ZXh0KSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+W9k+WJjeiEmuacrOS6i+S7tuW3sue7j+WFs+mXreebkeWQrOaIluS7juacquW8gOWni+ebkeWQrO+8gScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNvbnRleHRJbmZvID0gdGhpcy5fYWxsQ29udGV4dEluZm8uZ2V0KGNvbnRleHQpO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRleHRJbmZvKSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBvbmUgb2YgY29udGV4dEluZm8pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub2ZmKG9uZSwgY29udGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYWxsQ29udGV4dEluZm8uZGVsZXRlKGNvbnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWPkemAgeS6i+S7tlxyXG4gICAgICog5Y+C5pWw5Liq5pWw5LiN6ZmQ77yM56ys5LiA5Liq5Y+C5pWw5Li65LqL5Lu25ZCN77yM5YW25L2Z5Li65Lyg6YCS57uZ5ZON5bqU5Ye95pWw55qE5Y+C5pWwXHJcbiAgICAgKiBAcGFyYW0ge05hbWVUeXBlfSBldmVudE5hbWUg5LqL5Lu25ZCNICBHRXZlbnROYW1l6YeM6Z2i55qE5p6a5Li+57G75Z6LXHJcbiAgICAgKiBAcGFyYW0gYXJncyDkvKDpgJLnu5nlk43lupTlh73mlbDnmoTlj4LmlbDpm4bvvIzlj6/ku6XkuLrnqbpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBHRXZlbnQuZW1pdChHRXZlbnROYW1lLlRlc3QsIFwidGVzdFwiKTtcclxuICAgICAqL1xyXG4gICAgZW1pdChldmVudE5hbWU6IE5hbWVUeXBlLCAuLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGxldCBldmVudEluZm8gPSB0aGlzLl9hbGxFdmVudEluZm8uZ2V0KGV2ZW50TmFtZSk7XHJcbiAgICAgICAgaWYgKGV2ZW50SW5mbykge1xyXG4gICAgICAgICAgICBldmVudEluZm8uZm9yRWFjaCgoZGF0YSkgPT4gZGF0YS5oYW5kbGVyLmNhbGwoZGF0YS5jb250ZXh0LCAuLi5hcmdzKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCfov5jmsqHmnInmt7vliqDlr7nlupTnmoTkuovku7bnm5HlkKwhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKuaatOmcsuWFqOWxgOaPkOekuiAqL1xyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICAvKirlhajlsYDnmoTkuovku7blj5HpgIHnm5HlkKzkuK3lv4MgKOWPkeW4g+iuoumYheiAheaooeW8jylcclxuICAgICAqIOW7uuiurumFjeWQiEdFdmVudE5hbWXmlofku7bnlKggc3ltYm9sIOexu+Wei+eahOS6i+S7tuWQje+8jOmYsuatouS6i+S7tuWGsueqgVxyXG4gICAgICovXHJcbiAgICBjb25zdCBHRXZlbnQ6IEdFdmVudDtcclxufVxyXG53aW5kb3dbJ0dFdmVudCddID0gbmV3IEdFdmVudCgpO1xyXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Component/WxSubShow.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '0863fnxRUdK1bOtSBMSH8Xy', 'WxSubShow');
// Script/Component/WxSubShow.ts

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var WxSubShow = /** @class */ (function (_super) {
    __extends(WxSubShow, _super);
    function WxSubShow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WxSubShow.prototype.onEnable = function () {
        GSdk.sub.showRank(this.node);
    };
    WxSubShow = __decorate([
        ccclass
    ], WxSubShow);
    return WxSubShow;
}(cc.Component));
exports.default = WxSubShow;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxDb21wb25lbnRcXFd4U3ViU2hvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTSxJQUFBLEtBQXdCLEVBQUUsQ0FBQyxVQUFVLEVBQW5DLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBa0IsQ0FBQztBQUc1QztJQUF1Qyw2QkFBWTtJQUFuRDs7SUFJQSxDQUFDO0lBSEcsNEJBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBSGdCLFNBQVM7UUFEN0IsT0FBTztPQUNhLFNBQVMsQ0FJN0I7SUFBRCxnQkFBQztDQUpELEFBSUMsQ0FKc0MsRUFBRSxDQUFDLFNBQVMsR0FJbEQ7a0JBSm9CLFNBQVMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IGNjY2xhc3MsIHByb3BlcnR5IH0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3hTdWJTaG93IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuICAgIG9uRW5hYmxlKCkge1xyXG4gICAgICAgIEdTZGsuc3ViLnNob3dSYW5rKHRoaXMubm9kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4iXX0=
//------QC-SOURCE-SPLIT------
