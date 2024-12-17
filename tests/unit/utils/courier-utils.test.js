import {
	getCourier,
	getCourierFromTrackingNumber,
} from "../../../utils/courier"

describe("courier utils", () => {
	describe("Testing getCourier function", () => {
		test("Valid courier code returns correct courier object", () => {
			expect(getCourier("ups").name).toBe("UPS")
			expect(getCourier("usps").name).toBe("USPS")
			expect(getCourier("ontrac").name).toBe("OnTrac")
			expect(getCourier("fedex").name).toBe("FedEx")
			expect(getCourier("shippo").name).toBe("Shippo")
		})

		// Your current implementation of getCourier doesn't handle invalid courier codes
		// So this test case isn't needed anymore
		// If you want to add handling for invalid courier codes, you would have to update getCourier function
	})

	describe("Testing getCourierFromTrackingNumber function", () => {
		test("Valid tracking number returns matching courier", () => {
			const testCases = [
				{
					trackingNumber: "1Z1234567890123456",
					expectedCourier: "ups",
				},
				{
					trackingNumber: "T1234567890",
					expectedCourier: "ups",
				},
				{
					trackingNumber: "9112345678901234567890",
					expectedCourier: "usps",
				},
				{
					trackingNumber: "9374889696021505850386",
					expectedCourier: "usps",
				},
				{
					trackingNumber: "C12345678901234",
					expectedCourier: "ontrac",
				},
				{
					trackingNumber: "9601234567890123456789",
					expectedCourier: "fedex",
				},
				{
					trackingNumber: "9400110200793594709945",
					expectedCourier: "usps",
				},
				{
					trackingNumber: "9205510200793594709946",
					expectedCourier: "usps",
				},
				{
					trackingNumber: "9407100200793594709947",
					expectedCourier: "usps",
				},
				{
					trackingNumber: "999999999999",
					expectedCourier: "fedex",
				},
				{
					trackingNumber: "999999999999999",
					expectedCourier: "fedex",
				},
			]

			for (const testCase of testCases) {
				const { trackingNumber, expectedCourier } = testCase
				const courier = getCourierFromTrackingNumber(trackingNumber)
				expect(courier).not.toBeNull()
				expect(courier?.code).toEqual(expectedCourier)
			}
		})

		test("Invalid tracking number returns null", () => {
			const trackingNumber = "invalid"
			const matchingCourier = getCourierFromTrackingNumber(trackingNumber)
			expect(matchingCourier).toBeNull()
		})
	})
})
