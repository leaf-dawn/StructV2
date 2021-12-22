import { Util } from "../Common/util";


export default Util.registerShape('array-node', {
    getAnchorPoints() {
        return [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5]
        ];
    }
}, 'rect');