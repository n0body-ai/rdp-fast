import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * IMPORTANT:
 * - Node runtime (Prisma cannot run on Edge)
 * - Dynamic so Next.js does NOT evaluate at build time
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

