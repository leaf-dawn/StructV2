import { EventBus } from "../Common/eventBus";
import { Util } from "../Common/util";
import { Engine } from "../engine";
import { LayoutGroupTable } from "../Model/modelConstructor";
import { SVLink } from "../Model/SVLink";
import { SVModel } from "../Model/SVModel";
import { SVNode } from "../Model/SVNode";
import { SVAddressLabel, SVMarker, SVNodeAppendage } from "../Model/SVNodeAppendage";
import { Animations } from "./animation";
import { Renderer } from "./renderer";


export interface DiffResult {
    CONTINUOUS: SVModel[];
    APPEND: SVModel[];
    REMOVE: SVModel[];
    FREED: SVNode[];
    LEAKED: SVModel[];
    UPDATE: SVModel[];
    ACCUMULATE_LEAK: SVModel[];
}



export class Reconcile {

    private engine: Engine;
    private renderer: Renderer;
    private isFirstPatch: boolean;

    constructor(engine: Engine, renderer: Renderer) {
        this.engine = engine;
        this.renderer = renderer;
        this.isFirstPatch = true;
    }

    /**
     * 获取上一次渲染存在的，这一次渲染也存在的models
     * @param prevModelList 
     * @param modelList 
     */
    private getContinuousModels(prevModelList: SVModel[], modelList: SVModel[]): SVModel[] {
        const continuousModels = modelList.filter(item => prevModelList.find(prevModel => item.id === prevModel.id));
        return continuousModels;
    }

    /**
     * 获取新增的节点，这些节点有可能来自泄漏区（上一步的情况）
     * @param prevModelList 
     * @param modelList 
     * @param accumulateLeakModels 
     * @returns 
     */
    private getAppendModels(prevModelList: SVModel[], modelList: SVModel[], accumulateLeakModels: SVModel[]): SVModel[] {
        const appendModels = modelList.filter(item => !prevModelList.find(model => model.id === item.id));

        appendModels.forEach(item => {
            let removeIndex = accumulateLeakModels.findIndex(leakModel => item.id === leakModel.id);

            if (removeIndex > -1) {
                accumulateLeakModels.splice(removeIndex, 1);
            }
        });

        return appendModels;
    }

    /**
     * 获取被泄露的节点
     * @param layoutGroupTable 
     * @param prevModelList 
     * @param modelList 
     * @returns 
     */
    private getLeakModels(layoutGroupTable: LayoutGroupTable, prevModelList: SVModel[], modelList: SVModel[]): SVModel[] {
        let potentialLeakModels: SVModel[] = prevModelList.filter(item =>
            !modelList.find(model => model.id === item.id) && !item.freed
        );
        const leakModels: SVModel[] = [];

        // 先把节点拿出来
        const potentialLeakNodes = potentialLeakModels.filter(item => item.isNode()) as SVNode[],
              groups = Util.groupBy<SVNode>(potentialLeakNodes, 'group');

        // 再把非节点的model拿出来
        potentialLeakModels = potentialLeakModels.filter(item => item.isNode() === false);
        
        Object.keys(groups).forEach(key => {
            const leakRule = layoutGroupTable.get(key).layoutCreator.defineLeakRule;
            if(leakRule && typeof leakRule === 'function') {
                potentialLeakModels.push(...leakRule(groups[key]));
            }
        });

        potentialLeakModels.forEach(item => {
            if (item instanceof SVNode) {
                item.leaked = true;
                leakModels.push(item);

                item.appendages.forEach(appendage => {
                    appendage.leaked = true;
                    leakModels.push(appendage);
                });
            }
        });

        potentialLeakModels.forEach(item => {
            if (item instanceof SVLink && item.node.leaked !== false && item.target.leaked !== false) {
                item.leaked = true;
                leakModels.push(item);
            }
        });

        leakModels.forEach(item => {
            // 不能用上次的G6item了，不然布局的时候会没有动画
            item.G6Item = null;
        });

        return leakModels;
    }

