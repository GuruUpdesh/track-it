import { BiDotsVertical, BiSort } from "react-icons/bi"
import { AiOutlineCalendar } from "react-icons/ai"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import AddInput from "./components/AddInput"
import Alert from "@/components/ui/alert/Alert"
import UndoRedo from "@/app/dashboard/components/UndoRedo"
import Search from "@/app/dashboard/components/Search"

interface Props {
	children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
	return (
		<main className="px-24">
			<Alert />
			<header className="flex w-full items-center justify-between py-3">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
					Dashboard
				</h1>
				<AddInput />
				<div className="flex w-full max-w-xs items-center space-x-2">
					<Search />
					<Button variant="outline" size="icon">
						<BiDotsVertical />
					</Button>
				</div>
			</header>
			<section className="flex justify-between">
				<div className="flex items-center gap-3">
					<UndoRedo />
					<Select>
						<SelectTrigger className="max-w-xs">
							<BiSort />
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="blueberry">
									Relevance
								</SelectItem>
								<SelectItem value="grapes">
									Latest Update
								</SelectItem>
								<SelectItem value="apple">
									Date Added (asc)
								</SelectItem>
								<SelectItem value="banana">
									Date Added (desc)
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-3">
					{/* <p className="flex items-center gap-1">
						<BiFilterAlt />
						Filters:
					</p> */}
					<Select>
						<SelectTrigger className="h-min w-[180px] rounded-full py-1">
							<SelectValue placeholder="Courier" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="blueberry">
									Relevance
								</SelectItem>
								<SelectItem value="grapes">
									Latest Update
								</SelectItem>
								<SelectItem value="apple">
									Date Added (asc)
								</SelectItem>
								<SelectItem value="banana">
									Date Added (desc)
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select>
						<SelectTrigger className="h-min w-[180px] rounded-full py-1">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="blueberry">
									Relevance
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select>
						<SelectTrigger className="h-min py-1">
							<AiOutlineCalendar />
							<SelectValue placeholder="Jan 20, 2023 - Feb 09, 2023" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="blueberry">
									Relevance
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</section>
			<section>{children}</section>
		</main>
	)
}
