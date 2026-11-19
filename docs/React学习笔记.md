# React 学习笔记（对比 Vue 视角）

> 项目：Vite + React 19 + TypeScript
> 学习方式：用已掌握的 Vue 概念去对照理解 React

---

## 一、当前代码点评

```tsx
import { useState } from 'react'

function App() {
  const [message, setMessage] = useState("Hello")

  return (
    <>
      { message }
    </>
  )
}

export default App
```

**结论：写法正确。**

| 写法 | 作用 | 对应 Vue |
| --- | --- | --- |
| `useState("Hello")` | 声明一个状态，初值为 `"Hello"` | `const message = ref('Hello')` |
| `const [message, setMessage]` | 解构出「当前值」和「更新函数」 | Vue 里只有一个 `message`，直接改 `message.value` |
| `{ message }` | JSX 中插入变量 | 模板中 `{{ message }}` |
| `<>...</>` | Fragment，包裹多个根节点 | Vue 3 的 `<template>` 天然支持多根，React 必须包一层 |

**可以改进的地方**：目前只读取了状态，没有调用 `setMessage`，所以看不到响应式效果。建议加一个按钮：

```tsx
function App() {
  const [message, setMessage] = useState("Hello")

  return (
    <>
      <p>{message}</p>
      <button onClick={() => setMessage("Hi React")}>改文案</button>
    </>
  )
}
```

> ⚠️ 核心差异（重点）：
> - Vue：`message.value = 'Hi'` —— **直接修改**响应式对象，依赖收集自动触发更新。
> - React：`setMessage('Hi')` —— 必须用新值**调用 setter**，不能直接改变量。因为 React 靠「状态引用是否变化」来决定是否重新渲染。

---

## 二、Vue vs React 核心概念对照表

| 概念 | Vue 3 | React |
| --- | --- | --- |
| 模板 / 视图 | `<template>` 模板语法 | JSX（在 JS 里写 HTML） |
| 响应式状态 | `ref()` / `reactive()` | `useState()` / `useReducer()` |
| 修改状态 | `count.value++`（直接改） | `setCount(c => c + 1)`（必须用 setter） |
| 插值 | `{{ msg }}` | `{ msg }` |
| 事件绑定 | `@click="fn"` | `onClick={fn}` |
| 条件渲染 | `v-if="ok"` | `{ok && <div/>}` / 三元表达式 |
| 列表渲染 | `v-for="item in list" :key="id"` | `list.map(item => <li key={item.id}>{item.name}</li>)` |
| 双向绑定 | `v-model="val"` | `value={val} onChange={e => setVal(e.target.value)}`（手动） |
| 计算属性 | `computed(() => a + b)` | `const c = useMemo(() => a + b, [a, b])` |
| 监听器 | `watch(src, cb)` | `useEffect(() => {...}, [deps])` |
| 副作用 | `onMounted` / `watch` | `useEffect` |
| 组件通信 | `props` + `emit` | `props` + 回调函数（父传回调给子） |
| 插槽 | `<slot>` | `children` / `props.children` |
| 样式作用域 | `<style scoped>` | CSS Modules / styled-components 等 |

---

## 三、逐点详解

### 1. 状态：useState ≈ ref

```tsx
// React
const [count, setCount] = useState(0)
setCount(1)            // 用新值替换
setCount(c => c + 1)   // 函数式更新（推荐，避免闭包拿到旧值）
```

```js
// Vue
const count = ref(0)
count.value = 1        // 直接改 .value
count.value++          // 直接自增
```

**关键区别**：React 状态更新是「替换」不是「修改」。对于对象和数组，必须创建新引用：

```tsx
// ❌ 错误：不会触发重新渲染
user.name = 'Tom'
setUser(user)

// ✅ 正确：创建新对象
setUser({ ...user, name: 'Tom' })

// ✅ 数组同理
setList([...list, newItem])   // 增
setList(list.filter(i => i.id !== id)) // 删
```

### 2. 事件绑定

