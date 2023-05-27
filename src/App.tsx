import { Suspense, useState } from 'react'
import lessStyles from '@/app.less'
// import ClassComp from '@/components/Class'
import { Demo1, Demo2 } from '@/components'

import LazyWrapper from '@/components/Lazy2'

function App() {
  const [show, setShow] = useState(false)
  // 点击事件中动态引入css, 设置show为true
  const handleOnClick = () => {
    import('@/App.css')
    setShow(true)
  }

  return (
    <div>
      <Demo1 />
      <Demo2 />
      <div className={lessStyles.lessBox}>
        <div className={lessStyles.box}>lessBox（天下无敌）</div>
      </div>
      <h2 onClick={handleOnClick}>展示</h2>
      {show && (
        <Suspense fallback={<div>loading1...</div>}>
          <LazyWrapper path='LazyDemo' />
        </Suspense>
      )}

      {/* <ClassComp /> */}
    </div>
  )
}

export default App
