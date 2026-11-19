import PageCard from '../components/PageCard.tsx'
import { useAuth } from '../context/AuthContext.tsx'

export default function ProtectedPage() {
  const { user, logout } = useAuth()

  return (
    <PageCard title="受保护的页面" hint="只有登录后才看得到，否则被路由守卫重定向到 /login。">
      <p className="result">欢迎回来，{user} 🎉</p>
      <div className="actions">
        <button onClick={logout}>退出登录</button>
      </div>
    </PageCard>
  )
}
