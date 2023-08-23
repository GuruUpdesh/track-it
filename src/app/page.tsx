import { Button } from "@/components/ui/button"

export default async function Home() {
	return (
		<main className="flex items-center justify-center pt-24">
			<section className="flex flex-col items-start justify-center gap-2">
				<header>
					<h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight">
						Shipment
					</h1>
					<h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight">
						Tracker
					</h1>
				</header>
				<p className="max-w-2xl leading-7">
					Discover peace of mind with our advanced shipment tracker.
					Track your packages in real time, anytime, anywhere, with
					our innovative, user-friendly interface. Get instant alerts,
					estimated delivery times, and view comprehensive status
					updates in one simple click. Experience seamless, reliable,
					and accurate tracking, designed to make your shipping
					experience worry-free.
				</p>
				<div className="flex items-center gap-6">
					<Button>Get Started</Button>
					<Button variant="outline">Learn More</Button>
				</div>
			</section>
		</main>
	)
}
