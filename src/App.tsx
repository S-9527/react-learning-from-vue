import { NavLink, Route, Routes } from 'react-router-dom'
import RequireAuthGuard from './components/RequireAuth.tsx'
import Home from './pages/Home.tsx'
import StateDemo from './pages/StateDemo.tsx'
import EffectDemo from './pages/EffectDemo.tsx'
import MemoDemo from './pages/MemoDemo.tsx'
import RenderDemo from './pages/RenderDemo.tsx'
import FormDemo from './pages/FormDemo.tsx'
import ComponentDemo from './pages/ComponentDemo.tsx'
import ContextDemo from './pages/ContextDemo.tsx'
import StoreDemo from './pages/StoreDemo.tsx'
import RouterIntro from './pages/RouterIntro.tsx'
import RouterChild from './pages/RouterChild.tsx'
import ProtectedPage from './pages/ProtectedPage.tsx'
import Login from './pages/Login.tsx'
import User from './pages/User.tsx'
import NotFound from './pages/NotFound.tsx'

/** 导航链接配置：数据驱动，避免写一堆重复的 <NavLink> */
const navItems = [
  { to: '/', label: '首页', end: true },
  { to: '/state', label: '状态 useState' },
  { to: '/effect', label: '副作用 useEffect' },
  { to: '/memo', label: '计算 useMemo' },
  { to: '/render', label: '条件/列表' },
  { to: '/form', label: '表单事件' },
  { to: '/component', label: '组件通信' },
  { to: '/context', label: 'Context' },
  { to: '/store', label: 'Zustand (Pinia)' },
  { to: '/router', label: '嵌套路由' },
  { to: '/user/1001', label: '动态路由' },
]

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React 学习项目</h1>
        <p className="subtitle">Vue 学习者视角 · 每个页面一个知识点</p>
        <nav className="nav">
          {navItems.map((item) => (
            // end：让 "/" 只在首页激活，而不是匹配所有以 / 开头的路径
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/login">登录</NavLink>
        </nav>
      </header>

      <main className="page">
        {/*
          路由表 + 渲染出口：匹配到的 element 就渲染在这里。
          相当于 Vue 的 createRouter({ routes }) + <router-view /> 合二为一。
        */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/state" element={<StateDemo />} />
          <Route path="/effect" element={<EffectDemo />} />
          <Route path="/memo" element={<MemoDemo />} />
          <Route path="/render" element={<RenderDemo />} />
          <Route path="/form" element={<FormDemo />} />
          <Route path="/component" element={<ComponentDemo />} />
          <Route path="/context" element={<ContextDemo />} />
          <Route path="/store" element={<StoreDemo />} />

          {/* 嵌套路由：父路由用 Outlet 渲染子路由 */}
          <Route path="/router" element={<RouterIntro />}>
            <Route path="child" element={<RouterChild />} />
            {/* 守卫：未登录时重定向到 /login */}
            <Route path="protected" element={<RequireAuthGuard />}>
              <Route index element={<ProtectedPage />} />
            </Route>
          </Route>

          <Route path="/user/:id" element={<User />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
