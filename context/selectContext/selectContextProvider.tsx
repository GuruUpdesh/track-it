"use client"

import React, { useState } from "react"
import { SelectContext } from "./useSelectContext"

export function SelectContextProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [enabled, setEnabled] = useState(true)
	return (
		<SelectContext.Provider value={{ enabled, setEnabled }}>
			{children}
		</SelectContext.Provider>
	)
}
