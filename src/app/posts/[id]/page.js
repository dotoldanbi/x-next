import React from "react";

// 파이어스토어 관련 임포트
import { app } from "../../firebase";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import Post from "../../components/Post";
import Comments from "../../components/Comments";
export default async function PostPage({ params }) {
  const db = getFirestore(app);

  // getDoc : params.id를 사용하여 특정 문서를 가져옵니다.
  const querySnapshot = await getDoc(doc(db, "posts", params.id));

  let data = {};
  data = { ...querySnapshot.data(), id: querySnapshot.id };

  return (
    <div className="max-w-xl mx-auto border-r border-l min-h-screen">
      <div className="flex items-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <Link href={"/"} className="hover:bg-gray-100 rounded-full p-2">
          <HiArrowLeft className="h-5 w-5 " />
        </Link>
        <h2 className="sm:text-lg">Back</h2>
      </div>
      <Post post={data} id={data.id} />
      <Comments id={data.id} />
    </div>
  );
}
