/*
文件名：playerMortar.ts
描述：控制四个玩家炮兵，由mortarSoldier类继承得到
当前版本：3.0.0
时间：7/20/2019
*/

const { ccclass, property } = cc._decorator;

import { unit } from '../GameUnits/unit';
import { mortarSoldier } from '../GameUnits/mortarSoldier';
import { gameConstants, unitConstants } from  '../constants';

@ccclass
export class playerMortar extends mortarSoldier {

    public
    @property(Number)
    code: number = 0;

    onLoad() {
        super.onLoad();
        this.setCode();
    }

    // 设置编号
    setCode() {
        if (this.node.name === 'mortar0') {
            this.code = 0;
        }
        else if (this.node.name === 'mortar1') {
            this.code = 1;
        }
        else if (this.node.name === 'mortar2') {
            this.code = 2;
        }
        else if (this.node.name === 'mortar3') {
            this.code = 3;
        }
    }


    // 没有生命之类的东西，只需要判断攻击，等级，经验就好了
    update(dt) {
        this.updateLevel();
        this.updateAttackTime(dt);
        this.updateAttackBar();
        this.updateExpBar();
        this.updateLevelLabel();
    }

    // 获取当前的等级，攻击条，经验条比例，用于更新显示
    getLevel() {
        return this.currentLevel;
    }
    getAttackRatio() {
        if (this.currentStatus === unitConstants.statusCanAttack) {
            return 1;
        }
        else { return (this.currentTimeSinceAttack / this.attackTime) }
    }
    getExpRatio() {
        if (this.currentLevel === this.maxLevel) {
            return 1;
        }
        else { return (this.currentExp / unitConstants.expRequiredEachLevel[this.currentLevel - 1]) }
    }
}
