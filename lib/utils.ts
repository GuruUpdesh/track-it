import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// from https://github.com/sadmann7/skateshop/blob/main/src/lib/utils.ts
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
