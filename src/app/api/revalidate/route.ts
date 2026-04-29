import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get("secret");

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const path = searchParams.get("path");

    if (path) {
        revalidatePath(path);
        return NextResponse.json({ revalidated: true, path });
    }

    // No specific target — revalidate all category and product paths
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, scope: "layout" });
}
