import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const client = await clientPromise;
    const db = client.db("judomanager");

    const link = await db.collection("download_links").findOne({ token });

    if (!link) {
      return new NextResponse(
        `<html>
          <body style="background:#060b14;color:#f87171;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;direction:rtl">
            <div style="text-align:center">
              <h1>❌ رابط التحميل غير صحيح أو ملغى</h1>
              <p style="color:#8fa8c8">يرجى طلب رابط جديد من الأدمن.</p>
            </div>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (link.isUsed) {
      return new NextResponse(
        `<html>
          <body style="background:#060b14;color:#f87171;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;direction:rtl">
            <div style="text-align:center">
              <h1>⚠️ هذا الرابط مستخدم مسبقاً!</h1>
              <p style="color:#8fa8c8">رابط التحميل صالح لمرة واحدة فقط لمنع الانتشار التلقائي للنظام.</p>
            </div>
          </body>
        </html>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // علم الرابط كـ مستخدم فوراً
    await db.collection("download_links").updateOne(
      { token },
      { $set: { isUsed: true, usedAt: new Date().toISOString() } }
    );

    // توجيه تلقائي مباشر لملف التنزيل الحقيقي
    const REAL_EXE_RELEASE_URL = "https://github.com/Yanisnino/judo-manager/releases/latest/download/JudoManager-Pro-Setup.exe";
    return NextResponse.redirect(REAL_EXE_RELEASE_URL);

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
