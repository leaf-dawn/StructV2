import { Engine } from '../engine';
import { SVModel } from '../Model/SVModel';
import { Util } from '../Common/util';
import G6 from '@antv/g6';
import { InitViewBehaviors } from '../BehaviorHelper/initViewBehaviors';
import { Graph, GraphData, IGroup } from '@antv/g6-pc';



export interface RenderModelPack {
    leaKModels: SVModel[];
    generalModel: SVModel[];
}


export type g6Behavior = string | { type: string; shouldBegin?: Function; shouldUpdate?: Function; shouldEnd?: Function; };


export class Renderer {
    private engine: Engine;
    private g6Instance: Graph; // g6 实例
    private shadowG6Instance: Graph;

    constructor(engine: Engine, DOMContainer: HTMLElement) {
        this.engine = engine;

        const enable: boolean = this.engine.animationOptions.enable,
            duration: number = this.engine.animationOptions.duration,
            timingFunction: string = this.engine.animationOptions.timingFunction;

        const tooltip = new G6.Tooltip({
            offsetX: 10,
            offsetY: 20,
            shouldBegin(event) {
                return event.item['SVModel'].isNode();
            },
            getContent: event => this.getTooltipContent(event.item['SVModel'], { address: 'sourceId', data: 'data' }),
            itemTypes: ['node']
        });

        this.shadowG6Instance = new G6.Graph({
            container: DOMContainer.cloneNode() as HTMLElement
        });

        // 初始化g6实例
        this.g6Instance = new G6.Graph({
            container: DOMContainer,
            width: DOMContainer.offsetWidth,
            height: DOMContainer.offsetHeight,
            groupByTypes: false,
            animate: enable,
            animateCfg: {
                duration: duration,
                easing: timingFunction
            },
            fitView: false,
            modes: {
                default: InitViewBehaviors(this.engine.optionsTable)
            },
            plugins: [tooltip]
        });
    }

    /**
     * 创造tooltip元素
     * @param model 
     * @param items 
     * @returns 
     */
    private getTooltipContent(model: SVModel, items: { [key: string]: string }): HTMLDivElement {
        const wrapper = document.createElement('div');

        if(model === null || model === undefined) {
            return wrapper;
        }

        Object.keys(items).map(key => {
            let value = model[items[key]];
            if (value !== undefined && value !== null) {
                let item = document.createElement('div');
                item.innerHTML = `${key}：${value}`;
                wrapper.appendChild(item);
            }
        });

        return wrapper;
    }

    /**
     * 对每一个 model 在离屏 Canvas 上构建 G6 item，用作布局
     * @param renderModelList
     */
    public build(renderModelList: SVModel[]) {
        const g6Data: GraphData = Util.convertModelList2G6Data(renderModelList);

        this.shadowG6Instance.clear();
        this.shadowG6Instance.read(g6Data);
        renderModelList.forEach(item => {
            item.shadowG6Item = this.shadowG6Instance.findById(item.id);
        });
    }

    /**
     * 渲染函数
     * @param renderModelList 
     * @param isFirstRender 
     */
    public render(renderModelList: SVModel[]) {
        const renderData: GraphData = Util.convertModelList2G6Data(renderModelList);

        this.g6Instance.changeData(renderData);

        renderModelList.forEach(item => {
            item.G6Item = this.g6Instance.findById(item.id);
            item.G6Item['SVModel'] = item;
        });
    }

    /**
     * 从视图中移除一个 Model
     * @param model 
     */
    public removeModel(model: SVModel) {
        this.g6Instance.removeItem(model.G6Item);
        this.shadowG6Instance.removeItem(model.shadowG6Item);
    }

    /**
     * 获取 G6 实例
     */
    public getG6Instance() {
        return this.g6Instance;
    }

    /**
     * 销毁
     */
    public destroy() {
        this.shadowG6Instance.destroy();
        this.g6Instance.destroy();
    }
}