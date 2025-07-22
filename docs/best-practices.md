# 最佳实践

本文档提供了使用 StructV2 的最佳实践，包括性能优化、代码组织和常见问题的解决方案。

## 性能优化

### 1. 数据优化

#### 避免频繁渲染

```javascript
// ❌ 错误：频繁更新导致性能问题
function updateData() {
    for (let i = 0; i < 1000; i++) {
        engine.render(newData);
    }
}

// ✅ 正确：批量更新
function updateData() {
    const batchData = prepareBatchData();
    engine.render(batchData);
}
```

#### 使用数据缓存

```javascript
// 缓存计算结果
const nodeCache = new Map();

function getNodePosition(nodeId, layoutOptions) {
    const cacheKey = `${nodeId}-${JSON.stringify(layoutOptions)}`;
    
    if (!nodeCache.has(cacheKey)) {
        const position = calculatePosition(nodeId, layoutOptions);
        nodeCache.set(cacheKey, position);
    }
    
    return nodeCache.get(cacheKey);
}
```

#### 虚拟化大量数据

```javascript
// 对于大量节点，使用虚拟化
function renderLargeDataset(data) {
    const visibleNodes = data.filter(node => 
        isInViewport(node.x, node.y)
    );
    
    engine.render({
        visibleData: {
            data: visibleNodes,
            layouter: "Custom"
        }
    });
}
```

### 2. 渲染优化

#### 使用防抖和节流

```javascript
// 防抖处理频繁的视图更新
const debouncedRender = debounce((data) => {
    engine.render(data);
}, 100);

// 节流处理拖拽事件
const throttledDrag = throttle((evt) => {
    updateNodePosition(evt);
}, 16);
```

#### 批量操作

```javascript
// 批量更新节点样式
function updateMultipleNodes(nodeIds, style) {
    const graph = engine.getGraphInstance();
    
    // 开始批量操作
    graph.beginUpdate();
    
    nodeIds.forEach(id => {
        const node = graph.findById(id);
        if (node) {
            node.update(style);
        }
    });
    
    // 结束批量操作
    graph.endUpdate();
}
```

### 3. 内存管理

#### 及时清理事件监听

```javascript
class DataStructureViewer {
    constructor(container) {
        this.engine = SV(container, options, false);
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.nodeClickHandler = this.handleNodeClick.bind(this);
        this.engine.on('node:click', this.nodeClickHandler);
    }
    
    destroy() {
        // 清理事件监听
        this.engine.off('node:click', this.nodeClickHandler);
        this.engine.destroy();
    }
}
```

#### 对象池模式

```javascript
// 使用对象池减少内存分配
class NodePool {
    constructor() {
        this.pool = [];
    }
    
    get() {
        return this.pool.pop() || this.createNode();
    }
    
    release(node) {
        this.resetNode(node);
        this.pool.push(node);
    }
    
    createNode() {
        return {
            id: '',
            data: '',
            x: 0,
            y: 0
        };
    }
    
    resetNode(node) {
        node.id = '';
        node.data = '';
        node.x = 0;
        node.y = 0;
    }
}
```

## 代码组织

### 1. 模块化设计

#### 分离关注点

```javascript
// 数据管理模块
class DataManager {
    constructor() {
        this.data = new Map();
    }
    
    setData(key, data) {
        this.data.set(key, data);
    }
    
    getData(key) {
        return this.data.get(key);
    }
    
    validateData(data) {
        // 数据验证逻辑
        return data && Array.isArray(data.data);
    }
}

// 渲染管理模块
class RenderManager {
    constructor(engine) {
        this.engine = engine;
    }
    
    render(data) {
        if (this.validateData(data)) {
            this.engine.render(data);
        }
    }
    
    validateData(data) {
        // 渲染前验证
        return true;
    }
}

// 事件管理模块
class EventManager {
    constructor(engine) {
        this.engine = engine;
        this.handlers = new Map();
    }
    
    on(event, handler) {
        this.handlers.set(event, handler);
        this.engine.on(event, handler);
    }
    
    off(event) {
        const handler = this.handlers.get(event);
        if (handler) {
            this.engine.off(event, handler);
            this.handlers.delete(event);
        }
    }
}
```

#### 配置管理

```javascript
// 配置管理
class ConfigManager {
    constructor() {
        this.config = this.getDefaultConfig();
    }
    
    getDefaultConfig() {
        return {
            view: {
                fitCenter: true,
                groupPadding: 40
            },
            animation: {
                enable: true,
                duration: 750
            },
            behavior: {
                drag: true,
                zoom: true
            }
        };
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    getConfig() {
        return this.config;
    }
}
```

