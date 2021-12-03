import { EventBus } from "../Common/eventBus";
import { ViewContainer } from "../View/viewContainer";




/**
 * 
 * @param g6Instance 
 * @param hasLeak 
 */
export function InitDragCanvasWithLeak(viewContainer: ViewContainer) {
    let g6Instance = viewContainer.getG6Instance(),
        isDragStart = false,
        startPositionY = 0,
        currentLeakAreaY = 0;

    g6Instance.on('canvas:dragstart', event => {
        isDragStart = true;
        startPositionY = event.canvasY;
        currentLeakAreaY = viewContainer.leakAreaY;
    });

    g6Instance.on('canvas:drag', event => {
        if(!isDragStart) {
            return false;
        }

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
        isDragStart = false;
        startPositionY = 0;
    })
}















