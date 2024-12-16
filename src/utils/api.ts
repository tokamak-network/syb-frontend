import axiosInstance from '@/lib/axios';

interface ApiRequestOptions {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	url: string;
	data?: any;
	params?: any;
	headers?: Record<string, string>;
}

export const apiRequest = async <T>({
	method,
	url,
	data,
	params,
	headers,
}: ApiRequestOptions): Promise<T> => {
	try {
		const response = await axiosInstance({
			method,
			url,
			data,
			params,
			headers,
		});

		return response.data;
	} catch (error) {
		console.error('API request error:', error);
		throw error;
	}
};
