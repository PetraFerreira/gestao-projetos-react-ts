import { describe, expect, it } from "vitest";

type StatusTarefa = "pendente" | "em progresso" | "concluída";

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  status: StatusTarefa;
}

function calcularProgresso(tarefas: Tarefa[]): number {
  if (tarefas.length === 0) {
    return 0;
  }

  const concluidas = tarefas.filter(
    (tarefa) => tarefa.status === "concluída"
  ).length;

  return Math.round((concluidas / tarefas.length) * 100);
}

describe("Gestão de Projetos", () => {
  it("deve devolver 0 quando não existem tarefas", () => {
    expect(calcularProgresso([])).toBe(0);
  });

  it("deve calcular 50% quando metade das tarefas estão concluídas", () => {
    const tarefas: Tarefa[] = [
      {
        id: 1,
        titulo: "Tarefa 1",
        descricao: "Descrição 1",
        dataConclusao: "2026-06-01",
        status: "concluída",
      },
      {
        id: 2,
        titulo: "Tarefa 2",
        descricao: "Descrição 2",
        dataConclusao: "2026-06-02",
        status: "pendente",
      },
    ];

    expect(calcularProgresso(tarefas)).toBe(50);
  });

  it("deve calcular 100% quando todas as tarefas estão concluídas", () => {
    const tarefas: Tarefa[] = [
      {
        id: 1,
        titulo: "Tarefa 1",
        descricao: "Descrição 1",
        dataConclusao: "2026-06-01",
        status: "concluída",
      },
    ];

    expect(calcularProgresso(tarefas)).toBe(100);
  });
});