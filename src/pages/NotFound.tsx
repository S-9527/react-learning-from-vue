import { useNavigate } from 'react-router-dom'
import PageCard from '../components/PageCard.tsx'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <PageCard title="404" hint={'path="*" 是兜底路由，匹配所有未定义的路径。'}>
      <p>页面不存在。</p>
      <div className="actions">
        <button onClick={() => navigate('/')}>回首页（≈ router.push('/')）</button>
        <button onClick={() => navigate(-1)}>后退一步（≈ router.back()）</button>
      </div>
    </PageCard>
  )
}
