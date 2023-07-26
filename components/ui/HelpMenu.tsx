"use client"

import React from "react"
import { BiQuestionMark, BiCommand } from "react-icons/bi"
import Menu, { TMenuItem } from "./menu/Menu"
import { CgShortcut } from "react-icons/cg"

function getShortcut(shortcut: string) {
	let isMac

	if (navigator.userAgent) {
		isMac = navigator.userAgent.includes("Mac")
	} else {
		isMac = navigator.platform.toUpperCase().includes("MAC")
	}

	if (isMac) {
		const [key, action] = shortcut.split(" + ")

		return (
			<p className="absolute right-4 text-xs text-white/50">
				{key.toLowerCase() === "ctrl" ? <BiCommand /> : key} + {action}
			</p>
		)
	} else {
		return (
			<p className="absolute right-4 text-xs text-white/50">{shortcut}</p>
		)
	}
}

const HelpMenu = () => {
	const [open, setOpen] = React.useState(false)
	const menu: TMenuItem[] = [
		{
			label: "Shortcuts",
			icon: <CgShortcut className="absolute left-4" />,
			children: [
				{
					label: "Undo",
					icon: getShortcut("Ctrl + Z"),
					separator: true,
				},
				{
					label: "Search",
					icon: getShortcut("/"),
				},
				{
					label: "Add",
					icon: getShortcut("Ctrl + Shift + N"),
					separator: true,
				},
				{
					label: "Select All",
					icon: getShortcut("Ctrl + A"),
					separator: true,
				},
			],
		},
	]
	return (
		<Menu open={open} setOpen={setOpen} menu={menu}>
			<button className="fixed bottom-10 right-10 rounded-full border border-indigo-400/50 bg-black p-2 text-xl text-indigo-100 hover:border-indigo-400/75 hover:text-white hover:shadow-sm hover:shadow-indigo-700">
				<BiQuestionMark />
			</button>
		</Menu>
	)
}

export default HelpMenu
