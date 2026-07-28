import multer from "multer";
import path from "path";
import fs from "fs";

function makeStorage(folder: "bikes" | "avatars") {
  const dest = path.join(__dirname, "..", "..", "public", folder);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const userId = req.user?.id || "anon";
      const ext = path.extname(file.originalname);
      cb(null, `${folder.slice(0, -1)}_${userId}_${Date.now()}${ext}`);
    },
  });
}

const imageFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

export const uploadBikeImage = multer({
  storage: makeStorage("bikes"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadAvatar = multer({
  storage: makeStorage("avatars"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
