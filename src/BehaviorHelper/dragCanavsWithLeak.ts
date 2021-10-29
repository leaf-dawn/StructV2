import { EventBus } from "../Common/eventBus";
import { ViewContainer } from "../View/viewContainer";




/**
 * 初始化视图拖拽功能
 * @param g6Instance 
 * @param hasLeak 
 */
export function InitDragCanvasWithLeak(viewContainer: ViewContainer) {
    let g6Instance = viewContainer.getG6Instance(),
        startPositionY = 0,
        currentLeakAreaY = 0;

    g6Instance.on('canvas:dragstart', event => {
        startPositionY = event.canvasY;
        currentLeakAreaY = viewContainer.leakAreaY;
    });

    g6Instance.on('canvas:drag', event => {
        let zoom = g6Instance.getZoom(),
            dy = (event.canvasY - startPositionY) / zoom,
            leakAreaY = currentLeakAreaY + dy;

        viewContainer.leakAreaY = leakAreaY;
        if(viewContainer.hasLeak) {
            EventBus.emit('onLeakAreaUpdate', { 
                leakAreaY: viewContainer.leakAreaY, 
                hasLeak: viewContainer.hasLeak 
            });
        }
    });

    g6Instance.on('canvas:dragend', event => {
        startPositionY = 0;
    })
}















