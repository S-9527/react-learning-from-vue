import { memo, useCallback, useMemo, useState } from 'react'
import PageCard from '../components/PageCard.tsx'

/** React.memo：props 不变就跳过重新渲染 ≈ Vue 组件的按需更新 */
const ChildButton = memo(function ChildButton({ onClick }: { onClick: () => void }) {
  console.log('ChildButton 渲染')
  return <button onClick={onClick}>子按钮</button>
})

export default function MemoDemo() {
  const [price, setPrice] = useState(10)
  const [count, setCount] = useState(1)
  const [unrelated, setUnrelated] = useState(0)

  // useMemo ≈ Vue 的 computed：依赖不变就复用上次计算结果
  const total = useMemo(() => price * count, [price, count])

  // useCallback：缓存函数引用，配合 React.memo 避免子组件无意义重渲染
  const handleClick = useCallback(() => console.log('子按钮被点击'), [])

  // 无依赖的 useMemo：只算一次，约等于 Vue 里无依赖的 computed（缓存死值）
  const fixedTimestamp = useMemo(() => Date.now(), [])

  return (
    <PageCard
      title="计算：useMemo / useCallback"
      hint="useMemo ≈ computed；但 useMemo 只是性能优化，不保证缓存永不被丢弃。"
    >
      <h3>1. computed 对照</h3>
      <p className="result">price × count = {total}</p>
      <div className="actions">
        <button onClick={() => setPrice((p) => p + 1)}>price +1</button>
        <button onClick={() => setCount((c) => c + 1)}>count +1</button>
        <button onClick={() => setUnrelated((n) => n + 1)}>无关状态 +1（{unrelated}）</button>
      </div>
      <p className="code-note">改无关状态时，total 不会重新计算 —— 和 computed 一样。</p>

      <h3>2. useCallback + React.memo</h3>
      <ChildButton onClick={handleClick} />

      <h3>3. 一个经典的坑</h3>
      <p className="result">fixedTimestamp = {fixedTimestamp}</p>
      <p className="code-note">
        computed(() =&gt; Date.now()) 没有响应式依赖，值会永远固定。<br />
        React 里 useMemo(() =&gt; Date.now(), []) 行为一致。<br />
        想要真正的时间，请看 /effect 页面的 useClock。
      </p>
    </PageCard>
  )
}
