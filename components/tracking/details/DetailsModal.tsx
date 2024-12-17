import { TPackage } from "@/components/DashboardGrid"
import {
	TTrackingHistory,
	TPackageInfo,
} from "@/app/api/package/typesAndSchemas"
import HistoryLine from "@/components/tracking/HistoryLine"
import { PackageAction } from "@/context/packageContext/packageReducer"
import { getCourier } from "@/utils/courier"
import { AnimatePresence, motion } from "framer-motion"
// import Image from "next/image"
import React, { useMemo } from "react"
import { MdClose } from "react-icons/md"
import { BiCopy } from "react-icons/bi"
// import { BsArrowLeft } from "react-icons/bs"
import Balancer from "react-wrap-balancer"
import * as Tabs from "@radix-ui/react-tabs"
import "./styles/detailsModal.css"
import Modal from "@/components/ui/modal/Modal"
import CardImage from "../card/CardImage"
import useFadedScroll from "@/hooks/useFadedScroll"
import { formatDate, getTimeFromDate } from "@/utils/date"
import { toast } from "react-hot-toast"

type TrackingHistoryProps = {
	trackingHistory: TTrackingHistory[]
}

const TrackingHistory = ({ trackingHistory }: TrackingHistoryProps) => {
	return (
		<motion.div
			layoutScroll
			className="relative isolate flex flex-col-reverse px-6 sm:px-10 md:px-20"
		>
			<motion.div className="absolute left-[calc(5rem+39px)] h-full w-[1px] origin-top rounded-full bg-gradient-to-b from-white to-white/5" />
			{trackingHistory.map(
				(historyItem: TTrackingHistory, idx: number) => {
					const length = trackingHistory.length
					return (
						<motion.div key={historyItem.date} className="z-0">
							<HistoryLine
								historyItem={historyItem}
								topItem={idx === length - 1}
							/>
						</motion.div>
					)
				}
			)}
		</motion.div>
	)
}

type Props = {
	pkg: TPackage
	pkgInfo: TPackageInfo
	dispatchPackages: React.Dispatch<PackageAction>
	open: boolean
	setOpen: (open: boolean) => void
}

