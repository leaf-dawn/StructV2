import { Sources } from "./sources";
import { ModelConstructor } from "./Model/modelConstructor";
import { AnimationOptions, EngineOptions, InteractionOptions, LayoutGroupOptions, ViewOptions } from "./options";
import { SV } from "./StructV";
import { EventBus } from "./Common/eventBus";
import { ViewContainer } from "./View/viewContainer";
import { SVLink } from "./Model/SVLink";
import { SVNode } from "./Model/SVNode";
import { SVMarker } from "./Model/SVMarker";


export class Engine { 
    private modelConstructor: ModelConstructor = null;
    private viewContainer: ViewContainer
    private prevStringSourceData: string;
    
    public engineOptions: EngineOptions;
    public viewOptions: ViewOptions;
    public animationOptions: AnimationOptions;
    public interactionOptions: InteractionOptions;

    public optionsTable: { [key: string]: LayoutGroupOptions };

    constructor(DOMContainer: HTMLElement, engineOptions: EngineOptions) {
        this.optionsTable = {};
        this.engineOptions = Object.assign({}, engineOptions);

        this.viewOptions = Object.assign({
            fitCenter: true,
            fitView: false,
            groupPadding: 20,
            leakAreaHeight: 0.3,
            updateHighlight: '#fc5185'
        }, engineOptions.view);

        this.animationOptions = Object.assign({
            enable: true,
            duration: 750,
            timingFunction: 'easePolyOut'
        }, engineOptions.animation);

        this.interactionOptions = Object.assign({
            drag: true,
            zoom: true,
            dragNode: true,
            selectNode: true
        }, engineOptions.interaction);

        // 初始化布局器配置项
        Object.keys(SV.registeredLayout).forEach(layout => {
            if(this.optionsTable[layout] === undefined) {
                 const options: LayoutGroupOptions = SV.registeredLayout[layout].defineOptions();

                 options.behavior = Object.assign({
                     dragNode: true,
                     selectNode: true
                 }, options.behavior);

                 this.optionsTable[layout] = options;
            }
        });

        this.modelConstructor = new ModelConstructor(this);
        this.viewContainer = new ViewContainer(this, DOMContainer);
    }

    /**
     * 输入数据进行渲染
     * @param sourcesData 
     */
    public render(sourceData: Sources) {
        if(sourceData === undefined || sourceData === null) {
            return;
        }

        if(this.viewContainer.getG6Instance().isAnimating()) {
            return;
        }

        let stringSourceData = JSON.stringify(sourceData);
        if(this.prevStringSourceData === stringSourceData) {
            return;
        }
        this.prevStringSourceData = stringSourceData;

        // 1 转换模型（data => model）
        const layoutGroupTable = this.modelConstructor.construct(sourceData);
        
        // 2 渲染（使用g6进行渲染）
        this.viewContainer.render(layoutGroupTable);
    }

    /**
     * 重新布局
     */
    public reLayout() {
        this.viewContainer.reLayout();

        // layoutGroupTable.forEach(group => {
        //     group.modelList.forEach(item => {
        //         if(item instanceof SVLink) return;

        //         let model = item.G6Item.getModel(),
        //             x = item.get('x'),
        //             y = item.get('y');

        //         model.x = x;
        //         model.y = y;
        //     });
        // });
    }

    /**
     * 获取 G6 实例
     */
    public getGraphInstance() {
        return this.viewContainer.getG6Instance();
    }

    /**
     * 获取所有 element
     * @param  group
     */
    public getNodes(group?: string): SVNode[] {
        const layoutGroupTable = this.modelConstructor.getLayoutGroupTable();

        if(group && layoutGroupTable.has('group')) {
            return layoutGroupTable.get('group').node;
        }

        const nodes: SVNode[] = [];
        layoutGroupTable.forEach(item => {
            nodes.push(...item.node);
        })

        return nodes;
    }

    /**
     * 获取所有 marker
     * @param  group
     */
    public getMarkers(group?: string): SVMarker[] {
        const layoutGroupTable = this.modelConstructor.getLayoutGroupTable();

        if(group && layoutGroupTable.has('group')) {
            return layoutGroupTable.get('group').marker;
        }

        const markers: SVMarker[] = [];
        layoutGroupTable.forEach(item => {
            markers.push(...item.marker);
        })

        return markers;
    }

    /**
     * 获取所有 link
     * @param  group
     */
    public getLinks(group?: string): SVLink[] {
        const layoutGroupTable = this.modelConstructor.getLayoutGroupTable();

        if(group && layoutGroupTable.has('group')) {
            return layoutGroupTable.get('group').link;
        }

        const links: SVLink[] = [];
        layoutGroupTable.forEach(item => {
            links.push(...item.link);
        })

        return links;
    }

    /**
     * 隐藏某些组
     * @param groupNames 
     */
    public hideGroups(groupNames: string | string[]) {
        const names = Array.isArray(groupNames)? groupNames: [groupNames],
              instance = this.viewContainer.getG6Instance(),
              layoutGroupTable = this.modelConstructor.getLayoutGroupTable();

        layoutGroupTable.forEach(item => {
            const hasName = names.find(name => name === item.layout);

            if(hasName && !item.isHide) {
                item.modelList.forEach(model => instance.hideItem(model.G6Item));
                item.isHide = true;
            }

            if(!hasName && item.isHide) {
                item.modelList.forEach(model => instance.showItem(model.G6Item));
                item.isHide = false;
            }
        });
    }

    /**
     * 使用id查找某个节点
     * @param id 
     */
    public findElement(id: string) {
        const elements = this.getNodes();
        const stringId = id.toString();
        const targetElement = elements.find(item => item.sourceId === stringId);

        return targetElement;
    }

    /**
     * 调整容器尺寸
     * @param width 
     * @param height 
     */
    public resize(width: number, height: number) {
        this.viewContainer.resize(width, height);
    }

    /**
     * 绑定 G6 事件
     * @param eventName 
     * @param callback 
     */
    public on(eventName: string, callback: Function) {
        if(typeof callback !== 'function') {
            return;
        }

        if(eventName === 'onFreed' || eventName === 'onLeak') {
            EventBus.on(eventName, callback);
            return;
        }

        if(eventName === 'onLeakAreaUpdate') {
            EventBus.on(eventName, callback);
            return;
        }

        this.viewContainer.getG6Instance().on(eventName, event => {
            callback(event.item['SVModel']);
        });
    }

    /**
     * 销毁引擎
     */
    public destroy() {
        this.modelConstructor.destroy();
        this.viewContainer.destroy();
    }
};