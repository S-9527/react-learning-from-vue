import { Link, useParams, useSearchParams } from 'react-router-dom'
import PageCard from '../components/PageCard.tsx'

export default function User() {
  // useParams() ≈ Vue 的 route.params
  const { id } = useParams()
  // useSearchParams() ≈ Vue 的 route.query
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name') ?? '匿名'

  return (
    <PageCard
      title="动态路由与 query"
      hint="路径 /user/:id 中的 id 用 useParams 取；?name=xxx 用 useSearchParams 取。"
    >
      <p className="result">用户 ID：<code>{id}</code></p>
      <p className="result">用户名：<code>{name}</code></p>
      <div className="actions">
        <Link to="/user/1001?name=李四">切换成李四（只改参数，不刷新页面）</Link>
      </div>
      <p className="code-note">
        Vue: route.params.id / route.query.name<br />
        React: useParams().id / useSearchParams()[0].get('name')
      </p>
    </PageCard>
  )
}
