import React from "react";
import "../Styles/mainText.css";

const Template = () => {
  return (
    <div id='template'>
      <h1>Under the Tree</h1>
      <p>
        Hi friend, how are you doing? This is a tree for you to express your
        feeling.{" "}
      </p>
      <h3>How does it work?</h3>
      <ul>
        <li>📖 Read the topic for this week.</li>
        <li>
          🎬 Once you are ready, press the start button and talk to the camera
        </li>
        <li>
          ⏱ You will have 10 seconds limit. However, you can stop whenever you
          want :)
        </li>
        <li>
          💌 Send your feeling to the tree, and dig out someone else's feeling
          from the tree (I don't recommend re-recording because your first
          feeling is rare and valuable. 💕)
        </li>
        <li>
          🤞 Feel what others feel, synthesis it and acknowledge it. The video
          will be disposed to the void after watching.
        </li>
      </ul>
      <h3>Weekly Topic</h3>
      <p>💭 What is on your mind at this moment?</p>
    </div>
  );
};

export default Template;
