import BallSc from "./BallSc";

const { ccclass, property } = cc._decorator;

enum GameState {
    start, gaming, over
}
@ccclass
export default class GameUI extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Node)
    ballsLayer: cc.Node = null;
    @property(cc.Prefab)
    waterEffectPrefab: cc.Prefab = null;
    @property([cc.Prefab])
    ballsPrefab: cc.Prefab[] = [];
    @property(cc.Node)
    deadLine: cc.Node = null;

    private randomArray = [0, 0, 0, 0, 1, 1, 2, 3];
    private currentBall: cc.Node = null;
    private currentBallIndex: number = 0;
    private _gameState: GameState = GameState.gaming;
    private _winner = false;

    private _score: number = 0;
    public get score(): number {
        return this._score;
    }

    public set score(v: number) {
        this._score = v;
        this.scoreLabel.string = v.toFixed(0);
        if (this._score > GData.get('maxScore')) {
            GData.set('maxScore', this._score);
            GSdk.sub.uploadScore(this._score);
        }
    }

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -1280);

        GData.init();
        GSdk.init();
    }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.CreateNewBall();
        //死亡线在球接近的时候闪烁
        this.deadLine.active = false;

        cc.tween(this.deadLine).repeatForever(
            cc.tween(this.deadLine)
                .to(0.3, { opacity: 0 })
                .to(0.3, { opacity: 255 })
        ).start();
    }
    /** 松开弹射 */
    private onTouchEnd(e: cc.Event.EventTouch) {
        if (this._gameState !== GameState.gaming) {
            return;
        }
        if (!this.currentBall) {
            return;
        }
        let ball = this.currentBall;
        ball.addComponent(BallSc).BallIndex = this.currentBallIndex;
        this.currentBall = null;
        let x = this.ballsLayer.convertToNodeSpaceAR(e.getLocation()).x;

        if (x > 720 / 2 - ball.width / 2) {
            x = 720 / 2 - ball.width / 2;
        } else if (x < -720 / 2 + ball.width / 2) {
            x = -720 / 2 + ball.width / 2;
        }

        let speed = 1 / 1000;
        cc.tween(ball)
            .to(Math.abs(speed * x), { x })
            .call(() => {
                ball.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
                ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -300);
                this.CreateNewBall();
            })
            .start();
    }

    private onTouchMove(e: cc.Event.EventTouch) {
        if (this._gameState == GameState.gaming) {
            if (this.currentBall) {
                let x = this.ballsLayer.convertToNodeSpaceAR(e.getLocation()).x;
                if (x > 720 / 2 - this.currentBall.width / 2) {
                    x = 720 / 2 - this.currentBall.width / 2;
                } else if (x < -720 / 2 + this.currentBall.width / 2) {
                    x = -720 / 2 + this.currentBall.width / 2;
                }
                this.currentBall.x = x;
            }
        }
    }
    /** 创建一个新的球在等待射击的位置上 */
    private CreateNewBall() {
        // 如果之前的球存在则销毁它
        if (this.currentBall) {
            this.currentBall.destroy();
        }
        const randomIndex = this.randomArray[Math.floor(Math.random() * this.randomArray.length)];
        const ball = cc.instantiate(this.ballsPrefab[randomIndex]);
        this.currentBallIndex = ball.getComponent(BallSc).BallIndex;
        ball.removeComponent(BallSc);
        ball.y = 566;
        ball.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        //this.currentBall
        ball.scale = 0;
        cc.tween(ball)
            .delay(0.2)
            .call(() => {
                this.ballsLayer.addChild(ball);
            })
            .to(0.2, { scale: 1 })
            .call(() => {
                this.currentBall = ball;
            }).start();
    }

    public BallLevelUp(target: cc.Node, other: cc.Node) {
        let index = target.getComponent(BallSc).BallIndex + 1;
        if (index <= this.ballsPrefab.length) {
            cc.game.emit('game-ball-levelup');

            other.getComponent(cc.PhysicsCollider).enabled = false;
            cc.tween(other).to(0.15, { x: target.x, y: target.y }).removeSelf()
                .call(() => {
                    const newBall = cc.instantiate(this.ballsPrefab[index - 1]);
                    newBall.position = target.position;
                    this.ballsLayer.addChild(newBall);
                    target.removeFromParent(true);
                    const eff = cc.instantiate(this.waterEffectPrefab);
                    eff.x = newBall.x;
                    eff.y = newBall.y;
                    eff.color = this.ballColors[index - 1];
                    this.ballsLayer.addChild(eff);
                    if (index == this.ballsPrefab.length && this._winner == false) {
                        this._winner = true;

                        cc.find('Canvas/WinUI').active = true;
                    }
                })
                .start();
            this.score += target.getComponent(BallSc).BallIndex;
            // 对随机范围作扩充
            if (this.randomArray.findIndex((value) => {
                return value == index - 1;
            }) < 0) {
                this.randomArray = this.randomArray.concat(JSON.parse(JSON.stringify(this.randomArray))).sort((a, b) => { return a - b; });
                //console.log(this.randomArray);
                this.randomArray.push(index - 1);
            }
            return true;
        } else {
            return false;
        }
    }

    private ballColors: cc.Color[] = [
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

    update(dt) {
        if (this._gameState == GameState.gaming) {
            const arr = this.ballsLayer.getComponentsInChildren(BallSc);
            let warning: boolean = false;
            let over: boolean = false;
            for (let ball of arr) {
                if (!ball.isNotCheckOver) continue;
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
    }

    replay() {
        cc.find('Canvas/OverUI').active = false;
        this._gameState = GameState.start;
        const arr = this.ballsLayer.getComponentsInChildren(BallSc);
        for (let i = arr.length - 1; i >= 0; i--) {
            cc.tween(arr[i].node).delay(0.1 * i).call(
                () => {
                    const eff = cc.instantiate(this.waterEffectPrefab);
                    eff.x = arr[i].node.x;
                    eff.y = arr[i].node.y;
                    eff.color = this.ballColors[arr[i].BallIndex - 1];
                    this.ballsLayer.addChild(eff);
                }
            ).removeSelf().start();
        }
        cc.tween(this).delay(arr.length * 0.1)
            .call(() => {
                this._gameState = GameState.gaming;
                /** 恢复到原始状态 */
                this.randomArray = [0, 0, 0, 0, 1, 1, 2, 3];
                this.CreateNewBall();
            }).start();
        this.score = 0;
        this._winner = false;
    }

    closeWin() {
        cc.find('Canvas/WinUI').active = false;
        GSdk.interstitial.show();
    }

    onBtn(evt, str) {
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
    }


}

