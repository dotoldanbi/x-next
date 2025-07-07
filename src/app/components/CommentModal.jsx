"use client";
import React, { useEffect, useState } from "react";

import { useModalStore, usePostIdStore } from "../store/modalStore";
import {
  getFirestore,
  doc,
  onSnapshot,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import Modal from "react-modal";
import { HiX } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { app } from "../firebase";
import { useRouter } from "next/navigation";

export default function CommentModal() {
  const { modalState, setModalState } = useModalStore();
  const { data: session } = useSession();
  const { postId, setPostId } = usePostIdStore();
  const [input, setinput] = useState("");
  // 댓글 스냅샷이 존재하는 경우 setPost에 데이터를 저장합니다.
  const [post, setPost] = useState(null);
  const db = getFirestore(app);

  const router = useRouter();

  useEffect(() => {
    if (postId !== "" && postId !== null) {
      // doc : 문서의 참조를 가져옵니다.
      const postRef = doc(db, "posts", postId);
      const unsubscribe = onSnapshot(postRef, (snapshot) => {
        if (snapshot.exists()) {
          setPost(snapshot.data());
          console.log("Current data: ", snapshot.data());
        } else {
          console.log("No such document!");
        }
      });
      return () => {
        unsubscribe(); // Clean up the listener on unmount
      };
    }
  }, [postId]);

  const sendComment = async () => {
    addDoc(collection(db, "posts", postId, "comments"), {
      name: session.user.name,
      username: session.user.username,
      userImg: session.user.image,
      comment: input,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        setinput("");
        setModalState(false);
        router.push(`/posts/${postId}`);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  return (
    <div>
      {modalState && (
        <Modal
          isOpen={modalState}
          onRequestClose={() => setModalState(false)}
          ariaHideApp={false}
          className="max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md"
        >
          <div className="p-4">
            <div className="border-b border-gray=200 py-2 px-1.5">
              <HiX
                className="text-2xl text-gray-700 p-1 hover:bg-gray-200 rounded-full cursor-pointer"
                onClick={() => setModalState(false)}
              />
            </div>

            <div className="p-2 flex items-center space-x-1 relative">
              <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300" />
              <img src={post?.profileImg} alt="user-img" />
              <h4 className="font-bold sm:text-[16px] sm:text-[15px] hover:underline truncate">
                {post?.name}
              </h4>
              <span className="text-sm sm:text-[15px] truncate">
                {post?.username}
              </span>
            </div>
            <p className="text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2">
              {post?.text}
            </p>
            <div className="flex p-3 space-x-3">
              <img
                src={session?.user?.image}
                alt="user-img"
                className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
              />
              <div className="w-full divide-y divide-gray-200">
                <div>
                  <textarea
                    className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700 placeholder:text-gray-500"
                    placeholder="Whats happening"
                    rows="2"
                    onChange={(e) => setinput(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex items-center justify-end pt-2.5">
                  <button
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                    disabled={input.trim() === ""}
                    onClick={sendComment}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
