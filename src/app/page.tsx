import { UserButton } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"

async function getShipments() {
	const res = await axios.get("http://localhost:3000/api/shipment")
	if (!res.data.success) {
		return []
	}
	return res.data.shipments
}

export default async function Home() {

	return (
		<main>
			<nav className="flex items-center justify-between w-screen">
				<div>
				<Image
					src="/logo.svg"
					width={30}
					height={30}
					alt="logo"
				/>
				<h1>
					TrackIt
				</h1>
				</div>
				<ul className="flex items-center justify-between gap-12">
					<li>
						Home
					</li>
					<li>
						Dashboard
					</li>
					<li>
						Docs
					</li>
					<li>
						Settings
					</li>
				</ul>
				<UserButton afterSignOutUrl="/" />
			</nav>
			<section>
				<h1>Dashboard</h1>
			</section>
		</main>
	)
}
