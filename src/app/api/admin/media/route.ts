import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";

/** GET /api/admin/media — list all media items */
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");
  const items = await db.mediaItem.findMany({
    where: folder ? { folder } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

/** POST /api/admin/media — upload a new image (base64 data URL) */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { filename, dataUrl, alt, folder } = body;

  if (!filename || !dataUrl) {
    return NextResponse.json({ error: "filename and dataUrl are required" }, { status: 400 });
  }

  // Validate it's a data URL
  if (!dataUrl.startsWith("data:")) {
    return NextResponse.json({ error: "dataUrl must be a valid data URL" }, { status: 400 });
  }

  // Extract mime type and calculate size
  const mimeMatch = dataUrl.match(/^data:(.+?);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
  const base64Data = dataUrl.split(",")[1] || "";
  const size = Math.floor((base64Data.length * 3) / 4);

  // Limit to 2MB
  if (size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large. Maximum 2MB." }, { status: 400 });
  }

  const item = await db.mediaItem.create({
    data: {
      filename,
      url: dataUrl,
      alt: alt || null,
      mimeType,
      size,
      folder: folder || "general",
    },
  });

  return NextResponse.json({ ok: true, item });
}
