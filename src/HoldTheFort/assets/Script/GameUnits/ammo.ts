/*
文件名：ammo.ts
描述：子弹类
当前版本：1.0.0
时间：7/12/2019
*/

const { ccclass, property } = cc._decorator;

import { gameConstants, unitConstants, judgeOutOfRange, globalModule } from  '../constants';


@ccclass
export class ammo extends cc.Component {

    public;
    @property(Number)
    damage: number = 0;

    @property(Number)
    speed: number = unitConstants.speedAmmo;

    @property(Boolean)
    valid: boolean = true;

    // true:我军 false：敌军
    @property(Boolean)
    faction: boolean = unitConstants.factionSoldier;

    @property(cc.Vec2)
    movingDirection: cc.Vec2 = undefined;

    public method;
    // 一系列对外接口
    // 设置移动方向
    setMovingDirection(destination: cc.Vec2) {
        let dx = destination.x - this.node.x;
        let dy = destination.y - this.node.y;
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude === 0) {
            this.movingDirection = cc.v2(0, 0);
        }
        else {
            this.movingDirection = cc.v2(dx / magnitude, dy / magnitude);
        }
    }

    setDamage(damage) {
        this.damage = damage;
    }

    setFaction(faction: boolean) {
        this.faction = faction;
    }

    update(dt) {
        // 暂停
        if (globalModule.globalClass.whetherPlayGame === false) return;


        if (this.valid === false) {
            this.node.destroy();
        }
        if (this.movingDirection !== undefined) {
            this.node.x += this.speed * this.movingDirection.x * dt;
            this.node.y += this.speed * this.movingDirection.y * dt;
        }
        if (judgeOutOfRange(this.node.position) === true) {
            this.valid = false;
        }
    }
}
