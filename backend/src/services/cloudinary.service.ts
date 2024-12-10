import cloudinary from "../config/cloudinary";
import fs from "fs";

const uploadToCloudinary = async (localFilePath: any) => {
    try {
        if (!localFilePath) return null;

        // else upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // now the file has been uploaded successfully
        console.log("File has been uploaded successfully.", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log(error);
        // remove the locally saved temporary file since the file was not uploaded
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export default uploadToCloudinary;