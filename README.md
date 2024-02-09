# Documentación de la API

## 1. Endpoint: `/login`

### Descripción
Obtiene la credencial y el captcha a resolver para iniciar sesión en el SAES.

### Método
GET

### Respuesta esperada
```json
{
    "credential": "...",
    "captcha": {
        "id": "...",
        "imageBase64": "..."
    }
}
```

### Descripción de la respuesta
- `credential`: Token de sesión generado para la sesión actual.
- `captcha.id`: Identificador único del captcha a resolver en la sesión actual.
- `captcha.imageBase64`: Imagen del captcha a resolver codificada en base 64.

### Notas
- Puedes usar un decodificador de base 64 para visualizar la imagen del captcha.

## 2. Endpoint: `/login`

### Descripción
Inicia sesión en el SAES y obtiene las credenciales de autorización.

### Método
POST

### Encabezados de solicitud
- `session`: Valor del token de `credential` generado en la solicitud inicial.
- `Content-Type`: application/json

### Cuerpo de la solicitud
```json
{
    "username": "$TU_BOLETA",
    "password": "$TU_CONTRASEÑA",
    "captcha": {
        "id": "$CAPTCHA_ID",
        "solution": "$CAPTCHA_SOLUTION"
    }
}
```

### Notas
- Reemplaza los valores de `$TU_BOLETA` y `$TU_CONTRASEÑA` por tus datos.
- Reemplaza el valor de `$CAPTCHA_ID` por el valor del token de `captcha.id` generado en la solicitud inicial.
- Reemplaza el valor de `$CAPTCHA_SOLUTION` por el valor del texto en la imagen codificada en `captcha.imageBase64` generada en la solicitud inicial.

### Respuesta esperada
```json
{
    "username": "...",
    "credentials": {
        "login": "...",
        "session": "..."
    },
    "time": 123456789,
    "updateAfter": 123456789,
    "expires": 123456789
}
```

### Descripción de la respuesta
- `username`: Nombre de usuario utilizado para iniciar sesión.
- `credentials.login`: Token de autorización generado para la sesión actual.
- `credentials.session`: Token de sesión generado para la sesión actual.
- `time`: Marca de tiempo de la solicitud.
- `updateAfter`: Marca de tiempo para la actualización de las credenciales.
- `expires`: Marca de tiempo para la expiración de las credenciales.

## 3. Endpoint: `/user/info`

### Descripción
Obtiene información detallada del usuario.

### Método
GET

### Encabezados de solicitud
- `login`: Valor del token de `credentials.login` para la sesión actual.
- `session`: Valor del token de `credentials.session` para la sesión actual.

### Respuesta esperada
```json
{
    "boleta": "...",
    "nombre": "...",
    "plantel": "...",
    "rfc": "...",
    "cartilla": "...",
    "pasaporte": "...",
    "sexo": "...",
    "nacimiento": {
        "fecha": "...",
        "nacionalidad": "...",
        "entidad": "..."
    },
    "direccion": {
        "calle": "...",
        "numeroExt": "...",
        "numeroInt": "...",
        "colonia": "...",
        "cp": "...",
        "estado": "...",
        "municipio": "...",
        "telefono": "...",
        "movil": "...",
        "email": "...",
        "labora": "...",
        "oficina": "..."
    },
    "escolaridad": {
        "procedencia": "...",
        "entidad": "...",
        "promedioSecundaria": "...",
        "promedioMedioSuperior": "..."
    },
    "tutores": {
        "nombreTutor": "...",
        "rfcTutor": "...",
        "nombrePadre": "...",
        "nombreMadre": "..."
    },
    "fotografiaBase64": "..."
}
```

## 4. Endpoint: `/user/kardex`

### Descripción
Obtiene información detallada del kárdex del usuario.

### Método
GET

### Encabezados de solicitud
- `login`: Valor del token de `credentials.login` para la sesión actual.
- `session`: Valor del token de `credentials.session` para la sesión actual.

### Respuesta esperada
```json
[
    {
        "clave": "...",
        "asignatura": "...",
        "fecha": "...",
        "periodo": "...",
        "formaEvaluacion": "...",
        "calificacion": "..."
    },
    ...
]
```

