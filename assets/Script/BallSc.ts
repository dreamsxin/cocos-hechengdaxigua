
import GameUI from "./GameUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BallSc extends cc.Component {

    @property
    BallIndex: number = 1;
    /** 不要用它检查是否结束游戏 */
    isNotCheckOver = false;
    /** 是不是丢出去的,影响声音处理 */
    isDrop = false;
    start() {
        this.getComponent(cc.PhysicsCollider).restitution = 0.1;
    }

    onBeginContact(contact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        if (otherCollider.getComponent(BallSc)) {
            this.isNotCheckOver = true;
            if (otherCollider.getComponent(BallSc).BallIndex == selfCollider.getComponent(BallSc).BallIndex) {
                // 看看是不是球
                let target = selfCollider;
                let other = otherCollider;
                if (otherCollider.node.y <= selfCollider.node.y) {
                    target = otherCollider;
                    other = selfCollider;
                }
                if (cc.find('Canvas/GameUI').getComponent(GameUI).BallLevelUp(target.node, other.node)) {
                    other.node.removeComponent(BallSc);
                }
            }
        } else if (!this.isDrop) {
            //仅响一次
            this.isDrop = true;
            cc.game.emit('game-ball-drop');
        }
    }
}
