import { useEffect, useState } from "react";
import socket from "../socket";
import { Column } from "./Column/Column";
import styles from "./styles.module.css";
export const Table = ({ time, users, roomId }) => {
  const [activeInd, setActiveInd] = useState();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    socket.on("USER/START", ({ activeUserIndex, time }) => {
      setActiveInd(activeUserIndex);
      setTimer(time);
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
          setActiveInd={setActiveInd}
          setTimer={setTimer}
          timer={timer}
        >
          {item}
        </Column>
      ))}
    </div>
  );
};
