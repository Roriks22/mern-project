import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dateParser, isEmpty } from "../Utils";
import FollowHandler from "../Profil/FollowHandler";

const Card = ({ post }) => {
  const [isLoading, setIsLoading] = useState(true);
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.usersReducer);

  useEffect(() => {
    if (!isEmpty(usersData)) {
      setIsLoading(false);
    }
  }, [usersData]);

  const poster = usersData.find((user) => user._id === post.posterId);
  return (
    <li className="card-container" key={post._id}>
      {isLoading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : (
        <>
          <div className="card-left">
            <img
              src={
                poster
                  ? `${process.env.REACT_APP_API_URL}${poster.picture.replace(
                      "./",
                      ""
                    )}`
                  : "/uploads/profil/random-user.png"
              }
              alt="poster-pic"
            />
          </div>
          <div className="card-right">
            <div className="card-header">
              <div className="pseudo">
                <h3>{poster ? poster.pseudo : ""}</h3>
                {post.posterId !== userData._id && (
                  <FollowHandler idToFollow={post._id} type={"card"} />
                )}
              </div>
              <span>{dateParser(post.createdAt)}</span>
            </div>
            <p>{post.message}</p>
            {post.picture && (
              <img
                src={`${process.env.REACT_APP_API_URL}${poster.picture.replace(
                  "./",
                  ""
                )}`}
                alt="card-pic"
                className="card-pic"
              />
            )}
            {post.video && (
              <iframe
                width="500"
                height="300"
                src={post.video}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={post._id}
              ></iframe>
            )}
          </div>
        </>
      )}
    </li>
  );
};

export default Card;
