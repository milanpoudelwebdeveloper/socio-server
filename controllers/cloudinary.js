import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const uploadImages = async (image) => {
  console.log("omg coming in clo", image);
  try {
    let result = await cloudinary.v2.uploader.upload(image, {
      folder: "socioout",
      public_id: `${Date.now()}`,
      resource_type: "auto",
    });
    return { public_id: result.public_id, url: result.secure_url };
  } catch (e) {
    console.log("hey error in cloudinary is", e);
    return res.status(500).json("Something went wrong while uploading image");
  }
};

export const deleteImage = async () => {
  cloudinary.v2.uploader.destroy(imagePublicId, (err, _) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Something went wrong while deleting image" });
    }
    return res.json({ message: "Image deleted successfully" });
  });
};
