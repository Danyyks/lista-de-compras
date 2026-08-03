"""
Rotas do histórico de preços.

A ideia é simples: sempre que o usuário salva um item com preço, a gente
guarda "da última vez, esse produto custou R$ X" — e usa isso pra sugerir
um valor quando ele digitar o mesmo nome de novo no formulário.
"""

from firebase_admin import firestore
from flask import Blueprint, g, jsonify, request

from auth import login_required
from firebase_setup import db

price_history_bp = Blueprint("price_history", __name__, url_prefix="/api/price-history")


def price_history_collection():
    """Atalho para a subcoleção de histórico de preços do usuário logado."""
    return db.collection("users").document(g.uid).collection("priceHistory")


def normalize_name(name):
    """Deixa o nome minúsculo e sem espaços nas pontas, para usar como chave de busca."""
    return name.strip().lower()


def upsert_price_history(name, price):
    """
    Cria ou atualiza o histórico de preço de um item pelo nome.

    Usada tanto aqui (registro manual) quanto em items_routes.py (efeito
    colateral automático de criar/editar um item com preço > 0).
    """
    if not name or price is None or price <= 0:
        return

    key = normalize_name(name)
    existing = next(
        price_history_collection().where("nameKey", "==", key).limit(1).stream(),
        None,
    )

    if existing:
        existing.reference.update(
            {"price": price, "name": name, "updatedAt": firestore.SERVER_TIMESTAMP}
        )
    else:
        price_history_collection().add(
            {
                "nameKey": key,
                "name": name,
                "price": price,
                "updatedAt": firestore.SERVER_TIMESTAMP,
            }
        )


@price_history_bp.route("", methods=["GET"])
@login_required
def get_history():
    """Retorna todo o histórico do usuário como um mapa { nomeNormalizado: preco }."""
    history = {}
    for doc in price_history_collection().stream():
        data = doc.to_dict()
        history[data["nameKey"]] = data["price"]
    return jsonify(history)


@price_history_bp.route("", methods=["POST"])
@login_required
def record_price():
    """Registro manual de preço, no formato { name, price }."""
    body = request.get_json(force=True) or {}
    name = (body.get("name") or "").strip()

    # Convertido para número antes de comparar, senão um price em texto
    # (ex: "abc") derruba a rota com erro 500 em vez de devolver 400.
    try:
        price = float(body.get("price"))
    except (TypeError, ValueError):
        price = None

    if not name or price is None or price <= 0:
        return jsonify({"error": "Nome e preço maior que zero são obrigatórios"}), 400

    upsert_price_history(name, price)
    return jsonify({"name": name, "price": price})


@price_history_bp.route("", methods=["DELETE"])
@login_required
def clear_history():
    """Apaga todo o histórico de preços do usuário logado."""
    batch = db.batch()
    for doc in price_history_collection().stream():
        batch.delete(doc.reference)
    batch.commit()
    return "", 204
