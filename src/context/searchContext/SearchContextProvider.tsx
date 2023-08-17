"use client"
import React, { useState } from "react"
import { SearchContext } from "./useSearchContext"

export function SearchContextProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [search, setSearch] = useState("")

	return (
		<SearchContext.Provider value={{ search, setSearch }}>
			{children}
		</SearchContext.Provider>
	)
}
