#include "RankList.h"

Scene* RankList::createScene()
{
    auto scene = Scene::create();
    auto layer = RankList::create();
    scene->addChild(layer);
    return scene;
}

bool RankList::init()  
{  
    if ( !Layer::init() )  
    {  
        return false;  
    }  

	Size visibleSize = Director::getInstance()->getVisibleSize();

	// �ı���
	textEdit = CCTextFieldTTF::textFieldWithPlaceHolder("Please input name:","Arial", 24);  
	textEdit->setPosition(Vec2(visibleSize.width/2, visibleSize.height-textEdit->getContentSize().height*3 ));  
	textEdit->setColorSpaceHolder(Color3B::BLUE);
    this->addChild(textEdit);  
	
	// �����ı���2��
	textEdit2 = CCTextFieldTTF::textFieldWithPlaceHolder("Please input score:", "Arial", 24);
	textEdit2->setPosition(Vec2(visibleSize.width/2,visibleSize.height-textEdit->getContentSize().height*6));
	this->addChild(textEdit2);

	 //���������ؼ���ʱ�򵯳������  
    setTouchMode(kCCTouchesOneByOne);  
    setTouchEnabled(true);  

	// �ύ��ť
	auto submitItem = MenuItemFont::create("Submit",CC_CALLBACK_1(RankList::menuSubmitCallback,this));
	submitItem->setColor(Color3B::YELLOW);
	submitItem->setPosition(Vec2(visibleSize.width/2,visibleSize.height-textEdit->getContentSize().height*9));
	
	auto menu = Menu::create(submitItem, NULL);
    menu->setPosition(Vec2::ZERO);
    this->addChild(menu, 1);

	// ��ȡ����
	if(!UD_getBool("isExist", false))	{
        UD_setBool("isExist",true);
		
		for( int i=1 ; i <= max_range ; i++ )	{
			// �� XML ��Ӧ���ݸ�ֵ
			UD_setString(StringUtils::format("p%d_name",i).c_str(),"name");
			UD_setInt(StringUtils::format("p%d_score",i).c_str(),0);

			// ��������Ӧ���ݸ�ֵ
			p[i-1].name = "name";
			p[i-1].score = 0;
		}

    }
	else  {
		for( int i=1 ; i <= max_range ; i++ )	{
			// ��ȡ XML ����
			p[i-1].name = UD_getString(StringUtils::format("p%d_name",i).c_str());
			p[i-1].score = UD_getInt(StringUtils::format("p%d_score",i).c_str());	
		}
	}

	//����һ��talbleview ��datasource����Ϊ��ǰ����Ķ��� tableview����ʾ�����СΪ 300 * 300
    TableView* tableView = TableView::create(this, CCSizeMake(200,100));
    //����tableviewΪˮƽ����  ScrollView::Direction::VERTICAL Ϊ��ֱ,ScrollView::Direction::HORIZONTAL Ϊˮƽ
	tableView->setDirection(ScrollView::Direction::VERTICAL);
	//����λ��
	tableView->setPosition(Vec2(visibleSize.width/2,visibleSize.height/2));
    //���ô������
	tableView->setDelegate(this);
	// ���˳��
	tableView->setVerticalFillOrder(TableView::VerticalFillOrder::TOP_DOWN);
	//���tableview����ǰlayer
    this->addChild(tableView);
	//����tableview
    tableView->reloadData();

    return true;  
}  

//��cell�����ʱ����  cell->getIdx()��ȡ��ǰ���cell�ı��
void RankList::tableCellTouched(TableView* table, TableViewCell* cell)
{
	// ��������ڴ�ӡ������ǰcell�ı��
    CCLOG("cell touched at index: %i", cell->getIdx());
}

//���ñ��Ϊ idx ��cell�Ĵ�С  �˴���Ϊ100*100
Size RankList::tableCellSizeForIndex(TableView *table, ssize_t idx)
{
    return CCSizeMake(60, 60);
}

