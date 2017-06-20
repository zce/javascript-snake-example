/**
 * 矩阵中的点类型
 */

(function (root, factory) {
  root.Point = factory()
}(this, function () {
  /**
   * 矩阵中的点类型
   * @param {Number} x    第几列
   * @param {Number} y    第几行
   * @param {String} type 类型
   */
  function Point (x, y, type) {
    this.type = type || 'default'
    this.x = x
    this.y = y
    this.element = null
  }

  Point.prototype = {
    /**
     * 将这个点绘制到画布中
     * @param  {Array} matrix 单元格矩阵
     */
    render: function (matrix) {
      if (!matrix) throw new Error('The matrix parameter is required!')
      this.element = matrix[this.y][this.x]
      this.element && (this.element.className = this.type)
    },

    /**
     * 将这个点从画布中清空
     */
    clear: function () {
      // 清空已渲染的点
      this.element && (this.element.className = '')
    }
  }

  return Point
}))
