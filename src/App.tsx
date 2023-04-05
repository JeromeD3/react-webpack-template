import { useState } from 'react'
import '@/App.css'
import lessStyles from '@/app.less'
import scssStyles from '@/app.scss'
import stylStyles from '@/app.styl'
import smallImg from '@/assets/imgs/1.jpg'
import bigImg from '@/assets/imgs/3552951680506830_.pic_hd.jpg'
import chengzi from '@/assets/imgs/image-20230209005812767.png'
import memberList from './test.json'
import ClassComp from '@/components/Class'
import { Demo1, Demo2 } from '@/components'


function App() {
  const [count, setCounts] = useState('')
  const onChange = (e: any) => {
    setCounts(e.target.value)
  }
  console.log('memberList', memberList)

  return (
    <div>
      <Demo1 />
      <h2>webpack5-react-ts</h2>
      <div className={lessStyles['lessBox']}>
        <div className={lessStyles['box']}>
          lessBox（天下无敌）
          <img src={smallImg} alt="小于10kb的图片" />
          <img src={bigImg} alt="大于于10kb的图片" />
          <img src={chengzi} alt="橙子font" />
          <div className={lessStyles['smallImg']}>小图片背景</div>
          <div className={lessStyles['bigImg']}>大图片背景</div>
        </div>
      </div>
      <div className={scssStyles['scssBox']}>
        <div className={scssStyles['box']}>scssBox</div>
      </div>
      <div className={stylStyles['stylBox']}>
        <div className={stylStyles['box']}>stylBox</div>
      </div>
      <ClassComp />
      <div>
        <p>受控组件</p>
        <input type="text" value={count} onChange={onChange} />
        <br />
        <p>非受控组件</p>
        <input type="text" />
      </div>
    </div>
  )
}

export default App
