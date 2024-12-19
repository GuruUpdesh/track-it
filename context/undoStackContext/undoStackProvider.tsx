"use client"

import undoStackReducer from "./undoStackReducer"
import { UndoStackContext } from "./useUndoStackContext"
import useLocalStorage from "@/hooks/useLocalStorageHook"
import React from "react"

type UndoStackProviderProps = {
	children: React.ReactNode
}

export function UndoStackContextProvider({ children }: UndoStackProviderProps) {
	const [undoStack, dispatchUndoStack] = useLocalStorage(
		"undoStack",
		[],
		undoStackReducer
	)

	return (
		<UndoStackContext.Provider value={{ undoStack, dispatchUndoStack }}>
			{children}
		</UndoStackContext.Provider>
	)
}
