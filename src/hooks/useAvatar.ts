import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiRequest } from '@/utils/api';
import { useToast } from '@/context';
// import { createPinataClient } from '@/config/pinata.client'; // Not needed for current implementation

interface Avatar {
	id: string;
	address: string;
	imageUrl: string;
	createdAt: string;
	updatedAt: string;
}

interface UseAvatarOptions {
	address?: string;
	enabled?: boolean;
}

// Hook to fetch avatar by address
export const useAvatar = ({ address, enabled = true }: UseAvatarOptions) => {
	return useQuery({
		queryKey: ['avatar', address],
		queryFn: async (): Promise<Avatar | null> => {
			if (!address) return null;

			const response = (await apiRequest({
				method: 'GET',
				url: `/avatar?address=${address}`,
			})) as { avatar: Avatar | null };

			return response.avatar;
		},
		enabled: enabled && !!address,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Hook to delete avatar
export const useDeleteAvatar = () => {
	const queryClient = useQueryClient();
	const { addToast } = useToast();

	const deleteMutation = useMutation({
		mutationFn: async (address: string) => {
			const response = await apiRequest({
				method: 'DELETE',
				url: `/avatar?address=${address}`,
			});

			return response;
		},
		onSuccess: (data, address) => {
			// Invalidate and refetch avatar queries
			queryClient.invalidateQueries({ queryKey: ['avatar', address] });

			addToast('success', 'Success', 'Avatar deleted successfully!');
		},
		onError: (error: any) => {
			addToast('error', 'Error', `Failed to delete avatar: ${error.message}`);
		},
	});

	const deleteAvatar = async (address: string) => {
		await deleteMutation.mutateAsync(address);
	};

	return {
		deleteAvatar,
		isDeleting: deleteMutation.isPending,
		error: deleteMutation.error,
	};
};

// Hook to get multiple avatars by addresses
export const useAvatars = (addresses: string[]) => {
	return useQuery({
		queryKey: ['avatars', addresses],
		queryFn: async (): Promise<Record<string, Avatar | null>> => {
			const avatarPromises = addresses.map(async (address) => {
				try {
					const response = (await apiRequest({
						method: 'GET',
						url: `/avatar?address=${address}`,
					})) as { avatar: Avatar | null };

					return { address, avatar: response.avatar };
				} catch {
					return { address, avatar: null };
				}
			});

			const results = await Promise.all(avatarPromises);

			return results.reduce(
				(acc, { address, avatar }) => {
					acc[address] = avatar;

					return acc;
				},
				{} as Record<string, Avatar | null>,
			);
		},
		enabled: addresses.length > 0,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};
