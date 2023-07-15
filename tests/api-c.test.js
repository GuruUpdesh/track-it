import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { render, screen } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import Card from "../components/Card/Card"
import "@testing-library/jest-dom"

const testCases = [
	{
		name: "renders SHIPPO_TRANSIT correctly",
		pkg: {
			id: 2,
			name: "Test Transit Package",
			trackingNumber: "SHIPPO_TRANSIT",
			courier: "shippo",
		},
		response: {
			packageInfo: {
				trackingNumber: "SHIPPO_TRANSIT",
				courier: "shippo",
				status: {
					status: "TRANSIT",
					detailedStatus:
						"Your shipment has departed from the origin.",
					location: "San Francisco, CA",
					date: {
						relative: "3 days ago",
						absolute: "July 11, 2023",
						time: "1:57 PM",
					},
					deliveryLocation: null,
				},
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: {
							relative: "5 days ago",
							absolute: "July 10, 2023",
							time: "9:57 AM",
						},
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: {
							relative: "3 days ago",
							absolute: "July 11, 2023",
							time: "1:57 PM",
						},
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "San Francisco, CA",
			time: "1:57 PM - 3 days ago",
			status: "transit",
		},
	},
	{
		name: "renders SHIPPO_PRE_TRANSIT correctly",
		pkg: {
			id: 3,
			name: "Test Delivered Package",
			trackingNumber: "SHIPPO_PRE_TRANSIT",
			courier: "shippo",
		},
		response: {
			packageInfo: {
				trackingNumber: "SHIPPO_PRE_TRANSIT",
				courier: "shippo",
				status: {
					status: "PRE_TRANSIT",
					detailedStatus:
						"The carrier has received the electronic shipment information.",
					location: "Location not found",
					date: {
						relative: "5 days ago",
						absolute: "July 10, 2023",
						time: "10:19 AM",
					},
					deliveryLocation: null,
				},
				trackingHistory: [
					{
						status: "PRE_TRANSIT",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: {
							relative: "5 days ago",
							absolute: "July 10, 2023",
							time: "10:19 AM",
						},
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "Location not found",
			time: "10:19 AM - 5 days ago",
			status: "pre_transit",
		},
	},

	{
		name: "renders SHIPPO_DELIVERED correctly",
		pkg: {
			id: 3,
			name: "Test Delivered Package",
			trackingNumber: "SHIPPO_DELIVERED",
			courier: "shippo",
		},
		response: {
			packageInfo: {
				trackingNumber: "SHIPPO_DELIVERED",
				courier: "shippo",
				status: {
					status: "DELIVERED",
					detailedStatus: "Your shipment has been delivered.",
					location: "Chicago, IL",
					date: {
						relative: "2 days ago",
						absolute: "July 12, 2023",
						time: "2:19 PM",
					},
					deliveryLocation: null,
				},
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: {
							relative: "5 days ago",
							absolute: "July 10, 2023",
							time: "10:19 AM",
						},
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: {
							relative: "3 days ago",
							absolute: "July 11, 2023",
							time: "2:19 PM",
						},
						deliveryLocation: null,
					},
					{
						status: "FAILURE",
						detailedStatus:
							"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
						location: "Memphis, TN",
						date: {
							relative: "2 days ago",
							absolute: "July 13, 2023",
							time: "2:19 AM",
						},
						deliveryLocation: null,
					},
					{
						status: "DELIVERED",
						detailedStatus: "Your shipment has been delivered.",
						location: "Chicago, IL",
						date: {
							relative: "2 days ago",
							absolute: "July 12, 2023",
							time: "2:19 PM",
						},
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "Chicago, IL",
			time: "2:19 PM - 2 days ago",
			status: "delivered",
		},
	},
	{
		name: "renders SHIPPO_RETURNED correctly",
		pkg: {
			id: 4,
			name: "Test Returned Package",
			trackingNumber: "SHIPPO_RETURNED",
			courier: "shippo",
		},
		response: {
			packageInfo: {
				trackingNumber: "SHIPPO_RETURNED",
				courier: "shippo",
				status: {
					status: "RETURNED",
					detailedStatus:
						"Your shipment has been returned to the original sender.",
					location: "San Francisco, CA",
					date: {
						relative: "1 day ago",
						absolute: "July 13, 2023",
						time: "9:57 AM",
					},
					deliveryLocation: null,
				},
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: {
							relative: "5 days ago",
							absolute: "July 10, 2023",
							time: "9:57 AM",
						},
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: {
							relative: "3 days ago",
							absolute: "July 11, 2023",
							time: "1:57 PM",
						},
						deliveryLocation: null,
					},
					{
						status: "FAILURE",
						detailedStatus:
							"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
						location: "Memphis, TN",
						date: {
							relative: "2 days ago",
							absolute: "July 13, 2023",
							time: "1:57 AM",
						},
						deliveryLocation: null,
					},
					{
						status: "DELIVERED",
						detailedStatus: "Your shipment has been delivered.",
						location: "Chicago, IL",
						date: {
							relative: "2 days ago",
							absolute: "July 12, 2023",
							time: "1:57 PM",
						},
						deliveryLocation: null,
					},
					{
						status: "RETURNED",
						detailedStatus:
							"Your shipment has been returned to the original sender.",
						location: "San Francisco, CA",
						date: {
							relative: "1 day ago",
							absolute: "July 13, 2023",
							time: "9:57 AM",
						},
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "San Francisco, CA",
			time: "9:57 AM - 1 day ago",
			status: "returned",
		},
	},
	{
		name: "renders SHIPPO_FAILURE correctly",
		pkg: {
			id: 5,
			name: "Test Failure Package",
			trackingNumber: "SHIPPO_FAILURE",
			courier: "shippo",
		},
		response: {
			packageInfo: {
				trackingNumber: "SHIPPO_FAILURE",
				courier: "shippo",
				status: {
					status: "FAILURE",
					detailedStatus:
						"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
					location: "Memphis, TN",
					date: {
						relative: "about 19 hours ago",
						absolute: "July 14, 2023",
						time: "3:18 AM",
					},
					deliveryLocation: null,
				},
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: {
							relative: "3 days ago",
							absolute: "July 11, 2023",
							time: "11:18 AM",
						},
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: {
							relative: "2 days ago",
							absolute: "July 12, 2023",
							time: "3:18 PM",
						},
						deliveryLocation: null,
					},
					{
						status: "FAILURE",
						detailedStatus:
							"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
						location: "Memphis, TN",
						date: {
							relative: "about 19 hours ago",
							absolute: "July 14, 2023",
							time: "3:18 AM",
						},
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "Memphis, TN",
			time: "3:18 AM - about 19 hours ago",
			status: "failure",
		},
	},
	// Add more test cases here...
]

describe("shippo mock cards", () => {
	let mockDispatch

	beforeEach(() => {
		mockDispatch = jest.fn()
		jest.spyOn(console, "log").mockImplementation(() => {})
	})

	testCases.forEach((testCase) => {
		it(testCase.name, async () => {
			const mock = new MockAdapter(axios)

			// Mock the response for the API call
			mock.onGet("/api/package").reply(200, testCase.response)

			await act(async () => {
				render(
					<Card pkg={testCase.pkg} dispatchPackages={mockDispatch} />
				)
			})

			// Check that the correct number of cards are rendered
			const testPackages = await screen.getAllByTestId("card")
			expect(testPackages.length).toBe(1)

			const historyLocation = await screen.getByText(
				testCase.expected.location
			)
			expect(historyLocation).toBeInTheDocument()

			const historyTime = await screen.getByText(testCase.expected.time)
			expect(historyTime).toBeInTheDocument()

			const historyStatus = await screen.getByText(
				testCase.expected.status
			)
			expect(historyStatus).toBeInTheDocument()
		})
	})
})
