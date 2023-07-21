import { PackageContext, PackageContextProps } from "./Providers"
import { useContext } from "react"

export const usePackageContext = (): PackageContextProps => {
	const context = useContext(PackageContext)

	if (context === null) {
		throw new Error(
			"usePackageContext must be used within a PackageContextProvider"
		)
	}

	return context
}