```tsx
// React：驼峰命名，传函数引用（不要加括号立即调用）
<button onClick={() => setMessage('Hi')}>点我</button>
<button onClick={handleClick}>点我</button>

// 传参
<button onClick={(e) => handleClick(id, e)}>删</button>
```

```html
<!-- Vue -->
<button @click="handleClick">点我</button>
<button @click="handleClick(id, $event)">删</button>
```

### 3. 条件渲染

```tsx
// React：用 JS 表达式
{isLogin && <span>已登录</span>}
{isLogin ? <A /> : <B />}
```

```html
<!-- Vue -->
<span v-if="isLogin">已登录</span>
<A v-if="isLogin" /><B v-else />
```

### 4. 列表渲染

```tsx
<ul>
  {todos.map(todo => (
    <li key={todo.id}>{todo.title}</li>
  ))}
</ul>
```

```html
<ul>
  <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
</ul>
```

> `key` 的作用两者一致：帮助框架识别节点身份，高效复用 DOM。

### 5. 表单双向绑定

React 没有 `v-model`，需要手动绑定 `value` + `onChange`：

```tsx
const [text, setText] = useState('')
<input value={text} onChange={e => setText(e.target.value)} />
```

```html
<!-- Vue -->
<input v-model="text" />
```

### 6. 副作用 / 监听：useEffect

```tsx
// 相当于 onMounted + watch 的组合
useEffect(() => {
  document.title = message   // 副作用
}, [message])                // 依赖数组：message 变化才重新执行

// 空依赖数组 [] → 只在挂载时执行一次（≈ onMounted）
// 返回清理函数 → 组件卸载时执行（≈ onUnmounted）
useEffect(() => {
  const timer = setInterval(...)
  return () => clearInterval(timer)
}, [])
```

---

## 四、React 思维转变（从 Vue 过来最容易踩的坑）

1. **状态不可变**：永远用新值/新引用替换，不要原地修改。
2. **视图是状态的函数**：UI = f(state)。状态变 → 重新渲染整个组件函数，不是 Vue 那种「精准更新某个绑定」。
3. **setState 是异步批处理的**：连续调用 `setCount(c=>c+1)` 三次，结果是 +3（函数式更新才安全）；`setCount(count+1)` 三次结果只是 +1。
4. **JSX 是表达式**：可以在 `{}` 里写任意 JS 表达式，但不能写语句（`if`、`for`）。
5. **组件名必须大写开头**：小写会被当作原生 HTML 标签。
6. **StrictMode**：`main.tsx` 里的 `<StrictMode>` 在开发环境下会故意重复执行某些函数/effect，帮助你发现副作用问题，生产环境不会。

---

## 五、入口文件说明（main.tsx）

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- `createRoot(...)` ≈ Vue 的 `createApp(App).mount('#root')`。
- `!` 是 TypeScript 的非空断言，告诉 TS `getElementById` 一定不为空。
- `<StrictMode>` 开发期检查工具，不影响生产构建。

---

## 六、下一步练习建议

1. 把上面的「按钮改文案」例子写进 `App.tsx`，观察点击后视图更新。
2. 做一个计数器：加、减、重置按钮，练习函数式更新 `setCount(c => c + 1)`。
3. 做 Todo List：练习列表渲染、表单绑定、对象/数组不可变更新。
4. 用 `useEffect` 实现「输入的文案同步到浏览器标签标题」。

> 记忆口诀：**Vue 直接改，React 用 setter；Vue 写模板，React 写 JSX；状态要换新，别在原地上改。**

---

## 七、实战对照：把 `demo/src/App.vue` 翻译成 React

### Vue 原版

```vue
<script setup lang="ts">
const message = "Hello"
const style = {
  width: "100px",
  height: "100px",
  backgroundColor: "red"
}
</script>

<template>
  {{message}}
  <div :style="style"></div>
</template>
```

### React 写法

