const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    //allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(express.json());

const timeDuration = 10; //('Время в секундах на один ход игрока')
const rooms = new Map();
const getUsers = (roomId) => [...rooms.get(roomId).get("users").values()];

const getTimer = (roomId) => rooms.get(roomId).get("timer");
const getTime = (roomId) => rooms.get(roomId).get("time");
const getActiveUserIndex = (roomId) => rooms.get(roomId).get("activeUserIndex");
const getTurn = (roomId) => rooms.get(roomId).get("turn");

const setTime = (roomId, value) => rooms.get(roomId).set("time", value);
const setActiveUserIndex = (roomId, value) =>
  rooms.get(roomId).set("activeUserIndex", value);
const setTurn = (roomId, value) => rooms.get(roomId).set("turn", value);
const setUsers = (roomId, value) => rooms.get(roomId).set("users", value);

app.get("/rooms/:id", (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: getUsers(roomId),
      }
    : {
        users: getUsers(roomId),
      };

  return res.json(obj);
});

app.post("/rooms", (req, res) => {
  const { roomId } = req.body;

  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],

        ["timer", startTimer({ roomId, index: 0, timeDuration })],
        ["time", ""],
        ["activeUserIndex", 0],
        ["turn", 0],
      ])
    );
  }

  return res.send();
});

io.on("connection", (socket) => {
  socket.on("ROOM/JOIN", ({ roomId, userName }) => {
    socket.join(roomId);

    rooms.get(roomId).get("users").set(socket.id, userName);

    io.in(roomId).emit("ROOM/SET_USERS", getUsers(roomId));
    console.log("Гость вошёл", socket.id);
    if (getUsers(roomId).length === 1) {
      setTime(roomId, Date.now());
      io.in(roomId).emit("USER/START", {
        activeUserIndex: getActiveUserIndex(roomId),
        time: timeDuration,
      });
    } else {
      const secondsPassed = Math.ceil((Date.now() - getTime(roomId)) / 1000);
      const currentTimerTime =
        getTurn(roomId) === 0
          ? timeDuration - (secondsPassed % timeDuration)
          : timeDuration - (secondsPassed % (timeDuration * getTurn(roomId)));
      io.to(socket.id).emit("USER/START", {
        time: currentTimerTime,
        activeUserIndex: getActiveUserIndex(roomId),
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnect");

    rooms.forEach((value, roomId) => {
      if (value.get("users").has(socket.id)) {
        value.get("users").delete(socket.id);
        setUsers(roomId, value.get("users"));

        if (getUsers(roomId).length === 0) {
          console.log("TIMER STOPPED");
          clearInterval(getTimer(roomId));
        }

        io.in(roomId).emit("ROOM/SET_USERS", getUsers(roomId));
      }
    });
  });

  console.log("Новый гость", socket.id);
});

server.listen(8080, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("Сервер запущен");
});

const startTimer = ({ roomId, index = 0, timeDuration }) => {
  return setInterval(() => {
    index = index < getUsers(roomId).length - 1 ? index + 1 : 0;

    setActiveUserIndex(roomId, index);

    io.in(roomId).emit("USER/START", {
      activeUserIndex: index,
      time: timeDuration,
    });

    setTurn(roomId, getTurn(roomId) + 1);
  }, timeDuration * 1000);
};
