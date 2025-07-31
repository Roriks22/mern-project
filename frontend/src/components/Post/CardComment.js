import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../Utils";

const CardComment = ({ post }) => {
  const [text, setText] = useState("");
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const handleComment = () => {};
  return (
    <div className="comments-container">
      {post.comments.map((comment) => {
        return (
          <div
            className={
              comment.commenterId === userData._id
                ? "comment-container client"
                : "comment-container"
            }
            key={comment._id}
          >
            <div className="left-part">
              <img
                src={
                  !isEmpty(usersData[0]) &&
                  usersData
                    .map((user) => {
                      if (user._id === comment.commenterId)
                        return `${
                          process.env.REACT_APP_API_URL
                        }${user.picture.replace("./", "")}`;
                      else return null;
                    })
                    .join("")
                }
                alt="commenter-pic"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardComment;
