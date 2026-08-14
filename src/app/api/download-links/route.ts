import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// ── 1. الأدمن يتولّد رابط تحميل مؤقت صالح لمرة واحدة ─────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clubName, managerName } = body;

    const token = "DL-" + crypto.randomBytes(12).toString("hex").toUpperCase();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 Hours

    const client = await clientPromise;
    const db = client.db("judomanager");

    const linkDoc = {
      token,
      clubName: clubName || "نادي الجودو",
      managerName: managerName || "",
      isUsed: false,
      usedAt: null,
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    await db.collection("download_links").insertOne(linkDoc);

    const downloadUrl = `https://judo-manager.vercel.app/api/download/${token}`;

    return NextResponse.json({
      success: true,
      token,
      downloadUrl,
      message: "تم توليد رابط تحميل آمن صالح لمرة واحدة فقط!"
    }, { headers: corsHeaders });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500, headers: corsHeaders });
  }
}
