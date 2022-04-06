import { Util } from '../Common/util';

export default Util.registerShape(
	'binary-tree-node',
	{
		draw(cfg, group) {
			cfg.size = cfg.size;

			const width = cfg.size[0],
				height = cfg.size[1];

			const wrapperRect = group.addShape('rect', {
				attrs: {
					x: width / 2,
					y: height / 2,
					width: width,
					height: height,
					stroke: cfg.style.stroke || '#333',
					cursor: cfg.style.cursor,
					fill: cfg.style.backgroundFill || '#eee',
				},
				name: 'wrapper',
			});

			group.addShape('rect', {
				attrs: {
					x: width / 4 + width / 2,
					y: height / 2,
					width: width / 2,
					height: height,
					fill: cfg.style.fill,
					stroke: cfg.style.stroke || '#333',
					cursor: cfg.style.cursor,
				},
				name: 'mid',
				draggable: true,
			});

			const style = (cfg.labelCfg && cfg.labelCfg.style) || {};

			if (cfg.label) {
				group.addShape('text', {
					attrs: {
						x: width, // 居中
						y: height,
						textAlign: 'center',
						textBaseline: 'middle',
						text: cfg.label,
						fill: style.fill || '#000',
						fontSize: style.fontSize || 16,
						cursor: cfg.style.cursor,
					},
					name: 'label',
					draggable: true,
				});
			}

			const isLeftEmpty =
					!cfg.child || cfg.child[0] === undefined || cfg.child[0] === undefined || cfg.child[0] == '0x0',
				isRightEmpty =
					!cfg.child || cfg.child[1] === undefined || cfg.child[1] === undefined || cfg.child[1] == '0x0';

			//节点没有左孩子节点时
			if (isLeftEmpty) {
				group.addShape('text', {
					attrs: {
						x: width * (5 / 8),
						y: height * (8 / 7),
						textAlign: 'center',
						textBaseline: 'middle',
						text: '^',
						fill: style.fill || '#000',
						fontSize: 16,
						cursor: cfg.style.cursor,
					},
					name: 'null-left',
					draggable: true,
				});
			}
			//节点没有右孩子节点时
			if (isRightEmpty) {
				group.addShape('text', {
					attrs: {
						x: width * (11 / 8),
						y: height * (8 / 7),
						textAlign: 'center',
						textBaseline: 'middle',
						text: '^',
						fill: style.fill || '#000',
						fontSize: 16,
						cursor: cfg.style.cursor,
					},
					name: 'null-right',
					draggable: true,
				});
			}

			return wrapperRect;
		},

		getAnchorPoints() {
			return [
				[0.5, 0],
				[0.875, 0.5],
				[0.5, 1],
				[0.125, 0.5],
			];
		},
	},
	'rect'
);
