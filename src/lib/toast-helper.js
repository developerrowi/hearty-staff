import { toast as defToast } from '@zerodevx/svelte-toast';

export const toast = {
	info: (msg) =>
		defToast.push(msg, {
			theme: {
				'--toastBackground': '#99CCFF',
				'--toastBarBackground': '#1D2531',
				'--toastColor': '#1D2531',
				'--toastBorderRadius': '0.5rem'
			}
		}),
	success: (msg) =>
		defToast.push(msg, {
			theme: {
				'--toastBackground': '#C5FFBB',
				'--toastBarBackground': '#1D2531',
				'--toastColor': '#1D2531',
				'--toastBorderRadius': '0.5rem'
			}
		}),
	warn: (msg) =>
		defToast.push(msg, {
			theme: {
				'--toastBackground': '#E5C2A5',
				'--toastBarBackground': '#1D2531',
				'--toastColor': '#1D2531',
				'--toastBorderRadius': '0.5rem'
			}
		}),
	error: (msg) =>
		defToast.push(msg, {
			theme: {
				'--toastBackground': '#EB7373',
				'--toastBarBackground': '#1D2531',
				'--toastColor': '#1D2531',
				'--toastBorderRadius': '0.5rem'
			}
		}),
	remove: () => defToast.pop()
};
