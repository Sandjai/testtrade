import { useEffect, useState } from "react";
import socket from "../socket";
import { Column } from "./Column/Column";
import styles from "./styles.module.css";
export const Table = ({ users, roomId }) => {
  const [activeInd, setActiveInd] = useState();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    socket.on("USER/START", ({ activeUserIndex, time, totalDuration }) => {
      setActiveInd(activeUserIndex);

      setTimer(totalDuration);
    });

    socket.on("USER/FIRSTSTART", ({ activeUserIndex, time, totalDuration }) => {
      setActiveInd(activeUserIndex);

      const secondsPassed = (Date.now() - time) / 1000;

      const currentTimerTime =
        totalDuration - (secondsPassed % totalDuration)
          ? totalDuration - (secondsPassed % totalDuration)
          : secondsPassed;
      /*        secondsPassed % totalDuration
          ? secondsPassed % totalDuration
          : secondsPassed;
          */
      console.log("currentTimerTime" + currentTimerTime);
      setTimer(Math.round(currentTimerTime));
    });
  }, []);

  return (
    <div className={styles.table}>
      <div className={styles.hero}>
        <h3>Ход</h3>
      </div>
      <div className={styles.hero}>
        <h3>Параметры и требования</h3>
      </div>
      <div className={styles.cell}>
        <h4>
          Наличие комплекса мероприятий, повышающих стандарты качества
          изготовления
        </h4>
      </div>
      <div className={styles.cell}>
        <h4>Срок изготовления лота, дней</h4>
      </div>
      <div className={styles.cell}>
        <h4>Гарантийный обязательства, мес</h4>
      </div>
      <div className={styles.cell}>
        <h4>Условия оплаты</h4>
      </div>
      <div className={styles.cell}>
        <h4>Стоимость изготовления лота, руб. (без НДС)</h4>
      </div>
      <div className={styles.cell}>
        <h4>Действия</h4>
      </div>

      {users.map((item, index) => (
        <Column
          key={item + index}
          styles={styles}
          index={index}
          roomId={roomId}
          activeInd={activeInd}
          timer={timer}
        >
          {item ? item : "No name"}
        </Column>
      ))}
    </div>
  );
};
