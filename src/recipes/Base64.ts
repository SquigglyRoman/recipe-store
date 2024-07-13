import base64 from "base-64";
import utf8 from "utf8";

export function encodeObject<T>(object: T): string {
    const stringified = JSON.stringify(object);
    const encoded = base64.encode(stringified);
    return encoded;
}

export async function encodeFile(file: File, option?: 'WITH_TYPE_INFORMATION'): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const data = reader.result as string;
            option === 'WITH_TYPE_INFORMATION' ?
                resolve(data) :
                resolve(data.split(',')[1]);
        }
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function decode(encoded: string): string {
    const bytes = base64.decode(encoded);
    const utf8Decoded = utf8.decode(bytes);
    return utf8Decoded;
}