import {
	getCourierStringFromCode,
	getCouriersFromTrackingNumber,
} from "../utils/courier"
import { formatDate, getTimeFromDate } from "../utils/date"
import {
	convertLocationObjectToString,
	extractDeliveryLocation,
} from "../utils/package"

describe("date utils", () => {
	test("formatDate returns formatted date (same year)", () => {
		const date = new Date(2023, 0, 1).toISOString() // January 1, 2023
		expect(formatDate(date)).toBe("Jan 1")
	})

	test("formatDate returns formatted date (different year)", () => {
		const date = new Date(2022, 0, 1).toISOString() // January 1, 2023
		expect(formatDate(date)).toBe("Jan 1, 2022")
	})

	test("getTimeFromDate returns formatted time", () => {
		const date = new Date(2023, 0, 1, 14, 30).toISOString() // January 1, 2023, 14:30
		expect(getTimeFromDate(date)).toBe("2:30pm")
	})
})

describe("package utils", () => {
	describe("Testing location conversion function", () => {
		test("convertLocationObjectToString returns formatted location", () => {
			const locations = [
				{
					input: { city: "New York", state: "NY" },
					output: "New York, NY",
				},
				{ input: { state: "NY" }, output: "NY" },
				{ input: { city: "New York" }, output: "New York" },
				{ input: { country: "US" }, output: "US" },
				{
					input: { country: "US", city: "New York" },
					output: "New York, US",
				},
				{
					input: { city: "New York", state: "NY", country: "US" },
					output: "New York, NY",
				},
			]
			for (const location of locations) {
				expect(convertLocationObjectToString(location.input)).toBe(
					location.output
				)
			}
		})

		test("convertLocationObjectToString returns error string for null", () => {
			expect(convertLocationObjectToString(null)).toBe(
				"Location not found"
			)
		})
	})

	describe("Testing delivery location extraction function", () => {
		const testCases = [
			{
				input: "The package was delivered at the front door",
				expected: "home",
			},
			{
				input: "The package was delivered in the mailbox",
				expected: "mailbox",
			},
			{ input: "The package was delivered", expected: null },
			{
				input: "The package was delivered at the Front Door",
				expected: "home",
			},
			{
				input: "The package was delivered   at the front door   ",
				expected: "home",
			},
			{
				input: "The package was delivered at the front door #123",
				expected: "home",
			},
			{
				input: "The package was delivered at the front door - Apt 123",
				expected: "home",
			},
			{
				input: "The package was delivered at the front door, Apt 123",
				expected: "home",
			},
			{
				input: "The package was delivered at the front door; Apt 123",
				expected: "home",
			},
			{
				input: "The package was delivered at the front door: Apt 123",
				expected: "home",
			},
			{
				input: "The package was delivered at the doorstep",
				expected: "home",
			},
			{
				input: "The package was delivered at the entrance",
				expected: "home",
			},
			{
				input: "The package was delivered at the gate",
				expected: "home",
			},
		]

		testCases.forEach(({ input, expected }) => {
			test(`extractDeliveryLocation identifies delivery location: ${input}`, () => {
				expect(extractDeliveryLocation(input)).toBe(expected)
			})
		})
	})
})

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
