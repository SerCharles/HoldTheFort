/*
文件名：soundButton.ts
描述：控制播放声音按钮的脚本，控制游戏音乐音效的播放
当前版本：3.0.0
时间：7/20/2019
*/

const {ccclass, property} = cc._decorator;
import {globalModule} from '../constants';

@ccclass
export class soundButton extends cc.Component {

    @property(cc.SpriteFrame)
    playPicture: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    stopPicture: cc.SpriteFrame = null;

    onLoad() {
        //绑定点击事件
        this.node.on('click', this.onClick, this);

    }

    onClick() {
        console.log(1);
        let button = this.node.getComponent(cc.Button);
        if(globalModule.globalClass.whetherHasSound === true) {
            globalModule.globalClass.whetherHasSound = false;
            button.normalSprite = this.stopPicture;
            button.pressedSprite = this.stopPicture;
            button.hoverSprite = this.stopPicture;
        }
        else {
            globalModule.globalClass.whetherHasSound = true;
            button.normalSprite = this.playPicture;
            button.pressedSprite = this.playPicture;
            button.hoverSprite = this.playPicture;
        }
    }
    
}
