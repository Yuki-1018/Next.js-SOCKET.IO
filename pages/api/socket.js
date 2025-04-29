import { Server } from "socket.io";

const rooms = {}; // インメモリにルーム情報保存

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      console.log("ユーザー接続", socket.id);

      socket.on("create-room", ({ roomId, name }) => {
        rooms[roomId] = { host: socket.id, users: [{ id: socket.id, name, isHost: true }] };
        socket.join(roomId);
        io.to(roomId).emit("update-users", rooms[roomId].users);
      });

      socket.on("join-room", ({ roomId, name }) => {
        if (!rooms[roomId]) {
          socket.emit("room-not-found");
          return;
        }
        rooms[roomId].users.push({ id: socket.id, name, isHost: false });
        socket.join(roomId);
        io.to(roomId).emit("update-users", rooms[roomId].users);
      });

      socket.on("disconnect", () => {
        for (const roomId in rooms) {
          const room = rooms[roomId];
          room.users = room.users.filter(user => user.id !== socket.id);

          if (socket.id === room.host) {
            io.to(roomId).emit("host-disconnected");
            delete rooms[roomId];
          } else {
            io.to(roomId).emit("update-users", room.users);
          }
        }
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
