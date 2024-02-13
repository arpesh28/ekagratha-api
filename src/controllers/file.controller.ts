import { Request, Response } from "express";
import { errorMessages } from "../constants/messages";
import { uploadS3ObjectUrl } from "../common/s3";

const imageUploadUrl = async (req: Request, res: Response) => {
  try {
    const { category, filename, fileType } = req.params;

    const preSignedUrl = await uploadS3ObjectUrl(
      category + "/" + filename,
      fileType
    );

    if (!preSignedUrl)
      res.status(500).json({ message: errorMessages.SOMETHING_WRONG });

    return res.json({
      data: {
        url: preSignedUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: errorMessages.SOMETHING_WRONG });
  }
};

export { imageUploadUrl };
