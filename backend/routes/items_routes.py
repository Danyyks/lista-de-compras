"""
Rotas dos itens da lista de compras.

Cada usuário tem sua própria "gaveta" de itens no Firestore:
  users/{uid}/items/{item_id}
Isso garante que um usuário nunca consiga ler ou mexer na lista de outro,
porque toda consulta já começa dentro do "galho" do uid dele.
"""

from firebase_admin import firestore
from flask import Blueprint, g, jsonify, request

from auth import login_required
from firebase_setup import db
from routes.price_history_routes import upsert_price_history

items_bp = Blueprint("items", __name__, url_prefix="/api/items")


def items_collection():
    """Atalho para a subcoleção de itens do usuário logado."""
    return db.collection("users").document(g.uid).collection("items")


def parse_non_negative_number(value, default):
    """
    Converte um valor vindo do body para número >= 0.

    Sem isso, mandar price/quantity como texto (ex: "abc") derruba a rota
    com erro 500, porque o Firestore/Python não sabem comparar string com
    número. Retorna None quando o valor é inválido, para a rota devolver
    um erro 400 claro em vez de quebrar.
    """
    if value is None:
        return default
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if number >= 0 else None


def serialize_item(doc):
    """Transforma um documento do Firestore num dicionário simples para o front-end."""
    data = doc.to_dict()
    created_at = data.get("createdAt")
    return {
        "id": doc.id,
        "name": data.get("name", ""),
        "category": data.get("category", "outros"),
        "price": data.get("price", 0),
        "quantity": data.get("quantity", 1),
        "bought": data.get("bought", False),
        # Convertido para milissegundos desde 1970, igual ao Date.now() do JS
        "createdAt": int(created_at.timestamp() * 1000) if created_at else None,
    }


@items_bp.route("", methods=["GET"])
@login_required
def list_items():
    """Lista todos os itens do usuário logado, do mais antigo para o mais novo."""
    docs = items_collection().order_by("createdAt").stream()
    return jsonify([serialize_item(doc) for doc in docs])


@items_bp.route("", methods=["POST"])
@login_required
def create_item():
    """Cria um novo item. Body esperado: { name, category, price?, quantity? }."""
    body = request.get_json(force=True) or {}
    name = (body.get("name") or "").strip()
    if not name:
        return jsonify({"error": "O nome do item é obrigatório"}), 400

    price = parse_non_negative_number(body.get("price"), default=0)
    quantity = parse_non_negative_number(body.get("quantity"), default=1)
    if price is None or quantity is None:
        return jsonify({"error": "Preço e quantidade precisam ser números maiores ou iguais a zero"}), 400

    new_item = {
        "name": name,
        "category": body.get("category") or "outros",
        "price": price,
        "quantity": quantity,
        "bought": False,
        # SERVER_TIMESTAMP = deixa o próprio Firestore anotar a hora exata,
        # em vez de confiar no relógio do navegador do usuário.
        "createdAt": firestore.SERVER_TIMESTAMP,
    }

    _, doc_ref = items_collection().add(new_item)

    # Regra de negócio: item criado com preço > 0 também vira histórico.
    upsert_price_history(name, price)

    return jsonify(serialize_item(doc_ref.get())), 201


@items_bp.route("/<item_id>", methods=["PUT"])
@login_required
def update_item(item_id):
    """Edita parcialmente um item: nome, categoria, preço, quantidade e/ou 'comprado'."""
    doc_ref = items_collection().document(item_id)
    if not doc_ref.get().exists:
        return jsonify({"error": "Item não encontrado"}), 404

    body = request.get_json(force=True) or {}
    changes = {}
    for field in ("name", "category", "price", "quantity", "bought"):
        if field in body:
            changes[field] = body[field]
    if "name" in changes:
        changes["name"] = changes["name"].strip()
    if "price" in changes:
        changes["price"] = parse_non_negative_number(changes["price"], default=0)
        if changes["price"] is None:
            return jsonify({"error": "Preço inválido"}), 400
    if "quantity" in changes:
        changes["quantity"] = parse_non_negative_number(changes["quantity"], default=1)
        if changes["quantity"] is None:
            return jsonify({"error": "Quantidade inválida"}), 400

    if changes:
        doc_ref.update(changes)

    updated = doc_ref.get()
    data = updated.to_dict()

    # Mesma regra de negócio do create: preço/nome novos atualizam o histórico.
    if "price" in changes or "name" in changes:
        upsert_price_history(data.get("name"), data.get("price"))

    return jsonify(serialize_item(updated))


@items_bp.route("/<item_id>", methods=["DELETE"])
@login_required
def delete_item(item_id):
    """Remove um item da lista."""
    items_collection().document(item_id).delete()
    return "", 204


@items_bp.route("/clear-bought", methods=["POST"])
@login_required
def clear_bought():
    """Apaga todos os itens já marcados como comprados."""
    batch = db.batch()
    for doc in items_collection().where("bought", "==", True).stream():
        batch.delete(doc.reference)
    batch.commit()
    return "", 204


@items_bp.route("/clear-all", methods=["POST"])
@login_required
def clear_all():
    """Apaga TODOS os itens da lista do usuário logado (recomeçar do zero)."""
    batch = db.batch()
    for doc in items_collection().stream():
        batch.delete(doc.reference)
    batch.commit()
    return "", 204
