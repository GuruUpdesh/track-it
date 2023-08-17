import { NextResponse } from "next/server"

export function createErrorResponse(
	status: number,
	message: string
): NextResponse {
	return new NextResponse(
		JSON.stringify({
			error: message,
		}),
		{ status }
	)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSuccessResponse(data: any): NextResponse {
	return new NextResponse(JSON.stringify(data, null, 2), { status: 200 })
}
