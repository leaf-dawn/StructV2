# 布局器指南

布局器是 StructV2 中负责计算节点位置的核心组件。每种数据结构都有对应的布局器来处理特定的布局需求。

## 内置布局器

### 1. Link 布局器

用于链表数据结构的布局。

```javascript
// 链表布局示例
{
    data: [
        { id: "0x1", data: "A", next: "0x2" },
        { id: "0x2", data: "B", next: "0x3" },
        { id: "0x3", data: "C", next: "" }
    ],
    layouter: "Link"
}
```

**特点：**
- 水平排列节点
- 节点间用箭头连接
- 支持单向和双向链表

### 2. BinaryTree 布局器

用于二叉树数据结构的布局。

```javascript
// 二叉树布局示例
{
    data: [
        { id: "root", data: "A", left: "left1", right: "right1" },
        { id: "left1", data: "B", left: "left2", right: "right2" },
        { id: "right1", data: "C", left: "", right: "" }
    ],
    layouter: "BinaryTree"
}
```

**特点：**
- 递归计算节点位置
- 左子树在左侧，右子树在右侧
- 自动调整节点间距

### 3. TriTree 布局器

用于三叉树数据结构的布局。

```javascript
// 三叉树布局示例
{
    data: [
        { id: "root", data: "A", left: "left1", middle: "middle1", right: "right1" },
        { id: "left1", data: "B", left: "", middle: "", right: "" },
        { id: "middle1", data: "C", left: "", middle: "", right: "" },
        { id: "right1", data: "D", left: "", middle: "", right: "" }
    ],
    layouter: "TriTree"
}
```

**特点：**
- 支持三个子节点
- 左、中、右子树分别布局
- 平衡的树形结构

### 4. Stack 布局器

用于栈数据结构的布局。

```javascript
// 栈布局示例
{
    data: [
        { id: "top", data: "A", next: "second" },
        { id: "second", data: "B", next: "third" },
        { id: "third", data: "C", next: "" }
    ],
    layouter: "Stack"
}
```

**特点：**
- 垂直堆叠节点
- 顶部为栈顶
- 支持入栈和出栈动画

### 5. Queue 布局器

用于队列数据结构的布局。

```javascript
// 队列布局示例
{
    data: [
        { id: "front", data: "A", next: "second" },
        { id: "second", data: "B", next: "third" },
        { id: "third", data: "C", next: "" }
    ],
    layouter: "Queue"
}
```

**特点：**
- 水平排列节点
- 左侧为队首
- 支持入队和出队动画

### 6. Array 布局器

用于数组数据结构的布局。

```javascript
// 数组布局示例
{
    data: [
        { id: "0", data: "A", index: 0 },
        { id: "1", data: "B", index: 1 },
        { id: "2", data: "C", index: 2 }
    ],
    layouter: "Array"
}
```

**特点：**
- 水平排列节点
- 显示索引信息
- 支持数组操作动画

### 7. HashTable 布局器

用于哈希表数据结构的布局。

```javascript
// 哈希表布局示例
{
    data: [
        { id: "0", key: "name", value: "John", next: "1" },
        { id: "1", key: "age", value: "25", next: "" }
    ],
    layouter: "HashTable"
}
```

**特点：**
- 显示键值对
- 支持冲突处理
- 链式存储结构

### 8. Force 布局器

用于力导向图布局。

```javascript
// 力导向布局示例
{
    data: [
        { id: "A", data: "A" },
        { id: "B", data: "B" },
        { id: "C", data: "C" }
    ],
    edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" }
    ],
    layouter: "Force"
}
```

**特点：**
- 基于物理模拟
- 自动避免节点重叠
- 支持动态布局

## 自定义布局器

### 布局器接口

自定义布局器需要实现以下接口：

```typescript
interface LayoutCreator {
    // 定义布局选项
    defineOptions(): LayoutOptions;
    
    // 执行布局计算
    layout(nodes: SVNode[], options: LayoutOptions): void;
    
    // 数据预处理（可选）
    sourcesPreprocess?(data: SourceNode[]): SourceNode[];
}
```

### 创建自定义布局器

#### 1. 定义布局选项

```javascript
function defineOptions() {
    return {
        nodeSpacing: 50,      // 节点间距
        levelSpacing: 100,     // 层级间距
        direction: 'horizontal' // 布局方向
    };
}
```

#### 2. 实现布局算法

