import CD from "CD"
import Databus from "Databus"

let burnLeft = 0
let burnRight = 1
let needSpliteSize = 5
cc.Class({
	extends: cc.Component,
	// Ball的坐标原点要设置在Ball的圆心
	Init(score) {
		//随机决定ball的出现位置，在屏幕左边还是屏幕右边
		this.burnSide = burnRight
		var random = Math.floor(Math.random() * 10) + 1
		if (random <= 5)
			this.burnSide = burnLeft

		//ball的半径暂时先固定，后续要改成范围内随机值
		//ball的半径大小会决定ball被打破之后是否会分裂成两个新ball
		this.radii = 10

		//ball的初始x坐标在屏幕之外，可以让ball有一种从屏幕外飞入屏幕内的效果
		if (burnLeft == this.burnSide) {
			this.node.x = Databus.screenLeft - this.radii
			//ball的水平移动速度，可随机
			this.speed_x = 5
		} else {
			this.node.x = Databus.screenRight + this.radii
			//ball的水平移动速度，可随机
			this.speed_x = -5
		}
		//ball的垂直移动速度，可随机
		this.speed_y = -5

		//ball的初始y坐标到屏幕顶部的距离不超过整个屏幕的1/5
		random = Math.floor(Math.random() * 100) + 1
		this.node.y = Databus.screenTop - (Databus.screenHeigh / 5) * random / 100
		this.startHeight = this.node.y

		//ball先水平移动startFall_x距离再开始下落，startFall_x最多不超过屏幕宽度的1/4
		random = Math.floor(Math.random() * 100) + 1
		this.startFall_x = (Databus.screeWidth / 4) * random / 100
		this.startFallFlag = false

		//ball的旋转要怎么设定？

		//根据当前score来决定ball的分数范围
		this.value = score
		this.start_value = this.value

		this.rebounceHeight = 0
		this.is_valid = true
	}

	SpliteInit(right, fatherBall) {
		this.value = fatherBall.start_value / 2
		this.start_value = this.value
		this.radii = fatherBall.radii / 2
		this.node.y = fatherBall.node.y
		this.speed_y = fatherBall.speed_y
		this.startFallFlag = true
		this.rebounceHeight = fatherBall.rebounceHeight
		this.is_valid = true
		if (1 == right) {
			//分裂球往右边移动
			this.node.x = fatherBall.node.x + fatherBall.radii + this.radii
			if (this.node.x + this.radii > Databus.screenRight)
				this.node.x = Databus.screenRight - this.radii
			this.speed_x = Math.abs(fatherBall.speed_x)
		} else {
			//分裂球往左边移动
			this.node.x = fatherBall.nodex - fatherBall.radii - this.radii
			if (this.node.x - this.radii < Databus.screenLeft)
				this.node.x = Databus.screenLeft + this.radii
			this.speed_x = 0 - Math.abs(fatherBall.speed_x)
		}
	}

	move() {
		this.node.x += this.speed_x
		
		if (!this.startFallFlag) {
			//判断ball是否达到下落条件
			var dist = null
			if (burnLeft == this.burnSide) {
				dist = this.node.x - this.radii - Databus.screenLeft
			} else {
				dist = Databus.screeRgiht - this.node.x - this.radii
			}
			if (dist >= this.startFall_x)
				this.startFallFlag = true;
		} else {
			this.node.y += this.speed_y
		}

		//判断上下回弹
		if (this.speed_y < 0) {
			//ball向下移动
			if (MathUtil.ButtomBoundaryHitTest(this.node.y - this.radii, Databus.screenButtom)) {
				this.speed_y = 0 - this.speed_y
				//反弹高度等于上次高度的5/6
				this.rebounceHeight = this.startHeight - this.startHeight / 6
			}
		} else {
			//ball向上移动
			if (MathUtil.TopBoundaryHitTest(this.node.y + this.radii, this.rebounceHeight)) {
				this.speed_y = 0 - this.speed_y
				this.startHeight = this.rebounceHeight
			}
		}

		//判断左右回弹
		if (this.speed_x > 0) {
			//ball向右移动
			if (MathUtil.RightBoundaryHitTest(this.node.x + this.radii, Databus.screenRight)) {
				this.speed_x = 0 - this.speed_x
			}
		} else {
			//ball向左移动
			if (MathUtil.LeftBoundaryHitTest(this.node.x - this.radii, Databus.screenLeft)) {
				this.speed_x = 0 - this.speed_x
			}
		}
	}

	hitCannon() {
		var cannon = UnitManager.GetInstance().cannon
		var left = this.node.x - this.node.radii
		var right = this.node.x + this.node.radii
		var buttom = this.node.y - this.node.radii
		var is_hit = false

		if (left <= cannon.node.x + cannon.node.width / 2 &&
			right > cannon.node.x + cannon.node.width / 2 &&
			buttom <= cannon.node.y + cannon.node.height) {
			//碰右边
			is_hit = true
		} else if (right >= cannon.node.x - cannon.node.width / 2 &&
			left < cannon.node.x - cannon.node.width / 2 &&
			buttom <= cannon.node.y + cannon.node.height) {
			//碰左边
			is_hit = true
		} else if ((right <= cannon.node.x + cannon.node.width / 2 &&
			left >= cannon.node.x - cannon.node.width / 2) ||
			(left < cannon.node.x - cannon.node.width / 2 &&
			right > cannon.node.x + cannon.node.width / 2) &&
			buttom <= cannon.node.y + cannon.node.height) {
			//碰中间
			is_hit = true
		}
	}

	splite() {
		if (this.radii < needSpliteSize) {
			return
		}

		var newBall1 = UnitManager.GetInstance().CreateBall()
		newBall1.SpliteInit(0, this)

		var newBall2 = UnitManager.GetInstance().CreateBall()
		newBall2.SpliteInit(1, this)
	}

	ReduceScore(p) {
		this.value -= p
		if (this.value <= 0) {
			this.splite()
			this.is_valid = false;
			UnitManager.GetInstance().RemoveBall(this)
		}
	}

	update() {
		if (!this.is_valid) {
			return
		}

		this.move()
		this.hitCannon()
	}
})

