import { Engine } from "../engine";
import { LayoutProvider } from "./layoutProvider";
import { LayoutGroupTable } from "../Model/modelConstructor";
import { Util } from "../Common/util";
import { SVModel } from "../Model/SVModel";
import { Renderer } from "./renderer";
import { Reconcile } from "./reconcile";
import { FixNodeMarkerDrag } from "../BehaviorHelper/fixNodeMarkerDrag";
import { InitDragCanvasWithLeak } from "../BehaviorHelper/dragCanvasWithLeak";
import { EventBus } from "../Common/eventBus";
import { Group } from "../Common/group";



export class ViewContainer {
    private engine: Engine;
    private layoutProvider: LayoutProvider;
    private reconcile: Reconcile;
    public renderer: Renderer;

    private prevLayoutGroupTable: LayoutGroupTable;
    private prevModelList: SVModel[];
    private accumulateLeakModels: SVModel[];

    public hasLeak: boolean;
    public leakAreaY: number;

    constructor(engine: Engine, DOMContainer: HTMLElement) {
        this.engine = engine;
        this.layoutProvider = new LayoutProvider(engine, this);
        this.renderer = new Renderer(engine, DOMContainer);
        this.reconcile = new Reconcile(engine, this.renderer);
        this.prevLayoutGroupTable = new Map();
        this.prevModelList = [];
        this.accumulateLeakModels = [];
        this.hasLeak = false; // 判断是否已经发生过泄漏

        const g6Instance = this.renderer.getG6Instance(),
            leakAreaHeight = this.engine.viewOptions.leakAreaHeight,
            height = this.getG6Instance().getHeight(),
            { drag, zoom } = this.engine.interactionOptions;

        this.leakAreaY = height * (1 - leakAreaHeight);

        if (drag) {
            InitDragCanvasWithLeak(this);
        }

        if (zoom) {
            // InitZoomCanvas(g6Instance, g6GeneralGroup);
        }

        FixNodeMarkerDrag(g6Instance, this.engine.optionsTable);
    }


    // ----------------------------------------------------------------------------------------------

    /**
     * 对主视图进行重新布局
     */
    reLayout() {
        this.layoutProvider.layoutAll(this.prevLayoutGroupTable, [], this.accumulateLeakModels);
    }


    /**
     * 获取 g6 实例
     */
    getG6Instance() {
        return this.renderer.getG6Instance();
    }

    /**
     * 刷新视图
     */
    refresh() {
        this.renderer.getG6Instance().refresh();
    }

    /**
     * 重新调整容器尺寸
     * @param width 
     * @param height 
     */
    resize(width: number, height: number) {
        this.renderer.getG6Instance().changeSize(width, height);

        const containerHeight = this.getG6Instance().getHeight(),
            leakAreaHeight = this.engine.viewOptions.leakAreaHeight,
            targetY = containerHeight * (1 - leakAreaHeight);

        const accumulateLeakGroup = new Group();
        accumulateLeakGroup.add(...this.accumulateLeakModels);
        accumulateLeakGroup.translate(0, targetY - this.leakAreaY);
        this.leakAreaY = targetY;

        EventBus.emit('onLeakAreaUpdate', {
            leakAreaY: this.leakAreaY,
            hasLeak: this.hasLeak
        });
    }

    /**
     * 渲染所有视图
     * @param models 
     * @param layoutFn 
     */
    render(layoutGroupTable: LayoutGroupTable) {
        const modelList = Util.convertGroupTable2ModelList(layoutGroupTable),
            diffResult = this.reconcile.diff(this.prevModelList, modelList, this.accumulateLeakModels),
            renderModelList = [
                ...modelList,
                ...diffResult.REMOVE,
                ...diffResult.LEAKED,
                ...diffResult.ACCUMULATE_LEAK
            ];

        if (this.hasLeak === true && this.accumulateLeakModels.length === 0) {
            this.hasLeak = false;
            EventBus.emit('onLeakAreaUpdate', {
                leakAreaY: this.leakAreaY,
                hasLeak: this.hasLeak
            });
        }

        if (diffResult.LEAKED.length) {
            this.hasLeak = true;
            EventBus.emit('onLeakAreaUpdate', {
                leakAreaY: this.leakAreaY,
                hasLeak: this.hasLeak
            });
        }
        
        this.renderer.build(renderModelList); // 首先在离屏canvas渲染先
        this.layoutProvider.layoutAll(layoutGroupTable, this.accumulateLeakModels, diffResult.LEAKED); // 进行布局（设置model的x，y，样式等）

        this.beforeRender();
        this.renderer.render(renderModelList); // 渲染视图
        this.reconcile.patch(diffResult); // 对视图上的某些变化进行对应的动作，比如：节点创建动画，节点消失动画等
        this.afterRender();

        this.accumulateLeakModels.push(...diffResult.LEAKED);  // 对泄漏节点进行累积

        this.prevLayoutGroupTable = layoutGroupTable;
        this.prevModelList = modelList;

        // modelList.forEach(item => {
        //     console.log(item.getModelType(), item.getBound());
        // });
    }

    /**
     * 销毁
     */
    destroy() {
        this.renderer.destroy();
    }


    // ------------------------------------------------------------------------------


    /**
     * 把渲染前要触发的逻辑放在这里
     */
    private afterRender() {
        const g6Instance = this.renderer.getG6Instance();

        // 把所有连线置顶
        g6Instance.getEdges().forEach(item => item.toFront());
        g6Instance.paint();

        this.prevModelList.forEach(item => {
            if (item.leaked === false) {
                item.discarded = true;
            }
        });
    }

    /**
     * 把渲染后要触发的逻辑放在这里
     */
    private beforeRender() {

    }
}











