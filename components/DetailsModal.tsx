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
import Image from "next/image"
import React from "react"
// import { BiCopy } from "react-icons/bi"
import { MdMoreVert, MdClose } from "react-icons/md"
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
	return (
		<Dialog.Root open={true} modal={true} onOpenChange={setOpen}>
			<Dialog.Portal>
				<Dialog.Overlay className="Modal-overlay absolute left-0 top-0 h-full w-full z-40" />
				<Dialog.Content className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 outline-none">
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
							className="bg-[#000000] border border-indigo-400/25 rounded-xl  min-h-[80vh] max-h-[80vh] flex flex-col overflow-hidden w-[350px] sm:w-[500px] md:w-[650px] lg:w-[700px]"
						>
							<motion.div
								layout
								className="flex justify-between border-b border-b-indigo-400/20 bg-[#110F1B] p-4"
							>
								<div className="flex gap-2">
									<div className="relative flex h-[50px] aspect-square min-w-[50px] items-center justify-center rounded-full border border-indigo-400/25">
										<Image
											src="/package.svg"
											alt="Package Box"
											width={27}
											height={27}
											priority
											className="pointer-events-none z-10 h-auto"
										/>
									</div>
									<div className="relative flex flex-col items-start">
										<motion.h3 className="flex items-center w-[20ch] max-w-full overflow-hidden whitespace-nowrap text-left text-lg font-semibold tracking-tighter text-yellow-50">
											{pkg.name}
										</motion.h3>
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

								<button className="flex-none aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10 w-min">
									<MdMoreVert />
								</button>
								<button
									className="absolute right-2 top-2 aspect-square cursor-pointer rounded-full p-2 text-yellow-50 outline-none hover:bg-yellow-50/10"
									onClick={() => {
										setOpen(false)
									}}
								>
									<MdClose />
								</button>
							</motion.div>
							{/* <motion.div className="text-sm flex flex-col w-fit gap-2 py-2">
								<p className="py-1 px-4 bg-sky-400/10 rounded-full text-sky-400 flex items-center gap-2">
									<GrStatusCriticalSmall />
									{pkgInfo.status.detailedStatus}
								</p>
								<ToAndFromLocation
									startLocation={pkgInfo.startLocation}
									endLocation={pkgInfo.endLocation}
								/>
								{pkgInfo.eta && (
									<p className="py-1 px-4 bg-green-400/10 rounded-full text-green-400 flex gap-1 items-center">
										<AiFillClockCircle />
										Expected delivery on
										{" " + formatDate(pkgInfo.eta) + " by "}
										{getTimeFromDate(pkgInfo.eta)}
									</p>
								)}
							</motion.div> */}
							<h3
							// className="whitespace-nowrap text-left text-lg font-semibold tracking-tighter text-yellow-50 pl-4"
							>
								Tracking History
							</h3>
							<motion.div
								layoutScroll
								className="before:content-[''] relative before:absolute before:left-[calc(25px+0.5rem)] before:top-0 before:h-full before:z-0 before:w-1 before:bg-indigo-400/25"
							>
								{pkgInfo && (
									<>
										{pkgInfo.trackingHistory.map(
											(
												historyItem: TrackingHistory,
												idx: number
											) => (
												<motion.div
													key={historyItem.date}
													transition={{
														delay: idx * 0.05,
														duration: 0.5,
														ease: [
															0.075, 0.82, 0.165,
															1,
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
													// className="border-b border-b-white/10 last:border-b-0"
												>
													<HistoryLine
														historyItem={
															historyItem
														}
														detailedView={true}
													/>
												</motion.div>
											)
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
