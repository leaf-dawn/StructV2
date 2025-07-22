# API 参考

## 核心 API

### SV 函数

StructV2 的主入口函数，用于创建可视化引擎实例。

```typescript
SV(DOMContainer: HTMLElement, engineOptions?: EngineOptions, isForce?: boolean): Engine
```

#### 参数

- `DOMContainer`: HTMLElement - 容器 DOM 元素
- `engineOptions`: EngineOptions - 引擎配置选项（可选）
- `isForce`: boolean - 是否使用力导向布局（可选，默认 false）

#### 返回值

返回一个 `Engine` 实例，用于控制可视化渲染。

#### 示例

```javascript
const engine = SV(document.getElementById('container'), {
    view: {
        fitCenter: true,
        groupPadding: 40
    }
}, false);
```

### Engine 类

可视化引擎的核心类，提供渲染、交互、事件等功能。

#### 构造函数

```typescript
constructor(DOMContainer: HTMLElement, engineOptions: EngineOptions, isForce: boolean)
```

#### 主要方法

##### render(sources: Sources)

渲染数据结构。

```typescript
render(sources: Sources): void
```

**参数：**
- `sources`: Sources - 要渲染的数据源

**示例：**
```javascript
engine.render({
    LinkList: {
        data: [...],
        layouter: "Link"
    }
});
```

##### reLayout(layoutMode?: ELayoutMode)

重新布局。

```typescript
reLayout(layoutMode?: ELayoutMode): void
```

**参数：**
- `layoutMode`: ELayoutMode - 布局模式（可选）

**示例：**
```javascript
engine.reLayout(ELayoutMode.HORIZONTAL);
```

##### getGraphInstance()

获取 G6 图实例。

```typescript
getGraphInstance(): Graph
```

**返回值：**
- G6 图实例

##### hideGroups(groupNames: string | string[])

隐藏指定的组。

```typescript
hideGroups(groupNames: string | string[]): void
```

**参数：**
- `groupNames`: string | string[] - 要隐藏的组名

##### showGroups(groupNames: string | string[])

显示指定的组。

```typescript
showGroups(groupNames: string | string[]): void
```

**参数：**
- `groupNames`: string | string[] - 要显示的组名

##### getAllModels()

获取所有模型。

```typescript
getAllModels(): SVModel[]
```

**返回值：**
- 所有模型数组

##### findNode(id: string)

根据 ID 查找节点。

```typescript
findNode(id: string): SVNode
```

**参数：**
- `id`: string - 节点 ID

**返回值：**
- 找到的节点，未找到返回 null

##### resize(width: number, height: number)

调整容器大小。

```typescript
resize(width: number, height: number): void
```

**参数：**
- `width`: number - 新宽度
- `height`: number - 新高度

##### on(eventName: string, callback: Function)

注册事件监听器。

```typescript
on(eventName: string, callback: Function): void
```

**参数：**
- `eventName`: string - 事件名称
- `callback`: Function - 回调函数

##### destroy()

销毁引擎实例。

```typescript
destroy(): void
```

## 配置选项

### EngineOptions

引擎配置选项接口。

```typescript
interface EngineOptions {
    view?: ViewOptions;
    animation?: AnimationOptions;
    behavior?: BehaviorOptions;
}
```

### ViewOptions

视图配置选项。

```typescript
interface ViewOptions {
    fitCenter?: boolean;           // 是否自动居中（默认：true）
    fitView?: boolean;             // 是否适应视图（默认：false）
    groupPadding?: number;         // 组间距（默认：20）
    updateHighlight?: string;      // 更新高亮颜色（默认：'#fc5185'）
    layoutMode?: ELayoutMode;      // 布局模式（默认：HORIZONTAL）
    centerOffsetXPercent?: number; // X方向偏移百分比
    centerOffsetYPercent?: number; // Y方向偏移百分比
}
```

### AnimationOptions

动画配置选项。

```typescript
interface AnimationOptions {
    enable?: boolean;              // 是否启用动画（默认：true）
    duration?: number;             // 动画持续时间（毫秒，默认：750）
    timingFunction?: string;       // 动画缓动函数（默认：'easePolyOut'）
}
```

### BehaviorOptions

行为配置选项。

```typescript
interface BehaviorOptions {
    drag?: boolean;                // 是否允许拖拽（默认：true）
    zoom?: boolean;                // 是否允许缩放（默认：true）
    dragNode?: boolean;            // 是否允许拖拽节点（默认：true）
    selectNode?: boolean;          // 是否允许选择节点（默认：true）
}
```

## 布局模式

### ELayoutMode 枚举

```typescript
enum ELayoutMode {
    HORIZONTAL = 'horizontal',     // 水平布局
    VERTICAL = 'vertical'          // 垂直布局
}
```

## 静态属性

### SV.Group

组类，用于管理节点组。

```typescript
SV.Group: typeof Group
```

### SV.Bound

边界类，用于计算边界。

```typescript
SV.Bound: typeof Bound
```

### SV.Vector

向量类，用于向量计算。

```typescript
SV.Vector: typeof Vector
```

### SV.G6

G6 图形库实例。

```typescript
SV.G6: typeof G6
```

### SV.registeredShape

已注册的图形类型数组。

```typescript
SV.registeredShape: any[]
```

### SV.registeredLayout

已注册的布局器对象。

```typescript
SV.registeredLayout: { [key: string]: LayoutCreator }
```

## 注册方法

### registerShape

注册自定义图形。

```typescript
SV.registerShape(shape: any): void
```

### registerLayout

注册自定义布局器。

```typescript
SV.registerLayout(name: string, layoutCreator: LayoutCreator): void
```

**参数：**
- `name`: string - 布局器名称
- `layoutCreator`: LayoutCreator - 布局器创建函数

## 事件系统

### 支持的事件

- `node:click` - 节点点击事件
- `node:dblclick` - 节点双击事件
- `node:mouseenter` - 节点鼠标进入事件
- `node:mouseleave` - 节点鼠标离开事件
- `edge:click` - 边点击事件
- `canvas:click` - 画布点击事件

### 事件监听示例

```javascript
engine.on('node:click', (evt) => {
    console.log('节点被点击:', evt.item);
});

engine.on('canvas:click', (evt) => {
    console.log('画布被点击:', evt);
});
``` 