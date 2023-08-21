import React from "react"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ShipmentSkeleton = () => {
	return (
		<Card className="overflow-hidden bg-white/5">
			<div className="border-b">
				<CardHeader className="flex flex-row items-center justify-between px-4 py-2">
					<div className="flex items-baseline gap-2">
						<Skeleton className="h-[25px] w-[125px]" />
						<CardDescription>
							<Skeleton className="h-[18px] w-[50px]" />
						</CardDescription>
					</div>
					<div className="flex gap-1">
						<Skeleton className="h-[40px] w-[40px]" />
					</div>
				</CardHeader>
			</div>
			<div className="relative min-h-[150px] min-w-full bg-[hsl(var(--background))]"></div>
		</Card>
	)
}

export default ShipmentSkeleton
