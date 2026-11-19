import type { ReactNode } from 'react'

/**
 * 通用卡片组件：演示「props + children」
 * - title / hint 通过 props 传入 ≈ Vue 的 defineProps
 * - children 是组件标签中间的内容 ≈ Vue 的 <slot />
 */
type PageCardProps = {
  title: string
  hint?: string
  children: ReactNode
}

export default function PageCard({ title, hint, children }: PageCardProps) {
  return (
    <section className="page-card">
      <h2>{title}</h2>
      {hint && <p className="hint">{hint}</p>}
      {children}
    </section>
  )
}
