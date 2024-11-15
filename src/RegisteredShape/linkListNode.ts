/*
 * @Author: your name
 * @Date: 2022-01-26 01:58:25
 * @LastEditTime: 2022-02-18 18:51:28
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Util } from '../Common/util';
import { ShapeAttrs } from '@antv/g-base';


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

			const style = (cfg.labelCfg && cfg.labelCfg.style) || {};

			let nullTexAttrst:ShapeAttrs = {
				textAlign: 'center',
				textBaseline: 'middle',
				text: '^',
				fill: style.fill || '#000',
				fontSize: 16,
				cursor: cfg.style.cursor,
			};

			
			// 双向链表
			if(cfg.pre != undefined) {
				group.addShape('rect', {
					attrs: {
						x: width * (3 / 4),
						y: height / 2,
						width: width * (1 / 2),
						height: height,
						fill: cfg.style.fill,
						stroke: cfg.style.stroke || '#333',
						cursor: cfg.style.cursor,
					},
					name: 'main-rect',
					draggable: true,
				});

				//节点没有pre或者next指针时，添加^符号表示结束
				if (!cfg.pre) {
					group.addShape('text', {
						attrs: {
							x: width * (5 / 8),
							y: height * (6 / 5),
							...nullTexAttrst,
						},
						name: 'null',
						draggable: true,
					});
				}
				if (!cfg.next) {
					group.addShape('text', {
						attrs: {
							x: width * (11 / 8),
							y: height * (6 / 5),
							...nullTexAttrst,
						},
						name: 'null',
						draggable: true,
					});
				}
				if (cfg.label) {
					group.addShape('text', {
						attrs: {
							x: width,
							y: height,
							textAlign: 'center',
							textBaseline: 'middle',
							text: cfg.label,
							fill: style.fill || '#000',
							fontSize: style.fontSize || 16,
						},
						name: 'label',
						draggable: true,
					});
				}
			}

			// 单向链表
			if(cfg.pre == undefined) {
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

				//节点没有后续指针时，添加^符号表示结束
				if (!cfg.next) {
					group.addShape('text', {
						attrs: {
							x: width * (4 / 3),
							y: height * (6 / 5),
							...nullTexAttrst,
						},
						name: 'null',
						draggable: true,
					});
				}

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
						name: 'label',
						draggable: true,
					});
				}
			}




			return wrapperRect;
		},

		getAnchorPoints(cfg) {
			if(cfg.pre == undefined) {
				// 单向链表
				return [
					[0.5, 0],
					[1, 0.5],
					[1, 0.5],
					[0.5, 1],
					[0, 0.5],
					[0, 0.5],
					[5 / 6, 0.5], //指针
				];
			} else {
					// 双向链表
					return [
						[0.5, 0],
						[1, 1 / 4],
						[1, 3 / 4],
						[0.5, 1],
						[0, 3 / 4],
						[0, 1 / 4],
						[7 / 8, 3 / 4], //指针
						[1 / 8, 1 / 4], 
					];
			}

		},
	},
	'rect'
);
