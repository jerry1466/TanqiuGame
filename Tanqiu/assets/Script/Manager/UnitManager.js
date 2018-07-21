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

    CreateBall(callback){
        if(this.ballPool.length > 0)
        {
            callback(this.ballPool.shift());
        }
        else
        {
            this.loadRes("ball", function(instance){
                var ball = instance.addComponent("Ball")
                callback(ball);
            })
        }
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

    CreateBullet(callback){
        if(this.bulletPool.length > 0)
        {
            callback(this.bulletPool.shift());
        }
        else
        {
            this.loadRes("ball", function(instance){
                var bullet = instance.addComponent("Bullet")
                callback(bullet);
            })
        }
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