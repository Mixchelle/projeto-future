from cryptography.fernet import Fernet

# Gerar uma chave secreta
def generate_key():
    return Fernet.generate_key()

# Função para criptografar dados
def encrypt_data(data: str, key: bytes) -> bytes:
    f = Fernet(key)
    encrypted_data = f.encrypt(data.encode())
    return encrypted_data

# Função para descriptografar dados
def decrypt_data(encrypted_data: bytes, key: bytes) -> str:
    f = Fernet(key)
    decrypted_data = f.decrypt(encrypted_data).decode()
    return decrypted_data
