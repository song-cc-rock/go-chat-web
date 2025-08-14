class EventBus {
  private events: Map<string, Array<() => void>> = new Map()

  /**
   * 注册事件监听器
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  on(eventName: string, callback: () => void): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, [])
    }
    this.events.get(eventName)?.push(callback)
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   */
  emit(eventName: string): void {
    const callbacks = this.events.get(eventName)
    if (callbacks) {
      callbacks.forEach(callback => callback())
    }
  }

  /**
   * 移除事件监听器
   * @param eventName 事件名称
   * @param callback 可选，指定要移除的回调函数；不指定则移除所有该事件的监听器
   */
  off(eventName: string, callback?: () => void): void {
    if (!this.events.has(eventName)) return

    if (callback) {
      const callbacks = this.events.get(eventName)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index !== -1) {
          callbacks.splice(index, 1)
        }
      }
    } else {
      this.events.delete(eventName)
    }
  }
}

export default new EventBus()