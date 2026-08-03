"""
Este arquivo é o "segurança da porta" das rotas protegidas da API.

Toda rota que só deve funcionar para um usuário logado usa o decorator
@login_required definido aqui. Ele verifica se a requisição trouxe um
token válido do Firebase Auth (gerado quando o usuário faz login com
Google no front-end) antes de deixar a rota executar.
"""

from functools import wraps

from firebase_admin import auth
from flask import g, jsonify, request


def login_required(view_function):
    """
    Decorator que protege uma rota Flask.

    Como usar: coloque "@login_required" em cima da função da rota.
    Se o token for válido, a rota roda normalmente e pode usar
    "g.uid" para saber de qual usuário são os dados.
    Se o token for inválido/ausente, a rota nem chega a rodar —
    devolvemos erro 401 (não autorizado) direto.
    """

    @wraps(view_function)
    def wrapper(*args, **kwargs):
        # O front-end manda o token assim: "Authorization: Bearer <token>"
        header = request.headers.get("Authorization", "")

        if not header.startswith("Bearer "):
            return jsonify({"error": "Token de autenticação ausente"}), 401

        token = header.removeprefix("Bearer ").strip()

        try:
            # Pergunta pro Firebase: "esse token é válido? de quem é?"
            # check_revoked=True também rejeita tokens de sessões que foram
            # revogadas manualmente (ex: usuário desativado), não só expiradas.
            decoded_token = auth.verify_id_token(token, check_revoked=True)
        except Exception:
            return jsonify({"error": "Token de autenticação inválido ou expirado"}), 401

        # Guarda o uid (identificador único do usuário) e os dados do token
        # para a rota poder usar sem precisar decodificar tudo de novo.
        g.uid = decoded_token["uid"]
        g.claims = decoded_token

        return view_function(*args, **kwargs)

    return wrapper
