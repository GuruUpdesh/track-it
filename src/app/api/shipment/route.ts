import { prisma } from "@/db"
import { NextResponse } from "next/server"
import { z } from "zod"
import {
	shipmentRecordCreateSchema,
	shipmentRecordUpdateSchema,
} from "./typesAndSchemas"

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
				position: shipment.position,
				createdAt: shipment.createdAt
					? new Date(shipment.createdAt)
					: undefined,
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

export async function GET(req: Request) {
	const url = new URL(req.url)
	const userId = url.searchParams.get("userId")
	try {
		if (!userId) {
			throw new Error("Missing userId in url parameters")
		}

		const shipments = await prisma.shipment.findMany({
			where: {
				userId: userId,
			},
		})
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
				position: shipment.position,
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

		const shipmentToDelete = await prisma.shipment.findUnique({
			where: {
				id: id,
			},
			select: {
				position: true,
				userId: true,
			},
		})

		if (!shipmentToDelete) {
			throw new Error("Shipment not found")
		}

		const { position, userId } = shipmentToDelete

		const shipmentsToUpdate = await prisma.shipment.findMany({
			where: {
				userId: userId,
				position: {
					gt: position,
				},
			},
			select: {
				id: true,
				position: true,
			},
		})

		await Promise.all(
			shipmentsToUpdate.map((shipment) => {
				return prisma.shipment.update({
					where: {
						id: shipment.id,
					},
					data: {
						position: shipment.position - 1,
					},
				})
			})
		)

		const deletedShipment = await prisma.shipment.delete({
			where: {
				id: id,
			},
		})

		return new NextResponse(
			JSON.stringify({ shipment: deletedShipment, success: true }),
			{
				status: 200,
			}
		)
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
