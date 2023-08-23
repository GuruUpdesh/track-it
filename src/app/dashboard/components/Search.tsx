"use client"

import React, { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useShipments } from "@/lib/shipmentsStore"

const Search = () => {
	const [shipments, searchShipments] = useShipments((state) => [
		state.shipments,
		state.searchShipments,
	])
	const [searchValue, setSearchValue] = React.useState("")
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearchValue(e.target.value)
	}

	useEffect(() => {
		searchShipments(searchValue)
	}, [searchValue, shipments])

	return <Input placeholder="Search..." onChange={handleChange} />
}

export default Search
