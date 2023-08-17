// import { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"

const prisma = new PrismaClient()

export async function GET() {
	// const body = request.body

	try {
		const shipments = await prisma.shipment.findMany()
		return new NextResponse(JSON.stringify({ shipments, success: true }), {
			status: 200,
		})
	} catch (error) {
		console.error("Request error", error)
		return new NextResponse(
			JSON.stringify({
				error: "Error reading shipment",
				success: false,
			}),
			{ status: 500 }
		)
	}
}

export async function POST(req: Request) {
	const body = await req.json()

	try {
		const shipmentSchema = z.object({
			name: z.string(),
			trackingNumber: z.string(),
			userId: z.number(),
			courier: z.string(),
		})

		const shipment = shipmentSchema.parse(body)

		const newShipment = await prisma.shipment.create({
			data: {
				name: shipment.name,
				trackingNumber: shipment.trackingNumber,
				userId: shipment.userId,
				courier: shipment.courier,
			},
		})

		return new NextResponse(
			JSON.stringify({ newShipment, success: true }),
			{ status: 200 }
		)
	} catch (error) {
		console.error("Request error", error)
		return new NextResponse(
			JSON.stringify({
				error: "Error adding shipment",
				success: false,
			}),
			{ status: 500 }
		)
	}
}
