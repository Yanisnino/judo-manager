import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

const getStorageDir = () => {
  const appData = process.env.APPDATA || (process.platform === "darwin" ? path.join(os.homedir(), "Library", "Preferences") : path.join(os.homedir(), ".config"));
  const persistentDir = path.join(appData, "JudoManagerProData");
  if (fs.existsSync(persistentDir)) return persistentDir;
  return path.join(process.cwd(), "data");
};

const DATA_DIR = getStorageDir();
const REQUESTS_FILE = path.join(DATA_DIR, "license_requests.json");

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(REQUESTS_FILE)) {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    ensureFileExists();
    const content = fs.readFileSync(REQUESTS_FILE, "utf-8");
    const requests = JSON.parse(content);
    return NextResponse.json(requests, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json([], { status: 500, headers: corsHeaders });
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

    return NextResponse.json({ success: true, data: newReq }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save license request" }, { status: 500, headers: corsHeaders });
  }
}
