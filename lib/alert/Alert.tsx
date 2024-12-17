"use client"

import React from "react"
import { toast, Toaster, ToastBar } from "react-hot-toast"
import "./alert.css"
import IconButton from "@/components/ui/IconButton"
import { MdClose } from "react-icons/md"

const Alert = () => {
	return (
		<Toaster
			position="bottom-center"
			toastOptions={{
				duration: 3000,
				style: {
					backgroundColor: "#080808",
					border: "1px solid rgb(129 140 248 / 0.75)",
					color: "rgb(255 255 255 / 0.75)",
					borderRadius: "0.25rem",
				},
			}}
		>
			{(t) => (
				<ToastBar
					toast={t}
					position="bottom-center"
					style={{
						animation: t.visible
							? "notificationEnter 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
							: "notificationLeave 0.2s cubic-bezier(0.075, 0.82, 0.165, 1) forwards",
					}}
				>
					{({ icon, message }) => (
						<>
							{icon}
							{message}
							{t.type !== "loading" && (
								<IconButton
									ariaLabel="dismiss"
									onClick={() => toast.dismiss(t.id)}
								>
									<MdClose />
								</IconButton>
							)}
						</>
					)}
				</ToastBar>
			)}
		</Toaster>
	)
}

export default Alert
