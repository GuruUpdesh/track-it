import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
	return (
		<div className="mt-6 grid grid-cols-4 gap-6">
			{new Array(12).fill(0).map((index) => (
				<Card key={index} className="max-h-[64px] bg-white/5">
					<div>
						<CardHeader className="flex flex-row items-center justify-between px-4 py-2">
							<div className="flex flex-col gap-1">
								<Skeleton className="h-[25px] w-[300px]" />
								<CardDescription>
									<Skeleton className="h-[18px] w-[200px]" />
								</CardDescription>
							</div>
							<div className="flex gap-1">
								<Skeleton className="h-[40px] w-[40px] rounded-full" />
								<Skeleton className="h-[40px] w-[40px]" />
							</div>
						</CardHeader>
					</div>
				</Card>
			))}
		</div>
	)
}
