import { Util } from "../Common/util";
import { Engine } from "../engine";
import { AddressLabelOption, IndexLabelOption, LayoutCreator, LayoutGroupOptions, LinkOption, MarkerOption, NodeOption } from "../options";
import { sourceLinkData, LinkTarget, Sources, SourceNode } from "../sources";
import { SV } from "../StructV";
import { SVLink } from "./SVLink";
import { SVModel } from "./SVModel";
import { SVNode } from "./SVNode";
import { SVAddressLabel, SVFreedLabel, SVIndexLabel, SVMarker } from "./SVNodeAppendage";


export type LayoutGroup = {
    name: string;
    node: SVNode[];
    indexLabel: SVIndexLabel[];
    freedLabel: SVFreedLabel[];
    addressLabel: SVAddressLabel[];
    link: SVLink[];
    marker: SVMarker[];
    layoutCreator: LayoutCreator;
    layout: string;
    options: LayoutGroupOptions;
    modelList: SVModel[];
    isHide: boolean;
};


export type LayoutGroupTable = Map<string, LayoutGroup>;


export class ModelConstructor {
    private engine: Engine;
    private layoutGroupTable: LayoutGroupTable;
    private prevSourcesStringMap: { [key: string]: string };   // 保存上一次源数据转换为字符串之后的值，用作比较该次源数据和上一次源数据是否有差异，若相同，则可跳过重复构建过程

    constructor(engine: Engine) {
        this.engine = engine;
        this.prevSourcesStringMap = {};
    }

    /**
     * 构建SVNode，SVLink, SVMarker, SVAddressLabel, SVIndexLabel等
     * @param sourceList 
     */
    public construct(sources: Sources): LayoutGroupTable {
        const layoutGroupTable = new Map<string, LayoutGroup>(),
            layoutMap: { [key: string]: LayoutCreator } = SV.registeredLayout;

        Object.keys(sources).forEach(group => {
            let sourceGroup = sources[group],
                layout = sourceGroup.layouter,
                layoutCreator: LayoutCreator = layoutMap[layout];

            if (!layout || !layoutCreator) {
                return;
            }

            let sourceDataString: string = JSON.stringify(sourceGroup.data),
                prevString: string = this.prevSourcesStringMap[group],
                nodeList: SVNode[] = [],
                freedLabelList: SVFreedLabel[] = [],
                addressLabelList: SVAddressLabel[] = [],
                indexLabelList: SVIndexLabel[] = [],
                markerList: SVMarker[] = [];

            if (prevString === sourceDataString) {
                return;
            }

            const options: LayoutGroupOptions = layoutCreator.defineOptions(sourceGroup.data),
                sourceData = layoutCreator.sourcesPreprocess(sourceGroup.data, options),
                nodeOptions = options.node || options['element'] || {},
                markerOptions = options.marker || {},
                indexLabelOptions = options.indexLabel || {},
                addressLabelOption = options.addressLabel || {};

            nodeList = this.constructNodes(group, layout, nodeOptions, sourceData);
            markerList = this.constructMarkers(group, layout, markerOptions, nodeList);
            indexLabelList = this.constructIndexLabel(group, layout, indexLabelOptions, nodeList);
            addressLabelList = this.constructAddressLabel(group, layout, addressLabelOption, nodeList);
            nodeList.forEach(item => {
                if(item.freedLabel) {
                    freedLabelList.push(item.freedLabel);
                }
            });

            layoutGroupTable.set(group, {
                name: group,
                node: nodeList,
                freedLabel: freedLabelList, 
                addressLabel: addressLabelList,
                indexLabel: indexLabelList,
                link: [],
                marker: markerList,
                options,
                layoutCreator,
                modelList: [
                    ...nodeList, 
                    ...markerList, 
                    ...freedLabelList, 
                    ...addressLabelList,
                    ...indexLabelList
                ],
                layout,
                isHide: false
            });
        });

        layoutGroupTable.forEach((layoutGroup: LayoutGroup, group: string) => {
            const linkOptions = layoutGroup.options.link || {},
                linkList: SVLink[] = this.constructLinks(group, layoutGroup.layout, linkOptions, layoutGroup.node, layoutGroupTable);

            layoutGroup.link = linkList;
            layoutGroup.modelList.push(...linkList);
        });

        this.layoutGroupTable = layoutGroupTable;

        return this.layoutGroupTable;
    }


