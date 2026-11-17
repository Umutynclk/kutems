import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const type = searchParams.get("type") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "40");

    const manifestPath = path.join(
      process.cwd(),
      "scripts/import/data/ready/cloudflare_file_manifest.json"
    );

    if (!fs.existsSync(manifestPath)) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const allFiles: any[] = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    let filtered = allFiles;
    if (type !== "all") {
      filtered = filtered.filter((f) => f.type === type);
    }
    if (search) {
      filtered = filtered.filter(
        (f) =>
          f.articleNumber?.toLowerCase().includes(search) ||
          f.filename?.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize).map((f) => ({
      ...f,
      cdnUrl: `https://kutems-media.pages.dev/${f.relativePath}`,
    }));

    return NextResponse.json({
      items: paginated,
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
