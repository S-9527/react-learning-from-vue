import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  // 安检员：只在开发环境重复执行渲染和 effect，帮你发现副作用问题
  <StrictMode>
    {/* 水电工：提供路由能力，<Link>/<Routes>/useNavigate 都依赖它 */}
    <BrowserRouter>
      {/* 提供全局登录状态，相当于 Vue 的 provide */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
