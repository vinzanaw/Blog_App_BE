import multer from "multer";

const storage = multer.memoryStorage();

//upload image
export const uploadSingleImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //maksimal 5mb
    },
    fileFilter:(_req, file, cb) =>{
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Hanya file gambar yang diperbolehkan"));
        }
    },
}).single("image");