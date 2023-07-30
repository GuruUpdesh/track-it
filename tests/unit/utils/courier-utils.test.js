import {
	getCourierStringFromCode,
	getCouriersFromTrackingNumber,
} from "../../../utils/courier"

describe("courier utils", () => {
	describe("Testing getCourierStringFromCode function", () => {
		test("Valid courier code returns correct string", () => {
			expect(getCourierStringFromCode("ups")).toBe("UPS")
			expect(getCourierStringFromCode("usps")).toBe("USPS")
			expect(getCourierStringFromCode("ontrac")).toBe("OnTrac")
			expect(getCourierStringFromCode("fedex")).toBe("FedEx")
			expect(getCourierStringFromCode("shippo")).toBe("test")
		})

		test("Invalid courier code returns 'Invalid Courier'", () => {
			console.error = jest.fn() // Mocking console.error to prevent error logging
			expect(getCourierStringFromCode("invalid")).toBe("Invalid Courier")
			expect(console.error).toHaveBeenCalledWith(
				"Invalid Courier Code",
				"invalid"
			)
		})
	})
	describe("Testing getCouriersFromTrackingNumber function", () => {
		test("Valid tracking number returns matching couriers", () => {
			const testCases = [
				{
					trackingNumber: "1Z1234567890123456",
					expectedCouriers: ["ups"],
				},
				{
					trackingNumber: "T1234567890",
					expectedCouriers: ["ups"],
				},
				{
					trackingNumber: "9112345678901234567890",
					expectedCouriers: ["usps"],
				},
				{
					trackingNumber: "9374889696021505850386",
					expectedCouriers: ["usps"],
				},
				{
					trackingNumber: "C12345678901234",
					expectedCouriers: ["ontrac"],
				},
				{
					trackingNumber: "9601234567890123456789",
					expectedCouriers: ["fedex"],
				},
				{
					trackingNumber: "9400110200793594709945",
					expectedCouriers: ["usps"],
				},
				{
					trackingNumber: "9205510200793594709946",
					expectedCouriers: ["usps"],
				},
				{
					trackingNumber: "9407100200793594709947",
					expectedCouriers: ["usps"],
				},
				{
					trackingNumber: "999999999999",
					expectedCouriers: ["fedex"],
				},
				{
					trackingNumber: "999999999999999",
					expectedCouriers: ["fedex"],
				},
			]

			for (const testCase of testCases) {
				const { trackingNumber, expectedCouriers } = testCase
				const couriers = getCouriersFromTrackingNumber(trackingNumber)
				expect(couriers).toEqual(
					expect.arrayContaining(expectedCouriers)
				)
			}
		})

		test("Invalid tracking number returns an empty array", () => {
			const trackingNumber = "invalid"
			const matchingCouriers =
				getCouriersFromTrackingNumber(trackingNumber)
			expect(matchingCouriers).toEqual([])
		})
	})
})
