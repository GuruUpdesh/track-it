import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { act } from "react-dom/test-utils"

import Card from "../components/Card/Card"

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
				eta: "2023-07-16T21:51:02.603Z",
				status: {
					status: "TRANSIT",
					detailedStatus:
						"Your shipment has departed from the origin.",
					location: "San Francisco, CA",
					date: "2023-07-11T20:57:44.89Z",
					deliveryLocation: null,
				},
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-10T16:57:44.89Z",
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: "2023-07-11T20:57:44.89Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "San Francisco, CA",
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
				eta: "2023-07-16T21:51:02.606Z",
				status: {
					status: "PRE_TRANSIT",
					detailedStatus:
						"The carrier has received the electronic shipment information.",
					location: "Location not found",
					date: "2023-07-10T16:57:48.086Z",
					deliveryLocation: null,
				},
				trackingHistory: [
					{
						status: "PRE_TRANSIT",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-10T16:57:48.086Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "Location not found",
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
				eta: "2023-07-16T21:51:02.602Z",
				status: {
					status: "DELIVERED",
					detailedStatus: "Your shipment has been delivered.",
					location: "Chicago, IL",
					date: "2023-07-15T16:00:07.408Z",
					deliveryLocation: null,
				},
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-13T12:00:07.408Z",
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: "2023-07-14T16:00:07.408Z",
						deliveryLocation: null,
					},
					{
						status: "FAILURE",
						detailedStatus:
							"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
						location: "Memphis, TN",
						date: "2023-07-16T04:00:07.408Z",
						deliveryLocation: null,
					},
					{
						status: "DELIVERED",
						detailedStatus: "Your shipment has been delivered.",
						location: "Chicago, IL",
						date: "2023-07-15T16:00:07.408Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "Chicago, IL",
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
				eta: "2023-07-16T21:51:02.602Z",
				status: {
					status: "RETURNED",
					detailedStatus:
						"Your shipment has been returned to the original sender.",
					location: "San Francisco, CA",
					date: "2023-07-13T16:58:07.286Z",
					deliveryLocation: null,
				},
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-10T16:58:07.286Z",
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: "2023-07-11T20:58:07.286Z",
						deliveryLocation: null,
					},
					{
						status: "FAILURE",
						detailedStatus:
							"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
						location: "Memphis, TN",
						date: "2023-07-13T08:58:07.286Z",
						deliveryLocation: null,
					},
					{
						status: "DELIVERED",
						detailedStatus: "Your shipment has been delivered.",
						location: "Chicago, IL",
						date: "2023-07-12T20:58:07.286Z",
						deliveryLocation: null,
					},
					{
						status: "RETURNED",
						detailedStatus:
							"Your shipment has been returned to the original sender.",
						location: "San Francisco, CA",
						date: "2023-07-13T16:58:07.286Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "San Francisco, CA",
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
				eta: "2023-07-16T21:51:02.603Z",
				status: {
					status: "FAILURE",
					detailedStatus:
						"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
					location: "Memphis, TN",
					date: "2023-07-14T08:41:22.227Z",
					deliveryLocation: null,
				},
				trackingHistory: [
					{
						status: "UNKNOWN",
						detailedStatus:
							"The carrier has received the electronic shipment information.",
						location: "Location not found",
						date: "2023-07-11T16:41:22.227Z",
						deliveryLocation: null,
					},
					{
						status: "TRANSIT",
						detailedStatus:
							"Your shipment has departed from the origin.",
						location: "San Francisco, CA",
						date: "2023-07-12T20:41:22.227Z",
						deliveryLocation: null,
					},
					{
						status: "FAILURE",
						detailedStatus:
							"The Postal Service has identified a problem with the processing of this item and you should contact support to get further information.",
						location: "Memphis, TN",
						date: "2023-07-14T08:41:22.227Z",
						deliveryLocation: null,
					},
				],
			},
		},
		expected: {
			location: "Memphis, TN",
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

			const historyStatus = await screen.getByText(
				testCase.expected.status
			)
			expect(historyStatus).toBeInTheDocument()
		})
	})
})
