import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const REQUESTS_FILE = path.join(DATA_DIR, "license_requests.json");

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(REQUESTS_FILE)) {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function GET() {
  try {
    ensureFileExists();
    const content = fs.readFileSync(REQUESTS_FILE, "utf-8");
    const requests = JSON.parse(content);
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    ensureFileExists();
    const body = await request.json();
    const content = fs.readFileSync(REQUESTS_FILE, "utf-8");
    const requests = JSON.parse(content);

    const newReq = {
      id: body.id || "REQ-" + Math.floor(1000 + Math.random() * 9000),
      clubName: body.clubName || "نادي جديد",
      managerName: body.managerName || body.manager || "",
      phone: body.phone || "",
      email: body.email || "",
      requestType: body.requestType || body.type || "LIFETIME_PRO",
      receiptUrl: body.receiptUrl || body.receiptNum || "",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    const updated = [newReq, ...requests];
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({ success: true, data: newReq });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save license request" }, { status: 500 });
  }
}
