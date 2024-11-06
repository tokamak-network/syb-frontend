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
			const fromUser = state.users.find((user) => user.address === fromAddress);
			const toUser = state.users.find((user) => user.address === toAddress);

			if (fromUser && toUser) {
				// Example score update
				fromUser.score += 10;
				toUser.score += 5;

				// Example balance update
				const connectedUsers = state.users.filter((user) =>
					user.vouchesReceived.some((vouch) => vouch.address === fromAddress),
				);

				fromUser.balance = connectedUsers.reduce(
					(acc, user) => acc + user.balance,
					0,
				);

				return {
					users: state.users.map((user) => {
						if (user.address === fromAddress) return fromUser;
						if (user.address === toAddress) return toUser;

						return user;
					}),
				};
			}

			return state;
		}),
}));
