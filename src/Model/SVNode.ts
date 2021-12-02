import { INode, NodeConfig } from "@antv/g6-core";
import { Util } from "../Common/util";
import { NodeIndexOption, NodeLabelOption, NodeOption, Style } from "../options";
import { SourceNode } from "../sources";
import { SVLink } from "./SVLink";
import { SVMarker } from "./SVMarker";
import { SVModel } from "./SVModel";


export class SVFreedLabel extends SVModel {
    public node: SVNode;

    constructor(id: string, type: string, group: string, layout: string, node: SVNode) {
        super(id, type, group, layout, 'freedLabel');

        this.node = node;
        this.node.freedLabel = this;
        this.G6ModelProps = this.generateG6ModelProps();
    }

    generateG6ModelProps() {
        return {
            id: this.id,
            x: 0,
            y: 0,
            type: 'rect',
            label: '已释放',
            labelCfg: {
                style: {
                    fill: '#b83b5e',
                    opacity: 0.6
                }
            },
            size: [0, 0],
            style: {
                stroke: null,
                fill: 'transparent'
            }
        };
    }
}


export class SVLeakAddress extends SVModel {
    public node: SVNode;
    private sourceId: string;

    constructor(id: string, type: string, group: string, layout: string, node: SVNode) {
        super(id, type, group, layout, 'leakAddress');

        this.node = node;
        this.sourceId = node.sourceId;
        this.node.leakAddress = this;
        this.G6ModelProps = this.generateG6ModelProps();
    }

    generateG6ModelProps() {
        return {
            id: this.id,
            x: 0,
            y: 0,
            type: 'rect',
            label: this.sourceId,
            labelCfg: {
                style: {
                    fill: '#666',
                    fontSize: 16
                }
            },
            size: [0, 0],
            style: {
                stroke: null,
                fill: 'transparent'
            }
        };
    }
}



export class SVNode extends SVModel {
    public sourceId: string;
    public sourceNode: SourceNode;
    public marker: SVMarker;
    public freedLabel: SVFreedLabel;
    public leakAddress: SVLeakAddress;
    public links: {
        inDegree: SVLink[];
        outDegree: SVLink[];
    };
    private label: string | string[];

    public shadowG6Item: INode;
    public G6Item: INode;

    constructor(id: string, type: string, group: string, layout: string, sourceNode: SourceNode, label: string | string[], options: NodeOption) {
        super(id, type, group, layout, 'node');

        this.group = group;
        this.layout = layout;

        Object.keys(sourceNode).map(prop => {
            if (prop !== 'id') {
                this[prop] = sourceNode[prop];
            }
        });

        this.sourceNode = sourceNode;
        this.sourceId = sourceNode.id.toString();

        this.marker = null;
        this.links = { inDegree: [], outDegree: [] };
        this.sourceNode = sourceNode;
        this.label = label;
        this.G6ModelProps = this.generateG6ModelProps(options);
    }

    protected generateG6ModelProps(options: NodeOption): NodeConfig {
        let indexOptions = Util.objectClone<NodeIndexOption>(options.indexOptions);

        if (indexOptions) {
            Object.keys(indexOptions).map(key => {
                let indexOptionItem = indexOptions[key];
                indexOptionItem.value = this.sourceNode[key] ?? '';
            });
        }

        return {
            ...this.sourceNode,
            id: this.id,
            x: 0,
            y: 0,
            rotation: options.rotation || 0,
            type: options.type,
            size: options.size || [60, 30],
            anchorPoints: options.anchorPoints,
            label: this.label as string,
            style: Util.objectClone<Style>(options.style),
            labelCfg: Util.objectClone<NodeLabelOption>(options.labelOptions),
            indexCfg: indexOptions
        };
    }

    isNode(): boolean {
        return true;
    }

    getSourceId(): string {
        return this.sourceId;
    }
};




