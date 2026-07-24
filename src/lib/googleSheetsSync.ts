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
      localStorage.setItem(this.SHEET_WEBHOOK_KEY, url);
    }
  }

  static async syncToGoogleSheets(data: BackupData): Promise<{ success: boolean; message: string }> {
    const webhookUrl = this.getSheetUrl();
    
    // Fallback: If no webhook URL is configured yet, save backup locally into LocalStorage / JSON export
    if (!webhookUrl) {
      if (typeof window !== "undefined") {
        localStorage.setItem("judo_manager_local_backup", JSON.stringify(data));
      }
      return {
        success: true,
        message: "تم حفظ النسخة الاحتياطية محلياً على الجهاز. لإجراء المزامنة المباشرة مع غوغل شيت، يرجى إدخال رابط Webhook الخاص بشيت جوجل في الإعدادات.",
      };
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return { success: true, message: "تمت المزامنة بنجاح وحفظ النسخة الاحتياطية في غوغل شيت!" };
      } else {
        throw new Error("HTTP error " + response.status);
      }
    } catch (err) {
      // Save locally as fallback
      if (typeof window !== "undefined") {
        localStorage.setItem("judo_manager_local_backup", JSON.stringify(data));
      }
      return {
        success: false,
        message: "تعذر الاتصال بـ غوغل شيت (تحقق من الاتصال). تم حفظ النسخة الاحتياطية محلياً على جهازك كاحتياط.",
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
