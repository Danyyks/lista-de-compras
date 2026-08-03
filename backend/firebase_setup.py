"""
Este arquivo cuida de "ligar" o backend ao Firebase.

Ele faz duas coisas:
1. Inicializa o Firebase Admin SDK usando a chave de conta de serviço.
2. Expõe um "cliente" do Firestore (o banco de dados) para que as rotas
   do resto do app possam ler e escrever dados.

A credencial pode vir de dois jeitos, dependendo de onde o backend está
rodando:
- Localmente: um arquivo .json na pasta do projeto (FIREBASE_CREDENTIALS_PATH).
- Na Vercel (serverless): não existe um arquivo persistente pra guardar
  segredo, então a credencial inteira vira uma variável de ambiente
  (FIREBASE_CREDENTIALS_JSON, com o conteúdo do .json como texto).
"""

import json
import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

# Carrega as variáveis de ambiente do arquivo .env (só tem efeito localmente;
# na Vercel as variáveis já vêm prontas do ambiente, load_dotenv não faz nada)
load_dotenv()

credentials_json = os.getenv("FIREBASE_CREDENTIALS_JSON")

if credentials_json:
    # Rodando na Vercel: a credencial inteira veio como texto numa env var.
    cred = credentials.Certificate(json.loads(credentials_json))
else:
    # Rodando localmente: lê o arquivo baixado do console do Firebase.
    CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")
    cred = credentials.Certificate(CREDENTIALS_PATH)

# Evita inicializar duas vezes: em ambiente serverless, o módulo pode ser
# reaproveitado entre chamadas ("warm start"), e o Firebase Admin SDK
# lança erro se initialize_app() rodar mais de uma vez no mesmo processo.
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Cliente do Firestore — é isso que as rotas usam para acessar o banco.
# Ex: db.collection("users").document(uid).get()
db = firestore.client()
