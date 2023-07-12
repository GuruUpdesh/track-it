import { useCallback, useEffect, useState } from "react"

function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, (value: T) => void] {
	const init = (key: string) => {
		try {
			const item = localStorage.getItem(key)
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

	const [state, setState] = useState<T>(initialValue)

	useEffect(() => {
		setState(init(key))
	}, [key])

	const setValue = useCallback(
		(value: T) => {
			try {
				setState(value)
				localStorage.setItem(key, JSON.stringify(value))
			} catch (error) {
				console.error(error)
			}
		},
		[key]
	)

	return [state, setValue]
}

export default useLocalStorage
