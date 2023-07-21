import { undoStackAction } from "./undoStackReducer"
import { TPackage } from "@/components/Packages"
import React, { createContext, useContext } from "react"

export type undoStackContextProps = {
	undoStack: TPackage[]
	dispatchUndoStack: React.Dispatch<undoStackAction>
}

export const UndoStackContext = createContext<undoStackContextProps>({
	undoStack: [],
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	dispatchUndoStack: () => {},
})

export const useUndoStackContext = (): undoStackContextProps => {
	const context = useContext(UndoStackContext)

	if (context === null) {
		throw new Error(
			"useUndoStackContext must be used within a undoStackContextProvider"
		)
	}

	return context
}
