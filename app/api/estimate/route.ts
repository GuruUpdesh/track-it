import { NextRequest } from "next/server"

import { PackageInfo } from "../package/route"

export async function GET(request: NextRequest) {
	const url = new URL(request.url)
	const packageInfoRequested = url.searchParams.get("packageInfo")
	if (!packageInfoRequested) {
		return new Response(
			JSON.stringify({
				error: "Missing package info in url parameters",
			}),
			{
				status: 400,
			}
		)
	}

	const packageInfo = JSON.parse(packageInfoRequested) as PackageInfo

	console.log(packageInfo)
}
