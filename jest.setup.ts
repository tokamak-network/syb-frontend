import '@testing-library/jest-dom';

global.TextEncoder = require('util')
	.TextEncoder as typeof globalThis.TextEncoder;
global.TextDecoder = require('util')
	.TextDecoder as typeof globalThis.TextDecoder;
