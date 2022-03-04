
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
                    type: 'rect',
                    label: '[data]',
                    size: [40, 40],
                    labelOptions: {
                        style: { fontSize: 16 }
                    },
                    style: {
                        stroke: '#333',
                        fill: '#95e1d3',
                        offset: 25
                    }
                },  
            },
            indexLabel: {
                index: { position: 'top' },
                indexLeft: { position: 'left' }
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
