import styles from "./styles.module.css";
import React from "react";
import { useState } from "react";
import axios from "axios";

export const JoinBlock = ({ onJoin }) => {
  // roomId использовать, если нужны разные комнаты
  // const [roomId, setRoomId] = useState("");
  const roomId = "tradeRoom";

  const [userName, setUserName] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onEnter = () => {
    const obj = {
      roomId,
      userName,
    };

    const config = {
      headers: {
        dataType: "json",
        "Content-Type": "application/json",
      },
    };

    setLoading(true);
    axios
      // .post("http://84.252.131.248:8000/rooms", obj, config)
      .post("/rooms", obj, config)
      .then((res) => {
        onJoin(obj);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error + " in POST");
      });
  };

  return (
    <div className={styles.root}>
      {
        // roomId использовать, если нужны разные комнаты
        /*  <input
        type="text"
        placeholder="Room ID"
        name="roomid"
        value={roomId}
        onChange={(event) => {
          setRoomId(event.target.value);
        }}
      />
      */
      }

      <input
        type="text"
        placeholder="Компания"
        name="company"
        value={userName}
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />

      <button
        disabled={isLoading}
        className={styles.btn}
        type="text"
        onClick={() => onEnter()}
      >
        {isLoading ? "Вход..." : "Войти"}
      </button>
    </div>
  );
};
