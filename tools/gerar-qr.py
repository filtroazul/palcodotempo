"""Gera o QR Code do folder a partir da URL FINAL do site (depois do deploy).

Uso:
    python tools/gerar-qr.py https://SEU-ENDERECO.netlify.app

Cria em tools/qr/:
    qr-palco-do-tempo.svg   vetor, melhor para grafica (escala sem perder nitidez)
    qr-palco-do-tempo.png   2000 px, correcao de erro ALTA (H), margem branca de 4 modulos

Imprima com pelo menos 2,5 cm de lado e teste escaneando a impressao de prova.
Nao use endereco localhost, 127.0.0.1 ou temporario.
"""
import sys
from pathlib import Path
from urllib.parse import urlparse

try:
    import segno
except ImportError:
    sys.exit("Instale a biblioteca: python -m pip install segno")

if len(sys.argv) != 2:
    sys.exit(__doc__)
url = sys.argv[1].strip()
p = urlparse(url)
if p.scheme != "https" or not p.netloc or p.hostname in ("localhost", "127.0.0.1") or "." not in p.hostname:
    sys.exit("URL invalida para impressao: use o endereco final com https:// (nada de localhost).")

out = Path(__file__).resolve().parent / "qr"
out.mkdir(exist_ok=True)
qr = segno.make(url, error="h", micro=False)
qr.save(out / "qr-palco-do-tempo.svg", scale=20, border=4, dark="#000000", light="#ffffff")
side = qr.symbol_size(border=4)[0]
qr.save(out / "qr-palco-do-tempo.png", scale=max(1, 2000 // side), border=4, dark="#000000", light="#ffffff")
print("QR gerado para:", url)
print("Arquivos em:", out)
