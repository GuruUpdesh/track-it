import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function Page() {
	return (
		<div className="flex items-center justify-center py-24">
			<SignUp
				appearance={{
					baseTheme: dark,
					elements: {
						rootBox: "bg-transparent",
						card: "border bg-white/5 border-white/10 rounded-xl",
					},
				}}
			/>
		</div>
	)
}
