import { useEffect, useState } from 'react'

/**
 * 自定义 Hook ≈ Vue 的 composable（useXXX）
 * 把「状态 + 定时器 + 清理」这段逻辑抽出来，任何组件都能复用。
 *
 * 注意：Hook 名字必须以 use 开头，且只能在组件或其他 Hook 里调用。
 */
export function useClock() {
  // 惰性初始值：传函数，只在首次渲染时计算一次
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    // 清理函数 ≈ Vue 的 onUnmounted，组件卸载时清掉定时器
    return () => clearInterval(timer)
  }, [])

  return new Date(now).toLocaleTimeString('zh-CN')
}
