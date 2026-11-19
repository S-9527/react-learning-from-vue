import { useEffect, useState } from 'react'
import PageCard from '../components/PageCard.tsx'
import { useClock } from '../hooks/useClock.ts'

export default function EffectDemo() {
  const [count, setCount] = useState(0)
  const time = useClock() // 自定义 Hook，内部就是 useState + useEffect + setInterval

  // 空依赖数组 [] → 只在挂载后执行一次 ≈ Vue 的 onMounted
  useEffect(() => {
    console.log('组件挂载完成 ≈ onMounted')
  }, [])

  // 带依赖 [count] → count 变化时执行 ≈ Vue 的 watch
  useEffect(() => {
    console.log('count 变化了 ≈ watch：', count)
  }, [count])

  return (
    <PageCard
      title="副作用：useEffect"
      hint="[] ≈ onMounted；[count] ≈ watch；返回的清理函数 ≈ onUnmounted"
    >
      <h3>1. 生命周期对照</h3>
      <p className="code-note">
        打开 F12 控制台，切换页面时能看到日志。<br />
        因为 StrictMode，开发环境会打印两次，生产环境只打印一次。
      </p>

      <h3>2. watch 效果</h3>
      <p className="result">count = {count}</p>
      <div className="actions">
        <button onClick={() => setCount((c) => c + 1)}>点我触发 watch</button>
      </div>

      <h3>3. 自定义 Hook：实时时钟</h3>
      <p className="result big-result">{time}</p>
      <p className="code-note">
        useClock() 内部用 setInterval 每秒更新日期，卸载时 clearInterval 清理。<br />
        Vue 里对应的是 composable：ref + setInterval + onUnmounted。
      </p>
    </PageCard>
  )
}
