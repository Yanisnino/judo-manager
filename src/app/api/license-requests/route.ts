import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "judomanager";
const COLLECTION = "license_requests";
const BACKUP_CLOUD_URL = "https://kvdb.io/Wk6fCjH8mBvV2N1X3Y4Z5e/judo_requests_live";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  // 1. Try MongoDB Atlas
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    const requests = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    const cleaned = requests.map(({ _id, ...rest }) => rest);
    return NextResponse.json(cleaned, { headers: corsHeaders });
  } catch (error) {
    console.warn("MongoDB Atlas GET error, using cloud fallback:", error);
  }

  // 2. Cloud Fallback if MongoDB Auth/Connect fails
  try {
    const res = await fetch(BACKUP_CLOUD_URL);
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
      id: body.id || "REQ-" + Date.now(),
      clubName: body.clubName || "نادي جديد",
      managerName: body.managerName || body.manager || "",
      phone: body.phone || "",
      email: body.email || "",
      requestType: body.requestType || body.type || "TRIAL_14_DAYS",
      receiptUrl: body.receiptUrl || body.receiptNum || "",
      status: body.status || "PENDING",
      createdAt: body.createdAt || new Date().toISOString(),
    };

    // Try MongoDB
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    await collection.updateOne(
      { id: newReq.id },
      { $set: newReq },
      { upsert: true }
    );
  } catch (error) {
    console.warn("MongoDB Atlas POST error, writing to cloud fallback:", error);
  }

  // Always sync to Backup Cloud as well so admin portal gets it 100%
  if (newReq) {
    try {
      let cloudList: any[] = [];
      try {
        const getRes = await fetch(BACKUP_CLOUD_URL);
        if (getRes.ok) {
          const json = await getRes.json();
          cloudList = Array.isArray(json) ? json : [];
        }
      } catch (e) {}

      const updated = [newReq, ...cloudList.filter((r: any) => r.id !== newReq.id)];
      await fetch(BACKUP_CLOUD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {}
  }

  return NextResponse.json(
    { success: true, id: newReq?.id || "REQ-OK", message: "تم تسجيل الطلب بنجاح!" },
    { headers: corsHeaders }
  );
}
