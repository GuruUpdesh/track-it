import Card from "@/components/Card"

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
				<Card />
			</div>
		</main>
	)
}
