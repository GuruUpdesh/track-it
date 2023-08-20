import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({ publicRoutes: ["/api/shipment", "/"] })

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