```tsx
function App() {
  const message = "Hello"
  const style = {
    width: "100px",
    height: "100px",
    backgroundColor: "red"
  }

  return (
    <>
      {message}
      <div style={style}></div>
    </>
  )
}

export default App
```

### 逐处对应

| Vue | React | 说明 |
| --- | --- | --- |
| `<script setup>` 顶层代码 | 直接写在函数组件体内 | React 没有单独的 script 块，组件本身就是一个函数 |
| `const message = "Hello"` | 一样 | 这里没用 `ref`，两边都是普通常量，不是响应式状态 |
| `{{ message }}` | `{ message }` | 插值从双大括号变单大括号 |
| `:style="style"` | `style={style}` | 去掉冒号，引号变单大括号（表示传入 JS 表达式） |
| `<template>` 多个根节点 | `<>...</>` Fragment | React 组件必须返回单个根节点 |
| 自动导出 | `export default App` | React 需要手动导出 |

### 样式细节

- React 的 `style` 必须传**对象**，属性名用驼峰（`backgroundColor`），和 Vue 里一致。
- 数值类型会自动加 `px`：`width: 100` ≡ `width: "100px"`；字符串必须自己带单位。
- 行内样式在 React 里更常用 CSS Modules / className，但小 demo 用 style 对象没问题。

---

## 八、生命周期对照：`onMounted` → `useEffect`

### Vue 原版

```js
onMounted(() => {
  console.log("加载完成")
})
```

### React 写法

```tsx
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    console.log("加载完成")
  }, [])

  return <>...</>
}
```

### 关键点

1. **空依赖数组 `[]` 表示只在挂载后执行一次**，等价于 `onMounted`。
2. **不写第二个参数** → 每次渲染都执行；**写 `[msg]`** → 只有 `msg` 变化时执行（≈ `watch`）。
3. **返回清理函数 ≈ `onUnmounted`**：

```tsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000)
  return () => clearInterval(timer) // 组件卸载时调用
}, [])
```

4. **StrictMode 会打印两次**：`main.tsx` 里的 `<StrictMode>` 在开发环境下会故意执行 effect 两次（挂载 → 卸载 → 再挂载），用于暴露副作用清理问题。这是正常现象，生产构建只执行一次。
5. 执行时机：`useEffect` 在 DOM 更新**之后**异步执行（≈ `onMounted`）；如果需要在浏览器绘制前同步执行，用 `useLayoutEffect`。

---

## 九、`computed` → `useMemo`（以及 `Date.now()` 的坑）

### 一般对应

```js
// Vue
const total = computed(() => price.value * count.value)
```

```tsx
// React
const total = useMemo(() => price * count, [price, count])
```

> `useMemo` 仅用于性能优化，React 不保证缓存永久存在（可能丢弃重算），不要用它保证正确性逻辑。

### ⚠️ `computed(() => Date.now())` 的坑

`Date.now()` **不读取任何响应式依赖**，所以 Vue 的 `computed` 会缓存第一次的计算结果，**永远不会更新**——页面上显示的是固定时间戳，不是当前时间。

忠实翻译（值固定）：

```tsx
const now = Date.now()                    // 每次渲染重新取，最简单
// 或
const now = useMemo(() => Date.now(), []) // 只算一次，永久缓存，最接近 Vue computed 行为
```

真正想要「会跳动的时间」（常见意图）：

```tsx
import { useEffect, useState } from 'react'

function App() {
  const [now, setNow] = useState(() => Date.now()) // 惰性初始值，只算一次

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer) // 卸载时清理，≈ onUnmounted
  }, [])

  return <p>{now}</p>
}
```

**规律**：Vue 中「会随时间自动变化的值」必须靠 `ref` + `setInterval` 驱动；React 中同理，靠 `useState` + `useEffect` 驱动。`computed`/`useMemo` 只负责**根据已有响应式状态派生值**，自己不会制造变化。

---

## 十、路由：vue-router → react-router-dom

### 安装

```bash
pnpm add react-router-dom
```

