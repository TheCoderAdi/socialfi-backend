import multer from "multer";
import path from "path";

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const profilePicture = multer({ storage: diskStorage }).single("profilePicture");
const postImage = multer({ storage: diskStorage }).single("postImage");

export { profilePicture, postImage };
