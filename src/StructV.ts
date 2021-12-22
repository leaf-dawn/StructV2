import { Engine } from "./engine";
import { Bound } from "./Common/boundingRect";
import { Group } from "./Common/group";
import G6 from '@antv/g6';
import Pointer from "./RegisteredShape/pointer";
import LinkListNode from "./RegisteredShape/linkListNode";
import BinaryTreeNode from "./RegisteredShape/binaryTreeNode";
import CLenQueuePointer from "./RegisteredShape/clenQueuePointer";
import TwoCellNode from "./RegisteredShape/twoCellNode";
import ArrayNode from "./RegisteredShape/arrayNode";
import Cursor from "./RegisteredShape/cursor";
import { Vector } from "./Common/vector";
import { EngineOptions, LayoutCreator } from "./options";
import { SourceNode } from "./sources";
import { Util } from "./Common/util";
import { SVModel } from "./Model/SVModel";




export interface StructV {
    (DOMContainer: HTMLElement, engineOptions: EngineOptions): Engine;
    Group: typeof Group;
    Bound: typeof Bound;
    Vector: typeof Vector,
    Mat3: any;
    G6: any;

    registeredShape: any[];

    registeredLayout: { [key: string]: LayoutCreator },

    registerShape: Function,

    /**
     * 注册一个布局器
     * @param name 
     * @param layout
     */
    registerLayout(name: string, layoutCreator: LayoutCreator);
}


export const SV: StructV = function(DOMContainer: HTMLElement, engineOptions: EngineOptions = { }) {
    return new Engine(DOMContainer, engineOptions);
}

SV.Group = Group;
SV.Bound = Bound;
SV.Vector = Vector;
SV.Mat3 = G6.Util.mat3;
SV.G6 = G6;

SV.registeredLayout = {};
SV.registeredShape = [
    Pointer, 
    LinkListNode, 
    BinaryTreeNode, 
    TwoCellNode,
    Cursor,
    ArrayNode,
    CLenQueuePointer,
];

SV.registerShape = Util.registerShape;
SV.registerLayout = function(name: string, layoutCreator: LayoutCreator) {

    if(typeof layoutCreator.sourcesPreprocess !== 'function') {
        layoutCreator.sourcesPreprocess = function(data: SourceNode[]): SourceNode[] {
            return data;
        }
    }

    if(typeof layoutCreator.defineLeakRule !== 'function') {
        layoutCreator.defineLeakRule = function(models: SVModel[]): SVModel[] {
            return models;
        }
    }

    if(typeof layoutCreator.defineOptions !== 'function' || typeof layoutCreator.layout !== 'function') {
        return;
    }
    
    SV.registeredLayout[name] = layoutCreator;
};

