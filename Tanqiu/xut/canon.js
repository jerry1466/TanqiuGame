import Databus from 'Databus'
import MathUtil from "MathUtil"
import GameInfo from "GameInfo"
import EventUtil from "EventUtil"

let databus = new Databus()
let that
cc.Class({
    extends: cc.Component,
    
    onLoad() {
    },

    update() {
        //校验大炮是否可以移动到指定的位置，并移动大炮
        this.before_x = this.node_x
        if (this.touch_x < this.node.x) {
            if(!MathUtil.LeftBoundaryHitTest(this.touch_x - this.node.width / 2, databus.screenLeft)
                this.node.x = databus.screenLeft + this.node.width / 2
            else
                this.node.x = this.touch_x
        } else {
            if (!MathUtil.RightBoundaryHitTest(this.touch_x + this.node.width / 2, databus.screenRight)
                this.node.x = databus.screenRight - this.node.width / 2
            else
                this.node.x = this.touch_x
        }
        
        //大炮在移动过程中获得了多少分，并根据分数来设置游戏当前的level
        //方法的基本思路就是，所有的分数ball的实例都存放在一个pool里面
        //大炮移动的时候从起点到终点加上大炮的高度就形成一个矩形
        //遍历整个分数ball的pool，筛选出所有坐标落在这个范围内的分数ball，进行加分
        GameInfo.GetInstance().SetScore(this.before_x, this.node.x, this.top)
    },
    
    Init() {
        this.touch_x = 0
        this.score = 0
        this.before_x = 0
        this.top = this.node.y + this.node.height / 2
        that = this
        EventUtil.GetInstance().AddEventListener("CANVAS_TOUCH_START", function(x:number){
			//here x refers to e.touch._point.x
			that.SetPositionX(x);
		})

		EventUtil.GetInstance().AddEventListener("CANVAS_TOUCH_MOVE", function(x:number){
			//here x refers to e.touch._point.x
			that.SetPositionX(x);
		})
    },
	
	SetPositionX(x:number){
		this.node_x = x;
	},
    
    onDestroy() {
    },
})