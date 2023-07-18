import { HistoryLine } from "./Card/Card"
import { PackageAction, TPackage } from "./Packages"
import { PackageInfo } from "@/app/api/package/typesAndSchemas"
import {
	getCourierIconFromCode,
	getCourierStringFromCode,
	getCourierUrlsFromTrackingNumber,
} from "@/utils/courier"
import * as Dialog from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import React from "react"
import "react-loading-skeleton/dist/skeleton.css"

type Props = {
	pkg: TPackage
	pkgInfo: PackageInfo
	dispatchPackages: React.Dispatch<PackageAction>
	handleClose: (open: boolean) => void
}

const DetailsModal = ({
	pkg,
	pkgInfo,
	dispatchPackages,
	handleClose,
}: Props) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const packageInfo = pkgInfo
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const dispatchPackagesAction = dispatchPackages
	return (
		<Dialog.Root open={true} modal={true} onOpenChange={handleClose}>
			<Dialog.Portal>
				<Dialog.Overlay className="Modal-overlay absolute left-0 top-0 h-full w-full z-40" />
				<Dialog.Content className="absolute left-[50%] top-[50%] min-h-[200px] translate-x-[-50%] translate-y-[-50%] z-50 outline-none">
					<AnimatePresence>
						<motion.div
							layoutId={`card-${pkg.id}`}
							transition={{
								duration: 0.3,
								ease: [0.075, 0.82, 0.165, 1],
							}}
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
							className="bg-[#110F1B] border border-indigo-400/25 rounded-xl min-w-[420px]"
						>
							<motion.div
								layout
								className="flex justify-between p-2"
							>
								<div className="flex max-w-[80%] gap-2">
									<div className="relative flex aspect-square min-w-[50px] items-center justify-center rounded-full border border-indigo-400/25">
										<div className="absolute z-0 flex h-full w-[calc(100%)] items-center justify-center rounded-full bg-[#110F1B]" />
										<Image
											src="/package.svg"
											alt="Package Box"
											width={27}
											height={27}
											priority
											className="pointer-events-none z-10 h-auto"
										/>
									</div>
									<div className="relative flex max-w-[calc(100%-50px)] flex-col items-start">
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
							</motion.div>
							{packageInfo && (
								<>
									{packageInfo.trackingHistory.map(
										(historyItem) => (
											<HistoryLine
												key={historyItem.date}
												historyItem={historyItem}
											/>
										)
									)}
								</>
							)}
						</motion.div>
					</AnimatePresence>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

export default DetailsModal
