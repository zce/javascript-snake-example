/**
 * 游戏场景类型
 */

(function (root, factory) {
  root.GameScene = factory(root, root.Snake, root.Food)
}(this, function (window, Snake, Food) {
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

    /**
     * 是否游戏结束
     * @type {Boolean}
     */
    self.isGameover = false

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
    // ---------- 初始化游戏场景需要的样式 ----------
    var cssText = 'table { float: left; border-collapse: collapse }\n' +
                  'td { padding: 5px; overflow: hidden; border: 1px dashed #f0f0f0 }\n' +
                  '.success { background-color: #5cb85c }\n' +
                  '.info { background-color: #5bc0de }\n' +
                  '.warning { background-color: #f0ad4e }\n' +
                  '.danger { background-color: #d9534f }\n' +
                  '.inverse { background-color: #292b2c }\n' +
                  '.default { background-color: #838c92 }'
    var style = document.createElement('style')
    style.innerHTML = cssText
    self.element.appendChild(style)

    // ---------- 初始化游戏场景画布 ----------
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

    // ---------- 初始化图例说明 ----------
    var intro = document.createElement('table')
    intro.style.margin = '50px'
    var types = {
      success: '加强食物 +2',
      info: '正常食物 +1',
      warning: '中毒 -1',
      danger: '障碍物',
      inverse: '蛇头',
      default: '蛇身'
    }
    Object.keys(types).forEach(function (type) {
      var td1 = document.createElement('td')
      td1.className = type
      td1.width = 22
      var td2 = document.createElement('td')
      td2.innerHTML = types[type]
      var tr = document.createElement('tr')
      tr.appendChild(td1)
      tr.appendChild(td2)
      intro.appendChild(tr)
    })
    self.element.appendChild(intro)
  }

  /**
   * 初始化默认游戏对象
   */
  function _initObjects () {
    // 玩家蛇
    var player = new Snake(10, 10).start({ scene: self })
    self.objects.push(player)
    // 食物
    var food = Food.randomGenerate(self.width, self.height).start({ scene: self })
    self.objects.push(food)
  }

  var startTimestamp
  var lastTimestamp
  function _frame (timestamp) {
    // 游戏是否结束
    if (self.isGameover) {
      return window.alert('GAME OVER')
    }

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
