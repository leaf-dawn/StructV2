SV.registerLayout('BarChart', {

    sourcesPreprocess(sources) {
        const firstElement = sources[0];

        if (firstElement.external) {
            firstElement.headExternal = firstElement.external;
            delete firstElement.external;
        }

        return sources;
    },

    defineOptions() {
        return {
            node: {
                default: {
                    type: 'bar-chart-node',
                    label: '[data]',
                    size: [40, 80], // 柱状图默认尺寸，将在layout中动态调整
                    labelOptions: {
                        style: { fontSize: 12 }
                    },
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3'
                    }
                }
            },
            marker: {
                headExternal: {
                    type: 'pointer',
                    offset: 50,
                    anchor: 2,
                    style: {
                        fill: '#f08a5d'
                    }
                },
                external: {
                    type: 'pointer',
                    offset: 50,
                    anchor: 2,
                    style: {
                        fill: '#f08a5d'
                    }
                }
            },
            indexLabel: {
                index: { 
                    position: 'bottom',
                    style: { fontSize: 10, fill: '#666' }
                },
                indexRight: { position: 'right' }
            },
            behavior: {
                dragNode: false
            }
        };
    },

    layout(elements) {
        let arr = elements;
        const dataLength = arr.length;
        
        // 动态计算柱状图宽度和间距
        // 基础配置
        const minBarWidth = 30;  // 最小柱状图宽度
        const maxBarWidth = 80;  // 最大柱状图宽度
        const minSpacing = 8;    // 最小间距
        const maxSpacing = 20;   // 最大间距
        
        // 根据数据长度计算合适的宽度和间距
        let barWidth, spacing;
        
        if (dataLength <= 5) {
            // 数据量少时，使用较宽的柱状图和间距
            barWidth = Math.max(minBarWidth, Math.min(maxBarWidth, 120 - dataLength * 10));
            spacing = Math.max(minSpacing, Math.min(maxSpacing, 25 - dataLength * 2));
        } else if (dataLength <= 10) {
            // 中等数据量
            barWidth = Math.max(minBarWidth, Math.min(maxBarWidth, 80 - (dataLength - 5) * 5));
            spacing = Math.max(minSpacing, Math.min(maxSpacing, 15 - (dataLength - 5)));
        } else {
            // 大数据量时，使用最小宽度和间距
            barWidth = minBarWidth;
            spacing = minSpacing;
        }
        
        // 计算所有数据的最大值，用于高度计算
        let maxValue = 0;
        for (let i = 0; i < arr.length; i++) {
            const value = Number(arr[i].get('value')) || 0;
            maxValue = Math.max(maxValue, value);
        }
        
        // 动态计算合适的高度
        let chartHeight;
        if (maxValue <= 10) {
            chartHeight = 60;  // 小值时使用较小高度
        } else if (maxValue <= 50) {
            chartHeight = 80;  // 中等值时使用中等高度
        } else if (maxValue <= 100) {
            chartHeight = 100; // 大值时使用较大高度
        } else {
            chartHeight = 120; // 超大值时使用最大高度
        }
        
        // 更新每个元素的尺寸和位置
        for (let i = 0; i < arr.length; i++) {
            // 设置动态计算的尺寸
            arr[i].set('size', [barWidth, chartHeight]);
            
            // 设置最大值，用于节点内部的高度计算
            arr[i].set('maxValue', maxValue);
            
            // 计算x坐标
            if (i > 0) {
                arr[i].set('x', arr[i - 1].get('x') + arr[i - 1].get('size')[0] + spacing);
            } else {
                arr[i].set('x', 0);
            }
        }
    }
});