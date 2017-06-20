/**
 * 食物类型
 */
(function (root, factory) {
  root.Food = factory(root)
}(this, function (window) {
  /**
   * 食物类型
   * @param {Number} x    第几列
   * @param {Number} y    第几行
   * @param {String} type 类型
   */
  function Food (x, y, type) {
    this.position.x = x
    this.position.y = y
    this.point = new Point(x, y, type)
    // 闪烁速度
    this.speed = 4
  }

  /**
   * 随机生成一个食物
   * @param  {Number} width  最大 X
   * @param  {Number} height 最大 Y
   * @return {Food}          食物对象
   */
  Food.randomGenerate = function (width, height) {
    var x = Math.floor(Math.random() * width)
    var y = Math.floor(Math.random() * height)
    var types = ['primary', 'success', 'info', 'warning', 'danger']
    var type = types[Math.floor(Math.random() * types.length)]
    return new Food(x, y, type)
  }

  Food.prototype = new GameObject()

  var show = true
  var prevType = ''
  /**
   * 闪烁显示
   * @param  {Point} point 被闪烁的点
   */
  function blink (point) {
    if (show) {
      prevType = point.type
      point.type = ''
      show = false
    } else {
      point.type = prevType
      show = true
    }
  }

  var timer = 0
  Food.prototype.update = function (e) {
    timer += e.timespan
    if (timer >= (1000 / this.speed)) {
      // 闪烁
      blink(this.point)
      timer = 0
    }
  }

  Food.prototype.render = function (e) {
    this.point.render(e.matrix)
  }

  return Food
}))
