/*
文件名：pauseButton.ts
描述：控制暂停与继续按钮的脚本，控制游戏的暂停和继续
当前版本：3.0.0
时间：7/20/2019
*/

const { ccclass, property } = cc._decorator;
import { globalModule } from '../constants';

@ccclass
export class pauseButton extends cc.Component {

    public;
    @property(cc.SpriteFrame)
    pausePicture: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    resumePicture: cc.SpriteFrame = null;

    public method;
    onLoad() {
        // 绑定点击事件
        this.node.on('click', this.onClick, this);
    }

    onClick() {
        let button = this.node.getComponent(cc.Button);
        let game = null;
        game = this.node.parent.getComponent('mainGame');
        if (game === null) {
            game = this.node.parent.getComponent('artillaryGame');
        }

        if (globalModule.globalClass.whetherPlayGame === true) {
            globalModule.globalClass.whetherPlayGame = false;
            button.normalSprite = this.resumePicture;
            button.pressedSprite = this.resumePicture;
            button.hoverSprite = this.resumePicture;

            cc.audioEngine.stopAll();
        }
        else {
            globalModule.globalClass.whetherPlayGame = true;
            button.normalSprite = this.pausePicture;
            button.pressedSprite = this.pausePicture;
            button.hoverSprite = this.pausePicture;

            if (globalModule.globalClass.whetherHasSound === true) {
                cc.audioEngine.playMusic(game.backgroundMusic, true);
            }
        }
    }

}
