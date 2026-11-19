import { useState } from 'react'
import PageCard from '../components/PageCard.tsx'

const users = [
  { id: 1, name: 'Vue', role: '渐进式框架' },
  { id: 2, name: 'React', role: 'UI 库' },
  { id: 3, name: 'Svelte', role: '编译时框架' },
]

export default function RenderDemo() {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <PageCard
      title="条件渲染 / 列表渲染"
      hint="React 没有 v-if / v-for 指令，直接写 JavaScript 表达式。"
    >
      <h3>1. 条件渲染</h3>
      <p className="code-note">
        Vue: v-if="isLogin" / v-else<br />
        React: {'{isLogin && ...}'} 或 三元表达式
      </p>
      {/* && 短路：isLogin 为 false 时整个表达式不渲染 */}
      {isLogin && <p className="result">✅ 已登录</p>}
      {isLogin ? <p>显示 A 内容</p> : <p>显示 B 内容（未登录）</p>}
      <div className="actions">
        <button onClick={() => setIsLogin((v) => !v)}>切换登录状态</button>
      </div>

      <h3>2. 列表渲染</h3>
      <p className="code-note">
        Vue: v-for="u in users" :key="u.id"<br />
        React: users.map(u =&gt; &lt;li key={'{u.id}'}&gt;...)
      </p>
      <ul className="list">
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> —— {user.role}
          </li>
        ))}
      </ul>
      <p className="code-note">
        key 的作用两边一样：帮助框架识别节点身份，高效复用 DOM。<br />
        不要用数组下标当 key（插入/删除时会出问题）。
      </p>
    </PageCard>
  )
}
