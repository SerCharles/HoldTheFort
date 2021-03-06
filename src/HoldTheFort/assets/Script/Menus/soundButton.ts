/*
文件名：soundButton.ts
描述：控制播放声音按钮的脚本，控制游戏音乐音效的播放
当前版本：3.0.0
时间：7/20/2019
*/

const { ccclass, property } = cc._decorator;
import { globalModule } from '../constants';

@ccclass
export class soundButton extends cc.Component {

    public;
    @property(cc.SpriteFrame)
    playPicture: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    stopPicture: cc.SpriteFrame = null;

    public method;
    onLoad() {
        // 绑定点击事件
        this.node.on('click', this.onClick, this);

    }

    onClick() {
        let game = null;
        game = this.node.parent.getComponent('mainGame');
        if (game === null) {
            game = this.node.parent.getComponent('artillaryGame');
        }


        let button = this.node.getComponent(cc.Button);
        if (globalModule.globalClass.whetherHasSound === true) {
            globalModule.globalClass.whetherHasSound = false;
            button.normalSprite = this.stopPicture;
            button.pressedSprite = this.stopPicture;
            button.hoverSprite = this.stopPicture;

            cc.audioEngine.stopAll();
        }
        else {
            globalModule.globalClass.whetherHasSound = true;
            button.normalSprite = this.playPicture;
            button.pressedSprite = this.playPicture;
            button.hoverSprite = this.playPicture;

            if (globalModule.globalClass.whetherPlayGame === true) {
                cc.audioEngine.playMusic(game.backgroundMusic, true);
            }
        }
    }

}
