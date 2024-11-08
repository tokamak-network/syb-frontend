import { MarkerType, Position } from '@xyflow/react';

import { User, UserEdge, UserNode } from '@/types';

export const calculateNodePositions = (
	centerNodeAddress: string,
	users: User[],
): { nodes: UserNode[]; edges: UserEdge[] } => {
	const nodes: UserNode[] = [];
	const edges: UserEdge[] = [];
	const centerX = window.innerWidth / 2;
	const centerY = window.innerHeight / 2;
	const innerRadius = 150; // Radius for nodes close to the center
	const outerRadius = 300; // Radius for other nodes

	// Create a map for quick access to users by address
	const addressToUserMap = new Map(users.map((user) => [user.address, user]));

	// Place the center node at the center of the screen
	const centerUser = users.find((user) => user.address === centerNodeAddress);

	if (centerUser) {
		nodes.push({
			id: centerUser.address,
			data: { label: centerUser.address },
			position: { x: centerX, y: centerY },
			draggable: true,
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
			measured: {
				width: 150,
				height: 150,
			},
		});

		// Position nodes from vouchesReceived list closer to the center
		centerUser.vouchesReceived.forEach((vouch, index) => {
			const angle = (index * (2 * Math.PI)) / centerUser.vouchesReceived.length;
			const x = centerX + innerRadius * Math.cos(angle);
			const y = centerY + innerRadius * Math.sin(angle);

			if (!nodes.some((node) => node.id === vouch.address)) {
				nodes.push({
					id: vouch.address,
					data: { label: vouch.address },
					position: { x, y },
					draggable: true,
					style: {
						width: 100,
						height: 100,
						fontSize: 12,
						backgroundColor: '#2ecc71',
						color: '#fff',
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center' as const,
					},
					measured: {
						width: 100,
						height: 100,
					},
				});
			}

			edges.push({
				id: `edge-${centerUser.address}-${vouch.address}`,
				source: vouch.address,
				target: centerUser.address,
				type: 'floating',
				markerEnd: {
					type: MarkerType.Arrow,
				},
				style: { stroke: '#222', strokeWidth: 1.5 },
			});
		});
	}

	// Position other nodes around the center node
	users.forEach((user, index) => {
		if (
			user.address !== centerNodeAddress &&
			!nodes.some((node) => node.id === user.address)
		) {
			// Calculate position in an outer circular layout
			const angle =
				(index * (2 * Math.PI)) /
				(users.length - (centerUser ? centerUser.vouchesReceived.length : 0));
			const x = centerX + outerRadius * Math.cos(angle);
			const y = centerY + outerRadius * Math.sin(angle);

			nodes.push({
				id: user.address,
				data: { label: user.address },
				position: { x, y },
				draggable: true,
				style: {
					width: 100,
					height: 100,
					fontSize: 12,
					backgroundColor: '#e74c3c',
					color: '#fff',
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center' as const,
				},
				measured: {
					width: 100,
					height: 100,
				},
			});

			// Create edges for vouches received
			user.vouchesReceived.forEach((vouch) => {
				if (addressToUserMap.has(vouch.address)) {
					edges.push({
						id: `edge-${user.address}-${vouch.address}`,
						source: vouch.address,
						target: user.address,
						type: 'floating',
						markerEnd: {
							type: MarkerType.Arrow,
						},
						style: { stroke: '#222', strokeWidth: 1.5 },
					});
				}
			});
		}
	});

	return { nodes, edges };
};

// Utility functions to handle edge calculations
const getNodeIntersection = (
	intersectionNode: UserNode,
	targetNode: UserNode,
) => {
	const intersectionNodePosition = intersectionNode.position;
	const targetPosition = targetNode.position;

	// Calculate the center of each node
	const x2 = intersectionNodePosition.x + intersectionNode.measured.width / 2;
	const y2 = intersectionNodePosition.y + intersectionNode.measured.height / 2;
	const x1 = targetPosition.x + targetNode.measured.width / 2;
	const y1 = targetPosition.y + targetNode.measured.height / 2;

	// Calculate angle and distance between node centers
	const angle = Math.atan2(y1 - y2, x1 - x2);
	const radius = intersectionNode.measured.width / 2;

	// Calculate intersection point on the circle's perimeter
	const x = x2 + radius * Math.cos(angle);
	const y = y2 + radius * Math.sin(angle);

	return { x, y };
};

const getEdgePosition = (
	node: UserNode,
	interSectionPoint: { x: number; y: number },
) => {
	const nodeCenterX = node.position.x + node.measured.width / 2;
	const nodeCenterY = node.position.y + node.measured.height / 2;

	const deltaX = interSectionPoint.x - nodeCenterX;
	const deltaY = interSectionPoint.y - nodeCenterY;

	const angle = Math.atan2(deltaY, deltaX);
	const absAngle = Math.abs(angle);

	if (absAngle < Math.PI / 4) {
		return Position.Right;
	} else if (absAngle >= Math.PI / 4 && absAngle < (3 * Math.PI) / 4) {
		return deltaY > 0 ? Position.Bottom : Position.Top;
	} else {
		return Position.Left;
	}
};

export const getEdgeParams = (source: UserNode, target: UserNode) => {
	const sourceIntersectionPoint = getNodeIntersection(source, target);
	const targetIntersectionPoint = getNodeIntersection(target, source);

	const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
	const targetPos = getEdgePosition(target, targetIntersectionPoint);

	return {
		sx: sourceIntersectionPoint.x,
		sy: sourceIntersectionPoint.y,
		tx: targetIntersectionPoint.x,
		ty: targetIntersectionPoint.y,
		sourcePos,
		targetPos,
	};
};
