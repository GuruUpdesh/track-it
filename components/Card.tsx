"use client"

import React from "react"
import { MdMoreVert, MdOutlineExplore } from "react-icons/md" // todo transition to radix-ui/react-icons
import Image from "next/image"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

const Card = () => {
	return (
		<div className="border border-indigo-400 bg-[#110F1B]">
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
						<h3 className="text-yellow-50 text-lg font-semibold tracking-tighter">
							Name
						</h3>
						<a
							className="flex gap-1 items-center text-xs text-indigo-300 "
							href="https://www.shipmentracker.com/"
						>
							<MdOutlineExplore />
							<p className="uppercase">Courier</p>
						</a>
					</div>
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<button>
							<MdMoreVert />
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content>
							<DropdownMenu.Item>Change Name</DropdownMenu.Item>
							<DropdownMenu.Item>
								Update Tracking Number
							</DropdownMenu.Item>
							<DropdownMenu.Item>Delete</DropdownMenu.Item>
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
