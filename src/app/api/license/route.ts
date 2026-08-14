import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// ── 1. توليد مفتاح ترخيص جديد (الأدمن) ──────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, requestId, requestType, clubName, managerName, phone, hardwareId } = body;

    const client = await clientPromise;
    const db = client.db("judomanager");

    if (action === "GENERATE_KEY") {
      const prefix = requestType === "LIFETIME_PRO" ? "JUDO-PRO" : "JUDO-TRL";
      const r1 = Math.floor(1000 + Math.random() * 9000);
      const r2 = Math.floor(1000 + Math.random() * 9000);
      const key = `${prefix}-${r1}-${r2}`;

      const licenseDoc = {
        licenseKey: key,
        requestType: requestType || "TRIAL_14_DAYS",
        clubName: clubName || "نادي الجودو",
        managerName: managerName || "",
        phone: phone || "",
        hardwareId: hardwareId || null, // null until claimed by first device
        isUsed: false,
        usedAt: null,
        createdAt: new Date().toISOString(),
        expiresAt: requestType === "LIFETIME_PRO"
          ? new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await db.collection("licenses").insertOne(licenseDoc);

      if (requestId) {
        await db.collection("license_requests").updateOne(
          { id: requestId },
          { $set: { status: "APPROVED", generatedKey: key } }
        );
      }

      return NextResponse.json({ success: true, key, license: licenseDoc }, { headers: corsHeaders });
    }

    // ── 2. تفعيل المفتاح وقفله لمرة واحدة وجهاز واحد ──────────────────
    if (action === "ACTIVATE_KEY") {
      const { key, deviceHardwareId } = body;
      const cleanKey = (key || "").trim().toUpperCase();

      if (!cleanKey) {
        return NextResponse.json({ success: false, message: "مفتاح التفعيل مطلوب!" }, { headers: corsHeaders });
      }

      const license = await db.collection("licenses").findOne({ licenseKey: cleanKey });

      if (!license) {
        return NextResponse.json({
          success: false,
          message: "❌ المفتاح غير موجود في النظام! يرجى التأكد من المفتاح المقدم من الأدمن."
        }, { headers: corsHeaders });
      }

      // إذا كان المفتاح مستخدم سابقاً على جهاز آخر
      if (license.isUsed && license.hardwareId && license.hardwareId !== deviceHardwareId) {
        return NextResponse.json({
          success: false,
          message: "⚠️ هذا المفتاح مستخدم مسبقاً ومقترن بجهاز آخر! التفعيل صالح لمرة واحدة وعلى جهاز واحد فقط."
        }, { headers: corsHeaders });
      }

      // قفل المفتاح وتثبيت Hardware ID للجهاز الحالي
      await db.collection("licenses").updateOne(
        { licenseKey: cleanKey },
        {
          $set: {
            isUsed: true,
            hardwareId: deviceHardwareId || license.hardwareId || "DEV-HARDWARE-ID",
            usedAt: license.usedAt || new Date().toISOString(),
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: license.requestType === "LIFETIME_PRO"
          ? "تم تفعيل الترخيص الدائم مدى الحياة بنجاح! 🏆"
          : "تم تفعيل فترة التجربة المجانية (14 يوماً) بنجاح! ⏱️",
        license: {
          licenseKey: cleanKey,
          type: license.requestType,
          clubName: license.clubName,
          expiresAt: license.expiresAt,
        }
      }, { headers: corsHeaders });
    }

    return NextResponse.json({ success: false, message: "إجراء غير معروف" }, { headers: corsHeaders });

  } catch (e: any) {
    console.error("License API error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500, headers: corsHeaders });
  }
}
