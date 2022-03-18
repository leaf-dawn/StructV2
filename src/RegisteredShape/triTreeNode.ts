import { Util } from '../Common/util';

export default Util.registerShape(
	'tri-tree-node',
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
                fill: '#eee'
            },
            name: 'wrapper'
        });

        group.addShape('rect', {
            attrs: {
                x: width / 4 + width / 2,
                y: height / 2,
                width: width / 2,
                height: height / 4,
                fill: '#eee',
                stroke: cfg.style.stroke || '#333',
                cursor: cfg.style.cursor
            },
            name: 'top',
            draggable: true
        });

        group.addShape('rect', {
            attrs: {
                x: width / 4 + width / 2,
                y: height / 2 + height / 4,
                width: width / 2,
                height: height / 4 * 3,
                fill: cfg.color || cfg.style.fill,
                stroke: cfg.style.stroke || '#333',
                cursor: cfg.style.cursor
            },
            name: 'bottom',
            draggable: true
        });
        const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
        if (cfg.label) {
            
            group.addShape('text', {
                attrs: {
                    x: width, // 居中
                    y: height + height / 8,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: cfg.label,
                    fill: style.fill || '#000',
                    fontSize: style.fontSize || 16,
                    cursor: cfg.style.cursor
                },
                name: 'text',
                draggable: true
            });
        }
        let parent = cfg.parent || cfg.l_parent || cfg.r_parent;
        const isLeftEmpty =
        !cfg.child || cfg.child[0] === undefined || cfg.child[0] === undefined || cfg.child[0] == '0x0',
              isRightEmpty =
        !cfg.child || cfg.child[1] === undefined || cfg.child[1] === undefined || cfg.child[1] == '0x0',
        isparentEmpty = parent[0] == "0x0";
        
        
        // console.log(cfg.id);
        // console.log(parent);
        
        // console.log(isparentEmpty);
        

        if (isparentEmpty) {
          {
            group.addShape('text', {
                attrs: {
                    x: width, // 居中
                    y: height / 4 * 3,
                    textAlign: 'center',
                    textBaseline: 'middle',
                    text: "^",
                    fill: style.fill || '#000',
                    fontSize: style.fontSize || 14,
                    cursor: cfg.style.cursor
                },
                name: 'parent',
                draggable: true
            });
        }
        }

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
        name: 'text',
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
        name: 'text',
        draggable: true,
      });
    }


        return wrapperRect;
    },

    getAnchorPoints() {
        return [
            [0.125, 0.5],
            [0.875, 0.5],
            [0.4, 1],
            [0.5, 0],
            [0.5, 0.125],
            [0.6, 1],
            [0.5,1]
        ];
    },
}
);
