import { Util } from "../Common/util";

export default Util.registerShape('bar-chart-node', {
    draw(cfg, group) {
        cfg.size = cfg.size || [40, 60];
        
        const width = cfg.size[0];
        const height = cfg.size[1];
        
        // 获取数据值，默认为1
        const value = Number(cfg.value) || 1;
        const maxValue = Number(cfg.maxValue) || 100;
        
        // 改进的高度计算逻辑
        let actualHeight;
        if (maxValue === 0) {
            actualHeight = height * 0.1; // 如果最大值为0，显示最小高度
        } else {
            // 使用对数比例或线性比例，避免极端值的影响
            const ratio = value / maxValue;
            
            // 对于小值，使用更敏感的比例计算
            if (ratio < 0.1) {
                actualHeight = height * (0.1 + ratio * 0.3); // 最小10%，最大40%
            } else {
                actualHeight = height * (0.4 + ratio * 0.6); // 最小40%，最大100%
            }
            
            // 确保最小高度
            actualHeight = Math.max(actualHeight, height * 0.05);
        }
        
        
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
            const fontSize = Math.min(style.fontSize || 12, width * 0.3); // 根据宽度调整字体大小
            
            group.addShape('text', {
                attrs: {
                    x: width / 2,
                    y: height - actualHeight / 2,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: cfg.label,
                    fill: style.fill || '#000',
                    fontSize: fontSize,
                    cursor: cfg.style?.cursor,
                    fontWeight: 'bold',
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