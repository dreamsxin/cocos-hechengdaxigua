"use strict";
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