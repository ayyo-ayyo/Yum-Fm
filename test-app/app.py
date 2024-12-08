'''prints token'''
from os import access
import jwt.utils
import time
import math

accessKey = {
    "developer_id": "bb8c18c9-24eb-4a34-816a-53be80b24809",
    "key_id": "993e0b1e-9b74-413c-a33b-ca154a3e3c91",
    "signing_secret": "WsnJaw_LWpcCGAKWMQGMrjVUExB9K2B1b6qJJ4pXO84"
}

token = jwt.encode(
    {
        "aud": "doordash",
        "iss": accessKey["developer_id"],
        "kid": accessKey["key_id"],
        "exp": str(math.floor(time.time() + 300)),
        "iat": str(math.floor(time.time())),
    },
    jwt.utils.base64url_decode(accessKey["signing_secret"]),
    algorithm="HS256",
    headers={"dd-ver": "DD-JWT-V1"})

print(token)
