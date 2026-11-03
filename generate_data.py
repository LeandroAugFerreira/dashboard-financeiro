"""Generate deterministic, entirely synthetic demo financial data; Python standard library."""
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP
import csv,json
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'dados';OUT.mkdir(exist_ok=True)
weights=[72,74,77,80,83,87,92,81,79,84,93,108]
centers={'Comercial':50,'Serviços':30,'Operações':20}
totals={2025:{'Receita Bruta':2250000000,'Deduções':225000000,'Custos':945000000,'Despesas':405000000,'Impostos':225000000},2026:{'Receita Bruta':2565000000,'Deduções':256500000,'Custos':1025550000,'Despesas':427312000,'Impostos':256387000}}
def allocate(total,weights):
 parts=[int((Decimal(total)*Decimal(w)/Decimal(sum(weights))).quantize(Decimal('1'),rounding=ROUND_HALF_UP)) for w in weights];parts[-1]+=total-sum(parts);return parts
movements=[];plans=[]
for year,values in totals.items():
 monthly={category:allocate(total,([1]*12 if category=='Despesas' else [78,80,80,83,87,93,100,96,88,86,98,106] if category=='Custos' else weights)) for category,total in values.items()}
 for month in range(1,13):
  amounts={category:allocate(parts[month-1],list(centers.values())) for category,parts in monthly.items()}
  for i,center in enumerate(centers):
   for category in values:
    movements.append({'id':len(movements)+1,'data':f'{year}-{month:02d}-01','centro':center,'categoria':category,'valor_centavos':amounts[category][i],'origem':'SINTETICO'})
   # Budget has independent revenue targets and a declared 25% net margin target.
   gross_target=allocate(2520000000 if year==2026 else 2400000000,[76,78,80,83,86,89,91,89,90,94,98,104])[month-1]
   net_target=allocate(gross_target*90//100,list(centers.values()))[i]
   plans.append({'data':f'{year}-{month:02d}-01','centro':center,'receita_liquida_meta_centavos':net_target,'lucro_meta_centavos':int((Decimal(net_target)/4).quantize(Decimal('1'),rounding=ROUND_HALF_UP)),'margem_meta':0.25,'origem':'SINTETICO'})
for name,rows in [('movimentacoes.csv',movements),('orcamento.csv',plans)]:
 with (OUT/name).open('w',encoding='utf-8',newline='') as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
(ROOT/'web/data.json').write_text(json.dumps({'movimentos':movements,'orcamento':plans,'synthetic':True},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'synthetic':True,'movements':len(movements),'budget_rows':len(plans)},ensure_ascii=False))
