# Vue3中为什么不能使用this

## 原因

官方是这样说的：在 setup() 内部，this 不会是该活跃实例的引用（即不指向vue实例），因为 setup() 是在解析其它组件选项之前被调用的，所以 setup() 内部的 this 的行为与其它选项中的 this 完全不同。这在和其它选项式 API 一起使用 setup() 时可能会导致混淆。

因此setup函数中不能使用this。所以Vue为了避免我们错误的使用，直接将setup函数中的this修改成了 undefined）

## 解决方法

如果要在vue3中使用this，vue为我们提供了*getCurrentInstance*方法，该方法返回了ctx和proxy。控制台打印出来的和vue2的this相同

```javascript
import {defineComponent, getCurrentInstance} from 'vue'

export default defineComponent ({
  setup(){
    const { proxy, ctx } = getCurrentInstance()
    const _this = ctx
    
    console.log('getCurrentInstance()中的ctx:', _this)
    console.log('getCurrentInstance()中的proxy:', proxy)
    
    return {}
  }
})
```



