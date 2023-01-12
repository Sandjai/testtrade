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

const timeDuration = 20; //('Время в секундах на один ход игрока')
const rooms = new Map();

const testBots = new Map();
testBots.set("firstBot", "Бот 1");
testBots.set("secondBot", "Бот 2");

// Добавляем ботов в комнату "tradeRoom"
rooms.set(
  "tradeRoom",
  new Map([
    ["users", testBots],

    ["timer", startTimer({ roomId: "tradeRoom", index: 0, timeDuration })],
    ["time", Date.now()],
    ["activeUserIndex", 0],
  ])
);

const getUsers = (roomId) => [...rooms.get(roomId).get("users").values()];

const getTimer = (roomId) => rooms.get(roomId).get("timer");
const getTime = (roomId) => rooms.get(roomId).get("time");
const getActiveUserIndex = (roomId) => rooms.get(roomId).get("activeUserIndex");

const setTime = (roomId, value) => {
  return rooms.get(roomId).set("time", value);
};
const setTimer = (roomId, activeUserIndex) => {
  rooms
    .get(roomId)
    .set("timer", startTimer({ roomId, index: activeUserIndex, timeDuration }));
};

const setActiveUserIndex = (roomId, value) =>
  rooms.get(roomId).set("activeUserIndex", value);

const setUsers = (roomId, value) => rooms.get(roomId).set("users", value);

app.get("/rooms/:id", (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: getUsers(roomId),
      }
    : {
        users: null,
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
        ["time", Date.now()],
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
    console.log("Пользователь вошёл", socket.id);

    io.in(roomId).emit("USER/FIRSTSTART", {
      activeUserIndex: getActiveUserIndex(roomId),
      time: getTime(roomId),
      totalDuration: timeDuration,
    });
  });

  socket.on("disconnect", () => {
    console.log("Пользователь ВЫШЕЛ из комнаты");

    rooms.forEach((value, roomId) => {
      if (value.get("users").has(socket.id)) {
        const index = getUsers(roomId).indexOf(
          value.get("users").get(socket.id)
        );

        if (index === getActiveUserIndex(roomId)) {
          value.get("users").delete(socket.id);

          let activeUserIndex = index === getUsers(roomId).length ? 0 : index;
          clearInterval(getTimer(roomId));
          setTime(roomId, Date.now());
          setTimer(roomId, activeUserIndex);

          io.in(roomId).emit("USER/START", {
            activeUserIndex: activeUserIndex,
            totalDuration: timeDuration,
          });
          setActiveUserIndex(roomId, activeUserIndex);
        } else {
          value.get("users").delete(socket.id);
        }

        setUsers(roomId, value.get("users"));

        if (getUsers(roomId).length === 0) {
          clearInterval(getTimer(roomId));
          rooms.delete(roomId);
          console.log("TIMER STOPPED and ROOM DELETED");
        } else io.in(roomId).emit("ROOM/SET_USERS", getUsers(roomId));
      }
    });
  });

  console.log("Новый гость", socket.id);
});

server.listen(9999, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("Сервер запущен");
});

function startTimer({ roomId, index = 0, timeDuration }) {
  return setInterval(() => {
    index =
      index < getUsers(roomId).length - 1 && getUsers(roomId).length !== 1
        ? index + 1
        : 0;

    setActiveUserIndex(roomId, index);

    setTime(roomId, Date.now());

    io.in(roomId).emit("USER/START", {
      activeUserIndex: index,
      totalDuration: timeDuration,
    });
  }, timeDuration * 1000);
}
