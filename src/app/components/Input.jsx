"use client";

import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { supabase } from "../supabase";

export default function Input() {
  const { data: session } = useSession();

  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const imagePickRef = useRef(null);

  // input:file click fucntion
  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // file size limit is not supported in supabase
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      // console.log(imageFileUrl);
    }
  };

  useEffect(() => {
    uploadImageToStorage();
  }, [selectedFile]);

  const uploadImageToStorage = async () => {
    setImageFileUploading(true);

    const fileName = new Date().getTime() + selectedFile.name;

    // uploadBytesResumeable is not supported in supabase

    const { data, error } = await supabase.storage
      .from("images") // bucket name
      .upload("/" + fileName, selectedFile);

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl("/" + fileName);
    setImageFileUrl(publicUrl);
    setImageFileUploading(false);
  };
  if (!session) return null;

  return (
    <div className="flex border-b border-gray-200 p-3 space-x-3 w-full">
      <img
        src={session.user.image}
        alt="user-img"
        className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
      />
      <div className="w-full divide-y divide-gray-200">
        {/* tracking-wide 글자간격 넓게 */}
        <textarea
          className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700"
          id=""
          cols="30"
          rows="2"
          placeholder="What's happening"
        ></textarea>
        {selectedFile && (
          <img
            src={imageFileUrl}
            alt="image"
            className="w-full max-h-[250px] object-cover cursor-pointer"
          />
        )}
        <div className="flex items-center justify-center">
          <HiOutlinePhotograph
            onClick={() => imagePickRef.current.click()}
            className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
          />

          {/* ************************************ */}
          {/* useRef로 사용 */}
          <input
            type="file"
            ref={imagePickRef}
            accept="image/*"
            onChange={addImageToPost}
          />
          {/* ************************************ */}

          <button className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disables:opacity-50">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
