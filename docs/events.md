# 事件系统

StructV2 提供了完整的事件系统，允许监听和处理用户交互、数据变化等各种事件。

## 事件类型

### 节点事件

#### node:click
节点点击事件

```javascript
engine.on('node:click', (evt) => {
    console.log('节点被点击:', evt.item);
    console.log('节点数据:', evt.item.getModel());
    console.log('鼠标位置:', evt.x, evt.y);
});
```

#### node:dblclick
节点双击事件

```javascript
engine.on('node:dblclick', (evt) => {
    console.log('节点被双击:', evt.item);
    // 可以在这里实现节点编辑功能
});
```

#### node:mouseenter
鼠标进入节点事件

```javascript
engine.on('node:mouseenter', (evt) => {
    const node = evt.item;
    // 高亮显示节点
    node.setState('highlighted', true);
    
    // 显示工具提示
    showTooltip(node.getModel());
});
```

#### node:mouseleave
鼠标离开节点事件

```javascript
engine.on('node:mouseleave', (evt) => {
    const node = evt.item;
    // 取消高亮
    node.setState('highlighted', false);
    
    // 隐藏工具提示
    hideTooltip();
});
```

#### node:dragstart
开始拖拽节点事件

```javascript
engine.on('node:dragstart', (evt) => {
    console.log('开始拖拽节点:', evt.item);
    // 可以在这里设置拖拽时的样式
});
```

#### node:drag
拖拽节点事件

```javascript
engine.on('node:drag', (evt) => {
    const node = evt.item;
    const model = node.getModel();
    console.log('拖拽中:', model.x, model.y);
});
```

#### node:dragend
结束拖拽节点事件

```javascript
engine.on('node:dragend', (evt) => {
    console.log('拖拽结束:', evt.item);
    // 可以在这里保存新的位置
    saveNodePosition(evt.item);
});
```

### 连线事件

#### edge:click
连线点击事件

```javascript
engine.on('edge:click', (evt) => {
    console.log('连线被点击:', evt.item);
    const edge = evt.item;
    const model = edge.getModel();
    console.log('连线数据:', model);
});
```

#### edge:mouseenter
鼠标进入连线事件

```javascript
engine.on('edge:mouseenter', (evt) => {
    const edge = evt.item;
    // 高亮连线
    edge.setState('highlighted', true);
});
```

#### edge:mouseleave
鼠标离开连线事件

```javascript
engine.on('edge:mouseleave', (evt) => {
    const edge = evt.item;
    // 取消高亮
    edge.setState('highlighted', false);
});
```

### 画布事件

#### canvas:click
画布点击事件

```javascript
engine.on('canvas:click', (evt) => {
    console.log('画布被点击:', evt.x, evt.y);
    // 可以在这里实现画布级别的操作
    clearSelection();
});
```

#### canvas:dblclick
画布双击事件

```javascript
engine.on('canvas:dblclick', (evt) => {
    console.log('画布被双击:', evt.x, evt.y);
    // 可以在这里实现缩放或重置视图
    engine.fitView();
});
```

#### canvas:mouseenter
鼠标进入画布事件

```javascript
engine.on('canvas:mouseenter', (evt) => {
    console.log('鼠标进入画布');
    // 可以在这里设置画布状态
});
```

#### canvas:mouseleave
鼠标离开画布事件

```javascript
engine.on('canvas:mouseleave', (evt) => {
    console.log('鼠标离开画布');
    // 可以在这里清理状态
    clearAllHighlights();
});
```

### 视图事件

#### view:zoom
视图缩放事件

```javascript
engine.on('view:zoom', (evt) => {
    console.log('视图缩放:', evt.zoom);
    // 可以在这里更新缩放控件
    updateZoomControl(evt.zoom);
});
```

#### view:pan
视图平移事件

```javascript
engine.on('view:pan', (evt) => {
    console.log('视图平移:', evt.x, evt.y);
    // 可以在这里更新位置信息
    updatePositionInfo(evt.x, evt.y);
});
```

### 数据事件

#### data:update
数据更新事件

```javascript
engine.on('data:update', (evt) => {
    console.log('数据已更新:', evt.data);
    // 可以在这里处理数据变化后的逻辑
    updateStatistics(evt.data);
});
```

#### data:render
数据渲染事件

```javascript
engine.on('data:render', (evt) => {
    console.log('数据渲染完成');
    // 可以在这里执行渲染后的操作
    hideLoadingSpinner();
});
```

## 事件处理

### 基本事件监听

```javascript
// 监听单个事件
engine.on('node:click', handleNodeClick);

// 监听多个事件
engine.on('node:click', handleNodeClick);
engine.on('node:dblclick', handleNodeDblClick);
engine.on('canvas:click', handleCanvasClick);

// 事件处理函数
function handleNodeClick(evt) {
    const node = evt.item;
    const model = node.getModel();
    
    // 高亮选中的节点
    clearSelection();
    node.setState('selected', true);
    
    // 显示节点详情
    showNodeDetails(model);
}
```

### 事件委托

```javascript
// 使用事件委托处理多个节点
engine.on('node:click', (evt) => {
    const node = evt.item;
    const model = node.getModel();
    
    // 根据节点类型执行不同操作
    switch (model.type) {
        case 'root':
            handleRootNodeClick(node);
            break;
        case 'leaf':
            handleLeafNodeClick(node);
            break;
        default:
            handleDefaultNodeClick(node);
    }
});
```

