import React, { useEffect, useState } from "react";
import Routes from "./components/routes";
import { UidContext } from "./components/routes/AppContext";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";

const App = () => {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}jwtid`,
          withCredentials: true,
        });
        setUid(res.data);
      } catch (err) {
        console.log("No token");
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (uid) dispatch(getUser(uid));
  }, [uid, dispatch]);

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;
