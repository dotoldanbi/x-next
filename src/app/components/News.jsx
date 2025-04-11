"use client";

import React from "react";
import { useState, useEffect } from "react";

// useSelector는 store에서 state를 가져오는 hook
// useDispatch는 action을 dispatch하는 hook
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setNewsList } from "../store/newsStore";

export default function News() {
  const [news, setNews] = useState([]);
  const [articleNum, setArticleNum] = useState(3);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("https://saurav.tech/NewsAPI/top-headlines/category/business/us.json")
      .then((res) => res.json())
      .then((data) => {
        // setNews(data.articles);
        dispatch(setNewsList(data.articles));
      });
  }, []);
  const newsArr = useSelector((state) => state.news.news);
  // console.log("newsArr", newsArr);

  return (
    <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl">
      <h4 className="text-center text-xl px-4 font-bold">What's happening</h4>
      {newsArr.slice(0, articleNum).map((article) => {
        return (
          <div key={article.url}>
            <a href={article.url} target="_blank">
              <div className="flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-200 transition duration-200">
                <div>
                  <h6>{article.title}</h6>
                  <p>{article.source.name}</p>
                </div>
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  width={70}
                  className="rounded-xl"
                />
              </div>
            </a>
            {/* <div>
              <h1 className="font-bold text-lg">{article.title}</h1>
              <p>{article.description}</p>
            </div> */}
          </div>
        );
      })}
      <button
        onClick={() => setArticleNum(articleNum + 3)}
        className="w-full py-2 bg-gray-200 hover:bg-gray-300 transition duration-200"
      >
        Load more
      </button>
    </div>
  );
}
