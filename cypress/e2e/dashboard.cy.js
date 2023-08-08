/// <reference types="cypress" />

describe("Dashboard", () => {
	beforeEach(() => {
		cy.visit("http://localhost:3000")
	})

	it("Displays the dashboard", () => {
		cy.get("h1").should("have.text", "Dashboard")
		cy.get("input#trackingNumber").should("be.visible")
		cy.get('label[for="trackingNumber"]').should(
			"have.text",
			"Tracking Number"
		)
		cy.get('button[aria-roledescription="add shipment button"]').should(
			"be.visible"
		)
		cy.get('input[placeholder="Search"]').should("be.visible")
	})
	it("Users can create and interact with first package", () => {
		cy.get("input#trackingNumber").focus().type("abc")
		cy.get("input#trackingNumber").should(
			"have.attr",
			"aria-invalid",
			"true"
		)

		cy.get("input#trackingNumber").clear()
		cy.get("input#trackingNumber").focus().type("9341989696005523246306")
		cy.get("input#trackingNumber").should(
			"have.attr",
			"aria-invalid",
			"false"
		)
		cy.get('button[aria-roledescription="add shipment button"]').click()
		cy.get('div[role="status"]').should("have.text", "Package added")
		cy.get("div .card").first().should("be.visible")

		cy.get('input[placeholder="Type name..."]')
			.first()
			.should("be.visible")
			.focus()
			.type("Test String Cypress")
			.blur()
		cy.get(".card h3").first().should("have.text", "Test String Cypress")

		cy.get('button[aria-label="Open Detailed Package Information"]')
			.first()
			.click()
		cy.get(".TabsTrigger").last().click()
	})
})
