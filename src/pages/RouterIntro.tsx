import { NavLink, Outlet } from 'react-router-dom'
import PageCard from '../components/PageCard.tsx'

/**
 * 嵌套路由的父组件 ≈ Vue 里带 <router-view> 的布局组件
 * <Outlet /> 就是子路由的渲染出口
 */
export default function RouterIntro() {
  return (
    <PageCard
      title="嵌套路由与守卫"
      hint="父路由用 <Outlet /> 渲染子路由；守卫用 <Navigate> 重定向。"
    >
      <p className="code-note">
        Vue: children: [...] + &lt;router-view /&gt;<br />
        React: &lt;Route path="/router" element={'{<Layout/>}'}&gt; 里嵌套子 Route，Layout 里写 &lt;Outlet /&gt;
      </p>

      <nav className="sub-nav">
        <NavLink to="/router/child">子路由页面</NavLink>
        <NavLink to="/router/protected">需要登录的页面 🔒</NavLink>
      </nav>

      {/* 子路由匹配到的组件渲染在这里 */}
      <Outlet />
    </PageCard>
  )
}
