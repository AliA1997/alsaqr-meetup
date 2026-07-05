import { Client } from "@gradio/client";

// @gradio/client hardcodes `credentials: "include"` on every request (config fetch,
// POSTs, and the SSE stream), but HF Spaces never answer CORS preflights with
// `Access-Control-Allow-Credentials: true`, so browsers block all cross-origin calls.
// Space auth uses the `Authorization: Bearer` header rather than cookies, so
// credentials are safely dropped for *.hf.space requests. The SSE stream's fetch is
// internal to the library, so global fetch is the only interception point.
const nativeFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    try {
        if (new URL(url, globalThis.location?.origin).hostname.endsWith(".hf.space")) {
            return nativeFetch(input, { ...init, credentials: "omit" });
        }
    } catch {
        // unparseable url — fall through to the native fetch untouched
    }
    return nativeFetch(input, init);
};

export const initializeClient = async () => await Client.connect(import.meta.env.VITE_PUBLIC_HUGGINGFACE_NSFW_CHECKER, { token: import.meta.env.VITE_PUBLIC_HUGGINGFACE_TOKEN });

export const checkNsfwInImage  = async (client: Client, imageUrl: string) => {
    const response = await client.predict("/chat", [imageUrl]);
    const data = (response?.data ?? []) as any[];
    if(data?.length) {
        return data[0]?.text ?? "No Response"
    }

}