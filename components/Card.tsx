"use client"

import React, { useEffect, useState } from "react"
import { MdMoreVert, MdOutlineExplore } from "react-icons/md" // todo transition to radix-ui/react-icons
import { BsChevronRight } from "react-icons/bs"
import Image from "next/image"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import "./menu.css"

const Card = () => {
	const [name, setName] = useState("")
	const [editName, setEditName] = useState(false)

	useEffect(() => {
		if (name === "") {
			setEditName(true)
		}
	}, [name])

	function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		setName(e.target.value)
	}

	function handleSaveName() {
		if (name === "") {
			return
		}
		setEditName(false)
	}

	function handleEditName() {
		setEditName(true)
	}

	return (
		<div className="max-w-[350px] border border-indigo-400/25 border-b-indigo-400/25 bg-[#110F1B] after:block after:h-[1px] after:w-[29%] after:bg-green-400">
			<div className="flex justify-between p-2">
				<div className="flex min-w-fit gap-2">
					<div className="flex aspect-square w-[50px] items-center justify-center rounded-full border border-indigo-400">
						<Image
							src="/package.svg"
							alt="Package Box"
							width={27}
							height={27}
							priority
						/>
					</div>
					<div className="flex flex-col items-start">
						{editName ? (
							<input
								autoFocus
								placeholder="Type name..."
								value={name}
								onChange={handleNameChange}
								onBlur={handleSaveName}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										handleSaveName()
									}
								}}
								className="bg-transparent text-lg font-semibold tracking-tighter text-yellow-50 outline-none"
							/>
						) : (
							<h3
								onDoubleClick={handleEditName}
								className="w-[20ch] overflow-hidden whitespace-nowrap text-left text-lg font-semibold tracking-tighter text-yellow-50"
								style={{
									WebkitMaskImage:
										"linear-gradient(to right, black 90%, transparent)",
								}}
							>
								{name}
							</h3>
						)}
						<a
							className="underline-link flex items-center gap-1 text-xs text-indigo-300"
							href="https://www.shipmentracker.com/"
							target="_blank"
						>
							<MdOutlineExplore />
							<p className="uppercase">Courier</p>
						</a>
					</div>
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<button
							aria-label="Package Controls"
							className="aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10 focus:bg-yellow-50/10"
						>
							<MdMoreVert />
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content className="DropdownMenu-content">
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger className="DropdownMenu-item">
									Update
									<div className="float-right">
										<BsChevronRight />
									</div>
								</DropdownMenu.SubTrigger>
								<DropdownMenu.Portal>
									<DropdownMenu.SubContent
										className="DropdownMenu-content"
										sideOffset={5}
										alignOffset={-5}
									>
										<DropdownMenu.Item className="DropdownMenu-item">
											Change Name
										</DropdownMenu.Item>
										<DropdownMenu.Item className="DropdownMenu-item">
											Update Tracking Number
										</DropdownMenu.Item>
									</DropdownMenu.SubContent>
								</DropdownMenu.Portal>
							</DropdownMenu.Sub>
							<DropdownMenu.Item className="DropdownMenu-item bg-red-500/25 text-red-400">
								Delete
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</div>
		</div>
	)
}

export default Card
