# Documentação Completa da WiseTruck API

## Sumário
1. [Visão Geral](#visão-geral)
2. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
3. [Endpoints da API](#endpoints-da-api)
4. [Modelos de Dados](#modelos-de-dados)
5. [Erros Comuns](#erros-comuns)
6. [Implantação](#implantação)

## Visão Geral

WiseTruck API é um sistema completo para gerenciamento de frotas de caminhões desenvolvido em ASP.NET Core 8.0. A API utiliza Entity Framework Core 9.0 com PostgreSQL para armazenamento de dados e segue uma arquitetura em camadas com o padrão Repository.

**URL Base**: `https://wisetruckapi.onrender.com/api`

## Estrutura do Banco de Dados

### Tabelas

#### tb_caminhoes
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| cod_caminhao | INT (PK) | Identificador único do caminhão |
| dsc_modelo | VARCHAR | Modelo do caminhão |
| num_placa | VARCHAR | Placa do caminhão (único) |
| dat_fabricacao | DATETIME | Data de fabricação |
| flg_status | VARCHAR | Status atual ("Disponível", "Em Viagem", "Em Manutenção") |

#### tb_motoristas
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| cod_motorista | INT (PK) | Identificador único do motorista |
| nom_motorista | VARCHAR | Nome do motorista |
| num_cnh | VARCHAR | Número da CNH (único) |
| dat_validade_cnh | DATETIME | Data de validade da CNH |

#### tb_viagens
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| cod_viagem | INT (PK) | Identificador único da viagem |
| cod_caminhao | INT (FK) | Referência ao caminhão |
| cod_motorista | INT (FK) | Referência ao motorista (opcional) |
| dsc_origem | VARCHAR | Local de origem |
| dsc_destino | VARCHAR | Local de destino |
| num_distancia_km | INT | Distância em quilômetros |
| dat_inicio | DATETIME | Data/hora de início da viagem |
| dat_fim | DATETIME | Data/hora de finalização da viagem (opcional) |
| flg_status | VARCHAR | Status da viagem ("Planejada", "Em Andamento", "Concluída", "Cancelada") |

#### tb_pedagios
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| cod_pedagio | INT (PK) | Identificador único do pedágio |
| cod_viagem | INT (FK) | Referência à viagem |
| num_valor | DECIMAL | Valor pago no pedágio |
| dsc_localizacao | VARCHAR | Localização do pedágio |
| dat_pagamento | DATETIME | Data/hora do pagamento |

#### tb_abastecimentos
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| cod_abastecimento | INT (PK) | Identificador único do abastecimento |
| cod_viagem | INT (FK) | Referência à viagem |
| num_litros | DECIMAL | Quantidade de litros abastecidos |
| num_valor | DECIMAL | Valor total pago |
| dsc_localizacao | VARCHAR | Local do abastecimento |
| dat_abastecimento | DATETIME | Data/hora do abastecimento |

## Endpoints da API

### Caminhões

#### Listar todos os caminhões
- **Endpoint**: `GET /api/Caminhao`
- **Descrição**: Retorna uma lista com todos os caminhões cadastrados
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "modelo": "Volvo FH 460",
    "placa": "ABC1234",
    "dataFabricacao": "2020-01-01T00:00:00",
    "status": "Disponível"
  },
  {
    "id": 2,
    "modelo": "Scania R450",
    "placa": "XYZ5678",
    "dataFabricacao": "2021-05-15T00:00:00",
    "status": "Em Viagem"
  }
]
```

#### Obter caminhão por ID
- **Endpoint**: `GET /api/Caminhao/{id}`
- **Parâmetros**: 
  - `id` (int): ID do caminhão
- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Caminhão não encontrado)
- **Exemplo de Resposta**:
```json
{
  "id": 1,
  "modelo": "Volvo FH 460",
  "placa": "ABC1234",
  "dataFabricacao": "2020-01-01T00:00:00",
  "status": "Disponível"
}
```

#### Listar caminhões disponíveis
- **Endpoint**: `GET /api/Caminhao/disponiveis`
- **Descrição**: Retorna apenas os caminhões com status 'Disponível'
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "modelo": "Volvo FH 460",
    "placa": "ABC1234",
    "dataFabricacao": "2020-01-01T00:00:00",
    "status": "Disponível"
  }
]
```

#### Cadastrar novo caminhão
- **Endpoint**: `POST /api/Caminhao`
- **Corpo da Requisição**:
```json
{
  "modelo": "Mercedes-Benz Actros",
  "placa": "DEF5678",
  "dataFabricacao": "2022-03-10T00:00:00",
  "status": "Disponível"
}
```

- **Resposta de Sucesso**: 201 Created
- **Resposta de Erro**: 400 Bad Request (Dados inválidos)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "modelo": "Mercedes-Benz Actros",
  "placa": "DEF5678",
  "dataFabricacao": "2022-03-10T00:00:00",
  "status": "Disponível"
}
```

#### Atualizar caminhão
- **Endpoint**: `PUT /api/Caminhao/{id}`
- **Parâmetros**: 
  - `id` (int): ID do caminhão
- **Corpo da Requisição**:
```json
{
  "modelo": "Mercedes-Benz Actros 2545",
  "placa": "DEF5678",
  "dataFabricacao": "2022-03-10T00:00:00",
  "status": "Em Manutenção"
}
```

- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Caminhão não encontrado) ou 400 Bad Request (Dados inválidos)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "modelo": "Mercedes-Benz Actros 2545",
  "placa": "DEF5678",
  "dataFabricacao": "2022-03-10T00:00:00",
  "status": "Em Manutenção"
}
```

#### Excluir caminhão
- **Endpoint**: `DELETE /api/Caminhao/{id}`
- **Parâmetros**: 
  - `id` (int): ID do caminhão
- **Resposta de Sucesso**: 204 No Content
- **Resposta de Erro**: 404 Not Found (Caminhão não encontrado)

### Motoristas

#### Listar todos os motoristas
- **Endpoint**: `GET /api/Motorista`
- **Descrição**: Retorna uma lista com todos os motoristas cadastrados
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "cnh": "12345678900",
    "validadeCNH": "2025-06-30T00:00:00"
  },
  {
    "id": 2,
    "nome": "Maria Oliveira",
    "cnh": "09876543211",
    "validadeCNH": "2024-12-15T00:00:00"
  }
]
```

#### Obter motorista por ID
- **Endpoint**: `GET /api/Motorista/{id}`
- **Parâmetros**: 
  - `id` (int): ID do motorista
- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Motorista não encontrado)
- **Exemplo de Resposta**:
```json
{
  "id": 1,
  "nome": "João Silva",
  "cnh": "12345678900",
  "validadeCNH": "2025-06-30T00:00:00"
}
```

#### Listar motoristas com CNH válida
- **Endpoint**: `GET /api/Motorista/cnh-valida`
- **Descrição**: Retorna apenas os motoristas com CNH não vencida
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "cnh": "12345678900",
    "validadeCNH": "2025-06-30T00:00:00"
  }
]
```

