import { Engine } from "./engine";
import { Bound } from "./Common/boundingRect";
import { Group } from "./Common/group";
import pointer from "./RegisteredShape/pointer";
import G6, { Util } from '@antv/g6';
import linkListNode from "./RegisteredShape/linkListNode";
import binaryTreeNode from "./RegisteredShape/binaryTreeNode";
import CLenQueuePointer from "./RegisteredShape/clenQueuePointer";
import twoCellNode from "./RegisteredShape/twoCellNode";
import Cursor from "./RegisteredShape/cursor";
import { Vector } from "./Common/vector";
import { EngineOptions, LayoutCreator } from "./options";
import { SVNode } from "./Model/SVNode";
import { SourceNode } from "./sources";



export interface StructV {
    (DOMContainer: HTMLElement, engineOptions: EngineOptions): Engine;
    Group: typeof Group;
    Bound: typeof Bound;
    Vector: typeof Vector,
    Mat3: any;
    G6: any;

    registeredShape: any[];

    registeredLayout: { [key: string]: { [key: string]: LayoutCreator } },

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
SV.Mat3 = Util.mat3;
SV.G6 = G6;

SV.registeredLayout = {};
SV.registeredShape = [
    pointer, 
    linkListNode, 
    binaryTreeNode, 
    twoCellNode,
    Cursor,
    CLenQueuePointer,
];

SV.registerShape = G6.registerNode;
SV.registerLayout = function(name: string, layoutCreator: LayoutCreator, mode: string = 'default') {

    if(typeof layoutCreator.sourcesPreprocess !== 'function') {
        layoutCreator.sourcesPreprocess = function(data: SourceNode[]): SourceNode[] {
            return data;
        }
    }

    if(typeof layoutCreator.defineLeakRule !== 'function') {
        layoutCreator.defineLeakRule = function(nodes: SVNode[]): SVNode[] {
            return nodes;
        }
    }

    if(typeof layoutCreator.defineOptions !== 'function' || typeof layoutCreator.layout !== 'function') {
        return;
    }

    if(SV.registeredLayout[name] === undefined) {
        SV.registeredLayout[name] = {};
    }
    
    SV.registeredLayout[name][mode] = layoutCreator;
};


