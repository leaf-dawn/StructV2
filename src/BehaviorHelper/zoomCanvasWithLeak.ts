import { EventBus } from "../Common/eventBus";
import { ViewContainer } from "../View/viewContainer";


/**
 * 缩放这里搞不出来，尽力了
 */



/**
 * 
 * @param g6Instance 
 * @param generalModelsGroup 
 */
export function InitZoomCanvasWithLeak(viewContainer: ViewContainer) {
    let g6Instance = viewContainer.getG6Instance(),
        prevDy = 0;

    let prevZoom = 1;

    // g6Instance.on('viewportchange', event => {
    //     if(event.action !== 'zoom') {
    //         return false;
    //     }

    //     console.log(event.matrix);

    //     viewContainer.leakAreaY = event.matrix[4] * viewContainer.leakAreaY + event.matrix[7];
    //     if (viewContainer.hasLeak) {
    //         EventBus.emit('onLeakAreaUpdate', {
    //             leakAreaY: viewContainer.leakAreaY,
    //             hasLeak: viewContainer.hasLeak
    //         });
    //     }
    // });

    g6Instance.on('wheelzoom', event => {
        let dy = event.y - viewContainer.leakAreaY,
            dZoom = prevZoom - g6Instance.getZoom();

        prevZoom = g6Instance.getZoom();

        viewContainer.leakAreaY = viewContainer.leakAreaY + dy * dZoom;
        if (viewContainer.hasLeak) {
            EventBus.emit('onLeakAreaUpdate', {
                leakAreaY: viewContainer.leakAreaY,
                hasLeak: viewContainer.hasLeak
            });
        }
    });
}