#### Cadastrar novo motorista
- **Endpoint**: `POST /api/Motorista`
- **Corpo da Requisição**:
```json
{
  "nome": "Pedro Santos",
  "cnh": "54321678900",
  "validadeCNH": "2026-03-20T00:00:00"
}
```

- **Resposta de Sucesso**: 201 Created
- **Resposta de Erro**: 400 Bad Request (Dados inválidos)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "nome": "Pedro Santos",
  "cnh": "54321678900",
  "validadeCNH": "2026-03-20T00:00:00"
}
```

#### Atualizar motorista
- **Endpoint**: `PUT /api/Motorista/{id}`
- **Parâmetros**: 
  - `id` (int): ID do motorista
- **Corpo da Requisição**:
```json
{
  "nome": "Pedro Santos Silva",
  "cnh": "54321678900",
  "validadeCNH": "2026-03-20T00:00:00"
}
```

- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Motorista não encontrado) ou 400 Bad Request (Dados inválidos)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "nome": "Pedro Santos Silva",
  "cnh": "54321678900",
  "validadeCNH": "2026-03-20T00:00:00"
}
```

#### Excluir motorista
- **Endpoint**: `DELETE /api/Motorista/{id}`
- **Parâmetros**: 
  - `id` (int): ID do motorista
- **Resposta de Sucesso**: 204 No Content
- **Resposta de Erro**: 404 Not Found (Motorista não encontrado)

### Viagens

