# React 学习项目（Vue 对比视角）

一个**可以直接运行**的 React 学习项目。每个页面都是一个独立示例，代码里有中文注释，并注明「Vue 里对应的写法」。适合已经会用 Vue、想通过对比来学 React 的人。

技术栈：Vite + React 19 + TypeScript + react-router-dom v7。

---

## 快速开始

```bash
pnpm install
pnpm dev
```

浏览器打开 http://localhost:5173

生产构建：

```bash
pnpm build
```

---

## 学习路线（建议按顺序读代码）

| 顺序 | 路由 | 源码 | 知识点 | Vue 里的对应物 |
| --- | --- | --- | --- | --- |
| 1 | `/` | `src/pages/Home.tsx` | 项目介绍、JSX 基础 | `<template>` + `{{ }}` |
| 2 | `/state` | `src/pages/StateDemo.tsx` | `useState`、不可变更新 | `ref` / `reactive` |
| 3 | `/effect` | `src/pages/EffectDemo.tsx` | `useEffect`、清理函数 | `onMounted` / `watch` / `onUnmounted` |
| 4 | `/memo` | `src/pages/MemoDemo.tsx` | `useMemo` / `useCallback` / `React.memo` | `computed` |
| 5 | `/render` | `src/pages/RenderDemo.tsx` | 条件渲染、列表渲染、`key` | `v-if` / `v-for` / `:key` |
| 6 | `/form` | `src/pages/FormDemo.tsx` | 事件绑定、受控表单 | `@click` / `v-model` |
| 7 | `/component` | `src/pages/ComponentDemo.tsx` | props、回调通信、children | props / emit / `<slot>` |
| 8 | `/context` | `src/pages/ContextDemo.tsx` | `createContext` / `useContext` | `provide` / `inject` |
| 9 | `/store` | `src/pages/StoreDemo.tsx` | Zustand store、selector、subscribe | **Pinia** |
| 10 | `/router` | `src/pages/RouterIntro.tsx` 等 | 嵌套路由、`Outlet`、路由守卫 | `children` / `<router-view>` / `beforeEach` |
| 11 | `/user/:id` | `src/pages/User.tsx` | 动态路由参数、query | `route.params` / `route.query` |

顶部导航可以直接点着切换。

---

## 目录结构

```
src/
├── main.tsx                  # 应用入口：StrictMode + BrowserRouter + AuthProvider
├── App.tsx                   # 全局导航 + 路由表（路由表和出口是同一个 <Routes>）
├── index.css                 # 全局样式
├── components/
│   ├── PageCard.tsx          # 通用卡片组件（演示 props + children）
│   └── RequireAuth.tsx       # 路由守卫（演示 <Navigate> + <Outlet>）
├── context/
│   └── AuthContext.tsx       # 登录状态（演示 Context ≈ provide/inject）
├── hooks/
│   └── useClock.ts           # 自定义 Hook（≈ Vue 的 composable）
├── stores/
│   └── useCartStore.ts       # Zustand 全局 store（≈ Pinia store）
└── pages/                    # 每个页面对应一个知识点
    ├── Home.tsx
    ├── StateDemo.tsx
    ├── EffectDemo.tsx
    ├── MemoDemo.tsx
    ├── RenderDemo.tsx
    ├── FormDemo.tsx
    ├── ComponentDemo.tsx
    ├── ContextDemo.tsx
    ├── StoreDemo.tsx
    ├── RouterIntro.tsx
    ├── RouterChild.tsx
    ├── ProtectedPage.tsx
    ├── Login.tsx
    ├── User.tsx
    └── NotFound.tsx
```

详细笔记在 [`docs/React学习笔记.md`](docs/React学习笔记.md)，包含完整的 Vue ↔ React 对照表和踩坑说明。

---

## 三个最重要的思维转变

1. **状态不可变**：Vue 直接改 `xxx.value`，React 必须用 `setXxx(新值)`。对象和数组要创建新引用，不能原地改。
2. **UI = f(state)**：状态变化会让组件函数重新执行，不是 Vue 那种依赖追踪精准更新。
3. **`computed` 只负责派生**：它不会自己制造变化。想让值随时间变，两边都要靠「状态 + 定时器」。

---

## 关于 StrictMode

`main.tsx` 里的 `<StrictMode>` 是 React 的**开发期检查工具**：它会故意把渲染和 effect 执行两次，帮你发现副作用没清理的问题。**生产构建不会执行两次**。所以你在 `/effect` 页面看到 `console.log` 打印两次是正常的，不是 bug。

`BrowserRouter` 则是真实功能：它读取地址栏路径并监听变化，`<Routes>` 根据它决定渲染哪个组件。两者作用完全不同，但要嵌套在一起使用。

---

## 路由是怎么工作的

1. `BrowserRouter` 读取 `window.location.pathname`，并监听前进/后退。
2. `<Routes>` 拿当前路径从上到下匹配子 `<Route path>`。
3. 命中的 `element` 被渲染到 `<Routes>` 所在的位置——它同时相当于 Vue 的 `<router-view />` 和路由表。
4. `<Link>` / `navigate()` 用 `history.pushState` 改 URL，**不刷新页面**，然后重新匹配。

整个应用只有一个 `index.html`（SPA）。服务器把所有路径都回退到它，由前端决定渲染什么。

---

## 常用命令

```bash
pnpm dev       # 开发服务器
pnpm build     # 类型检查 + 生产打包
pnpm preview   # 预览生产构建
pnpm lint      # 代码检查
```
