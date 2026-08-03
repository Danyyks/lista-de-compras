"""
Rotas do perfil do usuário: orçamento e tema (claro/escuro/automático).

O nome e a foto não são editados aqui — eles vêm prontos do login com
Google e só são copiados para o Firestore no primeiro acesso.
"""

from firebase_admin import firestore
from flask import Blueprint, g, jsonify, request

from auth import login_required
from firebase_setup import db

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


def user_doc():
    """Atalho para o documento do usuário logado (users/{uid})."""
    return db.collection("users").document(g.uid)


@profile_bp.route("", methods=["GET"])
@login_required
def get_or_create_profile():
    """
    Busca o perfil do usuário logado.

    Se for o primeiro acesso dele (o documento ainda não existe), cria um
    perfil novo usando os dados que o próprio login do Google já trouxe
    dentro do token (nome, foto, e-mail) — assim o usuário não precisa
    preencher nada manualmente.
    """
    doc_ref = user_doc()
    snapshot = doc_ref.get()

    if not snapshot.exists:
        claims = g.claims
        doc_ref.set(
            {
                "email": claims.get("email"),
                "displayName": claims.get("name"),
                "photoURL": claims.get("picture"),
                "budget": None,
                "theme": "auto",
                "createdAt": firestore.SERVER_TIMESTAMP,
            }
        )
        snapshot = doc_ref.get()

    data = snapshot.to_dict()
    return jsonify(
        {
            "email": data.get("email"),
            "displayName": data.get("displayName"),
            "photoURL": data.get("photoURL"),
            "budget": data.get("budget"),
            "theme": data.get("theme", "auto"),
        }
    )


@profile_bp.route("", methods=["PUT"])
@login_required
def update_profile():
    """Atualiza o orçamento e/ou o tema do usuário logado. Body: { budget?, theme? }."""
    body = request.get_json(force=True) or {}
    changes = {}
    if "budget" in body:
        changes["budget"] = body["budget"]
    if "theme" in body:
        changes["theme"] = body["theme"]

    if changes:
        # merge=True atualiza só esses campos, sem apagar o resto do documento.
        user_doc().set(changes, merge=True)

    updated = user_doc().get().to_dict()
    return jsonify({"budget": updated.get("budget"), "theme": updated.get("theme", "auto")})
