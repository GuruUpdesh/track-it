"use client"

import "./nav.css"
import React, { useState } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { MdClose } from "react-icons/md"

const SearchInput = () => {
	const [searchString, setSearchString] = useState("")
	return (
		<div className="flex flex-item relative items-center px-4 border outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-indigo-400 border-indigo-400/25 bg-[#110F1B] rounded-full min-w-[5rem]">
			<AiOutlineSearch className="mr-1" />
			<input
				type="text"
				className="py-2 bg-transparent outline-none min-w-0 text-xs sm:text-sm md:text-md"
				placeholder="Search"
				value={searchString}
				onChange={(e) => setSearchString(e.target.value)}
			/>
			{searchString && (
				<button
					className="absolute right-4 bg-[#110F1B] rounded-full p-1"
					onClick={() => setSearchString("")}
				>
					<MdClose />
				</button>
			)}
		</div>
	)
}

export default SearchInput
