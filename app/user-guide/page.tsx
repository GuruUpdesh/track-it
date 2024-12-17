import Link from "next/link"
import { BiArrowBack } from "react-icons/bi"

export default function UserGuide() {
	return (
		<main className="flex h-screen overflow-hidden px-4">
			<nav className="flex h-screen flex-col gap-2 border-r border-white/10 p-4">
				<Link href="/">
					<button className="mb-4 flex w-full items-center gap-1 whitespace-nowrap rounded-md bg-white px-4 py-1 text-black">
						<BiArrowBack />
						Dashboard
					</button>
				</Link>
				<h5 className="whitespace-nowrap">Getting Started</h5>
				<Link
					href="#adding-a-shipment"
					className="cursor-pointer whitespace-nowrap text-white/50 transition-colors hover:text-white"
				>
					Adding a Shipment
				</Link>
				<Link
					href="#viewing-detailed-tracking-history"
					className="cursor-pointer whitespace-nowrap text-white/50 transition-colors hover:text-white"
				>
					Viewing Detailed Tracking History
				</Link>
				<h5 className="whitespace-nowrap">Features</h5>
				<Link
					href="#finding-your-shipments"
					className="cursor-pointer whitespace-nowrap text-white/50 transition-colors hover:text-white"
				>
					Finding your Shipments
				</Link>
				<Link
					href="#organizing-your-shipments"
					className="cursor-pointer whitespace-nowrap text-white/50 transition-colors hover:text-white"
				>
					Organizing your Shipments
				</Link>
				<Link
					href="#deleting-your-shipments"
					className="cursor-pointer whitespace-nowrap text-white/50 transition-colors hover:text-white"
				>
					Deleting Shipments
				</Link>
				<Link
					href="#courier-website"
					className="cursor-pointer whitespace-nowrap text-white/50 transition-colors hover:text-white"
				>
					Viewing Courier Website
				</Link>
				<Link
					href="#editing"
					className="cursor-pointer whitespace-nowrap text-white/50 transition-colors hover:text-white"
				>
					Editing Existing Shipments
				</Link>
				<h5 className="whitespace-nowrap">Other</h5>
				<Link
					href="#shortcuts"
					className="cursor-pointer whitespace-nowrap text-white/50 transition-colors hover:text-white"
				>
					Shortcuts
				</Link>
				<div className="h-1 w-full" />
			</nav>
			<div
				id="content"
				className="h-screen max-w-[800px] overflow-y-scroll scroll-smooth px-10 py-4"
			>
				<h1 className="mb-12 border-b border-white/10 text-4xl font-semibold">
					User Guide
				</h1>
				<section
					id="adding-a-shipment"
					className="relative mb-12 leading-7"
				>
					<h2 className="my-3 text-2xl font-semibold">
						<a className="adding-a-shipment">Adding a Shipment</a>
					</h2>
					<p className="text-lg text-white/75">
						To start using TrackIt’s features, you must first add a
						shipment.
					</p>
					<ul className="text-md my-3 list-decimal rounded-lg bg-white/5 p-6 text-white/75">
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">
								Enter Tracking Number
							</b>
							: Type a valid tracking number into the input field.
							(The tracking number must belong to UPS, USPS,
							FedEx, or OnTrac).
						</li>
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">
								Add to Dashboard
							</b>
							: Click the plus button or hit enter to add the
							shipment and instantly see the shipment status.
						</li>
						<li className="ml-6">
							<b className="font-medium text-white">
								Name the Package
							</b>
							: After adding the shipment, you are ready to start
							typing its name. I suggest a short name that&apos;s
							memorable and easy to identify later on.
							<p className="mt-3 text-sm">
								(If nothing happens when you type, simply click
								the &quot;Type name…&quot; input field and try
								again).
							</p>
						</li>
					</ul>
					<img
						src="/guide/add.png"
						className="rounded-3xl border border-white/25"
					/>
				</section>

				<section
					id="viewing-detailed-tracking-history"
					className="relative mb-12 leading-7"
				>
					<h2 className="my-3 text-2xl font-semibold">
						<a className="adding-a-shipment">
							Viewing Detailed Tracking History
						</a>
					</h2>
					<p className="text-lg text-white/75">
						To view detailed information about your shipments,
						simply follow these instructions.
					</p>
					<ul className="text-md my-3 list-decimal rounded-lg bg-white/5 p-6 text-white/75">
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">
								Select Shipment
							</b>
							: Hover over the desired shipment and click the
							details box located under the name to expand.
							<p className="mt-2 text-white">
								Alternatively, you can click access this view
								by:
							</p>
							<ul className="list-inside list-disc text-sm">
								<li className="mb-1">
									Clicking on expand icon button located next
									to the name while hovering.
								</li>
								<li className="mb-1">
									Click on the 3 vertical dots button located
									next to the name and then clicking the{" "}
									<span className="whitespace-nowrap rounded-md border border-sky-500 bg-sky-500/25 px-1 py-0.5 text-sky-500">
										Open Detailed View
									</span>{" "}
									option.
								</li>
								<li>
									Right-clicking the shipment then clicking{" "}
									<span className="whitespace-nowrap rounded-md border border-sky-500 bg-sky-500/25 px-1 py-0.5 text-sky-500">
										Open Detailed View
									</span>
									.
								</li>
							</ul>
						</li>
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">
								View History
							</b>
							: See the entire tracking history and switch to the
							package details tab for more information.
						</li>
						<li className="ml-6">
							<b className="font-medium text-white">
								View Package Info
							</b>
							: Click on the Package Info tab located below the
							shipment name.
						</li>
					</ul>
					<img
						src="/guide/details.png"
						className="rounded-3xl border border-white/25"
					/>
				</section>
				<section
					id="finding-your-shipments"
					className="relative mb-12 leading-7"
				>
					<h2 className="my-3 text-2xl font-semibold">
						<a className="adding-a-shipment">
							Finding your Shipments
						</a>
					</h2>
					<p className="text-lg text-white/75">
						As you add more shipments, you may need to find specific
						ones. TrackIt offers several tools to help.
					</p>
					<ul className="text-md my-3 list-decimal rounded-lg bg-white/5 p-6 text-white/75">
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">Search</b>:
							Use the search input to find shipments by name.
						</li>
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">Sort</b>:
							Click the sort button to order shipments by date
							added, with options for manual, newest, or oldest
							sorting.
						</li>
						<li className="ml-6">
							<b className="font-medium text-white">Filter</b>:
							Apply courier and status filters to narrow down
							results
						</li>
					</ul>
					<img
						src="/guide/find.png"
						className="rounded-3xl border border-white/25"
					/>
				</section>
				<section
					id="organizing-your-shipments"
					className="relative mb-12 leading-7"
				>
					<h2 className="my-3 text-2xl font-semibold">
						<a className="adding-a-shipment">
							Organizing your Shipments
						</a>
					</h2>
					<p className="text-lg text-white/75">
						Sometimes, it&apos;s nice to have control over the order
						in which your shipments appear.
					</p>
					<ul className="text-md my-3 list-decimal rounded-lg bg-white/5 p-6 text-white/75">
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">Move</b>: Open
							the desired shipments more menu (3 vertical dots
							button located next to the name) and locate the Move
							option, hover until Left and Right options appear.
							If enabled when clicked these options will move your
							shipment left or right one square on the dashboard.
						</li>
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">
								Full Reorder
							</b>
							: Open any shipments more menu (3 vertical dots
							button located next to the name) and locate the
							Reorder All option. Click it, and a dialog will
							appear with a list of all your shipments. Simply
							drag and drop them into place and click save to see
							the reorder take place..
						</li>
					</ul>
					<img
						src="/guide/organize.png"
						className="rounded-3xl border border-white/25"
					/>
				</section>
				<section
					id="deleting-your-shipments"
					className="relative mb-12 leading-7"
				>
					<h2 className="my-3 text-2xl font-semibold">
						<a className="adding-a-shipment">Deleting Shipments</a>
					</h2>
					<p className="text-lg text-white/75">
						If a shipment is old and no longer available or has been
						delivered and is cluttering up your dashboard, it might
						make sense to delete it.
					</p>
					<ul className="text-md my-3 list-decimal rounded-lg bg-white/5 p-6 text-white/75">
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">
								Delete a Single Shipment
							</b>
							: Open any shipments more menu (3 vertical dots
							button located next to the name) and locate the
							Delete option (in red). Click it, and the shipment
							will be deleted.
							<p className="mt-3 text-sm">
								If this was a mistake, simply press ctrl or
								command + z or click the undo button from the
								deletion successful popup.
							</p>
						</li>
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">
								Delete Multiple Shipments
							</b>
							: Place your mouse within the shipments grid and
							drag a selection selecting multiple shipments.
							Shipments that are selected will be marked.
							<p className="my-2 rounded-lg border border-emerald-500 bg-emerald-500/25 px-3 py-1">
								<b>Pro Tip</b>: If you hold shift, you can make
								multiple selections.
							</p>
							<p>
								Then right-click any shipment and select Delete
								Selected.
							</p>
							<b className="text-red-500">
								Warning deletion can&apos;t be undone.
							</b>
						</li>
					</ul>
					<img
						src="/guide/delete.png"
						className="rounded-3xl border border-white/25"
					/>
				</section>
				<section
					id="courier-website"
					className="relative mb-12 leading-7"
				>
					<h2 className="my-3 text-2xl font-semibold">
						<a className="adding-a-shipment">
							Viewing Your Shipment on the Couriers Website
						</a>
					</h2>
					<p className="text-lg text-white/75">
						Sometimes, you might want to view your shipment on the
						Couriers website instead of TrackIt.
					</p>
					<ul className="text-md my-3 list-disc rounded-lg bg-white/5 p-6 text-white/75">
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">Option 1</b>:
							Bellow is the shipment name. There is the
							courier&apos;s name this is a link to their
							website&apos;s tracking and will automatically open
							a new tab and take you to the tracking page for your
							shipment.
						</li>
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">Option 2</b>:
							Open any shipments more menu (3 vertical dots button
							located next to the name) and select the Open
							Courier Website option. This works the same as
							option 1.
						</li>
					</ul>
					<img
						src="/guide/web.png"
						className="rounded-3xl border border-white/25"
					/>
				</section>
				<section id="editing" className="relative mb-12 leading-7">
					<h2 className="my-3 text-2xl font-semibold">
						<a className="adding-a-shipment">
							Viewing Your Shipment on the Couriers Website
						</a>
					</h2>
					<p className="text-lg text-white/75">
						Sometimes, you might want to view your shipment on the
						Couriers website instead of TrackIt.
					</p>
					<ul className="text-md my-3 list-disc rounded-lg bg-white/5 p-6 text-white/75">
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">Edit Name</b>:
							Click on the name or use the &quot;Edit&quot; option
							in the shipment&apos;s menu.
						</li>
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">
								Edit Tracking Number
							</b>
							: Use the &quot;Edit&quot; option in the
							shipment&apos;s menu or create a new shipment with
							the desired tracking number.
						</li>
						<li className="ml-6">
							<b className="font-medium text-white">
								Override Courier
							</b>
							: If the courier detection is incorrect, use the
							&quot;Override Courier&quot; option in the
							shipment&apos;s menu to select the desired courier.
						</li>
					</ul>
					<img
						src="/guide/edit.png"
						className="rounded-3xl border border-white/25"
					/>
				</section>
				<section id="shortcuts" className="relative mb-12 leading-7">
					<h2 className="my-3 text-2xl font-semibold">
						<a className="adding-a-shipment">Shotcuts</a>
					</h2>
					<p className="text-lg text-white/75">
						It&apos;s nice to move around quickly, and TrackIt is
						designed to help you save time. A full list of shortcuts
						can be found by clicking on the question mark (?) icon
						in the bottom right corner, then selecting Keyboard
						Shortcuts and viewing the shortcuts there. For your
						convenience, here is a list of shortcuts.
					</p>
					<ul className="text-md my-3 list-disc rounded-lg bg-white/5 p-6 text-white/75">
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">Undo</b>: ctrl
							or cmd + z
						</li>
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">Search</b>: /
						</li>
						<li className="mb-2 ml-6">
							<b className="font-medium text-white">Add</b>: ctrl
							or cmd + shift + n
						</li>
						<li className="ml-6">
							<b className="font-medium text-white">Select All</b>
							: ctrl or cmd + a
						</li>
					</ul>
				</section>
			</div>
		</main>
	)
}
