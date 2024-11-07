import { create } from 'zustand';

import { User } from '@/types';
import { users as initialUsers } from '@/data';

interface UserState {
	users: User[];
	updateUser: (updatedUser: User) => void;
	updateUserBalanceAndScore: (fromAddress: string, toAddress: string) => void;
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
}));
