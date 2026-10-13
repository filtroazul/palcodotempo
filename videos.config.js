/*
 * O PALCO DO TEMPO (LINKTREE) — CONFIGURACAO DOS VIDEOS
 * -----------------------------------------------------
 * Este e o unico arquivo que voce precisa editar para colocar os videos.
 *
 * Para cada video:
 *   ato        Rotulo pequeno acima do titulo (ex.: "Vídeo 1").
 *   titulo     Titulo exibido. Se ficar vazio, mostra so o rotulo.
 *   descricao  Opcional. Uma frase curta (deixe "" para a lista ficar enxuta).
 *   thumb      Opcional. Imagem local 4:3, ex.: "assets/video-thumbs/ato-1.jpg".
 *              Sem thumb, mostra um fundo de palco (nada de imagem inventada).
 *   url        Link do video (Google Drive, YouTube, etc.).
 *              Enquanto estiver vazio (""), o video aparece como "Em breve" e NAO e clicavel.
 *
 * Google Drive: use o link de compartilhamento do arquivo. Aceita
 *   https://drive.google.com/file/d/ID/view?usp=sharing
 *   https://drive.google.com/open?id=ID
 * O arquivo precisa estar como "Qualquer pessoa com o link" (Leitor).
 * Teste o link numa janela anonima antes de imprimir o QR Code.
 */
window.PALCO_CONFIG = {
  videos: [
    { ato: "Vídeo 1", titulo: "O Palco do Tempo",              descricao: "", thumb: "", url: "" },
    { ato: "Vídeo 2", titulo: "Um episódio extra(ordinário)",  descricao: "", thumb: "", url: "" },
    { ato: "Vídeo 3", titulo: "Patrimônio Histórico",          descricao: "", thumb: "", url: "" },
    { ato: "Vídeo 4", titulo: "",                              descricao: "", thumb: "", url: "" },
    { ato: "Vídeo 5", titulo: "",                              descricao: "", thumb: "", url: "" }
  ]
};
