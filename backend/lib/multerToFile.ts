import * as fs from "fs";
export const multerToFile = (multerFile: Express.Multer.File): File => {
    return new File([multerFile.buffer], multerFile.originalname, {
      type: multerFile.mimetype,
      lastModified: Date.now(),
    });
  };

  