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
			if (state.length >= 10) {
				return [...state.slice(1), action.new]
			} else {
				return [...state, action.new]
			}
		case "pop":
			return state.slice(0, state.length - 1)
		case "clear":
			return []
		default:
			return state
	}
}

export default undoStackReducer
