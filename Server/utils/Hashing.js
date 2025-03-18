import CryptoJS from 'crypto-js';

// Function to generate a secure key from a password
function deriveKey(password, salt) {
    if (!password) {
        throw new Error('Password is required for key derivation');
    }
    else{
    return CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32, // 256-bit key
        iterations: 10000  // More iterations = more secure, but slower
    })};
}

function encrypt(plaintext, password) {
    if (!plaintext || !password) {
        throw new Error('Both plaintext and password are required for encryption');
    }
    // Generate a random salt
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    
    // Derive a key using PBKDF2
    const key = deriveKey(password, salt);
    
    // Generate a random IV
    const iv = CryptoJS.lib.WordArray.random(128 / 8); // 128-bit IV for AES

    // Encrypt the plaintext
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    // Combine salt, IV, and ciphertext
    const result = salt.concat(iv).concat(encrypted.ciphertext);

    // Return as base64 string
    return result.toString(CryptoJS.enc.Base64);
}

function decrypt(cipherText, password) {
    if (!cipherText || !password) {
        throw new Error('Both cipherText and password are required for decryption');
    }
    // Decode the base64 string
    const combined = CryptoJS.enc.Base64.parse(cipherText);

    // Extract salt, IV, and ciphertext
    const salt = CryptoJS.lib.WordArray.create(combined.words.slice(0, 128 / 32));
    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(128 / 32, 128 / 32 + 128 / 32));
    const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(128 / 32 + 128 / 32));

    // Derive the key using the same method as in encryption
    const key = deriveKey(password, salt);

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt };