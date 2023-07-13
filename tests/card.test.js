import "@testing-library/jest-dom"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import Card from "../components/Card/Card" // replace with your actual path to the Card component

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
			/>
		)
	})

	it("renders without crashing", () => {
		render(card)
	})

	it("allows input of name", () => {
		render(card)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name" } })
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "updateName",
			id: "1",
			name: "Test Name",
		})
	})

	it("saves name on blur", () => {
		render(card)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name" } })
		fireEvent.blur(input)
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "updateName",
			id: "1",
			name: "Test Name",
		})
	})

	it("saves name on Enter key press", () => {
		render(card)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name" } })
		fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "updateName",
			id: "1",
			name: "Test Name",
		})
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
			/>
		)
		render(card)

		const name = screen.getByText("Test Name")
		fireEvent.click(name)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name Edited" } })
		fireEvent.blur(input)
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "updateName",
			id: "1",
			name: "Test Name Edited",
		})
	})

	describe("Couriers", () => {
		// test each courier
		const couriers = ["ups", "fedex", "dhl", "usps", "ontrac"]
		couriers.forEach((courier) => {
			it(`allows selection of ${courier}`, () => {
				card = (
					<Card
						pkg={{
							id: "1",
							name: "",
							courier: courier,
							trackingNumber: "",
						}}
						dispatchPackages={mockDispatch}
					/>
				)
				render(card)
			})
		})

		// test invalid couriers
		const invalidCouriers = [
			"",
			"invalid",
			"123",
			"1234567890",
			null,
			undefined,
		]
		invalidCouriers.forEach((courier) => {
			it(`does not allow selection of ${courier}`, () => {
				jest.spyOn(console, "error")
				console.error.mockImplementation(() => {})

				card = (
					<Card
						pkg={{
							id: "1",
							name: "",
							courier: courier,
							trackingNumber: "",
						}}
						dispatchPackages={mockDispatch}
					/>
				)
				render(card)

				// Verify that console.error was called
				expect(console.error).toHaveBeenCalled()

				// Verify the courier message
				expect(screen.getByText("Invalid Courier")).toBeInTheDocument()

				console.error.mockRestore()
			})
		})
	})
})
