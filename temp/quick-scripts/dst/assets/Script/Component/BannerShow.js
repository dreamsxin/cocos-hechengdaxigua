
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxDb21wb25lbnRcXEJhbm5lclNob3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztJQUNuQixNQUFNLEVBQUUsQ0FBQztJQUNULElBQUksRUFBRSxDQUFDO0NBQ1YsQ0FBQyxDQUFDO0FBQ0csSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFHNUM7SUFBd0MsOEJBQVk7SUFBcEQ7UUFBQSxxRUFtRkM7UUFoRkcsYUFBTyxHQUFXLElBQUksQ0FBQztRQUV2QixvQkFBYyxHQUFXLElBQUksQ0FBQztRQUU5QixnQkFBVSxHQUFXLElBQUksQ0FBQztRQUVsQixlQUFTLEdBQVEsSUFBSSxDQUFDO1FBQ3RCLGNBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsZUFBUyxHQUFRLElBQUksQ0FBQyxDQUFDLFdBQVc7UUFDbEMsY0FBUSxHQUFXLEVBQUUsQ0FBQztRQUN0QixXQUFLLEdBQVUsRUFBRSxDQUFDO1FBcUQxQixvQkFBYyxHQUFHLFVBQVUsRUFBTztZQUM5QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDaEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDaEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDaEMsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFBLE9BQU87WUFDOUMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFBLFFBQVE7WUFDakMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUNuRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3BELElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQ3ZDLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDaEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztZQUNyRSxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsV0FBVyxHQUFHLE9BQU8sQ0FBQztZQUNyQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1lBQzNDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDdkIsQ0FBQyxDQUFDOztJQUNOLENBQUM7SUFyRUcsMkJBQU0sR0FBTjtRQUNJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQzdDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN4QjtJQUNMLENBQUM7SUFFRCw2QkFBUSxHQUFSO1FBQ0ksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDN0MsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN4QjtJQUNMLENBQUM7SUFDRCw4QkFBUyxHQUFUO1FBQ0ksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDN0MsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3JCO0lBQ0wsQ0FBQztJQUVELGtDQUFhLEdBQWI7UUFBQSxpQkFlQztRQWRHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNuQyxPQUFPO1NBQ1Y7UUFDRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdILE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNyQyxLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDVixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLFdBQVc7WUFDdEMsSUFBSSxLQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ3JDLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzthQUNyQjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELCtCQUFVLEdBQVY7UUFDSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRUQsK0JBQVUsR0FBVjtRQUNJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUN6QjtJQUNMLENBQUM7SUE3REQ7UUFEQyxRQUFRLENBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUM7K0NBQ1Q7SUFFdkI7UUFEQyxRQUFRO3NEQUNxQjtJQUU5QjtRQURDLFFBQVE7a0RBQ2lCO0lBUFQsVUFBVTtRQUQ5QixPQUFPO09BQ2EsVUFBVSxDQW1GOUI7SUFBRCxpQkFBQztDQW5GRCxBQW1GQyxDQW5GdUMsRUFBRSxDQUFDLFNBQVMsR0FtRm5EO2tCQW5Gb0IsVUFBVSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBFQ2hhbm5lbCA9IGNjLkVudW0oe1xyXG4gICAgJ05PTkUnOiAwLFxyXG4gICAgJ3d4JzogMSxcclxufSk7XHJcbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5AY2NjbGFzc1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYW5uZXJTaG93IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuXHJcbiAgICBAcHJvcGVydHkoeyBkaXNwbGF5TmFtZTogJ+a4oOmBkycgfSlcclxuICAgIGNoYW5uZWw6IHN0cmluZyA9ICd3eCc7XHJcbiAgICBAcHJvcGVydHlcclxuICAgIGFkVW5pdElkQmFubmVyOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgQHByb3BlcnR5XHJcbiAgICB1cGRhdGVUaW1lOiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgX2luc3RhbmNlOiBhbnkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBub0Jhbm5lcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfYmFubmVyQWQ6IGFueSA9IG51bGw7IC8vYmFubmVy57yT5a2Y5rGgXHJcbiAgICBwcml2YXRlIF9wb29sTWF4OiBudW1iZXIgPSAxMDtcclxuICAgIHByaXZhdGUgX3Bvb2w6IGFueVtdID0gW107XHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvd1t0aGlzLmNoYW5uZWxdICYmIHRoaXMuYWRVbml0SWRCYW5uZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5iYW5uZXJDcmVhdG9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlKCkge1xyXG4gICAgICAgIGlmICh3aW5kb3dbdGhpcy5jaGFubmVsXSAmJiB0aGlzLmFkVW5pdElkQmFubmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmFubmVyU2hvdygpO1xyXG4gICAgICAgICAgICB0aGlzLmJhbm5lckNyZWF0b3IoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkRpc2FibGUoKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvd1t0aGlzLmNoYW5uZWxdICYmIHRoaXMuYWRVbml0SWRCYW5uZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5iYW5uZXJIaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJhbm5lckNyZWF0b3IoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Bvb2wubGVuZ3RoID4gdGhpcy5fcG9vbE1heCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBiYW5uZXIgPSB3aW5kb3dbdGhpcy5jaGFubmVsXS5jcmVhdGVCYW5uZXJBZCh7IGFkVW5pdElkOiB0aGlzLmFkVW5pdElkQmFubmVyLCBzdHlsZTogeyBsZWZ0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDAsIH0gfSk7XHJcbiAgICAgICAgYmFubmVyLm9uRXJyb3IoKHJlcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW2Jhbm5lcl0gb25FcnJvcicsIHJlcyk7XHJcbiAgICAgICAgICAgIHRoaXMubm9CYW5uZXIgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJhbm5lci5vbkxvYWQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9wb29sLnVuc2hpZnQoYmFubmVyKTsvL+a3u+WKoOWIsOaVsOe7hOeahOesrOS4gOS4qlxyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLmFjdGl2ZSAmJiAhdGhpcy5fYmFubmVyQWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmFubmVyU2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYmFubmVyU2hvdygpIHtcclxuICAgICAgICB0aGlzLmJhbm5lckhpZGUoKTtcclxuICAgICAgICBpZiAodGhpcy5fcG9vbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhbm5lckFkID0gdGhpcy5fcG9vbC5zaGlmdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEJhbm5lclN0eWxlKHRoaXMuX2Jhbm5lckFkKTtcclxuICAgICAgICAgICAgdGhpcy5fYmFubmVyQWQuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiYW5uZXJIaWRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9iYW5uZXJBZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9iYW5uZXJBZC5oaWRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Bvb2wucHVzaCh0aGlzLl9iYW5uZXJBZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhbm5lckFkID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QmFubmVyU3R5bGUgPSBmdW5jdGlvbiAoYWQ6IGFueSkge1xyXG4gICAgICAgIHZhciBidG5SZWN0ID0gdGhpcy5ub2RlLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xyXG4gICAgICAgIHZhciBhbmNob3JYID0gdGhpcy5ub2RlLmFuY2hvclg7XHJcbiAgICAgICAgdmFyIGFuY2hvclkgPSB0aGlzLm5vZGUuYW5jaG9yWTtcclxuICAgICAgICBsZXQgZnJhbWVTaXplID0gY2Mudmlldy5nZXRGcmFtZVNpemUoKTsvLyDlsY/luZXlsLrlr7hcclxuICAgICAgICBsZXQgd2luU2l6ZSA9IGNjLndpblNpemU7Ly8g5a6e6ZmF5YiG6L6o546HXHJcbiAgICAgICAgbGV0IG5vZGVYID0gYnRuUmVjdC54TWluICsgYW5jaG9yWCAqIGJ0blJlY3Qud2lkdGg7XHJcbiAgICAgICAgbGV0IG5vZGVZID0gYnRuUmVjdC55TWluICsgYW5jaG9yWSAqIGJ0blJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiYW5uZXJIZWlnaHQgPSBhZC5zdHlsZS5yZWFsSGVpZ2h0O1xyXG4gICAgICAgIGxldCBiYW5uZXJXaWR0aCA9IGFkLnN0eWxlLnJlYWxXaWR0aDtcclxuICAgICAgICBsZXQgeCA9IG5vZGVYIC8gd2luU2l6ZS53aWR0aCAqIGZyYW1lU2l6ZS53aWR0aDtcclxuICAgICAgICBsZXQgeSA9ICh3aW5TaXplLmhlaWdodCAtIG5vZGVZKSAvIHdpblNpemUuaGVpZ2h0ICogZnJhbWVTaXplLmhlaWdodDtcclxuICAgICAgICBsZXQgbGVmdCA9IHggLSBiYW5uZXJXaWR0aCAqIGFuY2hvclg7XHJcbiAgICAgICAgbGV0IHRvcCA9IHkgLSBiYW5uZXJIZWlnaHQgKiAoMSAtIGFuY2hvclkpO1xyXG4gICAgICAgIGFkLnN0eWxlLmxlZnQgPSBsZWZ0O1xyXG4gICAgICAgIGFkLnN0eWxlLnRvcCA9IHRvcDtcclxuICAgIH07XHJcbn0iXX0=