import { PackageContextProvider } from "@/context/packageContext/PackageContextProvider"

type Props = {
	children: React.ReactNode
}

function DashboardLayout({ children }: Props) {
	return (
		<PackageContextProvider>
			<nav></nav>
			<main className="md:px-18 md:py-6 flex min-h-screen flex-col items-center px-10 py-3 lg:px-24 lg:py-8 relative">
				{children}
			</main>
		</PackageContextProvider>
	)
}

export default DashboardLayout