### 2. 错误处理

#### 全局错误处理

```javascript
class ErrorHandler {
    static handleError(error, context) {
        console.error('StructV2 Error:', error);
        console.error('Context:', context);
        
        // 发送错误报告
        this.reportError(error, context);
        
        // 显示用户友好的错误信息
        this.showUserError(error);
    }
    
    static reportError(error, context) {
        // 错误上报逻辑
    }
    
    static showUserError(error) {
        // 显示用户友好的错误信息
        const message = this.getErrorMessage(error);
        showNotification(message, 'error');
    }
    
    static getErrorMessage(error) {
        const errorMessages = {
            'INVALID_DATA': '数据格式不正确',
            'RENDER_FAILED': '渲染失败，请重试',
            'NETWORK_ERROR': '网络连接失败'
        };
        
        return errorMessages[error.code] || '发生未知错误';
    }
}
```

#### 数据验证

```javascript
class DataValidator {
    static validateNodeData(data) {
        const errors = [];
        
        if (!data.id) {
            errors.push('节点缺少ID');
        }
        
        if (typeof data.data === 'undefined') {
            errors.push('节点缺少数据');
        }
        
        if (data.x !== undefined && (isNaN(data.x) || !isFinite(data.x))) {
            errors.push('节点X坐标无效');
        }
        
        if (data.y !== undefined && (isNaN(data.y) || !isFinite(data.y))) {
            errors.push('节点Y坐标无效');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    static validateEdgeData(data) {
        const errors = [];
        
        if (!data.source) {
            errors.push('连线缺少源节点');
        }
        
        if (!data.target) {
            errors.push('连线缺少目标节点');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
```

### 3. 测试策略

#### 单元测试

```javascript
// 使用 Jest 进行单元测试
describe('DataValidator', () => {
    test('should validate valid node data', () => {
        const data = {
            id: 'node1',
            data: 'test',
            x: 100,
            y: 200
        };
        
        const result = DataValidator.validateNodeData(data);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });
    
    test('should detect invalid node data', () => {
        const data = {
            data: 'test',
            x: 'invalid'
        };
        
        const result = DataValidator.validateNodeData(data);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('节点缺少ID');
        expect(result.errors).toContain('节点X坐标无效');
    });
});
```

#### 集成测试

```javascript
describe('StructV2 Integration', () => {
    let container;
    let engine;
    
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        engine = SV(container, {}, false);
    });
    
    afterEach(() => {
        engine.destroy();
        document.body.removeChild(container);
    });
    
    test('should render linked list correctly', () => {
        const data = {
            LinkList: {
                data: [
                    { id: '1', data: 'A', next: '2' },
                    { id: '2', data: 'B', next: '' }
                ],
                layouter: 'Link'
            }
        };
        
        engine.render(data);
        
        const graph = engine.getGraphInstance();
        const nodes = graph.getNodes();
        
        expect(nodes).toHaveLength(2);
    });
});
```

## 常见问题解决方案

### 1. 渲染问题

#### 节点不显示

```javascript
// 检查节点位置是否在可视区域内
function checkNodeVisibility(node) {
    const graph = engine.getGraphInstance();
    const bbox = graph.get('bbox');
    
    return node.x >= bbox.minX && 
           node.x <= bbox.maxX && 
           node.y >= bbox.minY && 
           node.y <= bbox.maxY;
}

// 自动调整视图以显示所有节点
function ensureAllNodesVisible() {
    const graph = engine.getGraphInstance();
    graph.fitView();
}
```

#### 连线显示异常

```javascript
// 检查连线端点是否存在
function validateEdges(edges, nodes) {
    const nodeIds = new Set(nodes.map(n => n.id));
    
    return edges.filter(edge => {
        const hasSource = nodeIds.has(edge.source);
        const hasTarget = nodeIds.has(edge.target);
        
        if (!hasSource || !hasTarget) {
            console.warn(`Invalid edge: ${edge.source} -> ${edge.target}`);
        }
        
        return hasSource && hasTarget;
    });
}
```

### 2. 性能问题

#### 大量节点渲染慢

```javascript
// 使用分层渲染
function renderLargeGraph(data) {
    const levels = groupNodesByLevel(data.nodes);
    
    // 先渲染重要节点
    renderImportantNodes(levels.important);
    
    // 延迟渲染其他节点
    setTimeout(() => {
        renderOtherNodes(levels.others);
    }, 100);
}

function groupNodesByLevel(nodes) {
    return {
        important: nodes.filter(n => n.level <= 2),
        others: nodes.filter(n => n.level > 2)
    };
}
```

#### 动画卡顿

