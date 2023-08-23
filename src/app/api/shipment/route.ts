import { prisma } from "@/db"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import {
	shipmentIdSchema,
	shipmentRecordCreateSchema,
	shipmentRecordUpdateSchema,
	TShipmentRecordUpdate,
} from "./typesAndSchemas"

function handleError(error: unknown, baseError: string) {
	console.error("Request error", error)

	const response = { status: 500, error: baseError }
	if (error instanceof ZodError) {
		response.status = 400
		response.error = error.message
	}

	return new NextResponse(
		JSON.stringify({
			error: response.error,
			success: false,
		}),
		{ status: response.status }
	)
}

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const shipment = shipmentRecordCreateSchema.parse(body)

		// Check existing shipments with a greater or equal position
		const shipmentsToUpdate = await prisma.shipment.findMany({
			where: {
				userId: shipment.userId,
				position: {
					gte: shipment.position,
				},
			},
			select: {
				id: true,
				position: true,
			},
		})

		// Prepare update operations to adjust their positions
		const updateOperations = shipmentsToUpdate.map((shipmentToUpdate) => {
			return prisma.shipment.update({
				where: {
					id: shipmentToUpdate.id,
				},
				data: {
					position: shipmentToUpdate.position + 1,
				},
			})
		})

		// Create a transaction to update positions and then insert the new shipment
		const transactionResult = await prisma.$transaction([
			...updateOperations,
			prisma.shipment.create({
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
			}),
		])

		const newShipment = transactionResult[transactionResult.length - 1]

		return new NextResponse(
			JSON.stringify({ shipment: newShipment, success: true }),
			{ status: 200 }
		)
	} catch (error) {
		return handleError(error, "Error creating shipment")
	}
}

export async function GET(req: Request) {
	try {
		const url = new URL(req.url)
		const userId = url.searchParams.get("userId")
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
	try {
		const body = await req.json()
		const shipment = shipmentRecordUpdateSchema.parse(body)

		if (shipment.position === undefined) {
			return await updateChange(shipment)
		} else {
			const shipmentWithPosition =
				shipment as TShipmentRecordPositionUpdate
			return await updateWithPositionChange(shipmentWithPosition)
		}
	} catch (error) {
		return handleError(error, "Error updating shipment")
	}
}

type TShipmentRecordPositionUpdate = {
	id: number
	position: number
	name?: string
	courier?: string
	trackingNumber?: string
}

async function updateWithPositionChange(
	shipment: TShipmentRecordPositionUpdate
) {
	// Fetch the current position of the shipment to be updated
	const currentShipment = await prisma.shipment.findUnique({
		where: {
			id: shipment.id,
		},
		select: {
			position: true,
			userId: true,
		},
	})

	if (!currentShipment) {
		throw new Error("Shipment not found")
	}

	const { position: currentPosition, userId } = currentShipment

	const shipmentsToUpdate =
		shipment.position < currentPosition
			? await prisma.shipment.findMany({
					where: {
						userId: userId,
						position: {
							gte: shipment.position,
							lt: currentPosition,
						},
					},
					select: {
						id: true,
						position: true,
					},
			  })
			: await prisma.shipment.findMany({
					where: {
						userId: userId,
						position: {
							gt: currentPosition,
							lte: shipment.position,
						},
					},
					select: {
						id: true,
						position: true,
					},
			  })

	const updateOperations = shipmentsToUpdate.map((shipmentToUpdate) => {
		const newPosition =
			shipment.position < currentPosition
				? shipmentToUpdate.position + 1
				: shipmentToUpdate.position - 1

		return prisma.shipment.update({
			where: {
				id: shipmentToUpdate.id,
			},
			data: {
				position: newPosition,
			},
		})
	})

	// Now, add the main shipment update operation.
	updateOperations.push(
		prisma.shipment.update({
			where: {
				id: shipment.id,
			},
			data: shipment,
		})
	)

	const transactionResult = await prisma.$transaction(updateOperations)
	const patchedShipment = transactionResult[transactionResult.length - 1]

	return new NextResponse(
		JSON.stringify({ shipment: patchedShipment, success: true }),
		{
			status: 200,
		}
	)
}

async function updateChange(shipment: TShipmentRecordUpdate) {
	const updatedShipment = await prisma.shipment.update({
		where: {
			id: shipment.id,
		},
		data: shipment,
	})

	return new NextResponse(
		JSON.stringify({ shipment: updatedShipment, success: true }),
		{
			status: 200,
		}
	)
}

export async function DELETE(req: Request) {
	try {
		const body = await req.json()
		const id = shipmentIdSchema.parse(body).id

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

		const updateOperations = shipmentsToUpdate.map((shipment) => {
			return prisma.shipment.update({
				where: {
					id: shipment.id,
				},
				data: {
					position: shipment.position - 1,
				},
			})
		})

		const transactionResult = await prisma.$transaction([
			...updateOperations,
			prisma.shipment.delete({
				where: {
					id: id,
				},
			}),
		])

		const deletedShipment = transactionResult[transactionResult.length - 1]

		return new NextResponse(
			JSON.stringify({ shipment: deletedShipment, success: true }),
			{
				status: 200,
			}
		)
	} catch (error) {
		handleError(error, "Error deleting shipment")
	}
}
