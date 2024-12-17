import AddInput from "@/components/nav/AddInput"
import NavBackground from "@/components/nav/NavBackground"
import SearchInput from "@/components/nav/SearchInput"
import { PackageContextProvider } from "@/context/packageContext/PackageContextProvider"
import { SearchContextProvider } from "@/context/searchContext/SearchContextProvider"
import { SelectContextProvider } from "@/context/selectContext/selectContextProvider"
import { UndoStackContextProvider } from "@/context/undoStackContext/undoStackProvider"
import Alert from "@/lib/alert/Alert"
import Image from "next/image"
import Link from "next/link"

type Props = {
	children: React.ReactNode
}

function DashboardLayout({ children }: Props) {
	return (
		<PackageContextProvider>
			<UndoStackContextProvider>
				<SearchContextProvider>
					<SelectContextProvider>
						<Alert />
						<div className="mt-1 w-[350px] min-w-[50vw] px-4 sm:mt-6 sm:w-auto md:px-12">
							<nav className="sticky top-0 z-40 flex w-full items-center justify-between gap-2 overflow-hidden py-1 sm:overflow-visible">
								<Link href="/" className="min-w-[30px]">
									<Image
										src="/logo.svg"
										width={30}
										height={30}
										alt="logo"
									/>
								</Link>
								<AddInput />
								<SearchInput />
							</nav>
							<NavBackground />
							<main className="relative flex flex-col items-center">
								{children}
							</main>
						</div>
					</SelectContextProvider>
				</SearchContextProvider>
			</UndoStackContextProvider>
		</PackageContextProvider>
	)
}

export default DashboardLayout
