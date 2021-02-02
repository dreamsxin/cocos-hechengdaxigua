
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/Script/AudioManager');
require('./assets/Script/AutoRotationSc');
require('./assets/Script/BallSc');
require('./assets/Script/Component/BannerShow');
require('./assets/Script/GameSc');
require('./assets/Script/Modules/GSdk');
require('./assets/Script/WaterEffectSc');

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
//------QC-SOURCE-SPLIT------

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
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Modules/GSdk.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '2b3c4S7bu9CYYlRPXlWODVg', 'GSdk');
// Script/Modules/GSdk.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSdk = void 0;
var config = {
    ver: 'v1.0.1',
    gameid: 'hcdxg',
    adUnitId: 'adunit-0962db6f5f64227e',
    adUnitIdBanner: 'adunit-c657987ad0dd2c34',
    adUnitIdInterstitial: 'adunit-c83e928d371ea96f',
    serverHost: 'https://minigame.ucpopo.com/matrix/',
    shareData: {
        title: "有人@你 进来和我一起玩!",
        imageUrl: "http://cos.ucpopo.com/zqcgc/share_xigua.jpg"
        //imageUrl: 'res/share.png',
    },
};
var GSdk = /** @class */ (function () {
    function GSdk() {
        this.version = 'v1.0.1';
        this.isInit = false;
        this.user = {
            openid: null,
            sessid: null,
        };
        this.video = {
            isInit: false,
            errCode: false,
            isLoad: false,
            _video: null,
            cb: null,
            init: function () {
                var _this = this;
                this.isInit = true;
                this._video = window['wx'].createRewardedVideoAd({ adUnitId: config.adUnitId });
                // 监听激励视频广告加载事件
                this._video.onLoad(function () { _this.isLoad = true; });
                // 监听激励视频广告关闭事件
                this._video.onClose(function (res) {
                    if (res && res.isEnded || res === undefined) {
                        _this.cb && _this.cb(null, true);
                    }
                    else {
                        console.log('播放中途退出，不下发游戏奖励');
                        _this.cb && _this.cb(true, null);
                    }
                    _this.cb = null;
                });
                //监听激励视频错误事件
                this._video.onError(function (res) {
                    if (res.errCode >= 1004 && res.errCode <= 1008) {
                        _this.errCode = res.errCode;
                    }
                });
            },
            show: function (cb) {
                var _this = this;
                if (!window['wx']) {
                    cb && cb('不在微信环境下', null);
                    return;
                }
                if (!this.errCode) {
                    this._video.load()
                        .then(function () {
                        //this._hide();
                        _this.cb = cb;
                        _this._video.show();
                    })
                        .catch(function (res) {
                        //本次视频播放失败，更新可播放状态
                        _this._video.load();
                        if (res.errCode) {
                            cb && cb('暂无视频可看(' + res.errCode + ')', null);
                        }
                        else {
                            cb && cb('点太快了', null);
                        }
                    });
                }
                else {
                    cb && cb('暂无视频可看', null);
                }
            }
        };
        this.interstitial = {
            closeCb: null,
            item: null,
            create: function () {
                var _this = this;
                var item = window['wx'].createInterstitialAd({
                    adUnitId: config.adUnitIdInterstitial
                });
                item.onLoad(function () {
                    _this.item = item;
                    _this.item.onClose(function () {
                        _this.closeCb && _this.closeCb();
                        _this.create();
                    });
                });
            },
            show: function (cb) {
                this.closeCb = cb || null;
                this.item && this.item.show();
            }
        };
        this.storage = {
            _cache: {},
            set: function (key, value) {
                if (typeof key === 'string' && typeof value !== 'undefined') {
                    try {
                        var data = JSON.stringify(value);
                        cc.sys.localStorage.setItem(key, data);
                        // 设置缓存
                        this._cache[key] = data;
                        return true;
                    }
                    catch (err) {
                    }
                }
                else {
                    cc.error('error');
                }
                return false;
            },
            get: function (key) {
                // 先读取缓存
                if (typeof this._cache[key] !== 'undefined') {
                    return JSON.parse(this._cache[key]);
                }
                var result = null;
                try {
                    var data = cc.sys.localStorage.getItem(key);
                    if (data && typeof data === 'string') {
                        // 设置缓存
                        this._cache[key] = data;
                        result = JSON.parse(data);
                    }
                    else if (data !== '' && data !== null) {
                        result = undefined;
                    }
                }
                catch (e) {
                    result = undefined;
                }
                return result;
            },
            clear: function () {
                try {
                    cc.sys.localStorage.clear();
                    cc.js.clear(this._cache);
                    return true;
                }
                catch (err) {
                    return false;
                }
            }
        };
    }
    GSdk.prototype.init = function () {
        if (window['wx'] && !this.isInit) {
            console.log('GSdk init');
            this.isInit = true;
            // 初始化激励视频组件
            this.video.init();
            //this.banner.init();
            this.interstitial.create();
            this.onShareAppMessage();
            window['wx'].setKeepScreenOn({ keepScreenOn: true });
            this.updateNew();
        }
    };
    GSdk.prototype.updateNew = function () {
        if (window['wx']) {
            var updateManager_1 = window['wx'].getUpdateManager();
            updateManager_1.onUpdateReady(function () {
                updateManager_1.applyUpdate();
            });
        }
    };
    ;
    //监听用户点击右上角菜单的「转发」按钮时触发的事件
    GSdk.prototype.onShareAppMessage = function () {
        if (window['wx']) {
            var query_1 = 'shareid=' + this.user.openid;
            window['wx'].showShareMenu({
                withShareTicket: true
            });
            window['wx'].onShareAppMessage(function () { return ({
                title: config.shareData.title,
                imageUrl: config.shareData.imageUrl,
                query: query_1,
            }); });
        }
    };
    ;
    //主动拉起转发，进入选择通讯录界面。
    GSdk.prototype.shareAppMessage = function (params) {
        if (window['wx']) {
            if (!params) {
                params = {};
                params.title = config.shareData.title;
                params.imageUrl = config.shareData.imageUrl;
                params.query = 'shareid=' + this.user.openid;
            }
            window['wx'].shareAppMessage({
                title: params.title,
                imageUrl: params.imageUrl,
                query: params.query,
            });
        }
    };
    ;
    return GSdk;
}());
exports.GSdk = GSdk;
window['GSdk'] = new GSdk();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxNb2R1bGVzXFxHU2RrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUksTUFBTSxHQUFHO0lBQ1QsR0FBRyxFQUFFLFFBQVE7SUFDYixNQUFNLEVBQUUsT0FBTztJQUNmLFFBQVEsRUFBRSx5QkFBeUI7SUFDbkMsY0FBYyxFQUFFLHlCQUF5QjtJQUN6QyxvQkFBb0IsRUFBRSx5QkFBeUI7SUFDL0MsVUFBVSxFQUFFLHFDQUFxQztJQUNqRCxTQUFTLEVBQUU7UUFDUCxLQUFLLEVBQUUsZUFBZTtRQUN0QixRQUFRLEVBQUUsNkNBQTZDO1FBQ3ZELDRCQUE0QjtLQUMvQjtDQUNKLENBQUM7QUFFRjtJQUFBO1FBQ0ksWUFBTyxHQUFHLFFBQVEsQ0FBQztRQUNuQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsU0FBSSxHQUFHO1lBQ0gsTUFBTSxFQUFFLElBQUk7WUFDWixNQUFNLEVBQUUsSUFBSTtTQUNmLENBQUM7UUFvREYsVUFBSyxHQUFHO1lBQ0osTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU0sRUFBRSxLQUFLO1lBQ2IsTUFBTSxFQUFFLElBQUk7WUFDWixFQUFFLEVBQUUsSUFBSTtZQUNSLElBQUk7Z0JBQUosaUJBcUJDO2dCQXBCRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7Z0JBQ2hGLGVBQWU7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBUSxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxlQUFlO2dCQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxD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LE1BQU0sQ0FBQyxLQUFLLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ2hEO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQztnQkFDekIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO2dCQUNuQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7Z0JBQ3pCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSzthQUN0QixDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFBQSxDQUFDO0lBMkhOLFdBQUM7QUFBRCxDQXBMQSxBQW9MQyxJQUFBO0FBcExZLG9CQUFJO0FBNExqQixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjb25maWcgPSB7XHJcbiAgICB2ZXI6ICd2MS4wLjEnLFxyXG4gICAgZ2FtZWlkOiAnaGNkeGcnLCAvL+WQiOaIkOWkp+ilv+eTnFxyXG4gICAgYWRVbml0SWQ6ICdhZHVuaXQtMDk2MmRiNmY1ZjY0MjI3ZScsXHJcbiAgICBhZFVuaXRJZEJhbm5lcjogJ2FkdW5pdC1jNjU3OTg3YWQwZGQyYzM0JyxcclxuICAgIGFkVW5pdElkSW50ZXJzdGl0aWFsOiAnYWR1bml0LWM4M2U5MjhkMzcxZWE5NmYnLFxyXG4gICAgc2VydmVySG9zdDogJ2h0dHBzOi8vbWluaWdhbWUudWNwb3BvLmNvbS9tYXRyaXgvJyxcclxuICAgIHNoYXJlRGF0YToge1xyXG4gICAgICAgIHRpdGxlOiBcIuacieS6ukDkvaAg6L+b5p2l5ZKM5oiR5LiA6LW3546pIVwiLFxyXG4gICAgICAgIGltYWdlVXJsOiBcImh0dHA6Ly9jb3MudWNwb3BvLmNvbS96cWNnYy9zaGFyZV94aWd1YS5qcGdcIlxyXG4gICAgICAgIC8vaW1hZ2VVcmw6ICdyZXMvc2hhcmUucG5nJyxcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgR1NkayB7XHJcbiAgICB2ZXJzaW9uID0gJ3YxLjAuMSc7XHJcbiAgICBpc0luaXQgPSBmYWxzZTtcclxuICAgIHVzZXIgPSB7XHJcbiAgICAgICAgb3BlbmlkOiBudWxsLCAvL+eUqOaIt+eahG9wZW5pZFxyXG4gICAgICAgIHNlc3NpZDogbnVsbCwgLy/nlKjmiLfnmoRzZXNzaWRcclxuICAgIH07XHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIGlmICh3aW5kb3dbJ3d4J10gJiYgIXRoaXMuaXNJbml0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHU2RrIGluaXQnKTtcclxuICAgICAgICAgICAgdGhpcy5pc0luaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAvLyDliJ3lp4vljJbmv4DlirHop4bpopHnu4Tku7ZcclxuICAgICAgICAgICAgdGhpcy52aWRlby5pbml0KCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5iYW5uZXIuaW5pdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmludGVyc3RpdGlhbC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5vblNoYXJlQXBwTWVzc2FnZSgpO1xyXG4gICAgICAgICAgICB3aW5kb3dbJ3d4J10uc2V0S2VlcFNjcmVlbk9uKHsga2VlcFNjcmVlbk9uOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU5ldygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZU5ldygpIHtcclxuICAgICAgICBpZiAod2luZG93Wyd3eCddKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZU1hbmFnZXIgPSB3aW5kb3dbJ3d4J10uZ2V0VXBkYXRlTWFuYWdlcigpO1xyXG4gICAgICAgICAgICB1cGRhdGVNYW5hZ2VyLm9uVXBkYXRlUmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlTWFuYWdlci5hcHBseVVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy/nm5HlkKznlKjmiLfngrnlh7vlj7PkuIrop5Loj5zljZXnmoTjgIzovazlj5HjgI3mjInpkq7ml7bop6blj5HnmoTkuovku7ZcclxuICAgIG9uU2hhcmVBcHBNZXNzYWdlKCkge1xyXG4gICAgICAgIGlmICh3aW5kb3dbJ3d4J10pIHtcclxuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gJ3NoYXJlaWQ9JyArIHRoaXMudXNlci5vcGVuaWQ7XHJcbiAgICAgICAgICAgIHdpbmRvd1snd3gnXS5zaG93U2hhcmVNZW51KHtcclxuICAgICAgICAgICAgICAgIHdpdGhTaGFyZVRpY2tldDogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgd2luZG93Wyd3eCddLm9uU2hhcmVBcHBNZXNzYWdlKCgpID0+ICh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogY29uZmlnLnNoYXJlRGF0YS50aXRsZSxcclxuICAgICAgICAgICAgICAgIGltYWdlVXJsOiBjb25maWcuc2hhcmVEYXRhLmltYWdlVXJsLFxyXG4gICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8v5Li75Yqo5ouJ6LW36L2s5Y+R77yM6L+b5YWl6YCJ5oup6YCa6K6v5b2V55WM6Z2i44CCXHJcbiAgICBzaGFyZUFwcE1lc3NhZ2UocGFyYW1zKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvd1snd3gnXSkge1xyXG4gICAgICAgICAgICBpZiAoIXBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge307XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMudGl0bGUgPSBjb25maWcuc2hhcmVEYXRhLnRpdGxlO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLmltYWdlVXJsID0gY29uZmlnLnNoYXJlRGF0YS5pbWFnZVVybDtcclxuICAgICAgICAgICAgICAgIHBhcmFtcy5xdWVyeSA9ICdzaGFyZWlkPScgKyB0aGlzLnVzZXIub3BlbmlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdpbmRvd1snd3gnXS5zaGFyZUFwcE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IHBhcmFtcy50aXRsZSxcclxuICAgICAgICAgICAgICAgIGltYWdlVXJsOiBwYXJhbXMuaW1hZ2VVcmwsXHJcbiAgICAgICAgICAgICAgICBxdWVyeTogcGFyYW1zLnF1ZXJ5LFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmlkZW8gPSB7XHJcbiAgICAgICAgaXNJbml0OiBmYWxzZSxcclxuICAgICAgICBlcnJDb2RlOiBmYWxzZSxcclxuICAgICAgICBpc0xvYWQ6IGZhbHNlLCAvL+S7juW+ruS/oeaLieWPluS/oeaBr++8jOabtOaWsOaYr+WQpuWPr+eci+inhumikeeKtuaAgVxyXG4gICAgICAgIF92aWRlbzogbnVsbCxcclxuICAgICAgICBjYjogbnVsbCwgLy/mkq3mlL7lm57osINcclxuICAgICAgICBpbml0KCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzSW5pdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZGVvID0gd2luZG93Wyd3eCddLmNyZWF0ZVJld2FyZGVkVmlkZW9BZCh7IGFkVW5pdElkOiBjb25maWcuYWRVbml0SWQgfSk7XHJcbiAgICAgICAgICAgIC8vIOebkeWQrOa/gOWKseinhumikeW5v+WRiuWKoOi9veS6i+S7tlxyXG4gICAgICAgICAgICB0aGlzLl92aWRlby5vbkxvYWQoKCkgPT4geyB0aGlzLmlzTG9hZCA9IHRydWU7IH0pO1xyXG4gICAgICAgICAgICAvLyDnm5HlkKzmv4DlirHop4bpopHlub/lkYrlhbPpl63kuovku7ZcclxuICAgICAgICAgICAgdGhpcy5fdmlkZW8ub25DbG9zZShyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuaXNFbmRlZCB8fCByZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2IgJiYgdGhpcy5jYihudWxsLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+aSreaUvuS4remAlOmAgOWHuu+8jOS4jeS4i+WPkea4uOaIj+WlluWKsScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2IgJiYgdGhpcy5jYih0cnVlLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY2IgPSBudWxsO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy/nm5HlkKzmv4DlirHop4bpopHplJnor6/kuovku7ZcclxuICAgICAgICAgICAgdGhpcy5fdmlkZW8ub25FcnJvcigocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLmVyckNvZGUgPj0gMTAwNCAmJiByZXMuZXJyQ29kZSA8PSAxMDA4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJDb2RlID0gcmVzLmVyckNvZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2hvdyhjYikge1xyXG4gICAgICAgICAgICBpZiAoIXdpbmRvd1snd3gnXSkge1xyXG4gICAgICAgICAgICAgICAgY2IgJiYgY2IoJ+S4jeWcqOW+ruS/oeeOr+Wig+S4iycsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5lcnJDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92aWRlby5sb2FkKClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5faGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNiID0gY2I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZGVvLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgocmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5pys5qyh6KeG6aKR5pKt5pS+5aSx6LSl77yM5pu05paw5Y+v5pKt5pS+54q25oCBXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZGVvLmxvYWQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5lcnJDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYiAmJiBjYign5pqC5peg6KeG6aKR5Y+v55yLKCcgKyByZXMuZXJyQ29kZSArICcpJywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYiAmJiBjYign54K55aSq5b+r5LqGJywgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNiICYmIGNiKCfmmoLml6Dop4bpopHlj6/nnIsnLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBpbnRlcnN0aXRpYWwgPSB7XHJcbiAgICAgICAgY2xvc2VDYjogbnVsbCwgLy/lhbPpl63lm57osINcclxuICAgICAgICBpdGVtOiBudWxsLFxyXG4gICAgICAgIGNyZWF0ZSgpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB3aW5kb3dbJ3d4J10uY3JlYXRlSW50ZXJzdGl0aWFsQWQoe1xyXG4gICAgICAgICAgICAgICAgYWRVbml0SWQ6IGNvbmZpZy5hZFVuaXRJZEludGVyc3RpdGlhbFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaXRlbS5vbkxvYWQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbS5vbkNsb3NlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlQ2IgJiYgdGhpcy5jbG9zZUNiKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNob3coY2I/KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2VDYiA9IGNiIHx8IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbSAmJiB0aGlzLml0ZW0uc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBzdG9yYWdlID0ge1xyXG4gICAgICAgIF9jYWNoZToge30sXHJcbiAgICAgICAgc2V0KGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6K6+572u57yT5a2YXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVba2V5XSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYy5lcnJvcignZXJyb3InKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXQoa2V5KSB7XHJcbiAgICAgICAgICAgIC8vIOWFiOivu+WPlue8k+WtmFxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2NhY2hlW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLl9jYWNoZVtrZXldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7nvJPlrZhcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZVtrZXldID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhICE9PSAnJyAmJiBkYXRhICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsZWFyKCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY2Muc3lzLmxvY2FsU3RvcmFnZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgY2MuanMuY2xlYXIodGhpcy5fY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG4vKirmmrTpnLLlhajlsYDmj5DnpLogKi9cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgLyoqXHJcbiAgICAgKiDop4bpopHlub/lkYrmqKHlnZdcclxuICAgICAqL1xyXG4gICAgY29uc3QgR1NkazogR1NkaztcclxufVxyXG53aW5kb3dbJ0dTZGsnXSA9IG5ldyBHU2RrKCk7Il19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/BallSc.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '78865+Mpe5EM6BE/wT+qO8t', 'BallSc');
// src/BallSc.ts

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
var GameSc_1 = require("./GameSc");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BallSc = /** @class */ (function (_super) {
    __extends(BallSc, _super);
    function BallSc() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.BallIndex = 1;
        /** 不要用它检查是否结束游戏 */
        _this.isNotCheckOver = false;
        /** 是不是丢出去的,影响声音处理 */
        _this.isDrop = false;
        return _this;
    }
    BallSc_1 = BallSc;
    BallSc.prototype.start = function () {
        this.getComponent(cc.PhysicsCollider).restitution = 0.1;
    };
    BallSc.prototype.onBeginContact = function (contact, selfCollider, otherCollider) {
        if (otherCollider.getComponent(BallSc_1)) {
            this.isNotCheckOver = true;
            if (otherCollider.getComponent(BallSc_1).BallIndex == selfCollider.getComponent(BallSc_1).BallIndex) {
                // 看看是不是球
                var target = selfCollider;
                var other = otherCollider;
                if (otherCollider.node.y <= selfCollider.node.y) {
                    target = otherCollider;
                    other = selfCollider;
                }
                if (cc.find('Canvas/GameSc').getComponent(GameSc_1.default).BallLevelUp(target.node, other.node)) {
                    other.node.removeComponent(BallSc_1);
                }
            }
        }
        else if (!this.isDrop) {
            //仅响一次
            this.isDrop = true;
            cc.game.emit('game-ball-drop');
        }
    };
    var BallSc_1;
    __decorate([
        property
    ], BallSc.prototype, "BallIndex", void 0);
    BallSc = BallSc_1 = __decorate([
        ccclass
    ], BallSc);
    return BallSc;
}(cc.Component));
exports.default = BallSc;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc3JjXFxCYWxsU2MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsbUNBQThCO0FBRXhCLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBRzVDO0lBQW9DLDBCQUFZO0lBQWhEO1FBQUEscUVBaUNDO1FBOUJHLGVBQVMsR0FBVyxDQUFDLENBQUM7UUFDdEIsbUJBQW1CO1FBQ25CLG9CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLHFCQUFxQjtRQUNyQixZQUFNLEdBQUcsS0FBSyxDQUFDOztJQTBCbkIsQ0FBQztlQWpDb0IsTUFBTTtJQVF2QixzQkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztJQUM1RCxDQUFDO0lBRUQsK0JBQWMsR0FBZCxVQUFlLE9BQU8sRUFBRSxZQUFnQyxFQUFFLGFBQWlDO1FBQ3ZGLElBQUksYUFBYSxDQUFDLFlBQVksQ0FBQyxRQUFNLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztZQUMzQixJQUFJLGFBQWEsQ0FBQyxZQUFZLENBQUMsUUFBTSxDQUFDLENBQUMsU0FBUyxJQUFJLFlBQVksQ0FBQyxZQUFZLENBQUMsUUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFO2dCQUM3RixTQUFTO2dCQUNULElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQztnQkFDMUIsSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDO2dCQUMxQixJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO29CQUM3QyxNQUFNLEdBQUcsYUFBYSxDQUFDO29CQUN2QixLQUFLLEdBQUcsWUFBWSxDQUFDO2lCQUN4QjtnQkFDRCxJQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsWUFBWSxDQUFDLGdCQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUM7b0JBQ2xGLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQU0sQ0FBQyxDQUFDO2lCQUN0QzthQUNKO1NBQ0o7YUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNyQixNQUFNO1lBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbkIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNsQztJQUNMLENBQUM7O0lBN0JEO1FBREMsUUFBUTs2Q0FDYTtJQUhMLE1BQU07UUFEMUIsT0FBTztPQUNhLE1BQU0sQ0FpQzFCO0lBQUQsYUFBQztDQWpDRCxBQWlDQyxDQWpDbUMsRUFBRSxDQUFDLFNBQVMsR0FpQy9DO2tCQWpDb0IsTUFBTSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgR2FtZVNjIGZyb20gXCIuL0dhbWVTY1wiO1xyXG5cclxuY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhbGxTYyBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcblxyXG4gICAgQHByb3BlcnR5XHJcbiAgICBCYWxsSW5kZXg6IG51bWJlciA9IDE7XHJcbiAgICAvKiog5LiN6KaB55So5a6D5qOA5p+l5piv5ZCm57uT5p2f5ri45oiPICovXHJcbiAgICBpc05vdENoZWNrT3ZlciA9IGZhbHNlO1xyXG4gICAgLyoqIOaYr+S4jeaYr+S4ouWHuuWOu+eahCzlvbHlk43lo7Dpn7PlpITnkIYgKi9cclxuICAgIGlzRHJvcCA9IGZhbHNlO1xyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuUGh5c2ljc0NvbGxpZGVyKS5yZXN0aXR1dGlvbiA9IDAuMTsgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uQmVnaW5Db250YWN0KGNvbnRhY3QsIHNlbGZDb2xsaWRlcjogY2MuUGh5c2ljc0NvbGxpZGVyLCBvdGhlckNvbGxpZGVyOiBjYy5QaHlzaWNzQ29sbGlkZXIpIHtcclxuICAgICAgICBpZiAob3RoZXJDb2xsaWRlci5nZXRDb21wb25lbnQoQmFsbFNjKSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzTm90Q2hlY2tPdmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKG90aGVyQ29sbGlkZXIuZ2V0Q29tcG9uZW50KEJhbGxTYykuQmFsbEluZGV4ID09IHNlbGZDb2xsaWRlci5nZXRDb21wb25lbnQoQmFsbFNjKS5CYWxsSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIC8vIOeci+eci+aYr+S4jeaYr+eQg1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldCA9IHNlbGZDb2xsaWRlcjtcclxuICAgICAgICAgICAgICAgIGxldCBvdGhlciA9IG90aGVyQ29sbGlkZXI7XHJcbiAgICAgICAgICAgICAgICBpZiAob3RoZXJDb2xsaWRlci5ub2RlLnkgPD0gc2VsZkNvbGxpZGVyLm5vZGUueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IG90aGVyQ29sbGlkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgb3RoZXIgPSBzZWxmQ29sbGlkZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihjYy5maW5kKCdDYW52YXMvR2FtZVNjJykuZ2V0Q29tcG9uZW50KEdhbWVTYykuQmFsbExldmVsVXAodGFyZ2V0Lm5vZGUsIG90aGVyLm5vZGUpKXtcclxuICAgICAgICAgICAgICAgICAgICBvdGhlci5ub2RlLnJlbW92ZUNvbXBvbmVudChCYWxsU2MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc0Ryb3ApIHtcclxuICAgICAgICAgICAgLy/ku4Xlk43kuIDmrKFcclxuICAgICAgICAgICAgdGhpcy5pc0Ryb3AgPSB0cnVlO1xyXG4gICAgICAgICAgICBjYy5nYW1lLmVtaXQoJ2dhbWUtYmFsbC1kcm9wJyk7ICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/AutoRotationSc.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f8cc9TbhXtP8KO4rqgN1AO4', 'AutoRotationSc');
// src/AutoRotationSc.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AutoRotationSc = /** @class */ (function (_super) {
    __extends(AutoRotationSc, _super);
    function AutoRotationSc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AutoRotationSc.prototype.update = function (dt) {
        this.node.angle += dt * 100;
    };
    AutoRotationSc = __decorate([
        ccclass
    ], AutoRotationSc);
    return AutoRotationSc;
}(cc.Component));
exports.default = AutoRotationSc;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc3JjXFxBdXRvUm90YXRpb25TYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDTSxJQUFBLEtBQXNCLEVBQUUsQ0FBQyxVQUFVLEVBQWxDLE9BQU8sYUFBQSxFQUFFLFFBQVEsY0FBaUIsQ0FBQztBQUcxQztJQUE0QyxrQ0FBWTtJQUF4RDs7SUFJQSxDQUFDO0lBSEcsK0JBQU0sR0FBTixVQUFRLEVBQUU7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ2hDLENBQUM7SUFIZ0IsY0FBYztRQURsQyxPQUFPO09BQ2EsY0FBYyxDQUlsQztJQUFELHFCQUFDO0NBSkQsQUFJQyxDQUoyQyxFQUFFLENBQUMsU0FBUyxHQUl2RDtrQkFKb0IsY0FBYyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5jb25zdCB7Y2NjbGFzcywgcHJvcGVydHl9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEF1dG9Sb3RhdGlvblNjIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuICAgIHVwZGF0ZSAoZHQpIHtcclxuICAgICAgICB0aGlzLm5vZGUuYW5nbGUgKz0gZHQgKiAxMDA7XHJcbiAgICB9XHJcbn1cclxuIl19
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/WaterEffectSc.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'cd5d8rJ+QRIdpg05zYhfmq5', 'WaterEffectSc');
// Script/WaterEffectSc.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var WaterEffectSc = /** @class */ (function (_super) {
    __extends(WaterEffectSc, _super);
    function WaterEffectSc() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WaterEffectSc.prototype.start = function () {
        this.node.scale = 0;
        cc.tween(this.node)
            .to(0.15, { scale: 1 }, { easing: cc.easeBackOut().easing })
            .delay(0.3)
            .to(0.3, { opacity: 0 })
            .removeSelf()
            .start();
        this.node.angle = Math.random() * 360;
    };
    WaterEffectSc = __decorate([
        ccclass
    ], WaterEffectSc);
    return WaterEffectSc;
}(cc.Component));
exports.default = WaterEffectSc;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxXYXRlckVmZmVjdFNjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNNLElBQUEsS0FBd0IsRUFBRSxDQUFDLFVBQVUsRUFBbkMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFrQixDQUFDO0FBRzVDO0lBQTJDLGlDQUFZO0lBQXZEOztJQVlBLENBQUM7SUFWRyw2QkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNkLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzNELEtBQUssQ0FBQyxHQUFHLENBQUM7YUFDVixFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ3ZCLFVBQVUsRUFBRTthQUNaLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUMxQyxDQUFDO0lBWGdCLGFBQWE7UUFEakMsT0FBTztPQUNhLGFBQWEsQ0FZakM7SUFBRCxvQkFBQztDQVpELEFBWUMsQ0FaMEMsRUFBRSxDQUFDLFNBQVMsR0FZdEQ7a0JBWm9CLGFBQWEiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY29uc3QgeyBjY2NsYXNzLCBwcm9wZXJ0eSB9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdGVyRWZmZWN0U2MgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5zY2FsZSA9IDA7XHJcbiAgICAgICAgY2MudHdlZW4odGhpcy5ub2RlKVxyXG4gICAgICAgICAgICAudG8oMC4xNSwgeyBzY2FsZTogMSB9LCB7IGVhc2luZzogY2MuZWFzZUJhY2tPdXQoKS5lYXNpbmcgfSlcclxuICAgICAgICAgICAgLmRlbGF5KDAuMylcclxuICAgICAgICAgICAgLnRvKDAuMywgeyBvcGFjaXR5OiAwIH0pXHJcbiAgICAgICAgICAgIC5yZW1vdmVTZWxmKClcclxuICAgICAgICAgICAgLnN0YXJ0KCk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmFuZ2xlID0gTWF0aC5yYW5kb20oKSAqIDM2MDtcclxuICAgIH1cclxufVxyXG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/AudioManager.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b561fB2inFKfb/PGjnIpSV7', 'AudioManager');
// Script/AudioManager.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AutoManager = /** @class */ (function (_super) {
    __extends(AutoManager, _super);
    function AutoManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dropClip = null;
        _this.leveUpClip = null;
        return _this;
        // update (dt) {}
    }
    AutoManager.prototype.start = function () {
        var _this = this;
        cc.game.on('game-ball-drop', function () {
            cc.audioEngine.playEffect(_this.dropClip, false);
        });
        cc.game.on('game-ball-levelup', function () {
            cc.audioEngine.playEffect(_this.leveUpClip, false);
        });
    };
    __decorate([
        property({ type: cc.AudioClip })
    ], AutoManager.prototype, "dropClip", void 0);
    __decorate([
        property({ type: cc.AudioClip })
    ], AutoManager.prototype, "leveUpClip", void 0);
    AutoManager = __decorate([
        ccclass
    ], AutoManager);
    return AutoManager;
}(cc.Component));
exports.default = AutoManager;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxBdWRpb01hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ00sSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFHNUM7SUFBeUMsK0JBQVk7SUFBckQ7UUFBQSxxRUFpQkM7UUFkRyxjQUFRLEdBQWlCLElBQUksQ0FBQztRQUU5QixnQkFBVSxHQUFpQixJQUFJLENBQUM7O1FBV2hDLGlCQUFpQjtJQUNyQixDQUFDO0lBWEcsMkJBQUssR0FBTDtRQUFBLGlCQVFDO1FBUEcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBWEQ7UUFEQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO2lEQUNIO0lBRTlCO1FBREMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQzttREFDRDtJQUxmLFdBQVc7UUFEL0IsT0FBTztPQUNhLFdBQVcsQ0FpQi9CO0lBQUQsa0JBQUM7Q0FqQkQsQUFpQkMsQ0FqQndDLEVBQUUsQ0FBQyxTQUFTLEdBaUJwRDtrQkFqQm9CLFdBQVciLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJcbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvTWFuYWdlciBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG5cbiAgICBAcHJvcGVydHkoeyB0eXBlOiBjYy5BdWRpb0NsaXAgfSlcbiAgICBkcm9wQ2xpcDogY2MuQXVkaW9DbGlwID0gbnVsbDtcbiAgICBAcHJvcGVydHkoeyB0eXBlOiBjYy5BdWRpb0NsaXAgfSlcbiAgICBsZXZlVXBDbGlwOiBjYy5BdWRpb0NsaXAgPSBudWxsO1xuICAgIHN0YXJ0KCkge1xuICAgICAgICBjYy5nYW1lLm9uKCdnYW1lLWJhbGwtZHJvcCcsICgpID0+IHtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5kcm9wQ2xpcCwgZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjYy5nYW1lLm9uKCdnYW1lLWJhbGwtbGV2ZWx1cCcsICgpID0+IHtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5sZXZlVXBDbGlwLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9XG59XG4iXX0=
//------QC-SOURCE-SPLIT------

                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/Script/Component/BannerShow.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'b2b34asKT9JzpGBiZ8RItlI', 'BannerShow');
