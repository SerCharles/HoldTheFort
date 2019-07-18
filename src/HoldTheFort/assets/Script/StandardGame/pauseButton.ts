/*
文件名：pauseButton.ts
描述：游戏中控制暂停按钮的脚本，可以从暂停，继续两个位置互换
当前版本：3.0.0
时间：7/17/2019
*/

const {ccclass, property} = cc._decorator;

@ccclass
export class pauseButton extends cc.Component {

    @property(Boolean)
    whetherPaused:boolean = false;

    onLoad() {
        this.node.on('click',function(event){
            if(this.whetherPaused === false) {
                //暂停
                this.whetherPaused = true;
                let pauseShow = this.getChildByName('pause');
                let resumeShow = this.getChildByName('resume');
                pauseShow.opacity = 0;
                resumeShow.opacity = 255;
                //this.pauseAll();
            }
            else {
                //继续
                this.whetherPaused = false;
                let pauseShow = this.getChildByName('pause');
                let resumeShow = this.getChildByName('resume');
                pauseShow.opacity = 255;
                resumeShow.opacity = 0;  
                //this.resumeAll();            
            }
        },this);
    }

    pauseAll() {
       let mainCanvas = this.node.parent;
       mainCanvas.pauseAllActions(); 
       for(let i = 0; i < mainCanvas.childrenCount; i ++) {
           let currentNode = mainCanvas.children[i];
           if(currentNode.name !== 'pauseButton') {
               currentNode.pauseAllActions();
           }
       }
    }

    resumeAll() {
        let mainCanvas = this.node.parent;
       mainCanvas.resumeAllActions(); 
       for(let i = 0; i < mainCanvas.childrenCount; i ++) {
           let currentNode = mainCanvas.children[i];
           if(currentNode.name !== 'pauseButton') {
               currentNode.resumeAllActions();
           }
       }
    }


    
}
