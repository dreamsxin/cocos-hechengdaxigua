
const {ccclass, property} = cc._decorator;

@ccclass
export default class AutoRotationSc extends cc.Component {
    update (dt) {
        this.node.angle += dt * 100;
    }
}
