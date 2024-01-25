# Feature de transferencias bancarias

## Descripción

Este proyecto es una aplicación web para realizar transferencias bancarias entre cuentas. Se proporciona una interfaz gráfica para realizar las transferencias, y una API REST para realizar las operaciones.

### Requisitos

- NodeJS v18.17.1

### Pasos

1. Ejecutar `npm start` en la carpeta raíz del proyecto

## Api REST

La ruta base de la API es http://localhost:3000

### Endpoints

- <strong>GET /transactions</strong>
  - Descripción: Obtiene todas las transacciones registradas en el sistema.
  - Respuesta: 200 OK
  - Cuerpo: Array de transacciones. Ejemplo:
  ```json
  [
    {
      "from": "ES012345678954320987",
      "to": "ES987654321009684593",
      "amount": 240,
      "currency": "EUR",
      "date": "2023-09-03T15:14:30.762Z",
      "id": 1
    },
    {
      "from": "ES012345678954320987",
      "to": "ES987654321009684593",
      "amount": 99,
      "currency": "EUR",
      "date": "2023-09-03T15:18:17.009Z",
      "id": 2
    }
  ]
  ```
- <strong>GET /accounts</strong>

  - Descripción: Obtiene todas las cuentas bancarias registradas en el sistema.
  - Respuesta: 200 OK
  - Cuerpo: Array de cuentas bancarias. Ejemplo:

  ```json
  [
    {
      "accountNumber": "ES012345678954320987",
      "accountType": "checking",
      "balance": 3000,
      "currency": "EUR",
      "status": "active"
    },
    {
      "accountNumber": "ES987654321009684593",
      "accountType": "savings",
      "balance": 5000,
      "currency": "EUR",
      "status": "active"
    }
  ]
  ```

- <strong>POST /transfer</strong>
  - Descripción: Realiza una transferencia entre cuentas bancarias.
  - Header: Content-Type: application/json
  - Mode: no-cors (para evitar problemas de CORS)
  - Cuerpo: Objeto con los datos de la transferencia. Ejemplo:
  ```json
  {
    "from": "ES012345678954320987",
    "to": "ES987654321009684593",
    "amount": 200,
    "currency": "EUR"
  }
  ```
