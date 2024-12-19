describe("Dashboard", () => {
	it("Displays the dashboard", () => {
		cy.visit("/")
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
		cy.visit("/")
		cy.get("input#trackingNumber").focus().type("abc")
		cy.get("input#trackingNumber").should(
			"have.attr",
			"aria-invalid",
			"true"
		)

		cy.get("input#trackingNumber").clear()
		cy.get("input#trackingNumber").focus().type("9361289696041616769487")
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

	// it("Users can delete, edit, and undo", () => {
	// 	cy.visit("/test")
	// 	cy.get(".card").should("have.length", 7)
	// 	cy.get('.card button[aria-label="Package Controls"]').first().click()

	// 	// delete
	// 	cy.get('div [role="menuitem"]').last().click()
	// 	cy.get(".card").should("have.length", 6)

	// 	// undo
	// 	cy.get('button[aria-label="undo"]').click()
	// 	cy.get(".card").should("have.length", 7)

	// 	// duplicate
	// 	cy.get('.card button[aria-label="Package Controls"]').first().click()
	// 	cy.get('div [role="menuitem"]:eq(-2)').click()
	// 	cy.get(".card").should("have.length", 8)

	// 	// edit
	// 	cy.get('.card button[aria-label="Package Controls"]').first().click()
	// 	cy.get('div [role="menuitem"]:eq(3)').click()
	// 	cy.get('div [role="menuitem"]:eq(9)').click()
	// 	cy.get("input#tracking-number-input").focus().clear().type("invalid")
	// 	cy.get('div[role="dialog"] button[type="submit"]').click()
	// })

	// it("Users can search and filter", () => {
	// 	cy.visit("/test")

	// 	//search
	// 	cy.get('input[placeholder="Search"]')
	// 		.focus()
	// 		.type("Test String Cypress")
	// 	cy.get(".card").should("have.length", 1)
	// 	cy.get('input[placeholder="Search"]').focus().clear()

	// 	//filter
	// 	cy.get('button[aria-label="filter-status"]').click()
	// 	cy.get('div [role="menuitem"]').first().click()
	// 	cy.get(".card").should("have.length", 1)
	// 	cy.get("body").type("{esc}")

	// 	cy.get('button[aria-label="filter-courier"]').click()
	// 	cy.get('div [role="menuitem"]').first().click()
	// 	cy.get(".card").should("have.length", 0)
	// 	cy.get("body").type("{esc}")
	// })
})
