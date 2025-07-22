# 数据结构指南

StructV2 支持多种常见的数据结构可视化，每种数据结构都有特定的数据格式和布局器。

## 支持的数据结构

### 1. 链表 (LinkList)

链表是最基本的数据结构，支持单向链表和双向链表。

#### 数据格式

```javascript
{
    LinkList: {
        data: [
            { id: "0x1", data: "A", next: "0x2" },
            { id: "0x2", data: "B", next: "0x3" },
            { id: "0x3", data: "C", next: "" }
        ],
        layouter: "Link"
    }
}
```

#### 字段说明

- `id`: 节点唯一标识符
- `data`: 节点显示的数据
- `next`: 下一个节点的 ID（空字符串表示链表结束）

#### 示例

```javascript
const engine = SV(container, options, false);
engine.render({
    LinkList: {
        data: [
            { id: "node1", data: "Hello", next: "node2" },
            { id: "node2", data: "World", next: "node3" },
            { id: "node3", data: "!", next: "" }
        ],
        layouter: "Link"
    }
});
```

### 2. 二叉树 (BinaryTree)

二叉树是一种树形数据结构，每个节点最多有两个子节点。

#### 数据格式

```javascript
{
    BinaryTree: {
        data: [
            { id: "root", data: "A", left: "left1", right: "right1" },
            { id: "left1", data: "B", left: "left2", right: "right2" },
            { id: "right1", data: "C", left: "", right: "" },
            { id: "left2", data: "D", left: "", right: "" },
            { id: "right2", data: "E", left: "", right: "" }
        ],
        layouter: "BinaryTree"
    }
}
```

#### 字段说明

- `id`: 节点唯一标识符
- `data`: 节点显示的数据
- `left`: 左子节点的 ID
- `right`: 右子节点的 ID

### 3. 三叉树 (TriTree)

三叉树是一种树形数据结构，每个节点最多有三个子节点。

#### 数据格式

```javascript
{
    TriTree: {
        data: [
            { id: "root", data: "A", left: "left1", middle: "middle1", right: "right1" },
            { id: "left1", data: "B", left: "", middle: "", right: "" },
            { id: "middle1", data: "C", left: "", middle: "", right: "" },
            { id: "right1", data: "D", left: "", middle: "", right: "" }
        ],
        layouter: "TriTree"
    }
}
```

#### 字段说明

- `id`: 节点唯一标识符
- `data`: 节点显示的数据
- `left`: 左子节点的 ID
- `middle`: 中间子节点的 ID
- `right`: 右子节点的 ID

### 4. 栈 (Stack)

栈是一种后进先出（LIFO）的数据结构。

#### 数据格式

```javascript
{
    Stack: {
        data: [
            { id: "top", data: "A", next: "second" },
            { id: "second", data: "B", next: "third" },
            { id: "third", data: "C", next: "" }
        ],
        layouter: "Stack"
    }
}
```

#### 字段说明

- `id`: 节点唯一标识符
- `data`: 节点显示的数据
- `next`: 下一个节点的 ID（栈中下一个元素）

### 5. 队列 (Queue)

队列是一种先进先出（FIFO）的数据结构。

#### 数据格式

```javascript
{
    Queue: {
        data: [
            { id: "front", data: "A", next: "second" },
            { id: "second", data: "B", next: "third" },
            { id: "third", data: "C", next: "" }
        ],
        layouter: "Queue"
    }
}
```

### 6. 数组 (Array)

数组是一种线性数据结构。

#### 数据格式

```javascript
{
    Array: {
        data: [
            { id: "0", data: "A", index: 0 },
            { id: "1", data: "B", index: 1 },
            { id: "2", data: "C", index: 2 },
            { id: "3", data: "D", index: 3 }
        ],
        layouter: "Array"
    }
}
```

#### 字段说明

- `id`: 节点唯一标识符
- `data`: 节点显示的数据
- `index`: 数组索引

### 7. 哈希表 (HashTable)

哈希表是一种键值对存储的数据结构。

#### 数据格式

```javascript
{
    HashTable: {
        data: [
            { id: "0", key: "name", value: "John", next: "1" },
            { id: "1", key: "age", value: "25", next: "" }
        ],
        layouter: "HashTable"
    }
}
```

#### 字段说明

- `id`: 节点唯一标识符
- `key`: 键
- `value`: 值
- `next`: 下一个节点的 ID（处理冲突时使用）

### 8. 图 (Graph)

图是一种由节点和边组成的非线性数据结构。

#### 邻接矩阵格式

```javascript
{
    AdjoinMatrixGraph: {
        data: [
            { id: "A", data: "A" },
            { id: "B", data: "B" },
            { id: "C", data: "C" }
        ],
        matrix: [
            [0, 1, 1],
            [1, 0, 0],
            [1, 0, 0]
        ],
        layouter: "AdjoinMatrix"
    }
}
```

#### 邻接表格式

```javascript
{
    AdjoinTableGraph: {
        data: [
            { id: "A", data: "A", neighbors: ["B", "C"] },
            { id: "B", data: "B", neighbors: ["A"] },
            { id: "C", data: "C", neighbors: ["A"] }
        ],
        layouter: "AdjoinTable"
    }
}
```

### 9. 力导向图 (Force)

力导向图使用物理模拟来布局节点。

#### 数据格式

```javascript
{
    Force: {
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
}
```

### 10. 缩进树 (IndentedTree)

缩进树是一种层次化的树形结构。

#### 数据格式

```javascript
{
    IndentedTree: {
        data: [
            { id: "root", data: "Root", level: 0 },
            { id: "child1", data: "Child 1", level: 1 },
            { id: "child2", data: "Child 2", level: 1 },
            { id: "grandchild", data: "Grandchild", level: 2 }
        ],
        layouter: "IndentedTree"
    }
}
```

#### 字段说明

- `id`: 节点唯一标识符
- `data`: 节点显示的数据
- `level`: 节点的层级（0 为根节点）

## 布局器类型

每种数据结构都有对应的布局器：

| 数据结构 | 布局器 | 描述 |
|---------|--------|------|
| LinkList | Link | 链表布局 |
| BinaryTree | BinaryTree | 二叉树布局 |
| TriTree | TriTree | 三叉树布局 |
| Stack | Stack | 栈布局 |
| Queue | Queue | 队列布局 |
| Array | Array | 数组布局 |
| HashTable | HashTable | 哈希表布局 |
| AdjoinMatrixGraph | AdjoinMatrix | 邻接矩阵图布局 |
| AdjoinTableGraph | AdjoinTable | 邻接表图布局 |
| Force | Force | 力导向布局 |
| IndentedTree | IndentedTree | 缩进树布局 |

## 数据格式规范

### 通用字段

- `id`: 字符串，节点的唯一标识符
- `data`: 任意类型，节点显示的内容
- `layouter`: 字符串，指定使用的布局器

### 特殊字段

根据数据结构类型，可能需要额外的字段：

- `next`: 链表、栈、队列中的下一个节点
- `left/right`: 二叉树中的子节点
- `left/middle/right`: 三叉树中的子节点
- `index`: 数组中的索引
- `key/value`: 哈希表中的键值对
- `neighbors`: 邻接表中的邻居节点
- `level`: 缩进树中的层级
- `source/target`: 图中的边连接

## 最佳实践

1. **ID 命名**: 使用有意义的 ID，便于调试和维护
2. **数据验证**: 确保数据格式正确，避免渲染错误
3. **性能考虑**: 大量数据时考虑分批渲染
4. **交互设计**: 为重要节点添加点击事件处理
5. **样式统一**: 保持节点样式的一致性 