export interface LocalUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "owner" | "coach" | "parent" | "athlete";
  clubName?: string;
}

export class LocalAuthDb {
  private static USERS_KEY = "judo_manager_local_users";
  private static CURRENT_USER_KEY = "judo_manager_current_user";
  private static NOTIFICATIONS_KEY = "judo_manager_notifications";

  static getLocalUsers(): LocalUser[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static registerUser(user: Omit<LocalUser, "id">): LocalUser {
    const users = this.getLocalUsers();
    const newUser: LocalUser = {
      ...user,
      id: "USR-" + Math.floor(1000 + Math.random() * 9000),
    };
    users.push(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));
    }
    return newUser;
  }

  static loginUser(identifier: string, role: string): LocalUser {
    const users = this.getLocalUsers();
    let existing = users.find(
      (u) => (u.email === identifier || u.phone === identifier) && u.role === role
    );

    if (!existing) {
      existing = {
        id: "USR-" + Math.floor(1000 + Math.random() * 9000),
        name: identifier.includes("@") ? identifier.split("@")[0] : "مستخدم النادي",
        email: identifier,
        phone: identifier,
        role: role as any,
        clubName: "نادي الأبطال للرياضات القتالية",
      };
      users.push(existing);
      if (typeof window !== "undefined") {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(existing));
    }
    return existing;
  }

  static getCurrentUser(): LocalUser | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(this.CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  static getNotifications(): any[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(this.NOTIFICATIONS_KEY);
      return data ? JSON.parse(data) : [
        {
          id: "NOT-1",
          title: "تغيير موعد حصة الأشبال",
          message: "نحيطكم علماً بأن حصة اليوم السبت أصبحت على الساعة 17:00 عوض 18:00.",
          date: "2026-07-24",
          target: "parents",
        },
        {
          id: "NOT-2",
          title: "موعد بطولة الولاية للجودو",
          message: "تم تسجيل أبنائكم في بطولة الولاية المقررة يوم الجمعة القادم.",
          date: "2026-07-20",
          target: "parents",
        }
      ];
    } catch {
      return [];
    }
  }

  static sendNotification(notif: { title: string; message: string; target: string; phone?: string }): void {
    const list = this.getNotifications();
    const newNotif = {
      id: "NOT-" + Date.now(),
      ...notif,
      date: new Date().toISOString().split("T")[0],
    };
    list.unshift(newNotif);
    if (typeof window !== "undefined") {
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(list));
    }
  }
}