#### Listar todas as viagens
- **Endpoint**: `GET /api/Viagem`
- **Descrição**: Retorna uma lista com todas as viagens cadastradas
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "caminhaoId": 1,
    "motoristaId": 1,
    "origem": "São Paulo, SP",
    "destino": "Rio de Janeiro, RJ",
    "distanciaKm": 430,
    "dataInicio": "2023-10-01T08:00:00",
    "dataFim": "2023-10-01T18:30:00",
    "status": "Concluída"
  },
  {
    "id": 2,
    "caminhaoId": 2,
    "motoristaId": 2,
    "origem": "Belo Horizonte, MG",
    "destino": "Brasília, DF",
    "distanciaKm": 740,
    "dataInicio": "2023-10-15T06:00:00",
    "dataFim": null,
    "status": "Em Andamento"
  }
]
```

#### Obter viagem por ID
- **Endpoint**: `GET /api/Viagem/{id}`
- **Parâmetros**: 
  - `id` (int): ID da viagem
- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Viagem não encontrada)
- **Exemplo de Resposta**:
```json
{
  "id": 1,
  "caminhaoId": 1,
  "motoristaId": 1,
  "origem": "São Paulo, SP",
  "destino": "Rio de Janeiro, RJ",
  "distanciaKm": 430,
  "dataInicio": "2023-10-01T08:00:00",
  "dataFim": "2023-10-01T18:30:00",
  "status": "Concluída"
}
```

#### Obter detalhes da viagem
- **Endpoint**: `GET /api/Viagem/{id}/detalhes`
- **Parâmetros**: 
  - `id` (int): ID da viagem
- **Descrição**: Retorna detalhes completos da viagem, incluindo caminhão, motorista, pedágios e abastecimentos
- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Viagem não encontrada)
- **Exemplo de Resposta**:
```json
{
  "id": 1,
  "caminhaoId": 1,
  "motoristaId": 1,
  "origem": "São Paulo, SP",
  "destino": "Rio de Janeiro, RJ",
  "distanciaKm": 430,
  "dataInicio": "2023-10-01T08:00:00",
  "dataFim": "2023-10-01T18:30:00",
  "status": "Concluída",
  "caminhao": {
    "id": 1,
    "modelo": "Volvo FH 460",
    "placa": "ABC1234",
    "dataFabricacao": "2020-01-01T00:00:00",
    "status": "Disponível"
  },
  "motorista": {
    "id": 1,
    "nome": "João Silva",
    "cnh": "12345678900",
    "validadeCNH": "2025-06-30T00:00:00"
  },
  "pedagios": [
    {
      "id": 1,
      "viagemId": 1,
      "valor": 15.50,
      "localizacao": "Rodovia Dutra, km 163",
      "dataPagamento": "2023-10-01T09:30:00"
    },
    {
      "id": 2,
      "viagemId": 1,
      "valor": 12.80,
      "localizacao": "Rodovia Dutra, km 207",
      "dataPagamento": "2023-10-01T10:45:00"
    }
  ],
  "abastecimentos": [
    {
      "id": 1,
      "viagemId": 1,
      "litros": 180.5,
      "valor": 950.20,
      "localizacao": "Posto ABC, Guarulhos",
      "dataAbastecimento": "2023-10-01T07:15:00"
    },
    {
      "id": 2,
      "viagemId": 1,
      "litros": 150.2,
      "valor": 790.50,
      "localizacao": "Posto XYZ, Resende",
      "dataAbastecimento": "2023-10-01T14:30:00"
    }
  ]
}
```

#### Listar viagens em andamento
- **Endpoint**: `GET /api/Viagem/em-andamento`
- **Descrição**: Retorna todas as viagens com status 'Em Andamento'
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 2,
    "caminhaoId": 2,
    "motoristaId": 2,
    "origem": "Belo Horizonte, MG",
    "destino": "Brasília, DF",
    "distanciaKm": 740,
    "dataInicio": "2023-10-15T06:00:00",
    "dataFim": null,
    "status": "Em Andamento",
    "caminhao": {
      "id": 2,
      "modelo": "Scania R450",
      "placa": "XYZ5678",
      "dataFabricacao": "2021-05-15T00:00:00",
      "status": "Em Viagem"
    },
    "motorista": {
      "id": 2,
      "nome": "Maria Oliveira",
      "cnh": "09876543211",
      "validadeCNH": "2024-12-15T00:00:00"
    }
  }
]
```

