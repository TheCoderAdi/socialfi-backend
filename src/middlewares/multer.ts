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

const files = multer({ storage: diskStorage }).array("file", 6);
const postImage = multer({ storage: diskStorage }).single("postImage");

export { files, postImage };