```javascript
// 优化动画性能
const optimizedAnimation = {
    enable: true,
    duration: 300, // 减少动画时间
    easing: 'easeOutQuad', // 使用更简单的缓动函数
    batchSize: 50 // 分批处理大量节点
};

// 在低性能设备上禁用动画
function getAnimationConfig() {
    const isLowPerformance = navigator.hardwareConcurrency <= 2;
    
    return {
        enable: !isLowPerformance,
        duration: isLowPerformance ? 0 : 300
    };
}
```

### 3. 交互问题

#### 拖拽不流畅

```javascript
// 优化拖拽性能
const dragConfig = {
    enable: true,
    throttle: 16, // 限制拖拽事件频率
    enableOptimize: true, // 启用拖拽优化
    enableDebounce: true // 启用防抖
};

// 拖拽时隐藏不必要的元素
engine.on('node:dragstart', (evt) => {
    const node = evt.item;
    node.hide();
});

engine.on('node:dragend', (evt) => {
    const node = evt.item;
    node.show();
});
```

#### 缩放问题

```javascript
// 限制缩放范围
const zoomConfig = {
    min: 0.1,
    max: 5,
    step: 0.1
};

// 监听缩放事件并限制范围
engine.on('view:zoom', (evt) => {
    if (evt.zoom < zoomConfig.min || evt.zoom > zoomConfig.max) {
        // 重置到有效范围
        const validZoom = Math.max(zoomConfig.min, 
                                  Math.min(zoomConfig.max, evt.zoom));
        engine.zoomTo(validZoom);
    }
});
```

## 调试技巧

### 1. 启用调试模式

```javascript
// 开发环境启用调试
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
    // 启用调试信息
    console.log('StructV2 Debug Mode Enabled');
    
    // 监听所有事件
    engine.on('*', (evt) => {
        console.log('Event:', evt.type, evt);
    });
}
```

### 2. 性能监控

```javascript
// 性能监控工具
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
    }
    
    startTimer(name) {
        this.metrics.set(name, performance.now());
    }
    
    endTimer(name) {
        const startTime = this.metrics.get(name);
        if (startTime) {
            const duration = performance.now() - startTime;
            console.log(`${name} took ${duration.toFixed(2)}ms`);
            this.metrics.delete(name);
        }
    }
    
    measureRender(data) {
        this.startTimer('render');
        engine.render(data);
        this.endTimer('render');
    }
}
```

### 3. 内存泄漏检测

```javascript
// 内存泄漏检测
class MemoryLeakDetector {
    constructor() {
        this.snapshots = [];
    }
    
    takeSnapshot() {
        if (performance.memory) {
            this.snapshots.push({
                timestamp: Date.now(),
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize
            });
        }
    }
    
    analyze() {
        if (this.snapshots.length < 2) return;
        
        const first = this.snapshots[0];
        const last = this.snapshots[this.snapshots.length - 1];
        const increase = last.usedJSHeapSize - first.usedJSHeapSize;
        
        if (increase > 10 * 1024 * 1024) { // 10MB
            console.warn('Potential memory leak detected');
        }
    }
}
```

## 部署建议

### 1. 生产环境优化

```javascript
// 生产环境配置
const productionConfig = {
    view: {
        fitCenter: true,
        groupPadding: 40
    },
    animation: {
        enable: false, // 生产环境禁用动画以提高性能
        duration: 0
    },
    behavior: {
        drag: true,
        zoom: true,
        dragNode: false // 禁用节点拖拽以提高性能
    }
};
```

### 2. 错误监控

```javascript
// 集成错误监控服务
class ErrorMonitor {
    static captureError(error, context) {
        // 发送到错误监控服务
        if (window.Sentry) {
            Sentry.captureException(error, {
                extra: context
            });
        }
        
        // 本地错误日志
        console.error('StructV2 Error:', error, context);
    }
    
    static captureMessage(message, level = 'info') {
        if (window.Sentry) {
            Sentry.captureMessage(message, level);
        }
    }
}
```

### 3. 性能监控

```javascript
// 性能监控
class PerformanceTracker {
    static trackRenderTime(data) {
        const start = performance.now();
        
        return new Promise((resolve) => {
            engine.render(data);
            
            // 等待渲染完成
            setTimeout(() => {
                const duration = performance.now() - start;
                this.reportMetric('render_time', duration);
                resolve(duration);
            }, 100);
        });
    }
    
    static reportMetric(name, value) {
        // 发送性能指标到监控服务
        if (window.analytics) {
            window.analytics.track('performance_metric', {
                name,
                value,
                timestamp: Date.now()
            });
        }
    }
}
``` 