"""
Ponto de entrada usado pela Vercel para rodar o backend como função
serverless (Vercel só reconhece código Python dentro de uma pasta "api/").

Este arquivo não tem lógica própria — só importa o app Flask "de verdade"
(definido em backend/app.py) e o expõe com o nome "app", que é o que a
Vercel procura para servir a aplicação.
"""

import os
import sys

# Adiciona a pasta backend/ (um nível acima) ao caminho de import do Python,
# já que app.py (e os módulos que ele importa) vivem lá, não dentro de api/.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import app  # noqa: E402
