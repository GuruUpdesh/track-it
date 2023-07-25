import { TPackage } from "@/components/DashboardGrid"
import { TrackingHistory, PackageInfo } from "@/app/api/package/typesAndSchemas"
import HistoryLine from "@/components/tracking/HistoryLine"
import { PackageAction } from "@/context/packageContext/packageReducer"
import {
	getCourierIconFromCode,
	getCourierStringFromCode,
	getCourierUrlsFromTrackingNumber,
} from "@/utils/courier"
import { AnimatePresence, motion } from "framer-motion"
// import Image from "next/image"
import React from "react"
import { MdClose } from "react-icons/md"
import { BiChevronDown, BiCopy } from "react-icons/bi"
// import { BsArrowLeft } from "react-icons/bs"
import Balancer from "react-wrap-balancer"
import * as Tabs from "@radix-ui/react-tabs"
import "./styles/detailsModal.css"
import Modal from "@/components/ui/modal/Modal"

type ToAndFromLocationProps = {
	startLocation: string
	endLocation: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ToAndFromLocation = ({
	startLocation,
	endLocation,
}: ToAndFromLocationProps) => {
	const foundStartLocation = !startLocation.includes("not found")
	const foundEndLocation = !endLocation.includes("not found")

	if (!foundStartLocation && !foundEndLocation) return null

	function getRouteDescription(
		startLocation: string | null,
		endLocation: string | null
	): string {
		let routeDescription = "Coming"
		if (startLocation) {
			routeDescription += ` from ${startLocation}`
		}
		if (endLocation) {
			routeDescription += ` to ${endLocation}`
		}
		return routeDescription
	}

	return (
		<p className="">
			<Balancer>
				{getRouteDescription(startLocation, endLocation)}
			</Balancer>
		</p>
	)
}

type TrackingHistoryProps = {
	trackingHistory: TrackingHistory[]
}

const TrackingHistory = ({ trackingHistory }: TrackingHistoryProps) => {
	const [trackingHistoryExpanded, setTrackingHistoryExpanded] =
		React.useState(false)
	return (
		<motion.div
			layoutScroll
			className="relative isolate flex flex-col-reverse px-20"
		>
			<motion.div
				className="absolute left-[calc(5rem+2.4rem)] h-full w-1 origin-top rounded-full bg-gradient-to-b from-indigo-900 to-indigo-700/10"
				initial={{ scaleY: 0 }}
				animate={{ scaleY: 1 }}
				transition={{
					delay: 0.3,
					duration: 2,
					ease: [0.075, 0.82, 0.165, 1],
				}}
			/>
			{trackingHistory.length > 3 && (
				<motion.button
					onClick={() =>
						setTrackingHistoryExpanded(!trackingHistoryExpanded)
					}
					transition={{
						delay: (trackingHistory.length - 1) * 0.05,
						duration: 0.5,
						ease: [0.075, 0.82, 0.165, 1],
					}}
					initial={{
						opacity: 0,
						transform: "translateY(-50px) scaleY(0.8)",
					}}
					animate={{
						opacity: 1,
						transform: "translateY(0px) scaleY(1)",
					}}
					exit={{
						opacity: 0,
						transform: "translateY(-50px) scaleY(0.8)",
					}}
					className="flex items-center rounded-lg px-6 py-3 text-indigo-200/50 hover:text-indigo-200"
				>
					<BiChevronDown
						className={
							"h-[32px] w-[32px] " +
							(trackingHistoryExpanded ? " rotate-180" : " ")
						}
					/>
					<p className=" ml-4 text-left ">
						{trackingHistoryExpanded
							? `Collapse`
							: `See ${trackingHistory.length - 3} more updates`}
					</p>
				</motion.button>
			)}
			{trackingHistory
				.slice(trackingHistoryExpanded ? 0 : -3)
				.map((historyItem: TrackingHistory, idx: number) => {
					const length = trackingHistoryExpanded
						? trackingHistory.length
						: trackingHistory.slice(-3).length
					return (
						<motion.div
							key={historyItem.date}
							transition={{
								delay: (length - idx) * 0.05,
								duration: 0.5,
								ease: [0.075, 0.82, 0.165, 1],
							}}
							initial={{
								opacity: 0,
								transform: "translateY(-50px) scaleY(0.8)",
							}}
							animate={{
								opacity: 1,
								transform: "translateY(0px) scaleY(1)",
							}}
							exit={{
								opacity: 0,
								transform: "translateY(-50px) scaleY(0.8)",
							}}
							className="z-0"
						>
							<HistoryLine
								historyItem={historyItem}
								topItem={idx === length - 1}
							/>
						</motion.div>
					)
				})}
		</motion.div>
	)
}

type Props = {
	pkg: TPackage
	pkgInfo: PackageInfo
	dispatchPackages: React.Dispatch<PackageAction>
	setOpen: (open: boolean) => void
}

const DetailsModal = ({
	pkg,
	pkgInfo,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	dispatchPackages,
	setOpen,
}: Props) => {
	const tabsHighlightRef = React.useRef<HTMLDivElement>(null)
	const tabsRef = React.useRef<HTMLDivElement>(null)

	function onTabHover(e: React.MouseEvent<HTMLButtonElement>) {
		if (!tabsHighlightRef.current || !tabsRef.current) return

		const target = e.target as HTMLDivElement
		const highlight = tabsHighlightRef.current
		const targetRect = target.getBoundingClientRect()
		const tabsRect = tabsRef.current.getBoundingClientRect()

		highlight.style.opacity = `1`
		highlight.style.width = `${targetRect.width}px`
		highlight.style.transform = `translateX(${
			targetRect.left - tabsRect.left
		}px)`
	}

	function onTabExit() {
		if (!tabsHighlightRef.current) return

		const highlight = tabsHighlightRef.current

		highlight.style.width = `0px`
		highlight.style.transform = `translateX(0px)`
		highlight.style.opacity = `0`
	}
	return (
		<Modal open={true} setOpen={setOpen} disabledContextStyles={true}>
			<AnimatePresence>
				<motion.div
					transition={{
						duration: 0.3,
						ease: [0.075, 0.82, 0.165, 1],
					}}
					layoutId={`card-${pkg.id}`}
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 50 }}
					className="flex max-h-[80vh] min-h-[80vh] w-[350px]  flex-col overflow-hidden rounded-xl border border-indigo-400/25 bg-[#000000] sm:w-[500px] md:w-[650px] lg:w-[700px]"
				>
					<motion.div
						layout
						className="flex justify-between bg-gradient-to-b from-[#110F1B] to-transparent p-4"
					>
						<div className="flex gap-2">
							<div className="relative flex flex-col items-start">
								<motion.h1 className="flex w-[20ch] max-w-full items-center overflow-hidden whitespace-nowrap text-left text-2xl tracking-tighter text-yellow-50">
									{pkg.name}
								</motion.h1>
								<motion.a
									className="underline-link flex items-center gap-1 text-xs text-indigo-300"
									href={
										getCourierUrlsFromTrackingNumber(
											pkg.trackingNumber
										)[0]
									}
									target="_blank"
								>
									{getCourierIconFromCode(pkg.courier)}
									<motion.p>
										{getCourierStringFromCode(pkg.courier)}
									</motion.p>
								</motion.a>
							</div>
						</div>
						{/* <button className="aspect-square w-min flex-none cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10">
									<MdMoreVert />
								</button> */}
						<button
							className="absolute right-2 top-2 aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10"
							onClick={() => {
								setOpen(false)
							}}
						>
							<MdClose />
						</button>
					</motion.div>
					<Tabs.Root defaultValue="tracking-history">
						<Tabs.List
							className="relative border-b border-b-yellow-50/25"
							ref={tabsRef}
						>
							<div
								ref={tabsHighlightRef}
								className="pointer-events-none absolute top-[10%] h-[80%] w-2 rounded-sm bg-yellow-50/20 opacity-0 transition-all"
							/>
							<Tabs.Trigger
								onMouseEnter={onTabHover}
								onMouseLeave={onTabExit}
								value="tracking-history"
								className="TabsTrigger mx-2 p-2 text-yellow-50/50 transition-all hover:text-yellow-50/80"
							>
								Tracking History
							</Tabs.Trigger>
							<Tabs.Trigger
								onMouseEnter={onTabHover}
								onMouseLeave={onTabExit}
								value="package-info"
								className="TabsTrigger mx-2 p-2 text-yellow-50/50 transition-all hover:text-yellow-50/80"
							>
								Package Info
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="tracking-history" className="mt-6">
							<TrackingHistory
								trackingHistory={
									pkgInfo ? pkgInfo.trackingHistory : []
								}
							/>
						</Tabs.Content>
						<Tabs.Content
							value="package-info"
							className="mt-6 px-20"
						>
							<motion.section
								className="mb-6 origin-top rounded-lg bg-white/10 p-4"
								initial={{ transform: "translateY(-50px)" }}
								animate={{ transform: "translateY(0px)" }}
								transition={{
									delay: 0,
									duration: 0.5,
									ease: [0.075, 0.82, 0.165, 1],
								}}
							>
								<h1 className="text-md mb-1 border-b border-b-white/10 font-semibold capitalize tracking-tight text-yellow-50">
									Shipment Overview
								</h1>
								<div>
									<h2 className="text-sm font-light uppercase tracking-wider text-yellow-50/50">
										tracking number
									</h2>
									<button className="text-md flex h-min items-center gap-1 font-normal text-yellow-50 hover:text-yellow-50 active:text-indigo-400">
										<BiCopy />
										{pkg.trackingNumber}
									</button>
								</div>
								<div className="mt-3">
									<h2 className="text-sm font-light uppercase tracking-wider text-yellow-50/50">
										details
									</h2>
									<ToAndFromLocation
										startLocation={pkgInfo.startLocation}
										endLocation={pkgInfo.endLocation}
									/>
								</div>
							</motion.section>
							<motion.section
								className="origin-top rounded-lg bg-white/10 p-4"
								initial={{ transform: "translateY(-50px)" }}
								animate={{ transform: "translateY(0px)" }}
								transition={{
									delay: 0,
									duration: 0.5,
									ease: [0.075, 0.82, 0.165, 1],
								}}
							>
								<h1 className="text-md mb-1 border-b border-b-white/10 font-semibold capitalize tracking-tight text-yellow-50">
									Services
								</h1>
								<div>
									<h2 className="text-sm font-light uppercase tracking-wider text-yellow-50/50">
										courier
									</h2>
									<p>
										{getCourierStringFromCode(pkg.courier)}
									</p>
								</div>
								<div className="mt-3">
									<h2 className="text-sm font-light uppercase tracking-wider text-yellow-50/50">
										service
									</h2>
									<p>{pkgInfo.service}</p>
								</div>
							</motion.section>
						</Tabs.Content>
					</Tabs.Root>
				</motion.div>
			</AnimatePresence>
		</Modal>
	)
}

export default DetailsModal
