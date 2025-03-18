import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        console.log('Starting auth middleware');
        console.log('Cookies:', req.cookies);
        console.log('Headers:', req.headers);

        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Extracted token:", token);

        if (!token) {
            console.log('No token found');
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing",
            });
        }

        try {
            console.log('Attempting to verify token');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded);

            const secret = process.env.ENCRYPTION_SECRET;
            // console.log('Attempting to decrypt email');
            // const decryptedEmail = decrypt(decoded.email, secret);
            // console.log("Decrypted email:", decryptedEmail);

            req.user = {
                id: decoded.id,
                email: decoded.email
            };
            console.log("User set on request:", req.user);
            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token',
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while validating the token'
        });
    }
};
export{auth};