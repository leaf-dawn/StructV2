import { SVModel } from "../Model/SVModel";



/**
 * 初始化g6 交互options
 * @param optionsTable 
 * @returns 
 */
export function InitViewBehaviors() {
    const defaultModes = [];

    const dragNodeFilter = event => {
        let g6Item = event.item,
            node: SVModel = g6Item.SVModel;

        if (g6Item === null || node.isNode() === false || node.leaked) {
            return false;
        }

        return true;
    }

    const selectNodeFilter = event => {
        let g6Item = event.item,
            node: SVModel = g6Item.SVModel;

        if (g6Item === null || node.isNode() === false || node.leaked) {
            return false;
        }

        return true;
    }

    defaultModes.push({
        type: 'drag-node',
        shouldBegin: dragNodeFilter
    });

    defaultModes.push({
        type: 'drag-canvas'
    });

    // defaultModes.push({
    //     type: 'zoom-canvas'
    // });

    defaultModes.push({
        type: 'click-select',
        shouldBegin: selectNodeFilter
    });

    return defaultModes;
}