/*
文件名：mainMenuMusic.ts
描述：控制mainMenu的音乐播放
当前版本：3.0.0
时间：7/17/2019
*/

const { ccclass, property } = cc._decorator;

@ccclass
export class mainMenuMusic extends cc.Component {

    public
    @property(cc.AudioClip)
    backgroundMusic: cc.AudioClip = null;

    onLoad() {
        cc.audioEngine.playMusic(this.backgroundMusic, true);
    }

}