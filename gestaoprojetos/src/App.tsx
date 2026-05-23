import { useEffect, useState } from "react";
import "./App.css";

type StatusTarefa = "pendente" | "em progresso" | "concluída";

interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  dataConclusao: string;
  status: StatusTarefa;
}

interface FormularioTarefa {
  titulo: string;
  descricao: string;
  data: string;
}

class Projeto {
  id: number;
  nome: string;
  descricao: string;
  tarefas: Tarefa[];

  constructor(id: number, nome: string, descricao: string) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.tarefas = [];
  }
}

function App() {
  const [projetos, setProjetos] = useState<Projeto[]>(() => {
    const projetosGuardados = localStorage.getItem("projetos");

    if (projetosGuardados) {
      return JSON.parse(projetosGuardados);
    }

    return [
      new Projeto(
        1,
        "Website Institucional",
        "Criação de website para cliente."
      ),
    ];
  });

  const [nomeProjeto, setNomeProjeto] = useState("");
  const [descricaoProjeto, setDescricaoProjeto] = useState("");

  const [formulariosTarefa, setFormulariosTarefa] = useState<
    Record<number, FormularioTarefa>
  >({});

  useEffect(() => {
    localStorage.setItem("projetos", JSON.stringify(projetos));
  }, [projetos]);

  function atualizarFormularioTarefa(
    projetoId: number,
    campo: keyof FormularioTarefa,
    valor: string
  ) {
    setFormulariosTarefa({
      ...formulariosTarefa,
      [projetoId]: {
        titulo: formulariosTarefa[projetoId]?.titulo || "",
        descricao: formulariosTarefa[projetoId]?.descricao || "",
        data: formulariosTarefa[projetoId]?.data || "",
        [campo]: valor,
      },
    });
  }

  function editarProjeto(
    projetoId: number,
    novoNome: string,
    novaDescricao: string
  ) {
    if (novoNome.trim() === "" || novaDescricao.trim() === "") {
      alert("Preenche o nome e a descrição do projeto.");
      return;
    }

    const projetosAtualizados = projetos.map((projeto) =>
      projeto.id === projetoId
        ? {
            ...projeto,
            nome: novoNome,
            descricao: novaDescricao,
          }
        : projeto
    );

    setProjetos(projetosAtualizados as Projeto[]);
  }

  return (
    <main className="app">
      <h1>Gestão de Projetos</h1>

      <p>Aplicação desenvolvida com React e TypeScript.</p>

      <div className="formulario">
        <input
          type="text"
          placeholder="Nome do projeto"
          value={nomeProjeto}
          onChange={(e) => setNomeProjeto(e.target.value)}
        />

        <input
          type="text"
          placeholder="Descrição do projeto"
          value={descricaoProjeto}
          onChange={(e) => setDescricaoProjeto(e.target.value)}
        />

        <button
          onClick={() => {
            if (nomeProjeto.trim() === "" || descricaoProjeto.trim() === "") {
              alert("Preenche o nome e a descrição do projeto.");
              return;
            }

            const novoProjeto = new Projeto(
              Date.now(),
              nomeProjeto,
              descricaoProjeto
            );

            setProjetos([...projetos, novoProjeto]);

            setNomeProjeto("");
            setDescricaoProjeto("");
          }}
        >
          Novo Projeto
        </button>
      </div>

      {projetos.map((projeto) => {
        const tarefasConcluidas = projeto.tarefas.filter(
          (tarefa) => tarefa.status === "concluída"
        ).length;

        const progresso =
          projeto.tarefas.length === 0
            ? 0
            : Math.round((tarefasConcluidas / projeto.tarefas.length) * 100);

        const formularioAtual = formulariosTarefa[projeto.id] || {
          titulo: "",
          descricao: "",
          data: "",
        };

        return (
          <section className="card" key={projeto.id}>
            <h2>{projeto.nome}</h2>

            <p>{projeto.descricao}</p>

            <div className="editar-projeto">
              <input
                type="text"
                placeholder="Editar nome do projeto"
                defaultValue={projeto.nome}
                id={`nome-${projeto.id}`}
              />

              <input
                type="text"
                placeholder="Editar descrição do projeto"
                defaultValue={projeto.descricao}
                id={`descricao-${projeto.id}`}
              />

              <button
                onClick={() => {
                  const inputNome = document.getElementById(
                    `nome-${projeto.id}`
                  ) as HTMLInputElement;

                  const inputDescricao = document.getElementById(
                    `descricao-${projeto.id}`
                  ) as HTMLInputElement;

                  editarProjeto(
                    projeto.id,
                    inputNome.value,
                    inputDescricao.value
                  );
                }}
              >
                Guardar Alterações
              </button>
            </div>

            <p>Total de tarefas: {projeto.tarefas.length}</p>

            <p>Tarefas concluídas: {tarefasConcluidas}</p>

            <p
              style={{
                color: progresso === 100 ? "green" : "orange",
                fontWeight: "bold",
              }}
            >
              Progresso: {progresso}%
            </p>

            <button
              onClick={() => {
                setProjetos(projetos.filter((p) => p.id !== projeto.id));
              }}
            >
              Remover Projeto
            </button>

            <div className="formulario-tarefa">
              <input
                type="text"
                placeholder="Título da tarefa"
                value={formularioAtual.titulo}
                onChange={(e) =>
                  atualizarFormularioTarefa(
                    projeto.id,
                    "titulo",
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Descrição da tarefa"
                value={formularioAtual.descricao}
                onChange={(e) =>
                  atualizarFormularioTarefa(
                    projeto.id,
                    "descricao",
                    e.target.value
                  )
                }
              />

              <input
                type="date"
                value={formularioAtual.data}
                onChange={(e) =>
                  atualizarFormularioTarefa(projeto.id, "data", e.target.value)
                }
              />

              <button
                onClick={() => {
                  if (
                    formularioAtual.titulo.trim() === "" ||
                    formularioAtual.descricao.trim() === "" ||
                    formularioAtual.data.trim() === ""
                  ) {
                    alert("Preenche todos os campos da tarefa.");
                    return;
                  }

                  const novosProjetos = [...projetos];

                  const projetoEncontrado = novosProjetos.find(
                    (p) => p.id === projeto.id
                  );

                  if (!projetoEncontrado) return;

                  projetoEncontrado.tarefas.push({
                    id: Date.now(),
                    titulo: formularioAtual.titulo,
                    descricao: formularioAtual.descricao,
                    dataConclusao: formularioAtual.data,
                    status: "pendente",
                  });

                  setProjetos(novosProjetos);

                  setFormulariosTarefa({
                    ...formulariosTarefa,
                    [projeto.id]: {
                      titulo: "",
                      descricao: "",
                      data: "",
                    },
                  });
                }}
              >
                Adicionar Tarefa
              </button>
            </div>

            <ul>
              {projeto.tarefas.map((tarefa) => (
                <li
                  key={tarefa.id}
                  className={tarefa.status === "concluída" ? "concluida" : ""}
                >
                  <input
                    type="text"
                    value={tarefa.titulo}
                    onChange={(e) => {
                      const novosProjetos = [...projetos];

                      const projetoEncontrado = novosProjetos.find(
                        (p) => p.id === projeto.id
                      );

                      if (!projetoEncontrado) return;

                      const tarefaEncontrada = projetoEncontrado.tarefas.find(
                        (t) => t.id === tarefa.id
                      );

                      if (!tarefaEncontrada) return;

                      tarefaEncontrada.titulo = e.target.value;

                      setProjetos(novosProjetos);
                    }}
                  />

                  <input
                    type="text"
                    value={tarefa.descricao}
                    onChange={(e) => {
                      const novosProjetos = [...projetos];

                      const projetoEncontrado = novosProjetos.find(
                        (p) => p.id === projeto.id
                      );

                      if (!projetoEncontrado) return;

                      const tarefaEncontrada = projetoEncontrado.tarefas.find(
                        (t) => t.id === tarefa.id
                      );

                      if (!tarefaEncontrada) return;

                      tarefaEncontrada.descricao = e.target.value;

                      setProjetos(novosProjetos);
                    }}
                  />

                  <input
                    type="date"
                    value={tarefa.dataConclusao}
                    onChange={(e) => {
                      const novosProjetos = [...projetos];

                      const projetoEncontrado = novosProjetos.find(
                        (p) => p.id === projeto.id
                      );

                      if (!projetoEncontrado) return;

                      const tarefaEncontrada = projetoEncontrado.tarefas.find(
                        (t) => t.id === tarefa.id
                      );

                      if (!tarefaEncontrada) return;

                      tarefaEncontrada.dataConclusao = e.target.value;

                      setProjetos(novosProjetos);
                    }}
                  />

                  <select
                    value={tarefa.status}
                    onChange={(e) => {
                      const novosProjetos = [...projetos];

                      const projetoEncontrado = novosProjetos.find(
                        (p) => p.id === projeto.id
                      );

                      if (!projetoEncontrado) return;

                      const tarefaEncontrada = projetoEncontrado.tarefas.find(
                        (t) => t.id === tarefa.id
                      );

                      if (!tarefaEncontrada) return;

                      tarefaEncontrada.status = e.target.value as StatusTarefa;

                      setProjetos(novosProjetos);
                    }}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em progresso">Em progresso</option>
                    <option value="concluída">Concluída</option>
                  </select>

                  <button
                    onClick={() => {
                      const novosProjetos = [...projetos];

                      const projetoEncontrado = novosProjetos.find(
                        (p) => p.id === projeto.id
                      );

                      if (!projetoEncontrado) return;

                      projetoEncontrado.tarefas =
                        projetoEncontrado.tarefas.filter(
                          (t) => t.id !== tarefa.id
                        );

                      setProjetos(novosProjetos);
                    }}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}

export default App;