"use client";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { app } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

export default function Input() {
  const { data: session } = useSession();
  const imagePickRef = useRef(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [text, setText] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  const uploadImageToStorage = () => {
    setImageFileUploading(true);
    // 여기서 app은 파이어베이스 설정 export app
    // app에서 getStorage()
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + selectedFile.name;
    // storageRef는 스토리지와 파일네임의 ref
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
        setImageFileUploading(false);
        setImageFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploading(false);
        });
      }
    );
  };

  if (!session) return null;

  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      console.log(imageFileUrl);
    }
  };

  const db = getFirestore(app);
  const handleSubmit = async () => {
    setPostLoading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      uid: session.user.uid,
      name: session.user.name,
      username: session.user.username,
      text,
      profileImg: session.user.image,
      image: imageFileUrl,
      timestamp: serverTimestamp(),
    });
    setPostLoading(false);
    setText("");
    setImageFileUrl(null);
    setSelectedFile(null);
    location.reload();
  };
  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <img
        src={session.user.image}
        alt="user-img"
        className="w-11 h-11 rounded-full cursor-pointer hover:brightness-95"
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea
          className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700"
          placeholder="Whats happening"
          rows="2"
          cold="30"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {selectedFile && (
          <img
            src={imageFileUrl}
            alt="image"
            className={`w-full max-h-[250px] object-cover cursor-pointer
             ${imageFileUploading ? "animate-pulse" : ""}`}
          />
        )}
        <div className="flex items-center justify-between pt-2.5">
          <HiOutlinePhotograph
            onClick={() => imagePickRef.current.click()}
            className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
          />
          <input
            hidden
            type="file"
            ref={imagePickRef}
            accept="image/*"
            onChange={addImageToPost}
          />
          <button
            disabled={text.trim() === "" || postLoading || imageFileUploading}
            className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
