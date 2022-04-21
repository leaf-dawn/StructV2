
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
        let i;

        for (i = 0; i < dataLength; i++) {
            let parentNode = {
                id: `parent-${i}`,
                data: sources[i].parent
            };
                
            if(sources[i].index === 0){
                sources[i].indexLeft = 'data';
                parentNode.indexLeft = 'parent';

                sources.push({
                    type: 'nameNode',
                    id: sources[i].id + '_0',
                    data: sources[i].name
                });

            }
            sources.push(parentNode);
        }
        return sources;
    },


    defineOptions() {
        return {
            node: {
                nameNode: {
                    type: 'rect',
                    size: [0, 0],
                    label: '[data]',
                    labelOptions: {
                        style: { fontSize: 16 }
                    },
                },
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
            },
            layout: {
                xInterval: 20
            },
        };
    },


    layout(elements, layoutOptions) {
        let nodes = elements.filter(item => item.type === 'default'),
            nodeLength = nodes.length,
            nameNode = elements.filter(item => item.type === 'nameNode')[0];

        if(nodeLength == 0) return;
        
        let halfLength = nodeLength / 2,
            size = nodes[0].get('size')[0],
            i;
        
        for (i = 0; i < nodeLength; i++) {
            let x = (i % halfLength) * size,
                y = Math.floor(i / halfLength) * size;

            nodes[i].set({ x, y });
        }

        //数据结构名
        if(nameNode){
            let labelBound = nameNode.shadowG6Item.getContainer().getChildren()[1].getBBox();

            nameNode.set({
                x: -size / 2 - layoutOptions.xInterval  - labelBound.width / 2,
                y: -size / 2 - layoutOptions.xInterval
            })
        }
    }
});
