import { Util } from "../Common/util";

export default Util.registerShape('bar-chart-node', {
    draw(cfg, group) {
        cfg.size = cfg.size || [40, 60];
        
        const width = cfg.size[0];
        const height = cfg.size[1];
        
        // 获取数据值，默认为1
        const value = Number(cfg.value) || 1;
        const maxValue = Number(cfg.maxValue) || 100;
        
        // 计算实际高度，基于value和maxValue的比例
        const actualHeight = (value / maxValue) * height;
        
        // 绘制柱状图矩形
        const barRect = group.addShape('rect', {
            attrs: {
                x: 0,
                y: height - actualHeight, // 从底部开始绘制
                width: width,
                height: actualHeight,
                stroke: cfg.style?.stroke || '#333',
                fill: cfg.style?.fill || '#95e1d3',
                cursor: cfg.style?.cursor,
            },
            name: 'bar-rect',
            draggable: true,
        });
        
        // 绘制数值标签
        if (cfg.label !== undefined) {
            const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
            group.addShape('text', {
                attrs: {
                    x: width / 2,
                    y: height - actualHeight / 2,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: cfg.label,
                    fill: style.fill || '#000',
                    fontSize: style.fontSize || 12,
                    cursor: cfg.style?.cursor,
                },
                name: 'label',
                draggable: true,
            });
        }
        
        return barRect;
    },
    
    getAnchorPoints() {
        return [
            [0.5, 0],   // 顶部
            [1, 0.5],   // 右侧
            [0.5, 1],   // 底部
            [0, 0.5]    // 左侧
        ];
    }
}, 'rect'); 