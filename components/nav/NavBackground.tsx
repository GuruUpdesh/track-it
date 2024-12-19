"use client"

import React, { useEffect, useRef } from "react"

const NavBackground = () => {
	const ref = useRef<HTMLDivElement>(null)
	useEffect(() => {
		function handleScroll() {
			if (!ref.current) return
			if (window.scrollY > 40) {
				ref.current.style.borderBottom =
					"1px solid rgba(255, 255, 255, 0.1)"
			} else {
				ref.current.style.borderBottom = "0px solid transparent"
			}
		}

		window.addEventListener("scroll", handleScroll)

		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])
	return (
		<div
			ref={ref}
			className="fixed left-0 top-0 z-30 h-14 w-full bg-black/50 backdrop-blur-md transition-all md:h-16"
		/>
	)
}

export default NavBackground
