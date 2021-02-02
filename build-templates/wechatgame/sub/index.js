import style from 'render/style.js';
import tplFn from 'render/tplfn.js';
import Layout from './engine.js'

import {
    getFriendData,
    setUserRecord,
    getUserInfo,
    findSelf,
    injectSelfToList,
    replaceSelfDataInList,
} from 'data.js';

let maxItem = 5;   //最大好友数
let postType;
let userinfo;
let selfData;
let key = 'rankScore';
let sharedCanvas = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');

let needDraw = true;
let viewInit = false;
function init() {
    wx.onMessage(data => {
        //console.log('onMessage', data);
        if (data.event === 'updateViewPort') {
            if (!viewInit) {
                viewInit = true;
                updateViewPort(data);
            }
            showFriendRank();
        } else if (data.event === 'score') {
            needDraw = true;
            setUserRecord(key, { rankScore: data.score });
        }
    });
}

function updateViewPort(data) {
    let sys = wx.getSystemInfoSync();
    let { box, winSize } = data;

    /**
     * 设置子域绘制的真实物理尺寸
     * 子域不理解主域用的引擎，又需要独立进行事件处理，需要将真实的物理尺寸传给渲染引擎
     */
    let offsetX = sys.screenWidth * (box.x / winSize.width);
    let offsetY = sys.screenHeight * (box.y / winSize.height);

    const renderW = sys.screenWidth * (box.width / winSize.width);
    const renderH = sys.screenHeight * (box.height / winSize.height);

    Layout.updateViewPort({
        width: renderW,
        height: renderH,
        x: offsetX,
        y: offsetY,
    });
}

function showFriendRank() {
    /**
     * 用户信息会在子域初始化的时候去拉取
     * 但是存在用户信息还没有拉取完成就要求渲染排行榜的情况，这时候再次发起用信息请求再拉取排行榜
     */
    if (needDraw) {
        needDraw = false;
        if (!userinfo) {
            getUserInfo((info) => {
                userinfo = info;
                loadFriendDataAndRender(key, info);
            });
        } else {
            loadFriendDataAndRender(key, userinfo);
        }
    }
}

function loadFriendDataAndRender(key, info, needRender = true) {
    getFriendData(key, (data) => {
        /**
         * 拉取排行榜的时候无法确定排行榜中是否有自己，或者即便有自己分数也是旧的
         * 如果拉取排行榜之前先调用setUserCloudStorage来上报分数再拉取排行榜
         * 那么第一次渲染排行榜会非常之慢。针对这种场景需要根据情况处理：
         * 1. 如果拉取排行榜之前有调用分数上报接口，将每次上报的分数缓存起来，然后插入或者替换排行榜中的自己
         * 2. 如果拉取排行榜之前没有调用分数上报接口，忽略1的逻辑
         */
        //按分数排序
        data.sort(function (a, b) {
            return b.rankScore - a.rankScore;
        });
        //写上rank
        for (let i = 0; i < data.length; i++) {
            data[i].rank = i + 1;
        }

        let find = findSelf(data, info);
        selfData = find.self;

        draw(data.slice(0, maxItem), selfData);

        // let btnList = Layout.getElementsByClassName('giftBtn');
        // for (let i = 0;i < btnList.length;i ++) {
        //     btnList[i].on('click',(e) => {
        //         let img = Layout.getElementsById('img' + i);
        //         img[0].src = img[0].src === "sub/Buffet_icon_GiftPlate_0.png" ? "sub/Buffet_icon_GiftPlate.png":  "sub/Buffet_icon_GiftPlate_0.png"
        //     });
        // }
    });
}

function draw(data = [], self, index) {
    let template = tplFn({
        data,
        self: self || {},
    });

    Layout.clear();
    Layout.init(template, style);
    Layout.layout(sharedContext);
}

init();

