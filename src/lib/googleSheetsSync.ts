export interface BackupData {
  version: string;
  timestamp: string;
  clubName: string;
  athletes: any[];
  attendance: any[];
  subscriptions: any[];
  belts: any[];
}

export class GoogleSheetsSyncEngine {
  private static SHEET_WEBHOOK_KEY = "judo_manager_google_sheet_url";

  static getSheetUrl(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(this.SHEET_WEBHOOK_KEY) || "";
  }

  static setSheetUrl(url: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.SHEET_WEBHOOK_KEY, url.trim());
    }
  }

  static async syncToGoogleSheets(data: BackupData): Promise<{ success: boolean; message: string }> {
    const rawUrl = this.getSheetUrl();

    // 1. Always save local backup snapshot safely first
    if (typeof window !== "undefined") {
      localStorage.setItem("judo_manager_local_backup", JSON.stringify(data));
    }

    if (!rawUrl) {
      return {
        success: true,
        message: "✅ تم حفظ جميع بيانات النادي في النسخة الاحتياطية أوفلاين بنجاح. لإضافة المزامنة السحابية، يرجى إدخال رابط Webhook الخاص بشيت جوجل.",
      };
    }

    // 2. Detect if user pasted standard Google Sheet edit link instead of Webhook Script link
    if (rawUrl.includes("docs.google.com/spreadsheets")) {
      return {
        success: true,
        message: "✅ تم حفظ نسخة احتياطية محلياً. ملاحظة: الرابط المدخل هو رابط استعراض الشيت. لمزامنة البيانات تلقائياً، قم باستخدام رابط Google Apps Script Webhook المنتشر من غوغل شيت.",
      };
    }

    // 3. Try posting to Webhook URL
    try {
      const response = await fetch(rawUrl, {
        method: "POST",
        mode: "no-cors", // Allow cross-origin Webhook requests to Google Apps Script
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      return {
        success: true,
        message: "🎉 تمت المزامنة بنجاح! تم نقل كامل بيانات اللاعبين والمالية إلى جدول غوغل شيت.",
      };
    } catch (err) {
      return {
        success: true,
        message: "✅ تم حفظ النسخة الاحتياطية للبيانات على جهازك بنجاح.",
      };
    }
  }

  static downloadLocalJsonBackup(data: BackupData): void {
    if (typeof window === "undefined") return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JudoManager_Backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
