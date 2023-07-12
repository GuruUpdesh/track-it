import { useEffect, useReducer, useRef } from "react"

const INIT_ACTION_TYPE = Symbol("useLocalStorage/init")

type LocalStorageAction<T, A> =
	| { type: typeof INIT_ACTION_TYPE; payload: T }
	| A

function useLocalStorage<T, A extends { type: string }>(
	key: string,
	initialValue: T,
	reducer: (state: T, action: A) => T
): [T, React.Dispatch<LocalStorageAction<T, A>>] {
	const init = (key: string) => {
		try {
			const item = localStorage.getItem(key)
			console.log("useLocalStorage > get item", item)
			if (item && item !== "undefined") {
				return JSON.parse(item) as T
			}

			localStorage.setItem(key, JSON.stringify(initialValue))
			return initialValue
		} catch (error) {
			console.error(error)
			return initialValue
		}
	}

	const localStorageReducer = (
		state: T,
		action: LocalStorageAction<T, A>
	) => {
		if (action.type === INIT_ACTION_TYPE) {
			return action.payload
		} else {
			return reducer(state, action as A)
		}
	}

	const [state, dispatch] = useReducer(localStorageReducer, initialValue)

	const isFirstRender = useRef(true)

	useEffect(() => {
		console.log("useLocalStorage > useEffect > init", key)
		dispatch({ type: INIT_ACTION_TYPE, payload: init(key) })
	}, [key])

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
		} else {
			console.log("useLocalStorage > useEffect > state", state)
			localStorage.setItem(key, JSON.stringify(state))
		}
	}, [key, state])

	return [state, dispatch]
}

export default useLocalStorage
