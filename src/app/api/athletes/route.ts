import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "athletes.json");

// Initial sample data if file does not exist
const initialData = [
  {
    id: "ATH-001",
    name: "أحمد بن علي",
    code: "JUDO-2026-0001",
    belt: "حزام أصفر",
    beltColor: "bg-yellow-400 text-gray-900 font-bold",
    group: "أشبال (10-12 سنة)",
    age: 11,
    phone: "0550123456",
    subStatus: "paid",
    status: "active"
  }
];

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(initialData, null, 2), "utf-8");
  }
}

export async function GET(request: Request) {
  try {
    ensureFileExists();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase();

    const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
    const athletes = JSON.parse(fileContent);

    if (query) {
      const filtered = athletes.filter((a: any) =>
        a.name.toLowerCase().includes(query) ||
        a.code.toLowerCase().includes(query) ||
        a.phone.includes(query)
      );
      return NextResponse.json(filtered);
    }

    return NextResponse.json(athletes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    ensureFileExists();
    const newAthlete = await request.json();
    const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
    const athletes = JSON.parse(fileContent);

    const updated = [newAthlete, ...athletes];
    fs.writeFileSync(FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save athlete" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    ensureFileExists();
    const updatedAthlete = await request.json();
    const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
    let athletes = JSON.parse(fileContent);

    athletes = athletes.map((a: any) => (a.id === updatedAthlete.id ? updatedAthlete : a));
    fs.writeFileSync(FILE_PATH, JSON.stringify(athletes, null, 2), "utf-8");

    return NextResponse.json({ success: true, data: athletes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update athlete" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    ensureFileExists();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const fileContent = fs.readFileSync(FILE_PATH, "utf-8");
    let athletes = JSON.parse(fileContent);

    athletes = athletes.filter((a: any) => a.id !== id);
    fs.writeFileSync(FILE_PATH, JSON.stringify(athletes, null, 2), "utf-8");

    return NextResponse.json({ success: true, data: athletes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete athlete" }, { status: 500 });
  }
}
