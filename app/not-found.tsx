import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-mist">Error 404</p>
      <h1 className="text-[12vw] font-extrabold uppercase leading-[0.95] md:text-7xl">
        Página no encontrada
      </h1>
      <p className="max-w-md text-bone/70">
        Esta página no existe o se movió. Vuelve al inicio y sigue explorando.
      </p>
      <Link
        href="/"
        data-cursor-hover
        className="rounded-full bg-bone px-8 py-4 text-xs font-bold uppercase tracking-[0.05em] text-void transition-opacity hover:opacity-80"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
