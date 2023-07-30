import undoStackReducer from "@/context/undoStackContext/undoStackReducer"

describe("undoStackReducer", () => {
	let initialState

	beforeEach(() => {
		initialState = [
			{
				id: 1,
				index: 1,
				name: "Package 1",
				trackingNumber: "123",
				courier: "ups",
			},
			{
				id: 2,
				index: 2,
				name: "Package 2",
				trackingNumber: "456",
				courier: "usps",
			},
		]
	})

	it("should push new package correctly", () => {
		const newPackage = {
			id: 3,
			index: 3,
			name: "Package 3",
			trackingNumber: "789",
			courier: "fedex",
		}
		const action = { type: "push", new: newPackage }
		const state = undoStackReducer(initialState, action)
		expect(state.length).toEqual(3)
		expect(state[2]).toEqual(newPackage)
	})

	it("should handel stack limit of 10 packages", () => {
		const stateWithTenPackages = new Array(10)
			.fill(null)
			.map((_, index) => {
				return {
					id: index + 1,
					index: index + 1,
					name: `Package ${index + 1}`,
					trackingNumber: "123",
					courier: "ups",
				}
			})

		const newPackage = {
			id: 11,
			index: 11,
			name: "Package 11",
			trackingNumber: "456",
			courier: "usps",
		}
		const action = { type: "push", new: newPackage }
		const state = undoStackReducer(stateWithTenPackages, action)
		console.log(state)

		expect(state.length).toEqual(10)
		expect(state[0].id).toEqual(2)
		expect(state[9]).toEqual(newPackage)
	})

	it("should pop package correctly", () => {
		const action = { type: "pop" }
		const state = undoStackReducer(initialState, action)
		expect(state.length).toEqual(1)
		expect(state[0].id).toEqual(1)
	})

	it("should clear stack correctly", () => {
		const action = { type: "clear" }
		const state = undoStackReducer(initialState, action)
		expect(state.length).toEqual(0)
	})
})
