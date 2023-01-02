import classNames from "classnames";
import { Timer } from "../../Timer/Timer";

export const Column = ({
  styles,
  index,
  children,
  roomId,
  activeInd,
  setActiveInd,
  timer,
  setTimer,
}) => {
  return (
    <>
      <div className={styles.turn}>
        {activeInd === index ? (
          <Timer
            index={index}
            roomId={roomId}
            setActiveInd={setActiveInd}
            timer={timer}
            setTimer={setTimer}
          ></Timer>
        ) : (
          ""
        )}
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
