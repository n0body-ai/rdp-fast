export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteInstance } from "@/lib/vultr";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // 1. Verify ownership
    const dbInstance = await prisma.instance.findUnique({
      where: { id },
    });

    if (!dbInstance || dbInstance.userId !== session.user.id) {
      return NextResponse.json({ message: "Instance not found" }, { status: 404 });
    }

    // 2. Delete from Vultr (if linked)
    if (dbInstance.vultrId) {
      try {
        await deleteInstance(dbInstance.vultrId);
      } catch (err) {
        console.error("Vultr delete failed (might already be gone):", err);
        // Continue to delete from DB anyway
      }
    }

    // 3. Delete from DB
    await prisma.instance.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Instance deleted" });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { message: "Failed to delete instance" },
      { status: 500 }
    );
  }
}
