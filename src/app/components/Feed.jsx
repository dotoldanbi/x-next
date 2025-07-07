import React from "react";

import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";

import { app } from "../firebase";
import Post from "./Post";

export default async function Feed() {
  const db = getFirestore(app);
  // query : 쿼리는 스냅샷으로 결과 추출
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  // getDocs : 스냅샷은 컬렉션이므로 getDocs추출
  const querySnapshot = await getDocs(q);
  let data = [];

  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });

  return (
    <div>
      {data.map((post) => (
        <Post key={post.id} post={post} id={post.id} />
      ))}
    </div>
  );
}
