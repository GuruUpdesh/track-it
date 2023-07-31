/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		"to-red-400/25",
		"to-yellow-400/25",
		"to-lime-400/25",
		"to-emerald-400/25",
		"to-indigo-400/25",
		"text-red-200",
		"text-yellow-200",
		"text-lime-200",
		"text-emerald-200",
		"text-indigo-200",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
}
