import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EmojiEmotions,
  FavoriteBorder,
  Image,
  Person
} from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userDataAction } from "../../features/user/userSlice";
import { useUserData } from "../../hooks";
import Picker from "emoji-picker-react";
import api from "./../../api";
import Loading from "./../../assets/loading/loading.gif";
const PostComponent: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state?.user?.userData);
  const [postText, setPostText] = useState<string>("");
  const [showEmojiFile, setShowEmojiFile] = useState<boolean>(false);
  const [posts, setPosts] = useState<any>([]);
  const emojiElement: any = useRef(null);
  const onEmojiClick = (event: any, emojiObject: any) => {
    let msg = postText;
    msg = msg + `${emojiObject.emoji}`;
    setPostText(msg);
  };
  useEffect(() => {
    document.addEventListener("mousedown", () => {
      if (!emojiElement.current?.contains(event?.target))
        setShowEmojiFile(false);
    });
  }, [showEmojiFile]);
  const post = async () => {
    try {
      if (postText == "") return;
      const date = new Date();
      const post = {
        post: { description: postText, images: [] },
        owner: user,
        date
      };
      setPostText("");
      await api.post("/post", post);
    } catch (error) {
      console.log(error);
      setPostText("");
    }
  };
  const getPosts = async () => {
    try {
      const request = await api.get("/post");
      const response = request.data;
      console.log(response);
      setPosts(response);
      console.log(post);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    useUserData(navigate, dispatch, userDataAction);
    getPosts();
  }, []);
  const calculateDate = (date: any) => {
    let diffTime = Math.abs(new Date().valueOf() - new Date(date).valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    [days, hours, minutes, secs] = [
      Math.floor(days),
      Math.floor(hours),
      Math.floor(minutes),
      Math.floor(secs)
    ];
    if (days != 0) {
      if (days > 365) {
        let years = 0;
        while (days > 365) {
          years++;
          days - 365;
        }
        return `${years}y`;
      } else {
        return `${days}d`;
      }
    } else if (hours != 0) {
      return `${hours}h`;
    } else if (minutes != 0) {
      return `${minutes}m`;
    } else {
      return `${secs}s`;
    }
  };
  const [images, setImages] = useState<any>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageURLs, setImageURLs] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const onImageChange = (e: any) => {
    setImages([...e.target.files]);
  };
  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls: any = [];
    images.forEach((image: any) =>
      newImageUrls.push(URL.createObjectURL(image))
    );
    setImageURLs(newImageUrls);
  }, [images]);
  return (
    <div className="w-2/4 border flex items-center justify-center h-full min-h-full overflow-auto flex-col">
      <div className="h-full w-4/5 p-2 px-4 flex flex-col gap-3">
        <div className="flex w-full gap-2">
          <div className="w-[4em] h-[4em] max-h-[4em] rounded-full border-2 flex justify-center items-center">
            {user?.profile === "icon" ? (
              <Person
                className="text-[3em] rounded-full
              "
              />
            ) : (
              <img
                src={user?.profile}
                alt=""
                className="w-full h-full rounded-full"
              />
            )}
          </div>
          <div className="w-[calc(100%_-_4em)]">
            <div className="w-full">
              <input
                type="text"
                value={postText}
                multiple={true}
                className="w-full border h-[4em] px-2 outline-none rounded-md"
                placeholder="Post Something!"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPostText(e.target.value);
                }}
              />
            </div>
            {imageURLs.length <= 0 ? null : (
              <div className="py-2 relative w-full">
                <div className="flex items-center justify-center">
                  <img src={imageURLs[currentImage]} />
                </div>
                <span
                  className="absolute top-[45%] cursor-pointer bg-white border rounded-full p-[0.1em]"
                  hidden={currentImage == 0 ? true : false}
                  onClick={() => {
                    if (currentImage == 0) {
                    } else {
                      setCurrentImage((current) => current - 1);
                    }
                    console.log(currentImage);
                  }}
                >
                  <ChevronLeft className="text-[1.6em]" />
                </span>
                <span
                  className="absolute top-[45%] right-0 cursor-pointer bg-white border rounded-full p-[0.1em]"
                  onClick={() => {
                    if (currentImage >= imageURLs.length - 1) {
                    } else {
                      setCurrentImage((current) => current + 1);
                    }
                    console.log(currentImage);
                  }}
                  hidden={currentImage >= imageURLs.length - 1}
                >
                  <ChevronRight className="text-[1.6em]" />
                </span>
              </div>
            )}
            <div className="flex mt-1 items-center justify-between">
              <div className="gap-2 flex">
                <div className="relative">
                  <span onClick={() => setShowEmojiFile((current) => !current)}>
                    <EmojiEmotions className="text-blue-500 text-[1.6em] cursor-pointer" />
                  </span>
                  {showEmojiFile && (
                    <div
                      className="absolute top-[2em] left-0 bg-white z-50"
                      ref={emojiElement}
                    >
                      <Picker
                        onEmojiClick={onEmojiClick}
                        pickerStyle={{ width: "100%" }}
                      />
                    </div>
                  )}
                </div>
                <span>
                  <label htmlFor="image-upload">
                    <Image className="text-blue-500 text-[1.6em] cursor-pointer" />
                    <input
                      type="file"
                      id="image-upload"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={onImageChange}
                    />
                  </label>
                </span>
              </div>
              <div>
                <Button
                  variant="contained"
                  className="bg-blue-500 px-10"
                  onClick={post}
                  disabled={loading}
                >
                  {loading ? <img src={Loading} className="w-7" /> : "POST"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {(posts as any).map((data: any, index: any) => {
          return (
            <div className="border w-full p-2 flex gap-2" key={index}>
              <div className="w-[4em] h-[4em] rounded-full border-2 flex items-center justify-center">
                {data?.owner?.profile === "icon" ? (
                  <Person className="text-[3.5em]" />
                ) : (
                  <img
                    src={data?.owner?.profile}
                    alt=""
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="w-[calc(100%_-_4em)] flex flex-col gap-2">
                <div className="flex flex-col">
                  <div className="flex gap-2">
                    <div className="font-medium">{data?.owner?.fullname}</div>
                    <div className="opacity-50">@{data?.owner?.username}</div>
                    <div className="text-blue-500">
                      {calculateDate(data?.date)}
                    </div>
                  </div>
                  <div className="font-normal py-1">
                    {data?.post?.description}
                  </div>
                </div>
                {(data?.post?.images as any).length <= 0 ? null : (
                  <div>
                    AW{/*  */}
                    <img
                      src="https://pbs.twimg.com/media/FcYuK2ZXwAIOqTB?format=jpg&name=small"
                      alt=""
                      className="rounded-md"
                    />
                  </div>
                )}
                <div>
                  <div className="flex justify-between items-center p-2 px-5">
                    <div className="flex justify-center items-center gap-2">
                      <span>
                        <FavoriteBorder className="text-[1.6em] opacity-70 cursor-pointer" />
                      </span>
                      <span>
                        {(data?.likes as any)?.length <= 0 ? null : "10K"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center justify-center ">
                      <span>
                        <i className="fa-regular fa-comment text-[1.5em] opacity-70 cursor-pointer"></i>
                      </span>
                      <span>
                        {(data?.comments as any)?.length <= 0 ? null : "10K"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center justify-center">
                      <span>
                        <i className="fa-regular fa-share-from-square text-[1.3em] opacity-70 cursor-pointer"></i>
                      </span>
                      <span>
                        {(data?.share as any)?.length <= 0 ? null : "10K"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 px-1">
                    <span>
                      <EmojiEmotions />
                    </span>
                    <TextField
                      placeholder="Post a comment"
                      className="w-[85%]"
                      autoComplete="off"
                    />
                    <span>POST</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostComponent;
