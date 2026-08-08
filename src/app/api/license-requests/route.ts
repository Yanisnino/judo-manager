import { NextResponse } from "next/server";

// MongoDB Atlas connection via REST API (Data API)
// Free tier - no server needed!
const MONGODB_APP_ID = process.env.MONGODB_APP_ID || "judo-manager-api";
const MONGODB_API_KEY = process.env.MONGODB_API_KEY || "";
const MONGODB_BASE_URL = `https://data.mongodb-api.com/app/${MONGODB_APP_ID}/endpoint/data/v1`;
const MONGODB_DATABASE = "judomanager";
const MONGODB_COLLECTION = "license_requests";
const MONGODB_DATA_SOURCE = "Cluster0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apiKey",
};

// Fallback: use local file storage if MongoDB not configured
import fs from "fs";
import path from "path";
import os from "os";

const getStorageDir = () => {
  const appData =
    process.env.APPDATA ||
    (process.platform === "darwin"
      ? path.join(os.homedir(), "Library", "Preferences")
      : path.join(os.homedir(), ".config"));
  const persistentDir = path.join(appData, "JudoManagerProData");
  if (!fs.existsSync(persistentDir)) {
    fs.mkdirSync(persistentDir, { recursive: true });
  }
  return persistentDir;
};

const REQUESTS_FILE = path.join(getStorageDir(), "license_requests.json");

function readLocalRequests(): any[] {
  try {
    if (!fs.existsSync(REQUESTS_FILE)) {
      fs.writeFileSync(REQUESTS_FILE, "[]", "utf-8");
      return [];
    }
    return JSON.parse(fs.readFileSync(REQUESTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeLocalRequests(requests: any[]) {
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2), "utf-8");
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    // Try MongoDB Atlas Data API first
    if (MONGODB_API_KEY) {
      const res = await fetch(`${MONGODB_BASE_URL}/action/find`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: MONGODB_API_KEY,
        },
        body: JSON.stringify({
          dataSource: MONGODB_DATA_SOURCE,
          database: MONGODB_DATABASE,
          collection: MONGODB_COLLECTION,
          sort: { createdAt: -1 },
          limit: 100,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data.documents || [], { headers: corsHeaders });
      }
    }

    // Fallback to local file
    const requests = readLocalRequests();
    return NextResponse.json(requests, { headers: corsHeaders });
  } catch (error) {
    const requests = readLocalRequests();
    return NextResponse.json(requests, { headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newReq = {
      id: body.id || "REQ-" + Math.floor(1000 + Math.random() * 9000),
      clubName: body.clubName || "نادي جديد",
      managerName: body.managerName || body.manager || "",
      phone: body.phone || "",
      email: body.email || "",
      requestType: body.requestType || body.type || "LIFETIME_PRO",
      receiptUrl: body.receiptUrl || body.receiptNum || "",
      status: body.status || "PENDING",
      createdAt: body.createdAt || new Date().toISOString(),
    };

    // Try MongoDB Atlas Data API first
    if (MONGODB_API_KEY) {
      const res = await fetch(`${MONGODB_BASE_URL}/action/insertOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: MONGODB_API_KEY,
        },
        body: JSON.stringify({
          dataSource: MONGODB_DATA_SOURCE,
          database: MONGODB_DATABASE,
          collection: MONGODB_COLLECTION,
          document: newReq,
        }),
      });
      if (res.ok) {
        return NextResponse.json(
          { success: true, id: newReq.id, message: "تم إرسال الطلب بنجاح!" },
          { headers: corsHeaders }
        );
      }
    }

    // Fallback to local file
    const requests = readLocalRequests();
    requests.unshift(newReq);
    writeLocalRequests(requests);

    return NextResponse.json(
      { success: true, id: newReq.id, message: "تم إرسال الطلب بنجاح!" },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "فشل في إرسال الطلب" },
      { status: 500, headers: corsHeaders }
    );
  }
}
