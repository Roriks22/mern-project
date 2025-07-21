import React from "react";
import Log from "../components/log";

const Profil = () => {
  return (
    <div className="profil-page">
      <div className="log-container">
        <Log signin={false} signup={true} />
        <div className="log-container">
          <img src="./img/log.svg" alt="log" />
        </div>
      </div>
    </div>
  );
};

export default Profil;
