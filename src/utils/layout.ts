// utils/layout.ts
import { Node } from 'reactflow';

/**
 * Arranges nodes in a circular layout.
 * @param nodes - The nodes to arrange.
 * @param radius - The radius of the circle.
 * @param centerX - The x-coordinate of the circle's center.
 * @param centerY - The y-coordinate of the circle's center.
 * @returns {Node[]} - The nodes with updated positions.
 */
export const circularLayout = (
	nodes: Node[],
	radius: number,
	centerX: number,
	centerY: number,
): Node[] => {
	return nodes.map((node, index) => {
		const angle = (index / nodes.length) * 2 * Math.PI;

		return {
			...node,
			position: {
				x: centerX + radius * Math.cos(angle),
				y: centerY + radius * Math.sin(angle),
			},
		};
	});
};
