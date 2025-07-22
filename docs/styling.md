# 样式配置指南

StructV2 提供了灵活的样式配置系统，允许自定义节点外观、连线样式和整体主题。

## 节点样式

### 基础节点样式

节点样式通过 CSS 类或内联样式进行配置。

```javascript
// 基础节点样式配置
const nodeStyle = {
    fill: '#ffffff',           // 填充颜色
    stroke: '#333333',         // 边框颜色
    strokeWidth: 2,            // 边框宽度
    radius: 20,                // 圆角半径
    fontSize: 14,              // 字体大小
    fontColor: '#333333',      // 字体颜色
    fontWeight: 'normal'       // 字体粗细
};
```

### 自定义节点形状

StructV2 支持多种节点形状：

#### 1. 圆形节点

```javascript
const circleNode = {
    shape: 'circle',
    size: 40,
    style: {
        fill: '#4CAF50',
        stroke: '#2E7D32',
        strokeWidth: 2
    }
};
```

#### 2. 矩形节点

```javascript
const rectNode = {
    shape: 'rect',
    size: [80, 40],
    style: {
        fill: '#2196F3',
        stroke: '#1976D2',
        strokeWidth: 2,
        radius: 4
    }
};
```

#### 3. 菱形节点

```javascript
const diamondNode = {
    shape: 'diamond',
    size: 50,
    style: {
        fill: '#FF9800',
        stroke: '#F57C00',
        strokeWidth: 2
    }
};
```

### 节点状态样式

为不同状态的节点定义样式：

```javascript
const nodeStates = {
    // 默认状态
    default: {
        fill: '#ffffff',
        stroke: '#333333',
        strokeWidth: 2
    },
    
    // 选中状态
    selected: {
        fill: '#E3F2FD',
        stroke: '#2196F3',
        strokeWidth: 3,
        shadowColor: '#2196F3',
        shadowBlur: 10
    },
    
    // 高亮状态
    highlighted: {
        fill: '#FFF3E0',
        stroke: '#FF9800',
        strokeWidth: 3
    },
    
    // 错误状态
    error: {
        fill: '#FFEBEE',
        stroke: '#F44336',
        strokeWidth: 3
    }
};
```

### 节点标签样式

配置节点文本标签的样式：

```javascript
const labelStyle = {
    position: 'center',        // 标签位置：'center', 'top', 'bottom', 'left', 'right'
    offset: [0, 0],           // 标签偏移
    style: {
        fontSize: 14,
        fontFamily: 'Arial, sans-serif',
        fill: '#333333',
        fontWeight: 'normal',
        textAlign: 'center'
    }
};
```

## 连线样式

### 基础连线样式

```javascript
const edgeStyle = {
    stroke: '#666666',         // 线条颜色
    strokeWidth: 2,            // 线条宽度
    strokeOpacity: 0.8,        // 线条透明度
    lineDash: [],              // 虚线样式
    endArrow: true,            // 是否显示箭头
    startArrow: false          // 是否显示起始箭头
};
```

### 连线类型

#### 1. 实线

```javascript
const solidLine = {
    stroke: '#333333',
    strokeWidth: 2,
    lineDash: []
};
```

#### 2. 虚线

```javascript
const dashedLine = {
    stroke: '#666666',
    strokeWidth: 2,
    lineDash: [5, 5]
};
```

#### 3. 点线

```javascript
const dottedLine = {
    stroke: '#999999',
    strokeWidth: 2,
    lineDash: [2, 2]
};
```

### 箭头样式

```javascript
const arrowStyle = {
    endArrow: {
        path: 'M 0,0 L 8,4 L 8,-4 Z',
        fill: '#333333'
    },
    startArrow: {
        path: 'M 0,0 L 8,4 L 8,-4 Z',
        fill: '#333333'
    }
};
```

## 主题配置

### 预定义主题

StructV2 提供了几种预定义的主题：

#### 1. 默认主题

```javascript
const defaultTheme = {
    node: {
        fill: '#ffffff',
        stroke: '#333333',
        strokeWidth: 2
    },
    edge: {
        stroke: '#666666',
        strokeWidth: 2
    },
    label: {
        fontSize: 14,
        fill: '#333333'
    }
};
```

#### 2. 深色主题

```javascript
const darkTheme = {
    node: {
        fill: '#2c3e50',
        stroke: '#34495e',
        strokeWidth: 2
    },
    edge: {
        stroke: '#7f8c8d',
        strokeWidth: 2
    },
    label: {
        fontSize: 14,
        fill: '#ecf0f1'
    }
};
```

#### 3. 彩色主题

```javascript
const colorfulTheme = {
    node: {
        fill: '#3498db',
        stroke: '#2980b9',
        strokeWidth: 2
    },
    edge: {
        stroke: '#e74c3c',
        strokeWidth: 2
    },
    label: {
        fontSize: 14,
        fill: '#2c3e50'
    }
};
```

### 自定义主题

创建自定义主题：

