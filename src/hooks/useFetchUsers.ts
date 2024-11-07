import { useQuery } from '@tanstack/react-query';

import { User } from '@/types';

const fetchUsers = async (): Promise<User[]> => {
	const response = await fetch('/api/users'); // example endpoint to fetch users

	if (!response.ok) {
		throw new Error('Network response was not ok');
	}

	return response.json();
};

export const useFetchUsers = () => {
	return useQuery<User[], Error>({
		queryKey: ['users'],
		queryFn: fetchUsers,
	});
};
