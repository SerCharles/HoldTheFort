/*
文件名：selfBomberSoldier.ts
描述：自爆我军（地雷）类，继承了selfBomber.ts
当前版本：3.0.0
时间：7/19/2019
*/

const { ccclass, property } = cc._decorator;

import { unit } from './unit';
import { selfBomber } from './selfBomber';
import { gameConstants, unitConstants } from  '../constants';


@ccclass
export class selfBomberSoldier extends selfBomber {

    public;

    constructor() {
        super();
        // 我军，不能移动
        // 最大值初始化

        this.faction = unitConstants.factionSoldier;
        this.maxSpeed = 0;
        this.cost = unitConstants.costSelfBomb;

        // 当前值初始化
        this.currentSpeed = this.maxSpeed;

    }

    public method;
    // 重写死亡函数
    updateDeath() {
        if (this.currentHealth <= 0) {
            this.valid = false;

            // 如果死亡或者到达预定位置，就自爆，等价于放置立刻爆炸的炸弹
            let game = null;
            game = this.node.parent.getComponent('mainGame');
            if (game === null) {
                this.node.parent.getComponent('artillaryGame');
            }
            game.spawnShell(this.node.position, this.node.position, this.currentAttack);

            this.node.destroy();
        }
    }

    onload() {
        this.changeDirection(this.node.position);
    }

    update(dt) {
        super.update(dt);
    }

}