#### Listar viagens por caminhão
- **Endpoint**: `GET /api/Viagem/caminhao/{caminhaoId}`
- **Parâmetros**: 
  - `caminhaoId` (int): ID do caminhão
- **Descrição**: Retorna todas as viagens de um caminhão específico
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "caminhaoId": 1,
    "motoristaId": 1,
    "origem": "São Paulo, SP",
    "destino": "Rio de Janeiro, RJ",
    "distanciaKm": 430,
    "dataInicio": "2023-10-01T08:00:00",
    "dataFim": "2023-10-01T18:30:00",
    "status": "Concluída",
    "motorista": {
      "id": 1,
      "nome": "João Silva",
      "cnh": "12345678900",
      "validadeCNH": "2025-06-30T00:00:00"
    }
  }
]
```

#### Listar viagens por motorista
- **Endpoint**: `GET /api/Viagem/motorista/{motoristaId}`
- **Parâmetros**: 
  - `motoristaId` (int): ID do motorista
- **Descrição**: Retorna todas as viagens de um motorista específico
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "caminhaoId": 1,
    "motoristaId": 1,
    "origem": "São Paulo, SP",
    "destino": "Rio de Janeiro, RJ",
    "distanciaKm": 430,
    "dataInicio": "2023-10-01T08:00:00",
    "dataFim": "2023-10-01T18:30:00",
    "status": "Concluída",
    "caminhao": {
      "id": 1,
      "modelo": "Volvo FH 460",
      "placa": "ABC1234",
      "dataFabricacao": "2020-01-01T00:00:00",
      "status": "Disponível"
    }
  }
]
```

#### Registrar nova viagem
- **Endpoint**: `POST /api/Viagem`
- **Corpo da Requisição**:
```json
{
  "caminhaoId": 1,
  "motoristaId": 1,
  "origem": "Curitiba, PR",
  "destino": "Florianópolis, SC",
  "distanciaKm": 300,
  "dataInicio": "2023-11-01T08:00:00"
}
```

- **Resposta de Sucesso**: 201 Created
- **Resposta de Erro**: 400 Bad Request (Dados inválidos)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "caminhaoId": 1,
  "motoristaId": 1,
  "origem": "Curitiba, PR",
  "destino": "Florianópolis, SC",
  "distanciaKm": 300,
  "dataInicio": "2023-11-01T08:00:00",
  "dataFim": null,
  "status": "Planejada"
}
```

#### Atualizar viagem
- **Endpoint**: `PUT /api/Viagem/{id}`
- **Parâmetros**: 
  - `id` (int): ID da viagem
- **Descrição**: Atualiza os dados de uma viagem (apenas viagens planejadas)
- **Corpo da Requisição**:
```json
{
  "caminhaoId": 1,
  "motoristaId": 1,
  "origem": "Curitiba, PR",
  "destino": "Porto Alegre, RS",
  "distanciaKm": 550,
  "dataInicio": "2023-11-05T08:00:00"
}
```

- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Viagem não encontrada) ou 400 Bad Request (Dados inválidos ou viagem não pode ser alterada)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "caminhaoId": 1,
  "motoristaId": 1,
  "origem": "Curitiba, PR",
  "destino": "Porto Alegre, RS",
  "distanciaKm": 550,
  "dataInicio": "2023-11-05T08:00:00",
  "dataFim": null,
  "status": "Planejada"
}
```

#### Iniciar viagem
- **Endpoint**: `POST /api/Viagem/{id}/iniciar`
- **Parâmetros**: 
  - `id` (int): ID da viagem
