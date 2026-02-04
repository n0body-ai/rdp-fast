import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createRDPInstance } from "@/lib/vultr";
import { NextResponse } from "next/server";

// GET: List all instances for the logged-in user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const instances = await prisma.instance.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(instances);
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

// POST: Deploy a new instance
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Check for active subscription
  const sub = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: "active",
    },
  });

  if (!sub) {
    return NextResponse.json(
      { message: "Active subscription required. Please upgrade." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json().catch(() => ({})); // Handle empty body
    const selectedPlan = body.plan || "vc2-2c-4gb"; // Default

    // Validate plan (Security)
    const validPlans = ["vc2-1c-2gb", "vc2-2c-4gb", "vc2-4c-8gb"];
    const planToUse = validPlans.includes(selectedPlan) ? selectedPlan : "vc2-2c-4gb";

    const label = `rdp-${session.user.id.slice(0, 5)}-${Date.now()}`;
    
    // 1. Call Vultr API (Need to update createRDPInstance to accept plan)
    const vultrInstance = await createRDPInstance(label, planToUse);

    // 2. Save to DB
    const dbInstance = await prisma.instance.create({
      data: {
        userId: session.user.id,
        vultrId: vultrInstance.id,
        status: "PENDING", // It takes ~10 mins to boot
        region: vultrInstance.region,
        plan: vultrInstance.plan,
        username: "Administrator", // Default windows user
        password: vultrInstance.default_password || "Pending...", // Vultr sets this later
      },
    });

    return NextResponse.json(dbInstance, { status: 201 });
  } catch (error: any) {
    console.error("Deploy Error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to deploy instance" },
      { status: 500 }
    );
  }
}
