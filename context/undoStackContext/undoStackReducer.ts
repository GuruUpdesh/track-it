import { TIndexedPackage } from "./useUndoStackContext"

export type undoStackAction =
	| { type: "push"; new: TIndexedPackage }
	| { type: "pop" }
	| { type: "clear" }

function undoStackReducer(
	state: TIndexedPackage[],
	action: undoStackAction
): TIndexedPackage[] {
	switch (action.type) {
		case "push":
			return [...state, action.new]
		case "pop":
			return state.slice(0, state.length - 1)
		case "clear":
			return []
		default:
			return state
	}
}

export default undoStackReducer
