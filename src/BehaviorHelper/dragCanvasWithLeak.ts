import { EventBus } from "../Common/eventBus";
import { ViewContainer } from "../View/viewContainer";




/**
 * 
 * @param g6Instance 
 * @param hasLeak 
 */
export function InitDragCanvasWithLeak(viewContainer: ViewContainer) {
    let g6Instance = viewContainer.getG6Instance(),
        prevDy = 0;

    g6Instance.on('viewportchange', event => {
        if(event.action !== 'translate') {
            return false;
        }

        let translateX = event.matrix[7],
            dy = translateX- prevDy;
            
        prevDy = translateX;

        viewContainer.leakAreaY = viewContainer.leakAreaY + dy;
        if (viewContainer.hasLeak) {
            EventBus.emit('onLeakAreaUpdate', {
                leakAreaY: viewContainer.leakAreaY,
                hasLeak: viewContainer.hasLeak
            });
        }
    });
}















