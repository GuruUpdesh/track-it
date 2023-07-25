import React, { createContext, useContext } from "react"

export type SelectContextProps = {
	enabled: boolean
	setEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

export const SelectContext = createContext<SelectContextProps>({
	enabled: true,
	setEnabled: () => {},
})

export const useSelectContext = (): SelectContextProps => {
	const context = useContext(SelectContext)

	if (context === null) {
		throw new Error(
			"useSelectContext must be used within a SelectContextProvider"
		)
	}

	return context
}