```javascript
function layout(nodes, options) {
    const { nodeSpacing, levelSpacing, direction } = options;
    
    // 计算节点位置
    nodes.forEach((node, index) => {
        if (direction === 'horizontal') {
            node.x = index * nodeSpacing;
            node.y = node.level * levelSpacing;
        } else {
            node.x = node.level * levelSpacing;
            node.y = index * nodeSpacing;
        }
    });
}
```

#### 3. 注册布局器

```javascript
// 注册自定义布局器
SV.registerLayout('CustomLayout', {
    defineOptions: defineOptions,
    layout: layout,
    sourcesPreprocess: function(data) {
        // 数据预处理逻辑
        return data;
    }
});
```

### 完整示例

```javascript
// 自定义网格布局器
const GridLayout = {
    defineOptions() {
        return {
            columns: 3,        // 网格列数
            nodeSpacing: 80,   // 节点间距
            rowSpacing: 60     // 行间距
        };
    },
    
    layout(nodes, options) {
        const { columns, nodeSpacing, rowSpacing } = options;
        
        nodes.forEach((node, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;
            
            node.x = col * nodeSpacing;
            node.y = row * rowSpacing;
        });
    },
    
    sourcesPreprocess(data) {
        // 添加层级信息
        return data.map((item, index) => ({
            ...item,
            level: Math.floor(index / 3)
        }));
    }
};

// 注册布局器
SV.registerLayout('Grid', GridLayout);

// 使用自定义布局器
const engine = SV(container, options, false);
engine.render({
    CustomData: {
        data: [...],
        layouter: "Grid"
    }
});
```

## 布局器最佳实践

### 1. 性能优化

- 避免不必要的计算
- 使用缓存机制
- 分批处理大量节点

```javascript
function layout(nodes, options) {
    // 使用缓存避免重复计算
    const cache = new Map();
    
    nodes.forEach(node => {
        if (!cache.has(node.id)) {
            const position = calculatePosition(node, options);
            cache.set(node.id, position);
        }
        
        const position = cache.get(node.id);
        node.x = position.x;
        node.y = position.y;
    });
}
```

### 2. 错误处理

```javascript
function layout(nodes, options) {
    if (!nodes || nodes.length === 0) {
        console.warn('No nodes to layout');
        return;
    }
    
    try {
        // 布局计算逻辑
        nodes.forEach(node => {
            if (!node.id) {
                throw new Error('Node must have an id');
            }
            // 计算位置...
        });
    } catch (error) {
        console.error('Layout error:', error);
        // 使用默认布局
        applyDefaultLayout(nodes);
    }
}
```

### 3. 动画支持

```javascript
function layout(nodes, options) {
    const { animate = true, duration = 300 } = options;
    
    nodes.forEach(node => {
        const targetX = calculateX(node);
        const targetY = calculateY(node);
        
        if (animate) {
            // 使用动画过渡到目标位置
            animateToPosition(node, targetX, targetY, duration);
        } else {
            // 直接设置位置
            node.x = targetX;
            node.y = targetY;
        }
    });
}
```

### 4. 响应式布局

```javascript
function layout(nodes, options) {
    const containerWidth = options.containerWidth || 800;
    const containerHeight = options.containerHeight || 600;
    
    // 根据容器大小调整布局
    const scale = Math.min(
        containerWidth / maxWidth,
        containerHeight / maxHeight
    );
    
    nodes.forEach(node => {
        node.x *= scale;
        node.y *= scale;
    });
}
```

## 调试技巧

### 1. 启用调试模式

```javascript
const engine = SV(container, {
    view: {
        debug: true  // 启用调试模式
    }
}, false);
```

### 2. 布局验证

```javascript
function validateLayout(nodes) {
    const errors = [];
    
    nodes.forEach(node => {
        if (typeof node.x !== 'number' || typeof node.y !== 'number') {
            errors.push(`Node ${node.id} has invalid position`);
        }
        
        if (isNaN(node.x) || isNaN(node.y)) {
            errors.push(`Node ${node.id} has NaN position`);
        }
    });
    
    if (errors.length > 0) {
        console.error('Layout validation errors:', errors);
    }
}
```

### 3. 性能监控

```javascript
function layout(nodes, options) {
    const startTime = performance.now();
    
    // 布局计算...
    
    const endTime = performance.now();
    console.log(`Layout took ${endTime - startTime}ms for ${nodes.length} nodes`);
}
``` 