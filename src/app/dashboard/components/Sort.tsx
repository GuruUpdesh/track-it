"use client"

import React from "react"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { GoSortDesc } from "react-icons/go"
import { TSortOption, useShipments } from "@/lib/shipmentsStore"

const Sort = () => {
	const [sortOption, setSortOption] = useShipments((state) => [
		state.sortOption,
		state.setSortOption,
	])

	function handleSortChange(value: TSortOption) {
		setSortOption(value)
	}

	return (
		<Select
			value={sortOption}
			onValueChange={handleSortChange}
			defaultValue="position"
		>
			<SelectTrigger className="max-w-xs gap-1">
				<GoSortDesc />
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>
			<SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
				<SelectGroup>
					<SelectItem value="position">Manual Position</SelectItem>
					<SelectItem value="dateNewest">
						Date Added (Newest)
					</SelectItem>
					<SelectItem value="dateOldest">
						Date Added (Oldest)
					</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

export default Sort
