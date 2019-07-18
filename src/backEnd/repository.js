const fs = require("fs");


class Repository {
  constructor () {
  }

  AddNewKey (name, score, mode) {
    let fileName = '../data/' + name + '_' + mode + '.txt';
    fs.appendFileSync(fileName, ''+score+'$'); 
  }

  FindKey (name, mode) {
    let fileName = '../data/' + name + '_' + mode + '.txt';
    let data = fs.readFileSync(fileName);
    let maxScore = 0;
    let scoreList = data.toString().split('$');
    for(let i = 0; i < scoreList.length; i ++) {
      let score = parseInt(scoreList[i]);
      if(score > maxScore) maxScore = score;
    }
    return maxScore;
  }


}

module.exports = Repository
