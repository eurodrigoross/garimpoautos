# Radar API — publicação de garimpos (uso interno)

Infraestrutura de servidor para a futura extensão do Garimpo Auto ("PUBLICAR NO RADAR").
Tudo roda no servidor: a extensão nunca vê chave de banco, storage ou service role.

## Segredo obrigatório

| Nome | Onde cadastrar | Uso |
| --- | --- | --- |
| `RADAR_PUBLISH_TOKEN` | Project Settings → Secrets (já criado, valor aleatório) | Único segredo que a extensão precisa guardar |

- Se precisar rotacionar, gere um novo valor no mesmo secret e atualize a extensão.
- **Nunca** coloque `SUPABASE_SERVICE_ROLE_KEY` (ou qualquer chave do banco/storage) na extensão, no bundle do site ou no repositório. A extensão só conhece o `RADAR_PUBLISH_TOKEN`.

## Autenticação

Envie o token em **um** dos headers:

```
Authorization: Bearer <RADAR_PUBLISH_TOKEN>
X-Radar-Token: <RADAR_PUBLISH_TOKEN>
```

Comparação é feita em tempo constante. Sem token válido → `401`.
CORS é liberado apenas para origens `chrome-extension://…` / `moz-extension://…`; o token continua obrigatório em qualquer caso.

## Endpoints

Base (produção): `https://garimpoautos.lovable.app` — **use exatamente este host**.
Os domínios `garimpoautos.com.br` / `www.garimpoautos.com.br` ainda não estão ativos e não respondem.

URLs finais aceitas (mesmos handlers, mesmo token):

| Endpoint | Canônico | Alias |
| --- | --- | --- |
| Publicar | `https://garimpoautos.lovable.app/api/public/radar/publish` | `https://garimpoautos.lovable.app/api/radar/publish` |
| Upload | `https://garimpoautos.lovable.app/api/public/radar/upload-image` | `https://garimpoautos.lovable.app/api/radar/upload-image` |

Diagnóstico (GET, sem token): `https://garimpoautos.lovable.app/api/public/radar/health` →
`{"ok":true,"data":{"service":"radar-api","token_configured":true,...}}`. Se isso responder 200 e o
seu POST der 404, a URL usada pela extensão está errada.

### `POST /api/public/radar/publish`

`Content-Type: application/json`. Só aceita POST (e OPTIONS para preflight).

#### Campos

Obrigatórios:

| Campo | Tipo | Regras |
| --- | --- | --- |
| `code` | string | slug único: `a-z`, `0-9` e hífens, até 60 chars |
| `vehicle_name` | string | até 160 chars |

Opcionais:

| Campo | Tipo | Regras |
| --- | --- | --- |
| `year`, `mileage_km` | string | até 32 chars |
| `transmission`, `fuel`, `location` | string | até 120 chars |
| `fipe_value`, `market_value`, `garimpo_value` | number | ≥ 0 |
| `internal_base_cost`, `internal_agio` | number | ≥ 0 — **privados**, nunca retornados nem expostos na landing |
| `discount_fipe_percent`, `market_difference` | number | recalculados pelo servidor quando possível |
| `positives`, `attention_points` | string[] | até 12 itens, 200 chars cada |
| `garimpo_note` | string | até 800 chars |
| `access_type` | `OPEN` \| `PRIME` | padrão `OPEN` |
| `status` | `AVAILABLE` \| `RESERVED` \| `CLOSED` | padrão `AVAILABLE` |
| `published` | boolean | padrão `false` (rascunho: não aparece na landing) |
| `main_image_url` | string https | normalmente vem do endpoint de upload |

Campos fora dessa lista são ignorados (não há spread do body no insert).

#### Cálculos feitos no servidor (fonte de verdade)

```
discount_fipe_percent = ((fipe_value - garimpo_value) / fipe_value) * 100   // se fipe_value > 0
market_difference     = market_value - garimpo_value                        // se ambos existirem
```

