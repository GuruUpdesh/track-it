import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: "TrackIt",
	description:
		"Simplifies package tracking across multiple couriers. Monitor your shipments in real-time, view tracking history, and manage all tracking information in one centralized platform. Perfect for online shoppers and businesses.",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	)
}
