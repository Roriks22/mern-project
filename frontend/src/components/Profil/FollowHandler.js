import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../Utils";
import { followUser, unfollowUser } from "../../actions/user.actions";

const FollowHandler = ({ idToFollow }) => {
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (!isEmpty(userData.following)) {
      setIsFollowed(userData.following.includes(idToFollow));
    }
  }, [userData.following, idToFollow]);

  const handleFollow = () => {
    dispatch(followUser(userData._id, idToFollow));
    setIsFollowed(true);
  };
  const handleUnfollow = () => {
    dispatch(unfollowUser(userData._id, idToFollow));
    setIsFollowed(false);
  };

  return (
    <>
      {isFollowed && !isEmpty(userData) && (
        <span onClick={handleUnfollow}>
          <button className="unfollow-btn">Abonné</button>
        </span>
      )}
      {isFollowed === false && !isEmpty(userData) && (
        <span onClick={handleFollow}>
          <button className="follow-btn">Suivre</button>
        </span>
      )}
    </>
  );
};

export default FollowHandler;
