import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

let socket;

export default function Room() {
  const router = useRouter();
  const { room, name } = router.query;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!room || !name) return;

    fetch("/api/socket"); // Socket.IOサーバーを初期化
    socket = io();

    socket.on("connect", () => {
      socket.emit("join-room", { roomId: room, name });
    });

    socket.on("room-not-found", () => {
      alert("存在しないルームです");
      router.push("/");
    });

    socket.on("update-users", (userList) => {
      setUsers(userList);
    });

    socket.on("host-disconnected", () => {
      alert("主催者が切断しました。トップに戻ります。");
      router.push("/");
    });

    return () => {
      socket.disconnect();
    };
  }, [room, name]);

  return (
    <div style={{ padding: 20 }}>
      <h1>ルームID: {room}</h1>
      <h2>参加者一覧</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} {user.isHost && "(主催者)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
