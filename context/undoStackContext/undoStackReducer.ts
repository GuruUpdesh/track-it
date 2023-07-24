import { TPackage } from "@/components/DashboardGrid"

export type undoStackAction =
	| { type: "push"; new: TPackage }
	| { type: "pop" }
	| { type: "clear" }

function undoStackReducer(
	state: TPackage[],
	action: undoStackAction
): TPackage[] {
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
