import { useState, useEffect, useRef, RefObject, DependencyList } from "react"

function useTextOverflow<T extends HTMLElement>(
	dependencies: DependencyList = []
): [RefObject<T>, boolean] {
	const ref = useRef<T>(null)
	const [isOverflowed, setIsOverflowed] = useState(false)

	useEffect(() => {
		function checkOverflow() {
			const element = ref.current
			if (element) {
				setIsOverflowed(element.scrollWidth > element.offsetWidth)
			}
		}

		window.addEventListener("resize", checkOverflow)
		checkOverflow()

		return () => {
			window.removeEventListener("resize", checkOverflow)
		}
	}, [...dependencies])

	return [ref, isOverflowed]
}

export default useTextOverflow