> 新版本（v7）已把 `react-router` 与 `react-router-dom` 合并，但下面这套 v6 风格的 API 仍然可用。

### 1. 包裹根组件（main.tsx）

```tsx
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
```

### 2. 声明路由（App.tsx）

```tsx
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  return (
    <>
      <h1>首页</h1>
      <button onClick={() => navigate('/about/123')}>去关于页</button>
    </>
  )
}

function About() {
  const { id } = useParams()   // /about/:id 中的 id
  return <h1>关于页，id = {id}</h1>
}

function App() {
  return (
    <>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about/123">关于</Link>
      </nav>

      {/* 匹配到的组件渲染在这里 ≈ <router-view /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about/:id" element={<About />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  )
}

export default App
```

### 3. 对照表

| vue-router | react-router-dom |
| --- | --- |
| `createRouter({ routes: [...] })` 配置数组 | `<Routes><Route path element /></Routes>` JSX 声明 |
| `<router-link to="/">` | `<Link to="/">` |
| `<router-view />` | `<Routes>` 本身就是出口位置 |
| `router.push('/about')` | `const navigate = useNavigate(); navigate('/about')` |
| `route.params.id` | `useParams().id` |
| `route.query.x` | `useSearchParams()` |
| `children` 嵌套 + `<router-view>` | 嵌套 `<Route>` + `<Outlet />` |
| `beforeEach` 全局守卫 | 封装 `<RequireAuth>` 组件 + `<Navigate to="/login" />` |
| `createWebHashHistory()` | `<HashRouter>` 代替 `<BrowserRouter>` |
| `router-link-active` 类名 | `<NavLink>` 自动处理激活态 |

### 4. 注意点

- `<Route>` 用 `element={<Home />}` 传组件，**不是** `component={Home}`。
- 声明式跳转用 `<Link>`，编程式跳转用 `useNavigate()`。
- `<Routes>` 必须位于 `<BrowserRouter>` / `<HashRouter>` 内部。
- `navigate(-1)` 相当于 `router.back()`。

---

## 十一、`StrictMode` 和 `BrowserRouter` 的区别

虽然两者都是「包在 `<App />` 外面的标签」，但完全是两类东西：

| | `StrictMode` | `BrowserRouter` |
| --- | --- | --- |
| 来自 | React 内置 | react-router-dom 第三方库 |
| 作用 | 开发期检查工具：故意重复执行渲染和 effect，暴露副作用未清理等问题 | 路由功能提供者：通过 Context 把 location/history 注入整棵组件树 |
| 生产环境 | 无效果，自动去掉 | 照常工作，必不可少 |
| 是否必须 | 否（推荐开发期开启） | 是，用了 `<Link>`/`<Routes>`/`useNavigate` 就必须有 |
| 不写的后果 | 功能正常，只是少一层检查 | 报错：`useNavigate() may be used only in the context of a <Router>` |
| 典型现象 | 控制台日志打印两次、effect 执行两次 | URL 变化、页面切换 |

**Vue 类比**：
- `StrictMode` 在 Vue 里没有直接对应物（Vue 开发环境有 warning，但不会故意执行两次），纯粹是 React 的开发期诊断机制。
- `BrowserRouter` ≈ Vue 的 `app.use(router)`，把路由能力安装到整个应用。

**一起使用的写法**：

