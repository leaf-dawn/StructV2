import { Graph, IGroup } from "@antv/g6-pc";
import { ext } from '@antv/matrix-util';

const transform = ext.transform;


/**
 * 初始化视图缩放功能
 * @param g6Instance 
 * @param generalModelsGroup 
 */
export function InitZoomCanvas(g6Instance: Graph, g6GeneralGroup: IGroup) {
    const minZoom = 0.2,
        maxZoom = 2,
        step = 0.15;

    g6Instance.on('wheel', event => {
        let delta = event.wheelDelta,
            matrix = g6GeneralGroup.getMatrix(),
            center = [event.x, event.y],
            targetScale = 1;

        if (delta > 0) {
            targetScale += step;
        }

        if (delta < 0) {
            targetScale -= step;
        }

        matrix = transform(matrix, [
            ['t', -center[0], -center[1]],
            ['s', targetScale, targetScale],
            ['t', center[0], center[1]],
        ]);

        if ((minZoom && matrix[0] < minZoom) || (maxZoom && matrix[0] > maxZoom)) {
            return false;
        }

        g6GeneralGroup.setMatrix(matrix);
        g6Instance.paint();
    });
}















