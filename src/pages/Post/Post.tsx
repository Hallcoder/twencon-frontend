import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Skeleton, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { calculateDate, getPost } from "../../hooks";
import HomePageContext from "../../context/HomePageContext";
import Person from "./../../assets/person/person.png";
import UserPostSkeleton from "../../components/Sketeleton/UserPostSkeleton/UserPostSkeleton";
import Loading from "./../../assets/loading/loading.gif";
import ReactPlayer from "react-player";
import { EmojiEmotions, Favorite, FavoriteBorder } from "@mui/icons-material";
import Picker from "emoji-picker-react";
import { socket } from "../../context/chatContext";
const Post: React.FC = () => {
  const user = useSelector((state: any) => state?.user?.userData);
  const postId = useParams();
  const [post, setPost] = useState<any>({});
  const navigate = useNavigate();
  const commentEmojiElement = useRef<any>(null);
  const { setCurrent, posts, setPosts } = useContext<any>(HomePageContext);
  const [postLoading, setPostLoading] = useState<any>(true);
  const [textComment, setTextComment] = useState<string>("");
  useEffect(() => {
    if (document.location.href.includes("post"))
      getPost(postId, setPost, setPostLoading);
  }, []);
  useEffect(() => {
    if (posts)
      posts?.map((currentPost: any) => {
        if (currentPost?._id == post?._id) setPost(post);
      });
  }, [posts]);
  const buttons = ["Likes", "Comments"];
  const [currentShow, setCurrentShow] = useState<number>(0);
  const [showCommentEmojiElement, setShowCommentEmojiElement] =
    useState<boolean>(false);
  const onEmojiClickPostComment = (event?: any, emojiObject?: any) => {
    let msg = "";
    if (textComment) {
      msg = textComment;
    }
    msg = msg + `${emojiObject.emoji}`;
    setTextComment(msg);
  };
  const [loadingPostingComment, setLoadingPostingComment] =
    useState<boolean>(false);
  const comment = async () => {
    setLoadingPostingComment(true);
    try {
      if (textComment == "" || textComment == null)
        return setLoadingPostingComment(false);
      const date = new Date();
      socket.emit("create-comment", user, post._id, textComment, date);
    } catch (error) {
      console.log(error);
    } finally {
      setTextComment("");
    }
  };
  if (postLoading) {
    return <UserPostSkeleton />;
  }
  if (!postLoading && !post) {
    return (
      <div className="flex w-full h-full">
        <div className="border w-2/3 h-full">
          <h1 className="text-red-500 p-1 font-bold">
            This post has been deleted!
          </h1>
        </div>
        <div className="border w-1/3 h-full"></div>
      </div>
    );
  }
  try {
    socket.off("like").on("like", (data) => {
      setPost(data);
    });
    socket.off("comment").on("comment", (data) => {
      // setPost((curretData: any) => {
      //   return { ...curretData, comments: data?.post?.comments };
      // });
      console.log(data);
    });
  } catch (error) {
    console.log(error);
  }
  // console.log(post);
  return (
    <div className="w-full h-full md:flex ">
      <div className="w-full md:w-2/3 h-full border flex justify-center p-1">
        <div className="flex gap-2 w-full md:w-3/5">
          <div className="p-2">
            <div
              className="border w-full p-2 flex gap-2 rounded-md select-none"
              onDoubleClick={() => navigate(`/post/${post?._id}`)}
            >
              <div
                className="w-[2.5em] md:w-[4em] h-[2.5em]  md:h-[4em] rounded-full border-2 flex items-center justify-center cursor-pointer"
                onClick={() => {
                  navigate(`/user/${post?.owner?.username}`);
                  setCurrent(4);
                  sessionStorage.setItem("current", "4");
                }}
              >
                {post?.owner?.profile === "icon" ? (
                  <img src={Person} alt="" className="rounded-full w-full" />
                ) : (
                  <img
                    src={post?.owner?.profile}
                    alt=""
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="w-[calc(100%_-_4em)] flex flex-col gap-2">
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    <div
                      className="font-medium text-[0.9em] md:text-[1em] cursor-pointer"
                      onClick={() => {
                        navigate(`/user/${post?.owner?.username}`);
                        setCurrent(4);
                        sessionStorage.setItem("current", "4");
                      }}
                    >
                      {post?.owner?.fullname}
                    </div>
                    <div
                      className="opacity-50 cursor-pointer"
                      onClick={() => {
                        navigate(`/user/${post?.owner?.username}`);
                        setCurrent(4);
                        sessionStorage.setItem("current", "4");
                      }}
                    >
                      @{post?.owner?.username}
                    </div>
                    <div className="text-blue-500">
                      {calculateDate(post?.date)}
                    </div>
                  </div>
                  <div className="font-normal py-1">
                    {post?.post?.description}
                  </div>
                </div>
                {(post?.post?.images as any)?.length <= 0 ? null : (
                  <div className="relative w-full flex overflow-hidden rounded-md postHeight">
                    {(post?.post?.images as any).map(
                      (image: any, index2: number) => {
                        return (
                          <div
                            className="flex items-center justify-center min-w-full rounded-md"
                            key={index2}
                          >
                            <div className="flex items-center justify-center min-h-[15em] videos">
                              {image?.includes("video") ? (
                                <ReactPlayer
                                  url={post?.post?.images[0]}
                                  controls
                                  muted={true}
                                  loop
                                  playing={true}
                                />
                              ) : (
                                <img
                                  src={post?.post?.images[0]}
                                  className="rounded-md"
                                />
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
                <div>
                  <div className="flex justify-between items-center p-2 px-5">
                    <div className={`flex justify-center items-center gap-2`}>
                      <span
                        // onClick={() => like(post?._id)}
                        className="flex items-center justify-center"
                      >
                        {post?.likes.find((currentUser: any) => {
                          return currentUser._id == user?._id;
                        }) == undefined ? (
                          <FavoriteBorder className="md:text-[1.5em] opacity-70 cursor-pointer" />
                        ) : (
                          <Favorite className="md:text-[1.5em] cursor-pointer text-red-500" />
                        )}
                      </span>
                      <span className="text-[0.9em] flex items-center justify-center">
                        {(post?.likes as any)?.length <= 0
                          ? null
                          : post?.likes?.length}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center justify-center">
                      <span className="flex items-center justify-center">
                        {(post?.comments as any)?.length <= 0 ? (
                          <i className="fa-regular fa-comment text-[1.3em] opacity-70 cursor-pointer"></i>
                        ) : (
                          <i className="fa-solid fa-comment text-[1.3em] opacity-70 cursor-pointer text-blue-500"></i>
                        )}
                      </span>
                      <span className="text-[0.9em] flex items-center justify-center">
                        {(post?.comments as any)?.length <= 0
                          ? null
                          : post?.comments.length}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center justify-center">
                      <span className="flex items-center justify-center">
                        <i className="fa-regular fa-share-from-square text-[1.3em]  opacity-70 cursor-pointer"></i>
                      </span>
                      <span className="text-[0.9em] flex items-center justify-center">
                        {(post?.share as any)?.length <= 0 ? null : "10K"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 px-1 gap-1">
                    <div className="relative">
                      <span
                        onClick={() => {
                          setShowCommentEmojiElement(true);
                        }}
                        className="cursor-pointer"
                      >
                        <EmojiEmotions />
                      </span>
                      {showCommentEmojiElement && (
                        <div
                          className="absolute top-[2em] left-0 bg-white z-50"
                          ref={commentEmojiElement}
                        >
                          <Picker
                            onEmojiClick={onEmojiClickPostComment}
                            pickerStyle={{ width: "100%" }}
                          />
                        </div>
                      )}
                    </div>
                    <TextField
                      placeholder="Post a comment"
                      className="w-[85%]"
                      autoComplete="off"
                      size="small"
                      value={textComment}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setTextComment(e.target.value);
                      }}
                    />
                    <Button
                      variant="contained"
                      disabled={loadingPostingComment}
                      className="bg-blue-500 text-[0.8em] flex items-center justify-center"
                      onClick={comment}
                    >
                      {loadingPostingComment ? (
                        <img src={Loading} alt="" className="w-6" />
                      ) : (
                        "POST"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block w-1/3 h-full border">
        <div className="w-full flex h-[2.5em]">
          {buttons.map((post, index) => {
            return (
              <div
                key={index}
                className={`w-1/2 ${
                  currentShow == index ? "border-b-4 border-blue-500" : ""
                }`}
                onClick={() => setCurrentShow(index)}
              >
                <Button className="w-full">{post}</Button>
              </div>
            );
          })}
        </div>
        <div
          className={`${
            currentShow == 0 ? "" : "hidden"
          } w-full h-[calc(100%_-_2.5em)]`}
        >
          <h1 className="text-blue-500 p-1 w-full h-[2em]">
            {post?.likes?.length == 0
              ? "No likes yet!"
              : post?.likes?.length == 1
              ? `${post?.likes?.length} person liked your post.`
              : `${post?.likes?.length} people liked your post.`}
          </h1>
          <div className="w-full h-[calc(100%_-_2em)] overflow-auto p-1 flex flex-col gap-2">
            {post?.likes
              ?.sort((a: any, b: any) => {
                let fa = a.date,
                  fb = b.date;
                if (fb > fa) return 1;
                if (fb < fa) return -1;
                return 0;
              })
              ?.map((post: any, index: any) => {
                return (
                  <div
                    className="flex gap-2 items-center bg-gray-200 p-1 rounded-md hover:bg-gray-300 cursor-pointer"
                    onClick={() => {
                      navigate(`/user/${post.username}`);
                      setCurrent(4);
                      sessionStorage.setItem("current", "4");
                    }}
                    key={index}
                  >
                    <img
                      src={post.profile == "icon" ? Person : post.profile}
                      alt={post.fullname}
                      className="w-12 rounded-full border-2"
                    />
                    <div className="text-[0.8em]">
                      <div>
                        {post.fullname} {post?.email == user?.email && `(You)`}
                      </div>
                      <div className="text-blue-500">@{post.username}</div>
                    </div>
                    <div className="text-[0.8em] h-full p-1 text-blue-500">
                      {calculateDate(post?.date)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div
          className={`${
            currentShow == 1 ? "" : "hidden"
          } w-full h-[calc(100%_-_2.5em)]`}
        >
          <h1 className="text-blue-500 p-1 w-full h-[2em]">
            {post?.comments?.length == 0
              ? "No comments yet!"
              : post?.comments?.length == 1
              ? `${post?.comments?.length} comment on your post.`
              : `${post?.comments?.length} comments on your post.`}
          </h1>
          <div className="w-full h-[calc(100%_-_2em)] overflow-auto p-1 flex flex-col gap-2">
            {post?.comments
              ?.sort((a: any, b: any) => {
                let fa = a.date,
                  fb = b.date;

                if (fa < fb) {
                  return 1;
                }
                if (fa > fb) {
                  return -1;
                }
                return 0;
              })
              .map((post: any, index: any) => {
                return (
                  <div className="flex flex-col gap-1" key={index}>
                    <div
                      className="flex gap-2 items-center bg-gray-200 p-1 rounded-md hover:bg-gray-300 cursor-pointer"
                      onClick={() => {
                        navigate(`/user/${post?.from?.username}`);
                        setCurrent(4);
                        sessionStorage.setItem("current", "4");
                      }}
                    >
                      <img
                        src={
                          post?.from?.profile == "icon"
                            ? Person
                            : post?.from?.profile
                        }
                        alt={post?.from?.fullname}
                        className="w-12 rounded-full border-2"
                      />
                      <div className="text-[0.8em]">
                        <div>
                          {post?.from?.fullname}{" "}
                          {post?.from?.email == user?.email && `(You)`}
                        </div>
                        <div className="text-blue-500">
                          @{post?.from?.username}
                        </div>
                      </div>
                      <div className="h-full p-1 text-[0.8em] text-blue-500">
                        {calculateDate(post?.date)}
                      </div>
                    </div>
                    <div className="p-2 ml-6 border-l-2 font-normal text-[0.9em]">
                      {post?.content}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
