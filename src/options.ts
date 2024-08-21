import { SVModel } from "./Model/SVModel";
import { SVNode } from "./Model/SVNode";
import { SourceNode } from "./sources";
import { ELayoutMode } from "./View/layoutProvider";


export interface Style {
    fill?: string; // 填充颜色
    text?: string; // 图形文本
    textFill?: string; // 文本颜色
    fontSize?: number; // 字体大小
    fontWeight?: number; // 字重
    stroke?: string; // 描边样式
    opacity?: number; // 透明度
    lineWidth?: number; // 线宽
    matrix?: number[]; // 变换矩阵
    // 传递给G6的其他属性
    [key: string]: any;
};


export interface NodeLabelOption {
    position?: string;
    offset?: number;
    style?: Style;
};


export interface AddressLabelOption {
    offset?: number;
    style?: Style;
}


export interface IndexLabelOption extends NodeLabelOption {
    position: 'top' | 'right' | 'bottom' | 'left';
}

// 链接线的标题的样式
export interface LinkLabelOption {
    refX?: number; // 参考点的 X 和 Y 坐标偏移量
    refY?: number; 
    position?: string; //标签的位置，left, right, center等
    autoRotate?: boolean; // 是否自动旋转标签。如果设置为 true，当节点或边旋转时，标签也会自动调整角度
    style?: Style;
};


export interface ModelOption {
    type?: string;
    style?: Style;
}

// 节点样式
export interface NodeOption extends ModelOption {
    size?: number | [number, number]; // 节点大小
    rotation?: number;  // 旋转角度
    label?: string | string[]; // 标签格式
    anchorPoints?: number[][]; // 锚点位置
    labelOptions?: NodeLabelOption; // 标签样式
}

// 链接线样式
export interface LinkOption extends ModelOption {
    sourceAnchor?: number | ((index: number) => number); // 源锚点
    targetAnchor?: number | ((index: number) => number);  // 目标锚点
    label?: string; // 链接线标签，暂时没有作用
    curveOffset?: number; // 设置曲线偏移量
    labelOptions?: LinkLabelOption; // 链接线标题样式
    loopCfg: Object;
}

export interface MarkerOption extends NodeOption {
    type: 'pointer' | 'cursor' | 'clen-queue-pointer';
    anchor: number;
    offset: number;
    labelOffset: number;
};


export interface LayoutOptions {
    [key: string]: any;
};


export interface LayoutGroupOptions {
    node: { [key: string]: NodeOption };
    link?: { [key: string]: LinkOption };
    marker?: { [key: string]: MarkerOption };
    addressLabel?: AddressLabelOption;
    indexLabel?: { [key: string]: IndexLabelOption };
    layout?: LayoutOptions;
    behavior?: {
        dragNode: boolean | string[];
    }
};


/**
 * ---------------------------------------------------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------------------------------------------------
 * ------------------------------------------------------------------------------------------------------------------------
 */

export interface ViewOptions {
    fitCenter: boolean;
    groupPadding: number;
    updateHighlight: string;
    leakAreaHeight: number;
    layoutMode: ELayoutMode;
}


export interface AnimationOptions {
    enable: boolean;
    duration: number;
    timingFunction: string;
};


export interface BehaviorOptions {
    drag: boolean;
    zoom: boolean;
}

export interface EngineOptions {
    view?: ViewOptions;
    animation?: AnimationOptions;
    behavior?: BehaviorOptions;
};


export interface LayoutCreator {
    defineOptions(sourceData: SourceNode[]): LayoutGroupOptions;
    sourcesPreprocess?(sourceData: SourceNode[], options: LayoutGroupOptions, group: string): SourceNode[];
    defineLeakRule?(models: SVNode[]): SVNode[];
    layout(nodes: SVNode[], layoutOptions: LayoutOptions);
    [key: string]: any;
}