    /**
     * 找出需要移除的节点
     * @param prevModelList 
     * @param modelList 
     */
    private getRemoveModels(prevModelList: SVModel[], modelList: SVModel[]): SVModel[] {
        let removedModels: SVModel[] = [];

        for (let i = 0; i < prevModelList.length; i++) {
            let prevModel = prevModelList[i],
                target = modelList.find(item => item.id === prevModel.id);

            if (target === undefined && !prevModel.leaked) {
                removedModels.push(prevModel);
            }
        }

        return removedModels;
    }


    /**
     * 找出重新指向的外部指针
     * @param prevModelList 
     * @param modelList 
     * @returns 
     */
    private getReTargetMarkers(prevModelList: SVModel[], modelList: SVModel[]): SVMarker[] {
        const prevMarkers: SVMarker[] = prevModelList.filter(item => item instanceof SVMarker) as SVMarker[],
            markers: SVMarker[] = modelList.filter(item => item instanceof SVMarker) as SVMarker[];

        return markers.filter(item => prevMarkers.find(prevItem => {
            return prevItem.id === item.id && prevItem.target.id !== item.target.id
        }));
    }

    /**
     * 找出前后 label 发生变化的 model
     * @param prevModelList 
     * @param modelList 
     * @returns 
     */
    private getLabelChangeModels(prevModelList: SVModel[], modelList: SVModel[]): SVModel[] {
        let labelChangeModels: SVModel[] = [];

        modelList.forEach(item => {
            const prevItem = prevModelList.find(prevItem => prevItem.id === item.id);

            if (prevItem === undefined) {
                return;
            }

            const prevLabel = prevItem.get('label'),
                label = item.get('label');

            if (String(prevLabel) !== String(label)) {
                labelChangeModels.push(item);
            }
        });

        return labelChangeModels;
    }

    /**
     * 获取被 free 的节点
     * @param prevModelList
     * @param modelList 
     * @returns 
     */
    private getFreedModels(prevModelList: SVModel[], modelList: SVModel[]): SVNode[] {
        const freedNodes = modelList.filter(item => item instanceof SVNode && item.freed) as SVNode[];

        freedNodes.forEach(item => {
            const prev = prevModelList.find(prevModel => item.id === prevModel.id);

            if (prev) {
                item.set('label', prev.get('label'));
            }
        });

        return freedNodes;
    }

    // ------------------------------------------------------------------------------------------------

    /**
     * 处理不变的models
     * @param continuousModels 
     */
    private handleContinuousModels(continuousModels: SVModel[]) {
        for (let i = 0; i < continuousModels.length; i++) {
            let model = continuousModels[i];

            if (model instanceof SVNode) {
                const group = model.G6Item.getContainer();
                group.attr({ opacity: 1 });
            }
        }
    }

    /**
     * 处理新增的 models
     * @param appendData 
     */
    private handleAppendModels(appendModels: SVModel[]) {
        let { duration, timingFunction } = this.engine.animationOptions;

        appendModels.forEach(item => {
            if (item instanceof SVNodeAppendage) {
                // 先不显示泄漏区节点上面的地址文本
                if (item instanceof SVAddressLabel) {
                    // 先将透明度改为0，隐藏掉
                    const AddressLabelG6Group = item.G6Item.getContainer();
                    AddressLabelG6Group.attr({ opacity: 0 });
                }
                else {
                    Animations.FADE_IN(item.G6Item, {
                        duration,
                        timingFunction
                    });
                }
            }
            else {
                Animations.APPEND(item.G6Item, {
                    duration,
                    timingFunction
                });
            }
        });
    }

    /**
     * 处理被移除 models
     * @param removeData 
     */
    private handleRemoveModels(removeModels: SVModel[]) {
        let { duration, timingFunction } = this.engine.animationOptions;

        removeModels.forEach(item => {
            Animations.REMOVE(item.G6Item, {
                duration,
                timingFunction,
                callback: () => {
                    this.renderer.removeModel(item);
                }
            });
        });
    }

    /**
     * 处理泄漏区 models
     * @param leakModels 
     */
    private handleLeakModels(leakModels: SVModel[]) {
        let { duration, timingFunction } = this.engine.animationOptions;

        leakModels.forEach(item => {
            if (item instanceof SVAddressLabel) {
                Animations.FADE_IN(item.G6Item, {
                    duration,
                    timingFunction
                });
            }

            item.G6Item.enableCapture(false);
        });

        EventBus.emit('onLeak', leakModels);
    }

