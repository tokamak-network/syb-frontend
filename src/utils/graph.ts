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

	// Constants for node size and layer management
	const nodeDiameter = 100; // Approximate diameter of a node
	const baseLayerDistance = 150; // Base distance between layers
	const maxNodesPerLayer = 8; // Maximum nodes per layer
	const randomOffsetRange = 30; // Maximum random offset for layer distance

	const addressToUserMap = new Map(users.map((user) => [user.address, user]));

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

		const totalNodes = centerUser.vouchesReceived.length;
		const layersNeeded = Math.ceil(totalNodes / maxNodesPerLayer);

		// Position nodes from vouchesReceived list around the center
		centerUser.vouchesReceived.forEach((vouch, index) => {
			const layer = Math.floor(index / maxNodesPerLayer);
			const nodesInLayer = Math.min(
				maxNodesPerLayer,
				totalNodes - layer * maxNodesPerLayer,
			);
			const angle = ((index % maxNodesPerLayer) * (2 * Math.PI)) / nodesInLayer;
			const randomOffset = Math.random() * randomOffsetRange;
			const radius = (layer + 1) * baseLayerDistance + randomOffset;
			const x = centerX + radius * Math.cos(angle);
			const y = centerY + radius * Math.sin(angle);

			if (!nodes.some((node) => node.id === vouch.address)) {
				nodes.push({
					id: vouch.address,
					data: { label: vouch.address },
					position: { x, y },
					draggable: true,
					style: {
						width: nodeDiameter,
						height: nodeDiameter,
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
						width: nodeDiameter,
						height: nodeDiameter,
					},
				});
			}

			edges.push({
				id: `edge-${centerUser.address}-${vouch.address}`,
				source: centerUser.address,
				target: vouch.address,
				type: 'floating',
				markerEnd: {
					type: MarkerType.Arrow,
				},
				style: { stroke: '#222', strokeWidth: 1.5 },
			});
		});

		// Position other nodes around the center node
		const otherNodes = users.filter(
			(user) => !nodes.some((node) => node.id === user.address),
		);
		const totalOtherNodes = otherNodes.length;

		otherNodes.forEach((user, index) => {
			const layer = Math.floor(index / maxNodesPerLayer) + layersNeeded;
			const nodesInLayer = Math.min(
				maxNodesPerLayer,
				totalOtherNodes - (layer - layersNeeded) * maxNodesPerLayer,
			);
			const angle = ((index % maxNodesPerLayer) * (2 * Math.PI)) / nodesInLayer;
			const randomOffset = Math.random() * randomOffsetRange;
			const radius = (layer + 1) * baseLayerDistance + randomOffset;
			const x = centerX + radius * Math.cos(angle);
			const y = centerY + radius * Math.sin(angle);

			nodes.push({
				id: user.address,
				data: { label: user.address },
				position: { x, y },
				draggable: true,
				style: {
					width: nodeDiameter,
					height: nodeDiameter,
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
					width: nodeDiameter,
					height: nodeDiameter,
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
		});
	}

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
