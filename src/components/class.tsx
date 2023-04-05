import React, { PureComponent } from 'react'

// 装饰器为,组件添加age属性
function addAge(Target: Function) {
  Target.prototype.age = 111
}

// 使用装饰器
//  装饰器只能装饰类组件
@addAge
class classComp extends PureComponent {
  age?: number

  render() {
    return <h2>我是类组件---{this.age}</h2>
  }
}

export default classComp
