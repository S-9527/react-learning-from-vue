import { useLocation, useNavigate } from 'react-router-dom'
import PageCard from '../components/PageCard.tsx'
import { useAuth } from '../context/AuthContext.tsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // 守卫跳转时把「原本想去哪」放在 state 里，登录成功后跳回去
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  function handleLogin() {
    login('Vue 转 React 学习者')
    navigate(from, { replace: true })
  }

  return (
    <PageCard title="模拟登录" hint="演示路由守卫：未登录访问 /router/protected 会被弹到这里。">
      <p className="code-note">
        Vue: router.beforeEach((to) =&gt; {'{'} if(!logged) return '/login' {'}'})<br />
        React: 用 &lt;RequireAuth&gt; 包裹路由，内部用 &lt;Navigate to="/login" /&gt; 重定向。
      </p>
      <div className="actions">
        <button onClick={handleLogin}>点击登录</button>
      </div>
    </PageCard>
  )
}
