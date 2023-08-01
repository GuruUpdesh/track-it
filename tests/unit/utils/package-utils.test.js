import {
	convertLocationObjectToString,
	extractDeliveryLocation,
} from "../../../utils/package"

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
