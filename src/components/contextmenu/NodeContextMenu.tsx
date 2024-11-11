import React from 'react';

import { Button } from '../common';

interface NodeContextMenuProps {
	onVouch: () => void;
	onUserInfo: () => void;
	onExplode: () => void;
	isConnectedToCurrentUser: boolean;
	id: string;
	top: number | null;
	left: number | null;
	onClose?: () => void;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
	onVouch,
	onUserInfo,
	onExplode,
	isConnectedToCurrentUser,
	id,
	top,
	left,
	onClose = () => {},
}) => {
	return (
		<div
			aria-label={`Context menu for node ${id}`}
			className="context-menu fixed rounded bg-black p-2 text-white shadow-md"
			role="menu"
			style={{ top: top ?? undefined, left: left ?? undefined }}
			tabIndex={0}
			onClick={(e) => e.stopPropagation()}
			onKeyDown={(e) => e.key === 'Escape' && onClose()}
		>
			<p style={{ margin: '0.5em' }}>
				<small>node: {id}</small>
			</p>
			{isConnectedToCurrentUser ? (
				<>
					<Button
						className="cursor-pointer p-2"
						onClick={() => {
							onExplode();
							onClose();
						}}
					>
						Explode
					</Button>
					<Button
						className="cursor-pointer p-2"
						onClick={() => {
							onUserInfo();
							onClose();
						}}
					>
						More Information
					</Button>
				</>
			) : (
				<>
					<Button
						className="cursor-pointer p-2"
						onClick={() => {
							onVouch();
							onClose();
						}}
					>
						Vouch
					</Button>
					<Button
						className="cursor-pointer p-2"
						onClick={() => {
							onUserInfo();
							onClose();
						}}
					>
						User Information
					</Button>
				</>
			)}
		</div>
	);
};
