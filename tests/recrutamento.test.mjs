import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calculate} from '../web/finance-model.mjs';

const load=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const data=load('../web/data.json');
const config=load('../web/config.json');
const movements=data.movimentos,budgets=data.orcamento;
const years=['2025','2026'];
const centers=['Comercial','Serviços','Operações'];
const categories=['Receita Bruta','Deduções','Custos','Despesas','Impostos'];
const months=Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0'));
const calc=(year='',month='',center='')=>calculate(data,{year,month,center});
const approx=(a,b,eps=1e-5)=>assert.ok(Math.abs(a-b)<=eps,String(a)+' difere de '+String(b));
const sumCent=(rows,key)=>rows.reduce((s,row)=>s+row[key],0);

test('fonte e estrutura: 360 lançamentos, 72 orçamentos e marca sintética explícita',()=>{
 assert.equal(data.synthetic,true);
 assert.equal(config.synthetic,true);
 assert.equal(movements.length,360);
 assert.equal(budgets.length,72);
 assert.deepEqual([...new Set(movements.map(r=>r.centro))].sort(),[...centers].sort());
 assert.deepEqual([...new Set(movements.map(r=>r.categoria))].sort(),[...categories].sort());
});

test('grade completa de ano/mês/centro/categoria tem exatamente uma linha',()=>{
 const keys=new Set(movements.map(r=>[r.data,r.centro,r.categoria].join('|')));
 assert.equal(keys.size,360);
 for(const year of years)for(const month of months)for(const center of centers)
  for(const category of categories)assert.ok(keys.has(year+'-'+month+'-01|'+center+'|'+category));
});

test('orçamento tem exatamente uma linha por ano/mês/centro',()=>{
 const keys=new Set(budgets.map(r=>r.data+'|'+r.centro));
 assert.equal(keys.size,72);
 for(const year of years)for(const month of months)for(const center of centers)
  assert.ok(keys.has(year+'-'+month+'-01|'+center));
});

test('identificadores, origem, centavos e metas são tipos estáveis',()=>{
 assert.deepEqual(movements.map(r=>r.id),Array.from({length:360},(_,i)=>i+1));
 for(const m of movements){
  assert.equal(m.origem,'SINTETICO');
  assert.ok(Number.isSafeInteger(m.valor_centavos)&&m.valor_centavos>=0);
  assert.match(m.data,/^202[56]-(0[1-9]|1[0-2])-01$/);
 }
 for(const p of budgets){
  assert.equal(p.origem,'SINTETICO');
  assert.ok(Number.isSafeInteger(p.lucro_meta_centavos));
  assert.ok(Number.isSafeInteger(p.receita_liquida_meta_centavos));
  assert.equal(p.margem_meta,.25);
 }
});

test('receita bruta de 2025 e de 2026 confere com a geração documentada',()=>{
 approx(calc('2025').gross,22500000);
 approx(calc('2026').gross,25650000);
 approx(calc().gross,48150000);
});

test('2025: bruto, líquido, resultado, margem e aderência são coerentes',()=>{
 const m=calc('2025');
 approx(m.gross,22500000);approx(m.net,20250000);approx(m.profit,4500000);
 approx(m.margin,4500000/20250000,1e-12);
 approx(m.planProfit,5400000.03);approx(m.adherence,4500000/5400000.03,1e-12);
 assert.equal(m.risk,'Alto');
});

test('2026: líquido, custo total, lucro e orçamento conferem',()=>{
 const m=calc('2026');
 approx(m.gross,25650000);approx(m.deductions,2565000);
 approx(m.net,23085000);approx(m.costs,10255500);
 approx(m.expenses,4273120);approx(m.taxes,2563870);
 approx(m.totalExpenses,17092490);approx(m.profit,5992510);
 approx(m.planRevenue,22679999.96);approx(m.planProfit,5670000.01);
});

test('o resultado sintético de 2026 não implica os 12 meses controlados',()=>{
 const m=calc('2026');
 assert.equal(m.risk,'Controlado');assert.ok(m.adherence>1);
 assert.deepEqual(months.filter(month=>calc('2026',month).risk==='Alto'),['01','08','09']);
 assert.equal(calc('2026','02').risk,'Atenção');
});

