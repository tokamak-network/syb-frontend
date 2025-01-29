import axios from 'axios';

import axiosInstance from './axios';

jest.mock('axios', () => {
	const mockAxios = {
		create: jest.fn(() => ({
			interceptors: {
				request: { use: jest.fn() },
				response: { use: jest.fn() },
			},
		})),
	};

	return mockAxios;
});

describe('axiosInstance', () => {
	it('should create an axios instance with interceptors', () => {
		expect(axios.create).toHaveBeenCalled();
		expect(axiosInstance.interceptors.request.use).toBeDefined();
		expect(axiosInstance.interceptors.response.use).toBeDefined();
	});
});
