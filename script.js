/* ===============================================================
   CONFIGURAÇÃO: cole aqui o link publicado do Google Forms.
   Quando o quiz estiver pronto, altere MOSTRAR_AVISO_DESENVOLVIMENTO.
   =============================================================== */
const GOOGLE_FORMS_URL = "https://forms.gle/2FMtGxf2ZFBtqTN58";
const MOSTRAR_AVISO_DESENVOLVIMENTO = true;

/* Dados fornecidos para o boletim: não alterar sem validar a fonte. */
const DADOS_POR_ANO = {
  1995: {
    valor: "3.690", imagem: "images/mapa-1995.png",
    texto: "Em 1995, a Bacia do Rio Piracicaba apresentava a maior superfície de água entre os anos analisados, com 3.690 hectares. Esse valor é utilizado como referência para observar as mudanças ocorridas nas décadas seguintes."
  },
  2005: {
    valor: "2.868", imagem: "images/mapa-2005.png",
    texto: "Em 2005, a superfície de água caiu para 2.868 hectares, uma redução de 822 hectares, cerca de 22% em relação a 1995. O dado mostra uma diminuição expressiva da área mapeada como água nesse período."
  },
  2015: {
    valor: "2.259", imagem: "images/mapa-2015.png",
    texto: "Em 2015, foram registrados 2.259 hectares de superfície de água. Em relação a 2005, houve nova redução de 609 hectares, aproximadamente 21%."
  },
  2025: {
    valor: "2.249", imagem: "images/mapa-2025.png",
    texto: "Em 2025, a superfície de água registrada foi de 2.249 hectares. A diferença em relação a 2015 foi de apenas 10 hectares, indicando uma situação praticamente estável nesse último intervalo analisado."
  }
};

/* Se a imagem não existir, mantém o placeholder, sem ícone quebrado. */
function carregarImagem(container, caminho, descricao, rotulo) {
  if (!container) return;
  container.dataset.image = caminho;
  container.dataset.alt = descricao;
  container.replaceChildren();
  const placeholder = document.createElement("div");
  placeholder.className = "missing-image";
  const icone = document.createElement("span");
  icone.setAttribute("aria-hidden", "true");
  icone.textContent = "▧";
  const titulo = document.createElement("strong");
  titulo.textContent = "Imagem disponível em breve";
  const detalhe = document.createElement("small");
  detalhe.textContent = rotulo;
  placeholder.append(icone, titulo, detalhe);
  container.append(placeholder);
  const imagem = new Image();
  imagem.alt = descricao;
  imagem.decoding = "async";
  imagem.onload = () => {
    if (container.dataset.image === caminho) container.replaceChildren(imagem);
  };
  imagem.onerror = () => { /* O placeholder permanece visível. */ };
  imagem.src = caminho;
}

const botoesAno = Array.from(document.querySelectorAll(".year-button"));
function selecionarAno(ano) {
  const dado = DADOS_POR_ANO[ano];
  if (!dado) return;
  document.getElementById("selected-year").textContent = ano;
  document.getElementById("year-value").textContent = dado.valor;
  document.getElementById("year-description").textContent = dado.texto;
  document.getElementById("year-caption").textContent = `Superfície de água mapeada · ${ano}`;
  carregarImagem(document.getElementById("year-image"), dado.imagem, `Mapa da superfície de água da Bacia do Rio Piracicaba em ${ano}`, `Mapa de ${ano}`);
  botoesAno.forEach(botao => {
    const ativo = botao.dataset.year === String(ano);
    botao.classList.toggle("active", ativo);
    botao.setAttribute("aria-pressed", String(ativo));
  });
}
botoesAno.forEach(botao => botao.addEventListener("click", () => selecionarAno(botao.dataset.year)));

/* Imagens de capa e mapas estáticos. */
document.querySelectorAll(".media-fallback:not(#year-image)").forEach(container => {
  const rotulo = container.querySelector(".missing-image small")?.textContent || "Mapa";
  carregarImagem(container, container.dataset.image, container.dataset.alt, rotulo);
});
selecionarAno("1995");
const capa = new Image();
capa.onload = () => { document.querySelector(".hero-photo").style.backgroundImage = 'url("images/capa.jpg")'; };
capa.onerror = () => {};
capa.src = "images/capa.jpg";

/* Menu acessível para celulares e tablets. */
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("site-nav");
function fecharMenu() {
  menu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
}
menuToggle.addEventListener("click", () => {
  const aberto = menu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(aberto));
  menuToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", fecharMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") fecharMenu(); });
document.addEventListener("click", event => { if (!menu.contains(event.target) && !menuToggle.contains(event.target)) fecharMenu(); });

/* Google Forms: nenhum botão fica inoperante quando o link falta. */
const aviso = document.getElementById("development-notice");
aviso.hidden = !MOSTRAR_AVISO_DESENVOLVIMENTO;
const botaoQuiz = document.getElementById("quiz-button");
botaoQuiz.addEventListener("click", () => {
  const feedback = document.getElementById("quiz-feedback");
  const endereco = GOOGLE_FORMS_URL.trim();
  if (!endereco || endereco === "COLE_AQUI_O_LINK_DO_GOOGLE_FORMS") {
    feedback.textContent = "O link do quiz ainda não foi configurado.";
    feedback.hidden = false;
    return;
  }
  try {
    const url = new URL(endereco);
    if (!["https:", "http:"].includes(url.protocol)) throw new Error("Endereço inválido");
    feedback.hidden = true;
    window.open(url.href, "_blank", "noopener,noreferrer");
  } catch (_) {
    feedback.textContent = "O link do quiz não é válido. Verifique o endereço configurado.";
    feedback.hidden = false;
  }
});

/* Entrada suave: fallback mostra conteúdo em navegadores mais antigos. */
const elementos = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entradas, observador) => {
    entradas.forEach(entrada => { if (entrada.isIntersecting) { entrada.target.classList.add("visible"); observador.unobserve(entrada.target); } });
  }, { threshold: .08, rootMargin: "0px 0px 30px 0px" });
  elementos.forEach(item => observer.observe(item));
} else {
  elementos.forEach(item => item.classList.add("visible"));
}
