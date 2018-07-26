import Databus from 'Databus'
import BasePool from 'BasePool'
import MathUtil from "MathUtil"
import UnitManager from 'UnitManager'

cc.Class({
	extends: cc.Component,
	
	Init(x, y, p) {
		this.power = p
		this.node.x = x
		this.node.y = y
		this.speed = this.node.height / 2
		this.top = this.node.y + this.node.height / 2
		this.left = this.node.x - this.node.width / 2
		this.right = this.node.x + this.node.width / 2
		this.is_valid = true
	}

	update() {
		if (!this.is_valid) {
			return
		}

		this.node.y += this.speed

		//检测子弹是否碰撞到球体
		var ballPool = UnitManager.GetAllBall()
		for (var i = 0; i < ballPool.length; i++) {
			var ball = ballPool[i]
			if (MathUtil.HitTest(this.node, ball.node)) {
				ball.ReduceScore(this.power)
				this.is_valid = false
				UnitManager.RecycleBullet(this)
				return
			}
		}

		//检测子弹是否飞出屏幕边界
		if (this.top >= Databus.screenTop) {
			this.is_valid = false
			UnitManager.RecycleBullet(this)
			return
		}
	}
})