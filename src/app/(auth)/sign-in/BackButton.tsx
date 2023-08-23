"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { BiArrowBack } from "react-icons/bi"
import { useRouter } from "next/navigation"

const BackButton = () => {
	const router = useRouter()
	return (
		<Button
			variant="outline"
			className="mb-6"
			onClick={() => router.back()}
		>
			<BiArrowBack className="mr-2" />
			Back
		</Button>
	)
}

export default BackButton
