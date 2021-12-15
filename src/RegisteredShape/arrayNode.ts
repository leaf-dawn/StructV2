import G6 from '@antv/g6';


export default G6.registerNode('array-node', {
    getAnchorPoints() {
        return [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5]
        ];
    }
}, 'rect');