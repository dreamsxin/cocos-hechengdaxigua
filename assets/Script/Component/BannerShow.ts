var EChannel = cc.Enum({
    'NONE': 0,
    'wx': 1,
});
const { ccclass, property } = cc._decorator;

@ccclass
export default class BannerShow extends cc.Component {

    @property({ displayName: '渠道' })
    channel: string = 'wx';
    @property
    adUnitIdBanner: string = null;

    private updateTime: number = 50;
    private noBanner: boolean = false;
    private _bannerAd: any = null; //banner缓存池
    private _poolMax: number = 10;
    private _pool: any[] = [];
    onLoad() {
        this.bannerCreator();
    }

    onEnable() {
        this.bannerShow();
        this.schedule(() => {
            this.bannerShow();
            this.bannerCreator();
        }, this.updateTime);
    }
    onDisable() {
        this.unscheduleAllCallbacks();
        this.bannerHide();
    }

    bannerCreator() {
        if (this._pool.length > this._poolMax || this.noBanner) {
            return;
        }
        if (window[this.channel] && this.adUnitIdBanner) {
            let banner = window[this.channel].createBannerAd({ adUnitId: this.adUnitIdBanner, style: { left: 0, top: 0, width: 360, } });
            banner.onError((res) => { this.noBanner = true; });
            banner.onLoad(() => {
                this._pool.unshift(banner);//添加到数组的第一个
                if (this.node.active && !this._bannerAd) {
                    this.bannerShow();
                }
            });
        }
    }

    bannerShow() {
        this.bannerHide();
        if (this._pool.length > 0) {
            this._bannerAd = this._pool.shift();
            this.setBannerStyle(this._bannerAd);
            this._bannerAd.show();
        }
    }

    bannerHide() {
        if (this._bannerAd) {
            this._bannerAd.hide();
            this._pool.push(this._bannerAd);
            this._bannerAd = null;
        }
    }

    setBannerStyle = function (ad: any) {
        var btnRect = this.node.getBoundingBoxToWorld();
        var anchorX = this.node.anchorX;
        var anchorY = this.node.anchorY;
        let frameSize = cc.view.getFrameSize();// 屏幕尺寸
        let winSize = cc.winSize;// 实际分辨率
        let nodeX = btnRect.xMin + anchorX * btnRect.width;
        let nodeY = btnRect.yMin + anchorY * btnRect.height;
        let bannerHeight = ad.style.realHeight;
        let bannerWidth = ad.style.realWidth;
        let x = nodeX / winSize.width * frameSize.width;
        let y = (winSize.height - nodeY) / winSize.height * frameSize.height;
        let left = x - bannerWidth * anchorX;
        let top = y - bannerHeight * (1 - anchorY);
        ad.style.left = left;
        ad.style.top = top;
    };
}