import Databus from 'Databus'
import BasePool from 'BasePool'
import UnitManager from 'UnitManager'

cc.Class({
	extends: cc.Component,
	
	Init(x, y, p) {
		this.speed = 10
		this.power = p
		this.node.x = x
		this.node.y = y
		this.top = this.node.y + this.node.height / 2
		this.left = this.node.x - this.node.width / 2
		this.right = this.node.x + this.node.width / 2
		this.is_valid = true
	}

	upload() {
		if (!this.is_valid) {
			return
		}

		this.node.y++

		//检测子弹是否碰撞到球体
		var ballPool = UnitManager.GetAllBall()
		for (var i = 0; i < ballPool.length; i++) {
			var ball = ballPool[i]
			if (this.right >= ball.left && this.left <= ball.right && this.up >= ball.buttom) {
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