    /**
     * 处理已经堆积的泄漏区 models
     * @param accumulateModels 
     */
    private handleAccumulateLeakModels(accumulateModels: SVModel[]) {
        accumulateModels.forEach(item => {
            if (item.generalStyle) {
                item.set('style', { ...item.generalStyle });
            }
        });
    }


    /**
     * 处理被释放的节点 models
     * @param freedModes 
     */
    private handleFreedModels(freedModes: SVNode[]) {
        const { duration, timingFunction } = this.engine.animationOptions,
            alpha = 0.4;

        freedModes.forEach(item => {
            const nodeGroup = item.G6Item.getContainer();

            item.set('style', { fill: '#ccc' });
            nodeGroup.attr({ opacity: alpha });

            if (item.marker) {
                const markerGroup = item.marker.G6Item.getContainer();
                item.marker.set('style', { fill: '#ccc' });
                markerGroup.attr({ opacity: alpha + 0.5 });
            }

            item.freedLabel.G6Item.toFront();
            Animations.FADE_IN(item.freedLabel.G6Item, { duration, timingFunction });
        });

        EventBus.emit('onFreed', freedModes);
    }

    /**
     * 处理发生变化的 models
     * @param models 
     */
    private handleChangeModels(models: SVModel[]) {
        const changeHighlightColor: string = this.engine.viewOptions.updateHighlight;

        if (!changeHighlightColor || typeof changeHighlightColor !== 'string') {
            return;
        }

        models.forEach(item => {
            if (item.generalStyle === undefined) {
                item.generalStyle = Util.objectClone(item.G6ModelProps.style);
            }

            if (item instanceof SVLink) {
                item.set('style', {
                    stroke: changeHighlightColor
                });
            }
            else {
                item.set('style', {
                    fill: changeHighlightColor
                });
            }
        });
    }


    /**
     * 进行diff
     * @param layoutGroupTable 
     * @param prevModelList 
     * @param modelList 
     * @param accumulateLeakModels 
     * @returns 
     */
    public diff(layoutGroupTable: LayoutGroupTable, prevModelList: SVModel[], modelList: SVModel[], accumulateLeakModels: SVModel[]): DiffResult {
        const continuousModels: SVModel[] = this.getContinuousModels(prevModelList, modelList);
        const leakModels: SVModel[] = this.getLeakModels(layoutGroupTable, prevModelList, modelList);
        const appendModels: SVModel[] = this.getAppendModels(prevModelList, modelList, accumulateLeakModels);
        const removeModels: SVModel[] = this.getRemoveModels(prevModelList, modelList);
        const updateModels: SVModel[] = [
            ...this.getReTargetMarkers(prevModelList, modelList),
            ...this.getLabelChangeModels(prevModelList, modelList),
            ...appendModels,
            ...leakModels
        ];
        const freedModels: SVNode[] = this.getFreedModels(prevModelList, modelList);

        return {
            CONTINUOUS: continuousModels,
            APPEND: appendModels,
            REMOVE: removeModels,
            FREED: freedModels,
            LEAKED: leakModels,
            UPDATE: updateModels,
            ACCUMULATE_LEAK: [...accumulateLeakModels]
        };
    }


    /**
     * 执行调和操作
     * @param diffResult 
     * @param isFirstRender
     */
    public patch(diffResult: DiffResult) {
        const {
            APPEND,
            REMOVE,
            FREED,
            LEAKED,
            UPDATE,
            CONTINUOUS,
            ACCUMULATE_LEAK
        } = diffResult;

        this.handleAccumulateLeakModels(ACCUMULATE_LEAK);

        // 第一次渲染的时候不高亮变化的元素
        if (this.isFirstPatch === false) {
            this.handleChangeModels(UPDATE);
        }

        this.handleContinuousModels(CONTINUOUS);
        this.handleFreedModels(FREED);
        this.handleAppendModels(APPEND);
        this.handleLeakModels(LEAKED);
        this.handleRemoveModels(REMOVE);

        if (this.isFirstPatch) {
            this.isFirstPatch = false;
        }
    }

    public destroy() { }
}