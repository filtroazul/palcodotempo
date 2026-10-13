# O Palco do Tempo — versão linktree

Só os 5 vídeos, com a abertura de cortinas, a película e o encerramento "Cultura é movimento." com a Fundação.
O site completo continua em `../palco-do-tempo`.

```
index.html           página
videos.config.js     OS 5 VÍDEOS (único arquivo para editar)
css/ js/ assets/     estilos, animação (GSAP local), fontes, projetor e logo
tools/gerar-qr.py    gera o QR Code a partir da URL final
```

## Colocar os 5 links
Abra `videos.config.js` e preencha `url` de cada vídeo (e `titulo`/`thumb`, se quiser). Sem `url`, o vídeo aparece como "Em breve", sem link.
Drive: compartilhar como "Qualquer pessoa com o link" e testar em janela anônima. O formato `drive.google.com/file/d/ID/view` ou `open?id=ID` funciona.
Miniaturas: imagens 4:3 em `assets/video-thumbs/` (ex.: `thumb: "assets/video-thumbs/ato-1.jpg"`).

## Ver localmente
`python -m http.server 4174` e abrir http://127.0.0.1:4174

## Publicar e QR Code
Arraste a pasta em https://app.netlify.com/drop (ou `npx netlify deploy --prod`) e escolha o nome do site. Com a URL final:
`python -m pip install segno` e `python tools/gerar-qr.py https://SEU-ENDERECO` (gera SVG para a gráfica e PNG de 2000 px, correção de erro alta).
Não use localhost. Teste escaneando a impressão de prova.

## Observações
- O logo da Fundação é um recorte do edital oficial dela; para a versão impressa, peça o arquivo master.
- Respeita `prefers-reduced-motion` e funciona sem as animações.
