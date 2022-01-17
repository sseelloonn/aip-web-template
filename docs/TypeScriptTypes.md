# TypScript类型系统简记



## TypScript类型系统

在`TypeScript`的使用中，最关键理解的部分是`类型系统`，这部分是保证大型系统质量的**关键**所在，可以参考这篇文章[[聊聊TypeScript类型声明那些最佳实践](https://segmentfault.com/a/1190000040288228)](https://segmentfault.com/a/1190000040288228)

总结下来要注意这么几个点

- 泛型优于联合类型

  ~~~typescript
  // 将共有的layEggs抽象到Eggable接口
  interface Eggable {
    layEggs(): boolean
  }
  
  interface Bird extends Eggable {
    fly(): void
  }
    
  interface Fish extends Eggable {
    swim(): void
  }
    
  function getSmallPet<T extends Eggable>(...animals: Array<T>): T {
    for (const animal of animals) {
      if (!animal.layEggs()) return animal
    }
    return animals[0]
  }
    
  let pet = getSmallPet<Fish>()
  pet.layEggs()
  pet.swim()
  ~~~

  

- 巧用typeof推导优于自定义类型

  这样可以避免写大量的类型定义，直接通过一个已有的数据定义来生成类型

  ~~~typescript
  // 声明模块的初始state
  const userInitState = {
    name: '',
    workid: '',
    avator: '',
    department: '',
  }
  
  // 根据初始state推导出当前模块的数据结构
  export type IUserStateMode = typeof userInitState // 导出的数据类型可以在其他地方使用
  ~~~

  

- 内置工具函数优于重复声明

  Partial、Pick、Exclude, Omit, Record 非常实用，灵活使用可以避免大量的**重复代码**，注意，这些函数或类型都是`typescript`的内置函数，可以直接使用

  | 内置函数   | 用途                                  | 例子               |
  | ---------- | ------------------------------------- | --------------|
  | Partial<T> | 类型T的所有子集（每个属性都可选）     |Partial<IUserStateMode>|
  | Readony<T> | 返回和T一样的类型，但所有属性都是只读 |Readony<IUserStateMode>|
  | Required<T> | 返回和T一样的类型，每个属性都是必须的 |Required<IUserStateMode>|
  | Pick<T, K extends keyof T> | 从类型T中挑选的部分属性K |Pick<IUserStateMode, 'name'	'workid'	'avator'>|
|Exclude<T, U extends keyof T> | 从类型T中移除部分属性U | Exclude<IUserStateMode, 'name'	'department'> |
|NonNullable<T> | 从属性T中移除null和undefined | NonNullable<IUserStateMode> |
|ReturnType<T> | 返回函数类型T的返回值类型 | ReturnType<IUserStateMode> | 
| Record<K, T> | 生产一个属性为K,类型为T的类型集合 | Record<keyof IUserStateMode, string> | 
|Omit<T, K> | 忽略T中的K属性 | Omit<IUserStateMode, 'name'> |

## 开始React-TypeScript项目

使用`React`的脚手架可以直接创建基于 `TypeScript`的项目，加入参数`--template`即可：

~~~bash
npx create-react-app aip-web-template --template typescript
~~~

## 类型中几个运算符的区别

- & 和 | 操作符
  `&`表示必须同时满足多个契约，`|`表示满足任意一个契约即可

  ~~~typescript
  interface IA {
      a: string
      b: number
  }
  
  type TB = {
      b: number
      c: number[]
  }
  
  type TC = IA | TB;    // TC类型的变量的键只需包含ab或bc即可，当然也可以abc都有
  type TD = IA & TB;    // TD类型的变量的键必需包含abc
  ~~~

  

- interface 和 type 关键字
  `type`关键词更强大一些：type需要创建新type，不可以重名，可以使用type重新定义

  ~~~typescript
  type Size = 'small' | 'default' | 'big' | number;
  const b: Size = 24;
  ~~~

  `interface`关键词没有那么强，但语义更明确。

  - 同名interface自动聚合，也可以和已有的同名class聚合，适合做polyfill

  - 自身只能表示object/class/function的类型

  - 可以在函数上挂载属性

    ~~~typescript
    interface FuncWithAttachment {
        (param: string): boolean;
        someProperty: number;
    }
    
    const testFunc: FuncWithAttachment = ...;
    const result = testFunc('mike');    // 有类型提醒
    testFunc.someProperty = 3;    // 有类型提醒
    ~~~

    > 建议库的开发者所提供的公共 `api` 应该尽量用 `interface/class`，方便使用者自行扩展

- extends 关键字

  这个关键词与`Java`中的是一样的，集成扩展。但在`typescript`中也可以使用`&`运算符来替代

  ~~~typescript
  type A = {
      a: number
  }
  
  interface AB extends A {
      b: string
  }
  // 与上一种等价
  type TAB = A & {
      b: string
  }
  ~~~

  

- 

