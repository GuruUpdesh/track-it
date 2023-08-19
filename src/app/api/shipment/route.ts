// import { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"
import {
	shipmentRecordCreateSchema,
	shipmentRecordUpdateSchema,
} from "./typesAndSchemas"

const prisma = new PrismaClient()

export async function POST(req: Request) {
	const body = await req.json()
	console.log("body", body)

	try {
		const shipment = shipmentRecordCreateSchema.parse(body)

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

export async function GET() {
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

export async function PATCH(req: Request) {
	const body = await req.json()

	try {
		const shipment = shipmentRecordUpdateSchema.parse(body)

		const updatedShipment = await prisma.shipment.update({
			where: {
				id: shipment.id,
			},
			data: {
				name: shipment.name,
				trackingNumber: shipment.trackingNumber,
				courier: shipment.courier,
			},
		})

		return new NextResponse(
			JSON.stringify({ updatedShipment, success: true }),
			{ status: 200 }
		)
	} catch (error) {
		console.error("Request error", error)
		return new NextResponse(
			JSON.stringify({
				error: "Error updating shipment",
				success: false,
			}),
			{ status: 500 }
		)
	}
}

export async function DELETE(req: Request) {
	console.log("API > shipment > DELETE")
	const body = await req.json()

	try {
		const id = z
			.object({
				id: z.number(),
			})
			.parse(body).id

		const shipment = await prisma.shipment.delete({
			where: {
				id: id,
			},
		})

		return new NextResponse(JSON.stringify({ shipment, success: true }), {
			status: 200,
		})
	} catch (error) {
		console.error("Request error", error)
		return new NextResponse(
			JSON.stringify({
				error: "Error deleting shipment",
				success: false,
			}),
			{ status: 500 }
		)
	}
}