    /**
     * 从源数据构建 node 集
     * @param nodeOptions 
     * @param group
     * @param sourceList 
     * @param layout
     * @returns 
     */
    private constructNodes(group: string, layout: string, nodeOptions: { [key: string]: NodeOption }, sourceList: SourceNode[]): SVNode[] {
        let defaultSourceNodeType: string = 'default',
            nodeList: SVNode[] = [];

        sourceList.forEach(item => {
            if (item === null) {
                return;
            }

            if (item.type === undefined || item.type === null) {
                item.type = defaultSourceNodeType;
            }

            nodeList.push(this.createNode(item, item.type, group, layout, nodeOptions[item.type]));
        });

        return nodeList;
    }

    /**
     * 从配置和 node 集构建 link 集
     * @param linkOptions 
     * @param nodes 
     * @param layoutGroupTable
     * @returns 
     */
    private constructLinks(group: string, layout: string, linkOptions: { [key: string]: LinkOption }, nodes: SVNode[], layoutGroupTable: LayoutGroupTable): SVLink[] {
        let linkList: SVLink[] = [],
            linkNames = Object.keys(linkOptions);

        linkNames.forEach(name => {
            for (let i = 0; i < nodes.length; i++) {
                let node: SVNode = nodes[i],
                    sourceLinkData: sourceLinkData = node.sourceNode[name],
                    targetNode: SVNode | SVNode[] = null,
                    link: SVLink = null;

                if (sourceLinkData === undefined || sourceLinkData === null) {
                    node[name] = null;
                    continue;
                }

                //  ------------------- 将连接声明字段 sourceLinkData 从 id 变为 SVNode -------------------
                if (Array.isArray(sourceLinkData)) {
                    node[name] = sourceLinkData.map((item, index) => {
                        targetNode = this.fetchTargetNodes(layoutGroupTable, node, item);
                        let isGeneralLink = this.isGeneralLink(sourceLinkData.toString());

                        if (targetNode) {
                            link = this.createLink(name, group, layout, node, targetNode, index, linkOptions[name]);
                            linkList.push(link);
                        }

                        return isGeneralLink ? targetNode : null;
                    });
                }
                else {
                    targetNode = this.fetchTargetNodes(layoutGroupTable, node, sourceLinkData);
                    let isGeneralLink = this.isGeneralLink(sourceLinkData.toString());

                    if (targetNode) {
                        link = this.createLink(name, group, layout, node, targetNode, null, linkOptions[name]);
                        linkList.push(link);
                    }

                    node[name] = isGeneralLink ? targetNode : null;
                }
            }
        });

        return linkList;
    }

