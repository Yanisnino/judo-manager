// JudoManager License & Subscription Control Library

export interface LicenseStatus {
  isActivated: boolean;
  licenseKey: string | null;
  type: "TRIAL_14_DAYS" | "LIFETIME_PRO" | "EXPIRED" | "NONE";
  clubName: string;
  activatedAt: string | null;
  expiresAt: string | null;
  daysRemaining: number;
}

export interface LicenseRequest {
  id: string;
  clubName: string;
  managerName: string;
  phone: string;
  email: string;
  requestType: "TRIAL_14_DAYS" | "LIFETIME_PRO";
  receiptUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  generatedKey?: string;
  createdAt: string;
}

const STORAGE_KEY_LICENSE = "judo_manager_active_license";
const STORAGE_KEY_REQUESTS = "judo_requests_v2";

// Default seed requests for Secret Admin Portal Demonstration
const DEFAULT_REQUESTS: LicenseRequest[] = [
  {
    id: "REQ-1001",
    clubName: "نادي الأمل الرياضي للجودو",
    managerName: "عبد القادر بلحاج",
    phone: "0550123456",
    email: "elamal.judo@gmail.com",
    requestType: "TRIAL_14_DAYS",
    status: "PENDING",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ-1002",
    clubName: "جمعية الأبطال للجودو والقتال",
    managerName: "ياسين زروقي",
    phone: "0661987654",
    email: "champions.judo.dz@gmail.com",
    requestType: "LIFETIME_PRO",
    receiptUrl: "وصل تحويل بريدي موب BaridiMob - رقم العملية #00982415 (مبلغ 15,000 دج)",
    status: "PENDING",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export function getStoredLicense(): LicenseStatus {
  if (typeof window === "undefined") {
    return {
      isActivated: false,
      licenseKey: null,
      type: "NONE",
      clubName: "",
      activatedAt: null,
      expiresAt: null,
      daysRemaining: 0,
    };
  }

  const raw = localStorage.getItem(STORAGE_KEY_LICENSE);
  if (!raw) {
    return {
      isActivated: false,
      licenseKey: null,
      type: "NONE",
      clubName: "",
      activatedAt: null,
      expiresAt: null,
      daysRemaining: 0,
    };
  }

  try {
    const parsed: LicenseStatus = JSON.parse(raw);
    if (parsed.type === "TRIAL_14_DAYS" && parsed.expiresAt) {
      const now = new Date().getTime();
      const exp = new Date(parsed.expiresAt).getTime();
      const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        parsed.isActivated = false;
        parsed.type = "EXPIRED";
        parsed.daysRemaining = 0;
      } else {
        parsed.daysRemaining = diffDays;
      }
    }
    return parsed;
  } catch (e) {
    return {
      isActivated: false,
      licenseKey: null,
      type: "NONE",
      clubName: "",
      activatedAt: null,
      expiresAt: null,
      daysRemaining: 0,
    };
  }
}

export function activateLicense(key: string, clubName: string = "نادي الجودو المحترف"): { success: boolean; message: string; status?: LicenseStatus } {
  const cleanKey = key.trim().toUpperCase();

  if (!cleanKey.startsWith("JUDO-")) {
    return { success: false, message: "مفتاح التفعيل غير صحيح! يجب أن يبدأ بـ JUDO-" };
  }

  let type: "TRIAL_14_DAYS" | "LIFETIME_PRO" = "TRIAL_14_DAYS";
  let days = 14;

  if (cleanKey.includes("PRO") || cleanKey.includes("LIFE")) {
    type = "LIFETIME_PRO";
    days = 3650; // 10 years lifetime
  }

  const now = new Date();
  const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const status: LicenseStatus = {
    isActivated: true,
    licenseKey: cleanKey,
    type,
    clubName,
    activatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    daysRemaining: days,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_LICENSE, JSON.stringify(status));
  }

  return {
    success: true,
    message: type === "LIFETIME_PRO" ? "تم تفعيل الترخيص الدائم مدى الحياة بنجاح! 🏆" : `تم تفعيل التجربة المجانية لمدة ${days} يوماً بنجاح! ⏱️`,
    status,
  };
}

export function getAdminRequests(): LicenseRequest[] {
  if (typeof window === "undefined") return DEFAULT_REQUESTS;
  const raw = localStorage.getItem(STORAGE_KEY_REQUESTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(DEFAULT_REQUESTS));
    return DEFAULT_REQUESTS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_REQUESTS;
  }
}

export function saveAdminRequests(requests: LicenseRequest[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  }
}

export async function submitLicenseRequest(data: Omit<LicenseRequest, "id" | "status" | "createdAt">): Promise<LicenseRequest> {
  const localRequests = getAdminRequests();
  const newReq: LicenseRequest = {
    ...data,
    id: "REQ-" + Math.floor(1000 + Math.random() * 9000),
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  const updatedLocal = [newReq, ...localRequests];
  saveAdminRequests(updatedLocal);

  // Send request live to global JSONBin Cloud Bucket so admin portal gets it anywhere!
  const JSONBIN_URL = "https://api.jsonbin.io/v3/b/66b0a887ad19ca34f893112a";
  try {
    // 1. Fetch current cloud requests list first
    let cloudList: any[] = [];
    try {
      const getRes = await fetch(JSONBIN_URL + "/latest", {
        headers: { "X-Master-Key": "$2a$10$w8T0l5n3N5W1P2X3Y4Z5e6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U" }
      });
      if (getRes.ok) {
        const json = await getRes.json();
        cloudList = Array.isArray(json.record) ? json.record : [];
      }
    } catch(e) {}

    // 2. Prepend new request
    const finalCloudList = [newReq, ...cloudList.filter((r: any) => r.id !== newReq.id)];

    // 3. Put updated list back to cloud
    await fetch(JSONBIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": "$2a$10$w8T0l5n3N5W1P2X3Y4Z5e6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U",
      },
      body: JSON.stringify(finalCloudList),
    });
  } catch (e) {
    console.error("Cloud Submit Error:", e);
  }

  return newReq;
}

export function generateKey(type: "TRIAL_14_DAYS" | "LIFETIME_PRO"): string {
  const prefix = type === "LIFETIME_PRO" ? "JUDO-PRO" : "JUDO-TRL";
  const r1 = Math.floor(1000 + Math.random() * 9000);
  const r2 = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${r1}-${r2}`;
}

export function approveRequest(id: string): { req: LicenseRequest; key: string } | null {
  const requests = getAdminRequests();
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const req = requests[index];
  const key = generateKey(req.requestType);
  req.status = "APPROVED";
  req.generatedKey = key;

  requests[index] = req;
  saveAdminRequests(requests);

  return { req, key };
}
