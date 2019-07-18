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

	/* tableview ��� */
	// ������tableviewʱ�����÷��� ����Ϊ��ǰ��tableview����
    virtual void scrollViewDidScroll(ScrollView* view) {};
    // ��tableview���Ŵ����Сʱ�����÷���  ����Ϊ��ǰtableview����
    virtual void scrollViewDidZoom(ScrollView* view) {}
    // ��cell�����ʱ���ø÷��� ����Ϊ��ǰ��tableview�����뱻�����cell����
    virtual void tableCellTouched(TableView* table, TableViewCell* cell);
    // ����tableview��Cell��С
	virtual Size tableCellSizeForIndex(TableView *table, ssize_t idx);
    // ��ȡ���Ϊidx��cell
    virtual TableViewCell* tableCellAtIndex(TableView *table, ssize_t idx);
    // ����tableview��cell�ĸ���
	virtual ssize_t numberOfCellsInTableView(TableView *table);

	/* CCTextFieldTTF��� */
	// �����¼�
	bool onTouchBegan(Touch  *touch, Event  *event);

	// �ύ��ť�ص�����
	void menuSubmitCallback(Ref* pSender);
private:
    CCTextFieldTTF* textEdit;
	CCTextFieldTTF* textEdit2;
	
	Player p[max_range+1];
	
};

#endif