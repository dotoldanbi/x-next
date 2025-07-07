"use client";

import React, { useEffect, useState } from "react";
import {
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineTrash,
  HiHeart,
} from "react-icons/hi";
import { signIn, useSession } from "next-auth/react";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { app } from "../firebase";
import { useModalStore, usePostIdStore } from "../store/modalStore";

export default function Icons({ id, uid }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const { modalState, setModalState } = useModalStore();
  const { postId, setPostId } = usePostIdStore();
  const [comments, setComments] = useState([]);
  const db = getFirestore(app);
  const likePost = async () => {
    if (session) {
      // session.user.uid는 문서아이디로 사용

      if (isLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", session?.user.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
          username: session.user.username,
          timestamp: serverTimestamp(),
        });
      }
    } else {
      signIn();
    }
  };

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db]);

  useEffect(() => {
    setIsLiked(
      likes.findIndex((like) => like.id === session?.user?.uid) !== -1
    );
  }, [likes]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
    return () => unsubscribe();
  }, [db, id]);

  const deletePost = async () => {
    console.log(session);
    if (window.confirm("Are you sure you want to delete this post?")) {
      if (session?.user?.uid === uid) {
        deleteDoc(doc(db, "posts", id))
          .then(() => {
            console.log("Post deleted successfully");
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error deleting post:", error);
          });
      } else {
        alert("You can only delete your own posts.");
      }
    }
  };

  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <div className="flex items-center">
        <HiOutlineChat
          className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-sky-500 hover:bg-sky-100"
          onClick={() => {
            if (!session) {
              signIn();
            } else {
              setModalState(!modalState);
              setPostId(id);
            }
          }}
        />
        {comments.length > 0 && (
          <span className="text-xs">{comments.length}</span>
        )}
      </div>

      <div className="flex items-center">
        {isLiked ? (
          <HiHeart
            onClick={likePost}
            className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
          />
        ) : (
          <HiOutlineHeart
            onClick={likePost}
            className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
          />
        )}
        {likes.length > 0 && (
          <span className={`text-xs ${isLiked && "text-red-600"}`}>
            {likes.length}
          </span>
        )}
      </div>
      {session?.user?.uid === uid && (
        <HiOutlineTrash
          onClick={deletePost}
          className="h-8 w-8 cursor-pointer rounded-full transition duration-500 ease-in-out p-2 hover:text-red-500 hover:bg-red-100"
        />
      )}
    </div>
  );
}
