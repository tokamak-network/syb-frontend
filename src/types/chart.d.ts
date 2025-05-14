import { Plugin } from 'chart.js';

export interface ZoomPluginOptions {
	zoom: {
		wheel: {
			enabled: boolean;
		};
		pinch: {
			enabled: boolean;
		};
		mode: 'xy' | 'x' | 'y';
	};
	pan: {
		enabled: boolean;
		mode: 'xy' | 'x' | 'y';
	};
	limits: {
		y: { min: number };
	};
}

declare module 'chartjs-plugin-zoom' {
	const plugin: Plugin;
	export default plugin;
}
