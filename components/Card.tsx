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
		<div className="border border-indigo-400 bg-[#110F1B] max-w-[350px]">
			<div className="flex justify-between border-b border-indigo-400 p-2">
				<div className="flex gap-2">
					<div className="flex items-center justify-center border border-indigo-400 rounded-full aspect-square w-[50px]">
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
								className="text-lg bg-transparent text-yellow-50 font-semibold tracking-tighter outline-none"
							/>
						) : (
							<h3
								onDoubleClick={handleEditName}
								className="text-yellow-50 text-lg font-semibold tracking-tighter overflow-hidden w-[20ch] whitespace-nowrap text-left"
								style={{
									WebkitMaskImage:
										"linear-gradient(to right, black 90%, transparent)",
								}}
							>
								{name}
							</h3>
						)}
						<a
							className="underline-link flex gap-1 items-center text-xs text-indigo-300"
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
							className="p-2 text-yellow-50 rounded-full hover:bg-yellow-50/10 focus:bg-yellow-50/10 aspect-square cursor-pointer outline-none"
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
							<DropdownMenu.Item className="bg-red-500/25 text-red-400 DropdownMenu-item">
								Delete
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</div>
			<div className="min-w-[350px]">
				<p>map</p>
			</div>
		</div>
	)
}

export default Card
