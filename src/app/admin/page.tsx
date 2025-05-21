'use client';

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error("Error");
      toast.success("Post creado!");
      setTitle("");
      setContent("");
    } catch (err) {
      toast.error("Error al crear el post.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Crear Post</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Contenido"
          className="border p-2 w-full h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}> </textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Publicar
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
