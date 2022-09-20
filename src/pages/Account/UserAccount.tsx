import React from "react";
import { useSelector } from "react-redux";

const UserAccount: React.FC = () => {
  const user = useSelector((state: any) => state?.user?.userData);
  return (
    <div className="lg:w-[80%] xl:w-[50%] m-auto h-full my-2">
      <div className="border h-[25em] w-full bg-gray-200 rounded-md flex flex-col">
        <div className="border rounded-full h-1/3 relative">
          <img
            src={user?.profile}
            className="rounded-full absolute h-[10em] w-[10em] -bottom-10 left-2"
          />
          <div className="rounded-full absolute right-3 bottom-3 border border-gray-500 p-2 px-4 cursor-pointer opacity-80 font-semibold">
            Edit your profile
          </div>
        </div>
        <div className="h-2/3 bg-white p-2 pt-12">
          <div className="flex flex-col">
            <h1 className="font-semibold opacity-80 text-[1.3em]">
              {user?.fullname}
            </h1>
            <h1 className="font-normal opacity-80 text-[1.3em] text-blue-500">
              @{user?.username}
            </h1>
          </div>
          <div>
            <div>0 followers</div>
            <div>0 following</div>
          </div>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default UserAccount;