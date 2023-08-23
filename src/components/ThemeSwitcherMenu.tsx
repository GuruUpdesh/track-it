"use client"

import React from "react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

const ThemeSwitcherMenu = () => {
	const { theme, setTheme } = useTheme()
	return (
		<DropdownMenuItem
			onSelect={() => {
				setTheme(theme === "light" ? "dark" : "light")
			}}
		>
			{theme === "light" ? "Dark Mode" : "Light Mode"}
		</DropdownMenuItem>
	)
}

export default ThemeSwitcherMenu
