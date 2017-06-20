/**
 * 玩家蛇类型
 */

(function (root, factory) {
  root.Snake = factory(root, root.Point, root.GameObject, root.Food)
}(this, function (window, Point, GameObject, Food) {
  var self

  /**
   * 玩家蛇类型
   */
  function Snake (x, y, length, direction, speed) {
    self = this
    /**
     * 蛇头位置
     * @type {Object}
     */
    self.position = { x: x, y: y }
    /**
     * 长度
     * @type {Number}
     */
    self.length = length || 4
    /**
     * 位移方向
     * @type {String}
     */
    self.direction = direction || 'right'
    /**
     * 移动速度
     * @type {Number}
     */
    self.speed = speed || 5

    /**
     * 蛇身数组
     * @type {Array}
     */
    self.body = _initBody(self.position, self.length, self.direction)

    // TODO: 事件在这里注册也不合理
    // 时间差问题
    window.addEventListener('keydown', function (e) {
      switch (e.keyCode) {
        case 37:
          if (self.direction === 'up' || self.direction === 'down') self.direction = 'left'
          break
        case 38:
          if (self.direction === 'left' || self.direction === 'right') self.direction = 'up'
          break
        case 39:
          if (self.direction === 'up' || self.direction === 'down') self.direction = 'right'
          break
        case 40:
          if (self.direction === 'left' || self.direction === 'right') self.direction = 'down'
          break
      }
    })
  }

  /**
   * 初始化身体部分的点
   * @param  {Object} position  蛇头位置
   * @param  {Number} length    长度
   * @param  {String} direction 初始方向
   * @return {Array}            蛇身数组
   */
  function _initBody (position, length, direction) {
    var body = []
    for (var i = 0; i < length; i++) {
      var type = i ? 'default' : 'inverse'
      var offset = { x: 0, y: 0 }
      // 根据方向按顺序排列蛇身
      switch (direction) {
        case 'up':
          offset.y = i
          break
        case 'down':
          offset.y = -i
          break
        case 'left':
          offset.x = i
          break
        case 'right':
          offset.x = -i
          break
        default:
          break
      }
      var point = new Point(position.x + offset.x, position.y + offset.y, type)
      body.push(point)
    }
    return body
  }

  /**
   * 蛇头之前添加一个点
   * @param  {Array}   body      蛇身数组
   * @param  {String}  direction 方向
   * @return {Boolean}           是否需要删除结尾
   */
  function _add (body, direction) {
    var head = new Point(body[0].x, body[0].y, 'inverse')
    // 位置为当前蛇头的下一个点
    switch (direction) {
      case 'up':
        head.y += -1
        break
      case 'down':
        head.y += 1
        break
      case 'left':
        head.x += -1
        break
      case 'right':
        head.x += 1
        break
    }

    // 碰壁判断逻辑
    if (head.x < 0 || head.x >= self.scene.width || head.y < 0 || head.y >= self.scene.height) {
      // 不能再游戏对象中决定游戏结束过后的逻辑，交由场景处理
      self.scene.isGameover = true
      return false
    }

    // 得分判断逻辑
    // TODO: 这么拿游戏场景有点问题（不合理）
    var ateFood = null
    var ate = self.scene.objects.some(function (item) {
      // TODO: 不合理
      if (item === self) return false
      // 不是自身就是得分点
      if (head.x === item.point.x && head.y === item.point.y) {
        ateFood = item
        return true
      }
    })
    if (ate) {
      self.scene.objects.splice(self.scene.objects.indexOf(ateFood), 1)
      // 吃到就要再加一个
      self.scene.objects.push(Food.randomGenerate(self.scene.width, self.scene.height).start({ scene: self.scene }))
    }

    body.unshift(head)
    body[1].type = 'default'
    // 吃到就不追加
    return !ate
  }

  /**
   * 蛇尾移除一个点
   * @param  {Array} body 蛇身数组
   */
  function _remove (body) {
    var removed = body.pop()
    removed.clear()
  }

  /**
   * 移动蛇
   * @param  {Array}  body      身体数组
   * @param  {String} direction 方向
   */
  function _move (body, direction) {
    _add(body, direction) && _remove(body)
  }

  Snake.prototype = new GameObject()

  var timer = 0
  Snake.prototype.update = function (e) {
    timer += e.timespan
    if (timer >= (1000 / self.speed)) {
      _move(self.body, self.direction)
      timer = 0
    }
  }

  Snake.prototype.render = function (e) {
    self.body.forEach(function (point) {
      point.render(e.matrix)
    })
  }

  return Snake
}))
