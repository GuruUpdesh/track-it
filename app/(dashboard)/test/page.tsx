import DashboardGrid, { TPackage } from "@/components/DashboardGrid"
import HelpMenu from "@/components/ui/HelpMenu"
import { redirect } from "next/navigation"

const testPackages = [
	{
		id: 1,
		name: "Test Pre-Transit Package",
		trackingNumber: "SHIPPO_PRE_TRANSIT",
		courier: "shippo",
	},
	{
		id: 2,
		name: "Test Transit Package",
		trackingNumber: "SHIPPO_TRANSIT",
		courier: "shippo",
	},
	{
		id: 3,
		name: "Test Delivered Package",
		trackingNumber: "SHIPPO_DELIVERED",
		courier: "shippo",
	},
	{
		id: 4,
		name: "Test Returned Package",
		trackingNumber: "SHIPPO_RETURNED",
		courier: "shippo",
	},
	{
		id: 5,
		name: "Test Failure Package",
		trackingNumber: "SHIPPO_FAILURE",
		courier: "shippo",
	},
	{
		id: 6,
		name: "Test Unknown Package",
		trackingNumber: "SHIPPO_UNKNOWN",
		courier: "shippo",
	},
	{
		id: 7,
		name: "Error Package",
		trackingNumber: "INVALID",
		courier: "ups",
	},
]

export default function Home() {
	const dev = process.env.NODE_ENV !== "production"

	if (!dev) {
		redirect("/")
	}

	return (
		<>
			<HelpMenu />
			<DashboardGrid packagesOverride={testPackages as TPackage[]} />
		</>
	)
}
