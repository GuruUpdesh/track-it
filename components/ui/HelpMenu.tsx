"use client"

import React from "react"
import { BiQuestionMark, BiCommand } from "react-icons/bi"
import Menu, { TMenuItem } from "./menu/Menu"
import { CgShortcut } from "react-icons/cg"
import { BsGithub } from "react-icons/bs"
import { MdEmail } from "react-icons/md"
import { toast } from "react-hot-toast"

const HelpMenu = () => {
	const [open, setOpen] = React.useState(false)

	function getShortcut(shortcut: string) {
		let isMac = false
		if (typeof window !== "undefined") {
			isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
		}

		if (isMac) {
			const keys = shortcut.split(" + ")
			const keyElements = keys.map((key, index) => {
				const isLast = index === keys.length - 1
				if (key.toLowerCase() === "ctrl") {
					return (
						<>
							<BiCommand key={index} />
							{isLast ? "" : " + "}
						</>
					)
				} else {
					return (
						<>
							<p key={index}>{key}</p>
							{isLast ? "" : " + "}
						</>
					)
				}
			})

			return (
				<p className="absolute right-4 flex items-center gap-1 text-xs text-white/50">
					{keyElements}
				</p>
			)
		} else {
			return (
				<p className="absolute right-4 text-xs text-white/50">
					{shortcut}
				</p>
			)
		}
	}

	const menu: TMenuItem[] = [
		{
			label: "GitHub",
			icon: <BsGithub className="absolute left-4" />,
			onClick: () => {
				window.open("https://github.com/GuruUpdesh/track-it")
			},
		},
		{
			label: "Email",
			icon: <MdEmail className="absolute left-4" />,
			onClick: () => {
				navigator.clipboard.writeText(
					"guruupdeshsingh+trackit@gmail.com"
				)
				toast.success("Email copied to clipboard")
			},
			separator: true,
		},
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
			<button className="fixed bottom-2 right-2 z-40 hidden rounded-full border border-indigo-400/50 bg-black p-2 text-xl text-indigo-100 hover:border-indigo-400/75 hover:text-white hover:shadow-sm hover:shadow-indigo-700 sm:bottom-10 sm:right-10 md:block">
				<BiQuestionMark />
			</button>
		</Menu>
	)
}

export default HelpMenu
