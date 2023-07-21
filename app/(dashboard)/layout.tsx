import { Providers } from "./Providers"

type Props = {
	children: React.ReactNode
}

function DashboardLayout({ children }: Props) {
	return (
		<Providers>
			<nav></nav>
			<main className="md:px-18 md:py-6 flex min-h-screen flex-col items-center px-10 py-3 lg:px-24 lg:py-8 relative">
				{children}
			</main>
		</Providers>
	)
}

export default DashboardLayout
