/*import './template.js';*/
export default function anonymous(it) {
    var out = '<view class="container" id="main"> <view class="header"> <text class="title" value="排行榜"></text> </view> <view class="rankList"> <scrollview class="list"> ';
    var arr1 = it.data;
    if (arr1) {
        var item, index = -1, l1 = arr1.length - 1;
        while (index < l1) {
            item = arr1[index += 1];
            out += ' ';
            if (index % 2 === 1) {
                out += ' <view class="listItem listItemOld"> ';
            }
            out += ' ';
            if (index % 2 === 0) {
                out += ' <view class="listItem"> ';
            }
            out += ' <text class="listItemNum" value="' + ( item.rank) + '"></text> <image class="listHeadImg" src="' + ( item.avatarUrl ) + '"></image> <text class="listItemName" value="' + ( item.nickname) + '"></text> <text class="listItemScore" value="' + ( item.rankScore) + '"></text> <text class="listScoreUnit" value="分"></text> </view> ';
        }
    }
    out += ' </scrollview> <text class="listTips" value="仅展示前50位好友排名"></text> <view class="listItem selfListItem"> <text class="listItemNum" value="' + ( it.self.rank) + '"></text> <image class="listHeadImg" src="' + ( it.self.avatarUrl ) + '"></image> <text class="listItemName" value="' + ( it.self.nickname) + '"></text> <text class="listItemScore" value="' + ( it.self.rankScore) + '"></text> <text class="listScoreUnit" value="分"></text> </view> </view></view>';
    return out;
}


