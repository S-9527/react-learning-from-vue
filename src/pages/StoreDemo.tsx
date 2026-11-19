import { useEffect, useState } from 'react'
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

export default function StoreDemo() {
  // 按需订阅：每个 selector 只取自己需要的片段 ≈ Pinia 的 storeToRefs
  const items = useCartStore((state) => state.items)
  const count = useCartStore(selectCount) // ≈ store.getters.double
  const total = useCartStore(selectTotal)
  const add = useCartStore((state) => state.add)
  const increase = useCartStore((state) => state.increase)
  const decrease = useCartStore((state) => state.decrease)
  const remove = useCartStore((state) => state.remove)
  const clear = useCartStore((state) => state.clear)

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
        getters → 写成 selector 函数；storeToRefs → useStore(s =&gt; s.xxx)
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
