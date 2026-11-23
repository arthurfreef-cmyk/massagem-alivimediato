# Configuração dos preços alternados dos order bumps

A implementação alterna os dois order bumps individuais entre **R$ 5,90** e **R$ 9,90**, em sequência global:
- primeiro visitante atribuído: R$ 5,90;
- segundo visitante: R$ 9,90;
- terceiro: R$ 5,90;
- quarto: R$ 9,90;
- e assim sucessivamente.

A atribuição é persistida por identificador de sessão do navegador e feita por uma função SQL transacional, que serializa acessos simultâneos. O mesmo visitante recebe o mesmo preço durante a sessão. Os dois order bumps individuais usam o mesmo preço atribuído; o combo mantém o preço já configurado.

## Ativação obrigatória no Supabase

1. Abra o projeto Supabase usado pelo checkout.
2. No SQL Editor, execute integralmente:
   `supabase/migrations/20261123010000_order_bump_alternating_prices.sql`.
3. Na plataforma que hospeda o servidor TanStack Start, configure estes secrets **somente no ambiente do servidor**:
   - `SUPABASE_URL`: URL do projeto Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: chave service_role do projeto.
4. Faça um novo deploy do servidor.

**Nunca** coloque `SUPABASE_SERVICE_ROLE_KEY` em variáveis `VITE_*`, no frontend, em arquivos versionados ou em código enviado ao navegador.

## Comportamento seguro

- O servidor consulta o Supabase tanto ao apresentar a faixa quanto ao criar a cobrança.
- O valor da cobrança Fruitfy é calculado no servidor; não confia no preço enviado pelo navegador.
- Se a migration ou os secrets ainda não estiverem configurados, a geração do Pix é bloqueada com uma mensagem de erro. Isso evita cobrar um valor diferente do que foi exibido.
- O contador é global para o projeto Supabase. Não é uma divisão aleatória nem um teste A/B.
- A atribuição usa sessionStorage: recarregar a mesma aba mantém a faixa; uma nova sessão/aba recebe um novo identificador.

## Validação antes de produção

Faça duas sessões de navegador independentes e confirme:
1. primeira sessão mostra R$ 5,90 nos dois adicionais;
2. segunda sessão mostra R$ 9,90 nos dois adicionais;
3. terceira sessão volta a R$ 5,90;
4. a seleção de cada adicional atualiza o resumo;
5. o valor total e os itens enviados à Fruitfy correspondem exatamente ao preço mostrado;
6. o combo mantém seu preço original.

A migration e os secrets precisam estar ativos no ambiente Supabase/hosting antes de considerar o recurso operacional.