- **Descrição**: Altera o status da viagem para 'Em Andamento' e registra a data/hora de início
- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Viagem não encontrada) ou 400 Bad Request (Viagem não pode ser iniciada)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "caminhaoId": 1,
  "motoristaId": 1,
  "origem": "Curitiba, PR",
  "destino": "Porto Alegre, RS",
  "distanciaKm": 550,
  "dataInicio": "2023-10-20T09:15:30",
  "dataFim": null,
  "status": "Em Andamento"
}
```

#### Finalizar viagem
- **Endpoint**: `POST /api/Viagem/{id}/finalizar`
- **Parâmetros**: 
  - `id` (int): ID da viagem
- **Descrição**: Altera o status da viagem para 'Concluída', registra a data/hora de término e libera o caminhão
- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Viagem não encontrada) ou 400 Bad Request (Viagem não pode ser finalizada)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "caminhaoId": 1,
  "motoristaId": 1,
  "origem": "Curitiba, PR",
  "destino": "Porto Alegre, RS",
  "distanciaKm": 550,
  "dataInicio": "2023-10-20T09:15:30",
  "dataFim": "2023-10-21T14:30:45",
  "status": "Concluída"
}
```

#### Cancelar viagem
- **Endpoint**: `POST /api/Viagem/{id}/cancelar`
- **Parâmetros**: 
  - `id` (int): ID da viagem
- **Descrição**: Altera o status da viagem para 'Cancelada' e libera o caminhão (caso a viagem esteja em andamento)
- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Viagem não encontrada) ou 400 Bad Request (Viagem não pode ser cancelada)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "caminhaoId": 1,
  "motoristaId": 1,
  "origem": "Curitiba, PR",
  "destino": "Porto Alegre, RS",
  "distanciaKm": 550,
  "dataInicio": "2023-10-20T09:15:30",
  "dataFim": "2023-10-20T12:45:10",
  "status": "Cancelada"
}
```

#### Excluir viagem
- **Endpoint**: `DELETE /api/Viagem/{id}`
- **Parâmetros**: 
  - `id` (int): ID da viagem
- **Descrição**: Remove uma viagem do sistema (apenas viagens planejadas ou canceladas)
- **Resposta de Sucesso**: 204 No Content
- **Resposta de Erro**: 404 Not Found (Viagem não encontrada) ou 400 Bad Request (Viagem não pode ser excluída)

### Abastecimentos

#### Listar todos os abastecimentos
- **Endpoint**: `GET /api/Abastecimento`
- **Descrição**: Retorna uma lista com todos os registros de abastecimentos
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "viagemId": 1,
    "litros": 180.5,
    "valor": 950.20,
    "localizacao": "Posto ABC, Guarulhos",
    "dataAbastecimento": "2023-10-01T07:15:00"
  },
  {
    "id": 2,
    "viagemId": 1,
    "litros": 150.2,
    "valor": 790.50,
    "localizacao": "Posto XYZ, Resende",
    "dataAbastecimento": "2023-10-01T14:30:00"
  }
]
```

#### Obter abastecimento por ID
- **Endpoint**: `GET /api/Abastecimento/{id}`
- **Parâmetros**: 
  - `id` (int): ID do abastecimento
- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Abastecimento não encontrado)
- **Exemplo de Resposta**:
```json
{
  "id": 1,
  "viagemId": 1,
  "litros": 180.5,
  "valor": 950.20,
  "localizacao": "Posto ABC, Guarulhos",
  "dataAbastecimento": "2023-10-01T07:15:00"
}
```

#### Listar abastecimentos por viagem
- **Endpoint**: `GET /api/Abastecimento/viagem/{viagemId}`
- **Parâmetros**: 
  - `viagemId` (int): ID da viagem
- **Descrição**: Retorna todos os abastecimentos registrados em uma viagem específica
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "viagemId": 1,
    "litros": 180.5,
    "valor": 950.20,
    "localizacao": "Posto ABC, Guarulhos",
    "dataAbastecimento": "2023-10-01T07:15:00"
  },
  {
    "id": 2,
    "viagemId": 1,
    "litros": 150.2,
    "valor": 790.50,
    "localizacao": "Posto XYZ, Resende",
    "dataAbastecimento": "2023-10-01T14:30:00"
  }
]
```

#### Calcular consumo da viagem
- **Endpoint**: `GET /api/Abastecimento/viagem/{viagemId}/consumo`
- **Parâmetros**: 
  - `viagemId` (int): ID da viagem
- **Descrição**: Retorna o total de litros abastecidos em uma viagem
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
330.7
```

#### Registrar novo abastecimento
- **Endpoint**: `POST /api/Abastecimento`
- **Corpo da Requisição**:
```json
{
  "viagemId": 2,
  "litros": 200.0,
  "valor": 1050.00,
  "localizacao": "Posto Delta, Três Marias",
  "dataAbastecimento": "2023-10-15T12:00:00"
}
```

