/**
 * 玩家蛇类型
 */
(function (root, factory) {
  root.Snake = factory(root)
}(this, function (window) {
  /**
   * 玩家蛇类型
   */
  function Snake (x, y, length, direction, speed) {
    /**
     * 蛇头位置
     * @type {Object}
     */
    this.position = { x: x, y: y }
    /**
     * 长度
     * @type {Number}
     */
    this.length = length || 4
    /**
     * 位移方向
     * @type {String}
     */
    this.direction = direction || 'right'
    /**
     * 移动速度
     * @type {Number}
     */
    this.speed = speed || 4

    /**
     * 蛇身数组
     * @type {Array}
     */
    this.body = _initBody(this.position, this.length, this.direction)

    // TODO: where it is
    window.addEventListener('keydown', function (e) {
      switch (e.keyCode) {
        case 37:
          if (this.direction === 'up' || this.direction === 'down') this.direction = 'left'
          break
        case 38:
          if (this.direction === 'left' || this.direction === 'right') this.direction = 'up'
          break
        case 39:
          if (this.direction === 'up' || this.direction === 'down') this.direction = 'right'
          break
        case 40:
          if (this.direction === 'left' || this.direction === 'right') this.direction = 'down'
          break
      }
    }.bind(this))
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
   * @param  {Array}  body      蛇身数组
   * @param  {String} direction 方向
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
    body.unshift(head)
    body[1].type = 'default'
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
    _add(body, direction)
    _remove(body)
  }

  Snake.prototype = new GameObject()

  var timer = 0
  Snake.prototype.update = function (e) {
    timer += e.timespan
    if (timer >= (1000 / this.speed)) {
      _move(this.body, this.direction)
      timer = 0
    }
  }

  Snake.prototype.render = function (e) {
    this.body.forEach(function (point) {
      point.render(e.matrix)
    })
  }

  return Snake
}))


// // ========== snake.js ==========

// /**
//  * 玩家蛇构造函数
//  * @param {Object} position  蛇头所在位置
//  * @param {Number} length    蛇身长度
//  * @param {String} direction 初始方向
//  */
// var Snake = (function () {
//   function Snake (position, length, direction, speed) {
//     length = length || 4

//     this.direction = direction || 'right'
//     this.speed = speed || 2

//     // 初始化身体部分的点
//     this.body = []
//     for (var i = 0; i < length; i++) {
//       var type = i ? 'default' : 'inverse'
//       var offset
//       switch (this.direction) {
//         case 'up':
//           offset = { x: 0, y: i }
//           break
//         case 'down':
//           offset = { x: 0, y: -i }
//           break
//         case 'left':
//           offset = { x: i, y: 0 }
//           break
//         case 'right':
//           offset = { x: -i, y: 0 }
//           break
//         default:
//           break
//       }
//       var point = new Point(position.x + offset.x, position.y + offset.y, type)
//       this.body.push(point)
//     }
//   }

//   /**
//    * 添加一个点
//    */
//   function add (snake) {
//     var head = new Point(snake.body[0].position.x, snake.body[0].position.y, 'inverse')
//     // 位置为当前蛇头的下一个点
//     switch (snake.direction) {
//       case 'up':
//         head.position.y += -1
//         break
//       case 'down':
//         head.position.y += 1
//         break
//       case 'left':
//         head.position.x += -1
//         break
//       case 'right':
//         head.position.x += 1
//         break
//     }
//     snake.body.unshift(head)
//     snake.body[1].type = 'default'
//   }

//   /**
//    * 移除一个点
//    */
//   function remove (snake) {
//     var removed = snake.body.pop()
//     removed.clear()
//   }

//   /**
//    * 位移
//    */
//   function move (snake) {
//     add(snake)
//     remove(snake)
//   }

//   var timer = 0

//   Snake.prototype.update = function (timespan, keycode) {
//     timer += timespan
//     if (timer >= 1000 / this.speed) {
//       move(this)
//       timer = 0
//     }

//     switch (keycode) {
//       case 37:
//         if (this.direction === 'up' || this.direction === 'down') this.direction = 'left'
//         break
//       case 38:
//         if (this.direction === 'left' || this.direction === 'right') this.direction = 'up'
//         break
//       case 39:
//         if (this.direction === 'up' || this.direction === 'down') this.direction = 'right'
//         break
//       case 40:
//         if (this.direction === 'left' || this.direction === 'right') this.direction = 'down'
//         break
//     }
//   }

//   /**
//    * 将这条蛇绘制到画布中
//    * @param  {HTMLElement} table 画布表格
//    */
//   Snake.prototype.render = function (table) {
//     this.body.forEach(function (point) {
//       point.render(table)
//     })
//   }

//   return Snake
// }())
