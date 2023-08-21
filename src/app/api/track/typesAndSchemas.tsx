import { z } from "zod"

export const courierSchema = z.enum([
	"ups",
	"fedex",
	"usps",
	"ontrac",
	"shippo",
])
