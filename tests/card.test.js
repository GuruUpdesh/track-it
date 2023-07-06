import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import Card from "../components/Card" // replace with your actual path to the Card component

describe("Card Component", () => {
	it("renders without crashing", () => {
		render(<Card />)
	})

	it("allows input of name", () => {
		render(<Card />)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name" } })
		expect(input.value).toBe("Test Name")
	})

	it("saves name on blur", () => {
		render(<Card />)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name" } })
		fireEvent.blur(input)
		expect(screen.getByText("Test Name")).toBeInTheDocument()
	})

	it("saves name on Enter key press", () => {
		render(<Card />)
		const input = screen.getByPlaceholderText("Type name...")
		fireEvent.change(input, { target: { value: "Test Name" } })
		fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
		expect(screen.getByText("Test Name")).toBeInTheDocument()
	})
})
