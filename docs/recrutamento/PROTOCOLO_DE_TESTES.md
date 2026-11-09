# Gestão Financeira — protocolo de reprodução segura

## Execução de referência

[GitHub Actions #42543050313](https://github.com/LeandroAugFerreira/dashboard-financeiro/actions/runs/42543050313): **25 testes Node aprovados (6 antigos + 19 novos)**; `python3 scripts/verify_generator.py` aprovado em seguida, após corrigir o caso sem orçamento. Sem dados pessoais e sem envio de informações a serviços externos.

## Comprovar os indicadores

~~~sh
node --test tests/*.test.mjs
~~~

O conjunto confere 2025/2026, três centros, 12 meses, cinco categorias, orçamento, custo/resultado, taxa de margem e aderência, ponto de equilíbrio, classificação do semáforo e exceções sem dados/sem orçamento. Compara valores também com somas independentes em centavos do JSON.

## Reproduzir o gerador sem tocar arquivos de origem

~~~sh
python3 scripts/verify_generator.py
~~~

O script copia apenas `generate_data.py` a um `TemporaryDirectory`, cria uma subpasta `web` e executa o gerador com a biblioteca padrão Python ali. Compara os SHA-256 de `web/data.json`, `dados/movimentacoes.csv` e `dados/orcamento.csv` aos arquivos versionados; depois confere as cópias `web/dados/*.csv`. O temporário é removido ao sair.

**Não executar `python generate_data.py` diretamente na pasta com alterações não salvas**, pois o gerador original reescreve os CSV e `web/data.json` do projeto. Use o teste isolado acima para simples validação.

## Visualização web

~~~sh
python3 -m http.server 8000 --directory web
~~~

Abra `http://localhost:8000`. A interface carrega JSON local. Não há backend empresarial, login, transferência a terceiros nem motor DAX.

## Limitações explícitas

Nenhuma etapa reproduz PBIX financeiro original ausente, Power BI Desktop, APIs, bancos reais, contabilidade ou caixa. O CI também não executou browser real, testes e2e ou pentest. O dashboard do portfólio usa o mesmo tipo de dados sintéticos que a versão fonte; o repositório de portfólio é atualizado separadamente.

[Auditoria](AUDITORIA.md) · [Evidências](EVIDENCIAS.md).
