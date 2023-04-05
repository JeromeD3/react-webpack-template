import { Suspense, lazy, useState } from 'react'
// prefetch
const PreFetchDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreFetchDemo" */
      /*webpackPrefetch: true*/
      '@/components/PreFetchDemo'
    )
)

// preload
const PreloadDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreloadDemo" */
      /*webpackPreload: true*/
      '@/components/PreloadDemo'
    )
)

function Demo1() {
  const [show, setShow] = useState(false)

  const onClick = () => {
    setShow(true)
  }
  return (
    <>
      <h2 onClick={onClick}>展示</h2>
      {/* show为true时加载组件 */}
      {show && (
        <>
          <Suspense fallback={null}>
            <PreloadDemo />
          </Suspense>
          <Suspense fallback={null}>
            <PreFetchDemo />
          </Suspense>
        </>
      )}
    </>
  )
}
export default Demo1

// 总结
// 1. preFetch会在空闲的时候加载，
// 2. preload会在页面加载的时候加载
// 3. preload会优先于prefetch加载
// 4. prefetch适合加载后面可能会用到的组件，
// 5. preload适合加载当前页面可能会用到的组件
// 6. prefetch 配合懒加载也会加载，等到需要的时候直接从缓存中读取
