import axios from 'axios';

// Use direct API URL in production, proxy in development
const getBaseURL = () => {
	if (typeof window !== 'undefined') {
		// Client-side: use proxy route
		return '/sequencer';
	}
	// Server-side: use direct API URL if available
	return process.env.NEXT_PUBLIC_API_URL
		? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
		: '/sequencer';
};

const axiosInstance = axios.create({
	baseURL: getBaseURL(),
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		console.error('API Error:', {
			status: error.response?.status,
			statusText: error.response?.statusText,
			url: error.config?.url,
			baseURL: error.config?.baseURL,
			message: error.message,
		});
		return Promise.reject(error);
	},
);

export default axiosInstance;
