import jwt from 'jsonwebtoken';

export function createtoken(data) {
    const token = jwt.sign(data, process.env.Private_Key);
    return (token);
}

export function verifytoken(token) {
    try {
        if (!token) return null;

        const jwt_auth = jwt.verify(token, process.env.Private_Key);
        return (jwt_auth);
    } catch (err) {
        return null;
    }
}
