#ifndef __RANKLIST_H__ 
#define __RANKLIST_H__ 

#include "cocos2d.h"
#include "cocos-ext.h"
#include "GameDefine.h"

USING_NS_CC;
USING_NS_CC_EXT;

struct Player
{
	std::string name;
	int score;
};

class RankList : public Layer,TableViewDataSource,TableViewDelegate
{
public:
	virtual bool init();  
    static CCScene* createScene();  
    CREATE_FUNC(RankList);  

	/* tableview 相关 */
	// 当滑动tableview时触发该方法 参数为当前的tableview对象
    virtual void scrollViewDidScroll(ScrollView* view) {};
    // 当tableview被放大或缩小时触发该方法  参数为当前tableview对象
    virtual void scrollViewDidZoom(ScrollView* view) {}
    // 当cell被点击时调用该方法 参数为当前的tableview对象与被点击的cell对象
    virtual void tableCellTouched(TableView* table, TableViewCell* cell);
    // 设置tableview的Cell大小
	virtual Size tableCellSizeForIndex(TableView *table, ssize_t idx);
    // 获取编号为idx的cell
    virtual TableViewCell* tableCellAtIndex(TableView *table, ssize_t idx);
    // 设置tableview中cell的个数
	virtual ssize_t numberOfCellsInTableView(TableView *table);

	/* CCTextFieldTTF相关 */
	// 触摸事件
	bool onTouchBegan(Touch  *touch, Event  *event);

	// 提交按钮回调函数
	void menuSubmitCallback(Ref* pSender);
private:
    CCTextFieldTTF* textEdit;
	CCTextFieldTTF* textEdit2;
	
	Player p[max_range+1];
	
};

#endif