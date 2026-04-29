import { readFileSync } from "fs";
import path from "path";

export default async function WithdrawalPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const legalDir = path.join(process.cwd(), "messages/legal");
    const filePath = path.join(legalDir, `withdrawal.${locale}.html`);
    const fallbackPath = path.join(legalDir, "withdrawal.en.html");

    const html = (() => {
        try { return readFileSync(filePath, "utf-8"); }
        catch { return readFileSync(fallbackPath, "utf-8"); }
    })();

    return (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 flex gap-4 flex-col">
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}
