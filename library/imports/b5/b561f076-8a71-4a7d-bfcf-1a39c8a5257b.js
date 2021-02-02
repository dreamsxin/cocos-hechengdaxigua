"use strict";
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