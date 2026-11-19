import { useState } from 'react'
import PageCard from '../components/PageCard.tsx'

export default function StateDemo() {
  // useState ≈ Vue 的 ref：返回 [当前值, 更新函数]
  const [count, setCount] = useState(0)
  const [user, setUser] = useState({ name: 'Vue 学习者', age: 18 })
  const [todos, setTodos] = useState(['学 useState', '学 useEffect'])
  const [text, setText] = useState('')

  return (
    <PageCard
      title="状态：useState"
      hint="≈ Vue 的 ref / reactive。区别：React 必须调用 setter，且不能直接改原对象 / 原数组。"
    >
      <h3>1. 基础计数器</h3>
      <p className="result">count = {count}</p>
      <div className="actions">
        {/* 函数式更新更安全：拿到的是最新值，避免闭包拿到旧值 */}
        <button onClick={() => setCount((c) => c + 1)}>+1（函数式更新）</button>
        <button onClick={() => setCount(count + 1)}>+1（直接用旧值）</button>
        <button onClick={() => setCount(0)}>重置</button>
      </div>

      <h3>2. 对象更新 —— 必须创建新对象</h3>
      <p className="result">{user.name}，{user.age} 岁</p>
      <div className="actions">
        <button onClick={() => setUser({ ...user, age: user.age + 1 })}>
          改年龄（展开运算符）
        </button>
      </div>
      <p className="code-note">❌ user.age++ 然后 setUser(user) 不会触发更新（引用没变）</p>

      <h3>3. 数组更新 —— 同样要创建新数组</h3>
      <ul className="list">
        {todos.map((todo) => <li key={todo}>{todo}</li>)}
      </ul>
      <div className="row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入新待办"
        />
        <button onClick={() => { setTodos([...todos, text]); setText('') }}>
          添加
        </button>
      </div>
    </PageCard>
  )
}
