/*
 * @Author: your name
 * @Date: 2021-12-12 20:35:54
 * @LastEditTime: 2021-12-13 21:31:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \froend_studentc:\Users\13127\Desktop\最近的前端文件\可视化源码\StructV2\demoV2\Layouter\PTree.js
 */

// 解析数据：
// {
//     PTree:{
//         data:[
//             {
//                 id: '1001',
//                 data: 'A',
//                 parent: -1,
//                 index: 0
//             },
//             {
//                 id: '1002',
//                 data: 'B',
//                 parent: 0,
//                 index: 1
//             },
//         ],
//         layouter: 'PTree'

//     }
// }


SV.registerLayout('PTree', {
    
    sourcesPreprocess(sources) {
        let dataLength = sources.length;
        let parentNodes = [];
        let i;

        for (i = 0; i < dataLength; i++) {
            parentNodes.push({
                id: `parent-${i}`,
                data: sources[i].parent
            });
        }
        sources[0].indexLeft = 'data';
        parentNodes[0].indexLeft = 'parent';

        sources.push(...parentNodes);

        return sources;
    },
    defineOptions() {
        return {
            node: {
                default: {
                    type: 'indexed-node',
                    label: '[data]',
                    size: [40, 40],
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3',
                        offset: 25
                    },
                    indexOptions: {
                        index: { position: 'top' },
                        indexLeft: { position: 'left' }
                    }
                },  
            },
            behavior: {
                dragNode: false
            } 
        };
    },


    layout(elements) {
        let nodeLength = elements.length,
            halfLength = nodeLength / 2,
            size = elements[0].get('size')[0],
            i;
        
            
        for (i = 0; i < nodeLength; i++) {
            let x = (i % halfLength) * size;
                y = Math.floor(i / halfLength) * size;

            elements[i].set({ x, y });
        }
    }
});
