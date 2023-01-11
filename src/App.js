import { useEffect, useReducer } from "react";

import { JoinBlock } from "./components/JoinBlock/JoinBlock";
import { reducer } from "./components/reducer";
import socket from "./components/socket";
import { Table } from "./components/Table/Table";

function App() {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
  });

  const onJoin = async (obj) => {
    dispatch({
      type: "JOINED",
      payload: obj,
    });
    socket.emit("ROOM/JOIN", obj);
  };

  const setUsers = (users) => {
    dispatch({
      type: "SET_USERS",
      payload: users,
    });
  };

  useEffect(() => {
    socket.on("ROOM/SET_USERS", setUsers);
  }, []);

  console.log(state);
  return (
    <>
      {!state.joined ? (
        <JoinBlock onJoin={onJoin} />
      ) : (
        <Table {...state}></Table>
      )}
    </>
  );
}

export default App;
