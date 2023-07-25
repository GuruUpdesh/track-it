"use client"

import React, { useState } from "react"
import { SelectContext } from "./useSelectContext"

export function SelectContextProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [enabled, setEnabled] = useState(true)
	console.log("selected context", enabled)
	return (
		<SelectContext.Provider value={{ enabled, setEnabled }}>
			{children}
		</SelectContext.Provider>
	)
}
