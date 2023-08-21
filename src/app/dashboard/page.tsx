import Shipments from "./components/Shipments"
import { auth } from "@clerk/nextjs"

export default async function Dashboard() {
	const { userId } = auth()
	return <Shipments userId={userId} />
}
