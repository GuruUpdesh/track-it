"use client"

import packageReducer from "./packageReducer"
import { PackageContext } from "./usePackageContext"
import useLocalStorage from "@/hooks/useLocalStorageHook"
import React from "react"

export function PackageContextProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [packages, dispatchPackages] = useLocalStorage(
		"packages",
		[],
		packageReducer
	)

	return (
		<PackageContext.Provider value={{ packages, dispatchPackages }}>
			{children}
		</PackageContext.Provider>
	)
}
