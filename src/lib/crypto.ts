import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const AES_KEY = process.env.AES_SECRET_KEY!; // Must be 32-char hex string → 16 bytes... actually 32 hex chars = 16 bytes, we need 32 bytes = 64 hex chars

function getKey(): Buffer {
    const key = Buffer.from(AES_KEY, "hex");
    if (key.length !== 32) {
        throw new Error("AES_SECRET_KEY must be a 64-character hex string (32 bytes)");
    }
    return key;
}

export function encrypt(text: string): string {
    const key = getKey();
    const iv = crypto.randomBytes(12); // 96-bit IV for GCM
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encrypted (all hex)
    return [
        iv.toString("hex"),
        authTag.toString("hex"),
        encrypted.toString("hex"),
    ].join(":");
}

export function decrypt(encryptedData: string): string {
    const key = getKey();
    const [ivHex, authTagHex, encryptedHex] = encryptedData.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}

export function safeDecrypt(encryptedData: string): string {
    try {
        if (!encryptedData || !encryptedData.includes(":")) return encryptedData;
        return decrypt(encryptedData);
    } catch {
        return encryptedData;
    }
}
