/**
 * UnitManager
 * @auhor clairli
 */
import PrefabUtil from "PrefabUtil";

let instance
export default class UnitManager {
    constructor() {
        this.ballList = new Array()
        this.ballPool = new Array()
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
		})
	}

    CreateBall() {
    	var ball = null
        if(this.ballPool.length > 0) {
            ball = this.ballPool.shift()
        } else {
            this.loadRes("ball", function(instance){
                ball = instance.addComponent("Ball")
            })
        }
		ball.Init()
    }

    RemoveBall(ball){
        this.ballList.slice(this.ballList.indexOf(ball), 1)
        this.ballPool.push(ball);
    }

    ClearAllBall(){
        for(var i = this.ballList.length - 1; i >= 0; i--)
        {
            this.RemoveBall(this.ballList[i]);
        }
    }

    CreateBullet(x, y, power){
    	var bullet = null
        if (this.bulletPool.length > 0) {
            bullet = this.bulletPool.shift()
        } else {
            this.loadRes("ball", function(instance) {
                bullet = instance.addComponent("Bullet")
            })
        }
		bullet.Init(x, y, power)
    }

    RemoveBullet(bullet){
        this.bulletList.slice(this.bulletList.indexOf(bullet), 1)
        this.bulletPool.push(bullet);
    }

    ClearAllBullet(){
        for(var i = this.bulletList.length - 1; i >= 0; i--)
        {
            this.RemoveBullet(this.bulletList[i]);
        }
    }

    loadRes(resName, callback){
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