/**
 * ResourceManager
 * @auhor clairli
 */
export default class ResourceManager {
    constructor() {

    }

    static LoadRemoteSprite(sp, imageUrl) {
        cc.loader.load(imageUrl, function(err, texture){
            var width = texture.width
            var height = texture.height
            var frame = new cc.SpriteFrame(texture)
            sp.spriteFrame = frame
        })
    }
}