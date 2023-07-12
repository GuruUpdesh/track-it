"use client"

import React from "react"
import Card from "@/components/Card/Card"
import useLocalStorage from "@/hooks/useLocalStorageHook"

type TPackage = {
	id: number
	name: string
	trackingNumber: string
	courier: string
}

const Grid = () => {
	const [cards, setCards] = useLocalStorage<TPackage[]>("packages", [])

	function handleAddPackage() {
		const newCard: TPackage = {
			id: Date.now(),
			name: "",
			trackingNumber: "",
			courier: "UPS",
		}

		setCards([...cards, newCard])
	}
	return (
		<div>
			<button onClick={handleAddPackage}>add</button>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{cards.map((pkg) => (
					<Card key={pkg.id} />
				))}
			</div>
		</div>
	)
}

export default Grid
