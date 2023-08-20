import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function Page() {
	return (
		<div className="flex items-center justify-center py-24">
			<SignUp
				appearance={{
					baseTheme: dark,
				}}
			/>
		</div>
	)
}
