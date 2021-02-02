
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