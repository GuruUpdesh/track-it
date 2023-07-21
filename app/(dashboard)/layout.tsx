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
				<div className="mt-1 w-[350px] min-w-[50vw] px-4 sm:mt-6 sm:w-auto md:px-12">
					<nav className="sticky top-0 z-40 flex w-full items-center justify-between gap-2 overflow-hidden py-1 sm:overflow-visible">
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
					<main className="relative flex flex-col items-center">
						{children}
					</main>
				</div>
			</UndoStackContextProvider>
		</PackageContextProvider>
	)
}

export default DashboardLayout