- **Resposta de Sucesso**: 201 Created
- **Resposta de Erro**: 400 Bad Request (Dados inválidos ou viagem não está em andamento)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "viagemId": 2,
  "litros": 200.0,
  "valor": 1050.00,
  "localizacao": "Posto Delta, Três Marias",
  "dataAbastecimento": "2023-10-15T12:00:00"
}
```

#### Atualizar abastecimento
- **Endpoint**: `PUT /api/Abastecimento/{id}`
- **Parâmetros**: 
  - `id` (int): ID do abastecimento
- **Corpo da Requisição**:
```json
{
  "viagemId": 2,
  "litros": 195.5,
  "valor": 1025.50,
  "localizacao": "Posto Delta, Três Marias",
  "dataAbastecimento": "2023-10-15T12:00:00"
}
```

- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Abastecimento não encontrado) ou 400 Bad Request (Dados inválidos ou viagem não está em andamento)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "viagemId": 2,
  "litros": 195.5,
  "valor": 1025.50,
  "localizacao": "Posto Delta, Três Marias",
  "dataAbastecimento": "2023-10-15T12:00:00"
}
```

#### Excluir abastecimento
- **Endpoint**: `DELETE /api/Abastecimento/{id}`
- **Parâmetros**: 
  - `id` (int): ID do abastecimento
- **Descrição**: Remove um registro de abastecimento (apenas de viagens em andamento)
- **Resposta de Sucesso**: 204 No Content
- **Resposta de Erro**: 404 Not Found (Abastecimento não encontrado) ou 400 Bad Request (Viagem não está em andamento)

#### Relatório de custos de abastecimento
- **Endpoint**: `GET /api/Abastecimento/relatorio/viagem/{viagemId}`
- **Parâmetros**: 
  - `viagemId` (int): ID da viagem
- **Descrição**: Retorna o total gasto com combustível em uma viagem específica
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
1740.70
```

### Pedágios

#### Listar todos os pedágios
- **Endpoint**: `GET /api/Pedagio`
- **Descrição**: Retorna uma lista com todos os registros de pedágios
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "viagemId": 1,
    "valor": 15.50,
    "localizacao": "Rodovia Dutra, km 163",
    "dataPagamento": "2023-10-01T09:30:00"
  },
  {
    "id": 2,
    "viagemId": 1,
    "valor": 12.80,
    "localizacao": "Rodovia Dutra, km 207",
    "dataPagamento": "2023-10-01T10:45:00"
  }
]
```

#### Obter pedágio por ID
- **Endpoint**: `GET /api/Pedagio/{id}`
- **Parâmetros**: 
  - `id` (int): ID do pedágio
- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Pedágio não encontrado)
- **Exemplo de Resposta**:
```json
{
  "id": 1,
  "viagemId": 1,
  "valor": 15.50,
  "localizacao": "Rodovia Dutra, km 163",
  "dataPagamento": "2023-10-01T09:30:00"
}
```

#### Listar pedágios por viagem
- **Endpoint**: `GET /api/Pedagio/viagem/{viagemId}`
- **Parâmetros**: 
  - `viagemId` (int): ID da viagem
- **Descrição**: Retorna todos os pedágios registrados em uma viagem específica
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
[
  {
    "id": 1,
    "viagemId": 1,
    "valor": 15.50,
    "localizacao": "Rodovia Dutra, km 163",
    "dataPagamento": "2023-10-01T09:30:00"
  },
  {
    "id": 2,
    "viagemId": 1,
    "valor": 12.80,
    "localizacao": "Rodovia Dutra, km 207",
    "dataPagamento": "2023-10-01T10:45:00"
  }
]
```

#### Obter total gasto com pedágios na viagem
- **Endpoint**: `GET /api/Pedagio/viagem/{viagemId}/total`
- **Parâmetros**: 
  - `viagemId` (int): ID da viagem
- **Descrição**: Retorna o total gasto com pedágios em uma viagem específica
- **Resposta de Sucesso**: 200 OK
- **Exemplo de Resposta**:
```json
28.30
```

#### Registrar novo pedágio
- **Endpoint**: `POST /api/Pedagio`
- **Corpo da Requisição**:
```json
{
  "viagemId": 2,
  "valor": 18.20,
  "localizacao": "Rodovia Fernão Dias, km 520",
  "dataPagamento": "2023-10-15T10:30:00"
}
```

- **Resposta de Sucesso**: 201 Created
- **Resposta de Erro**: 400 Bad Request (Dados inválidos ou viagem não está em andamento)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "viagemId": 2,
  "valor": 18.20,
  "localizacao": "Rodovia Fernão Dias, km 520",
  "dataPagamento": "2023-10-15T10:30:00"
}
```

