/*
文件名：preLoadScene.ts
描述：控制初始加载游戏和分包加载
当前版本：5.0.0
时间：7/17/2019
*/

const { ccclass, property } = cc._decorator;

import { gameConstants } from '../constants';

@ccclass
export class preLoadScene extends cc.Component {

    public
    //已经用的加载时间
    @property(Number)
    currentLoadTime: number = 0;



    // 预先加载游戏
    onLoad() {
        this.currentLoadTime = 0;
        cc.loader.downloader.loadSubpackage('texture', function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('load subpackage successfully.');
        });
        cc.loader.downloader.loadSubpackage('bgm', function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('load subpackage successfully.');
        });
        cc.loader.downloader.loadSubpackage('music', function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('load subpackage successfully.');
        });
    }
    // 更新进度条
    update(dt) {
        this.currentLoadTime += dt;
        let bar = this.node.getChildByName('progressBar');
        let barShow = bar.getComponent(cc.ProgressBar);
        let loadRatio = this.currentLoadTime / gameConstants.loadingTimeTotal;

        // 100%就加载游戏
        if (loadRatio >= 1) {
                cc.director.loadScene('openScene');
        }

        barShow.progress = loadRatio;
    }
}