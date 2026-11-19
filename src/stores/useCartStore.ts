import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * Zustand ≈ Pinia
 *
 * Pinia:  export const useCartStore = defineStore('cart', { state, getters, actions })
 * Zustand: export const useCartStore = create(...)
 *
 * 区别：
 * - Zustand 不需要在 main.tsx 里包 Provider，任何组件直接 import 就能用
 * - 没有 getters 字段，用 selector 函数派生（见文件末尾）
 */
export type Product = { id: number; name: string; price: number }

type CartState = {
  items: Array<Product & { qty: number }>
  // actions：直接写在 store 里的方法 ≈ Pinia 的 actions
  add: (product: Product) => void
  increase: (id: number) => void
  decrease: (id: number) => void
  remove: (id: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  devtools(
    (set) => ({
      items: [],

      add: (product) =>
        set((state) => {
          const found = state.items.find((item) => item.id === product.id)
          if (found) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
              ),
            }
          }
          // 状态不可变：永远返回新数组 / 新对象
          return { items: [...state.items, { ...product, qty: 1 }] }
        }),

      increase: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item,
          ),
        })),

      decrease: (id) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
            .filter((item) => item.qty > 0),
        })),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    { name: 'cart-store' }, // 在 Redux DevTools 里能看到这个 store
  ),
)

// getters ≈ Pinia 的 getters：写成纯函数，组件里用 selector 订阅
export const selectCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.qty, 0)

export const selectTotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
