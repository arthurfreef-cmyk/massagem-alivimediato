# Preço fixo dos order bumps

Os dois adicionais individuais do checkout agora custam **R$ 9,90 para todos os clientes**.

O preço é definido no servidor em centavos (990), e o checkout usa o mesmo valor no resumo e na geração da cobrança. Não há alternância entre R$ 5,90 e R$ 9,90 nem dependência de Supabase para definir esse preço.

O combo permanece com o preço já configurado em `src/lib/checkout-config.ts`.

## Deploy

Após publicar as alterações, teste uma sessão nova e confira:
1. cada adicional individual mostra R$ 9,90;
2. selecionar um adicional acrescenta R$ 9,90 ao resumo;
3. a cobrança Pix gerada inclui o mesmo valor;
4. os dois adicionais selecionados somam R$ 19,80.

As credenciais Fruitfy continuam necessárias para gerar o Pix. As credenciais Supabase não são mais necessárias para a definição do preço dos adicionais.
