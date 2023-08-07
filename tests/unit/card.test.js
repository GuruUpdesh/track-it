import Card from "@/components/tracking/card/Card"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { act } from "react-dom/test-utils"

const testCases = [
	{
		name: "renders SHIPPO_PRE_TRANSIT",
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
				eta: "2023-08-01T19:14:04.244Z",
				sourceAndDestinationString:
					"Coming from San Francisco, CA to Chicago, IL",
				transitTime: "Your package has been in transit for 3 days",
				status: {
					status: "PRE_TRANSIT",
					detailedStatus:
						"The carrier has received the electronic shipment information.",
					location: "Location not found",
					date: "2023-07-29T14:57:52.232Z",
					deliveryLocation: null,
				},
				service: "Priority Mail",
				trackingHistory: [
					{
						status: "PRE_TRANSIT",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-29T14:57:52.232Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: null,
		},
	},
	{
		name: "renders SHIPPO_TRANSIT",
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
				eta: "2023-08-01T19:20:56.112Z",
				sourceAndDestinationString:
					"Coming from San Francisco, CA to Chicago, IL",
				transitTime: "Your package has been in transit for 1 day",
				status: {
					status: "TRANSIT",
					detailedStatus:
						"Your shipment has departed from the origin.",
					location: "San Francisco, CA",
					date: "2023-07-25T23:15:29.473Z",
					deliveryLocation: null,
				},
				service: "Priority Mail",
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-24T19:15:29.473Z",
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: "2023-07-25T23:15:29.473Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "San Francisco, CA",
		},
	},

	{
		name: "renders SHIPPO_DELIVERED",
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
				eta: "2023-08-01T19:20:56.119Z",
				sourceAndDestinationString:
					"Coming from San Francisco, CA to Chicago, IL",
				transitTime: "Your package was in transit for 2 days",
				status: {
					status: "DELIVERED",
					detailedStatus: "Your shipment has been delivered.",
					location: "Chicago, IL",
					date: "2023-07-26T23:15:29.473Z",
					deliveryLocation: null,
				},
				service: "Priority Mail",
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-24T19:15:29.473Z",
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: "2023-07-25T23:15:29.473Z",
						deliveryLocation: null,
					},
					{
						status: "FAILURE",
						detailedStatus:
							"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
						location: "Memphis, TN",
						date: "2023-07-27T11:15:29.473Z",
						deliveryLocation: null,
					},
					{
						status: "DELIVERED",
						detailedStatus: "Your shipment has been delivered.",
						location: "Chicago, IL",
						date: "2023-07-26T23:15:29.473Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "Chicago, IL",
		},
	},
	{
		name: "renders SHIPPO_RETURNED",
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
				eta: "2023-08-01T19:20:56.111Z",
				sourceAndDestinationString:
					"Coming from San Francisco, CA to Chicago, IL",
				transitTime: "Your package was in transit for 3 days",
				status: {
					status: "RETURNED",
					detailedStatus:
						"Your shipment has been returned to the original sender.",
					location: "San Francisco, CA",
					date: "2023-07-27T20:03:16.653Z",
					deliveryLocation: null,
				},
				service: "Priority Mail",
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-24T20:03:16.653Z",
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: "2023-07-26T00:03:16.653Z",
						deliveryLocation: null,
					},
					{
						status: "FAILURE",
						detailedStatus:
							"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
						location: "Memphis, TN",
						date: "2023-07-27T12:03:16.653Z",
						deliveryLocation: null,
					},
					{
						status: "DELIVERED",
						detailedStatus: "Your shipment has been delivered.",
						location: "Chicago, IL",
						date: "2023-07-27T00:03:16.653Z",
						deliveryLocation: null,
					},
					{
						status: "RETURNED",
						detailedStatus:
							"Your shipment has been returned to the original sender.",
						location: "San Francisco, CA",
						date: "2023-07-27T20:03:16.653Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "San Francisco, CA",
		},
	},
	{
		name: "renders SHIPPO_FAILURE",
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
				eta: "2023-08-01T19:20:56.113Z",
				sourceAndDestinationString:
					"Coming from San Francisco, CA to Chicago, IL",
				transitTime: "Your package has been in transit for 3 days",
				status: {
					status: "FAILURE",
					detailedStatus:
						"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
					location: "Memphis, TN",
					date: "2023-07-27T11:15:29.473Z",
					deliveryLocation: null,
				},
				service: "Priority Mail",
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-24T19:15:29.473Z",
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: "2023-07-25T23:15:29.473Z",
						deliveryLocation: null,
					},
					{
						status: "FAILURE",
						detailedStatus:
							"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
						location: "Memphis, TN",
						date: "2023-07-27T11:15:29.473Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "Memphis, TN",
		},
	},
	{
		name: "renders SHIPPO_UNKNOWN",
		pkg: {
			id: 5,
			name: "Test Unknown Package",
			trackingNumber: "SHIPPO_UNKNOWN",
			courier: "shippo",
		},
		response: {
			packageInfo: {
				trackingNumber: "SHIPPO_UNKNOWN",
				courier: "shippo",
				eta: "2023-08-01T19:20:56.128Z",
				sourceAndDestinationString:
					"Coming from San Francisco, CA to Chicago, IL",
				transitTime: "Your package has been in transit for 8 days",
				status: {
					status: "UNKNOWN",
					detailedStatus:
						"The carrier has received the electronic shipment information.",
					location: "Location not found",
					date: "2023-07-24T20:03:16.653Z",
					deliveryLocation: null,
				},
				service: "Priority Mail",
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-24T20:03:16.653Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: null,
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
					<Card
						pkg={testCase.pkg}
						index={0}
						packagesLength={1}
						dispatchPackages={mockDispatch}
						setSelectedPackage={mockDispatch}
						inSearchResults={true}
						isSelected={false}
						statusFilter={[]}
					/>
				)
			})

			// Check that the correct number of cards are rendered
			const testPackages = await screen.getAllByTestId("card")
			expect(testPackages.length).toBe(1)

			if (testCase.expected.location !== null) {
				const historyLocation = await screen.getByText(
					testCase.expected.location
				)
				expect(historyLocation).toBeInTheDocument()
			}
		})
	})
})
