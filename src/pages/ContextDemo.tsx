import PageCard from '../components/PageCard.tsx'
import { useAuth } from '../context/AuthContext.tsx'

export default function ContextDemo() {
  // useContext ≈ Vue 的 inject：不用一层层传 props，直接取上层 provide 的数据
  const { user, login, logout } = useAuth()

  return (
    <PageCard
      title="Context：跨层级传值"
      hint="createContext + useContext ≈ Vue 的 provide / inject"
    >
      <p className="result">
        当前登录用户：{user ?? '（未登录）'}
      </p>
      <div className="actions">
        <button onClick={() => login('Context 学习者')}>login('Context 学习者')</button>
        <button onClick={logout}>logout()</button>
      </div>
      <p className="code-note">
        AuthProvider 在 main.tsx 里包住了整个应用（≈ app.provide）。<br />
        这里用 useAuth() 取值（≈ inject）。路由守卫 /login 页面也用的同一份状态。<br />
        适合主题、登录态、语言等「很多组件都要用」的数据。
      </p>
    </PageCard>
  )
}
