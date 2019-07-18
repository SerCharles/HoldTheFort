/*
文件名：unit.ts
描述：所有士兵的基类
当前版本：1.0.0
时间：7/12/2019
*/

const {ccclass, property} = cc._decorator;

import {gameConstants, unitConstants, getDistance} from  '../constants';

//士兵类：所有士兵的基类
//描述：属性上，定义了所有士兵的生命，攻击，防御，速度，等级，经验等基本属性，以及被击杀奖励，造价等
//方法上：自己管理自己的死亡，生命，经验与等级，攻击时间，让游戏主体管理自己的状态，攻击。
//但是自己提供被攻击掉血，杀人加经验，修改自身攻防，攻击时间的接口
@ccclass
export class unit extends cc.Component {
//定义自身基本属性
    //最大值，每次update会根据其最大值来更新其当前值 
    @property(Number)    
    maxHealth: number = 0;
    @property(Number)    
    maxAttack: number = 0;
    @property(Number)
    maxDefense: number =0;
    @property(Number)
    maxSpeed: number = 0;
    @property(Number)
    maxLevel: number = unitConstants.maxLevel;
    @property(Number)
    maxHealthRestoration: number = 0;
    @property(Number)
    attackGetExp: number = 0;
    @property(Number)
    killGetScore: number = 0;
    @property(Number)
    killGetMoney: number = 0;
    @property(Number)
    cost: number = 0;
    @property(Number)
    attackTime: number = 0;

    //当前值，每次update时更新
    @property(Number)
    currentHealth: number = 0;
    @property(Number)
    currentAttack: number = 0;
    @property(Number)
    currentDefense: number = 0;
    @property(Number)
    currentSpeed: number = 0;
    @property(Number)
    currentLevel: number = 1;
    @property(Number)
    currentExp: number = 0;
    @property(Number)
    currentHealthRestoration: number = 0;
    @property(Number)
    currentTimeSinceAttack: number = 0;
    
    //状态:true代表可以攻击（速度不为0），false代表正在装填（速度为0）
    @property(Boolean)
    currentStatus: boolean = true;

    //种类：0代表近战，1代表远程。。。。
    @property(Number)
    type: number = undefined;

    //攻击范围和搜索的格子距离
    @property(Number)
    attackRange: number = 0;

    @property(Number)
    searchRange: number = 0;

    @property(Number)
    searchBlock: number = 0;

    //是否有效，true有效false无效
    @property(Boolean)
    valid: boolean = true;

    //true:我方，false：敌方
    @property(Boolean)
    faction: boolean = undefined;

    @property(cc.Vec2)
    movingDirection: cc.Vec2 = undefined;

    //死亡音效
    @property(cc.AudioClip)
    deathAudio:cc.AudioClip = null;

    //当前等级显示
    @property(cc.Label)
    levelShow:cc.Label = null;

    //更新自身属性的函数，每次update调用
    //更新死亡
    updateDeath(){
        if(this.currentHealth <= 0) {
            this.valid = false;
            cc.audioEngine.playEffect(this.deathAudio, false);


            //敌方死亡，增加经验和金币
            if(this.faction === false) {  
                this.node.dispatchEvent( new cc.Event.EventCustom('getScore', true) );
                this.node.dispatchEvent( new cc.Event.EventCustom('spawnMoney', true) );
            }
            this.node.destroy();
        }
    }

    //更新生命
    updateHealth(dt){
        this.currentHealth += this.currentHealth * (this.currentHealthRestoration / 100) * dt;
        if(this.currentHealth > this.maxHealth) this.currentHealth = this.maxHealth;
    }

    //更新经验与等级
    updateLevel(){
        if(this.currentLevel === this.maxLevel) {
            this.currentExp = 0;
            return;
        }
        if(this.currentExp >= unitConstants.expRequiredEachLevel[this.currentLevel - 1]) {
            this.currentExp = 0;
            this.upgrade();
        }
    }

    //更新位置
    updatePlace(dt){
        if(this.movingDirection === undefined) return;
        if(getDistance(this.node.position,cc.v2(0,0)) <= 1){
                this.currentSpeed = 0;
        }
        this.node.x += this.currentSpeed * this.movingDirection.x * dt;
        this.node.y += this.currentSpeed * this.movingDirection.y * dt;
    }

    //装填时，更新装填时间
    updateAttackTime(dt){
        if(this.currentStatus !== false) return;
        this.currentTimeSinceAttack += dt;
        if(this.currentTimeSinceAttack > this.attackTime) {
            this.currentTimeSinceAttack = 0;
            this.currentStatus = true;
        }
    }

    //控制更新生命，攻击时间条，经验条在士兵子类里更新
    updateHealthBar(){
        let bar = this.node.getChildByName('healthBar');
        let healthRatio = this.currentHealth / this.maxHealth;
        let barShow = bar.getComponent(cc.ProgressBar);
        barShow.progress = healthRatio;
    }

    updateAttackBar(){
        let bar = this.node.getChildByName('attackBar');
        let attackRatio;
        if(this.currentStatus === true) {
            //目前可以攻击
            attackRatio = 1;
        }
        else {
            attackRatio = this.currentTimeSinceAttack / this.attackTime;
        }
        let barShow = bar.getComponent(cc.ProgressBar);
        barShow.progress = attackRatio;
    }

    update(dt) {
        this.updateDeath();
        this.updateHealth(dt);
        this.updateLevel();
        this.updatePlace(dt);
        this.updateAttackTime(dt);
        this.updateAttackBar();
        this.updateHealthBar();
    }

    //更新的辅助函数
    //升级 //这里是虚函数，子类调用updateLevel的时候就不是了
    upgrade(){
        this.currentLevel ++;
    }



    //留给游戏主界面操作的接口，用于更新单位自身的各种状态
    //被攻击
    beingAttack(damage: number) {
        this.currentHealth -= damage;
    }

    //修改自身的攻击力，防御力，速度，方向，经验，状态
    changeCurrentAttack(percentage: number) {
        this.currentAttack = this.maxAttack * (percentage / 100);
    }

    changeCurrentDefence(percentage: number) {
        this.currentDefense = this.maxDefense * (percentage / 100);
    }

    changeCurrentSpeed(percentage: number) {
        this.currentSpeed = this.maxSpeed * (percentage / 100);
    }

    changeDirection(destination) {
        let dx = destination.x - this.node.x;
        let dy = destination.y - this.node.y;
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        if(magnitude === 0){
            this.movingDirection = cc.v2(0,0);
        }
        else{
            this.movingDirection = cc.v2(dx / magnitude, dy / magnitude);
        }
    }

    changeExp(addExp: number){
        this.currentExp += addExp;
    }

    changeStatus(newStatus: boolean){
        this.currentStatus = newStatus;
    }
    
    //攻击结束后，刷新攻击时间
    resetAttackTime(){
        this.currentTimeSinceAttack = 0;
    }


};

