import React, { useContext } from "react";
import Log from "../components/log";
import { UidContext } from "../components/routes/AppContext";

const Profil = () => {
  const uid = useContext(UidContext);
  return (
    <div className="profil-page">
      {uid ? (
        <h1>Update Page</h1>
      ) : (
        <div className="log-container">
          <Log signin={false} signup={true} />
          <div className="log-container">
            <img src="./img/log.svg" alt="log" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;
