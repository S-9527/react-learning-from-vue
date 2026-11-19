import { useState } from 'react'
import PageCard from '../components/PageCard.tsx'

/**
 * 子组件：演示 props 和 emit 的对照
 * - props 只读，父传子用属性
 * - 子传父：父传一个回调函数进来，子调用它（Vue 里是 emit）
 */
type CounterProps = {
  title: string
  value: number
  onChange: (next: number) => void
}

function Counter({ title, value, onChange }: CounterProps) {
  return (
    <div className="border-box">
      <p>{title}：当前值 {value}</p>
      <button onClick={() => onChange(value + 1)}>子组件的 +1 按钮</button>
    </div>
  )
}

export default function ComponentDemo() {
  const [value, setValue] = useState(0)

  return (
    <PageCard
      title="组件通信"
      hint="props ≈ defineProps；子传父靠回调 ≈ emit；children ≈ <slot />"
    >
      <h3>1. 父传子 props + 子传父回调</h3>
      <Counter title="计数器" value={value} onChange={setValue} />
      <p className="code-note">
        Vue: 子 defineEmits(['change']) 然后 emit('change', 值)<br />
        React: 父直接传 onChange={'{setValue}'}，子调用 onChange(值)
      </p>

      <h3>2. children（插槽对照）</h3>
      <p className="code-note">
        这个页面外层用的 PageCard 组件，中间的内容就是 children。<br />
        Vue 里对应的是 &lt;slot /&gt;。
      </p>
      <div className="border-box">
        <p>我是被当作 children 传进来的内容</p>
      </div>
    </PageCard>
  )
}
