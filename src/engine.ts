import { Sources } from "./sources";
import { ModelConstructor } from "./Model/modelConstructor";
import { AnimationOptions, EngineOptions, InteractionOptions, ViewOptions } from "./options";
import { SV } from "./StructV";
import { EventBus } from "./Common/eventBus";
import { ViewContainer } from "./View/viewContainer";
import { SVLink } from "./Model/SVLink";
import { SVNode } from "./Model/SVNode";
import { SVMarker } from "./Model/SVMarker";


export class Engine { 
    private modelConstructor: ModelConstructor;
    private viewContainer: ViewContainer;
    private prevSource: Sources;
    private prevStringSource: string;
    
    public engineOptions: EngineOptions;
    public viewOptions: ViewOptions;
    public animationOptions: AnimationOptions;
    public interactionOptions: InteractionOptions;

    constructor(DOMContainer: HTMLElement, engineOptions: EngineOptions) {
        this.engineOptions = Object.assign({}, engineOptions);

        this.viewOptions = Object.assign({
            fitCenter: true,
            fitView: false,
            groupPadding: 20,
            leakAreaHeight: 150,
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

        this.modelConstructor = new ModelConstructor(this);
        this.viewContainer = new ViewContainer(this, DOMContainer);
    }

    /**
     * 输入数据进行渲染
     * @param sources
     */
    public render(source: Sources) {
        if(source === undefined || source === null) {
            return;
        }
``
        let stringSource = JSON.stringify(source);
        if(this.prevStringSource === stringSource) {
            return;
        }

        this.prevSource = source;
        this.prevStringSource = stringSource;

        // 1 转换模型（data => model）
        const layoutGroupTable = this.modelConstructor.construct(source);
        
        // 2 渲染（使用g6进行渲染）
        this.viewContainer.render(layoutGroupTable);
    }

    /**
     * 切换指定数据结构的 mode 主题
     * @param mode 
     */
    public switchMode(layout: string, mode: string) {
        if(this.prevSource === undefined || this.prevSource === null) {
            return;
        }

        Object.keys(this.prevSource).map(group => {
            let sourceGroup = this.prevSource[group];
            
            if(sourceGroup.layouter === layout) {
                sourceGroup.mode = mode;
            }
        });

        this.render(this.prevSource);
    }


    /**
     * 重新布局
     */
    public reLayout() {
        this.viewContainer.reLayout();
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
    public findNode(id: string): SVNode {
        const nodes = this.getNodes();
        const stringId = id.toString();
        const targetNode = nodes.find(item => item.sourceId === stringId);

        return targetNode;
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