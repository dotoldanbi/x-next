"use client";
import React from "react";
import { useParams } from "next/navigation";
export default function PostPage() {
  const params = useParams();
  return <div>PostPage {params.id}</div>;
}
