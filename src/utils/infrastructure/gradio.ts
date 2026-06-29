import { Client } from "@gradio/client";

export const initializeClient = async () => await Client.connect(import.meta.env.VITE_PUBLIC_HUGGINGFACE_NSFW_CHECKER, { token: import.meta.env.VITE_PUBLIC_HUGGINGFACE_TOKEN });

export const checkNsfwInImage  = async (client: Client, imageUrl: string) => {
    const response = await client.predict("/chat", [imageUrl]);
    const data = (response?.data ?? []) as any[];
    if(data?.length) {
        return data[0]?.text ?? "No Response"
    }

}