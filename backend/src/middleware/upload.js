import multer from "multer";

// Frontend ke MAX_KUNDLI_FILE_MB se match rakho.
export const MAX_FILE_MB = 5;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_MB * 1024 * 1024, files: 1, fields: 5 },
});

/** multer ke errors ko saaf JSON message me badalta hai. */
export function uploadKundli(req, res, next) {
  upload.single("kundli")(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: `Keep the file under ${MAX_FILE_MB} MB.` });
    }
    return res.status(400).json({ message: "Invalid upload." });
  });
}