import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "judomanager";
const COLLECTION = "license_requests";

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
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    const requests = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    // Remove MongoDB internal _id for clean JSON
    const cleaned = requests.map(({ _id, ...rest }) => rest);

    return NextResponse.json(cleaned, { headers: corsHeaders });
  } catch (error) {
    console.error("MongoDB GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newReq = {
      id: body.id || "REQ-" + Date.now(),
      clubName: body.clubName || "نادي جديد",
      managerName: body.managerName || body.manager || "",
      phone: body.phone || "",
      email: body.email || "",
      requestType: body.requestType || body.type || "LIFETIME_PRO",
      receiptUrl: body.receiptUrl || body.receiptNum || "",
      status: body.status || "PENDING",
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // Upsert: update if exists, insert if not
    await collection.updateOne(
      { id: newReq.id },
      { $set: newReq },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true, id: newReq.id, message: "✅ تم إرسال الطلب بنجاح!" },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("MongoDB POST error:", error);
    return NextResponse.json(
      { success: false, message: "فشل في إرسال الطلب" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID مطلوب" },
        { status: 400, headers: corsHeaders }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    await collection.updateOne({ id }, { $set: updates });

    return NextResponse.json(
      { success: true, message: "تم التحديث بنجاح!" },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("MongoDB PUT error:", error);
    return NextResponse.json(
      { success: false, message: "فشل في التحديث" },
      { status: 500, headers: corsHeaders }
    );
  }
}
