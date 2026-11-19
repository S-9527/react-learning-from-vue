import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import PageCard from '../components/PageCard.tsx'
import {
  selectCount,
  selectTotal,
  useCartStore,
  type Product,
} from '../stores/useCartStore.ts'

const products: Product[] = [
  { id: 1, name: 'React 入门', price: 39 },
  { id: 2, name: 'Vue 进阶', price: 49 },
  { id: 3, name: 'TypeScript 实战', price: 59 },
]

/**
 * 写法说明：
 *
 * 1) actions（函数）永远不会变，不需要订阅！
 *    用 getState() 在模块顶层取一次即可，省掉 5 行 useCartStore((s) => s.xxx)。
 *
 * 2) 状态值用 useShallow 一次订阅多个字段。
 *    useShallow 会对返回的对象做「浅比较」：只有字段真的变了才重渲染。
 *    ⚠️ 不要直接写 useCartStore((s) => ({ a: s.a, b: s.b }))，
 *       每次渲染都返回新对象 → 无限重渲染（zustand v5）。
 *
 * 3) 最省事的写法是「订阅整个 store」：
 *    const state = useCartStore()  ≈ Pinia 的 const store = useCartStore()
 *    但任何字段变化都会让组件重渲染，大页面不推荐。
 *
 * 4) 真实项目更常见的做法是把页面拆成 <CartList> / <CartSummary> 等小组件，
 *    每个组件只订阅自己需要的那一两个字段。
 */
const { add, increase, decrease, remove, clear } = useCartStore.getState()

export default function StoreDemo() {
  const { items, count, total } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      count: selectCount(state), // ≈ Pinia 的 getters
      total: selectTotal(state),
    })),
  )

  // $subscribe 对照：监听整个 store 的变化
  const [logs, setLogs] = useState<string[]>([])
  useEffect(
    () =>
      useCartStore.subscribe((state, prev) => {
        if (state.items !== prev.items) {
          setLogs((old) =>
            [`购物车变了：${state.items.length} 种商品`, ...old].slice(0, 5),
          )
        }
      }),
    [],
  )

  return (
    <PageCard
      title="全局状态：Zustand（≈ Pinia）"
      hint="一个 store 放状态 + 方法，不需要 Provider；组件按需订阅片段。"
    >
      <h3>1. Pinia ↔ Zustand 写法对照</h3>
      <div className="code-note">
        {'Pinia: defineStore("cart", { state: () => ({ items: [] }), actions: { add() {} } })'}<br />
        Zustand: create&lt;State&gt;()((set) =&gt; {'({ items: [], add: () => set(...) })'})<br />
        getters → selector 函数；storeToRefs → useStore(s =&gt; s.xxx)
      </div>

      <h3>2. 商品列表（点按钮加入购物车）</h3>
      <div className="actions">
        {products.map((product) => (
          <button key={product.id} onClick={() => add(product)}>
            + {product.name} ￥{product.price}
          </button>
        ))}
      </div>

      <h3>3. 购物车</h3>
      {items.length === 0 ? (
        <p className="code-note">购物车是空的，点上面的按钮加商品。</p>
      ) : (
        <ul className="list">
          {items.map((item) => (
            <li key={item.id} className="cart-line">
              <span>{item.name} ￥{item.price}</span>
              <span className="row">
                <button onClick={() => decrease(item.id)}>-</button>
                <strong>{item.qty}</strong>
                <button onClick={() => increase(item.id)}>+</button>
                <button onClick={() => remove(item.id)}>删除</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="result">共 {count} 件，总价 ￥{total}</p>
      <div className="actions">
        <button onClick={clear}>清空购物车</button>
      </div>

      <h3>4. $subscribe 对照</h3>
      <ul className="list">
        {logs.length === 0 ? (
          <li>操作购物车后，这里会记录变化日志</li>
        ) : (
          logs.map((log, index) => <li key={index}>{log}</li>)
        )}
      </ul>
      <p className="code-note">
        Pinia: store.$subscribe((mutation, state) =&gt; {'{...}'})<br />
        Zustand: useStore.subscribe((state, prevState) =&gt; {'{...}'})
      </p>
    </PageCard>
  )
}
