import "./globals.css"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Work_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

const workSans = Work_Sans({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description,
	keywords: [
		"trackit",
		"track",
		"tracking",
		"package",
		"parcel",
		"courier",
		"shipments",
		"ship",
		"shipping",
		"shipment",
		"tracker",
		"free",
		"real-time",
	],
	authors: [
		{
			name: "GuruUpdesh",
			url: "https://github.com/GuruUpdesh",
		},
	],
	creator: "GuruUpdesh",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [`${siteConfig.url}/og.jpg`],
	},
	icons: {
		icon: "/favicon.ico",
	},
}

interface Props {
	children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
	return (
		<html lang="en">
			<head />
			<body
				className={cn(
					workSans.className,
					"flex min-h-screen justify-center antialiased"
				)}
			>
				{children}
				<Analytics />
			</body>
		</html>
	)
}
