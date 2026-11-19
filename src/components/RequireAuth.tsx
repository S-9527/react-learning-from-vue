import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'

/**
 * 路由守卫 ≈ Vue Router 的 beforeEach
 * - 没登录：<Navigate> 重定向到 /login，并记住原本想去哪
 * - 已登录：<Outlet> 渲染子路由（≈ Vue 嵌套路由里的 <router-view>）
 */
export default function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
