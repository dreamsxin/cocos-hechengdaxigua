window.__require=function t(e,n,o){function r(c,a){if(!n[c]){if(!e[c]){var l=c.split("/");if(l=l[l.length-1],!e[l]){var s="function"==typeof __require&&__require;if(!a&&s)return s(l,!0);if(i)return i(l,!0);throw new Error("Cannot find module '"+c+"'")}c=l}var d=n[c]={exports:{}};e[c][0].call(d.exports,function(t){return r(e[c][1][t]||t)},d,d.exports,t,e,n,o)}return n[c].exports}for(var i="function"==typeof __require&&__require,c=0;c<o.length;c++)r(o[c]);return r}({AudioManager:[function(t,e,n){"use strict";cc._RF.push(e,"b561fB2inFKfb/PGjnIpSV7","AudioManager");var o=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),r=this&&this.__decorate||function(t,e,n,o){var r,i=arguments.length,c=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,n,o);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(c=(i<3?r(c):i>3?r(e,n,c):r(e,n))||c);return i>3&&c&&Object.defineProperty(e,n,c),c};Object.defineProperty(n,"__esModule",{value:!0});var i=cc._decorator,c=i.ccclass,a=i.property,l=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.dropClip=null,e.leveUpClip=null,e.bannerNode=null,e}return o(e,t),e.prototype.start=function(){var t=this;cc.game.on("game-ball-drop",function(){cc.audioEngine.playEffect(t.dropClip,!1),t.bannerNode.active=!1,t.bannerNode.active=!0}),cc.game.on("game-ball-levelup",function(){cc.audioEngine.playEffect(t.leveUpClip,!1)})},r([a({type:cc.AudioClip})],e.prototype,"dropClip",void 0),r([a({type:cc.AudioClip})],e.prototype,"leveUpClip",void 0),r([a(cc.Node)],e.prototype,"bannerNode",void 0),e=r([c],e)}(cc.Component);n.default=l,cc._RF.pop()},{}],AutoRotationSc:[function(t,e,n){"use strict";cc._RF.push(e,"f8cc9TbhXtP8KO4rqgN1AO4","AutoRotationSc");var o=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),r=this&&this.__decorate||function(t,e,n,o){var r,i=arguments.length,c=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,n,o);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(c=(i<3?r(c):i>3?r(e,n,c):r(e,n))||c);return i>3&&c&&Object.defineProperty(e,n,c),c};Object.defineProperty(n,"__esModule",{value:!0});var i=cc._decorator,c=i.ccclass,a=(i.property,function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.update=function(t){this.node.angle+=100*t},e=r([c],e)}(cc.Component));n.default=a,cc._RF.pop()},{}],BallSc:[function(t,e,n){"use strict";cc._RF.push(e,"78865+Mpe5EM6BE/wT+qO8t","BallSc");var o=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),r=this&&this.__decorate||function(t,e,n,o){var r,i=arguments.length,c=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,n,o);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(c=(i<3?r(c):i>3?r(e,n,c):r(e,n))||c);return i>3&&c&&Object.defineProperty(e,n,c),c};Object.defineProperty(n,"__esModule",{value:!0});var i=t("./GameSc"),c=cc._decorator,a=c.ccclass,l=c.property,s=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.BallIndex=1,e.isNotCheckOver=!1,e.isDrop=!1,e}var n;return o(e,t),n=e,e.prototype.start=function(){this.getComponent(cc.PhysicsCollider).restitution=.1},e.prototype.onBeginContact=function(t,e,o){if(o.getComponent(n)){if(this.isNotCheckOver=!0,o.getComponent(n).BallIndex==e.getComponent(n).BallIndex){var r=e,c=o;o.node.y<=e.node.y&&(r=o,c=e),cc.find("Canvas/GameSc").getComponent(i.default).BallLevelUp(r.node,c.node)&&c.node.removeComponent(n)}}else this.isDrop||(this.isDrop=!0,cc.game.emit("game-ball-drop"))},r([l],e.prototype,"BallIndex",void 0),e=n=r([a],e)}(cc.Component);n.default=s,cc._RF.pop()},{"./GameSc":"GameSc"}],BannerShow:[function(t,e,n){"use strict";cc._RF.push(e,"b2b34asKT9JzpGBiZ8RItlI","BannerShow");var o=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),r=this&&this.__decorate||function(t,e,n,o){var r,i=arguments.length,c=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,n,o);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(c=(i<3?r(c):i>3?r(e,n,c):r(e,n))||c);return i>3&&c&&Object.defineProperty(e,n,c),c};Object.defineProperty(n,"__esModule",{value:!0});cc.Enum({NONE:0,wx:1});var i=cc._decorator,c=i.ccclass,a=i.property,l=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.channel="wx",e.adUnitIdBanner=null,e._instance=null,e.noBanner=!1,e._bannerAd=null,e._poolMax=10,e._pool=[],e.setBannerStyle=function(t){var e=this.node.getBoundingBoxToWorld(),n=this.node.anchorX,o=this.node.anchorY,r=cc.view.getFrameSize(),i=cc.winSize,c=e.xMin+n*e.width,a=e.yMin+o*e.height,l=t.style.realHeight,s=t.style.realWidth,d=c/i.width*r.width-s*n,p=(i.height-a)/i.height*r.height-l*(1-o);t.style.left=d,t.style.top=p},e}return o(e,t),e.prototype.onLoad=function(){window[this.channel]&&this.adUnitIdBanner&&this.bannerCreator()},e.prototype.onEnable=function(){window[this.channel]&&this.adUnitIdBanner&&(this.bannerShow(),this.bannerCreator())},e.prototype.onDisable=function(){window[this.channel]&&this.adUnitIdBanner&&this.bannerHide()},e.prototype.bannerCreator=function(){var t=this;if(!(this._pool.length>this._poolMax)){var e=window[this.channel].createBannerAd({adUnitId:this.adUnitIdBanner,style:{left:0,top:0,width:300}});e.onError(function(e){console.log("[banner] onError",e),t.noBanner=!0}),e.onLoad(function(){t._pool.unshift(e),t.node.active&&!t._bannerAd&&t.bannerShow()})}},e.prototype.bannerShow=function(){this.bannerHide(),this._pool.length>0&&(this._bannerAd=this._pool.shift(),this.setBannerStyle(this._bannerAd),this._bannerAd.show())},e.prototype.bannerHide=function(){this._bannerAd&&(this._bannerAd.hide(),this._pool.push(this._bannerAd),this._bannerAd=null)},r([a({displayName:"\u6e20\u9053"})],e.prototype,"channel",void 0),r([a],e.prototype,"adUnitIdBanner",void 0),e=r([c],e)}(cc.Component);n.default=l,cc._RF.pop()},{}],GSdk:[function(t,e,n){"use strict";cc._RF.push(e,"2b3c4S7bu9CYYlRPXlWODVg","GSdk"),Object.defineProperty(n,"__esModule",{value:!0}),n.GSdk=void 0;var o={ver:"v1.0.1",gameid:"hcdxg",adUnitId:"adunit-0962db6f5f64227e",adUnitIdBanner:"adunit-c657987ad0dd2c34",adUnitIdInterstitial:"adunit-c83e928d371ea96f",serverHost:"https://minigame.ucpopo.com/matrix/",shareData:{title:"\u6709\u4eba@\u4f60 \u8fdb\u6765\u548c\u6211\u4e00\u8d77\u73a9!",imageUrl:"http://cos.ucpopo.com/zqcgc/share_xigua.jpg"}},r=function(){function t(){this.version="v1.0.1",this.isInit=!1,this.user={openid:null,sessid:null},this.video={isInit:!1,errCode:!1,isLoad:!1,_video:null,cb:null,init:function(){var t=this;this.isInit=!0,this._video=window.wx.createRewardedVideoAd({adUnitId:o.adUnitId}),this._video.onLoad(function(){t.isLoad=!0}),this._video.onClose(function(e){e&&e.isEnded||void 0===e?t.cb&&t.cb(null,!0):(console.log("\u64ad\u653e\u4e2d\u9014\u9000\u51fa\uff0c\u4e0d\u4e0b\u53d1\u6e38\u620f\u5956\u52b1"),t.cb&&t.cb(!0,null)),t.cb=null}),this._video.onError(function(e){e.errCode>=1004&&e.errCode<=1008&&(t.errCode=e.errCode)})},show:function(t){var e=this;window.wx?this.errCode?t&&t("\u6682\u65e0\u89c6\u9891\u53ef\u770b",null):this._video.load().then(function(){e.cb=t,e._video.show()}).catch(function(n){e._video.load(),n.errCode?t&&t("\u6682\u65e0\u89c6\u9891\u53ef\u770b("+n.errCode+")",null):t&&t("\u70b9\u592a\u5feb\u4e86",null)}):t&&t("\u4e0d\u5728\u5fae\u4fe1\u73af\u5883\u4e0b",null)}},this.interstitial={closeCb:null,item:null,create:function(){var t=this,e=window.wx.createInterstitialAd({adUnitId:o.adUnitIdInterstitial});e.onLoad(function(){t.item=e,t.item.onClose(function(){t.closeCb&&t.closeCb(),t.create()})})},show:function(t){this.closeCb=t||null,this.item&&this.item.show()}},this.storage={_cache:{},set:function(t,e){if("string"==typeof t&&void 0!==e)try{var n=JSON.stringify(e);return cc.sys.localStorage.setItem(t,n),this._cache[t]=n,!0}catch(t){}else cc.error("error");return!1},get:function(t){if(void 0!==this._cache[t])return JSON.parse(this._cache[t]);var e=null;try{var n=cc.sys.localStorage.getItem(t);n&&"string"==typeof n?(this._cache[t]=n,e=JSON.parse(n)):""!==n&&null!==n&&(e=void 0)}catch(t){e=void 0}return e},clear:function(){try{return cc.sys.localStorage.clear(),cc.js.clear(this._cache),!0}catch(t){return!1}}}}return t.prototype.init=function(){window.wx&&!this.isInit&&(console.log("GSdk init"),this.isInit=!0,this.video.init(),this.interstitial.create(),this.onShareAppMessage(),window.wx.setKeepScreenOn({keepScreenOn:!0}),this.updateNew())},t.prototype.updateNew=function(){if(window.wx){var t=window.wx.getUpdateManager();t.onUpdateReady(function(){t.applyUpdate()})}},t.prototype.onShareAppMessage=function(){if(window.wx){var t="shareid="+this.user.openid;window.wx.showShareMenu({withShareTicket:!0}),window.wx.onShareAppMessage(function(){return{title:o.shareData.title,imageUrl:o.shareData.imageUrl,query:t}})}},t.prototype.shareAppMessage=function(t){window.wx&&(t||((t={}).title=o.shareData.title,t.imageUrl=o.shareData.imageUrl,t.query="shareid="+this.user.openid),window.wx.shareAppMessage({title:t.title,imageUrl:t.imageUrl,query:t.query}))},t}();n.GSdk=r,window.GSdk=new r,cc._RF.pop()},{}],GameSc:[function(t,e,n){"use strict";cc._RF.push(e,"a24e3sZyp9GJoX+eE54dcEO","GameSc");var o=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),r=this&&this.__decorate||function(t,e,n,o){var r,i=arguments.length,c=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,n,o);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(c=(i<3?r(c):i>3?r(e,n,c):r(e,n))||c);return i>3&&c&&Object.defineProperty(e,n,c),c};Object.defineProperty(n,"__esModule",{value:!0});var i,c=t("./BallSc"),a=cc._decorator,l=a.ccclass,s=a.property;(function(t){t[t.start=0]="start",t[t.gaming=1]="gaming",t[t.over=2]="over"})(i||(i={}));var d=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.scoreLabel=null,e.ballsLayer=null,e.waterEffectPrefab=null,e.ballsPrefab=[],e.deadLine=null,e.randomArray=[0,0,0,0,1,1,2,3],e.currentBall=null,e.currentBallIndex=0,e._gameState=i.gaming,e._winner=!1,e._score=0,e.ballColors=[(new cc.Color).fromHEX("#862274"),(new cc.Color).fromHEX("#ff0925"),(new cc.Color).fromHEX("#ff8e1c"),(new cc.Color).fromHEX("#ffe614"),(new cc.Color).fromHEX("#6de42e"),(new cc.Color).fromHEX("#e61933"),(new cc.Color).fromHEX("#fab36d"),(new cc.Color).fromHEX("#ffe350"),(new cc.Color).fromHEX("#fffaea"),(new cc.Color).fromHEX("#fc7b97"),(new cc.Color).fromHEX("#52d135")],e}return o(e,t),Object.defineProperty(e.prototype,"score",{get:function(){return this._score},set:function(t){this._score=t,this.scoreLabel.string=t.toFixed(0)},enumerable:!1,configurable:!0}),e.prototype.onLoad=function(){cc.director.getPhysicsManager().enabled=!0,cc.director.getPhysicsManager().gravity=cc.v2(0,-1280),GSdk.init()},e.prototype.start=function(){this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchMove,this),this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this),this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this),this.CreateNewBall(),this.deadLine.active=!1,cc.tween(this.deadLine).repeatForever(cc.tween(this.deadLine).to(.3,{opacity:0}).to(.3,{opacity:255})).start()},e.prototype.onTouchEnd=function(t){var e=this;if(this._gameState===i.gaming&&this.currentBall){var n=this.currentBall;n.addComponent(c.default).BallIndex=this.currentBallIndex,this.currentBall=null;var o=this.ballsLayer.convertToNodeSpaceAR(t.getLocation()).x;o>360-n.width/2?o=360-n.width/2:o<n.width/2-360&&(o=n.width/2-360);cc.tween(n).to(Math.abs(.001*o),{x:o}).call(function(){n.getComponent(cc.RigidBody).type=cc.RigidBodyType.Dynamic,n.getComponent(cc.RigidBody).linearVelocity=cc.v2(0,-300),e.CreateNewBall()}).start()}},e.prototype.onTouchMove=function(t){if(this._gameState==i.gaming&&this.currentBall){var e=this.ballsLayer.convertToNodeSpaceAR(t.getLocation()).x;e>360-this.currentBall.width/2?e=360-this.currentBall.width/2:e<this.currentBall.width/2-360&&(e=this.currentBall.width/2-360),this.currentBall.x=e}},e.prototype.CreateNewBall=function(){var t=this;this.currentBall&&this.currentBall.destroy();var e=this.randomArray[Math.floor(Math.random()*this.randomArray.length)],n=cc.instantiate(this.ballsPrefab[e]);this.currentBallIndex=n.getComponent(c.default).BallIndex,n.removeComponent(c.default),n.y=566,n.getComponent(cc.RigidBody).type=cc.RigidBodyType.Static,n.scale=0,cc.tween(n).delay(.2).call(function(){t.ballsLayer.addChild(n)}).to(.2,{scale:1}).call(function(){t.currentBall=n}).start()},e.prototype.BallLevelUp=function(t,e){var n=this,o=t.getComponent(c.default).BallIndex+1;return o<=this.ballsPrefab.length&&(cc.game.emit("game-ball-levelup"),e.getComponent(cc.PhysicsCollider).enabled=!1,cc.tween(e).to(.15,{x:t.x,y:t.y}).removeSelf().call(function(){var e=cc.instantiate(n.ballsPrefab[o-1]);e.position=t.position,n.ballsLayer.addChild(e),t.removeFromParent(!0);var r=cc.instantiate(n.waterEffectPrefab);r.x=e.x,r.y=e.y,r.color=n.ballColors[o-1],n.ballsLayer.addChild(r),o==n.ballsPrefab.length&&0==n._winner&&(n._winner=!0,cc.find("Canvas/WinUI").active=!0)}).start(),this.score+=t.getComponent(c.default).BallIndex,this.randomArray.findIndex(function(t){return t==o-1})<0&&(this.randomArray=this.randomArray.concat(JSON.parse(JSON.stringify(this.randomArray))).sort(function(t,e){return t-e}),this.randomArray.push(o-1)),!0)},e.prototype.update=function(t){if(this._gameState==i.gaming){for(var e=!1,n=!1,o=0,r=this.ballsLayer.getComponentsInChildren(c.default);o<r.length;o++){var a=r[o];if(a.isNotCheckOver&&(a.node.y>=this.deadLine.y-a.node.height/2&&(e=!0),a.node.y>=this.deadLine.y)){n=!0;break}}this.deadLine.active=e,n&&(this._gameState=i.over,console.log("Game Over"),cc.find("Canvas/OverUI").active=!0)}},e.prototype.replay=function(){var t=this;cc.find("Canvas/OverUI").active=!1,this._gameState=i.start;for(var e=this.ballsLayer.getComponentsInChildren(c.default),n=function(n){cc.tween(e[n].node).delay(.1*n).call(function(){var o=cc.instantiate(t.waterEffectPrefab);o.x=e[n].node.x,o.y=e[n].node.y,o.color=t.ballColors[e[n].BallIndex-1],t.ballsLayer.addChild(o)}).removeSelf().start()},o=e.length-1;o>=0;o--)n(o);cc.tween(this).delay(.1*e.length).call(function(){t._gameState=i.gaming,t.randomArray=[0,0,0,0,1,1,2,3],t.CreateNewBall()}).start(),this.score=0,this._winner=!1},e.prototype.closeWin=function(){cc.find("Canvas/WinUI").active=!1,GSdk.interstitial.show()},r([s(cc.Label)],e.prototype,"scoreLabel",void 0),r([s(cc.Node)],e.prototype,"ballsLayer",void 0),r([s(cc.Prefab)],e.prototype,"waterEffectPrefab",void 0),r([s([cc.Prefab])],e.prototype,"ballsPrefab",void 0),r([s(cc.Node)],e.prototype,"deadLine",void 0),e=r([l],e)}(cc.Component);n.default=d,cc._RF.pop()},{"./BallSc":"BallSc"}],WaterEffectSc:[function(t,e,n){"use strict";cc._RF.push(e,"cd5d8rJ+QRIdpg05zYhfmq5","WaterEffectSc");var o=this&&this.__extends||function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),r=this&&this.__decorate||function(t,e,n,o){var r,i=arguments.length,c=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(t,e,n,o);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(c=(i<3?r(c):i>3?r(e,n,c):r(e,n))||c);return i>3&&c&&Object.defineProperty(e,n,c),c};Object.defineProperty(n,"__esModule",{value:!0});var i=cc._decorator,c=i.ccclass,a=(i.property,function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype.start=function(){this.node.scale=0,cc.tween(this.node).to(.15,{scale:1},{easing:cc.easeBackOut().easing}).delay(.3).to(.3,{opacity:0}).removeSelf().start(),this.node.angle=360*Math.random()},e=r([c],e)}(cc.Component));n.default=a,cc._RF.pop()},{}]},{},["AudioManager","AutoRotationSc","BallSc","BannerShow","GameSc","GSdk","WaterEffectSc"]);