test('o total 2025-26 apresenta aderência inferior a 100%, sem apagar o risco anual',()=>{
 const all=calc(),previous=calc('2025'),current=calc('2026');
 approx(all.net,previous.net+current.net);
 approx(all.profit,previous.profit+current.profit);
 approx(all.planProfit,previous.planProfit+current.planProfit);
 assert.equal(all.risk,'Atenção');
});

test('12 meses recompõem cada ano, inclusive orçamento e componentes',()=>{
 for(const year of years){
  const base=calc(year);
  const parts=months.map(month=>calc(year,month));
  for(const key of ['rows','gross','deductions','costs','expenses','taxes','net','totalExpenses','profit','planRevenue','planProfit'])
   approx(parts.reduce((s,m)=>s+m[key],0),base[key],1e-5);
 }
});

test('3 centros recompõem cada ano inclusive orçamento',()=>{
 for(const year of years){
  const all=calc(year),parts=centers.map(center=>calc(year,'',center));
  for(const key of ['rows','gross','net','profit','totalExpenses','planRevenue','planProfit'])
   approx(parts.reduce((s,m)=>s+m[key],0),all[key],1e-5);
 }
});

test('base em centavos é reconciliada independentemente do cálculo JavaScript',()=>{
 for(const year of years){
  const rows=movements.filter(r=>r.data.startsWith(year));
  const c=category=>sumCent(rows.filter(r=>r.categoria===category),'valor_centavos')/100;
  const gross=c('Receita Bruta'),net=gross-c('Deduções'),expenses=c('Custos')+c('Despesas')+c('Impostos');
  const m=calc(year);
  approx(m.gross,gross);approx(m.net,net);
  approx(m.totalExpenses,expenses);approx(m.profit,net-expenses);
 }
});

test('margem orçada é 25%, independentemente do realizado',()=>{
 for(const year of years){
  const m=calc(year);
  approx(m.planMargin,m.planProfit/m.planRevenue,1e-12);
  approx(m.planMargin,.25,1e-7);
 }
});

test('aderência não equivale à margem nem ao orçamento de receita',()=>{
 const m=calc('2026');
 approx(m.adherence,m.profit/m.planProfit,1e-12);
 assert.ok(Math.abs(m.adherence-m.margin)>0.5);
 assert.ok(Math.abs(m.adherence-m.net/m.planRevenue)>0.01);
});

test('ponto de equilíbrio anual segue taxa de contribuição e despesa fixa hipotética',()=>{
 for(const year of years){
  const m=calc(year),contribution=1-(m.deductions+m.costs+m.taxes)/m.gross;
  assert.ok(contribution>0);
  approx(m.breakEven*contribution,m.expenses,1e-5);
  assert.ok(m.breakEven>0);
 }
});

test('filtro mensal seleciona período exato sem misturar centros',()=>{
 const january=calc('2026','01');
 const byCenter=centers.map(center=>calc('2026','01',center));
 assert.equal(january.rows,15);
 assert.deepEqual(byCenter.map(c=>c.rows),[5,5,5]);
 approx(byCenter.reduce((s,c)=>s+c.profit,0),january.profit,1e-5);
});

test('filtro sem dados não fabrica lucro, taxa ou ponto de equilíbrio',()=>{
 const m=calc('1999');
 assert.equal(m.rows,0);assert.equal(m.gross,0);assert.equal(m.profit,0);
 assert.equal(m.margin,null);assert.equal(m.adherence,null);
 assert.equal(m.planMargin,null);assert.equal(m.breakEven,null);
 assert.equal(m.risk,'Sem dados');
});

test('somente realizado sem orçamento não pode ser tratado como sucesso financeiro comprovado',()=>{
 const demo={...data,orcamento:[]};
 const m=calculate(demo,{year:'2026'});
 assert.equal(m.planProfit,0);
 assert.equal(m.adherence,null);
 // Sem referência orçada, a avaliação comparativa precisa ser indisponível.
 assert.equal(m.risk,'Sem orçamento');
});

test('centros, datas e categorias preservam a mesma estrutura entre os anos',()=>{
 for(const year of years){
  const period=movements.filter(r=>r.data.startsWith(year));
  assert.equal(period.length,180);
  for(const center of centers)assert.equal(period.filter(r=>r.centro===center).length,60);
  for(const cat of categories)assert.equal(period.filter(r=>r.categoria===cat).length,36);
 }
});