## 5. Endpoint: `/user/horario`

### Descripción
Obtiene información detallada del horario en el periodo actual del usuario.

### Método
GET

### Encabezados de solicitud
- `login`: Valor del token de `credentials.login` para la sesión actual.
- `session`: Valor del token de `credentials.session` para la sesión actual.

### Respuesta esperada
```json
[
    {
        "grupo": "...",
        "clave": "...",
        "asignatura": "...",
        "profesor": "...",
        "horas": {
            "lunes": "...",
            "martes": "...",
            "miercoles": "...",
            "jueves": "...",
            "viernes": "..."
        }
    },
    ...
]
```

## 6. Endpoint: `/user/calificaciones`

### Descripción
Obtiene información detallada de las calificaciones en el periodo actual del usuario.

### Método
GET

### Encabezados de solicitud
- `login`: Valor del token de `credentials.login` para la sesión actual.
- `session`: Valor del token de `credentials.session` para la sesión actual.

### Respuesta esperada
```json
[
    {
        "grupo": "...",
        "clave": "...",
        "asignatura": "...",
        "parcial1": "...",
        "parcial2": "...",
        "parcial3": "...",
        "extraordinario": "...",
        "calificacion": "..."
    },
    ...
]
```

## 7. Endpoint: `/general/horarios`

### Descripción
Obtiene los horarios de clases en el periodo actual en el plantel del usuario.

### Método
GET

### Encabezados de solicitud
- `login`: Valor del token de `credentials.login` para la sesión actual.
- `session`: Valor del token de `credentials.session` para la sesión actual.

### Respuesta esperada
```json
[
    {
        "carrera": "...",
        "turno": "...",
        "periodo": "...",
        "grupo": "...",
        "asignatura": "...",
        "profesor": "...",
        "edificio": "...",
        "aula": "...",
        "horas": {
            "lunes": "...",
            "martes": "...",
            "miercoles": "...",
            "jueves": "...",
            "viernes": "..."
        }
    },
    ...
]
```

## 8. Endpoint: `/general/horarios-proximo`

### Descripción
Obtiene los horarios de clases en el periodo próximo en el plantel del usuario.

### Método
GET

### Encabezados de solicitud
- `login`: Valor del token de `credentials.login` para la sesión actual.
- `session`: Valor del token de `credentials.session` para la sesión actual.

### Respuesta esperada
```json
[
    {
        "carrera": "...",
        "turno": "...",
        "periodo": "...",
        "grupo": "...",
        "asignatura": "...",
        "profesor": "...",
        "edificio": "...",
        "aula": "...",
        "horas": {
            "lunes": "...",
            "martes": "...",
            "miercoles": "...",
            "jueves": "...",
            "viernes": "..."
        }
    },
    ...
]
```

## 8. Endpoint: `/general/asignaturas`

### Descripción
Obtiene las asignaturas impartidas en el plantel del usuario.

### Método
GET

### Encabezados de solicitud
- `login`: Valor del token de `credentials.login` para la sesión actual.
- `session`: Valor del token de `credentials.session` para la sesión actual.

### Respuesta esperada
```json
[
    {
        "carrera": "....",
        "periodo": "...",
        "clave": "...",
        "nombre": "...",
        "tipo": "...",
        "creditos": "...",
        "horasTeoria": "...",
        "horasPractica": "..."
    },
    ...
]
```

## 8. Endpoint: `/general/cupos`

### Descripción
Obtiene la ocupabilidad de los horarios de clases en el periodo actual en el plantel del usuario.

### Método
GET

### Encabezados de solicitud
- `login`: Valor del token de `credentials.login` para la sesión actual.
- `session`: Valor del token de `credentials.session` para la sesión actual.

### Respuesta esperada
```json
[
    {
        "carrera": "...",
        "grupo": "...",
        "clave": "...",
        "asignatura": "...",
        "periodo": "...",
        "cupo": "...",
        "inscritos": "...",
        "disponibles": "..."
    },
    ...
]
```
