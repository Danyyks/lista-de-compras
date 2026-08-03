"""
Ponto de entrada do backend Flask.

O que acontece quando você roda "python app.py":
1. Carrega as variáveis de ambiente do .env.
2. Inicializa o Firebase (import de firebase_setup).
3. Cria a aplicação Flask e libera o CORS, para o React poder chamá-la.
4. Registra os grupos de rotas (blueprints) de perfil, itens e histórico.
5. Sobe o servidor local.
"""

import os

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

# Importar firebase_setup já inicializa o Firebase Admin SDK (efeito colateral
# proposital: só de importar este módulo, ele roda o initialize_app).
import firebase_setup  # noqa: F401
from routes.items_routes import items_bp
from routes.price_history_routes import price_history_bp
from routes.profile_routes import profile_bp

load_dotenv()

app = Flask(__name__)

# Sem isso, o navegador bloquearia as chamadas do React (porta 5173)
# para esta API (porta 5000), por serem "origens" diferentes. Restringimos
# a origem liberada ao endereço do próprio frontend, em vez de aceitar
# qualquer site (CORS(app) sem argumentos libera "*").
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(app, origins=[FRONTEND_URL])

# Cada blueprint já sabe seu próprio prefixo de rota (ex: /api/items).
app.register_blueprint(profile_bp)
app.register_blueprint(items_bp)
app.register_blueprint(price_history_bp)


@app.route("/api/health")
def health():
    """Rota pública e simples, só para confirmar que o servidor está de pé."""
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    # debug=True nunca deve ir para produção: ele liga um console que
    # executa código Python a partir do navegador quando algo dá erro.
    # Por padrão fica desligado; só ativa se FLASK_DEBUG=true no .env.
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug_mode, port=port)
