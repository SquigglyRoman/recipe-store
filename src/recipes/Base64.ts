export async function toBase64(file: File, option?: 'WITH_TYPE_INFORMATION'): Promise<string> {
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