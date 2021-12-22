import { INode, NodeConfig, EdgeConfig } from "@antv/g6-core";
import { Util } from "../Common/util";
import { AddressLabelOption, IndexLabelOption, MarkerOption, NodeLabelOption, Style } from "../options";
import { SVModel } from "./SVModel";
import { SVNode } from "./SVNode";




export class SVNodeAppendage extends SVModel {
    public target: SVNode;

    constructor(id: string, type: string, group: string, layout: string, modelType: string, target: SVNode) {
        super(id, type, group, layout, modelType);

        this.target = target;
        this.target.appendages.push(this);
    }
}




/**
 * 已释放节点下面的文字（“已释放‘）
 */
export class SVFreedLabel extends SVNodeAppendage {
    constructor(id: string, type: string, group: string, layout: string, target: SVNode) {
        super(id, type, group, layout, 'freedLabel', target);

        this.target.freedLabel = this;
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
                opacity: 0,
                stroke: null,
                fill: 'transparent'
            }
        };
    }
}


/**
 * 被移动到泄漏区的节点上面显示的地址
 */
export class SVAddressLabel extends SVNodeAppendage {
    private sourceId: string;

    constructor(id: string, type: string, group: string, layout: string, target: SVNode, options: AddressLabelOption) {
        super(id, type, group, layout, 'addressLabel', target);

        this.sourceId = target.sourceId;
        this.target.addressLabel = this;
        this.G6ModelProps = this.generateG6ModelProps(options);
    }

    generateG6ModelProps(options: AddressLabelOption) {
        return {
            id: this.id,
            x: 0,
            y: 0,
            type: 'rect',
            label: this.sourceId,
            labelCfg: {
                style: {
                    fill: '#666',
                    fontSize: 16,
                    ...options.style
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


/**
 * 节点的下标文字
 */
export class SVIndexLabel extends SVNodeAppendage {
    private value: string;

    constructor(id: string, indexName: string, group: string, layout: string, value: string, target: SVNode, options: IndexLabelOption) {
        super(id, indexName, group, layout, 'indexLabel', target);

        this.target.indexLabel = this;
        this.value = value;
        this.G6ModelProps = this.generateG6ModelProps(options) as NodeConfig;
    }

    generateG6ModelProps(options: IndexLabelOption): NodeConfig | EdgeConfig {
        return {
            id: this.id,
            x: 0,
            y: 0,
            type: 'rect',
            label: this.value,
            labelCfg: {
                style: {
                    fill: '#bbb',
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fontSize: 14,
                    fontStyle: 'italic',
                    ...options.style
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



/**
 * 外部指针
 */
export class SVMarker extends SVNodeAppendage {
    public label: string | string[];
    public anchor: number;

    public shadowG6Item: INode;
    public G6Item: INode;

    constructor(id: string, type: string, group: string, layout: string, label: string | string[], target: SVNode, options: MarkerOption) {
        super(id, type, group, layout, 'marker', target);

        this.label = label;

        this.target.marker = this;
        this.G6ModelProps = this.generateG6ModelProps(options);
    }

    generateG6ModelProps(options: MarkerOption): NodeConfig {
        this.anchor = options.anchor;

        const type = options.type,
            defaultSize: [number, number] = type === 'pointer' ? [8, 30] : [12, 12];

        return {
            id: this.id,
            x: 0,
            y: 0,
            rotation: 0,
            type: options.type || 'marker',
            size: options.size || defaultSize,
            anchorPoints: null,
            label: typeof this.label === 'string' ? this.label : this.label.join(', '),
            style: Util.objectClone<Style>(options.style),
            labelCfg: Util.objectClone<NodeLabelOption>(options.labelOptions)
        };
    }

    public getLabelSizeRadius(): number {
        const { width, height } = this.shadowG6Item.getContainer().getChildren()[2].getBBox();
        return Math.max(width, height);
    }
};