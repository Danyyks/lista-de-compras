"""
Este arquivo cuida de "ligar" o backend ao Firebase.

Ele faz duas coisas:
1. Inicializa o Firebase Admin SDK usando a chave de conta de serviço
   (um arquivo JSON secreto, baixado no console do Firebase).
2. Expõe um "cliente" do Firestore (o banco de dados) para que as rotas
   do resto do app possam ler e escrever dados.
"""

import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

# Carrega as variáveis de ambiente do arquivo .env (ex: caminho da credencial)
load_dotenv()

# Caminho do arquivo de credencial, lido da variável de ambiente.
# Nunca deixamos esse caminho "fixo" no código para não vazar segredos.
CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")

# Inicializa o app do Firebase Admin SDK usando a credencial de serviço.
# Isso dá ao backend permissão total para ler/escrever no Firestore
# e para validar tokens de login gerados pelo Firebase Auth.
cred = credentials.Certificate(CREDENTIALS_PATH)
firebase_admin.initialize_app(cred)

# Cliente do Firestore — é isso que as rotas usam para acessar o banco.
# Ex: db.collection("users").document(uid).get()
db = firestore.client()
