# StructV2

一个用于数据结构可视化的框架。

## 功能特性

- 支持多种数据结构可视化
- 可配置的布局和样式
- 交互式操作
- 动画效果

## 图像位置配置

### 自动居中控制

框架默认会将图像自动居中显示。你可以通过配置来控制这个行为：

```javascript
// 创建引擎实例时配置
const engine = SV(container, {
    view: {
        fitCenter: true,  // 默认值：true，启用自动居中
        // fitCenter: false, // 设置为 false 禁用自动居中
        groupPadding: 40,
    },
}, isForce);
```

### 偏移配置（x/y百分比）

你可以通过 `centerOffsetXPercent` 和 `centerOffsetYPercent` 配置项，控制居中时的偏移：
- `centerOffsetXPercent`：x方向偏移百分比（相对于画布宽度，正数向右，负数向左）
- `centerOffsetYPercent`：y方向偏移百分比（相对于画布高度，正数向下，负数向上）

#### 示例：整体上移30%

```javascript
const engine = SV(container, {
    view: {
        fitCenter: true,
        centerOffsetYPercent: -0.3, // 向上偏移30%
        groupPadding: 40,
    },
}, isForce);
```

#### 示例：整体右移20%，下移10%

```javascript
const engine = SV(container, {
    view: {
        fitCenter: true,
        centerOffsetXPercent: 0.2, // 向右偏移20%
        centerOffsetYPercent: 0.1, // 向下偏移10%
        groupPadding: 40,
    },
}, isForce);
```

### 配置选项说明

- `fitCenter`: 布尔值，控制是否自动将图像居中显示
  - `true` (默认): 图像会自动居中显示
  - `false`: 图像不会自动居中，保持原始位置
- `centerOffsetXPercent`: number，居中时x方向偏移百分比（正数向右，负数向左）
- `centerOffsetYPercent`: number，居中时y方向偏移百分比（正数向下，负数向上）

### 使用示例

```javascript
// 禁用自动居中
const engine = SV(container, {
    view: {
        fitCenter: false,
        groupPadding: 40,
    },
}, isForce);

// 启用自动居中（默认行为）
const engine = SV(container, {
    view: {
        fitCenter: true,
        groupPadding: 40,
    },
}, isForce);
```

## 安装和使用

### 启动
```javascript
1. git clone
2. npm install

// 开发环境：
3. npm run dev

// 打包出生产环境产物
4. npm run build
```

