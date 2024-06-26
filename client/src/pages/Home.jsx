import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa";
import CallToAction from "../components/CallToAction";

const Home = () => {
  const [latestPost, setLatestPost] = useState(null);
  const [nextToLatestPosts, setNextToLatestPosts] = useState([]);
  const [otherPosts, setOtherPosts] = useState([]);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await fetch("/api/post/getposts?limit=9");
        if (res.ok) {
          const data = await res.json();
          setLatestPost(data.posts[0]);
          setNextToLatestPosts(data.posts.slice(1, 5));
          setOtherPosts(
            data.posts.slice(5).map((post) => ({
              ...post,
              content: stripHtml(post.content).substring(0, 150) + "...",
            }))
          );
        }
      };
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  function stripHtml(html) {
    const temporalDivElement = document.createElement("div");
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  return (
    <div className="min-h-screen px-14 py-8 flex flex-col">
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-16 mb-12">
        {latestPost && (
          <Link
            to={`/post/${latestPost.slug}`}
            className="lg:col-span-2 hover:opacity-80"
          >
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-3xl 2xl:text-5xl ">
                {latestPost.title}
              </h2>
              <span className="text-orange-600 2xl:text-2xl">
                {latestPost.category}
              </span>
              <img
                src={latestPost.image}
                alt="post image"
                className="min-w-full object-cover max-h-[60vh]"
              />
            </div>
          </Link>
        )}
        <div className="flex flex-col h-full gap-6 lg:col-span-1">
          {nextToLatestPosts &&
            nextToLatestPosts.map((post) => (
              <Link key={post._id} to={`/post/${post.slug}`}>
                <div className="w-full border-b-[1px] pb-3 dark:border-stone-500  border-stone-300 lg:w-[75%]">
                  <span className="text-sm 2xl:text-lg text-orange-600 flex pb-1">
                    {post.category}
                  </span>
                  <h3 className="text-base xl:text-2xl 2xl:text-2xl font-semibold hover:text-orange-400 dark:hover:text-orange-300">
                    {post.title}
                  </h3>
                  <span className="pt-2 flex italic items-center justify-end gap-1 text-xs 2xl:text-sm">
                    <FaRegClock size={12} />
                    {(post.content.length / 1000).toFixed(0) > 0
                      ? (post.content.length / 1000).toFixed(0)
                      : 1}{" "}
                    min read
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <div className="p-8 border-solid border-4 dark:border-2 border-green-400 rounded-tl-3xl rounded-br-3xl md:rounded-br-full mb-12 bg-slate-900 dark:bg-slate-950">
        <CallToAction />
      </div>
      <div className="flex flex-col gap-12">
        {otherPosts &&
          otherPosts.map((post) => (
            <Link key={post._id} to={`/post/${post.slug}`}>
              <div className="grid grid-cols-1 md:flex justify-between items-start border-t-[1px] pt-6 dark:border-stone-500 border-stone-300 hover:opacity-80">
                <div className="md:w-[25%] mb-4 md:mb-0">
                  <span className="text-orange-600 text-sm 2xl:text-xl">
                    {post.category}
                  </span>
                  <h3 className="text-base 2xl:text-3xl font-semibold ">
                    {post.title}
                  </h3>
                  <span className="pt-3 italic flex items-center gap-1 text-xs 2xl:text-sm">
                    <CiCalendar size={18} />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="pt-3 flex italic items-center justify-start gap-1 text-xs 2xl:text-sm">
                    <FaRegClock size={12} />
                    {(post.content.length / 1000).toFixed(0) > 0
                      ? (post.content.length / 1000).toFixed(0)
                      : 1}{" "}
                    min read
                  </span>
                </div>
                <p className="w-full md:w-[25%] md:block hidden xl:text-xl  text-stone-500 dark:text-stone-400">
                  {post.content}
                </p>
                <img
                  src={post.image}
                  alt="post image"
                  className="w-full h-auto object-cover md:w-1/2 md:max-w-[300px] lg:max-w-[420px]"
                />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Home;
