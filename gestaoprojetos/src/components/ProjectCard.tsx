type Props = {
  nome: string;
  descricao: string;
  progresso: number;
};

function ProjectCard({ nome, descricao, progresso }: Props) {
  return (
    <section className="card">
      <h2>{nome}</h2>

      <p>{descricao}</p>

      <p
        style={{
          color: progresso === 100 ? "green" : "orange",
          fontWeight: "bold",
        }}
      >
        Progresso: {progresso}%
      </p>
    </section>
  );
}

export default ProjectCard;