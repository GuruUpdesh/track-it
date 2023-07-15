import "@testing-library/jest-dom"
import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

jest.mock("../hooks/useLocalStorageHook", () => ({
	__esModule: true,
	default: jest.fn(),
}))

import useLocalStorage from "../hooks/useLocalStorageHook"
import Packages from "../components/Packages"

describe("Packages Grid", () => {
	beforeEach(() => {
		// clear any local storage data from previous tests
		localStorage.clear()

		// setup local storage data for the current test
		localStorage.setItem(
			"packages",
			JSON.stringify([
				{
					id: 1,
					name: "Test Package",
					trackingNumber: "1234567890",
					courier: "ups",
				},
			])
		)

		useLocalStorage.mockImplementation((key, defaultValue, reducer) => {
			const [state, setState] = React.useState(() => {
				const storedValue = localStorage.getItem(key)
				return storedValue ? JSON.parse(storedValue) : defaultValue
			})
			const dispatch = (action) => {
				setState((prevState) => reducer(prevState, action))
			}
			return [state, dispatch]
		})
	})

	it("renders without crashing", () => {
		render(<Packages />)
	})

	it("displays the packages from local storage", () => {
		render(<Packages />)
		expect(screen.getByText("Test Package")).toBeInTheDocument()
	})

	// Add more tests as needed
})
