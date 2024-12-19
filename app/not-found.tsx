"use client"

import React, { useEffect } from "react"
import Link from "next/link"

function getRandomDelay(): number {
	return Math.floor(Math.random() * 1)
}

function getRandomAnimation(): number {
	return Math.floor(Math.random() * 10)
}

function getRandomWidth(): string {
	// Return a random width between 500px and 3000px
	return `${Math.floor(Math.random() * 2500 + 500)}px`
}

function getRandomLocation(): string {
	// Return a random percentage using a Gaussian distribution, making the center more likely
	return `${Math.floor((gaussianRandom() / 2) * 100)}%`
}

function gaussianRandom(): number {
	let rand = 0

	for (let i = 0; i < 6; i += 1) {
		rand += Math.random()
	}

	return rand / 6
}

export default function NotFound() {
	useEffect(() => {
		// Define a function to apply random animation delays and variations to the SVG elements
		function applyRandomAnimations() {
			const svgs = document.querySelectorAll("svg")
			svgs.forEach((svg) => {
				svg.classList.add(`relaxing-animation-${getRandomAnimation()}`)
				svg.style.animationDelay = `${getRandomDelay()}s`
				svg.style.width = getRandomWidth()
				svg.style.top = getRandomLocation()
				svg.style.left = getRandomLocation()
				svg.style.position = "absolute" // Required for top and left to work
			})
		}

		// Call the function initially
		applyRandomAnimations()

		// Call the function every 25 seconds
		const intervalId = setInterval(() => {
			applyRandomAnimations()
		}, 25000)

		// Clean up the interval when the component unmounts
		return () => clearInterval(intervalId)
	}, [])

	return (
		<div className="flex min-h-[100vh] flex-col items-center justify-center">
			{/* <video autoPlay loop muted playsInline style={{ width: 150 }}>
				<source src="/logo-spin.webm" type="video/webm" />
			</video> */}
			<div>
				<div className="flex items-center">
					<h1 className="mr-5 border-r border-white/30 p-1 pr-5 text-2xl font-semibold">
						404
					</h1>
					<h2 className="text-base font-normal leading-7">
						This page could not be found.
					</h2>
				</div>
			</div>
			<Link href="/">Go to dashboard</Link>
			<div className="absolute z-[-1] h-full w-full overflow-hidden">
				<div className="absolute z-[1] h-full w-full bg-black/25 backdrop-blur-[200px]" />
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="3484"
					height="1361"
					viewBox="0 0 3484 1361"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M1689 254.437C1483.5 -100.563 710.5 60.9367 0 503.437C62 752.437 1502 141.937 1196.5 503.437C891 864.937 1813.5 1406.94 1963 1357.44C2112.5 1307.94 1570.5 976.937 2119 789.937C2667.5 602.937 3003.5 1051.94 3059.5 789.937C3115.5 527.937 2268.5 453.937 2748 254.437C3227.5 54.9365 3309 1126.44 3458.5 789.937C3608 453.437 3066 73.4367 2661 4.93666C2256 -63.5633 1894.5 609.437 1689 254.437Z"
						fill="#151122"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1304"
					height="929"
					viewBox="0 0 1304 929"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M298.297 772.5C-393.203 604 285.797 436 646.797 0C736.13 0 898.597 23.7 833.797 118.5C752.797 237 559.797 318 528.797 592C497.797 866 765.297 411.5 1170.3 723C1575.3 1034.5 989.797 941 298.297 772.5Z"
						fill="#6366F1"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="100"
					height="933"
					viewBox="0 0 1909 933"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M672.5 921.5C-299.5 872 -131.5 703 629 148.5C1019.33 9.33337 1818.7 -155.6 1893.5 298C1987 865 1644.5 971 672.5 921.5Z"
						fill="#E35C25"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="500"
					height="933"
					viewBox="0 0 1909 933"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M672.5 921.5C-299.5 872 -131.5 703 629 148.5C1019.33 9.33337 1818.7 -155.6 1893.5 298C1987 865 1644.5 971 672.5 921.5Z"
						fill="#E35C25"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1632"
					height="537"
					viewBox="0 0 1632 537"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M953.34 363.847C192.84 918.347 -492.66 -47.6519 479.34 1.84814C581.507 7.05111 675.756 21.0162 762.514 41.1854C994.704 -33.4175 1567.35 49.4135 1613.11 326.924C1696.78 834.326 1501.15 212.902 762.514 41.1854C615.181 88.5234 604.927 199.249 953.34 363.847Z"
						fill="#3C00FF"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1000"
					height="500"
					viewBox="0 0 3484 1361"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M1689 254.437C1483.5 -100.563 710.5 60.9367 0 503.437C62 752.437 1502 141.937 1196.5 503.437C891 864.937 1813.5 1406.94 1963 1357.44C2112.5 1307.94 1570.5 976.937 2119 789.937C2667.5 602.937 3003.5 1051.94 3059.5 789.937C3115.5 527.937 2268.5 453.937 2748 254.437C3227.5 54.9365 3309 1126.44 3458.5 789.937C3608 453.437 3066 73.4367 2661 4.93666C2256 -63.5633 1894.5 609.437 1689 254.437Z"
						fill="#151122"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1000"
					height="5300"
					viewBox="0 0 3484 1361"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M1689 254.437C1483.5 -100.563 710.5 60.9367 0 503.437C62 752.437 1502 141.937 1196.5 503.437C891 864.937 1813.5 1406.94 1963 1357.44C2112.5 1307.94 1570.5 976.937 2119 789.937C2667.5 602.937 3003.5 1051.94 3059.5 789.937C3115.5 527.937 2268.5 453.937 2748 254.437C3227.5 54.9365 3309 1126.44 3458.5 789.937C3608 453.437 3066 73.4367 2661 4.93666C2256 -63.5633 1894.5 609.437 1689 254.437Z"
						fill="#151122"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1000"
					height="5300"
					viewBox="0 0 3484 1361"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M1689 254.437C1483.5 -100.563 710.5 60.9367 0 503.437C62 752.437 1502 141.937 1196.5 503.437C891 864.937 1813.5 1406.94 1963 1357.44C2112.5 1307.94 1570.5 976.937 2119 789.937C2667.5 602.937 3003.5 1051.94 3059.5 789.937C3115.5 527.937 2268.5 453.937 2748 254.437C3227.5 54.9365 3309 1126.44 3458.5 789.937C3608 453.437 3066 73.4367 2661 4.93666C2256 -63.5633 1894.5 609.437 1689 254.437Z"
						fill="#151122"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1000"
					height="5300"
					viewBox="0 0 3484 1361"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M1689 254.437C1483.5 -100.563 710.5 60.9367 0 503.437C62 752.437 1502 141.937 1196.5 503.437C891 864.937 1813.5 1406.94 1963 1357.44C2112.5 1307.94 1570.5 976.937 2119 789.937C2667.5 602.937 3003.5 1051.94 3059.5 789.937C3115.5 527.937 2268.5 453.937 2748 254.437C3227.5 54.9365 3309 1126.44 3458.5 789.937C3608 453.437 3066 73.4367 2661 4.93666C2256 -63.5633 1894.5 609.437 1689 254.437Z"
						fill="#151122"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="3484"
					height="1361"
					viewBox="0 0 3484 1361"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M1689 254.437C1483.5 -100.563 710.5 60.9367 0 503.437C62 752.437 1502 141.937 1196.5 503.437C891 864.937 1813.5 1406.94 1963 1357.44C2112.5 1307.94 1570.5 976.937 2119 789.937C2667.5 602.937 3003.5 1051.94 3059.5 789.937C3115.5 527.937 2268.5 453.937 2748 254.437C3227.5 54.9365 3309 1126.44 3458.5 789.937C3608 453.437 3066 73.4367 2661 4.93666C2256 -63.5633 1894.5 609.437 1689 254.437Z"
						fill="#151122"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1304"
					height="929"
					viewBox="0 0 1304 929"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M298.297 772.5C-393.203 604 285.797 436 646.797 0C736.13 0 898.597 23.7 833.797 118.5C752.797 237 559.797 318 528.797 592C497.797 866 765.297 411.5 1170.3 723C1575.3 1034.5 989.797 941 298.297 772.5Z"
						fill="#6366F1"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="100"
					height="933"
					viewBox="0 0 1909 933"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M672.5 921.5C-299.5 872 -131.5 703 629 148.5C1019.33 9.33337 1818.7 -155.6 1893.5 298C1987 865 1644.5 971 672.5 921.5Z"
						fill="#E35C25"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="500"
					height="933"
					viewBox="0 0 1909 933"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M672.5 921.5C-299.5 872 -131.5 703 629 148.5C1019.33 9.33337 1818.7 -155.6 1893.5 298C1987 865 1644.5 971 672.5 921.5Z"
						fill="#E35C25"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1632"
					height="537"
					viewBox="0 0 1632 537"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M953.34 363.847C192.84 918.347 -492.66 -47.6519 479.34 1.84814C581.507 7.05111 675.756 21.0162 762.514 41.1854C994.704 -33.4175 1567.35 49.4135 1613.11 326.924C1696.78 834.326 1501.15 212.902 762.514 41.1854C615.181 88.5234 604.927 199.249 953.34 363.847Z"
						fill="#3C00FF"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1000"
					height="500"
					viewBox="0 0 3484 1361"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M1689 254.437C1483.5 -100.563 710.5 60.9367 0 503.437C62 752.437 1502 141.937 1196.5 503.437C891 864.937 1813.5 1406.94 1963 1357.44C2112.5 1307.94 1570.5 976.937 2119 789.937C2667.5 602.937 3003.5 1051.94 3059.5 789.937C3115.5 527.937 2268.5 453.937 2748 254.437C3227.5 54.9365 3309 1126.44 3458.5 789.937C3608 453.437 3066 73.4367 2661 4.93666C2256 -63.5633 1894.5 609.437 1689 254.437Z"
						fill="#151122"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1000"
					height="5300"
					viewBox="0 0 3484 1361"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M1689 254.437C1483.5 -100.563 710.5 60.9367 0 503.437C62 752.437 1502 141.937 1196.5 503.437C891 864.937 1813.5 1406.94 1963 1357.44C2112.5 1307.94 1570.5 976.937 2119 789.937C2667.5 602.937 3003.5 1051.94 3059.5 789.937C3115.5 527.937 2268.5 453.937 2748 254.437C3227.5 54.9365 3309 1126.44 3458.5 789.937C3608 453.437 3066 73.4367 2661 4.93666C2256 -63.5633 1894.5 609.437 1689 254.437Z"
						fill="#151122"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1000"
					height="5300"
					viewBox="0 0 3484 1361"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M1689 254.437C1483.5 -100.563 710.5 60.9367 0 503.437C62 752.437 1502 141.937 1196.5 503.437C891 864.937 1813.5 1406.94 1963 1357.44C2112.5 1307.94 1570.5 976.937 2119 789.937C2667.5 602.937 3003.5 1051.94 3059.5 789.937C3115.5 527.937 2268.5 453.937 2748 254.437C3227.5 54.9365 3309 1126.44 3458.5 789.937C3608 453.437 3066 73.4367 2661 4.93666C2256 -63.5633 1894.5 609.437 1689 254.437Z"
						fill="#151122"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					// width="1000"
					height="5300"
					viewBox="0 0 3484 1361"
					fill="none"
					className="opacity-0"
				>
					<path
						d="M1689 254.437C1483.5 -100.563 710.5 60.9367 0 503.437C62 752.437 1502 141.937 1196.5 503.437C891 864.937 1813.5 1406.94 1963 1357.44C2112.5 1307.94 1570.5 976.937 2119 789.937C2667.5 602.937 3003.5 1051.94 3059.5 789.937C3115.5 527.937 2268.5 453.937 2748 254.437C3227.5 54.9365 3309 1126.44 3458.5 789.937C3608 453.437 3066 73.4367 2661 4.93666C2256 -63.5633 1894.5 609.437 1689 254.437Z"
						fill="#151122"
					/>
				</svg>
			</div>
		</div>
	)
}
