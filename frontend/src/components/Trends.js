import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrends } from "../actions/post.actions";
import { isEmpty } from "./Utils";
import { NavLink } from "react-router-dom";

const Trends = () => {
  const posts = useSelector((state) => state.allPostsReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const trendList = useSelector((state) => state.trendingReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(posts[0])) {
      const postsArr = Object.keys(posts).map((i) => posts[i]);
      let sortedArray = postsArr.sort((a, b) => {
        return b.likers.length - a.likers.length;
      });
      sortedArray.length = 3;
      dispatch(getTrends(sortedArray));
    }
  }, [posts, dispatch]);

  return (
    <div className="trending-container">
      <h4>Trending</h4>
      <NavLink to="/trending">
        <ul>
          {trendList.length &&
            trendList.map((post) => {
              const userPoster = usersData.find(
                (user) => user._id === post.posterId
              );
              let displayImage = "";
              if (post.picture) {
                displayImage = `${process.env.REACT_APP_API_URL}${post.picture}`;
              } else if (!post.picture && !post.video && userPoster?.picture) {
                displayImage = `${process.env.REACT_APP_API_URL}${userPoster.picture}`;
              }
              return (
                <li key={post._id}>
                  <div>
                    {displayImage && <img src={displayImage} alt="preview" />}
                    {post.video && !post.picture && (
                      <iframe
                        src={post.video}
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={post._id}
                      ></iframe>
                    )}
                  </div>
                  <div className="trend-content">
                    <p>{post.message}</p>
                    <span>Lire</span>
                  </div>
                </li>
              );
            })}
        </ul>
      </NavLink>
    </div>
  );
};

export default Trends;