// Script/Component/BannerShow.ts

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
var EChannel = cc.Enum({
    'NONE': 0,
    'wx': 1,
});
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BannerShow = /** @class */ (function (_super) {
    __extends(BannerShow, _super);
    function BannerShow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.channel = 'wx';
        _this.adUnitIdBanner = null;
        _this.updateTime = null;
        _this._instance = null;
        _this.noBanner = false;
        _this._bannerAd = null; //banner缓存池
        _this._poolMax = 10;
        _this._pool = [];
        _this.setBannerStyle = function (ad) {
            var btnRect = this.node.getBoundingBoxToWorld();
            var anchorX = this.node.anchorX;
            var anchorY = this.node.anchorY;
            var frameSize = cc.view.getFrameSize(); // 屏幕尺寸
            var winSize = cc.winSize; // 实际分辨率
            var nodeX = btnRect.xMin + anchorX * btnRect.width;
            var nodeY = btnRect.yMin + anchorY * btnRect.height;
            var bannerHeight = ad.style.realHeight;
            var bannerWidth = ad.style.realWidth;
            var x = nodeX / winSize.width * frameSize.width;
            var y = (winSize.height - nodeY) / winSize.height * frameSize.height;
            var left = x - bannerWidth * anchorX;
            var top = y - bannerHeight * (1 - anchorY);
            ad.style.left = left;
            ad.style.top = top;
        };
        return _this;
    }
    BannerShow.prototype.onLoad = function () {
        if (window[this.channel] && this.adUnitIdBanner) {
            this.bannerCreator();
        }
    };
    BannerShow.prototype.onEnable = function () {
        if (window[this.channel] && this.adUnitIdBanner) {
            this.bannerShow();
            this.bannerCreator();
        }
    };
    BannerShow.prototype.onDisable = function () {
        if (window[this.channel] && this.adUnitIdBanner) {
            this.bannerHide();
        }
    };
    BannerShow.prototype.bannerCreator = function () {
        var _this = this;
        if (this._pool.length > this._poolMax) {
            return;
        }
        var banner = window[this.channel].createBannerAd({ adUnitId: this.adUnitIdBanner, style: { left: 0, top: 0, width: 300, } });
        banner.onError(function (res) {
            console.log('[banner] onError', res);
            _this.noBanner = true;
        });
        banner.onLoad(function () {
            _this._pool.unshift(banner); //添加到数组的第一个
            if (_this.node.active && !_this._bannerAd) {
                _this.bannerShow();
            }
        });
    };
    BannerShow.prototype.bannerShow = function () {
        this.bannerHide();
        if (this._pool.length > 0) {
            this._bannerAd = this._pool.shift();
            this.setBannerStyle(this._bannerAd);
            this._bannerAd.show();
        }
    };
    BannerShow.prototype.bannerHide = function () {
        if (this._bannerAd) {
            this._bannerAd.hide();
            this._pool.push(this._bannerAd);
            this._bannerAd = null;
        }
    };
    __decorate([
        property({ displayName: '渠道' })
    ], BannerShow.prototype, "channel", void 0);
    __decorate([
        property
    ], BannerShow.prototype, "adUnitIdBanner", void 0);
    __decorate([
        property
    ], BannerShow.prototype, "updateTime", void 0);
    BannerShow = __decorate([
        ccclass
    ], BannerShow);
    return BannerShow;
}(cc.Component));
exports.default = BannerShow;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcU2NyaXB0XFxDb21wb25lbnRcXEJhbm5lclNob3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztJQUNuQixNQUFNLEVBQUUsQ0FBQztJQUNULElBQUksRUFBRSxDQUFDO0NBQ1YsQ0FBQyxDQUFDO0FBQ0csSUFBQSxLQUF3QixFQUFFLENBQUMsVUFBVSxFQUFuQyxPQUFPLGFBQUEsRUFBRSxRQUFRLGNBQWtCLENBQUM7QUFHNUM7SUFBd0MsOEJBQVk7SUFBcEQ7UUFBQSxxRUFtRkM7UUFoRkcsYUFBTyxHQUFXLElBQUksQ0FBQztRQUV2QixvQkFBYyxHQUFXLElBQUksQ0FBQztRQUU5QixnQkFBVSxHQUFXLElBQUksQ0FBQztRQUVsQixlQUFTLEdBQVEsSUFBSSxDQUFDO1FBQ3RCLGNBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsZUFBUyxHQUFRLElBQUksQ0FBQyxDQUFDLFdBQVc7UUFDbEMsY0FBUSxHQUFXLEVBQUUsQ0FBQztRQUN0QixXQUFLLEdBQVUsRUFBRSxDQUFDO1FBcUQxQixvQkFBYyxHQUFHLFVBQVUsRUFBTztZQUM5QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDaEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDaEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDaEMsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFBLE9BQU87WUFDOUMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFBLFFBQVE7WUFDakMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLEdB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R0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRUQsK0JBQVUsR0FBVjtRQUNJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUN6QjtJQUNMLENBQUM7SUE3REQ7UUFEQyxRQUFRLENBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUM7K0NBQ1Q7SUFFdkI7UUFEQyxRQUFRO3NEQUNxQjtJQUU5QjtRQURDLFFBQVE7a0RBQ2lCO0lBUFQsVUFBVTtRQUQ5QixPQUFPO09BQ2EsVUFBVSxDQW1GOUI7SUFBRCxpQkFBQztDQW5GRCxBQW1GQyxDQW5GdUMsRUFBRSxDQUFDLFNBQVMsR0FtRm5EO2tCQW5Gb0IsVUFBVSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbInZhciBFQ2hhbm5lbCA9IGNjLkVudW0oe1xyXG4gICAgJ05PTkUnOiAwLFxyXG4gICAgJ3d4JzogMSxcclxufSk7XHJcbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5AY2NjbGFzc1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYW5uZXJTaG93IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuXHJcbiAgICBAcHJvcGVydHkoeyBkaXNwbGF5TmFtZTogJ+a4oOmBkycgfSlcclxuICAgIGNoYW5uZWw6IHN0cmluZyA9ICd3eCc7XHJcbiAgICBAcHJvcGVydHlcclxuICAgIGFkVW5pdElkQmFubmVyOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgQHByb3BlcnR5XHJcbiAgICB1cGRhdGVUaW1lOiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgX2luc3RhbmNlOiBhbnkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBub0Jhbm5lcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfYmFubmVyQWQ6IGFueSA9IG51bGw7IC8vYmFubmVy57yT5a2Y5rGgXHJcbiAgICBwcml2YXRlIF9wb29sTWF4OiBudW1iZXIgPSAxMDtcclxuICAgIHByaXZhdGUgX3Bvb2w6IGFueVtdID0gW107XHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvd1t0aGlzLmNoYW5uZWxdICYmIHRoaXMuYWRVbml0SWRCYW5uZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5iYW5uZXJDcmVhdG9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlKCkge1xyXG4gICAgICAgIGlmICh3aW5kb3dbdGhpcy5jaGFubmVsXSAmJiB0aGlzLmFkVW5pdElkQmFubmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmFubmVyU2hvdygpO1xyXG4gICAgICAgICAgICB0aGlzLmJhbm5lckNyZWF0b3IoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkRpc2FibGUoKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvd1t0aGlzLmNoYW5uZWxdICYmIHRoaXMuYWRVbml0SWRCYW5uZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5iYW5uZXJIaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGJhbm5lckNyZWF0b3IoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Bvb2wubGVuZ3RoID4gdGhpcy5fcG9vbE1heCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBiYW5uZXIgPSB3aW5kb3dbdGhpcy5jaGFubmVsXS5jcmVhdGVCYW5uZXJBZCh7IGFkVW5pdElkOiB0aGlzLmFkVW5pdElkQmFubmVyLCBzdHlsZTogeyBsZWZ0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDAsIH0gfSk7XHJcbiAgICAgICAgYmFubmVyLm9uRXJyb3IoKHJlcykgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW2Jhbm5lcl0gb25FcnJvcicsIHJlcyk7XHJcbiAgICAgICAgICAgIHRoaXMubm9CYW5uZXIgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJhbm5lci5vbkxvYWQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9wb29sLnVuc2hpZnQoYmFubmVyKTsvL+a3u+WKoOWIsOaVsOe7hOeahOesrOS4gOS4qlxyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLmFjdGl2ZSAmJiAhdGhpcy5fYmFubmVyQWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmFubmVyU2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYmFubmVyU2hvdygpIHtcclxuICAgICAgICB0aGlzLmJhbm5lckhpZGUoKTtcclxuICAgICAgICBpZiAodGhpcy5fcG9vbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhbm5lckFkID0gdGhpcy5fcG9vbC5zaGlmdCgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEJhbm5lclN0eWxlKHRoaXMuX2Jhbm5lckFkKTtcclxuICAgICAgICAgICAgdGhpcy5fYmFubmVyQWQuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBiYW5uZXJIaWRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9iYW5uZXJBZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9iYW5uZXJBZC5oaWRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Bvb2wucHVzaCh0aGlzLl9iYW5uZXJBZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhbm5lckFkID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QmFubmVyU3R5bGUgPSBmdW5jdGlvbiAoYWQ6IGFueSkge1xyXG4gICAgICAgIHZhciBidG5SZWN0ID0gdGhpcy5ub2RlLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xyXG4gICAgICAgIHZhciBhbmNob3JYID0gdGhpcy5ub2RlLmFuY2hvclg7XHJcbiAgICAgICAgdmFyIGFuY2hvclkgPSB0aGlzLm5vZGUuYW5jaG9yWTtcclxuICAgICAgICBsZXQgZnJhbWVTaXplID0gY2Mudmlldy5nZXRGcmFtZVNpemUoKTsvLyDlsY/luZXlsLrlr7hcclxuICAgICAgICBsZXQgd2luU2l6ZSA9IGNjLndpblNpemU7Ly8g5a6e6ZmF5YiG6L6o546HXHJcbiAgICAgICAgbGV0IG5vZGVYID0gYnRuUmVjdC54TWluICsgYW5jaG9yWCAqIGJ0blJlY3Qud2lkdGg7XHJcbiAgICAgICAgbGV0IG5vZGVZID0gYnRuUmVjdC55TWluICsgYW5jaG9yWSAqIGJ0blJlY3QuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBiYW5uZXJIZWlnaHQgPSBhZC5zdHlsZS5yZWFsSGVpZ2h0O1xyXG4gICAgICAgIGxldCBiYW5uZXJXaWR0aCA9IGFkLnN0eWxlLnJlYWxXaWR0aDtcclxuICAgICAgICBsZXQgeCA9IG5vZGVYIC8gd2luU2l6ZS53aWR0aCAqIGZyYW1lU2l6ZS53aWR0aDtcclxuICAgICAgICBsZXQgeSA9ICh3aW5TaXplLmhlaWdodCAtIG5vZGVZKSAvIHdpblNpemUuaGVpZ2h0ICogZnJhbWVTaXplLmhlaWdodDtcclxuICAgICAgICBsZXQgbGVmdCA9IHggLSBiYW5uZXJXaWR0aCAqIGFuY2hvclg7XHJcbiAgICAgICAgbGV0IHRvcCA9IHkgLSBiYW5uZXJIZWlnaHQgKiAoMSAtIGFuY2hvclkpO1xyXG4gICAgICAgIGFkLnN0eWxlLmxlZnQgPSBsZWZ0O1xyXG4gICAgICAgIGFkLnN0eWxlLnRvcCA9IHRvcDtcclxuICAgIH07XHJcbn0iXX0=
//------QC-SOURCE-SPLIT------
