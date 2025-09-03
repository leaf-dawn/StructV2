import { Util } from "../Common/util";


export default Util.registerShape('array-node', {
    getAnchorPoints() {
        return [
            [0.5, 0],    // 顶部中点
            [1, 0.5],     // 右边中点
            [0.5, 1],     // 底部中点
            [0, 0.5],     // 左边中点
            [0, 0],        // 左下角
            [1, 0],
            [1, 1],
            [0, 1]
        ];
    }
}, 'rect');