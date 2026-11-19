import { createContext, useContext, useState, type ReactNode } from 'react'

/**
 * Context ≈ Vue 的 provide / inject
 * 1. createContext 创建一个「上下文」
 * 2. Provider 把数据放在组件树上方
 * 3. 下面任意层级的组件用 useContext 取数据，不用一层层传 props
 */
type AuthValue = {
  user: string | null
  login: (name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null)

  return (
    <AuthContext.Provider
      value={{
        user,
        login: setUser,
        logout: () => setUser(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/** 自定义 Hook：把取 Context 的逻辑封装起来，并加上错误提示 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内部使用')
  return ctx
}
