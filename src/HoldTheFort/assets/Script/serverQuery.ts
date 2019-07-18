

const {ccclass, property} = cc._decorator;

import {netWorkConstants, globalModule} from './constants'



//后端代码，把新的得分发到服务器上去，并且获取当前新的历史纪录
function uploadScore(score) {
    let scoreRequest = new XMLHttpRequest();
    scoreRequest.setRequestHeader('Content-Type', 'application/json');
    scoreRequest.open('POST',netWorkConstants.completeUrl, true);
    let data = {'name':'sgl','score':score,'mode':'standard'}
    scoreRequest.send(JSON.stringify(data));
    scoreRequest.onreadystatechange = function () {  
        let err;
        if (scoreRequest.readyState == 4 && (scoreRequest.status >= 200 && scoreRequest.status <= 207)) {  
            err = false;  
        }else{  
            err = true;  
        }  
        var response = scoreRequest.responseText;
        let bestScore = parseInt(response.substring(9,11));
        globalModule.globalClass.historyMaxScore = bestScore;
    };

}


//连接服务器，获得历史最高纪录
function getHistoryBest() {
    let scoreRequest = new XMLHttpRequest();
    scoreRequest.setRequestHeader('Content-Type', 'application/json');
    scoreRequest.open('POST',netWorkConstants.completeUrl, true);
    let data = {'name':'sgl','score':-1,'mode':'standard'}
    scoreRequest.send(JSON.stringify(data));
    scoreRequest.onreadystatechange = function () {  
        let err;
        if (scoreRequest.readyState == 4 && (scoreRequest.status >= 200 && scoreRequest.status <= 207)) {  
            err = false;  
        }else{  
            err = true;  
        }  
        var response = scoreRequest.responseText;
        let bestScore = parseInt(response.substring(9,11));
        console.log(bestScore);
        globalModule.globalClass.historyMaxScore = bestScore;
    };

}

export {uploadScore, getHistoryBest};