#### Atualizar pedágio
- **Endpoint**: `PUT /api/Pedagio/{id}`
- **Parâmetros**: 
  - `id` (int): ID do pedágio
- **Corpo da Requisição**:
```json
{
  "viagemId": 2,
  "valor": 19.50,
  "localizacao": "Rodovia Fernão Dias, km 520",
  "dataPagamento": "2023-10-15T10:30:00"
}
```

- **Resposta de Sucesso**: 200 OK
- **Resposta de Erro**: 404 Not Found (Pedágio não encontrado) ou 400 Bad Request (Dados inválidos ou viagem não está em andamento)
- **Exemplo de Resposta**:
```json
{
  "id": 3,
  "viagemId": 2,
  "valor": 19.50,
  "localizacao": "Rodovia Fernão Dias, km 520",
  "dataPagamento": "2023-10-15T10:30:00"
}
```

#### Excluir pedágio
- **Endpoint**: `DELETE /api/Pedagio/{id}`
- **Parâmetros**: 
  - `id` (int): ID do pedágio
- **Descrição**: Remove um registro de pedágio (apenas de viagens em andamento)
- **Resposta de Sucesso**: 204 No Content
- **Resposta de Erro**: 404 Not Found (Pedágio não encontrado) ou 400 Bad Request (Viagem não está em andamento)

## Modelos de Dados

### Caminhao
```json
{
  "id": 1,
  "modelo": "Volvo FH 460",   // Obrigatório
  "placa": "ABC1234",         // Obrigatório, único
  "dataFabricacao": "2020-01-01T00:00:00", // Obrigatório
  "status": "Disponível"      // Obrigatório: "Disponível", "Em Viagem", "Em Manutenção"
}
```

### Motorista
```json
{
  "id": 1,
  "nome": "João Silva",       // Obrigatório
  "cnh": "12345678900",       // Obrigatório, único
  "validadeCNH": "2025-06-30T00:00:00" // Obrigatório
}
```

### Viagem
```json
{
  "id": 1,
  "caminhaoId": 1,            // Obrigatório, referência a um Caminhao
  "motoristaId": 1,           // Opcional para viagens planejadas, referência a um Motorista
  "origem": "São Paulo, SP",  // Obrigatório
  "destino": "Rio de Janeiro, RJ", // Obrigatório
  "distanciaKm": 430,         // Obrigatório
  "dataInicio": "2023-10-01T08:00:00", // Obrigatório
  "dataFim": "2023-10-01T18:30:00", // Opcional, preenchido automaticamente ao finalizar
  "status": "Concluída"       // Obrigatório: "Planejada", "Em Andamento", "Concluída", "Cancelada"
}
```

### Pedagio
```json
{
  "id": 1,
  "viagemId": 1,              // Obrigatório, referência a uma Viagem
  "valor": 15.50,             // Obrigatório
  "localizacao": "Rodovia Dutra, km 163", // Obrigatório
  "dataPagamento": "2023-10-01T09:30:00" // Obrigatório
}
```

### Abastecimento
```json
{
  "id": 1,
  "viagemId": 1,              // Obrigatório, referência a uma Viagem
  "litros": 180.5,            // Obrigatório
  "valor": 950.20,            // Obrigatório
  "localizacao": "Posto ABC, Guarulhos", // Obrigatório
  "dataAbastecimento": "2023-10-01T07:15:00" // Obrigatório
}
```

## Erros Comuns

### Códigos de Erro HTTP

| Código | Descrição | Causa Comum |
|--------|-----------|-------------|
| 400 | Bad Request | Dados inválidos ou operação não permitida |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro inesperado no servidor |

### Mensagens de Erro Comuns

