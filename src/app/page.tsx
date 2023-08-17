import { UserButton } from "@clerk/nextjs"

export default async function Home() {
	return (
		<div>
			<h1>hello world</h1>
			<UserButton afterSignOutUrl="/" />
		</div>
	)
}
