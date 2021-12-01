import { INode, NodeConfig } from "@antv/g6-core";
import { Util } from "../Common/util";
import { MarkerOption, NodeLabelOption, Style } from "../options";
import { SVModel } from "./SVModel";
import { SVNode } from "./SVNode";



export class SVMarker extends SVModel {
    public target: SVNode;
    public label: string | string[];
    public anchor: number;

    public shadowG6Item: INode;
    public G6Item: INode;

    constructor(id: string, type: string, group: string, layout: string, label: string | string[], target: SVNode, options: MarkerOption) {
        super(id, type, group, layout);

        this.target = target;
        this.label = label;

        this.target.marker = this;
        this.G6ModelProps = this.generateG6ModelProps(options);
    }

    protected generateG6ModelProps(options: MarkerOption): NodeConfig {
        this.anchor = options.anchor;

        const type = options.type,
              defaultSize: [number, number] =  type === 'pointer'? [8, 30]: [12, 12];

        return {
            id: this.id,
            x: 0,
            y: 0,
            rotation: 0,
            type: options.type || 'marker',
            size: options.size || defaultSize,
            anchorPoints: null,
            label: typeof this.label === 'string'? this.label: this.label.join(', '),
            style: Util.objectClone<Style>(options.style),
            labelCfg: Util.objectClone<NodeLabelOption>(options.labelOptions)
        };
    }

    public getLabelSizeRadius(): number {
        const { width, height } = this.shadowG6Item.getContainer().getChildren()[2].getBBox();
        return width > height? width: height;
    }
};