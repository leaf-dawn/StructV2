import { BoundingRect } from "../../Common/boundingRect";
import { Group } from "../../Common/group";
import { Model } from "../../Model/modelData";
import { Container } from "./container";

/**
 * 释放区可视化视图
 */
export class FreedContainer extends Container {

    /**
     * 将释放区的节点位置移到容器中央
     * @param freedModels 
     */
    fitCenter(freedModels: Model[]) {
        freedModels.forEach(item => {
            item.G6Item = item.shadowG6Item;
        });

        let width = this.getG6Instance().getWidth(),
            height = this.getG6Instance().getHeight(),
            group = new Group();

        group.add(...freedModels);
        
        let viewBound: BoundingRect = group.getBound(),
            centerX = width / 2, centerY = height / 2,
            boundCenterX = viewBound.x + viewBound.width / 2,
            boundCenterY = viewBound.y + viewBound.height / 2,
            dx = centerX - boundCenterX,
            dy = centerY - boundCenterY;

        group.translate(dx, dy);

        freedModels.forEach(item => {
            item.G6Item = item.renderG6Item;
        });
    }

    protected initBehaviors(): string[] {
        return [];
    }
};