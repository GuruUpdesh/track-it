"use client"

import { useSearchContext } from "@/context/searchContext/useSearchContext"
import "./nav.css"
import React, { useEffect, useRef } from "react"
import { AiOutlineSearch } from "react-icons/ai"
import { MdClose } from "react-icons/md"

const SearchInput = () => {
	const { search, setSearch } = useSearchContext()
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "/") {
				e.preventDefault()
				if (inputRef.current) {
					inputRef.current.focus()
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
		}
	}, [])

	return (
		<div className="flex-item relative flex min-w-[5rem] items-center rounded-full border border-indigo-400/25 bg-[#110F1B] px-4 outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-indigo-400">
			<AiOutlineSearch className="mr-1" />
			<input
				ref={inputRef}
				type="text"
				className="md:text-md min-w-0 bg-transparent py-2 text-xs outline-none"
				placeholder="Search"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			{search && (
				<button
					className="absolute right-4 rounded-full bg-[#110F1B] p-1"
					onClick={() => setSearch("")}
				>
					<MdClose />
				</button>
			)}
		</div>
	)
}

export default SearchInput