const DetailsModal = ({
	pkg,
	pkgInfo,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	dispatchPackages,
	open,
	setOpen,
}: Props) => {
	const tabsHighlightRef = React.useRef<HTMLDivElement>(null)
	const tabsRef = React.useRef<HTMLDivElement>(null)

	const courier = useMemo(() => {
		return getCourier(pkg.courier)
	}, [pkg.courier])

	function onTabHover(e: React.MouseEvent<HTMLButtonElement>) {
		if (!tabsHighlightRef.current || !tabsRef.current) return

		const target = e.target as HTMLDivElement
		const highlight = tabsHighlightRef.current
		const targetRect = target.getBoundingClientRect()
		const tabsRect = tabsRef.current.getBoundingClientRect()

		highlight.style.display = `block`
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

	function onTabsExit() {
		if (!tabsHighlightRef.current) return

		const highlight = tabsHighlightRef.current

		highlight.style.display = `none`
	}
	const { ref, onScroll, fadeStyles } = useFadedScroll(80)

	return (
		<Modal open={open} setOpen={setOpen} disabledContextStyles={true}>
			<AnimatePresence>
				<motion.div className="flex max-h-[80vh] min-h-[80vh] w-full flex-col overflow-hidden rounded-xl border border-indigo-400/25 bg-[#000000] sm:w-[500px] md:w-[650px] lg:w-[700px]">
					<motion.div
						layout
						className="flex justify-between bg-gradient-to-b from-[#110F1B] to-transparent p-4"
					>
						<div className="flex gap-2">
							<CardImage
								error={undefined}
								status={pkgInfo.status.status}
								deliveryLocation={
									pkgInfo.status.deliveryLocation
								}
							/>
							<div className="relative flex flex-col items-start">
								<motion.h1 className="flex w-[20ch] max-w-full items-center overflow-hidden whitespace-nowrap text-left text-2xl tracking-tighter text-yellow-50">
									{pkg.name}
								</motion.h1>
								<motion.a
									className="underline-link flex items-center gap-1 text-xs text-yellow-50"
									href={
										courier.tracking_url +
										pkg.trackingNumber
									}
									target="_blank"
								>
									{courier.icon}
									<motion.p>{courier.name}</motion.p>
								</motion.a>
							</div>
						</div>
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
						<div className="border-b border-indigo-400/25">
							<Tabs.List
								className="relative mx-2 max-w-fit"
								ref={tabsRef}
								onMouseLeave={onTabsExit}
							>
								<div
									ref={tabsHighlightRef}
									className="pointer-events-none absolute top-[10%] h-[80%] w-2 rounded-sm bg-indigo-400/20 opacity-0 transition-all"
								/>
								<Tabs.Trigger
									onMouseEnter={onTabHover}
									onMouseLeave={onTabExit}
									value="tracking-history"
									className="TabsTrigger mx-2 p-2 text-indigo-50/50 transition-all hover:text-indigo-400/80"
								>
									Tracking History
								</Tabs.Trigger>
								<Tabs.Trigger
									onMouseEnter={onTabHover}
									onMouseLeave={onTabExit}
									value="package-info"
									className="TabsTrigger mx-2 p-2 text-indigo-50/50 transition-all hover:text-indigo-400/80"
								>
									Package Info
								</Tabs.Trigger>
							</Tabs.List>
						</div>
						<Tabs.Content
							ref={ref}
							onScroll={onScroll}
							style={fadeStyles}
							value="tracking-history"
							className="mt-6 max-h-[calc(80vh-150px)] overflow-scroll overflow-x-hidden"
						>
							<TrackingHistory
								trackingHistory={
									pkgInfo ? pkgInfo.trackingHistory : []
								}
							/>
						</Tabs.Content>
						<Tabs.Content
							value="package-info"
							className="mt-6 px-6 sm:px-10 md:px-20"
						>
							<motion.section className="mb-6 origin-top rounded-lg border border-indigo-200/25 bg-indigo-200/10 p-4">
								<h1 className="text-md mb-1 border-b border-b-indigo-200/25 font-semibold capitalize tracking-tight">
									Shipment overview
								</h1>
								<div className="flex flex-col gap-3">
									{pkgInfo.eta &&
										pkgInfo.status.status !==
											"DELIVERED" && (
											<div>
												<h2 className="text-sm font-light uppercase tracking-wider text-yellow-50/50">
													Delivery estimate
												</h2>
												<p>
													{formatDate(pkgInfo.eta) +
														" by " +
														getTimeFromDate(
															pkgInfo.eta
														)}
												</p>
											</div>
										)}
									{pkgInfo.transitTime && (
										<div>
											<h2 className="text-sm font-light uppercase tracking-wider text-yellow-50/50">
												Transit time
											</h2>
											<p>{pkgInfo.transitTime}</p>
										</div>
									)}
									<div>
										<h2 className="text-sm font-light uppercase tracking-wider text-yellow-50/50">
											Tracking number
										</h2>
										<button
											onClick={() => {
												navigator.clipboard.writeText(
													pkg.trackingNumber
												)
												toast.success(
													"Copied to clipboard"
												)
											}}
											className="text-md flex h-min items-center gap-1 font-normal active:text-indigo-400"
										>
											<BiCopy />
											{pkg.trackingNumber}
										</button>
									</div>
									{pkgInfo.sourceAndDestinationString && (
										<div>
											<h2 className="text-sm font-light uppercase tracking-wider text-yellow-50/50">
												Details
											</h2>
											<Balancer>
												<p>
													{
														pkgInfo.sourceAndDestinationString
													}
												</p>
											</Balancer>
										</div>
									)}
								</div>
							</motion.section>
							<motion.section className="origin-top rounded-lg border border-indigo-200/25 bg-indigo-200/10 p-4">
								<h1 className="text-md mb-1 border-b border-b-indigo-200/25 font-semibold capitalize tracking-tight">
									Service
								</h1>
								<div className="flex flex-col gap-3">
									<div>
										<h2 className="text-sm font-light uppercase tracking-wider text-yellow-50/50">
											Courier
										</h2>
										<p>{courier.name}</p>
									</div>
									{pkgInfo.service && (
										<div>
											<h2 className="text-sm font-light uppercase tracking-wider text-yellow-50/50">
												Service
											</h2>
											<p>{pkgInfo.service}</p>
										</div>
									)}
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
