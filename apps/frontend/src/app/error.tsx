"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
      <div className="heading-lg">Algo deu errado</div>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {error.message ?? "Ocorreu um erro inesperado. Tente novamente."}
      </p>
      <button
        onClick={reset}
        className="btn btn-primary btn-sm"
      >
        Tentar novamente
      </button>
    </div>
  );
}
