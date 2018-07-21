/**
 * MathUtil
 * @auhor clairli
 */
let instance
export default class MathUtil {
    constructor() {

    }

    static Shuffle(arr) {
        var result = [],
            random;
        while(arr.length>0){
            random = Math.floor(Math.random() * arr.length);
            result.push(arr[random])
            arr.splice(random, 1)
        }
        return result;
    }

    static HitTest(node1, node2){
        var x01 = node1.x - node1.width * 0.5
        var x02 = node1.x + node1.width * 0.5
        var x11 = node2.x - node2.width * 0.5
        var x12 = node2.x + node2.width * 0.5
        var y01 = node1.y - node1.height * 0.5
        var y02 = node1.y + node1.height * 0.5
        var y11 = node2.y - node2.height * 0.5
        var y12 = node2.y + node2.height * 0.5

        var zx = Math.abs(x01 + x02 - x11 - x12)
        var x = Math.abs(x01 - x02) + Math.abs(x11 - x12)
        var zy = Math.abs(y01 + y02 - y11 - y12)
        var y = Math.abs(y01 - y02) + Math.abs(y11 - y12)
        if (zx <= x && zy <= y)
            return true
        else
            return false
    }
}