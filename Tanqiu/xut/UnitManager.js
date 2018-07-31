/**
 * UnitManager
 * @auhor clairli
 */
import PrefabUtil from "PrefabUtil";

let instance
export default class UnitManager {
    constructor() {
		this.cannon
        this.ballList = new Array()
        this.ballPool = new Array()
        this.scoreList = new Array()
        this.scorePool = new Array()
        this.bulletList = new Array()
        this.bulletPool = new Array()
    }

    static GetInstance() {
        if (instance == null) {
            instance = new UnitManager()
        }
        return instance
    }

	CreateCannon() {
		this.loadRes("cannon", function(instance) {
			var cannon = instance.addComponent("Cannon")
			cannon.Init()
			this.cannon = cannon
		})
	}

    CreateBall(score) {
    	var ball = null
        if(this.ballPool.length > 0) {
            ball = this.ballPool.shift()
        } else {
            this.loadRes("ball", function(instance){
                ball = instance.addComponent("Ball")
            })
        }
		this.ballList.push(ball)
		ball.Init(score)
    }

    RemoveBall(ball) {
        this.ballList.splice(this.ballList.indexOf(ball), 1)
        this.ballPool.push(ball);
    }

    ClearAllBall() {
        for(var i = this.ballList.length - 1; i >= 0; i--)
        {
            this.RemoveBall(this.ballList[i]);
        }
    }

	GetAllBall() {
		return this.ballList
	}

	CreateScoreBall() {
		var ball = null
        if(this.scorePool.length > 0) {
            ball = this.scorePool.shift()
        } else {
            this.loadRes("ball", function(instance){
                ball = instance.addComponent("Ball")
            })
        }
		this.socreList.push(ball)
	}

	RemoveScoreBall(ball) {
		ball.is_valid = false
		this.scoreList.splice(this.scoreList.indexOf(ball), 1)
        this.scorePool.push(ball);
	}

	ClearAllScoreBall() {
        for(var i = this.scoreList.length - 1; i >= 0; i--)
        {
            this.RemoveBall(this.scoreList[i]);
        }
    }

	GetAllScoreBall() {
		return this.scoreList
	}

    CreateBullet(x, y, power) {
    	var bullet = null
        if (this.bulletPool.length > 0) {
            bullet = this.bulletPool.shift()
        } else {
            this.loadRes("bullet", function(instance) {
                bullet = instance.addComponent("Bullet")
            })
        }
		this.bulletList.push(bullet)
		bullet.Init(x, y, power)
    }

    RemoveBullet(bullet) {
        this.bulletList.splice(this.bulletList.indexOf(bullet), 1)
        this.bulletPool.push(bullet);
    }

    ClearAllBullet() {
        for(var i = this.bulletList.length - 1; i >= 0; i--)
        {
            this.RemoveBullet(this.bulletList[i]);
        }
    }

    loadRes(resName, callback) {
        PrefabUtil.GetPrefabInstance(resName, function(success, instance){
            if(success)
            {
                if(callback != null)
                {
                    callback(instance)
                }
            }
        })
    }
}