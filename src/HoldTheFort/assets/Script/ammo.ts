/*
文件名：ammo.ts
描述：所有弹药的基类
当前版本：1.0.0
时间：7/12/2019
*/

const {ccclass, property} = cc._decorator;

import {gameConstants, unitConstants, judgeOutOfRange} from  './constants';


@ccclass
export class ammo extends cc.Component {

    @property(Number)
    damage: number = 0;

    @property(Number)
    speed: number = unitConstants.speedAmmo;

    @property(Boolean)
    valid: boolean = true;

    //true:我军 false：敌军
    @property(Boolean)
    faction: boolean = true;

    @property(cc.Vec2)
    movingDirection:cc.Vec2 = undefined;

    setMovingDirection(destination:cc.Vec2){
        let dx = destination.x - this.node.x;
        let dy = destination.y - this.node.y;
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        if(magnitude === 0){
            this.movingDirection = cc.v2(0,0);
        }
        else{
            this.movingDirection = cc.v2(dx / magnitude, dy / magnitude)
        }
    }

    setDamage(damage) {
        this.damage = damage;
    }

    setFaction(faction:boolean){
        this.faction = faction;
    }
    
    update(dt){
        if(this.valid === false) {
            this.node.destroy();
            //todo:音效
        }
        if(this.movingDirection !== undefined){
            this.node.x += this.speed * this.movingDirection.x * dt;
            this.node.y += this.speed * this.movingDirection.y * dt;
        }
        //if(judgeOutOfRange(this.node.position) === true) {
            //this.valid = false;
        //}
    }
}
