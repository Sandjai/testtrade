import styles from "./styles.module.css";
import { constants } from "../constants";
import React from "react";
import { useState } from "react";
import axios from "axios";

export const JoinBlock = ({ onJoin }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onEnter = () => {
    if (!roomId || !userName) {
      console.error("no data");
    }

    const obj = {
      roomId,
      userName,
      time: Date.now(),
    };

    const config = {
      headers: {
        dataType: "json",
        "X-Parse-Application-Id": constants.BACK4APP_API_KEY,
        "X-Parse-REST-API-Key": constants.BACK4APP_REST_API_KEY,
        "Content-Type": "application/json",
      },
    };

    setLoading(true);
    axios
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
      <input
        type="text"
        placeholder="Room ID"
        name="roomid"
        value={roomId}
        onChange={(event) => {
          setRoomId(event.target.value);
        }}
      />
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
