import classNames from "classnames";
import { useEffect } from "react";
import socket from "../../socket";

import { Timer } from "../../Timer/Timer";

export const Column = ({
  styles,
  index,
  children,
  activeInd,
  timer,
  roomId,
}) => {
  useEffect(() => {
    socket.on("ROOM/GETTIME", (socketId) => {
      const obj = {
        roomId,
        time: Date.now(),
        socketId,
      };
      socket.emit("ROOM/SETTIME", obj);
    });
  }, []);

  return (
    <>
      <div className={styles.turn}>
        {activeInd === index ? <Timer timer={timer}></Timer> : ""}
      </div>
      <div className={styles.hero}>
        <h3>
          Участник {index + 1} <br></br> {children}
        </h3>
      </div>
      <div className={classNames(styles.cell, styles.cell_content)}>
        <center>1</center>
      </div>
      <div className={classNames(styles.cell, styles.cell_content)}>
        <center>1</center>
      </div>
      <div className={classNames(styles.cell, styles.cell_content)}>
        <center>1</center>
      </div>
      <div className={classNames(styles.cell, styles.cell_content)}>
        <center>1</center>
      </div>
      <div className={classNames(styles.cell, styles.cell_content)}>
        <center>
          <span className={styles.blue}>3,700,000 руб.</span>
          <br></br>
          <span className={styles.red}>-25,000 руб.</span>
          <br></br>
          <span className={styles.green}>2,475,000 руб.</span>
        </center>
      </div>
      <div className={classNames(styles.cell, styles.cell_content)}>
        <center>1</center>
      </div>
    </>
  );
};
