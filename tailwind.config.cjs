/** @typedef { import('tailwindcss/defaultConfig') } DefaultConfig */
/** @typedef { import('tailwindcss/defaultTheme') } DefaultTheme */

/** @type { DefaultConfig & { theme: { extend: DefaultTheme } } } */
module.exports = {
	future: {
		purgeLayersByDefault: true,
		removeDeprecatedGapUtilities: true
	},
	purge: {
		content: ['./src/**/*.svelte'],
		enabled: false
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			blue: '#99CCFF',
			orange: '#E5C2A5',
			green: '#C5FFBB',
			overlay: 'rgba(0,0,0,0.8)',
			darkslategray: '#1d2531',
			darkslategraySecondary: '#29303c',
			tan: '#c3ab9a'
		},
		fontFamily: {
			arciform: ['Arciform', '"Lucida Sans"', '"Gill Sans"', 'Geneva', 'Verdana', 'sans-serif'],
			roboto: ['Roboto', '"Lucida Sans"', '"Gill Sans"', 'Geneva', 'Verdana', 'sans-serif']
		},
		extend: {
			colors: {
				'back-color': '#1D2531',
				facebook: '#3567B8',
				twitter: '#00A2F9'
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
