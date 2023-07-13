import Grid from "@/components/Test/Packages"
import { GetServerSideProps } from "next"

const Home = () => {
	return (
		<main className="md:p-18 flex min-h-screen flex-col items-center p-10 lg:p-24">
			<Grid />
		</main>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const host = context.req.headers.host

	// Check if the host is localhost
	if (!host || !host.startsWith("localhost")) {
		return {
			notFound: true, // Returns a 404 status
		}
	}

	// If host is localhost, proceed with page rendering
	return {
		props: {}, // Will be passed to the page component as props
	}
}

export default Home
