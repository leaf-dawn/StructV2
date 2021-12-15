import { INode, NodeConfig } from "@antv/g6-core";
import { Util } from "../Common/util";
import { NodeLabelOption, NodeOption, Style } from "../options";
import { SourceNode } from "../sources";
import { SVLink } from "./SVLink";
import { SVModel } from "./SVModel";
import { SVAddressLabel, SVFreedLabel, SVIndexLabel, SVMarker, SVNodeAppendage } from "./SVNodeAppendage";




export class SVNode extends SVModel {
    public sourceId: string;
    public sourceNode: SourceNode;
    public links: {
        inDegree: SVLink[];
        outDegree: SVLink[];
    };

    private label: string | string[];
    private disable: boolean;

    public shadowG6Item: INode;
    public G6Item: INode;

    public marker: SVMarker;
    public freedLabel: SVFreedLabel;
    public indexLabel: SVIndexLabel;
    public addressLabel: SVAddressLabel;
    public appendages: SVNodeAppendage[];

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

        this.links = { inDegree: [], outDegree: [] };
        this.appendages = [];
        this.sourceNode = sourceNode;
        this.label = label;
        this.G6ModelProps = this.generateG6ModelProps(options);
    }

    generateG6ModelProps(options: NodeOption): NodeConfig {
        const style = Util.objectClone<Style>(options.style);

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
            style: {
                ...style,
                fill: this.disable ? '#ccc' : style.fill
            },
            labelCfg: Util.objectClone<NodeLabelOption>(options.labelOptions)
        };
    }

    isNode(): boolean {
        return true;
    }

    getSourceId(): string {
        return this.sourceId;
    }
};




