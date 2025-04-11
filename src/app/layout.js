import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import NewsWrapper from "./components/NewsWrapper";
import SessionWrapper from "./components/SessionWrapper";
import { Provider } from "react-redux";
import store from "./store";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "X clone",
  description: "x clone by nextjs & tailwindcss",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex justify-between max-w-6xl mx-auto">
            <div className="hidden sm:inline border-r h-screen">
              <Sidebar />
            </div>

            <div className="w-2xl flex-1">{children}</div>
            <div className="lg:flex-col p-3 h-screen border-l hidden lg:flex w-[24rem]">
              <div className="sticky top-0 bg-white py-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-gray-100 border border-gray-200 rounded-3xl text-sm w-full px-4 py-2"
                ></input>
              </div>
              <NewsWrapper />
            </div>
          </div>
        </body>
      </html>
    </SessionWrapper>
  );
}
