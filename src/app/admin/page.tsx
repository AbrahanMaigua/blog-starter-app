'use client';

import { useRef, useState, useEffect } from "react";
import { custom_marked } from "@/lib/markdown_custom";
import { ApiError } from "next/dist/server/api-utils";
import { request } from "http";
import { useRouter } from "next/navigation";

export default function RichTextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("");
  const [title, settitle] = useState("");
  const router = useRouter();

  const [markdown, setMarkdown] = useState("");
  const [mode, setMode] = useState<"edit" | "html" | "preview" | "markdown">("edit");

  const exec = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    setHtml(editorRef.current?.innerHTML || "");
  };

  const handleInput = () => {
    setHtml(editorRef.current?.innerHTML || "");
  };

  useEffect(() => {
    if (mode === "edit" && editorRef.current) {
      editorRef.current.innerHTML = html;
    }
  }, [mode]);

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const md = e.target.value;
    setMarkdown(md);
    setHtml(custom_marked(md));
  };

  // Submit handler
  const handleSubmit = () => {
    // You can replace this with your submit logic
    alert("Submitted!\n\nHTML:\n" + title + "\n\n" + html + "\n\nMarkdown:\n" + markdown);
    console.log("title:", title);
    console.log("HTML:", html);
    console.log("Markdown:", markdown);
    
    fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, html, markdown }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
      }
      // Check if the response is ok
      console.log("Response status:", response.status);
      router.push("/posts");
      return;
    })
    .then(() => {
      // Reset the editor
      setHtml("");
      setMarkdown("");
      if (editorRef.current) editorRef.current.innerHTML = "";
      setMode("edit");
      // Optionally, you can also reset the mode to "edit"
      // setMode("edit");
    })
    .catch((error: unknown) => {
      console.error("Submission error:", error);
      alert("Error submitting data.");
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      {/* Botones de formato */}
      {mode === "edit" && (
        <div className="mb-2 space-x-2">
          <button onClick={() => exec("bold")} className="px-2 py-1 border rounded font-bold">B</button>
          <button onClick={() => exec("italic")} className="px-2 py-1 border rounded italic">I</button>
          <button onClick={() => exec("underline")} className="px-2 py-1 border rounded underline">U</button>
          <button onClick={() => {
            const url = prompt("URL de la imagen");
            if (url) exec("insertImage", url);
          }} className="px-2 py-1 border rounded">🖼️</button>
          <button onClick={() => {
            const url = prompt("URL del enlace");
            if (url) exec("createLink", url);
          }} className="px-2 py-1 border rounded">🔗</button>
          <button onClick={() => {
            setHtml("");
            setMarkdown("");
            if (editorRef.current) editorRef.current.innerHTML = "";
          }} className="px-2 py-1 border rounded">🧹 Limpiar</button>
        </div>
      )}

      {/* Selector de modo */}
      <div className="space-x-2">
        <button onClick={() => setMode("edit")} className={`px-3 py-1 border rounded ${mode === "edit" ? "bg-blue-100" : ""}`}>📝 Editor</button>
        <button onClick={() => setMode("html")} className={`px-3 py-1 border rounded ${mode === "html" ? "bg-blue-100" : ""}`}>🔤 HTML</button>
        <button onClick={() => setMode("preview")} className={`px-3 py-1 border rounded ${mode === "preview" ? "bg-blue-100" : ""}`}>🌍 Vista</button>
        <button onClick={() => setMode("markdown")} className={`px-3 py-1 border rounded ${mode === "markdown" ? "bg-blue-100" : ""}`}>📓 Markdown</button>
      </div>
      {/* Contador de caracteres para un textarea controlado en React */}
      

    <textarea 
        value={title}
        onChange={(e) => settitle(e.target.value)}
        maxLength={60}
        placeholder="Título del post..."
        className="w-full p-2 rounded bg-white mb-2"
        style={{
          resize: "none",
          border: "none",
          outline: "none",
          width: "100%",
          height: "auto",
          overflow: "hidden",
          fontSize: "1.35rem",
          fontWeight: "bold"
        }}
      />

      <p className="left-text text-sm text-gray-500">{title.length} / 60</p>


      {/* Vista según modo */}
      {mode === "edit" && (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="min-h-[200px] border p-2 bg-white rounded"
        />
      )}

      {mode === "html" && (
        <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded border">{html}</pre>
      )}

      {mode === "preview" && (
        <div className="preview-content border p-2 bg-white rounded min-h-[200px]" dangerouslySetInnerHTML={{ __html: (html) }} />
      )}

      {mode === "markdown" && (
        <textarea
          value={markdown}
          onChange={handleMarkdownChange}
          style={{
            resize: "none",
            border: "none",
            outline: "none",
            width: "100%",
            height: "auto",
            overflow: "hidden"
          }}
          className="w-full min-h-[200px] border p-2 rounded bg-white"
          placeholder="Escribe en Markdown..."
        />
      )}

      {/* Submit button */}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sumbi
        </button>
      </div>
    </div>
  );
}
