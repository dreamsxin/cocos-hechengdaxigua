"use strict";
cc._RF.push(module, 'a24e3sZyp9GJoX+eE54dcEO', 'GameSc');
// Script/GameSc.ts

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
var BallSc_1 = require("./BallSc");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameState;
(function (GameState) {
    GameState[GameState["start"] = 0] = "start";
    GameState[GameState["gaming"] = 1] = "gaming";
    GameState[GameState["over"] = 2] = "over";
})(GameState || (GameState = {}));
var GameSc = /** @class */ (function (_super) {
    __extends(GameSc, _super);
    function GameSc() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scoreLabel = null;
        _this.ballsLayer = null;
        _this.waterEffectPrefab = null;
        _this.ballsPrefab = [];
        _this.deadLine = null;
        _this.randomArray = [0, 0, 0, 0, 1, 1, 2, 3];
        _this.currentBall = null;
        _this.currentBallIndex = 0;
        _this._gameState = GameState.gaming;
        _this._winner = false;
        _this._score = 0;
        _this.ballColors = [
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
        return _this;
    }
    Object.defineProperty(GameSc.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (v) {
            this._score = v;
            this.scoreLabel.string = v.toFixed(0);
        },
        enumerable: false,
        configurable: true
    });
    GameSc.prototype.onLoad = function () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -1280);
        GSdk.init();
    };
    GameSc.prototype.start = function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.CreateNewBall();
        //死亡线在球接近的时候闪烁
        this.deadLine.active = false;
        cc.tween(this.deadLine).repeatForever(cc.tween(this.deadLine)
            .to(0.3, { opacity: 0 })
            .to(0.3, { opacity: 255 })).start();
    };
    /** 松开弹射 */
    GameSc.prototype.onTouchEnd = function (e) {
        var _this = this;
        if (this._gameState !== GameState.gaming) {
            return;
        }
        if (!this.currentBall) {
            return;
        }
        var ball = this.currentBall;
        ball.addComponent(BallSc_1.default).BallIndex = this.currentBallIndex;
        this.currentBall = null;
        var x = this.ballsLayer.convertToNodeSpaceAR(e.getLocation()).x;
        if (x > 720 / 2 - ball.width / 2) {
            x = 720 / 2 - ball.width / 2;
        }
        else if (x < -720 / 2 + ball.width / 2) {
            x = -720 / 2 + ball.width / 2;
        }
        var speed = 1 / 1000;
        cc.tween(ball)
            .to(Math.abs(speed * x), { x: x })
            .call(function () {
            ball.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
            ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -300);
            _this.CreateNewBall();
        })
            .start();
    };
    GameSc.prototype.onTouchMove = function (e) {
        if (this._gameState == GameState.gaming) {
            if (this.currentBall) {
                var x = this.ballsLayer.convertToNodeSpaceAR(e.getLocation()).x;
                if (x > 720 / 2 - this.currentBall.width / 2) {
                    x = 720 / 2 - this.currentBall.width / 2;
                }
                else if (x < -720 / 2 + this.currentBall.width / 2) {
                    x = -720 / 2 + this.currentBall.width / 2;
                }
                this.currentBall.x = x;
            }
        }
    };
    /** 创建一个新的球在等待射击的位置上 */
    GameSc.prototype.CreateNewBall = function () {
        var _this = this;
        // 如果之前的球存在则销毁它
        if (this.currentBall) {
            this.currentBall.destroy();
        }
        var randomIndex = this.randomArray[Math.floor(Math.random() * this.randomArray.length)];
        var ball = cc.instantiate(this.ballsPrefab[randomIndex]);
        this.currentBallIndex = ball.getComponent(BallSc_1.default).BallIndex;
        ball.removeComponent(BallSc_1.default);
        ball.y = 566;
        ball.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        //this.currentBall
        ball.scale = 0;
        cc.tween(ball)
            .delay(0.2)
            .call(function () {
            _this.ballsLayer.addChild(ball);
        })
            .to(0.2, { scale: 1 })
            .call(function () {
            _this.currentBall = ball;
        }).start();
    };
    GameSc.prototype.BallLevelUp = function (target, other) {
        var _this = this;
        var index = target.getComponent(BallSc_1.default).BallIndex + 1;
        if (index <= this.ballsPrefab.length) {
            cc.game.emit('game-ball-levelup');
            other.getComponent(cc.PhysicsCollider).enabled = false;
            cc.tween(other).to(0.15, { x: target.x, y: target.y }).removeSelf()
                .call(function () {
                var newBall = cc.instantiate(_this.ballsPrefab[index - 1]);
                newBall.position = target.position;
                _this.ballsLayer.addChild(newBall);
                target.removeFromParent(true);
                var eff = cc.instantiate(_this.waterEffectPrefab);
                eff.x = newBall.x;
                eff.y = newBall.y;
                eff.color = _this.ballColors[index - 1];
                _this.ballsLayer.addChild(eff);
                if (index == _this.ballsPrefab.length && _this._winner == false) {
                    _this._winner = true;
                    cc.find('Canvas/WinUI').active = true;
                }
            })
                .start();
            this.score += target.getComponent(BallSc_1.default).BallIndex;
            // 对随机范围作扩充
            if (this.randomArray.findIndex(function (value) {
                return value == index - 1;
            }) < 0) {
                this.randomArray = this.randomArray.concat(JSON.parse(JSON.stringify(this.randomArray))).sort(function (a, b) { return a - b; });
                //console.log(this.randomArray);
                this.randomArray.push(index - 1);
            }
            return true;
        }
        else {
            return false;
        }
    };
    GameSc.prototype.update = function (dt) {
        if (this._gameState == GameState.gaming) {
            var arr = this.ballsLayer.getComponentsInChildren(BallSc_1.default);
            var warning = false;
            var over = false;
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var ball = arr_1[_i];
                if (!ball.isNotCheckOver)
                    continue;
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
    };
    GameSc.prototype.replay = function () {
        var _this = this;
        cc.find('Canvas/OverUI').active = false;
        this._gameState = GameState.start;
        var arr = this.ballsLayer.getComponentsInChildren(BallSc_1.default);
        var _loop_1 = function (i) {
            cc.tween(arr[i].node).delay(0.1 * i).call(function () {
                var eff = cc.instantiate(_this.waterEffectPrefab);
                eff.x = arr[i].node.x;
                eff.y = arr[i].node.y;
                eff.color = _this.ballColors[arr[i].BallIndex - 1];
                _this.ballsLayer.addChild(eff);
            }).removeSelf().start();
        };
        for (var i = arr.length - 1; i >= 0; i--) {
            _loop_1(i);
        }
        cc.tween(this).delay(arr.length * 0.1)
            .call(function () {
            _this._gameState = GameState.gaming;
            /** 恢复到原始状态 */
            _this.randomArray = [0, 0, 0, 0, 1, 1, 2, 3];
            _this.CreateNewBall();
        }).start();
        this.score = 0;
        this._winner = false;
    };
    GameSc.prototype.closeWin = function () {
        cc.find('Canvas/WinUI').active = false;
        GSdk.interstitial.show();
    };
    __decorate([
        property(cc.Label)
    ], GameSc.prototype, "scoreLabel", void 0);
    __decorate([
        property(cc.Node)
    ], GameSc.prototype, "ballsLayer", void 0);
    __decorate([
        property(cc.Prefab)
    ], GameSc.prototype, "waterEffectPrefab", void 0);
    __decorate([
        property([cc.Prefab])
    ], GameSc.prototype, "ballsPrefab", void 0);
    __decorate([
        property(cc.Node)
    ], GameSc.prototype, "deadLine", void 0);
    GameSc = __decorate([
        ccclass
    ], GameSc);
    return GameSc;
}(cc.Component));
exports.default = GameSc;

cc._RF.pop();