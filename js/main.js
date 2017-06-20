/* global GameScene */

/**
 * 应用程序入口
 */

;(function (window) {
  // 界面元素载体
  var container = window.document.getElementById('container')

  // 创建一个游戏场景
  var gameScene = new GameScene(container)

  // 启动游戏场景
  gameScene.bootstrap()
}(window))