```javascript
const customTheme = {
    // 节点样式
    node: {
        default: {
            fill: '#f8f9fa',
            stroke: '#dee2e6',
            strokeWidth: 2,
            radius: 6
        },
        selected: {
            fill: '#e3f2fd',
            stroke: '#2196f3',
            strokeWidth: 3
        },
        highlighted: {
            fill: '#fff3e0',
            stroke: '#ff9800',
            strokeWidth: 3
        }
    },
    
    // 连线样式
    edge: {
        default: {
            stroke: '#adb5bd',
            strokeWidth: 2,
            endArrow: true
        },
        selected: {
            stroke: '#2196f3',
            strokeWidth: 3
        }
    },
    
    // 标签样式
    label: {
        fontSize: 12,
        fontFamily: 'Roboto, sans-serif',
        fill: '#495057'
    },
    
    // 背景样式
    background: {
        fill: '#ffffff'
    }
};
```

## 样式应用

### 全局样式配置

```javascript
const engine = SV(container, {
    view: {
        theme: customTheme,
        nodeStyle: nodeStyle,
        edgeStyle: edgeStyle
    }
}, false);
```

### 动态样式更新

```javascript
// 更新节点样式
engine.updateStyle('groupName', {
    node: {
        fill: '#ff0000',
        stroke: '#cc0000'
    }
});

// 更新连线样式
engine.updateStyle('groupName', {
    edge: {
        stroke: '#00ff00',
        strokeWidth: 3
    }
});
```

### 条件样式

根据数据条件应用不同样式：

```javascript
function getNodeStyle(node) {
    if (node.type === 'root') {
        return {
            fill: '#4CAF50',
            stroke: '#2E7D32',
            strokeWidth: 3
        };
    } else if (node.type === 'leaf') {
        return {
            fill: '#FFC107',
            stroke: '#FF8F00',
            strokeWidth: 2
        };
    } else {
        return {
            fill: '#2196F3',
            stroke: '#1976D2',
            strokeWidth: 2
        };
    }
}
```

## CSS 样式

### 自定义 CSS 类

```css
/* 自定义节点样式 */
.custom-node {
    fill: #4CAF50;
    stroke: #2E7D32;
    stroke-width: 2;
}

.custom-node:hover {
    fill: #66BB6A;
    stroke: #388E3C;
    stroke-width: 3;
}

/* 自定义连线样式 */
.custom-edge {
    stroke: #FF5722;
    stroke-width: 2;
}

.custom-edge:hover {
    stroke: #FF7043;
    stroke-width: 3;
}

/* 自定义标签样式 */
.custom-label {
    font-size: 14px;
    font-family: 'Roboto', sans-serif;
    fill: #212121;
}
```

### 响应式样式

```css
/* 移动设备样式 */
@media (max-width: 768px) {
    .custom-node {
        stroke-width: 1;
    }
    
    .custom-label {
        font-size: 12px;
    }
}

/* 高分辨率屏幕样式 */
@media (min-resolution: 2dppx) {
    .custom-node {
        stroke-width: 1.5;
    }
}
```

## 动画样式

### 节点动画

```javascript
const nodeAnimation = {
    // 进入动画
    enter: {
        duration: 500,
        easing: 'easeOutQuart',
        properties: {
            opacity: [0, 1],
            scale: [0.8, 1]
        }
    },
    
    // 退出动画
    exit: {
        duration: 300,
        easing: 'easeInQuart',
        properties: {
            opacity: [1, 0],
            scale: [1, 0.8]
        }
    },
    
    // 更新动画
    update: {
        duration: 400,
        easing: 'easeInOutQuad',
        properties: {
            x: true,
            y: true,
            fill: true
        }
    }
};
```

### 连线动画

```javascript
const edgeAnimation = {
    // 连线绘制动画
    draw: {
        duration: 800,
        easing: 'easeOutCubic',
        properties: {
            strokeDasharray: ['0,1000', '1000,0']
        }
    },
    
    // 连线高亮动画
    highlight: {
        duration: 200,
        easing: 'easeInOutQuad',
        properties: {
            strokeWidth: [2, 4],
            stroke: ['#666666', '#FF5722']
        }
    }
};
```

## 最佳实践

### 1. 颜色搭配

- 使用对比度高的颜色组合
- 保持颜色一致性
- 考虑色盲用户的可访问性

```javascript
const accessibleColors = {
    primary: '#2196F3',
    secondary: '#FF9800',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#00BCD4'
};
```

### 2. 字体选择

```javascript
const fontConfig = {
    primary: 'Roboto, Arial, sans-serif',
    monospace: 'Consolas, Monaco, monospace',
    sizes: {
        small: 12,
        normal: 14,
        large: 16,
        xlarge: 18
    }
};
```

### 3. 间距规范

```javascript
const spacing = {
    nodePadding: 20,
    levelSpacing: 60,
    groupSpacing: 100,
    labelOffset: 10
};
```

### 4. 性能优化

```javascript
// 使用对象池减少内存分配
const stylePool = new Map();

function getStyle(type, state) {
    const key = `${type}-${state}`;
    if (!stylePool.has(key)) {
        stylePool.set(key, createStyle(type, state));
    }
    return stylePool.get(key);
}
``` 