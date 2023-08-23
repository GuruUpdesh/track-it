import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import BackButton from "./BackButton"

export default function Page() {
	return (
		<div className="flex items-center justify-center py-24">
			<div>
				<BackButton />
				<SignIn
					appearance={{
						baseTheme: dark,
						elements: {
							rootBox: "bg-transparent",
							card: "border bg-white/5 border-white/10 rounded-xl",
							formButtonPrimary: "bg-blue-700 rounded-sm py-4",
							formFieldInput: "rounded-sm",
							socialButtonsBlockButton: "rounded-sm",
							footerActionLink: "text-blue-500",
							footerActionText: "grow",
							footerAction: "flex w-full",
						},
					}}
				/>
			</div>
		</div>
	)
}
