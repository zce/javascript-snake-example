;(function (window, document, undefined) {
  var container = document.getElementById('container')

  // 创建一个游戏场景
  var gameScene = new GameScene(container)

  // 启动游戏场景
  gameScene.bootstrap()
}(window, document))