    /**
     * 从配置项构建 indexLabel 集
     * @param group 
     * @param layout 
     * @param indexLabelOptions 
     */
    private constructIndexLabel(group: string, layout: string, indexLabelOptions: { [key: string]: IndexLabelOption }, nodes: SVNode[]): SVIndexLabel[] {
        let indexLabelList: SVIndexLabel[] = [],
            indexNames = Object.keys(indexLabelOptions);

        indexNames.forEach(name => {
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i],
                    value = node[name];

                // 若没有指针字段的结点则跳过
                if (value === undefined || value === null) continue;

                let id = `${group}.${name}#${value}`,
                    indexLabel = new SVIndexLabel(id, name, group, layout, value.toString(), node, indexLabelOptions[name]);

                indexLabelList.push(indexLabel);
            }
        });

        return indexLabelList;
    }

    /**
     * 
     * @param group 
     * @param layout 
     * @param addressLabelOption 
     * @param nodes 
     */
    private constructAddressLabel(group: string, layout: string, addressLabelOption: AddressLabelOption, nodes: SVNode[]): SVAddressLabel[] {
        let addressLabelList: SVAddressLabel[] = [];

        nodes.forEach(item => {
            const addressLabel = new SVAddressLabel(`${item.id}-address-label`, item.sourceType, group, layout, item, addressLabelOption);
            addressLabelList.push(addressLabel);
        });
        
        return addressLabelList;
    }

    /**
     * 从配置和 node 集构建 marker 集
     * @param markerOptions 
     * @param nodes
     * @returns 
     */
    private constructMarkers(group: string, layout: string, markerOptions: { [key: string]: MarkerOption }, nodes: SVNode[]): SVMarker[] {
        let markerList: SVMarker[] = [],
            markerNames = Object.keys(markerOptions);

        markerNames.forEach(name => {
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i],
                    markerData = node[name];

                // 若没有指针字段的结点则跳过
                if (!markerData) continue;

                let id = `${group}.${name}.${Array.isArray(markerData) ? markerData.join('-') : markerData}`,
                    marker = new SVMarker(id, name, group, layout, markerData, node, markerOptions[name]);
    
                markerList.push(marker);
            }
        });

        return markerList;
    }

    /**
     * 求解label文本
     * @param label 
     * @param sourceNode 
     */
    private resolveNodeLabel(label: string | string[], sourceNode: SourceNode): string {
        let targetLabel: any = '';

        if (Array.isArray(label)) {
            targetLabel = label.map(item => this.parserNodeContent(sourceNode, item) ?? '');
        }
        else {
            targetLabel = this.parserNodeContent(sourceNode, label);
        }

        if (targetLabel === 'undefined') {
            targetLabel = '';
        }

        return targetLabel ?? '';
    }

    /**
     * 元素工厂，创建 Node
     * @param sourceNode
     * @param sourceNodeType
     * @param group
     * @param layout
     * @param options
     */
    private createNode(sourceNode: SourceNode, sourceNodeType: string, group: string, layout: string, options: NodeOption): SVNode {
        let label: string | string[] = this.resolveNodeLabel(options.label, sourceNode),
            id = sourceNodeType + '.' + sourceNode.id.toString(),
            node = new SVNode(id, sourceNodeType, group, layout, sourceNode, label, options);

        if(node.freed) {
            node.freedLabel = new SVFreedLabel(`${id}-freed-label`, sourceNodeType, group, layout, node);
        }

        return node;
    }

    /**
     * 连线工厂，创建Link
     * @param linkName 
     * @param group 
     * @param layout 
     * @param node 
     * @param target 
     * @param index 
     * @param options 
     * @returns 
     */
    private createLink(linkName: string, group: string, layout: string, node: SVNode, target: SVNode, index: number, options: LinkOption): SVLink {
        let id = `${linkName}(${node.id}-${target.id})`;
        return new SVLink(id, linkName, group, layout, node, target, index, options);
    }

    /**
     * 解析元素文本内容
     * @param sourceNode
     * @param formatLabel
     */
    private parserNodeContent(sourceNode: SourceNode, formatLabel: string): string {
        let fields = Util.textParser(formatLabel);

        if (Array.isArray(fields)) {
            let values = fields.map(item => sourceNode[item]);

            values.map((item, index) => {
                formatLabel = formatLabel.replace('[' + fields[index] + ']', item);
            });
        }

        return formatLabel;
    }

    /**
     * 由source中的连接字段获取真实的连接目标元素
     * @param nodeContainer
     * @param node
     * @param linkTarget 
     */
    private fetchTargetNodes(layoutGroupTable: LayoutGroupTable, node: SVNode, linkTarget: LinkTarget): SVNode {
        let group: string = node.group,
            sourceNodeType = node.sourceType,
            nodeList: SVNode[],
            targetId = linkTarget,
            targetGroupName = group,
            targetNode = null;

        if (linkTarget === null || linkTarget === undefined) {
            return null;
        }

        if (typeof linkTarget === 'number' || (typeof linkTarget === 'string' && !linkTarget.includes('#'))) {
            linkTarget = 'default#' + linkTarget;
        }

        let info = linkTarget.split('#');

        targetId = info.pop();

        if (info.length > 1) {
            sourceNodeType = info.pop();
            targetGroupName = info.pop();
        }
        else {
            let field = info.pop();
            if (layoutGroupTable.get(targetGroupName).node.find(item => item.sourceType === field)) {
                sourceNodeType = field;
            }
            else if (layoutGroupTable.has(field)) {
                targetGroupName = field;
            }
            else {
                return null;
            }
        }

        nodeList = layoutGroupTable.get(targetGroupName).node.filter(item => item.sourceType === sourceNodeType);

        // 若目标node不存在，返回null
        if (nodeList === undefined) {
            return null;
        }

        targetNode = nodeList.find(item => item.sourceId === targetId);
        return targetNode || null;
    }

    /**
     * 检测改指针是否为常规指针（指向另一个group）
     * @param linkId 
     */
    private isGeneralLink(linkId: string): boolean {
        let counter = 0;

        for (let i = 0; i < linkId.length; i++) {
            if (linkId[i] === '#') {
                counter++;
            }
        }

        return counter <= 2;
    }

    /**
     * 
     * @returns 
     */
    public getLayoutGroupTable(): LayoutGroupTable {
        return this.layoutGroupTable;
    }

    /**
     * 销毁
     */
    destroy() {
        this.layoutGroupTable = null;
        this.prevSourcesStringMap = null;
    }
};