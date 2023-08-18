import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
	return (
		<div className="mt-6 grid grid-cols-4 gap-6">
			{new Array(12).fill(0).map((index) => (
				<Card key={index}>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-[24px] w-[300px]" />
						</CardTitle>
						<CardDescription>
							<Skeleton className="h-[20px] w-[150px]" />
						</CardDescription>
					</CardHeader>
					<CardContent></CardContent>
				</Card>
			))}
		</div>
	)
}
