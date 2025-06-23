import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encryptMessage = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptMessage = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || "[Decryption failed]";
  } catch (err) {
    console.error("Decryption error:", err);
    return "[Decryption error]";
  }
};


export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