- **Caminhão não encontrado**: Ocorre quando o ID do caminhão não existe.
- **Motorista não encontrado**: Ocorre quando o ID do motorista não existe.
- **Viagem não encontrada**: Ocorre quando o ID da viagem não existe.
- **Já existe um caminhão com esta placa**: Ocorre ao tentar cadastrar ou atualizar um caminhão com uma placa já existente.
- **Já existe um motorista com esta CNH**: Ocorre ao tentar cadastrar ou atualizar um motorista com uma CNH já existente.
- **Só é possível registrar abastecimentos/pedágios em viagens em andamento**: Ocorre ao tentar registrar abastecimentos ou pedágios em viagens que não estão em andamento.
- **Só é possível atualizar viagens planejadas**: Ocorre ao tentar modificar uma viagem que já foi iniciada, concluída ou cancelada.
- **Caminhão não está disponível**: Ocorre ao tentar iniciar uma viagem com um caminhão que já está em uso.
- **Só é possível finalizar viagens em andamento**: Ocorre ao tentar finalizar uma viagem que não está em andamento.
- **Só é possível excluir viagens planejadas ou canceladas**: Ocorre ao tentar excluir uma viagem em andamento ou concluída.

## Implantação

### Ambientes Disponíveis

- **Produção**: https://wisetruckapi.onrender.com/api
- **Documentação Swagger**: https://wisetruckapi.onrender.com/

### Requisitos para Implantação

- .NET Core 8.0 SDK
- PostgreSQL 15+
- Render.com ou outro provedor de hospedagem compatível com .NET Core

### Variáveis de Ambiente

| Nome | Descrição | Exemplo |
|------|-----------|---------|
| DATABASE_URL | String de conexão para o PostgreSQL | Host=hostname;Port=5432;Database=wisetruck;Username=user;Password=password;SSL Mode=Require; |
| ASPNETCORE_ENVIRONMENT | Ambiente de execução | Production |

### Docker

A aplicação pode ser executada em contêineres Docker usando o Dockerfile incluído no repositório.

```bash
# Construir a imagem
docker build -t wisetruck-api .

# Executar o contêiner
docker run -p 8080:8080 -e DATABASE_URL="sua-string-de-conexão" wisetruck-api
```

### Implantação no Render.com

1. Crie uma conta no Render.com
2. Selecione "New Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - Nome: wisetruck-api
   - Runtime: Docker
   - Variáveis de ambiente:
     - DATABASE_URL: sua string de conexão PostgreSQL
5. Clique em "Create Web Service"

## Considerações de Segurança

- A API atualmente não implementa autenticação ou autorização
- Para uso em produção, recomenda-se adicionar:
  - Autenticação JWT
  - HTTPS (ativado por padrão no Render.com)
  - Rate limiting
  - Validação adicional de entrada

## Integração com Frontend

O frontend Angular pode ser configurado para se comunicar com a API utilizando o HttpClient. Exemplo de configuração:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://wisetruckapi.onrender.com/api'
};

// caminhao.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Caminhao } from '../models/caminhao';

@Injectable({
  providedIn: 'root'
})
export class CaminhaoService {
  private apiUrl = `${environment.apiUrl}/Caminhao`;

  constructor(private http: HttpClient) { }

  getCaminhoes(): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(this.apiUrl);
  }

  getCaminhao(id: number): Observable<Caminhao> {
    return this.http.get<Caminhao>(`${this.apiUrl}/${id}`);
  }

  createCaminhao(caminhao: Caminhao): Observable<Caminhao> {
    return this.http.post<Caminhao>(this.apiUrl, caminhao);
  }

  updateCaminhao(id: number, caminhao: Caminhao): Observable<Caminhao> {
    return this.http.put<Caminhao>(`${this.apiUrl}/${id}`, caminhao);
  }

  deleteCaminhao(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCaminhoesDisponiveis(): Observable<Caminhao[]> {
    return this.http.get<Caminhao[]>(`${this.apiUrl}/disponiveis`);
  }
}
```

## Suporte e Contato

Para obter suporte técnico ou relatar problemas, entre em contato com a equipe através de:
- Email: contato@wisetruck.com.br
- GitHub Issues: https://github.com/seu-usuario/wisetruck-api/issues

## Licença

WiseTruck API é distribuída sob a licença MIT.