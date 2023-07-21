import { TPackage } from "./Packages"
import { TrackingHistory, PackageInfo } from "@/app/api/package/typesAndSchemas"
import { HistoryLine } from "@/components/card/Card"
import { PackageAction } from "@/context/packageContext/packageReducer"
import {
	getCourierIconFromCode,
	getCourierStringFromCode,
	getCourierUrlsFromTrackingNumber,
} from "@/utils/courier"
import * as Dialog from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
// import Image from "next/image"
import React from "react"
import { MdClose } from "react-icons/md"
import { BiChevronDown } from "react-icons/bi"
// import { BsArrowLeft } from "react-icons/bs"
import Balancer from "react-wrap-balancer"

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
	const [trackingHistoryExpanded, setTrackingHistoryExpanded] =
		React.useState(false)
	return (
		<Dialog.Root open={true} modal={true} onOpenChange={setOpen}>
			<Dialog.Portal>
				<Dialog.Overlay className="Modal-overlay absolute left-0 top-0 z-40 h-full w-full" />
				<Dialog.Content className="absolute left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] outline-none">
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
									{/* <button
										className="aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10"
										onClick={() => {
											setOpen(false)
										}}
									>
										<BsArrowLeft />
									</button> */}
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
											{getCourierIconFromCode(
												pkg.courier
											)}
											<motion.p>
												{getCourierStringFromCode(
													pkg.courier
												)}
											</motion.p>
										</motion.a>
									</div>
								</div>
								{/* <div>
									<ToAndFromLocation
										startLocation={pkgInfo.startLocation}
										endLocation={pkgInfo.endLocation}
									/>
									<button className="h-min flex items-center gap-1 text-yellow-50/50 hover:text-yellow-50/75 active:text-indigo-400">
										<BiCopy />
										{pkg.trackingNumber}
									</button>
								</div> */}

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
								{pkgInfo && (
									<>
										{pkgInfo.trackingHistory.length > 3 && (
											<motion.button
												onClick={() =>
													setTrackingHistoryExpanded(
														!trackingHistoryExpanded
													)
												}
												transition={{
													delay:
														(pkgInfo.trackingHistory
															.length -
															1) *
														0.05,
													duration: 0.5,
													ease: [
														0.075, 0.82, 0.165, 1,
													],
												}}
												initial={{
													opacity: 0,
													transform:
														"translateY(-50px) scaleY(0.8)",
												}}
												animate={{
													opacity: 1,
													transform:
														"translateY(0px) scaleY(1)",
												}}
												exit={{
													opacity: 0,
													transform:
														"translateY(-50px) scaleY(0.8)",
												}}
												className="flex items-center rounded-lg px-6 py-3 text-indigo-200/50 hover:text-indigo-200"
											>
												<BiChevronDown
													className={
														"h-[32px] w-[32px] " +
														(trackingHistoryExpanded
															? " rotate-180"
															: " ")
													}
												/>
												<p className=" ml-4 text-left ">
													{trackingHistoryExpanded
														? `Collapse`
														: `See ${
																pkgInfo
																	.trackingHistory
																	.length - 3
														  } more updates`}
												</p>
											</motion.button>
										)}
										{pkgInfo.trackingHistory
											.slice(
												trackingHistoryExpanded ? 0 : -3
											)
											.map(
												(
													historyItem: TrackingHistory,
													idx: number
												) => {
													const length =
														trackingHistoryExpanded
															? pkgInfo
																	.trackingHistory
																	.length
															: pkgInfo.trackingHistory.slice(
																	-3
															  ).length
													return (
														<motion.div
															key={
																historyItem.date
															}
															transition={{
																delay:
																	(length -
																		idx) *
																	0.05,
																duration: 0.5,
																ease: [
																	0.075, 0.82,
																	0.165, 1,
																],
															}}
															initial={{
																opacity: 0,
																transform:
																	"translateY(-50px) scaleY(0.8)",
															}}
															animate={{
																opacity: 1,
																transform:
																	"translateY(0px) scaleY(1)",
															}}
															exit={{
																opacity: 0,
																transform:
																	"translateY(-50px) scaleY(0.8)",
															}}
															className="z-0"
														>
															<HistoryLine
																historyItem={
																	historyItem
																}
																detailedView={
																	true
																}
																topItem={
																	idx ===
																	length - 1
																}
															/>
														</motion.div>
													)
												}
											)}
									</>
								)}
							</motion.div>
						</motion.div>
					</AnimatePresence>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

export default DetailsModal
