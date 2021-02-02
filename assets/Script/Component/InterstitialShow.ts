const { ccclass, property } = cc._decorator;
@ccclass
export default class InterstitialShow extends cc.Component {
    onEnable() {
        GSdk.interstitial.show();
    }
}