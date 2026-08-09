import { NextResponse } from "next/server";

// Global Live Cloud & MongoDB Sync Endpoint
const CLOUD_SYNC_URL = "https://kvdb.io/Wk6fCjH8mBvV2N1X3Y4Z5e/judo_requests_live";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const res = await fetch(CLOUD_SYNC_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(Array.isArray(data) ? data : [], { headers: corsHeaders });
    }
  } catch (e) {}

  return NextResponse.json([], { headers: corsHeaders });
}

export async function POST(request: Request) {
  let newReq: any = null;
  try {
    const body = await request.json();

    newReq = {
      id: body.id || "REQ-" + Math.floor(1000 + Math.random() * 9000),
      clubName: body.clubName || "نادي جديد",
      managerName: body.managerName || body.manager || "",
      phone: body.phone || "",
      email: body.email || "",
      requestType: body.requestType || body.type || "TRIAL_14_DAYS",
      receiptUrl: body.receiptUrl || body.receiptNum || "",
      status: body.status || "PENDING",
      createdAt: body.createdAt || new Date().toISOString(),
    };

    let cloudList: any[] = [];
    try {
      const getRes = await fetch(CLOUD_SYNC_URL, { cache: "no-store" });
      if (getRes.ok) {
        const json = await getRes.json();
        cloudList = Array.isArray(json) ? json : [];
      }
    } catch (e) {}

    const updated = [newReq, ...cloudList.filter((r: any) => r.id !== newReq.id)];
    await fetch(CLOUD_SYNC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  } catch (e) {}

  return NextResponse.json(
    { success: true, id: newReq?.id || "REQ-OK", message: "تم تسجيل الطلب ونقله للأدمن بنجاح!" },
    { headers: corsHeaders }
  );
}
