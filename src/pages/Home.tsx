import { Link } from 'react-router-dom'
import PageCard from '../components/PageCard.tsx'

export default function Home() {
  return (
    <PageCard
      title="首页"
      hint="这是一个用「Vue 对比法」学习 React 的项目。顶部导航每个页面讲一个知识点。"
    >
      <p className="result">核心公式：UI = f(state)</p>
      <div className="note-box">
        <p>状态变 → 组件函数重新执行 → 生成新的 JSX → React 更新 DOM。</p>
        <p>这和 Vue 的「依赖追踪、精准更新」是两套思路。</p>
      </div>
      <h3>建议阅读顺序</h3>
      <ol className="list">
        <li><Link to="/state">useState</Link> —— 状态与不可变更新</li>
        <li><Link to="/effect">useEffect</Link> —— 生命周期与副作用</li>
        <li><Link to="/memo">useMemo</Link> —— 计算属性对照</li>
        <li><Link to="/render">条件 / 列表渲染</Link> —— v-if / v-for 对照</li>
        <li><Link to="/form">表单与事件</Link> —— v-model 对照</li>
        <li><Link to="/component">组件通信</Link> —— props / emit / slot 对照</li>
        <li><Link to="/context">Context</Link> —— provide / inject 对照</li>
        <li><Link to="/router">嵌套路由与守卫</Link></li>
      </ol>
    </PageCard>
  )
}
