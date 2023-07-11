import { render, screen, act } from "@testing-library/react"
import React from "react"
import useTextOverflow from "../hooks/useTextOverflow"

function MockComponent() {
	const [textRef, isOverflowed] = useTextOverflow()

	return (
		<div data-testid="mock-div" ref={textRef}>
			{isOverflowed ? "Overflowed" : "Not overflowed"}
		</div>
	)
}

describe("useTextOverflow", () => {
	it("returns true when text overflows", () => {
		const { rerender } = render(<MockComponent />)
		const mockDiv = screen.getByTestId("mock-div")

		Object.defineProperties(mockDiv, {
			offsetWidth: { get: () => 50 },
			scrollWidth: { get: () => 100 },
		})

		act(() => {
			window.dispatchEvent(new Event("resize"))
		})

		rerender(<MockComponent />)

		expect(mockDiv.textContent).toEqual("Overflowed")
	})

	it("returns false when text does not overflow", () => {
		const { rerender } = render(<MockComponent />)
		const mockDiv = screen.getByTestId("mock-div")

		Object.defineProperties(mockDiv, {
			offsetWidth: { get: () => 100 },
			scrollWidth: { get: () => 50 },
		})

		act(() => {
			window.dispatchEvent(new Event("resize"))
		})

		rerender(<MockComponent />)

		expect(mockDiv.textContent).toEqual("Not overflowed")
	})
})
