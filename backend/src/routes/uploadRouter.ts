import express, { Request, Response, Router } from "express";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";

const router: Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const { type } = req.query;

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: type === "avatar" ? "avatars" : "banners",
          transformation: type === "avatar"
            ? [{ width: 200, height: 200, crop: "fill" }]
            : [{ width: 1200, height: 300, crop: "fill" }],
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file!.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;