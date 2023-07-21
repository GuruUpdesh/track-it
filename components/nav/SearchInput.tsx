"use client"

import "./nav.css"
import React, { useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { MdClose } from "react-icons/md"

const SearchInput = () => {
	const [searchString, setSearchString] = useState("")
	return (
		<div className="flex-item relative flex min-w-[5rem] items-center rounded-full border border-indigo-400/25 bg-[#110F1B] px-4 outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-indigo-400">
			<AiOutlineSearch className="mr-1" />
			<input
				type="text"
				className="md:text-md min-w-0 bg-transparent py-2 text-xs outline-none sm:text-sm"
				placeholder="Search"
				value={searchString}
				onChange={(e) => setSearchString(e.target.value)}
			/>
			{searchString && (
				<button
					className="absolute right-4 rounded-full bg-[#110F1B] p-1"
					onClick={() => setSearchString("")}
				>
					<MdClose />
				</button>
			)}
		</div>
	)
}

export default SearchInput
