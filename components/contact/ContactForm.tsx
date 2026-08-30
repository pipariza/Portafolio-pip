"use client";

import { useState, type FormEvent } from "react";
import { FORMSPREE_ENDPOINT } from "@/lib/config";

type Status = "idle" | "loading" | "success" | "error";

const inputClasses =
  "w-full bg-transparent border-0 border-b border-bone/25 focus:border-bone outline-none py-3 text-bone placeholder:text-bone/40 transition-colors";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-7">
      <div>
        <label htmlFor="name" className="sr-only">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Nombre"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="email" className="sr-only">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Correo"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="reason" className="sr-only">
          Motivo
        </label>
        <select
          id="reason"
          name="reason"
          required
          defaultValue=""
          className={`${inputClasses} appearance-none`}
        >
          <option value="" disabled>
            Motivo
          </option>
          <option value="Oferta laboral">Oferta laboral</option>
          <option value="Propuesta freelance">Propuesta freelance</option>
          <option value="Colaboración">Colaboración</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        data-cursor-hover
        className="mt-4 self-start rounded-full bg-bone text-void px-8 py-4 text-xs font-bold uppercase tracking-[0.05em] transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {status === "loading" ? "Enviando…" : "Enviar mensaje"}
      </button>

      {status === "success" && (
        <p className="text-sm text-bone/70">Gracias — te respondo pronto.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-bone/70">
          Algo falló. Escribime directo a {" "}
          <a href="mailto:hola@piparizaa.com" className="underline">
            hola@piparizaa.com
          </a>
          .
        </p>
      )}
    </form>
  );
}