```tsx
// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

一般 `StrictMode` 在外层、`BrowserRouter` 在内层，互不干扰。

> 记忆：**`StrictMode` 是安检员（只在开发时挑毛病），`BrowserRouter` 是水电工（真提供路由功能）。**

---

## 十二、完整学习项目（本仓库）

仓库已经扩展成一个完整的可运行项目，每个页面对应一个知识点，代码里有中文注释和 Vue 对照说明。

文件结构：

```
src/
├── main.tsx                  # StrictMode + BrowserRouter + AuthProvider
├── App.tsx                   # 导航 + 全部路由表
├── components/
│   ├── PageCard.tsx          # props + children（≈ slot）
│   └── RequireAuth.tsx       # 路由守卫（≈ beforeEach）
├── context/AuthContext.tsx   # Context（≈ provide/inject）
├── hooks/useClock.ts         # 自定义 Hook（≈ composable）
└── pages/                    # 每个页面一个知识点
    ├── Home.tsx               # 项目介绍与学习路线
    ├── StateDemo.tsx          # useState + 不可变更新
    ├── EffectDemo.tsx         # useEffect + 清理 + 自定义 Hook
    ├── MemoDemo.tsx           # useMemo / useCallback / React.memo
    ├── RenderDemo.tsx         # 条件渲染 + 列表渲染 + key
    ├── FormDemo.tsx           # 事件绑定 + 受控表单（v-model 对照）
    ├── ComponentDemo.tsx      # props + 回调 + children
    ├── ContextDemo.tsx        # useContext
    ├── RouterIntro.tsx        # 嵌套路由布局 + <Outlet />
    ├── RouterChild.tsx        # 子路由页面
    ├── ProtectedPage.tsx      # 受保护页面
    ├── Login.tsx              # 模拟登录 + 重定向回原路径
    ├── User.tsx               # useParams + useSearchParams
    └── NotFound.tsx           # path="*" 兜底
```

阅读顺序建议：从 `/state` 开始，按顶部导航从左到右读，最后看 `/router` 的嵌套路由与守卫。

已验证：`pnpm build` 通过；浏览器实测所有页面、导航激活态、动态参数、query、嵌套路由、登录守卫与 404 兜底均正常。

---

## 十三、全局状态管理：Pinia → Zustand

React 没有官方的 Pinia，但生态里有几个对应方案：

| Pinia 概念 | Zustand（推荐，最像 Pinia） | Redux Toolkit | Context + useReducer |
| --- | --- | --- | --- |
| `defineStore` | `create()` | `createSlice()` | 手写 Provider + reducer |
| `store.count` | `useStore(s => s.count)` | `useSelector` | `useContext` |
| `getters` | selector 函数 | `useSelector` 里算 | 手动算 |
| `actions` | store 里的方法 | `dispatch(action)` | `dispatch` |
| `$subscribe` | `store.subscribe()` | 中间件 | 无 |
| DevTools | `devtools` 中间件 | 原生支持 | 无 |
| 需要 Provider | ❌ 不需要 | 需要 | 需要 |

其他可选：Jotai（原子化状态，≈ Recoil）、MobX（observable，语义最像 Vue 的 reactive）。服务端数据（请求/缓存）建议用 TanStack Query，和 Pinia 解决的不是同一类问题。

### 项目里的实现（`src/stores/useCartStore.ts` + `src/pages/StoreDemo.tsx`）

```ts
// Pinia
export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }),
  getters: { count: (s) => s.items.length },
  actions: { add(product) { this.items.push(product) } },
})

// Zustand
export const useCartStore = create<CartState>()(
  devtools((set) => ({
    items: [],
    add: (product) => set((s) => ({ items: [...s.items, product] })),
  }), { name: 'cart-store' }),
)

// getters → selector 纯函数
export const selectCount = (s: CartState) => s.items.length
```

组件里按需订阅（≈ `storeToRefs`）：

```tsx
const items = useCartStore((s) => s.items)
const count = useCartStore(selectCount)
const add = useCartStore((s) => s.add)
```

### 注意点

- Zustand **不需要** `<Provider>`，任何组件直接 import store 使用。
- selector 要返回**稳定引用或原始值**。不要写 `useStore(s => ({ a: s.a, b: s.b }))` —— 每次返回新对象会导致无限重新渲染（zustand v5 基于 `useSyncExternalStore`）。正确做法是拆成多个 selector。
- 更新状态依然遵守不可变原则：用 `set((s) => ({ items: [...s.items, x] }))`，不要原地 push。
- `devtools` 中间件让你在 Redux DevTools 里看到状态变化，对应 Pinia 的 Vue Devtools 集成。

