/*
 * @Author: your name
 * @Date: 2022-01-26 01:58:25
 * @LastEditTime: 2022-02-18 18:51:28
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \水功能c:\Users\13127\Desktop\最近的前端文件\可视化0126\StructV2\src\RegisteredShape\linkListNode.ts
 */
import { Util } from '../Common/util';

export default Util.registerShape(
	'link-list-node',
	{
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
					stroke: cfg.style.stroke || '#333',
					fill: cfg.style.backgroundFill || '#eee',
					cursor: cfg.style.cursor,
				},
				name: 'wrapper',
			});

			group.addShape('rect', {
				attrs: {
					x: width / 2,
					y: height / 2,
					width: width * (2 / 3),
					height: height,
					fill: cfg.style.fill,
					stroke: cfg.style.stroke || '#333',
					cursor: cfg.style.cursor,
				},
				name: 'main-rect',
				draggable: true,
			});

			const style = (cfg.labelCfg && cfg.labelCfg.style) || {};

			if (cfg.label) {
				group.addShape('text', {
					attrs: {
						x: width * (5 / 6),
						y: height,
						textAlign: 'center',
						textBaseline: 'middle',
						text: cfg.label,
						fill: style.fill || '#000',
						fontSize: style.fontSize || 16,
					},
					name: 'text',
					draggable: true,
				});
			}

			//节点没有后续指针时
			if (!cfg.next && !cfg.loopNext) {
				group.addShape('text', {
					attrs: {
						x: width * (4 / 3),
						y: height * (6 / 5),
						textAlign: 'center',
						textBaseline: 'middle',
						text: '^',
						fill: style.fill || '#000',
						fontSize: 16,
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
				[5 / 6, 0],
				[5 / 6, 0.5],
				[1, 0.5],
				[5 / 6, 1],
				[0.5, 1],
				[0, 0.5],
				[1 / 3, 1],
			];
		},
	},
	'rect'
);
