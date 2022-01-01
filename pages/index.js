import dbConnect from "../utils/dbConnect";
import Url from "../models/Url";
import { useState } from "react";
import isValidUrl from "../utils/isValidUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home({ urls }) {
  const [url, setUrl] = useState("");

  const shortenUrl = async (e) => {
    e.preventDefault();

    if (!isValidUrl(url)) {
      return toast.error("URL is not valid");
    }

    try {
      const res = await fetch("/api/urls/add", {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.error) {
        return toast.error(data.msg);
      }

      navigator.clipboard.writeText(
        process.env.NEXT_PUBLIC_SHORT_URL ??
          NEXT_PUBLIC_VERCEL_URL + "/" + data.short_url
      );

      setUrl(
        process.env.NEXT_PUBLIC_SHORT_URL ??
          NEXT_PUBLIC_VERCEL_URL + "/" + data.short_url
      );

      toast.info("Link has been copied to clipboard");
    } catch (err) {
      console.log(err);
      toast.error("Unexpected error");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-10">
      <div className="flex flex-col items-center w-full mb-10">
        <h2 className="mb-4 text-3xl">Paste the URL to be shortened</h2>
        <div className="relative max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl sm:text-center">
          <form
            className="flex flex-col items-center w-full mb-4 md:flex-row md:px-16"
            onSubmit={shortenUrl}
          >
            <input
              placeholder="Paste the link here"
              required
              type="text"
              className="flex-grow w-full h-12 px-4 mb-3 text-white transition duration-200 bg-blue-500 rounded placeholder:text-gray-200 md:mr-2 md:mb-0"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="inline-flex items-center justify-center w-full h-12 px-6 font-semibold tracking-wide transition duration-75 rounded shadow-md md:w-56 active:scale-95 hover:bg-gray-50">
              Shorten URL
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="mb-3 text-2xl">Latest Shortened URLs</h3>
        <div className="space-y-4">
          {urls.map((url, index) => (
            <div className="flex items-center space-x-4" key={index}>
              <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full cursor-pointer">
                <span className="select-none">{index + 1}</span>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="min-w-[25rem] border-b">
                  URL:{" "}
                  <a
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500"
                  >
                    {url.url}
                  </a>
                </p>
                <p className="min-w-[25rem] border-b">
                  Short:{" "}
                  <a
                    href={`${
                      process.env.NEXT_PUBLIC_SHORT_URL ??
                      "https://" + process.env.NEXT_PUBLIC_VERCEL_URL
                    }/s/${url.short_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500"
                  >
                    {process.env.NEXT_PUBLIC_SHORT_URL ??
                      process.env.NEXT_PUBLIC_VERCEL_URL +
                        "/s/" +
                        url.short_url}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const urls = await Url.find({}).sort({ date: -1 }).limit(10);

  return {
    props: {
      urls: JSON.parse(JSON.stringify(urls)),
    },
  };
}
