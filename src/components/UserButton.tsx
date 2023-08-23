import React from "react"
import { Button } from "./ui/button"
import { useClerk } from "@clerk/clerk-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { AiOutlineUser } from "react-icons/ai"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import ThemeSwitcherMenu from "./ThemeSwitcherMenu"

const UserButton = () => {
	const { signOut } = useClerk()
	return (
		<>
			<SignedIn>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="rounded-full p-2"
							size="icon"
						>
							<AiOutlineUser />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<ThemeSwitcherMenu />
						<DropdownMenuItem
							onSelect={() => {
								signOut()
							}}
						>
							Signout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SignedIn>
			<SignedOut>
				<Link href="/sign-in" passHref legacyBehavior>
					<Button>Sign In</Button>
				</Link>
			</SignedOut>
		</>
	)
}

export default UserButton