### 事件阻止

```javascript
engine.on('node:click', (evt) => {
    // 阻止事件冒泡
    evt.preventDefault();
    evt.stopPropagation();
    
    // 自定义处理逻辑
    handleCustomClick(evt);
});
```

### 条件事件处理

```javascript
engine.on('node:click', (evt) => {
    const node = evt.item;
    const model = node.getModel();
    
    // 根据条件决定是否处理事件
    if (model.disabled) {
        return; // 忽略禁用节点的点击
    }
    
    if (model.type === 'special') {
        handleSpecialNodeClick(node);
    } else {
        handleNormalNodeClick(node);
    }
});
```

## 自定义事件

### 触发自定义事件

```javascript
// 触发自定义事件
engine.emit('custom:nodeSelected', {
    node: selectedNode,
    timestamp: Date.now()
});

// 监听自定义事件
engine.on('custom:nodeSelected', (data) => {
    console.log('节点被选中:', data.node);
    updateSelectionUI(data);
});
```

### 事件总线

```javascript
// 创建事件总线
const eventBus = {
    listeners: {},
    
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    },
    
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                callback(data);
            });
        }
    },
    
    off(event, callback) {
        if (this.listeners[event]) {
            const index = this.listeners[event].indexOf(callback);
            if (index > -1) {
                this.listeners[event].splice(index, 1);
            }
        }
    }
};

// 使用事件总线
eventBus.on('node:highlight', (node) => {
    highlightNode(node);
});

eventBus.on('node:unhighlight', (node) => {
    unhighlightNode(node);
});
```

## 事件工具函数

### 事件防抖

```javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 使用防抖处理频繁事件
const debouncedZoomHandler = debounce((evt) => {
    updateZoomDisplay(evt.zoom);
}, 100);

engine.on('view:zoom', debouncedZoomHandler);
```

### 事件节流

```javascript
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 使用节流处理拖拽事件
const throttledDragHandler = throttle((evt) => {
    updateDragPosition(evt);
}, 16); // 约60fps

engine.on('node:drag', throttledDragHandler);
```

### 事件组合

```javascript
// 组合多个事件处理
function createEventHandler(engine) {
    let selectedNode = null;
    
    // 节点选择
    engine.on('node:click', (evt) => {
        const node = evt.item;
        
        // 清除之前的选择
        if (selectedNode) {
            selectedNode.setState('selected', false);
        }
        
        // 设置新的选择
        selectedNode = node;
        node.setState('selected', true);
        
        // 触发选择事件
        engine.emit('custom:nodeSelected', { node });
    });
    
    // 画布点击清除选择
    engine.on('canvas:click', (evt) => {
        if (selectedNode) {
            selectedNode.setState('selected', false);
            selectedNode = null;
            engine.emit('custom:selectionCleared');
        }
    });
    
    // 键盘事件
    document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape' && selectedNode) {
            selectedNode.setState('selected', false);
            selectedNode = null;
            engine.emit('custom:selectionCleared');
        }
    });
    
    return {
        getSelectedNode: () => selectedNode,
        clearSelection: () => {
            if (selectedNode) {
                selectedNode.setState('selected', false);
                selectedNode = null;
            }
        }
    };
}

// 使用事件处理器
const eventHandler = createEventHandler(engine);
```

## 事件最佳实践

### 1. 事件清理

```javascript
// 在组件销毁时清理事件监听
function cleanup() {
    // 移除所有事件监听
    engine.off('node:click');
    engine.off('canvas:click');
    engine.off('view:zoom');
    
    // 或者使用命名空间
    engine.off('node:*');
    engine.off('canvas:*');
}
```

### 2. 事件命名规范

```javascript
// 使用命名空间组织事件
engine.on('node:click', handleNodeClick);
engine.on('node:dblclick', handleNodeDblClick);
engine.on('node:mouseenter', handleNodeMouseEnter);

// 自定义事件使用前缀
engine.on('custom:nodeSelected', handleNodeSelected);
engine.on('custom:dataUpdated', handleDataUpdated);
```

### 3. 错误处理

```javascript
engine.on('node:click', (evt) => {
    try {
        handleNodeClick(evt);
    } catch (error) {
        console.error('节点点击处理错误:', error);
        // 显示错误信息给用户
        showErrorMessage('操作失败，请重试');
    }
});
```

### 4. 性能优化

```javascript
// 使用事件委托减少监听器数量
engine.on('node:click', (evt) => {
    const node = evt.item;
    const model = node.getModel();
    
    // 根据节点类型分发到不同的处理函数
    const handlers = {
        'root': handleRootNode,
        'leaf': handleLeafNode,
        'branch': handleBranchNode
    };
    
    const handler = handlers[model.type] || handleDefaultNode;
    handler(node);
});
```

### 5. 调试技巧

```javascript
// 启用事件调试
const DEBUG_EVENTS = true;

if (DEBUG_EVENTS) {
    engine.on('*', (evt) => {
        console.log('Event:', evt.type, evt);
    });
}

// 监听特定事件进行调试
engine.on('node:click', (evt) => {
    console.group('Node Click Event');
    console.log('Event:', evt);
    console.log('Node:', evt.item);
    console.log('Model:', evt.item.getModel());
    console.groupEnd();
});
``` 