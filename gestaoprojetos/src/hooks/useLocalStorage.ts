import { useEffect, useState } from "react";

export function useLocalStorage<T>(chave: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    const valorGuardado = localStorage.getItem(chave);

    if (valorGuardado) {
      return JSON.parse(valorGuardado);
    }

    return valorInicial;
  });

  useEffect(() => {
    localStorage.setItem(chave, JSON.stringify(valor));
  }, [chave, valor]);

  return [valor, setValor] as const;
}