import { useState } from 'react'
import PageCard from '../components/PageCard.tsx'

export default function FormDemo() {
  const [text, setText] = useState('')
  const [agree, setAgree] = useState(false)
  const [city, setCity] = useState('beijing')

  return (
    <PageCard
      title="事件与表单"
      hint="React 没有 v-model：手写 value + onChange 实现双向绑定。"
    >
      <h3>1. 事件绑定</h3>
      <p className="code-note">
        Vue: @click="fn"　React: onClick={'{fn}'}<br />
        注意是驼峰 onClick，而且传函数引用（不要写 fn()）。
      </p>
      <div className="actions">
        <button onClick={() => alert('点击事件触发')}>点我</button>
        <button onClick={(e) => console.log('事件对象：', e)}>打印事件对象</button>
      </div>

      <h3>2. 输入框（v-model 对照）</h3>
      <div className="row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请输入内容"
        />
        <span className="result">你输入的是：{text}</span>
      </div>
      <p className="code-note">
        Vue: v-model="text"　≈　React: value={'{text}'} + onChange={'{e =&gt; setText(e.target.value)}'}
      </p>

      <h3>3. 复选框 / 下拉框</h3>
      <div className="row">
        <label>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          我已阅读并同意
        </label>
        <span className="result">{agree ? '✅ 已同意' : '未同意'}</span>
      </div>
      <div className="row">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="beijing">北京</option>
          <option value="shanghai">上海</option>
          <option value="guangzhou">广州</option>
        </select>
        <span className="result">当前城市：{city}</span>
      </div>
    </PageCard>
  )
}
