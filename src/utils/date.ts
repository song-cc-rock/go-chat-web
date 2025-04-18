export function formatTimestamp(timestamp: number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const date = new Date(timestamp * 1000) // 如果是秒级时间戳（10位），需要乘1000；毫秒级不需要处理

  const padZero = (num: number): string => (num < 10 ? '0' + num : '' + num)

  const Y = date.getFullYear()
  const M = padZero(date.getMonth() + 1)
  const D = padZero(date.getDate())
  const H = padZero(date.getHours())
  const m = padZero(date.getMinutes())
  const s = padZero(date.getSeconds())

  // 可扩展多种格式
  switch (format) {
    case 'YYYY-MM-DD':
      return `${Y}-${M}-${D}`
    case 'HH:mm':
      return `${H}:${m}`
    case 'YYYY/MM/DD HH:mm':
      return `${Y}/${M}/${D} ${H}:${m}`
    case 'YYYY-MM-DD HH:mm:ss':
    default:
      return `${Y}-${M}-${D} ${H}:${m}:${s}`
  }
}
