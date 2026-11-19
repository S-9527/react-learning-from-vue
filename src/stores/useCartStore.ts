import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * Zustand 的 create 回调本身就是一个闭包：
 * 参数 set / get 被内部的函数捕获，最后 return 出要暴露的状态和方法。
 *
 * 这里用「具名函数 + return { add }」的写法，等价于之前的行内箭头函数：
 *
 *   create((set, get) => {
 *     function add() {...}     // 闭包里的函数
 *     return { items: [], add }  // 暴露出去
 *   })
 *
 * ⚠️ 关键点：闭包里的函数必须通过 set() 更新状态。
 *    如果写成 let items = []; items.push(p) 这种普通闭包变量，
 *    React 收不到通知，视图不会更新。
 */
export type Product = { id: number; name: string; price: number }

type CartItem = Product & { qty: number }

type CartState = {
  items: CartItem[]
  add: (product: Product) => void
  increase: (id: number) => void
  decrease: (id: number) => void
  remove: (id: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  devtools(
    (set) => {
      // 下面的函数都在闭包里，能直接调用 set（需要读当前状态时可以用 get()）

      function add(product: Product) {
        set((state) => {
          const found = state.items.find((item) => item.id === product.id)
          if (found) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
              ),
            }
          }
          return { items: [...state.items, { ...product, qty: 1 }] }
        })
      }

      function increase(id: number) {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item,
          ),
        }))
      }

      function decrease(id: number) {
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
            .filter((item) => item.qty > 0),
        }))
      }

      function remove(id: number) {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
      }

      function clear() {
        set({ items: [] })
      }

      // 这就是「return { add }」形式：把状态和方法暴露出去
      return { items: [], add, increase, decrease, remove, clear }
    },
    { name: 'cart-store' },
  ),
)

// getters ≈ Pinia 的 getters：写成 selector 纯函数
export const selectCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.qty, 0)

export const selectTotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
