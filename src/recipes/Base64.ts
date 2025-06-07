import base64 from "base-64";
import utf8 from "utf8";

export function encodeObject<T>(object: T): string {
    const stringified = JSON.stringify(object);
    const utf8Encoded = utf8.encode(stringified);
    return base64.encode(utf8Encoded);
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
export function decodeToObject<T>(encoded: string): T {
    const utf8Decoded = decode(encoded);
    return JSON.parse(utf8Decoded) as T;
}

export function decode(encoded: string): string {
    const bytes = base64.decode(encoded);
    return utf8.decode(bytes);
}
