/**
 * 游戏场景类型
 */
(function (root, factory) {
  root.GameScene = factory(root)
}(this, function (window) {
  var self

  /**
   * 游戏场景类型
   * @param {HTMLElement} element 附着的 HTML 元素（载体容器）
   */
  function GameScene (element, width, height) {
    self = this

    /**
     * 附着元素
     * @type {HTMLElement}
     */
    self.element = element
    /**
     * 宽度
     * @type {Number}
     */
    self.width = width || 50
    /**
     * 高度
     * @type {Number}
     */
    self.height = height || 50

    /**
     * 网格矩阵（每一个元素都是界面上的一个 td）
     * 二维数组，一维是 y(行)，二维是 x(列)
     * @type {Array}
     */
    self.matrix = []
    /**
     * 当前场景中所有的游戏对象
     * @type {Array}
     */
    self.objects = []

    _init()
  }

  /**
   * 初始化操作
   */
  function _init () {
    // 初始化游戏场景
    _initScene()
    // 初始化游戏对象
    _initObjects()
  }

  /**
   * 初始化场景
   */
  function _initScene () {
    // 初始化游戏场景需要的样式
    var cssText = 'table { border-collapse: collapse }\n' +
                  'td { padding: 5px; overflow: hidden; border: 1px dashed #f0f0f0 }\n' +
                  '.primary { background-color: #0275d8 }\n' +
                  '.success { background-color: #5cb85c }\n' +
                  '.info { background-color: #5bc0de }\n' +
                  '.warning { background-color: #f0ad4e }\n' +
                  '.danger { background-color: #d9534f }\n' +
                  '.inverse { background-color: #292b2c }\n' +
                  '.default { background-color: #838c92 }'
    var style = document.createElement('style')
    style.innerHTML = cssText
    self.element.appendChild(style)

    // 初始化游戏场景画布
    var table = document.createElement('table')
    for (var y = 0; y < self.width; y++) {
      var tr = document.createElement('tr')
      self.matrix[y] = []
      for (var x = 0; x < self.height; x++) {
        var td = document.createElement('td')
        tr.appendChild(td)
        self.matrix[y][x] = td
      }
      table.appendChild(tr)
    }
    self.element.appendChild(table)
  }

  /**
   * 初始化默认游戏对象
   */
  function _initObjects () {
    // 玩家蛇
    var player = new Snake(10, 10)
    self.objects.push(player)
    // 食物
    var food = Food.randomGenerate(self.width, self.height)
    self.objects.push(food)
  }

  var startTimestamp
  var lastTimestamp
  function _frame (timestamp) {
    // 忽略程序启动到第一帧之间的时间差
    startTimestamp = startTimestamp || timestamp
    timestamp = timestamp - startTimestamp
    // 计算距离上一帧的时间差
    var timespan = timestamp - (lastTimestamp || 0)
    lastTimestamp = timestamp

    self.objects.forEach(function (item) {
      if (item.update && item.render) {
        // 钩子参数
        var e = {
          matrix: self.matrix,
          timespan: timespan
        }
        item.update(e)
        item.render(e)
        return
      }

      throw new Error('GameObject requires update and render!')
    })

    window.requestAnimationFrame(_frame)
  }

  GameScene.prototype = {
    bootstrap: function () {
      window.requestAnimationFrame(_frame)
    }
  }

  return GameScene
}))

// /**
//  * 游戏场景
//  * @param {HTMLElement} container 容器
//  */
// var GameScene = (function () {
//   var startTimestamp
//   var lastTimestamp

//   /**
//    * 初始化游戏场景所需画布（table）
//    * @param  {Number} size 画布尺寸（建议 50-150 之间）
//    * @return {HTMLElement} 游戏场景所需画布（table）
//    */
//   function initTable (size) {
//     var cssText = 'table { border-collapse: collapse }' +
//                   'td { padding: 5px; overflow: hidden; border: 1px dashed #f0f0f0 }' +
//                   '.primary { background-color: #0275d8 }' +
//                   '.success { background-color: #5cb85c }' +
//                   '.info { background-color: #5bc0de }' +
//                   '.warning { background-color: #f0ad4e }' +
//                   '.danger { background-color: #d9534f }' +
//                   '.inverse { background-color: #292b2c }' +
//                   '.default { background-color: #838c92 }'

//     // 初始化游戏场景需要的样式
//     var style = document.createElement('style')
//     style.innerHTML = cssText
//     document.head.append(style)

//     // 初始化游戏场景画布
//     var table = document.createElement('table')
//     for (var y = 0; y < size; y++) {
//       var tr = document.createElement('tr')
//       for (var x = 0; x < size; x++) {
//         var td = document.createElement('td')
//         tr.appendChild(td)
//       }
//       table.appendChild(tr)
//     }

//     // 返回画布
//     return table
//   }

//   function frame (timestamp) {
//     startTimestamp = startTimestamp || timestamp
//     timestamp = timestamp - startTimestamp

//     var timespan = timestamp - (lastTimestamp || 0)
//     lastTimestamp = timestamp

//     // log FPS
//     this.fps = `${(1000 / timespan).toFixed(2)} FPS`

//     var _this = this
//     this.objects.forEach(function (obj) {
//       obj.update && obj.update(timespan, _this.currentKeyCode)
//       obj.render && obj.render(_this.table)
//     })

//     window.requestAnimationFrame(frame.bind(this))
//   }

//   function GameScene (container, size) {
//     size = size || 80

//     // 记录成员
//     this.container = container
//     this.table = initTable(size)

//     // 将画布放置到游戏容器中
//     this.container.appendChild(this.table)

//     // 初始化玩家蛇
//     var player = new Snake({ x: 10, y: 10 }, 4)

//     window.player = player

//     // 创建一个食物
//     var food = Food.randomGenerate({ x:0, y: 0 }, { x:size, y: size })

//     // 初始化游戏对象集合（玩家蛇和目标事物都是游戏对象）
//     this.objects = []
//     this.objects.push(player)
//     this.objects.push(food)
//   }

//   GameScene.prototype.bootstrap = function () {
//     window.addEventListener('keydown', function (e) {
//       this.currentKeyCode = e.keyCode
//     }.bind(this))
//     window.requestAnimationFrame(frame.bind(this))
//   }

//   return GameScene
// }())
