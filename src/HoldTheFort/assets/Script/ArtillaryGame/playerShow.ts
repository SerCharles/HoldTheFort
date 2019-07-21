/*
文件名：playerShow.ts
描述：在右端显示玩家的炮兵信息
当前版本：3.0.0
时间：7/20/2019
*/

const { ccclass, property } = cc._decorator;

import { globalModule } from '../constants';
import { playerMortar } from './playerMortar';

@ccclass
export class playerShow extends cc.Component {

    public
    // 等级显示
    @property(cc.Label)
    levelShow: cc.Label = null;

    @property(Number)
    code: number = 0;

    @property(playerMortar)
    myMortar: playerMortar = null;

    // 开始：获取编号，玩家炮
    onLoad() {
        this.setCode();
        this.getMyMortar();
    }

    // 设置编号
    setCode() {
        if (this.node.name === 'mortarInfo0') {
            this.code = 0;
        }
        else if (this.node.name === 'mortarInfo1') {
            this.code = 1;
        }
        else if (this.node.name === 'mortarInfo2') {
            this.code = 2;
        }
        else if (this.node.name === 'mortarInfo3') {
            this.code = 3;
        }
    }

    // 获取对应的玩家炮
    getMyMortar() {
        let theGame = this.node.parent;
        let theMortar;
        if (this.node.name === 'mortarInfo0') {
            theMortar = theGame.getChildByName('mortar0');
        }
        else if (this.node.name === 'mortarInfo1') {
            theMortar = theGame.getChildByName('mortar1');
        }
        else if (this.node.name === 'mortarInfo2') {
            theMortar = theGame.getChildByName('mortar2');
        }
        else if (this.node.name === 'mortarInfo3') {
            theMortar = theGame.getChildByName('mortar3');
        }
        this.myMortar = theMortar.getComponent('playerMortar');
    }

    // 更新经验，攻击时间，等级
    update(dt) {
        this.updateAttackBar();
        this.updateExpBar();
        this.updateLevelLabel();
    }


    // 更新攻击时间条
    updateAttackBar() {
        let bar = this.node.getChildByName('attackBar');
        let attackRatio;
        attackRatio = this.myMortar.getAttackRatio();
        let barShow = bar.getComponent(cc.ProgressBar);
        barShow.progress = attackRatio;
    }

    // 更新经验条
    updateExpBar() {
        let bar = this.node.getChildByName('expBar');
        let expRatio;
        expRatio = this.myMortar.getExpRatio();
        let barShow = bar.getComponent(cc.ProgressBar);
        barShow.progress = expRatio;
    }

    // 更新等级显示
    updateLevelLabel() {
        let currentLevel = this.myMortar.getLevel();
        this.levelShow.string = 'LV.' + currentLevel;
    }
}

