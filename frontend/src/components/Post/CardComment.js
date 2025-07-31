import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FollowHandler from "../Profil/FollowHandler";

const CardComment = ({ post }) => {
  const [text, setText] = useState("");
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const handleComment = () => {};

  return (
    <div className="comments-container">
      {post.comments.map((comment) => {
        const commenter = usersData.find(
          (user) => user._id === comment.commenterId
        );
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
                  commenter
                    ? `${
                        process.env.REACT_APP_API_URL
                      }${commenter.picture.replace("./", "")}`
                    : "/uploads/profil/random-user.png"
                }
                alt="commenter-pic"
              />
            </div>
            <div className="right-part">
              <div className="comment-header">
                <div className="pseudo">
                  <h3>{commenter ? commenter.pseudo : "Utilisateur"}</h3>
                  {userData._id !== comment.commenterId && (
                    <FollowHandler
                      idToFollow={comment.commenterId}
                      type={"card"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardComment;
