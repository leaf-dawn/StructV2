import { Util } from '../Common/util';

export default Util.registerShape(
    'indented-tree-node', {
    getAnchorPoints() {
        return [
            [0.5, 1],
            [0, 0.5],
        ];
        },
   
},
'rect'

);