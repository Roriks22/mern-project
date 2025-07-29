import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../Utils";

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
              </div>
            </div>
          </div>
        </>
      )}
    </li>
  );
};

export default Card;
