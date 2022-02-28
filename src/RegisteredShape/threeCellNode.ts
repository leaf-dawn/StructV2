/*
 * @Author: your name
 * @Date: 2022-01-18 20:42:31
 * @LastEditTime: 2022-02-17 21:57:59
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \测试数据c:\Users\13127\Desktop\最近的前端文件\可视化源码-new\StructV2\src\RegisteredShape\treeCellNode.ts
 */
import { registerNode } from '@antv/g6';

export default registerNode('three-cell', {
	draw(cfg, group) {
		cfg.size = cfg.size || [30, 10];

		const width = cfg.size[0],
			height = cfg.size[1];

		const wrapperRect = group.addShape('rect', {
			attrs: {
				x: width / 2,
				y: height / 2,
				width: width,
				height: height,
				stroke: cfg.style.stroke,
				fill: cfg.style.backgroundFill || '#eee',
			},
			name: 'wrapper',
		});

		group.addShape('rect', {
			attrs: {
				x: width / 2,
				y: height / 2,
				width: width / 3,
				height: height,
				fill: cfg.style.fill,
				stroke: cfg.style.stroke,
			},
			name: 'left-rect',
			draggable: true,
		});

		group.addShape('rect', {
			attrs: {
				x: width * (5 / 6),
				y: height / 2,
				width: width / 3,
				height: height,
				fill: cfg.style.fill,
				stroke: cfg.style.stroke,
			},
			name: 'middle-rect',
			draggable: true,
		});

		const style = (cfg.labelCfg && cfg.labelCfg.style) || {};

		//节点上方文字
		if (cfg.root && cfg.rootLabel) {
			group.addShape('text', {
				attrs: {
					x: width * (2 / 3),
					y: 0,
					textAlign: 'center',
					textBaseline: 'middle',
					text: cfg.rootLabel[0],
					fill: style.fill || '#bbb',
					fontSize: style.fontSize || 16,
					fontStyle: 'italic',
					cursor: cfg.style.cursor,
				},
				name: 'text',
				draggable: true,
			});

			group.addShape('text', {
				attrs: {
					x: width,
					y: 0,
					textAlign: 'center',
					textBaseline: 'middle',
					text: cfg.rootLabel[1],
					fill: style.fill || '#bbb',
					fontSize: style.fontSize || 16,
					fontStyle: 'italic',
					cursor: cfg.style.cursor,
				},
				name: 'text',
				draggable: true,
			});

			group.addShape('text', {
				attrs: {
					x: width * (4 / 3),
					y: 0,
					textAlign: 'center',
					textBaseline: 'middle',
					text: cfg.rootLabel[2],
					fill: style.fill || '#bbb',
					fontSize: style.fontSize || 16,
					fontStyle: 'italic',
					cursor: cfg.style.cursor,
				},
				name: 'text',
				draggable: true,
			});
		}

		//节点左边文字
		if (cfg.index !== null) {
			group.addShape('text', {
				attrs: {
					x: width * (2 / 5),
					y: height,
					textAlign: 'center',
					textBaseline: 'middle',
					text: cfg.index,
					fill: style.fill || '#bbb',
					fontSize: style.fontSize || 16,
					fontStyle: 'italic',
					cursor: cfg.style.cursor,
				},
				name: 'text',
				draggable: true,
			});
		}
		//节点文字（数组形式）
		if (cfg.label) {
			group.addShape('text', {
				attrs: {
					x: width * (2 / 3),
					y: height,
					textAlign: 'center',
					textBaseline: 'middle',
					text: cfg.label[0],
					fill: style.fill || '#000',
					fontSize: style.fontSize || 16,
					cursor: cfg.style.cursor,
				},
				name: 'text',
				draggable: true,
			});

			group.addShape('text', {
				attrs: {
					x: width,
					y: height,
					textAlign: 'center',
					textBaseline: 'middle',
					text: cfg.label[1],
					fill: style.fill || '#000',
					fontSize: style.fontSize || 16,
					cursor: cfg.style.cursor,
				},
				name: 'text',
				draggable: true,
			});
		}

		//节点没有后续指针时
		if (!cfg.headNext) {
			group.addShape('text', {
				attrs: {
					x: width * (4 / 3),
					y: height * (6 / 5),
					textAlign: 'center',
					textBaseline: 'middle',
					text: '^',
					fill: style.fill || '#000',
					fontSize: 22,
					cursor: cfg.style.cursor,
				},
				name: 'text',
				draggable: true,
			});
		}

		return wrapperRect;
	},

	getAnchorPoints() {
		return [
			[0.5, 0],
			[5 / 6, 0.5],
			[0.5, 1],
			[0, 0.5],
		];
	},
});
