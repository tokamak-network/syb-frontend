import { create } from 'zustand';

import { User } from '@/types';
import { users as initialUsers } from '@/const';

interface UserState {
	users: User[];
	updateUser: (updatedUser: User) => void;
	updateUserBalanceAndScore: (fromAddress: string, toAddress: string) => void;
	explodeAllConnections: (nodeAddress: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
	users: initialUsers,
	updateUser: (updatedUser) =>
		set((state) => ({
			users: state.users.map((user) =>
				user.address === updatedUser.address ? updatedUser : user,
			),
		})),
	updateUserBalanceAndScore: (fromAddress, toAddress) =>
		set((state) => {
			const fromUserIndex = state.users.findIndex(
				(user) => user.address === fromAddress,
			);
			const toUserIndex = state.users.findIndex(
				(user) => user.address === toAddress,
			);

			if (fromUserIndex !== -1 && toUserIndex !== -1) {
				const fromUser = { ...state.users[fromUserIndex] };
				const toUser = { ...state.users[toUserIndex] };

				// Adjust scores and balances
				fromUser.score += 10;
				toUser.score += 5;

				const vouchAmount = 0.5;

				if (fromUser.balance >= vouchAmount) {
					fromUser.balance -= vouchAmount;
					toUser.balance += vouchAmount;

					// Add toUser to fromUser's vouchesReceived
					const existingVouch = toUser.vouchesReceived.find(
						(vouch) => vouch.address === fromAddress,
					);

					if (existingVouch) {
						existingVouch.amount += vouchAmount;
					} else {
						toUser.vouchesReceived = [
							...toUser.vouchesReceived,
							{ address: fromAddress, amount: vouchAmount },
						];
					}

					// Return a new array with updated users
					const newUsers = [...state.users];

					newUsers[fromUserIndex] = fromUser;
					newUsers[toUserIndex] = toUser;

					return {
						users: newUsers,
					};
				}
			}

			return state;
		}),
	explodeAllConnections: (nodeAddress) =>
		set((state) => {
			const node = state.users.find((user) => user.address === nodeAddress);

			if (node) {
				// Nodes that vouched for this node
				node.vouchesReceived.forEach((vouch) => {
					const fromUser = state.users.find((u) => u.address === vouch.address);

					if (fromUser) {
						fromUser.score -= 10;
						node.score -= 5;

						if (vouch.amount > 0) {
							fromUser.balance += vouch.amount;
							node.balance -= vouch.amount;
							vouch.amount = 0; // Reset the vouch amount
						}
					}
				});

				// Remove all vouches received
				node.vouchesReceived = [];

				// Nodes that this node vouched for
				state.users.forEach((otherUser) => {
					const vouchIndex = otherUser.vouchesReceived.findIndex(
						(vouch) => vouch.address === nodeAddress,
					);

					if (vouchIndex !== -1) {
						const vouch = otherUser.vouchesReceived[vouchIndex];

						node.balance += vouch.amount;
						otherUser.balance -= vouch.amount;
						otherUser.score -= 5;
						node.score -= 10;
						otherUser.vouchesReceived.splice(vouchIndex, 1);
					}
				});

				return { users: [...state.users] };
			}

			return state;
		}),
}));
