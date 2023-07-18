import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import axios from "axios"
import MockAdapter from "axios-mock-adapter"

import Card from "../components/Card/Card"

describe("Card Component", () => {
	let mockDispatch
	let card

	beforeEach(() => {
		mockDispatch = jest.fn()

		card = (
			<Card
				pkg={{
					id: "1",
					name: "",
					courier: "ups",
					trackingNumber: "",
				}}
				dispatchPackages={mockDispatch}
				inSearchResults={true}
			/>
		)

		const mock = new MockAdapter(axios)
		mock.onGet("/api/package").reply(500, {})
		jest.spyOn(console, "error").mockImplementation(() => {})
		jest.spyOn(console, "log").mockImplementation(() => {})
	})

	it("renders without crashing", () => {
		render(card)
	})

	it("allows input of name", () => {
		render(card)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name" } })
		fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
		waitFor(() =>
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "updateName",
				id: "1",
				name: "Test Name",
			})
		)
	})

	it("saves name on blur", () => {
		render(card)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name" } })
		fireEvent.blur(input)
		waitFor(() =>
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "updateName",
				id: "1",
				name: "Test Name",
			})
		)
	})

	it("saves name on Enter key press", () => {
		render(card)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name" } })
		fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
		waitFor(() =>
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "updateName",
				id: "1",
				name: "Test Name",
			})
		)
	})

	it("edit of name", async () => {
		card = (
			<Card
				pkg={{
					id: "1",
					name: "Test Name",
					courier: "ups",
					trackingNumber: "",
				}}
				dispatchPackages={mockDispatch}
				inSearchResults={true}
			/>
		)
		render(card)

		const name = screen.getByText("Test Name")
		fireEvent.click(name)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name Edited" } })
		fireEvent.blur(input)
		waitFor(() =>
			expect(mockDispatch).toHaveBeenCalledWith({
				type: "updateName",
				id: "1",
				name: "Test Name Edited",
			})
		)
	})
})
