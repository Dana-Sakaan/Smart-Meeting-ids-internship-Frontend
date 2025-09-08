import { storage } from "./firebaseConf";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const handleFileUpload = (file, folder) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject("Please enter a file");
    }

    if (file.size > 2 * 1024 * 1024) {
      return reject("File size must be less than 2MB");
    }

    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (err) => {
        reject("Upload failed: " + err.message);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject("Couldn't get URL: " + err.message);
        }
      }
    );
  });
};