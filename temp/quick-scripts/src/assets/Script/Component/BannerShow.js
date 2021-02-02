"use strict";
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
        _this.updateTime = null;
        _this._instance = null;
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
        if (window[this.channel] && this.adUnitIdBanner) {
            this.bannerCreator();
        }
    };
    BannerShow.prototype.onEnable = function () {
        if (window[this.channel] && this.adUnitIdBanner) {
            this.bannerShow();
            this.bannerCreator();
        }
    };
    BannerShow.prototype.onDisable = function () {
        if (window[this.channel] && this.adUnitIdBanner) {
            this.bannerHide();
        }
    };
    BannerShow.prototype.bannerCreator = function () {
        var _this = this;
        if (this._pool.length > this._poolMax) {
            return;
        }
        var banner = window[this.channel].createBannerAd({ adUnitId: this.adUnitIdBanner, style: { left: 0, top: 0, width: 300, } });
        banner.onError(function (res) {
            console.log('[banner] onError', res);
            _this.noBanner = true;
        });
        banner.onLoad(function () {
            _this._pool.unshift(banner); //添加到数组的第一个
            if (_this.node.active && !_this._bannerAd) {
                _this.bannerShow();
            }
        });
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
    __decorate([
        property
    ], BannerShow.prototype, "updateTime", void 0);
    BannerShow = __decorate([
        ccclass
    ], BannerShow);
    return BannerShow;
}(cc.Component));
exports.default = BannerShow;

cc._RF.pop();