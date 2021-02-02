
const { ccclass, property } = cc._decorator;

@ccclass
export default class WaterEffectSc extends cc.Component {

    start() {
        this.node.scale = 0;
        cc.tween(this.node)
            .to(0.15, { scale: 1 }, { easing: cc.easeBackOut().easing })
            .delay(0.3)
            .to(0.3, { opacity: 0 })
            .removeSelf()
            .start();
        this.node.angle = Math.random() * 360;
    }
}
