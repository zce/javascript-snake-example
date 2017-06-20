/**
 * 游戏对象（游戏场景中出现的事物）类型
 */
(function (root, factory) {
  root.GameObject = factory(root)
}(this, function (window) {
  /**
   * 游戏对象（游戏场景中出现的事物）类型
   */
  function GameObject () {
    // position 位置信息（{ x: 0, y: 0 }）
    this.position = { x: 0, y: 0 }
  }

  GameObject.prototype = {
    /**
     * 游戏场景更新钩子，每帧调用一次，优先于 render 执行
     * @param  {Object} e 更新参数
     */
    update: function (e) {
      // console.log('update', this)
    },
    /**
     * 游戏场景渲染钩子，每帧调用一次
     * @param  {Object} e 渲染参数
     */
    render: function (e) {
      // console.log('render', this)
    }
  }

  return GameObject
}))
