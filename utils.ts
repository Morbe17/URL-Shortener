import crypto from 'crypto';

const Utils = {
    GenerateShortRandomString(length: number): string {
        const bytes = crypto.randomBytes(Math.ceil(length / 2));
        const hexString = bytes.toString('hex');
        const uniqueString = hexString.slice(0, length);

        // Convert hex characters to a mix of lowercase and uppercase
        return uniqueString.split('').map(char => {
            const isUpperCase = Math.random() < 0.5;
            return isUpperCase ? char.toUpperCase() : char.toLowerCase();
        }).join('');
    }
}

export default Utils;