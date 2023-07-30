import packageReducer from "@/context/packageContext/packageReducer"

describe("packageReducer", () => {
	let initialState

	beforeEach(() => {
		initialState = [
			{ id: 1, name: "Package 1", trackingNumber: "123", courier: "ups" },
			{
				id: 2,
				name: "Package 2",
				trackingNumber: "456",
				courier: "usps",
			},
		]
	})

	it("should set packages correctly", () => {
		const action = { type: "set", packages: [] }
		const state = packageReducer(initialState, action)
		expect(state).toEqual([])
	})

	it("should add package correctly", () => {
		const newPackage = {
			id: 3,
			name: "Package 3",
			trackingNumber: "789",
			courier: "fedex",
		}
		const action = { type: "add", new: newPackage }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(3)
		expect(state[2]).toEqual(newPackage)
	})

	it("should put package correctly", () => {
		const newPackage = {
			id: 3,
			name: "Package 3",
			trackingNumber: "789",
			courier: "fedex",
			index: 1,
		}
		const action = { type: "put", pkg: newPackage }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(3)
		expect(state[1].id).toEqual(newPackage.id)
	})

	it("should put packages with negative index correctly", () => {
		const newPackage = {
			id: 3,
			name: "Package 3",
			trackingNumber: "789",
			courier: "fedex",
			index: -1,
		}
		const action = { type: "put", pkg: newPackage }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(3)
		expect(state[1].id).toEqual(newPackage.id)
	})

	it("should put packages with index outside of bounds correctly", () => {
		const newPackage = {
			id: 3,
			name: "Package 3",
			trackingNumber: "789",
			courier: "fedex",
			index: 12,
		}
		const action = { type: "put", pkg: newPackage }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(3)
		expect(state[2].id).toEqual(newPackage.id)
	})

	it("should delete package correctly", () => {
		const action = { type: "delete", id: 1 }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(1)
		expect(state[0].id).toEqual(2)
	})

	it("shouldnt delete package if id doesnt exist", () => {
		const action = { type: "delete", id: 3 }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(2)
	})

	it("it should batch delete packages correctly", () => {
		const action = { type: "batchDelete", ids: ["1", "2"] }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(0)
	})

	it("it should batch delete even if invalid ids are included", () => {
		const action = { type: "batchDelete", ids: ["4", "3", "1"] }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(1)
		expect(state[0].id).toEqual(2)
	})

	it("should update name correctly", () => {
		const action = { type: "updateName", id: 1, name: "New Name" }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(2)
		expect(state[0].name).toEqual("New Name")
	})

	it("should update tracking number correctly", () => {
		const action = {
			type: "updateTrackingNumber",
			id: 1,
			trackingNumber: "789",
		}
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(2)
		expect(state[0].trackingNumber).toEqual("789")
	})

	it("should update courier correctly", () => {
		const action = { type: "updateCourier", id: 1, courier: "shippo" }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(2)
		expect(state[0].courier).toEqual("shippo")
	})

	it("should duplicate package correctly", () => {
		const originalDateNow = Date.now
		const fakeNow = 1234567890
		global.Date.now = jest.fn(() => fakeNow)

		const action = { type: "duplicate", id: 1 }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(3)
		expect(state[2]).toEqual({
			id: fakeNow,
			name: "Package 2",
			trackingNumber: "123",
			courier: "ups",
		})

		global.Date.now = originalDateNow
	})

	it("should move package to the right correctly", () => {
		const action = { type: "move", direction: "right", index: 0 }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(2)
		expect(state[0].id).toEqual(2)
		expect(state[1].id).toEqual(1)
	})

	it("should move package to the left correctly", () => {
		const action = { type: "move", direction: "left", index: 1 }
		const state = packageReducer(initialState, action)
		expect(state.length).toEqual(2)
		expect(state[0].id).toEqual(2)
		expect(state[1].id).toEqual(1)
	})

	it("should not move package if index is out of bounds", () => {
		const actionRight = { type: "move", direction: "right", index: 2 }
		const stateRight = packageReducer(initialState, actionRight)
		expect(stateRight.length).toEqual(2)
		expect(stateRight).toEqual(initialState)

		const actionLeft = { type: "move", direction: "left", index: -1 }
		const stateLeft = packageReducer(initialState, actionLeft)
		expect(stateLeft.length).toEqual(2)
		expect(stateLeft).toEqual(initialState)
	})
})
