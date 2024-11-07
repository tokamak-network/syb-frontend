import { Node, Edge, Position, MarkerType } from '@xyflow/react';

import { User } from '@/types';
import { randomColor } from '@/utils/color';

export const calculateNodePositions = (
	centerNodeAddress: string,
	users: User[],
): { nodes: Node[]; edges: Edge[] } => {
	const centerNode: Node = {
		id: centerNodeAddress,
		data: { label: `${centerNodeAddress}` },
		draggable: true,
		position: { x: 300, y: 300 },
		sourcePosition: Position.Top,
		targetPosition: Position.Bottom,
		style: {
			width: 150,
			height: 150,
			fontSize: 16,
			backgroundColor: '#3498db',
			color: '#fff',
			borderRadius: '50%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			textAlign: 'center' as const,
		},
	};

	const nodeMap = new Map<string, Node>();

	nodeMap.set(centerNodeAddress, centerNode);

	const edgesList: Edge[] = [];

	const processNode = (
		node: User,
		level: number,
		angleStep: number,
		centerX: number,
		centerY: number,
	) => {
		const maxLevels = 4;

		if (level > maxLevels) return;

		const radius = 100 + 100 * level;
		const alpha = 1 - level * 0.3;

		node.vouchesReceived.forEach((vouch, index) => {
			if (!nodeMap.has(vouch.address)) {
				const angle = angleStep * index;
				const x = centerX + radius * Math.cos(angle);
				const y = centerY + radius * Math.sin(angle);

				const newNode: Node = {
					id: vouch.address,
					data: { label: `${vouch.address}` },
					draggable: true,
					position: { x, y },
					sourcePosition: Position.Right,
					targetPosition: Position.Left,
					style: {
						width: 100 - 10 * level,
						height: 100 - 10 * level,
						fontSize: 12,
						backgroundColor: `rgba(${parseInt(
							randomColor().slice(1, 3),
							16,
						)}, ${parseInt(randomColor().slice(3, 5), 16)}, ${parseInt(
							randomColor().slice(5, 7),
							16,
						)}, ${alpha})`,
						color: '#fff',
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center' as const,
					},
				};

				nodeMap.set(vouch.address, newNode);
				edgesList.push({
					id: `${node.address}-${vouch.address}`,
					source: node.address,
					target: vouch.address,
					type: 'floating',
					style: { stroke: `#ffffff`, strokeWidth: 1 },
					markerStart: {
						type: MarkerType.Arrow,
					},
					markerEnd: {
						type: MarkerType.Arrow,
					},
				});

				const nextNode = users.find((u) => u.address === vouch.address);

				if (nextNode) {
					processNode(
						nextNode,
						level + 1,
						angleStep / node.vouchesReceived.length,
						x,
						y,
					);
				}
			}
		});
	};

	const startingNode = users.find((u) => u.address === centerNodeAddress);

	if (startingNode) {
		processNode(
			startingNode,
			1,
			(2 * Math.PI) / startingNode.vouchesReceived.length,
			300,
			300,
		);
	}

	nodeMap.forEach((node) => {
		node.sourcePosition = Position.Right;
		node.targetPosition = Position.Left;
	});

	return { nodes: Array.from(nodeMap.values()), edges: edgesList };
};
