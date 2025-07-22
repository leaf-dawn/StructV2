# StructV2 数据结构可视化框架

## 概述

StructV2 是一个基于 Vue 和 G6 图形库的数据结构可视化框架，专门用于展示各种数据结构（如链表、二叉树、图等）的可视化效果。框架提供了丰富的交互功能和动画效果，支持多种布局方式。

## 主要特性

- 🎯 **多种数据结构支持**：链表、二叉树、三叉树、栈、队列、图、哈希表等
- 🎨 **丰富的可视化效果**：节点样式、连线样式、动画过渡
- 🔧 **灵活的配置系统**：支持自定义布局、样式、行为
- 🎮 **交互式操作**：拖拽、缩放、选择、高亮
- 📱 **响应式设计**：支持不同屏幕尺寸
- ⚡ **高性能渲染**：基于 G6 图形引擎，渲染性能优异

## 快速开始

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd StructV2

# 安装依赖
npm install
```

### 基本使用

```html
<!DOCTYPE html>
<html>
<head>
    <title>StructV2 Demo</title>
</head>
<body>
    <div id="container" style="width: 800px; height: 600px;"></div>
    
    <script src="./dist/sv.js"></script>
    <script>
        // 创建引擎实例
        const engine = SV(document.getElementById('container'), {
            view: {
                fitCenter: true,
                groupPadding: 40
            }
        }, false);

        // 定义数据结构
        const data = {
            LinkList: {
                data: [
                    { id: "0x1", data: "A", next: "0x2" },
                    { id: "0x2", data: "B", next: "0x3" },
                    { id: "0x3", data: "C", next: "" }
                ],
                layouter: "Link"
            }
        };

        // 渲染数据
        engine.render(data);
    </script>
</body>
</html>
```

### 开发环境

```bash
# 启动开发服务器（监听文件变化）
npm run dev

# 构建生产版本
npm run build

# 复制构建产物到指定目录
npm run copy
```

## 文档导航

- [API 参考](./api-reference.md) - 详细的 API 文档
- [数据结构指南](./data-structures.md) - 支持的数据结构类型
- [布局器指南](./layouters.md) - 自定义布局器开发
- [样式配置](./styling.md) - 自定义样式和主题
- [事件系统](./events.md) - 事件监听和处理
- [最佳实践](./best-practices.md) - 使用建议和最佳实践
- [示例代码](./examples.md) - 完整的使用示例

## 版本信息

- 当前版本：0.0.12
- 基于：Vue + G6 4.6.4
- 支持：现代浏览器（ES6+）

## 许可证

[许可证信息]

## 贡献

欢迎提交 Issue 和 Pull Request！

---

更多详细信息请查看各章节文档。 