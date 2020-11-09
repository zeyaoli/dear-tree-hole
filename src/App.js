import React, { useState } from "react";
import RecordView from "./Components/RecordView";
import Template from "./Components/Template";
import DisplayVideo from "./Components/DisplayVideo";

const App = () => {
  const [record, setRecord] = useState(true);

  const changeRecordState = () => {
    setRecord(false);
  };

  return (
    <>
      <Template />
      {/* if onsubmit, recordview disappear, shows prev person video */}
      {record ? (
        <RecordView changeRecordState={changeRecordState} />
      ) : (
        <DisplayVideo />
      )}
    </>
  );
};

export default App;
