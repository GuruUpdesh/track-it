import React, { createContext, useContext } from "react"

export type SearchContextProps = {
	search: string
	setSearch: React.Dispatch<React.SetStateAction<string>>
}

export const SearchContext = createContext<SearchContextProps>({
	search: "",
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setSearch: () => {},
})

export const useSearchContext = (): SearchContextProps => {
	const context = useContext(SearchContext)

	if (context === null) {
		throw new Error(
			"useSearchContext must be used within a SearchContextProvider"
		)
	}

	return context
}
