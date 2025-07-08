"use client";

import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { app } from "../firebase";
import {
  getFirestore,
  onSnapshot,
  collection,
  orderBy,
  query,
} from "firebase/firestore";
export default function Comments({ id }) {
  const db = getFirestore(app);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "posts", id, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [db, id]);

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment.data()}
          id={comment.id}
          commentId={comment.id}
          originalPostId={id}
        />
      ))}
    </div>
  );
}
