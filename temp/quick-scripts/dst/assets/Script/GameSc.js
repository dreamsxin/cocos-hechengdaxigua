
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/GameSc.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxHYW1lU2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQThCO0FBRXhCLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBRTVDLElBQUssU0FFSjtBQUZELFdBQUssU0FBUztJQUNWLDJDQUFLLENBQUE7SUFBRSw2Q0FBTSxDQUFBO0lBQUUseUNBQUksQ0FBQTtBQUN2QixDQUFDLEVBRkksU0FBUyxLQUFULFNBQVMsUUFFYjtBQUVEO0lBQW9DLDBCQUFZO0lBQWhEO1FBQUEscUVBaU9DO1FBOU5HLGdCQUFVLEdBQWEsSUFBSSxDQUFDO1FBRTVCLGdCQUFVLEdBQVksSUFBSSxDQUFDO1FBRTNCLHVCQUFpQixHQUFjLElBQUksQ0FBQztRQUVwQyxpQkFBVyxHQUFnQixFQUFFLENBQUM7UUFFOUIsY0FBUSxHQUFZLElBQUksQ0FBQztRQUVqQixpQkFBVyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLGlCQUFXLEdBQVksSUFBSSxDQUFDO1FBQzVCLHNCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixnQkFBVSxHQUFjLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDekMsYUFBTyxHQUFHLEtBQUssQ0FBQztRQUVoQixZQUFNLEdBQVcsQ0FBQyxDQUFDO1FBMEluQixnQkFBVSxHQUFlO1lBQzdCLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDakMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNqQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFP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QUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVELHlCQUFRLEdBQVI7UUFDSSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBN05EO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7OENBQ1M7SUFFNUI7UUFEQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQzs4Q0FDUztJQUUzQjtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO3FEQUNnQjtJQUVwQztRQURDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQzsrQ0FDUTtJQUU5QjtRQURDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDOzRDQUNPO0lBWFIsTUFBTTtRQUQxQixPQUFPO09BQ2EsTUFBTSxDQWlPMUI7SUFBRCxhQUFDO0NBak9ELEFBaU9DLENBak9tQyxFQUFFLENBQUMsU0FBUyxHQWlPL0M7a0JBak9vQixNQUFNIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhbGxTYyBmcm9tIFwiLi9CYWxsU2NcIjtcclxuXHJcbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5lbnVtIEdhbWVTdGF0ZSB7XHJcbiAgICBzdGFydCwgZ2FtaW5nLCBvdmVyXHJcbn1cclxuQGNjY2xhc3NcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVNjIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuXHJcbiAgICBAcHJvcGVydHkoY2MuTGFiZWwpXHJcbiAgICBzY29yZUxhYmVsOiBjYy5MYWJlbCA9IG51bGw7XHJcbiAgICBAcHJvcGVydHkoY2MuTm9kZSlcclxuICAgIGJhbGxzTGF5ZXI6IGNjLk5vZGUgPSBudWxsO1xyXG4gICAgQHByb3BlcnR5KGNjLlByZWZhYilcclxuICAgIHdhdGVyRWZmZWN0UHJlZmFiOiBjYy5QcmVmYWIgPSBudWxsO1xyXG4gICAgQHByb3BlcnR5KFtjYy5QcmVmYWJdKVxyXG4gICAgYmFsbHNQcmVmYWI6IGNjLlByZWZhYltdID0gW107XHJcbiAgICBAcHJvcGVydHkoY2MuTm9kZSlcclxuICAgIGRlYWRMaW5lOiBjYy5Ob2RlID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHJhbmRvbUFycmF5ID0gWzAsIDAsIDAsIDAsIDEsIDEsIDIsIDNdO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50QmFsbDogY2MuTm9kZSA9IG51bGw7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRCYWxsSW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9nYW1lU3RhdGU6IEdhbWVTdGF0ZSA9IEdhbWVTdGF0ZS5nYW1pbmc7XHJcbiAgICBwcml2YXRlIF93aW5uZXIgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIF9zY29yZTogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBnZXQgc2NvcmUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NvcmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzY29yZSh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zY29yZSA9IHY7XHJcbiAgICAgICAgdGhpcy5zY29yZUxhYmVsLnN0cmluZyA9IHYudG9GaXhlZCgwKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKS5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBjYy5kaXJlY3Rvci5nZXRQaHlzaWNzTWFuYWdlcigpLmdyYXZpdHkgPSBjYy52MigwLCAtMTI4MCk7XHJcblxyXG4gICAgICAgIEdTZGsuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoTW92ZSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5vblRvdWNoTW92ZSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5DcmVhdGVOZXdCYWxsKCk7XHJcbiAgICAgICAgLy/mrbvkuqHnur/lnKjnkIPmjqXov5HnmoTml7blgJnpl6rng4FcclxuICAgICAgICB0aGlzLmRlYWRMaW5lLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjYy50d2Vlbih0aGlzLmRlYWRMaW5lKS5yZXBlYXRGb3JldmVyKFxyXG4gICAgICAgICAgICBjYy50d2Vlbih0aGlzLmRlYWRMaW5lKVxyXG4gICAgICAgICAgICAgICAgLnRvKDAuMywgeyBvcGFjaXR5OiAwIH0pXHJcbiAgICAgICAgICAgICAgICAudG8oMC4zLCB7IG9wYWNpdHk6IDI1NSB9KVxyXG4gICAgICAgICkuc3RhcnQoKTtcclxuICAgIH1cclxuICAgIC8qKiDmnb7lvIDlvLnlsIQgKi9cclxuICAgIHByaXZhdGUgb25Ub3VjaEVuZChlOiBjYy5FdmVudC5FdmVudFRvdWNoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2dhbWVTdGF0ZSAhPT0gR2FtZVN0YXRlLmdhbWluZykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50QmFsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBiYWxsID0gdGhpcy5jdXJyZW50QmFsbDtcclxuICAgICAgICBiYWxsLmFkZENvbXBvbmVudChCYWxsU2MpLkJhbGxJbmRleCA9IHRoaXMuY3VycmVudEJhbGxJbmRleDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCYWxsID0gbnVsbDtcclxuICAgICAgICBsZXQgeCA9IHRoaXMuYmFsbHNMYXllci5jb252ZXJ0VG9Ob2RlU3BhY2VBUihlLmdldExvY2F0aW9uKCkpLng7XHJcblxyXG4gICAgICAgIGlmICh4ID4gNzIwIC8gMiAtIGJhbGwud2lkdGggLyAyKSB7XHJcbiAgICAgICAgICAgIHggPSA3MjAgLyAyIC0gYmFsbC53aWR0aCAvIDI7XHJcbiAgICAgICAgfSBlbHNlIGlmICh4IDwgLTcyMCAvIDIgKyBiYWxsLndpZHRoIC8gMikge1xyXG4gICAgICAgICAgICB4ID0gLTcyMCAvIDIgKyBiYWxsLndpZHRoIC8gMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGVlZCA9IDEgLyAxMDAwO1xyXG4gICAgICAgIGNjLnR3ZWVuKGJhbGwpXHJcbiAgICAgICAgICAgIC50byhNYXRoLmFicyhzcGVlZCAqIHgpLCB7IHggfSlcclxuICAgICAgICAgICAgLmNhbGwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYmFsbC5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS50eXBlID0gY2MuUmlnaWRCb2R5VHlwZS5EeW5hbWljO1xyXG4gICAgICAgICAgICAgICAgYmFsbC5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS5saW5lYXJWZWxvY2l0eSA9IGNjLnYyKDAsIC0zMDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5DcmVhdGVOZXdCYWxsKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Ub3VjaE1vdmUoZTogY2MuRXZlbnQuRXZlbnRUb3VjaCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9nYW1lU3RhdGUgPT0gR2FtZVN0YXRlLmdhbWluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50QmFsbCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHggPSB0aGlzLmJhbGxzTGF5ZXIuY29udmVydFRvTm9kZVNwYWNlQVIoZS5nZXRMb2NhdGlvbigpKS54O1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPiA3MjAgLyAyIC0gdGhpcy5jdXJyZW50QmFsbC53aWR0aCAvIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICB4ID0gNzIwIC8gMiAtIHRoaXMuY3VycmVudEJhbGwud2lkdGggLyAyO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh4IDwgLTcyMCAvIDIgKyB0aGlzLmN1cnJlbnRCYWxsLndpZHRoIC8gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHggPSAtNzIwIC8gMiArIHRoaXMuY3VycmVudEJhbGwud2lkdGggLyAyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmFsbC54ID0geDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKiDliJvlu7rkuIDkuKrmlrDnmoTnkIPlnKjnrYnlvoXlsITlh7vnmoTkvY3nva7kuIogKi9cclxuICAgIHByaXZhdGUgQ3JlYXRlTmV3QmFsbCgpIHtcclxuICAgICAgICAvLyDlpoLmnpzkuYvliY3nmoTnkIPlrZjlnKjliJnplIDmr4HlroNcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QmFsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCYWxsLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSB0aGlzLnJhbmRvbUFycmF5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMucmFuZG9tQXJyYXkubGVuZ3RoKV07XHJcbiAgICAgICAgY29uc3QgYmFsbCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYmFsbHNQcmVmYWJbcmFuZG9tSW5kZXhdKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCYWxsSW5kZXggPSBiYWxsLmdldENvbXBvbmVudChCYWxsU2MpLkJhbGxJbmRleDtcclxuICAgICAgICBiYWxsLnJlbW92ZUNvbXBvbmVudChCYWxsU2MpO1xyXG4gICAgICAgIGJhbGwueSA9IDU2NjtcclxuICAgICAgICBiYWxsLmdldENvbXBvbmVudChjYy5SaWdpZEJvZHkpLnR5cGUgPSBjYy5SaWdpZEJvZHlUeXBlLlN0YXRpYztcclxuICAgICAgICAvL3RoaXMuY3VycmVudEJhbGxcclxuICAgICAgICBiYWxsLnNjYWxlID0gMDtcclxuICAgICAgICBjYy50d2VlbihiYWxsKVxyXG4gICAgICAgICAgICAuZGVsYXkoMC4yKVxyXG4gICAgICAgICAgICAuY2FsbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJhbGxzTGF5ZXIuYWRkQ2hpbGQoYmFsbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50bygwLjIsIHsgc2NhbGU6IDEgfSlcclxuICAgICAgICAgICAgLmNhbGwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmFsbCA9IGJhbGw7XHJcbiAgICAgICAgICAgIH0pLnN0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIEJhbGxMZXZlbFVwKHRhcmdldDogY2MuTm9kZSwgb3RoZXI6IGNjLk5vZGUpIHtcclxuICAgICAgICBsZXQgaW5kZXggPSB0YXJnZXQuZ2V0Q29tcG9uZW50KEJhbGxTYykuQmFsbEluZGV4ICsgMTtcclxuICAgICAgICBpZiAoaW5kZXggPD0gdGhpcy5iYWxsc1ByZWZhYi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY2MuZ2FtZS5lbWl0KCdnYW1lLWJhbGwtbGV2ZWx1cCcpO1xyXG5cclxuICAgICAgICAgICAgb3RoZXIuZ2V0Q29tcG9uZW50KGNjLlBoeXNpY3NDb2xsaWRlcikuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjYy50d2VlbihvdGhlcikudG8oMC4xNSwgeyB4OiB0YXJnZXQueCwgeTogdGFyZ2V0LnkgfSkucmVtb3ZlU2VsZigpXHJcbiAgICAgICAgICAgICAgICAuY2FsbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3QmFsbCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuYmFsbHNQcmVmYWJbaW5kZXggLSAxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3QmFsbC5wb3NpdGlvbiA9IHRhcmdldC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxzTGF5ZXIuYWRkQ2hpbGQobmV3QmFsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUZyb21QYXJlbnQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWZmID0gY2MuaW5zdGFudGlhdGUodGhpcy53YXRlckVmZmVjdFByZWZhYik7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmLnggPSBuZXdCYWxsLng7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmLnkgPSBuZXdCYWxsLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmLmNvbG9yID0gdGhpcy5iYWxsQ29sb3JzW2luZGV4IC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYWxsc0xheWVyLmFkZENoaWxkKGVmZik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IHRoaXMuYmFsbHNQcmVmYWIubGVuZ3RoICYmIHRoaXMuX3dpbm5lciA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl93aW5uZXIgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZmluZCgnQ2FudmFzL1dpblVJJykuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gdGFyZ2V0LmdldENvbXBvbmVudChCYWxsU2MpLkJhbGxJbmRleDtcclxuICAgICAgICAgICAgLy8g5a+56ZqP5py66IyD5Zu05L2c5omp5YWFXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJhbmRvbUFycmF5LmZpbmRJbmRleCgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PSBpbmRleCAtIDE7XHJcbiAgICAgICAgICAgIH0pIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5kb21BcnJheSA9IHRoaXMucmFuZG9tQXJyYXkuY29uY2F0KEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5yYW5kb21BcnJheSkpKS5zb3J0KChhLCBiKSA9PiB7IHJldHVybiBhIC0gYjsgfSk7XHJcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMucmFuZG9tQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5kb21BcnJheS5wdXNoKGluZGV4IC0gMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJhbGxDb2xvcnM6IGNjLkNvbG9yW10gPSBbXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiM4NjIyNzRcIiksXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiNmZjA5MjVcIiksXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiNmZjhlMWNcIiksXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiNmZmU2MTRcIiksXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiM2ZGU0MmVcIiksXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiNlNjE5MzNcIiksXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiNmYWIzNmRcIiksXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiNmZmUzNTBcIiksXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiNmZmZhZWFcIiksXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiNmYzdiOTdcIiksXHJcbiAgICAgICAgbmV3IGNjLkNvbG9yKCkuZnJvbUhFWChcIiM1MmQxMzVcIilcclxuICAgIF07XHJcblxyXG4gICAgdXBkYXRlKGR0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2dhbWVTdGF0ZSA9PSBHYW1lU3RhdGUuZ2FtaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IHRoaXMuYmFsbHNMYXllci5nZXRDb21wb25lbnRzSW5DaGlsZHJlbihCYWxsU2MpO1xyXG4gICAgICAgICAgICBsZXQgd2FybmluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgb3ZlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBiYWxsIG9mIGFycikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFiYWxsLmlzTm90Q2hlY2tPdmVyKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmIChiYWxsLm5vZGUueSA+PSB0aGlzLmRlYWRMaW5lLnkgLSBiYWxsLm5vZGUuaGVpZ2h0IC8gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHdhcm5pbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGJhbGwubm9kZS55ID49IHRoaXMuZGVhZExpbmUueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG92ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGVhZExpbmUuYWN0aXZlID0gd2FybmluZztcclxuICAgICAgICAgICAgaWYgKG92ZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2dhbWVTdGF0ZSA9IEdhbWVTdGF0ZS5vdmVyO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIE92ZXJcIik7XHJcbiAgICAgICAgICAgICAgICBjYy5maW5kKCdDYW52YXMvT3ZlclVJJykuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXBsYXkoKSB7XHJcbiAgICAgICAgY2MuZmluZCgnQ2FudmFzL092ZXJVSScpLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2dhbWVTdGF0ZSA9IEdhbWVTdGF0ZS5zdGFydDtcclxuICAgICAgICBjb25zdCBhcnIgPSB0aGlzLmJhbGxzTGF5ZXIuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oQmFsbFNjKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gYXJyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGNjLnR3ZWVuKGFycltpXS5ub2RlKS5kZWxheSgwLjEgKiBpKS5jYWxsKFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVmZiA9IGNjLmluc3RhbnRpYXRlKHRoaXMud2F0ZXJFZmZlY3RQcmVmYWIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVmZi54ID0gYXJyW2ldLm5vZGUueDtcclxuICAgICAgICAgICAgICAgICAgICBlZmYueSA9IGFycltpXS5ub2RlLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmLmNvbG9yID0gdGhpcy5iYWxsQ29sb3JzW2FycltpXS5CYWxsSW5kZXggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhbGxzTGF5ZXIuYWRkQ2hpbGQoZWZmKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKS5yZW1vdmVTZWxmKCkuc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2MudHdlZW4odGhpcykuZGVsYXkoYXJyLmxlbmd0aCAqIDAuMSlcclxuICAgICAgICAgICAgLmNhbGwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2FtZVN0YXRlID0gR2FtZVN0YXRlLmdhbWluZztcclxuICAgICAgICAgICAgICAgIC8qKiDmgaLlpI3liLDljp/lp4vnirbmgIEgKi9cclxuICAgICAgICAgICAgICAgIHRoaXMucmFuZG9tQXJyYXkgPSBbMCwgMCwgMCwgMCwgMSwgMSwgMiwgM107XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNyZWF0ZU5ld0JhbGwoKTtcclxuICAgICAgICAgICAgfSkuc3RhcnQoKTtcclxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLl93aW5uZXIgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZVdpbigpIHtcclxuICAgICAgICBjYy5maW5kKCdDYW52YXMvV2luVUknKS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICBHU2RrLmludGVyc3RpdGlhbC5zaG93KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==