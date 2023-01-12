import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { ReactComponent as ClockIcon } from "./images/clock.svg";
import classNames from "classnames";
import { getPadTime } from "./../utils/getPadTime";
import socket from "../socket";

export const Timer = ({ timer, className }) => {
  const [time, setTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => (time >= 1 ? time - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;

  return (
    <div className={classNames(styles.root, className)}>
      <div>
        {" "}
        {getPadTime(minutes)}:{getPadTime(seconds)}
      </div>
      <ClockIcon />
    </div>
  );
};
