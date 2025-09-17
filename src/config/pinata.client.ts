'use client';

import { PinataSDK } from 'pinata-web3';

// Client-side Pinata configuration
export const createPinataClient = (jwt: string) => {
	return new PinataSDK({
		pinataJwt: jwt,
	});
};
