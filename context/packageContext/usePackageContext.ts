import { PackageAction } from "./packageReducer"
import { TPackage } from "@/components/Packages"
import React, { createContext, useContext } from "react"

export type PackageContextProps = {
	packages: TPackage[]
	dispatchPackages: React.Dispatch<PackageAction>
}

export const PackageContext = createContext<PackageContextProps>({
	packages: [],
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	dispatchPackages: () => {},
})

export const usePackageContext = (): PackageContextProps => {
	const context = useContext(PackageContext)

	if (context === null) {
		throw new Error(
			"usePackageContext must be used within a PackageContextProvider"
		)
	}

	return context
}
