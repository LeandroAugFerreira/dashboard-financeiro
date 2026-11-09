# Gestão Financeira — plano priorizado para recrutadores de Dados/BI

**Objetivo:** fortalecer capacidade analítica, qualidade e reprodução, sem confundir demonstração sintética com operação financeira de empresa.

| Prioridade | Melhoria | Valor para recrutamento | Esforço | Risco | Critério de aceite |
| --- | --- | --- | --- | --- | --- |
| P0 | 19 novos testes financeiros e semáforo sem orçamento | Muito alto | Médio | Baixo | 25 testes Node aprovados |
| P0 | Reproduzir JSON e CSV do gerador em pasta temporária | Muito alto | Baixo | Baixo | Hash byte a byte para três arquivos e cópias web |
| P0 | Auditoria, arquitetura, estudo de caso, perguntas e roteiro | Alto | Baixo | Baixo | Fontes e limites documentados |
| P0 | Guia visual acessível e link ao dashboard original web | Alto | Médio | Baixo | Sem API ou dado pessoal |
| P1 | Vocabulário consistente: resultado gerencial, não fluxo de caixa | Alto | Baixo | Baixo | Página/README sem alegação indevida |
| P1 | Dicionário de KPIs: contas, bases, hipóteses e fórmula | Muito alto | Baixo | Baixo | Unidade, numerador, denominador e exemplo |
| P1 | Casos de orçamento incompleto/zero/negativo e categorias inesperadas | Alto | Médio | Médio | Estados nulos coerentes e testes negativos |
| P1 | Teste navegador real/Playwright, responsividade e acessibilidade | Alto | Médio | Médio | CI e capturas em dados sintéticos |
| P1 | Análise de desvio por centro/mês: preço, volume, mix e premissas | Alto | Médio | Médio | Tabelas explicativas e reconciliação de desvios |
| P2 | Reconstituir versão Power BI nativa *nova* usando CSV sintético | Alto | Médio/alto | Médio | PBIX produzido, DAX/Power Query testados em Desktop |
| P2 | Pipeline SQL verificável sobre a mesma base fictícia | Muito alto para vagas SQL/BI | Médio | Médio | Consultas por mês/centro reconciliadas ao JS |
| P2 | Otimizar formato do visual, legendas e alerta de nulos | Médio | Médio | Baixo | Instrumentação de a11y e UX |
| P3 | Fluxo de caixa de fato, somente com dados e requisitos adicionais | Condicional | Alto | Alto | Recebimentos/pagamentos com competência, liquidação e saldo |

## Situação atual

- [25 testes Node aprovados](https://github.com/LeandroAugFerreira/dashboard-financeiro/actions/runs/42543050313), 19 novos.
- Reprodutibilidade Python isolada aprovada para JSON/CSV.
- Correção localizada de ausência de orçamento, preservando os 360 lançamentos, 72 metas e o cálculo dos recortes com orçamento.
- Estudo de caso e guia web propostos, sem atualizar o Power BI original ou simular transações reais.

## Metodologia de evolução

Manter dados e gerador em controle de versão; só publicar novas métricas com definição e teste; comparar períodos com denominadores consistentes; distinguir **exemplo de decisão gerencial** de ganho comprovado. Para fortalecer candidatura a Data Analyst/BI, a próxima evidência útil seria **SQL reproduzindo os KPIs em SQLite** (sobre CSV sintético), não um novo painel sem origem.

[Auditoria](AUDITORIA.md) · [Qualidade](QUALIDADE_DADOS.md).
