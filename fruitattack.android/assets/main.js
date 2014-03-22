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


var MUSIC_BACKGROUND = "res/audio/musicByFoxSynergy.mp3";
var EFFECT_BUTTON_CHICK = "res/audio/effect_buttonClick.ogg";
var EFFECT_GAME_FAIL = "res/audio/effect_game_fail.ogg";
var EFFECT_GAME_WIN = "res/audio/effect_game_pass.ogg";
var EFFECT_PATTERN_UN_SWAP = "res/audio/effect_unswap.ogg";
var EFFECT_PATTERN_CLEAR = "res/audio/effect_clearPattern.ogg";
var EFFECT_PATTERN_BOMB = "res/audio/effect_bombPattern.ogg";
var EFFECT_TIME_WARN = "res/audio/effect_timewarning.ogg";

var g_ressources = [
    {src: "res/background.jpg"},
    {src: "res/logo.png"},

    {src: "res/btn/btnStartGameDown.png"},
    {src: "res/btn/btnStartGameNor.png"},

    {src: "res/ProgressBarFront.png"},
    {src: "res/ProgressBarBack.png"},

    {src: "res/baseResource.png"} ,
    {src: "res/baseResource.plist"},
    {src: "res/PatternBg.png"},

    {src: "res/resultLayer/star.png"},
    {src: "res/resultLayer/btnResultRestart.png"},
    {src: "res/resultLayer/btnResultRestartDown.png"},

    {src: MUSIC_BACKGROUND},
    {src: EFFECT_BUTTON_CHICK},
    {src: EFFECT_GAME_FAIL},
    {src: EFFECT_GAME_WIN},
    {src: EFFECT_PATTERN_UN_SWAP},
    {src: EFFECT_PATTERN_CLEAR},
    {src: EFFECT_PATTERN_BOMB},
    {src: EFFECT_TIME_WARN}
];

var gScoreData = {lastScore: 0, bestScore: 0};
var eGameMode = {
    Invalid: -1,
    Challenge: 0,
    Timer: 1,
    Count: 2
};
var gGameMode = eGameMode.Challenge;

//score storage
gScoreData.setLastScore = function (score)
{
    this.lastScore = score;

    if (score > this.bestScore) {
        this.bestScore = score;
        sys.localStorage.setItem('bestScore', this.bestScore);
    }
    sys.localStorage.setItem('lastScore', this.lastScore);
};

gScoreData.initData = function ()
{
    if (sys.localStorage.getItem('gameData') == null) {
        sys.localStorage.setItem('bestScore', '0');
        sys.localStorage.setItem('lastScore', '0');

        sys.localStorage.setItem('gameData', 33);
        return;
    }
    this.bestScore = parseInt(sys.localStorage.getItem('bestScore'));
};

//get js
var appFiles = [
    'src/CCNotificationCenter.js',
    'src/WelcomeLayer.js',
    'src/Pattern.js',
    'src/PatternMatrix.js',
    'src/ResultLayer.js'
];


if (sys.platform == 'browser') {
    var require = function (file)
    {
        var d = document;
        var s = d.createElement('script');
        s.src = file;
        d.body.appendChild(s);
    }
}
else {
    require("jsb.js");
}

cc.debug = function (msg)
{
    cc.log(msg);
}

cc.BuilderReader.replaceScene = function (path, ccbName)
{
    var scene = cc.BuilderReader.loadAsSceneFrom(path, ccbName);
    cc.Director.getInstance().replaceScene(scene);
    return scene;
}

cc.BuilderReader.loadAsScene = function (file, owner, parentSize)
{
    var node = cc.BuilderReader.load(file, owner, parentSize);
    var scene = cc.Scene.create();
    scene.addChild(node);
    return scene;
};

cc.BuilderReader.loadAsSceneFrom = function (path, ccbName)
{
    if (path && path.length > 0) {
        cc.BuilderReader.setResourcePath(path + "/");
        return cc.BuilderReader.loadAsScene(path + "/" + ccbName);
    }
    else {
        return cc.BuilderReader.loadAsScene(ccbName);
    }
}

cc.BuilderReader.loadAsNodeFrom = function (path, ccbName, owner)
{
    if (path && path.length > 0) {
        cc.BuilderReader.setResourcePath(path + "/");
        return cc.BuilderReader.load(path + "/" + ccbName, owner);
    }
    else {
        return cc.BuilderReader.load(ccbName, owner);
    }
}

cc.BuilderReader.runScene = function (module, name)
{
    var director = cc.Director.getInstance();
    var scene = cc.BuilderReader.loadAsSceneFrom(module, name);
    var runningScene = director.getRunningScene();
    if (runningScene === null) {
        director.runWithScene(scene);
    }
    else {
        director.replaceScene(scene);
    }
};

//require js
for (var i = 0; i < appFiles.length; i++) {
    require(appFiles[i]);
}

//ccb res
var ccb_resources = g_ressources;

var gNotification;
var gSpriteFrameCache;
var gSharedEngine;

if (sys.platform == 'browser') {
    var Cocos2dXApplication = cc.Application.extend({
        config: document['ccConfig'],
        ctor: function ()
        {
            this._super();
            cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
            cc.initDebugSetting();
            cc.setup(this.config['tag']);
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        },
        applicationDidFinishLaunching: function ()
        {
            var director = cc.Director.getInstance();
            director.setDisplayStats(true);
            // set FPS. the default value is 1.0/60 if you don't call this
            director.setAnimationInterval(1.0 / this.config['frameRate']);
            var glView = director.getOpenGLView();
            glView.setDesignResolutionSize(320, 480, cc.RESOLUTION_POLICY.SHOW_ALL);
            cc.Loader.preload(ccb_resources, function ()
            {
                gNotification = cc.NotificationCenter.getInstance();
                gSpriteFrameCache = cc.SpriteFrameCache.getInstance();
                gSharedEngine = cc.AudioEngine.getInstance();
                scene = new MyGameScene();
                director.runWithScene(scene);
            }, this);
            return true;
        }
    });
    var myApp = new Cocos2dXApplication();
}
else {
    gNotification = cc.NotificationCenter.getInstance();
    gSpriteFrameCache = cc.SpriteFrameCache.getInstance();
    gSharedEngine = cc.AudioEngine.getInstance();
    var director = cc.Director.getInstance();
    director.setDisplayStats(true);
    director.setAnimationInterval(1.0 / 60);
    var scene = new MyGameScene();
    director.runWithScene(scene);
}