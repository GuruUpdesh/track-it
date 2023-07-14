export default function NotFound() {
	return (
		<div className="flex min-h-[100vh] flex-col items-center justify-center">
			<video autoPlay loop muted playsInline style={{ width: 150 }}>
				<source src="/logo-spin.webm" type="video/webm" />
			</video>
			<div>
				<div className="flex items-center">
					<h1 className="mr-5 border-r border-white/30 p-1  pr-5 text-2xl font-semibold">
						404
					</h1>
					<h2 className="text-base font-normal leading-7">
						This page could not be found.
					</h2>
				</div>
			</div>
			<a href="/">Go to dashboard</a>
		</div>
	)
}