#### Exemplo de payload

```json
{
  "code": "argo-2025-sp",
  "vehicle_name": "FIAT ARGO 1.0 FIREFLY FLEX DRIVE MANUAL",
  "year": "2024/2025",
  "mileage_km": "40.451 km",
  "transmission": "MANUAL",
  "fuel": "ÁLCOOL/GASOLINA",
  "location": "VILA ÁGUA FUNDA — SÃO PAULO / SP",
  "fipe_value": 71232,
  "market_value": 80990,
  "internal_base_cost": 41000,
  "internal_agio": 7275,
  "garimpo_value": 48275,
  "positives": ["Único dono", "Sem indício de sinistro"],
  "attention_points": ["Pneus dianteiros no limite"],
  "garimpo_note": "Documentação em dia.",
  "access_type": "OPEN",
  "status": "AVAILABLE",
  "published": true,
  "main_image_url": "https://.../garimpo-images/argo-2025-sp/....jpg?token=..."
}
```

#### Respostas

`201` — sucesso (só campos seguros; sem custo interno/ágio):

```json
{
  "ok": true,
  "data": {
    "id": "0f0f…",
    "code": "argo-2025-sp",
    "vehicle_name": "FIAT ARGO 1.0 FIREFLY FLEX DRIVE MANUAL",
    "garimpo_value": 48275,
    "status": "AVAILABLE",
    "access_type": "OPEN",
    "main_image_url": null,
    "published": true,
    "created_at": "2026-08-18T22:00:00.000Z",
    "updated_at": "2026-08-18T22:00:00.000Z"
  }
}
```

Erros: `{ "ok": false, "error": "..." }`

| Status | Quando |
| --- | --- |
| `400` | JSON inválido, campo obrigatório ausente, tipo/enum/range inválido |
| `401` | token ausente ou inválido |
| `409` | `code` já existe (o registro atual **não** é alterado) |
| `500` | falha interna (sem stack trace nem detalhe sensível) |
| `503` | `RADAR_PUBLISH_TOKEN` não configurado no servidor |

### `POST /api/public/radar/upload-image`

`multipart/form-data`:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `file` | sim | JPEG, PNG ou WebP, até 8 MB |
| `code` | não | usado só para organizar a pasta |

O nome do arquivo é sempre gerado pelo servidor (`<code>/<uuid>.<ext>`) — sem path traversal e sem colisão.

```json
{
  "ok": true,
  "data": {
    "path": "argo-2025-sp/6f2e….jpg",
    "main_image_url": "https://…/storage/v1/object/sign/garimpo-images/…",
    "expires_in": 315360000
  }
}
```

O bucket `garimpo-images` é **privado** (buckets públicos estão bloqueados no workspace), então a URL retornada é assinada com validade longa (~10 anos) e pode ser usada direto em `<img>`. Upload anônimo continua bloqueado: só o servidor escreve no bucket.

## Fluxo futuro da extensão

1. **Capturar** os dados do lote na página do leilão.
2. **Revisar** os campos na própria extensão (inclusive custo interno e ágio, que ficam só na tabela administrativa).
3. **Upload da imagem** → `POST /api/public/radar/upload-image` → guarda `main_image_url`.
4. **Publicar** → `POST /api/public/radar/publish` com o token.
5. Se `published: true`, o garimpo aparece imediatamente no Radar da landing (view pública `garimpos_public`); com `published: false` fica como rascunho invisível.

## Regras de segurança

- A extensão só armazena `RADAR_PUBLISH_TOKEN`. Nada de service role, URL de banco ou chave de storage.
- CORS não substitui autenticação: toda requisição exige token.
- Respostas nunca incluem `internal_base_cost`, `internal_agio`, registros não publicados ou detalhes de erro internos.
- Logs do servidor registram apenas `code`, `id` e resultado — nunca token ou payload completo.