//����tableview�Ƕ�̬��ȡ���ݵģ��÷����ڳ�ʼ��ʱ�ᱻ����һ�Σ�֮����ÿ�����ص�cell��ʾ������ʱ�򶼻����
TableViewCell* RankList::tableCellAtIndex(TableView *table, ssize_t idx)
{
	CCString *string = CCString::create(p[idx].name+":"+StringUtils::format("%d",p[idx].score));

    // �����ö����л�ȡһ��cell Ȼ���ж�cell�Ƿ�Ϊ�� ��Ϊ���򴴽�һ���µ�
    TableViewCell *cell = table->dequeueCell();
    
    if (!cell) {
		//����һ���µ�cell
        cell = new TableViewCell();
		//���뵽�Զ��ͷų���
        cell->autorelease();

		// ����
		LabelTTF *label = LabelTTF::create(string->getCString(), "Arial", 20.0);
		label->setPosition(Vec2::ZERO);
		label->setAnchorPoint(Vec2::ZERO);
        label->setTag(100);
        cell->addChild(label);
    }
    else
    {
        // ���cell��Ϊ��,�����tag��ȡ��֮ǰcell�д�ŵ�Ԫ��,����Ԫ����Ϣ����
		//��ȡ��ǰcell�е�label
        LabelTTF *label = (LabelTTF*)cell->getChildByTag(100);
		//����label�������Ϣ
		label->setString(string->getCString());
    }
      
    return cell;  
}

//����cell�ĸ��� ��һ��tableview�а�����20��cell
ssize_t RankList::numberOfCellsInTableView(TableView *table)
{
	return max_range;
}

// �����¼�
bool RankList::onTouchBegan(CCTouch* touch, CCEvent* ev)  
{  
    //�����ж��Ƿ�����˿ؼ�  
    bool isClicked = textEdit->boundingBox().containsPoint(touch->getLocation());  
	bool isClicked2 = textEdit2->boundingBox().containsPoint(touch->getLocation());
    //��������˿ؼ�  
	if( isClicked )  {  
        //���������  
        textEdit->attachWithIME();  
    }
	else{
		textEdit->detachWithIME();
	}

	if( isClicked2 )  {  
        //���������  
        textEdit2->attachWithIME();  
    }
	else{
		textEdit2->detachWithIME();
	}

    //��ʾ���ܴ�����Ϣ  
    return true;  
} 

void RankList::menuSubmitCallback(Ref* pSender)
{
	// ��ȡ�ύ�ĳɼ�
	p[max_range].name=textEdit->getString();
	p[max_range].score=std::atoi(textEdit2->getString().c_str());

	bool isExist = false;
	// ����Ƿ��Ѿ������а�
	for( int i = 0 ;i < max_range ; i++ )	{
		if( p[i].name == p[max_range].name )	{
			p[i].score = p[i].score>p[max_range].score?p[i].score:p[max_range].score;
			isExist = true;
			break;
		}
	}

	if( !isExist )	{
		// �Ÿ���ð�ݣ�
		for(int i = 0 ; i < max_range ; i++ )	{
			for( int j = max_range-i ; j > 0 ; j-- )	{
				if( p[j].score > p[j-1].score )	{
					Player temp;
					temp = p[j];
					p[j] = p[j-1];
					p[j-1] = temp;
				}
			}
		}
	}

	// ����XML
	for( int i=1 ; i <= max_range ; i++ )	{
		// �� XML ��Ӧ���ݸ�ֵ
		UD_setString(StringUtils::format("p%d_name",i).c_str(),p[i-1].name);
		UD_setInt(StringUtils::format("p%d_score",i).c_str(),p[i-1].score);
	}

	// ������������Եģ����Բ��ư�
	CCLOG(p[0].name.c_str());
	CCLOG("score:%d",p[0].score);
	CCLOG(p[1].name.c_str());
	CCLOG("score:%d",p[1].score);
	CCLOG(p[2].name.c_str());
	CCLOG("score:%d\n",p[2].score);
}