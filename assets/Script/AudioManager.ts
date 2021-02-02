
const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoManager extends cc.Component {

    @property({ type: cc.AudioClip })
    dropClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    leveUpClip: cc.AudioClip = null;
    start() {
        cc.game.on('game-ball-drop', () => {
            cc.audioEngine.playEffect(this.dropClip, false);
        });

        cc.game.on('game-ball-levelup', () => {
            cc.audioEngine.playEffect(this.leveUpClip, false);
            GSdk.vibrateShort();
        });
    }

}
