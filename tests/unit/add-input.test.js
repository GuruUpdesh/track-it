import AddInput from "@/components/nav/AddInput"
import { PackageContext } from "@/context/packageContext/usePackageContext"
import { getCourierFromTrackingNumber } from "@/utils/courier"
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"

jest.mock("../../utils/courier", () => ({
	getCourierFromTrackingNumber: jest.fn(),
}))

describe("AddInput Component", () => {
	let mockDispatch

	beforeEach(() => {
		mockDispatch = jest.fn()
		getCourierFromTrackingNumber.mockReturnValue(null)
	})

	it("renders without crashing", () => {
		render(
			<PackageContext.Provider value={{ dispatchPackages: mockDispatch }}>
				<AddInput />
			</PackageContext.Provider>
		)
	})

	it("doesn't allow form submission with invalid tracking number", () => {
		render(
			<PackageContext.Provider value={{ dispatchPackages: mockDispatch }}>
				<AddInput />
			</PackageContext.Provider>
		)
		const input = screen.getByPlaceholderText("Type tracking number...")
		const button = screen.getByTestId("add button")
		fireEvent.change(input, { target: { value: "INVALID_NUMBER" } })
		fireEvent.click(button)
		expect(mockDispatch).not.toHaveBeenCalled()
	})

	it("allows form submission with valid tracking number", async () => {
		getCourierFromTrackingNumber.mockReturnValue({
			code: "courier1",
			name: "Courier 1",
			tracking_url: "https://courier1.com/track/",
			patterns: [],
		})
		render(
			<PackageContext.Provider value={{ dispatchPackages: mockDispatch }}>
				<AddInput />
			</PackageContext.Provider>
		)
		const input = screen.getByPlaceholderText("Type tracking number...")
		const button = screen.getByTestId("add button")
		fireEvent.change(input, { target: { value: "VALID_NUMBER" } })
		fireEvent.click(button)
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "add",
			new: {
				id: expect.any(Number),
				name: "",
				trackingNumber: "VALID_NUMBER",
				courier: "courier1",
			},
		})
	})

	it("handles error state with invalid tracking number", async () => {
		getCourierFromTrackingNumber.mockReturnValue(null)
		render(
			<PackageContext.Provider value={{ dispatchPackages: mockDispatch }}>
				<AddInput />
			</PackageContext.Provider>
		)
		const input = screen.getByPlaceholderText("Type tracking number...")
		fireEvent.change(input, { target: { value: "INVALID_NUMBER" } })
		expect(input).toHaveAttribute("aria-invalid", "true")
	})

	it("handles valid state with valid tracking number", async () => {
		getCourierFromTrackingNumber.mockReturnValue(["Courier1"])
		render(
			<PackageContext.Provider value={{ dispatchPackages: mockDispatch }}>
				<AddInput />
			</PackageContext.Provider>
		)
		const input = screen.getByPlaceholderText("Type tracking number...")
		fireEvent.change(input, { target: { value: "VALID_NUMBER" } })
		expect(input).toHaveAttribute("aria-invalid", "false")
	})
})
