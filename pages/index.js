import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  function createRoom() {
    if (!name.trim()) {
      alert("名前を入力してください");
      return;
    }
    const roomId = Math.random().toString(36).substring(2, 10);
    router.push(`/room?room=${roomId}&name=${encodeURIComponent(name)}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>ルーム作成</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="名前" />
      <button onClick={createRoom}>作成</button>
    </div>
  );
}
