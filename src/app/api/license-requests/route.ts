import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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
    const db = client.db("judomanager");
    const requests = await db.collection("license_requests").find({}).sort({ createdAt: -1 }).toArray();

    const formatted = requests.map(r => ({
      id: r.id || r._id.toString(),
      clubName: r.clubName,
      managerName: r.managerName,
      phone: r.phone,
      email: r.email,
      requestType: r.requestType,
      receiptUrl: r.receiptUrl || "",
      status: r.status,
      generatedKey: r.generatedKey || "",
      createdAt: r.createdAt,
    }));

    return NextResponse.json(formatted, { headers: corsHeaders });
  } catch (e) {
    console.error("MongoDB GET error:", e);
    return NextResponse.json([], { headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("judomanager");

    const newReq = {
      id: body.id || "REQ-" + Math.floor(1000 + Math.random() * 9000),
      clubName: body.clubName || "نادي جديد",
      managerName: body.managerName || "",
      phone: body.phone || "",
      email: body.email || "",
      requestType: body.requestType || "TRIAL_14_DAYS",
      receiptUrl: body.receiptUrl || "",
      hardwareId: body.hardwareId || "",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    await db.collection("license_requests").updateOne(
      { id: newReq.id },
      { $set: newReq },
      { upsert: true }
    );

    return NextResponse.json(
      { success: true, id: newReq.id, message: "تم تسجيل الطلب في MongoDB بنجاح!" },
      { headers: corsHeaders }
    );
  } catch (e: any) {
    console.error("MongoDB POST error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
