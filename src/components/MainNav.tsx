"use client"

import React from "react"
import { Button } from "./ui/button"
import Link from "next/link"
import { AiOutlineHome } from "react-icons/ai"
import { BsBook, BsGrid } from "react-icons/bs"
import { usePathname } from "next/navigation"
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"

const MainNav = () => {
	const pathname = usePathname()
	return (
		<nav className="flex w-screen items-center justify-between border-b bg-black/50 px-24 py-3">
			<div className="flex items-center gap-3">
				<h1 className="text-2xl font-semibold">Shipment Tracker</h1>
			</div>
			<ul className="flex items-center justify-between gap-12">
				<li>
					<Link href="/" passHref legacyBehavior>
						<Button
							className="flex items-center gap-2"
							variant={pathname === "/" ? "outline" : "ghost"}
						>
							<AiOutlineHome />
							Home
						</Button>
					</Link>
				</li>
				<li>
					<Link href="/dashboard" passHref legacyBehavior>
						<Button
							className="flex items-center gap-2"
							variant={
								pathname === "/dashboard" ? "outline" : "ghost"
							}
						>
							<BsGrid />
							Dashboard
						</Button>
					</Link>
				</li>
				<li>
					<Link href="/user-guide" passHref legacyBehavior>
						<Button
							className="flex items-center gap-2"
							variant={
								pathname === "/user-guide" ? "outline" : "ghost"
							}
						>
							<BsBook />
							Docs
						</Button>
					</Link>
				</li>
			</ul>
			<div>
				User
				<SignedIn>
					<UserButton afterSignOutUrl="/" />
				</SignedIn>
				<SignedOut>
					<SignInButton />
				</SignedOut>
			</div>
		</nav>
	)
}

export default MainNav
