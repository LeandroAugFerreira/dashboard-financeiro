# Gestão Financeira

## 1. Apresentação

Demonstração web de resultado, margem, orçamento, aderência e ponto de equilíbrio, com uma base financeira inteiramente fictícia criada por autorização do autor.

## 2. Problema de negócio

Relacionar receitas, gastos e orçamento para explicar resultado e necessidade de cobertura dos custos.

## 3. Objetivo

Disponibilizar uma experiência demonstrativa no navegador e material técnico reproduzível, preservando os relatórios existentes.

## 4. Funcionalidades

Filtros por ano, mês e centro; receita líquida, despesas, lucro, margem e aderência; cascata de resultado; comparação de equilíbrio; evolução mensal; semáforo de risco; download das duas bases CSV.

## 5. Tecnologias

HTML, CSS, JavaScript ES modules e SVG. Node.js 22 ou superior somente para testes. Python 3 somente para servidor local e scripts de preparação. A interface não instala bibliotecas, não exige login e não consulta serviços de negócio.

## 6. Arquitetura

Dados locais → seleção no navegador → cálculos JavaScript → apresentação HTML/SVG. [Detalhes](docs/ARQUITETURA.md).

## 7. Estrutura

```text
dados/             Bases CSV sintéticas
generate_data.py   Geração determinística
web/               HTML, CSS, JavaScript e snapshot JSON
tests/             Reconciliação financeira em Node
docs/              Metodologia e captura de referência
```

## 8. Instalação

Clone este repositório. Para abrir a aplicação use um servidor HTTP local; abrir o HTML diretamente por file:// impede o carregamento do JSON em alguns navegadores. Não é necessário `npm install`.

## 9. Configuração

Sem `.env`, senha, chave ou conta Power BI para usar a versão web. Todos os arquivos necessários estão em `web/`.

## 10. Execução

```sh
python -m http.server 8000 --directory web
```

Abra http://localhost:8000. Na web publicada: [abrir dashboard](https://leandroaugferreira.github.io/dashboards/financeiro/).

## 11. Testes

```sh
node --test tests/*.test.mjs
```

Os testes verificam identidades de negócio e integridade. [Validação](docs/VALIDACAO.md). O workflow usa permissões de leitura e não executa integrações de negócio.

## 12. Evidências reais

A imagem abaixo é a captura original do Power BI já apresentada no portfólio; não é uma captura da versão web. [Navegar pela versão web](https://leandroaugferreira.github.io/dashboards/financeiro/).

![Referência do Power BI](docs/capturas/powerbi-referencia.png)

## 13. Limitações

O PBIX correspondente à versão financeira atualmente publicada não foi localizado. Portanto, os cálculos desta demonstração são definidos em docs/METODOLOGIA.md e não são atribuídos ao DAX daquele relatório. A versão web usa dados sintéticos e pode apresentar números e risco diferentes da captura Power BI.

## 14. Estado e dados

Os dados desta versão são SINTÉTICOS, gerados de forma determinística por generate_data.py em 03/11/2026. Não são uma extração do relatório Power BI publicado. A captura existente serve apenas de referência de apresentação e raciocínio financeiro. O relatório original continua preservado no portfólio.

360 movimentações sintéticas, 72 registros de orçamento, 2025–2026 e três centros: Comercial, Serviços e Operações. Valores de origem em centavos inteiros; nenhuma pessoa ou empresa real.

Execute `python generate_data.py`; copie os CSV de `dados/` para `web/dados/` se regenerar os arquivos distribuídos para download. O gerador escreve apenas a base desta demonstração.

A publicação foi autorizada pelo autor. Não foi atribuída uma nova licença ao código ou às bases. Materiais didáticos de terceiros mantêm sua origem e não são apresentados como uma implantação empresarial do autor.

## 15. Portfólio

[Página do projeto](https://leandroaugferreira.github.io/financeiro.html) · [Perfil GitHub](https://github.com/LeandroAugFerreira)

## 16. Estudo de caso técnico para recrutamento — Dados/BI

- [Auditoria](docs/recrutamento/AUDITORIA.md), [estudo de caso](docs/recrutamento/ESTUDO_DE_CASO.md), [arquitetura Mermaid](docs/recrutamento/ARQUITETURA.md), [15 perguntas de entrevista](docs/recrutamento/ENTREVISTA_TECNICA.md) e [roteiro de três minutos](docs/recrutamento/ROTEIRO_DEMO.md).
- [Guia financeiro do case](https://leandroaugferreira.github.io/financeiro-case.html): seleção 2025/2026, comparação de margem e aderência e identificação dos meses com desvio; complementar ao [dashboard web original](https://leandroaugferreira.github.io/dashboards/financeiro/).
- [19 novos testes de cálculo](tests/recrutamento.test.mjs): filtros e partições, realizado versus orçamento, reconciliação dos totais, risco por mês e ausência de orçamento. [25 testes Node aprovados](https://github.com/LeandroAugFerreira/dashboard-financeiro/actions/runs/42543050313).
- [Reprodução isolada em Python](scripts/verify_generator.py): gera JSON/CSV em pasta temporária e confere hashes, inclusive versões dos CSV oferecidas para download.
- [Evidências e limites](docs/recrutamento/EVIDENCIAS.md) · [Qualidade](docs/recrutamento/QUALIDADE_DADOS.md) · [Plano priorizado](docs/recrutamento/PLANO_DE_MELHORIAS.md).

**Correção controlada:** sem orçamento e com margem não negativa, o semáforo exibe `Sem orçamento`, em vez de classificar o resultado artificialmente como Alto. Margem negativa continua sendo `Alto`. Não houve modificação de bases, gerador ou demais fórmulas com orçamento.

**Escopo rigoroso:** o modelo web é **sintético e independente** da captura Power BI; o PBIX financeiro correspondente não foi localizado. Não há registros bancários, datas de pagamentos/recebimentos nem fluxo de caixa real, por isso o case trata de **resultado gerencial hipotético** e orçamento — não demonstra ERP, DAX original ou resultados empresariais.
