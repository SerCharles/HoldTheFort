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

	// 文本框
	textEdit = CCTextFieldTTF::textFieldWithPlaceHolder("Please input name:","Arial", 24);  
	textEdit->setPosition(Vec2(visibleSize.width/2, visibleSize.height-textEdit->getContentSize().height*3 ));  
	textEdit->setColorSpaceHolder(Color3B::BLUE);
    this->addChild(textEdit);  
	
	// 创建文本框（2）
	textEdit2 = CCTextFieldTTF::textFieldWithPlaceHolder("Please input score:", "Arial", 24);
	textEdit2->setPosition(Vec2(visibleSize.width/2,visibleSize.height-textEdit->getContentSize().height*6));
	this->addChild(textEdit2);

	 //当触摸到控件的时候弹出软键盘  
    setTouchMode(kCCTouchesOneByOne);  
    setTouchEnabled(true);  

	// 提交按钮
	auto submitItem = MenuItemFont::create("Submit",CC_CALLBACK_1(RankList::menuSubmitCallback,this));
	submitItem->setColor(Color3B::YELLOW);
	submitItem->setPosition(Vec2(visibleSize.width/2,visibleSize.height-textEdit->getContentSize().height*9));
	
	auto menu = Menu::create(submitItem, NULL);
    menu->setPosition(Vec2::ZERO);
    this->addChild(menu, 1);

	// 获取数据
	if(!UD_getBool("isExist", false))	{
        UD_setBool("isExist",true);
		
		for( int i=1 ; i <= max_range ; i++ )	{
			// 给 XML 相应内容赋值
			UD_setString(StringUtils::format("p%d_name",i).c_str(),"name");
			UD_setInt(StringUtils::format("p%d_score",i).c_str(),0);

			// 给数组相应内容赋值
			p[i-1].name = "name";
			p[i-1].score = 0;
		}

    }
	else  {
		for( int i=1 ; i <= max_range ; i++ )	{
			// 获取 XML 内容
			p[i-1].name = UD_getString(StringUtils::format("p%d_name",i).c_str());
			p[i-1].score = UD_getInt(StringUtils::format("p%d_score",i).c_str());	
		}
	}

	//创建一个talbleview 将datasource设置为当前的类的对象 tableview的显示区域大小为 300 * 300
    TableView* tableView = TableView::create(this, CCSizeMake(200,100));
    //设置tableview为水平方向  ScrollView::Direction::VERTICAL 为垂直,ScrollView::Direction::HORIZONTAL 为水平
	tableView->setDirection(ScrollView::Direction::VERTICAL);
	//设置位置
	tableView->setPosition(Vec2(visibleSize.width/2,visibleSize.height/2));
    //设置代理对象
	tableView->setDelegate(this);
	// 填充顺序
	tableView->setVerticalFillOrder(TableView::VerticalFillOrder::TOP_DOWN);
	//添加tableview到当前layer
    this->addChild(tableView);
	//加载tableview
    tableView->reloadData();

    return true;  
}  

//当cell被点击时调用  cell->getIdx()获取当前点击cell的编号
void RankList::tableCellTouched(TableView* table, TableViewCell* cell)
{
	// 在输出窗口打印出，当前cell的编号
    CCLOG("cell touched at index: %i", cell->getIdx());
}

//设置编号为 idx 的cell的大小  此处都为100*100
Size RankList::tableCellSizeForIndex(TableView *table, ssize_t idx)
{
    return CCSizeMake(60, 60);
}

//由于tableview是动态获取数据的，该方法在初始化时会被调用一次，之后在每个隐藏的cell显示出来的时候都会调用
TableViewCell* RankList::tableCellAtIndex(TableView *table, ssize_t idx)
{
	CCString *string = CCString::create(p[idx].name+":"+StringUtils::format("%d",p[idx].score));

    // 在重用队列中获取一个cell 然后判断cell是否为空 不为空则创建一个新的
    TableViewCell *cell = table->dequeueCell();
    
    if (!cell) {
		//创建一个新的cell
        cell = new TableViewCell();
		//加入到自动释放池中
        cell->autorelease();

		// 名称
		LabelTTF *label = LabelTTF::create(string->getCString(), "Arial", 20.0);
		label->setPosition(Vec2::ZERO);
		label->setAnchorPoint(Vec2::ZERO);
        label->setTag(100);
        cell->addChild(label);
    }
    else
    {
        // 如果cell不为空,则根据tag获取到之前cell中存放的元素,并将元素信息重置
		//获取当前cell中的label
        LabelTTF *label = (LabelTTF*)cell->getChildByTag(100);
		//重置label的相关信息
		label->setString(string->getCString());
    }
      
    return cell;  
}

//设置cell的个数 即一个tableview中包含了20个cell
ssize_t RankList::numberOfCellsInTableView(TableView *table)
{
	return max_range;
}

// 触摸事件
bool RankList::onTouchBegan(CCTouch* touch, CCEvent* ev)  
{  
    //用于判断是否点中了控件  
    bool isClicked = textEdit->boundingBox().containsPoint(touch->getLocation());  
	bool isClicked2 = textEdit2->boundingBox().containsPoint(touch->getLocation());
    //如果点中了控件  
	if( isClicked )  {  
        //弹出软键盘  
        textEdit->attachWithIME();  
    }
	else{
		textEdit->detachWithIME();
	}

	if( isClicked2 )  {  
        //弹出软键盘  
        textEdit2->attachWithIME();  
    }
	else{
		textEdit2->detachWithIME();
	}

    //表示接受触摸消息  
    return true;  
} 

void RankList::menuSubmitCallback(Ref* pSender)
{
	// 获取提交的成绩
	p[max_range].name=textEdit->getString();
	p[max_range].score=std::atoi(textEdit2->getString().c_str());

	bool isExist = false;
	// 玩家是否已经在排行榜
	for( int i = 0 ;i < max_range ; i++ )	{
		if( p[i].name == p[max_range].name )	{
			p[i].score = p[i].score>p[max_range].score?p[i].score:p[max_range].score;
			isExist = true;
			break;
		}
	}

	if( !isExist )	{
		// 排个序（冒泡）
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

	// 存入XML
	for( int i=1 ; i <= max_range ; i++ )	{
		// 给 XML 相应内容赋值
		UD_setString(StringUtils::format("p%d_name",i).c_str(),p[i-1].name);
		UD_setInt(StringUtils::format("p%d_score",i).c_str(),p[i-1].score);
	}

	// 这里，是用来测试的，忽略不计吧
	CCLOG(p[0].name.c_str());
	CCLOG("score:%d",p[0].score);
	CCLOG(p[1].name.c_str());
	CCLOG("score:%d",p[1].score);
	CCLOG(p[2].name.c_str());
	CCLOG("score:%d\n",p[2].score);
}