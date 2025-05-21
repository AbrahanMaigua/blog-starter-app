'use client';

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function AdminPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  // const [isActive, setIsActive] = useState(true);
  // const [isAdmin, setIsAdmin] = useState(false);
  // const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  // const [isEditor, setIsEditor] = useState(false);
  // const [isAuthor, setIsAuthor] = useState(false);
  // const [isSubscriber, setIsSubscriber] = useState(false);
  // const [isContributor, setIsContributor] = useState(false);
  // const [isModerator, setIsModerator] = useState(false);
  // const [isVIP, setIsVIP] = useState(false);
  // const [isBanned, setIsBanned] = useState(false);
  // const [isDeleted, setIsDeleted] = useState(false);
  // const [isSuspended, setIsSuspended] = useState(false);
  // const [isPending, setIsPending] = useState(false);
  // const [isVerified, setIsVerified] = useState(false);
  // const [isEmailVerified, setIsEmailVerified] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, name, password, confirmPassword, role }),
      });
      if (!res.ok) throw new Error("Error");
      setUsername("");
      setEmail("");
      setName("");
  
      toast.success("Usuario creado!");
  
    } catch (err) {
      toast.error("Error al crear el post.");
    }
  };

  return (
    <div className="p-6">
        <h1 className="text-xl font-bold mb-4">crearte user</h1>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="username"
            className="border p-2 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input type="text"
            type="text"
            placeholder="name"
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
           />
          <input
            type="password"
            placeholder="password"
            className="border p-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="confirm password"
            className="border p-2 w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          /> 
           <button 
           type="submit"
           className="bg-blue-600 text-white px-4 py-2 radius-3">
                crear usario
           </button>

        </form>
        <ToastContainer />
    </div>
  );
}
