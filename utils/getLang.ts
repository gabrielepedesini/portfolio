import { headers } from "next/headers";
import en from "@/locales/en.json";
import it from "@/locales/it.json";

const dictionaries: Record<string, any> = { en, it };

function getDictionary(lang: string) {
    if (lang.startsWith("it")) return dictionaries.it.it;
    return dictionaries.en.en;
}

export async function getLang() {
    const h = await headers();
    const langHeader = h.get("accept-language") || "en";
    const lang = langHeader.startsWith("it") ? "it" : "en";
    const dict = getDictionary(lang);
    return { lang, dict };
}