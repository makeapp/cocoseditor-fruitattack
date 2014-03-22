/**
 * @GameName :
 * FruitAttack
 *
 * @DevelopTool:
 * Cocos2d-x Editor (CocosEditor)
 *
 * @time
 * 2014-03-25 am
 *
 * @Licensed:
 * This showcase is licensed under GPL.
 *
 * @Authors:
 * Programmer id: touchSnow
 *
 * @Links:
 * http://www.cocos2d-x.com/ (cocos官方)
 * http://blog.csdn.net/touchsnow (csdn博客)
 * http://blog.makeapp.co/ （官方博客）
 * http://www.cocoseditor.com/ （建设中官网）
 *
 * @Contact
 * 邮箱：zuowen@makeapp.co
 * qq群：232361142
 *
 */

cc.s_sharedNotificationCenter = null;

cc.NotificationCenter = cc.Class.extend({
    ctor:function() {
        this._observers = [];
    },

    /**
     * @param {cc.Class} target
     * @param {String} selector
     * @param {String} name
     * @param {cc.Class} obj
     */
    addObserver:function(target, selector, name, obj) {
        if (this._observerExisted(target, name))
            return;

        var observer = new cc.NotificationObserver(target, selector, name, obj);
        if (!observer)
            return;

        this._observers.push(observer);
    },

    /**
     * Removes the observer by the specified target and name.
     * @param {cc.Class} target
     * @param {String} name
     */
    removeObserver:function(target, name) {
        for (var i = 0; i < this._observers.length; i++) {
            var observer = this._observers[i];
            if (!observer)
                continue;
            if (observer.getName() == name && observer.getTarget() == target) {
                this._observers.splice(i, 1);
                return;
            }
        }
    },

    /**
     * Removes all notifications registered by this target
     * @param {cc.Class} target  The target of this notification.
     * @returns {number} the number of observers removed
     */
    removeAllObservers:function(target){
        var removes = [];
        for(var i = 0; i< this._observers.length;i++){
            var selObserver = this._observers[i];
            if(selObserver.getTarget() == target)
                removes.push(selObserver);
        }
        cc.ArrayRemoveArray(this._observers, removes);
        return removes.length;
    },

    /**
     * @param {String} name
     * @param {cc.Class} object
     */
    postNotification:function(name, object) {
        for (var i = 0; i < this._observers.length; i++) {
            var observer = this._observers[i];
            if (!observer)
                continue;
            if (observer.getName() == name)
                observer.performSelector(object);
        }
    },

    /**
     * @param {cc.Class} target
     * @param {String} name
     * @return {Boolean}
     * @private
     */
    _observerExisted:function(target, name) {
        for (var i = 0; i < this._observers.length; i++)
        {
            var observer = this._observers[i];
            if (!observer)
                continue;
            if (observer.getName() == name && observer.getTarget() == target)
                return true;
        }
        return false;
    },
    _observers:null
});

/**
 * @return {cc.NotificationCenter}
 */
cc.NotificationCenter.getInstance = function() {
    if (!cc.s_sharedNotificationCenter) {
        cc.s_sharedNotificationCenter = new cc.NotificationCenter();
    }
    return cc.s_sharedNotificationCenter;
};

cc.NotificationObserver = cc.Class.extend({
    /**
     * @param {cc.Class} target
     * @param {String} selector
     * @param {String} name
     * @param {cc.Class} obj
     */
    ctor:function (target, selector, name, obj) {
        this._target = target;
        this._selector = selector;
        this._name = name;
        this._object = obj;
    },

    /**
     * @param {cc.Class} obj
     */
    performSelector:function (obj) {
        if (this._target && (typeof(this._selector) == "string")) {
            this._target[this._selector](obj);
        } else if (this._target && (typeof(this._selector) == "function")) {
            this._selector.call(this._target, obj);
        } else {
            this._selector(obj);
        }
    },

    _target:null,
    _selector:null,
    _name:null,
    _object:null,

    /**
     * @return {cc.Class}
     */
    getTarget:function () {
        return this._target;
    },

    /**
     * @return {String}
     */
    getSelector:function () {
        return this._selector;
    },

    /**
     * @return {String}
     */
    getName:function () {
        return this._name;
    },

    /**
     * @return {cc.Class}
     */
    getObject:function () {
        return this._object;
    }
});