import React, { useState, useEffect } from "react";
import SocketContext from "./Components/SocketContext";
import RecordView from "./Components/RecordView";
import Template from "./Components/Template";
import DisplayVideo from "./Components/DisplayVideo";
import io from "socket.io-client";
import "./Styles/app.css";
//socket single instance ref:https://itnext.io/how-to-use-a-single-instance-of-socket-io-in-your-react-app-6a4465dcb398
const socket = io();

const App = (props) => {
  //default record view first
  const [record, setRecord] = useState(true);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`socket ${socket.id} connected`);
    });
  }, []);

  //managing state
  const changeRecordState = () => {
    setRecord(false);
  };

  return (
    <SocketContext.Provider value={socket}>
      <main>
        <Template />
        {/* if onsubmit, RecordView disappear, displays prev person video */}
        {record ? (
          <RecordView changeRecordState={changeRecordState} />
        ) : (
          <DisplayVideo />
        )}
      </main>
    </SocketContext.Provider>
  );
};

export default App;
