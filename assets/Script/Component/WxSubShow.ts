const { ccclass, property } = cc._decorator;

@ccclass
export default class WxSubShow extends cc.Component {
    onEnable() {
        GSdk.sub.showRank(this.node);
    }
}


