import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getInstanceDetails } from "@/lib/vultr";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // 1. Get the instance from our DB to find the Vultr ID
    const dbInstance = await prisma.instance.findUnique({
      where: { id },
    });

    if (!dbInstance || dbInstance.userId !== session.user.id) {
      return NextResponse.json({ message: "Instance not found" }, { status: 404 });
    }

    if (!dbInstance.vultrId) {
       return NextResponse.json({ message: "No Vultr ID associated" }, { status: 400 });
    }

    // 2. Fetch latest data from Vultr
    const vultrData = await getInstanceDetails(dbInstance.vultrId);

    // 3. Update our DB
    const updatedInstance = await prisma.instance.update({
      where: { id },
      data: {
        ipAddress: vultrData.main_ip,
        status: vultrData.status === "active" && vultrData.power_status === "running" ? "ACTIVE" : "PENDING",
        password: vultrData.default_password || dbInstance.password, // Only update if Vultr has it
      },
    });

    return NextResponse.json(updatedInstance);
  } catch (error: any) {
    console.error("Sync Error:", error);
    return NextResponse.json(
      { message: "Failed to sync instance" },
      { status: 500 }
    );
  }
}
