import { undoStackAction } from "./undoStackReducer"
import { TPackage, packageSchema } from "@/components/DashboardGrid"
import React, { createContext, useContext } from "react"
import { z } from "zod"
import { PackageAction } from "../packageContext/packageReducer"

export type TIndexedPackage = TPackage & { index: number }

export const undo = (
	dispatchUndoStack: React.Dispatch<undoStackAction>,
	dispatchPackages: React.Dispatch<PackageAction>
) => {
	// get and verify undoStack from localStorage
	const undoStackJson = localStorage.getItem("undoStack")
	if (!undoStackJson) return
	const undoStack = JSON.parse(undoStackJson) as TIndexedPackage[]
	const indexedPackageSchema = packageSchema.extend({
		index: z.number(),
	})
	const indexedPackageSchemaArray = z.array(indexedPackageSchema)
	if (!indexedPackageSchemaArray.safeParse(undoStack).success) return

	// do the undo
	if (undoStack.length === 0) return
	const pop = undoStack[undoStack.length - 1]
	dispatchUndoStack({ type: "pop" })
	if (pop) {
		dispatchPackages({ type: "put", pkg: pop })
	}
}

export type undoStackContextProps = {
	undoStack: TIndexedPackage[]
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
