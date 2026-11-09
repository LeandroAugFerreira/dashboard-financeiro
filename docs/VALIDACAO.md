# Validação — 03/11/2026

Execução local com Node.js, sem instalar dependências da aplicação. **6 testes aprovados**; código de saída 0. Saída integral: [resultado-node.txt](resultado-node.txt).

Os testes conferem integridade das fontes e snapshot, identidades financeiras/logísticas, filtros e ausência de dados. A análise comercial também confere os valores da captura publicada em 2021. Os valores esperados comercial/logístico foram calculados independentemente em Python a partir das tabelas exportadas.

Hash SHA-256 de web/data.json: `dba08f65334200c28993bd3265b879a5993e65014f5f5a5d27ccc2892c736d1f`.

As páginas foram inspecionadas no navegador local; seleções e navegação foram exercitadas. A comparação visual não certifica reprodução pixel a pixel do Power BI nem todos os estados possíveis de filtros. O workflow remoto será consultado em [Actions](https://github.com/LeandroAugFerreira/dashboard-financeiro/actions).


---

## Revisão técnica para recrutamento — 08/11/2026

A auditoria incluiu **19 testes Node** em [tests/recrutamento.test.mjs](../tests/recrutamento.test.mjs), elevando o total de 6 para **25 testes aprovados**, conforme [GitHub Actions #42543050313](https://github.com/LeandroAugFerreira/dashboard-financeiro/actions/runs/42543050313). O CI também executou [scripts/verify_generator.py](../scripts/verify_generator.py) em diretório descartável, reproduzindo o JSON e os CSV byte a byte e conferindo as cópias de CSV do site, sem alterar fontes.

Além de reconciliação 2025/2026, centros, meses, orçamento e ponto de equilíbrio, os testes encontraram uma falha na classificação **quando não há orçamento**: `null` era comparado numericamente com `0.9`. A correção identifica `Sem orçamento` se a margem não é negativa; margem negativa mantém classificação Alto. Os períodos com metas e suas regras originais foram preservados.

O anual 2026 é **Controlado** com aderência de ~105,69%; os meses janeiro, agosto e setembro têm classificação `Alto`, fevereiro `Atenção`. São **dados sintéticos**, não mudanças efetivas em empresas. [Evidências](recrutamento/EVIDENCIAS.md) e [estudo de caso](recrutamento/ESTUDO_DE_CASO.md).

**Não testado:** Power BI Desktop, DAX do PBIX original (ausente), Power Query, dados reais, SQL, fluxo de caixa e testes novos em navegador.
