"use client"

import React from "react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useShipments } from "@/lib/shipmentsStore"

const ReloadAlert = () => {
	const [open, setOpen] = React.useState(false)
	const [errorAlert] = useShipments((state) => [state.errorAlert])

	React.useEffect(() => {
		console.log(errorAlert)
		if (errorAlert) {
			setOpen(true)
		}
	}, [errorAlert])

	const handleRefresh = () => {
		location.reload()
	}

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Critical Error - Refresh
					</AlertDialogTitle>
					<AlertDialogDescription>
						A critical error has occured. Please refresh the page.
						If the problem persists, please contact support.
						<div className="m-1 border p-1">{errorAlert}</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction onClick={handleRefresh}>
						Refresh Dashboard
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default ReloadAlert
