import AddInput from "@/components/nav/AddInput"
import SearchInput from "@/components/nav/SearchInput"
import { PackageContextProvider } from "@/context/packageContext/PackageContextProvider"
import { UndoStackContextProvider } from "@/context/undoStackContext/undoStackProvider"
import Image from "next/image"

type Props = {
	children: React.ReactNode
}

function DashboardLayout({ children }: Props) {
	return (
		<PackageContextProvider>
			<UndoStackContextProvider>
				<div className="w-[350px] sm:w-auto mt-1 sm:mt-6 px-4 md:px-12">
					<nav className="sticky w-full top-0 gap-2 flex items-center justify-between z-40 overflow-hidden sm:overflow-visible py-1">
						<a href="/" className="min-w-[30px]">
							<Image
								src="/logo.svg"
								width={30}
								height={30}
								alt="logo"
							/>
						</a>
						<AddInput />
						<SearchInput />
					</nav>
					<main className="flex flex-col items-center relative">
						{children}
					</main>
				</div>
			</UndoStackContextProvider>
		</PackageContextProvider>
	)
}

export default DashboardLayout
