/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			backgroundImage: {
        'radial-gradient': 'radial-gradient(circle, rgba(76,61,61,1) 0%, rgba(45,42,42,1) 100%)',
        'radial-gradient-transparent': 'none',
      },
			fontFamily: {
				'poppins': ['Poppins', 'sans-serif'],
				'bebasneue': ['Bebas Neue', 'sans-serif']
			}
		},
	},
	plugins: [
		require('@tailwindcss/typography')
	],
}
