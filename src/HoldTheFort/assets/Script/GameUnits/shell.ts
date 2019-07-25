/*
文件名：shell.ts
描述：炮弹类
当前版本：1.0.0
时间：7/12/2019
*/

const { ccclass, property } = cc._decorator;

import { gameConstants, unitConstants, judgeOutOfRange, getDistance, globalModule } from  '../constants';


@ccclass
export class shell extends cc.Component {

    public;

    @property(Number)
    damage: number = 0;

    @property(Number)
    speed: number = unitConstants.speedShell;

    @property(Boolean)
    valid: boolean = true;

    @property(Number)
    attackRange: number = unitConstants.shellHitRange;

    // true:我军 false：敌军
    @property(Boolean)
    faction: boolean = unitConstants.factionSoldier;

    // -1：一般炮弹，0,1,2,3：炮兵模式中玩家射出的炮弹
    @property(Number)
    origin: number = -1;

    @property(cc.Vec2)
    movingDirection: cc.Vec2 = undefined;

    @property(cc.Vec2)
    finalPlace: cc.Vec2 = undefined;

    public method;
    setMovingDirection(destination: cc.Vec2) {
        this.finalPlace = destination;
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

    renewMovingDirection() {
        let dx = this.finalPlace.x - this.node.x;
        let dy = this.finalPlace.y - this.node.y;
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

        // 判断是否命中
        if (getDistance(this.finalPlace, this.node.position) <= unitConstants.minRange) {
            let game = null;
            game = this.node.parent.getComponent('mainGame');
            if (game === null) {
                game = this.node.parent.getComponent('artillaryGame');
            }
            game.onShellExplode(this.node.position, this.damage, this.attackRange, this.origin);
            this.valid = false;
        }
        this.renewMovingDirection();

        // 判断是否死亡
        if (this.valid === false) {
            this.node.destroy();
        }

        // 更新位置和出界
        if (this.movingDirection !== undefined) {
            this.node.x += this.speed * this.movingDirection.x * dt;
            this.node.y += this.speed * this.movingDirection.y * dt;
        }
        if (judgeOutOfRange(this.node.position) === true) {
            this.valid = false;
        }
    }
}
