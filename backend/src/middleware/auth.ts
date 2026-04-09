import jwt from "jsonwebtoken"

export function authorise( req: any, res: any, next: any ) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token does not exist"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY!);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Token is invalid" });
    }
}