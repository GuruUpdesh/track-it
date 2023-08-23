import ReloadAlert from "@/components/ui/alert/ReloadAlert"
import Shipments from "./components/shipment/Shipments"
import { auth } from "@clerk/nextjs"

export default async function Dashboard() {
	const { userId } = auth()
	return (
		<>
			<Shipments userId={userId} />
			<ReloadAlert />
		</>
	)
}
