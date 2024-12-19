import { useRef } from "react"

const useFadedScroll = (basePercentage: number) => {
	const ref = useRef<HTMLDivElement>(null)
	const overflowing =
		(ref?.current?.scrollHeight || 1) > (ref?.current?.clientHeight || 0)

	function onScroll(e: React.UIEvent<HTMLDivElement>) {
		if (!ref.current) return
		// if the ref is overflowing
		const target = e.target as HTMLDivElement
		const percentage =
			basePercentage +
			(100 - basePercentage) *
				(((target.scrollTop /
					(target.scrollHeight - target.clientHeight)) *
					100) /
					100)

		ref.current.style.setProperty("--scrollPercentage", `${percentage}%`)
	}

	// define the fadeStyles object
	const fadeStyles = overflowing
		? {
				"--scrollPercentage": `${basePercentage}%`,
				WebkitMaskImage: `linear-gradient(black var(--scrollPercentage), transparent 100%)`,
				WebkitMaskMode: "alpha",
				WebkitMaskPositionY: "top",
			}
		: {}

	return { ref, onScroll, fadeStyles, basePercentage }
}

export default useFadedScroll
