import { formatDate, getTimeFromDate } from "../../../utils/date"

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
