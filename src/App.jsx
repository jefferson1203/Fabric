import { useState } from "react";
import "./App.css";

/* ─────────────── DESIGN TOKENS ─────────────── */
const C = {
  blue:"#1d4ed8", lBlue:"#dbeafe",
  teal:"#0f766e", lTeal:"#ccfbf1",
  purple:"#7c3aed", lPurple:"#ede9fe",
  amber:"#b45309", lAmber:"#fef3c7",
  red:"#b91c1c", lRed:"#fee2e2",
  green:"#15803d", lGreen:"#dcfce7",
  slate:"#334155", lSlate:"#f1f5f9",
  pink:"#be185d", lPink:"#fce7f3",
  indigo:"#3730a3", lIndigo:"#e0e7ff",
};

/* ─────────────── COMPAT ALIASES (v1 section data uses these names) ─────────────── */
/* ─────────────── NAV SECTIONS ─────────────── */
const SECTIONS = [
  { id:"home",       label:"Accueil",              icon:"🏠", group:"intro" },
  { id:"overview",   label:"Modèle de sécurité",   icon:"🏛️", group:"secu" },
  { id:"auth",       label:"Auth & Réseau",         icon:"🔐", group:"secu" },
  { id:"workspace",  label:"Workspace & Capacité",  icon:"🏢", group:"secu" },
  { id:"rls",        label:"RLS",                   icon:"↔️", group:"secu" },
  { id:"cls",        label:"CLS",                   icon:"📋", group:"secu" },
  { id:"ols",        label:"OLS",                   icon:"👁️", group:"secu" },
  { id:"ddm",        label:"Masquage DDM",          icon:"🎭", group:"secu" },
  { id:"onelake",    label:"OneLake Security",      icon:"🏔️", group:"secu" },
  { id:"purview",    label:"Purview",               icon:"🛡️", group:"gov" },
  { id:"catalogue",  label:"OneLake Catalog",       icon:"📚", group:"gov" },
  { id:"architecture",label:"Architecture",         icon:"🏗️", group:"arch" },
  { id:"deployment", label:"Ingestion & CI/CD",     icon:"🚀", group:"arch" },
  { id:"git",        label:"Git & Collaboration",   icon:"🌿", group:"arch" },
  { id:"pbiformats", label:"Formats PBI",           icon:"📄", group:"arch" },
  { id:"datastores", label:"Analytics Data Stores", icon:"🗄️", group:"ds" },
  { id:"transform",  label:"Design & Transform",    icon:"⚙️", group:"ds" },
  { id:"semantic",   label:"Semantic Models",       icon:"📐", group:"ds" },
  { id:"aiready",    label:"AI-Ready Data",         icon:"🤖", group:"ds" },
  { id:"secgov",     label:"Sécurité & Gouvernance",icon:"🔒", group:"ds" },
  { id:"optimization",label:"Optimisation Delta",   icon:"⚡", group:"perf" },
  { id:"activator",  label:"Activator",             icon:"🔔", group:"perf" },
  { id:"copilot",    label:"Copilot & AI",          icon:"🤖", group:"perf" },
  { id:"scenarios",  label:"Scénarios Sécurité",    icon:"🎯", group:"exam" },
  { id:"archi_scenarios",label:"Scénarios Archi",   icon:"🧠", group:"exam" },
  { id:"memo",       label:"Fiche Mémo",            icon:"📌", group:"exam" },
  { id:"pieges",     label:"Pièges & Erreurs",      icon:"⚠️", group:"exam" },
];

const GROUPS = {
  intro:  { label:"Introduction", color:C.slate },
  secu:   { label:"Sécurité",     color:C.blue },
  gov:    { label:"Gouvernance",  color:C.teal },
  arch:   { label:"Architecture", color:C.purple },
  perf:   { label:"Performance & IA", color:C.amber },
  exam:   { label:"Certification", color:C.red },
  ds:     { label:"Expert Data", color:C.pink },
};

/* ─────────────── SHARED COMPONENTS ─────────────── */
const T = ({ headers, rows }) => (
  <div style={{overflowX:"auto",marginBottom:"1rem"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
      <thead>
        <tr style={{background:"#f8fafc"}}>
          {headers.map((h,i)=><th key={i} style={{padding:"8px 12px",textAlign:"left",borderBottom:"2px solid #e2e8f0",color:"#374151",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row,i)=>(
          <tr key={i} style={{background:i%2===0?"#fff":"#f9fafb"}}>
            {row.map((cell,j)=><td key={j} style={{padding:"8px 12px",borderBottom:"1px solid #e5e7eb",verticalAlign:"top",color:"#374151",lineHeight:1.5}}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Code = ({ code }) => (
  <pre style={{background:"#0f172a",color:"#e2e8f0",padding:"1rem 1.25rem",borderRadius:8,fontSize:12.5,overflowX:"auto",lineHeight:1.7,margin:"0.75rem 0",fontFamily:"monospace"}}>
    <code>{code.trim()}</code>
  </pre>
);

const Card = ({ title, children, accent=C.blue, icon, noPad }) => (
  <div style={{border:"1px solid #e5e7eb",borderRadius:12,padding:noPad?"0":"1.25rem",marginBottom:"1rem",background:"#fff",borderLeft:`4px solid ${accent}`}}>
    {title&&<h3 style={{margin:"0 0 0.75rem",fontSize:15,fontWeight:600,color:"#111827",display:"flex",alignItems:"center",gap:8}}>
      {icon&&<span>{icon}</span>}{title}
    </h3>}
    {children}
  </div>
);

const Badge = ({ text, color="blue" }) => {
  const bg = C[`l${color.charAt(0).toUpperCase()+color.slice(1)}`]||C.lBlue;
  const fg = C[color]||C.blue;
  return <span style={{background:bg,color:fg,fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:999,letterSpacing:0.3,whiteSpace:"nowrap"}}>{text}</span>;
};

const Tip = ({ children }) => (
  <div style={{background:"#fefce8",border:"1px solid #fde047",borderRadius:8,padding:"0.75rem 1rem",margin:"0.75rem 0",fontSize:13.5}}>
    <span style={{fontWeight:700,color:"#854d0e"}}>💡 Exam Tip · </span>
    <span style={{color:"#713f12"}}>{children}</span>
  </div>
);

const Warn = ({ children }) => (
  <div style={{background:"#fff7ed",border:"1px solid #fdba74",borderRadius:8,padding:"0.75rem 1rem",margin:"0.75rem 0",fontSize:13.5}}>
    <span style={{fontWeight:700,color:"#c2410c"}}>⚠️ Attention · </span>
    <span style={{color:"#9a3412"}}>{children}</span>
  </div>
);

const Important = ({ children }) => (
  <div style={{background:"#eff6ff",border:"1px solid #93c5fd",borderRadius:8,padding:"0.75rem 1rem",margin:"0.75rem 0",fontSize:13.5}}>
    <span style={{fontWeight:700,color:C.blue}}>🔑 Point clé · </span>
    <span style={{color:"#1e40af"}}>{children}</span>
  </div>
);

const STitle = ({ children, sub }) => (
  <div style={{marginBottom:"1.5rem"}}>
    <h2 style={{fontSize:22,fontWeight:700,color:"#111827",margin:"0 0 4px",paddingBottom:"0.5rem",borderBottom:"2px solid #e5e7eb"}}>{children}</h2>
    {sub&&<p style={{color:"#6b7280",fontSize:14,margin:0,lineHeight:1.6}}>{sub}</p>}
  </div>
);



/* ─────────────── COMPAT ALIASES (placed after component defs to avoid hoisting issues) ─────────────── */
const colors = {
  blue:C.blue,   lightBlue:C.lBlue,
  teal:C.teal,   lightTeal:C.lTeal,
  purple:C.purple, lightPurple:C.lPurple,
  amber:C.amber, lightAmber:C.lAmber,
  red:C.red,     lightRed:C.lRed,
  green:C.green, lightGreen:C.lGreen,
  gray:"#374151", lightGray:"#f3f4f6",
};

function ScenarioCard({ scenario: s }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{border:"1px solid #e5e7eb",borderRadius:12,padding:"1.25rem",marginBottom:"1rem",background:"#fff",borderLeft:`4px solid ${C[s.color]||C.blue}`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"0.75rem"}}>
        <Badge text={`Q${s.id}`} color="blue"/>
        <Badge text={s.difficulty} color={s.color}/>
      </div>
      <p style={{fontSize:14,color:"#1f2937",marginBottom:"0.75rem",fontWeight:500,lineHeight:1.5}}>{s.question}</p>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:"0.75rem"}}>
        {s.options.map((opt,i)=>{
          let bg="#f9fafb",border="1px solid #e5e7eb",col="#374151";
          if(revealed){if(i===s.answer){bg="#dcfce7";border="1px solid #86efac";col="#15803d";}else if(selected===i){bg="#fee2e2";border="1px solid #fca5a5";col="#b91c1c";}}
          else if(selected===i){bg="#dbeafe";border="1px solid #93c5fd";col=C.blue;}
          return <button key={i} id={`scenario-q${s.id}-opt-${i}`} onClick={()=>!revealed&&setSelected(i)} style={{background:bg,border,borderRadius:6,padding:"8px 12px",cursor:revealed?"default":"pointer",textAlign:"left",fontSize:13,color:col,transition:"all 0.15s"}}>{opt}</button>;
        })}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button id={`scenario-q${s.id}-reveal-btn`} onClick={()=>setRevealed(true)} disabled={selected===null} style={{background:selected!==null?C.blue:"#d1d5db",color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",fontSize:13,cursor:selected!==null?"pointer":"not-allowed",fontWeight:600}}>Voir la réponse</button>
        <button id={`scenario-q${s.id}-reset-btn`} onClick={()=>{setSelected(null);setRevealed(false);}} style={{background:"transparent",border:"1px solid #d1d5db",borderRadius:6,padding:"6px 14px",fontSize:13,cursor:"pointer",color:"#6b7280"}}>Reset</button>
      </div>
      {revealed&&(
        <div style={{marginTop:"0.75rem",padding:"0.75rem 1rem",background:"#f0fdf4",borderRadius:8,border:"1px solid #bbf7d0"}}>
          <p style={{fontSize:13,color:"#166534",margin:"0 0 0.4rem",fontWeight:600}}>✅ {s.options[s.answer]}</p>
          <p style={{fontSize:13,color:"#166534",margin:s.code?"0 0 0.5rem":0,lineHeight:1.5}}>{s.explanation}</p>
          {s.code&&<Code code={s.code}/>}
        </div>
      )}
    </div>
  );
}

const scenarios = [
  {id:1,difficulty:"Facile",color:"green",question:"Les analystes financiers doivent voir toutes les colonnes SAUF 'Salaire' et 'BonusAnnuel'. Quelle solution ?",options:["A. Row-Level Security (RLS)","B. Column-Level Security (CLS) — DENY sur les colonnes sensibles","C. Dynamic Data Masking (DDM)","D. Object-Level Security (OLS)"],answer:1,explanation:"CLS via DENY sur les colonnes spécifiques. RLS filtre des lignes, DDM masque sans cacher, OLS cache des tables entières.",code:"DENY SELECT ON dbo.Employes(Salaire, BonusAnnuel) TO [AnalystesFinanciers];"},
  {id:2,difficulty:"Moyen",color:"amber",question:"Un Viewer voit TOUTES les données malgré une politique RLS. Quelle est la cause probable ?",options:["A. RLS ne fonctionne pas dans Fabric Warehouse","B. L'utilisateur est Admin ou Member — ces rôles bypasse RLS","C. La politique RLS n'est pas activée","D. RLS doit être configuré dans Power BI Desktop"],answer:1,explanation:"Les rôles Admin, Member et Contributor bypassent RLS et OneLake Security. Seuls les Viewers sont soumis aux contrôles granulaires."},
  {id:3,difficulty:"Moyen",color:"amber",question:"L'équipe dev teste avec des données réalistes sans voir les vrais numéros de carte. Quelle fonctionnalité ?",options:["A. Row-Level Security","B. Column-Level Security","C. Dynamic Data Masking (DDM)","D. Object-Level Security"],answer:2,explanation:"DDM remplace les valeurs par des masques sans supprimer la structure. Les développeurs voient le format, pas les vraies valeurs.",code:"ALTER TABLE dbo.Clients\nALTER COLUMN NumCarte ADD MASKED WITH (FUNCTION = 'partial(0,\"XXXX-XXXX-XXXX-\",4)');"},
  {id:4,difficulty:"Difficile",color:"red",question:"OneLake Security activé. Un Contributor peut-il lire les fichiers protégés par les OneLake Data Access Roles ?",options:["A. Non — les Contributors sont soumis aux OneLake Security Roles","B. Oui — Admin, Member et Contributor bypasse OneLake Security par défaut","C. Cela dépend de la configuration du tenant","D. Non — ils doivent avoir le rôle DefaultReader"],answer:1,explanation:"Admin, Member et Contributor bypassent OneLake Security Roles. Seuls les Viewers sont soumis aux contrôles granulaires."},
  {id:5,difficulty:"Difficile",color:"red",question:"Cacher la table 'DonnéesRH' entièrement — même les métadonnées invisibles. Quelle approche ?",options:["A. RLS avec filtre DAX renvoyant table vide","B. CLS avec DENY sur toutes les colonnes","C. Object-Level Security (OLS) dans le semantic model","D. DDM sur toutes les colonnes"],answer:2,explanation:"OLS cache tables et colonnes ENTIÈRES — même les métadonnées. CLS cache des colonnes mais le schéma reste visible, DDM masque des valeurs."},
  {id:6,difficulty:"Expert",color:"purple",question:"Analystes régionaux : seulement leur région, jamais 'MargeNette', numéros masqués. Combinaison optimale ?",options:["A. RLS uniquement avec des filtres complexes","B. RLS (filtrage région) + CLS (masquer MargeNette) + DDM (numéros de compte)","C. OLS + DDM seulement","D. Vue par région avec colonnes autorisées"],answer:1,explanation:"Defense in Depth : RLS pour les LIGNES par région, CLS pour interdire la COLONNE MargeNette, DDM pour masquer partiellement les numéros."},
];

/* ─────────────── QUIZ COMPONENT ─────────────── */
function Quiz({ qs }) {
  const [sel, setSel] = useState({});
  const [rev, setRev] = useState({});
  return (
    <div>
      {qs.map(q=>{
        const s=sel[q.id], r=rev[q.id];
        return (
          <Card key={q.id} accent={C[q.color]||C.blue}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"0.75rem"}}>
              <Badge text={`Q${q.id}`} color="blue"/>
              <Badge text={q.diff} color={q.color}/>
              {q.tag&&<Badge text={q.tag} color="slate"/>}
            </div>
            <p style={{fontSize:14,color:"#1f2937",marginBottom:"0.75rem",fontWeight:500,lineHeight:1.5}}>{q.q}</p>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:"0.75rem"}}>
              {q.opts.map((opt,i)=>{
                let bg="#f9fafb",border="1px solid #e5e7eb",col="#374151";
                if(r){if(i===q.ans){bg="#dcfce7";border="1px solid #86efac";col="#15803d";}else if(s===i){bg="#fee2e2";border="1px solid #fca5a5";col="#b91c1c";}}
                else if(s===i){bg="#dbeafe";border="1px solid #93c5fd";col=C.blue;}
                return <button key={i} id={`quiz-q${q.id}-opt-${i}`} onClick={()=>!r&&setSel(p=>({...p,[q.id]:i}))} style={{background:bg,border,borderRadius:6,padding:"8px 12px",cursor:r?"default":"pointer",textAlign:"left",fontSize:13,color:col,transition:"all 0.15s"}}>{opt}</button>;
              })}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button id={`quiz-q${q.id}-reveal-btn`} onClick={()=>s!==undefined&&setRev(p=>({...p,[q.id]:true}))} disabled={s===undefined} style={{background:s!==undefined?C.blue:"#d1d5db",color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",fontSize:13,cursor:s!==undefined?"pointer":"not-allowed",fontWeight:600}}>Voir la réponse</button>
              <button id={`quiz-q${q.id}-reset-btn`} onClick={()=>{setSel(p=>{const n={...p};delete n[q.id];return n;});setRev(p=>{const n={...p};delete n[q.id];return n;});}} style={{background:"transparent",border:"1px solid #d1d5db",borderRadius:6,padding:"6px 14px",fontSize:13,cursor:"pointer",color:"#6b7280"}}>Reset</button>
            </div>
            {r&&(
              <div style={{marginTop:"0.75rem",padding:"0.75rem 1rem",background:"#f0fdf4",borderRadius:8,border:"1px solid #bbf7d0"}}>
                <p style={{fontSize:13,color:"#166534",margin:"0 0 0.4rem",fontWeight:600}}>✅ {q.opts[q.ans]}</p>
                <p style={{fontSize:13,color:"#166534",margin:0,lineHeight:1.5}}>{q.exp}</p>
                {q.code&&<Code code={q.code}/>}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

/* ─────────────── QUIZ DATA ─────────────── */
const SECU_QS = [
  {id:1,diff:"Facile",color:"green",tag:"CLS",q:"Les analystes financiers doivent voir toutes les colonnes SAUF 'Salaire' et 'BonusAnnuel'. Quelle solution ?",opts:["A. Row-Level Security (RLS)","B. Column-Level Security (CLS) — DENY sur les colonnes sensibles","C. Dynamic Data Masking (DDM)","D. Object-Level Security (OLS)"],ans:1,exp:"CLS via DENY sur les colonnes spécifiques. RLS filtre des lignes, DDM masque sans cacher, OLS cache des tables entières.",code:"DENY SELECT ON dbo.Employes(Salaire, BonusAnnuel) TO [AnalystesFinanciers];"},
  {id:2,diff:"Moyen",color:"amber",tag:"RLS",q:"Un Viewer voit TOUTES les données malgré une politique RLS configurée. Quelle est la cause probable ?",opts:["A. RLS ne fonctionne pas dans Fabric Warehouse","B. L'utilisateur est Admin ou Member — ces rôles bypasse RLS","C. La politique RLS n'est pas activée","D. RLS doit être configuré dans Power BI Desktop uniquement"],ans:1,exp:"Les rôles Admin, Member et Contributor bypassent RLS. Seuls les Viewers et utilisateurs avec permission Read item-level sont soumis à RLS."},
  {id:3,diff:"Moyen",color:"amber",tag:"DDM",q:"L'équipe dev doit tester avec des données réalistes sans voir les vrais numéros de carte de crédit. Quelle fonctionnalité ?",opts:["A. Row-Level Security","B. Column-Level Security","C. Dynamic Data Masking (DDM)","D. Object-Level Security"],ans:2,exp:"DDM remplace les valeurs par des masques (ex: XXXX-1234) sans supprimer la structure. Les développeurs voient le format, pas les vraies valeurs.",code:"ALTER TABLE dbo.Clients\nALTER COLUMN NumCarte ADD MASKED WITH (FUNCTION = 'partial(0,\"XXXX-XXXX-XXXX-\",4)');"},
  {id:4,diff:"Difficile",color:"red",tag:"OneLake",q:"OneLake Security est activé sur un Lakehouse. Un utilisateur est Contributor. Peut-il lire les fichiers protégés par les OneLake Data Access Roles ?",opts:["A. Non — les Contributors sont soumis aux OneLake Security Roles","B. Oui — Admin, Member et Contributor bypasse OneLake Security par défaut","C. Cela dépend de la configuration du tenant","D. Non — ils doivent avoir le rôle DefaultReader"],ans:1,exp:"Admin, Member et Contributor bypassent OneLake Security Roles par défaut. Seuls les Viewers sont soumis aux contrôles granulaires."},
  {id:5,diff:"Difficile",color:"red",tag:"OLS",q:"Vous voulez cacher une table 'DonnéesRH' entièrement — même les métadonnées ne doivent pas être visibles. Quelle approche ?",opts:["A. RLS avec un filtre DAX qui renvoie une table vide","B. CLS avec DENY sur toutes les colonnes","C. Object-Level Security (OLS) dans le semantic model","D. DDM sur toutes les colonnes"],ans:2,exp:"OLS cache tables et colonnes ENTIÈRES — même les métadonnées (nom, schéma). RLS filtre des lignes, CLS cache des colonnes mais le schéma reste visible, DDM masque des valeurs."},
  {id:6,diff:"Expert",color:"purple",tag:"Defense in Depth",q:"COMPLET : Analystes régionaux (Europe/Asie/Amériques) ne voient que leur région, jamais la colonne 'MargeNette', numéros de compte masqués. Combinaison optimale ?",opts:["A. RLS uniquement avec des filtres complexes","B. RLS (filtrage par région) + CLS (masquer MargeNette) + DDM (numéros de compte)","C. OLS + DDM seulement","D. Créer une vue par région avec les colonnes autorisées"],ans:1,exp:"Defense in Depth : RLS pour les LIGNES par région, CLS pour interdire la COLONNE MargeNette, DDM pour masquer partiellement les numéros (format visible, valeur masquée)."},
];



/* ─────────────── HOME PAGE ─────────────── */
const HomePage = ({ onNav }) => (
  <div>
    <div style={{background:"linear-gradient(135deg,#1e3a8a,#1d4ed8 50%,#0f766e)",borderRadius:16,padding:"2.5rem 2rem",marginBottom:"1.5rem",color:"#fff"}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:"#93c5fd",marginBottom:8,textTransform:"uppercase"}}>Guide Ultime — Juin 2026</div>
      <h1 style={{fontSize:28,fontWeight:800,margin:"0 0 12px",lineHeight:1.2}}>Microsoft Fabric</h1>
      <p style={{color:"#bfdbfe",fontSize:15,margin:"0 0 20px",lineHeight:1.7}}>
        Sécurité · Gouvernance · Architecture · Ingestion · Performance · Activator · Copilot/IA<br/>
        Préparation complète DP-600 & DP-700
      </p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {[{label:"21 sections",icon:"📚"},{label:"18 scénarios certif",icon:"🎯"},{label:"Fiche mémo",icon:"📌"},{label:"Pièges classiques",icon:"⚠️"},{label:"Mis à jour juin 2026",icon:"🔄"}].map((b,i)=>(
          <span key={i} style={{background:"rgba(255,255,255,0.15)",borderRadius:6,padding:"4px 10px",fontSize:12,fontWeight:500}}>{b.icon} {b.label}</span>
        ))}
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginBottom:"1.5rem"}}>
      {Object.entries(GROUPS).filter(([k])=>k!=="intro").map(([k,g])=>{
        const secs = SECTIONS.filter(s=>s.group===k);
        return (
          <div key={k} id={`home-group-${k}`} style={{background:g.color+"0d",border:`1px solid ${g.color}30`,borderRadius:12,padding:"1rem",cursor:"pointer"}} onClick={()=>onNav(secs[0].id)}>
            <div style={{fontSize:12,fontWeight:700,color:g.color,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>{g.label}</div>
            {secs.map(s=>(
              <div key={s.id} id={`home-sec-link-${s.id}`} style={{fontSize:12,color:"#374151",padding:"2px 0",cursor:"pointer"}} onClick={e=>{e.stopPropagation();onNav(s.id);}}>{s.icon} {s.label}</div>
            ))}
          </div>
        );
      })}
    </div>

    <Card title="Les 3 niveaux de sécurité Fabric" accent={C.blue} icon="🛡️">
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {[
          {n:"Niveau 1",t:"Authentification",d:"Microsoft Entra ID — identité vérifiée avant tout accès",c:C.blue,i:"🪪"},
          {n:"Niveau 2",t:"Autorisation Fabric",d:"Workspace roles, item permissions, tenant settings",c:C.purple,i:"🏢"},
          {n:"Niveau 3",t:"Sécurité des données",d:"RLS, CLS, OLS, DDM, OneLake roles",c:C.teal,i:"🔒"},
        ].map((l,i)=>(
          <div key={i} style={{background:`${l.c}12`,border:`1px solid ${l.c}30`,borderRadius:10,padding:"1rem",textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:4}}>{l.i}</div>
            <div style={{fontSize:10,fontWeight:700,color:l.c,letterSpacing:1,marginBottom:3}}>{l.n}</div>
            <div style={{fontSize:13,fontWeight:600,color:"#111827",marginBottom:4}}>{l.t}</div>
            <div style={{fontSize:11,color:"#6b7280",lineHeight:1.4}}>{l.d}</div>
          </div>
        ))}
      </div>
      <Important>Admin, Member et Contributor bypassent RLS, CLS et OneLake Security. Seuls les Viewers et utilisateurs avec permission Read item-level sont soumis aux contrôles granulaires.</Important>
    </Card>

    <Card title="Les 7 workloads Fabric" accent={C.purple} icon="⚙️">
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8}}>
        {[
          {name:"Data Factory",desc:"Pipelines, Dataflows Gen2, Copy Job",icon:"🏭",c:C.blue},
          {name:"Data Engineering",desc:"Lakehouses, Notebooks, Spark",icon:"⚒️",c:C.teal},
          {name:"Data Warehouse",desc:"Warehouse T-SQL, SQL endpoint",icon:"🏦",c:C.purple},
          {name:"Data Science",desc:"ML, expériences, modèles",icon:"🔬",c:C.green},
          {name:"Real-Time Intel.",desc:"Eventstream, Eventhouse, KQL",icon:"⚡",c:C.amber},
          {name:"Power BI",desc:"Semantic models, rapports, apps",icon:"📊",c:C.red},
          {name:"Fabric IQ (preview)",desc:"Agents, Ontology, Copilot",icon:"🤖",c:C.indigo},
        ].map((w,i)=>(
          <div key={i} style={{background:`${w.c}10`,border:`1px solid ${w.c}25`,borderRadius:8,padding:"0.75rem",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:4}}>{w.icon}</div>
            <div style={{fontSize:12,fontWeight:600,color:"#111827",marginBottom:3}}>{w.name}</div>
            <div style={{fontSize:11,color:"#6b7280",lineHeight:1.3}}>{w.desc}</div>
          </div>
        ))}
      </div>
    </Card>

    <Card title="Architecture OneLake — 1 lake, N workloads" accent={C.teal} icon="🏔️">
      <div style={{background:"#f8fafc",borderRadius:8,padding:"1rem",fontFamily:"monospace",fontSize:12,lineHeight:2,color:"#374151"}}>
        <div style={{color:C.teal,fontWeight:700,marginBottom:4}}>OneLake (Azure Data Lake Storage Gen2)</div>
        <div style={{paddingLeft:16}}>📁 Tenant → Workspace → Lakehouse / Warehouse / KQL DB</div>
        <div style={{paddingLeft:16}}>🔗 Shortcuts → ADLS, S3, GCS, autres Lakehouses (sans copie)</div>
        <div style={{paddingLeft:16}}>🔄 Mirroring → Azure SQL, Snowflake, CosmosDB (réplication continue)</div>
        <div style={{paddingLeft:16}}>🔒 Security → Workspace roles + OneLake Data Access Roles + RLS/CLS</div>
        <div style={{paddingLeft:16}}>📋 Governance → Sensitivity labels, Lineage, Endorsement (OneLake Catalog)</div>
      </div>
    </Card>
  </div>
);

/* ─────────────── OPTIMIZATION SECTION ─────────────── */
const OptimizationSection = () => (
  <div>
    <STitle sub="V-Order, OPTIMIZE, VACUUM, Z-Order, Liquid Clustering — maîtriser la maintenance Delta pour les examens DP-700 et DP-600.">⚡ Optimisation des tables Delta</STitle>

    <Card title={`Les 5 leviers d'optimisation Delta dans Fabric`} accent={C.amber} icon="🎛️">
      <T headers={["Levier","Objectif","Quand l'utiliser"]}
         rows={[
           ["V-Order","Optimise le layout des fichiers Parquet pour des lectures plus rapides par tous les moteurs Fabric","Activer sur toutes les tables Gold (surtout Direct Lake). Désactivé par défaut en Spark pour les nouveaux workspaces, activé par défaut dans Warehouse."],
           ["OPTIMIZE (compaction)","Consolide les petits fichiers en gros fichiers optimaux (cible ~128MB–1GB)","Après des ingestions fréquentes par append qui créent beaucoup de petits fichiers"],
           ["VACUUM","Supprime les anciens fichiers de données déréférencés par le log Delta","Planifier hebdomadairement. Défaut de rétention : 7 jours (168h). Ne jamais descendre sous 7 jours si Time Travel actif."],
           ["Z-Order","Colocalise les données connexes dans les mêmes fichiers (skipping de fichiers)","Tables partitionnées avec filtres sélectifs sur 2+ colonnes. Non compatible avec Liquid Clustering."],
           ["Liquid Clustering","Organisation flexible, peut changer les colonnes sans réécriture totale","Nouvelles tables, colonnes de clustering qui évoluent, tables non partitionnées"],
         ]}
      />
      <Warn>OPTIMIZE et VACUUM s'exécutent via Spark (Notebooks, Spark Job Definition, ou UI Maintenance du Lakehouse). Ils ne sont PAS supportés dans le SQL Analytics Endpoint ni dans le Warehouse SQL Editor.</Warn>
    </Card>

    <Card title="V-Order — Comprendre le comportement par workload" accent={C.blue} icon="📐">
      <T headers={["Workload/Context","V-Order activé par défaut ?","Irréversible ?"]}
         rows={[
           ["Fabric Warehouse","✅ Oui — activé et ne peut pas être désactivé","⚠️ Oui — irréversible dans Warehouse"],
           ["Spark (nouveaux workspaces F SKU)","❌ Non — désactivé par défaut depuis 2025","Non, configurable par session ou table"],
           ["Spark (anciens workspaces / Runtime 1.3)","✅ Oui — activé par défaut","Non"],
           ["Dataflow Gen2","✅ Oui — activé lors de l'écriture","Non"],
         ]}
      />
      <Code code={`-- Activer V-Order sur une table existante (Spark SQL)
ALTER TABLE gold.Ventes SET TBLPROPERTIES ('delta.parquet.vorder.enabled' = 'true');

-- Activer V-Order lors de l'écriture (PySpark)
df.write.format("delta").option("parquet.vorder.enabled","true").saveAsTable("gold.Ventes")

-- Forcer V-Order pour la session Spark
spark.conf.set("spark.sql.parquet.vorder.enabled","true")`}/>
      <Tip>Exam DP-700 : V-Order désactivé par défaut en Spark pour les nouveaux workspaces. Irréversible dans Warehouse. Ces deux points sont des questions fréquentes.</Tip>
    </Card>

    <Card title="OPTIMIZE, Z-Order & Liquid Clustering" accent={C.teal} icon="🔧">
      <Code code={`-- OPTIMIZE simple (compaction de petits fichiers)
OPTIMIZE schema.table_name;

-- OPTIMIZE + Z-ORDER (colocalisation sur colonnes de filtre)
OPTIMIZE gold.Ventes ZORDER BY (Region, DateVente);

-- Liquid Clustering — définition à la création
CREATE TABLE gold.Transactions (
    TxID INT, ClientID INT, Montant DECIMAL(10,2), DateTx DATE
) CLUSTER BY (ClientID, DateTx);

-- Changer les colonnes de clustering (sans réécriture totale)
ALTER TABLE gold.Transactions CLUSTER BY (Region, DateTx);

-- OPTIMIZE incrémental (seulement la partition d'aujourd'hui)
OPTIMIZE gold.Ventes WHERE DateVente = current_date();`}/>
      <T headers={["Comparaison","Partitionnement","Z-Order","Liquid Clustering"]}
         rows={[
           ["Flexibilité","Faible — changer = réécriture totale","Moyenne — dépend des partitions","Haute — changer sans réécriture"],
           ["Compatibilité","Compatible Z-Order","Requiert partitionnement","Incompatible avec partitionnement"],
           ["File skipping","Par partition (grosse granularité)","Par fichier dans partition","Par fichier (fine granularité)"],
           ["Recommandé pour","Tables avec fort volume + filtres date","Tables partitionnées legacy","Nouvelles tables, requêtes multi-colonnes"],
         ]}
      />
    </Card>

    <Card title="VACUUM — Stratégie de rétention" accent={C.purple} icon="🗑️">
      <Code code={`-- VACUUM avec rétention 7 jours (défaut)
VACUUM gold.Ventes RETAIN 168 HOURS;

-- VACUUM avec rétention courte (attention : désactive Time Travel)
-- NE PAS faire sans vérification de la rétention Delta log
VACUUM gold.Ventes RETAIN 24 HOURS;  -- Dangereux !

-- Vérifier les fichiers qui seraient supprimés (dry run)
VACUUM gold.Ventes RETAIN 168 HOURS DRY RUN;`}/>
      <Warn>Ne jamais définir une rétention VACUUM inférieure à 7 jours si Time Travel ou Incremental Refresh est actif. La rétention VACUUM interagit avec le versioning Delta log.</Warn>
      <T headers={["Scénario","Rétention recommandée","Raison"]}
         rows={[
           ["Tables Bronze (ingestion fréquente)","168h (7 jours)","Audit trail minimal requis"],
           ["Tables Gold (Direct Lake + Incremental Refresh)","168h–336h (7–14 jours)","Direct Lake utilise le framing Delta — garder des snapshots récents"],
           ["Tables avec compliance/audit","720h+ (30 jours)","Traçabilité des modifications"],
         ]}
      />
    </Card>

    <Card title="Stratégie de maintenance par couche Médaillon" accent={C.green} icon="📋">
      <T headers={["Couche","V-Order","OPTIMIZE","VACUUM","Z-Order / Liquid Clustering","Fréquence"]}
         rows={[
           ["Bronze","❌ Non (write-heavy)","Hebdomadaire (petits fichiers)","Hebdomadaire 168h","Pas nécessaire","Faible priorité"],
           ["Silver","⚠️ Optionnel","Quotidien si volumes élevés","Hebdomadaire 168h","Liquid Clustering sur colonnes de jointure","Modérée"],
           ["Gold","✅ Obligatoire (Direct Lake)","Après chaque chargement","Hebdomadaire 168h+","Liquid Clustering sur colonnes de filtre PBI","Haute priorité"],
         ]}
      />
      <Tip>Gold tables consommées par Direct Lake = V-Order obligatoire. OPTIMIZE doit être planifié après le chargement Gold, avant le Semantic Model Refresh.</Tip>
    </Card>
  </div>
);

/* ─────────────── ACTIVATOR SECTION ─────────────── */
const ActivatorSection = () => (
  <div>
    <STitle sub={`Le moteur de détection d'événements et d'automatisation de Fabric — surveiller, détecter, agir.`}>🔔 Fabric Activator</STitle>

    <Card title={`Qu'est-ce que Fabric Activator ?`} accent={C.red} icon="🔔">
      <p style={{fontSize:14,color:"#374151",marginBottom:"0.75rem",lineHeight:1.6}}>
        Activator est un <strong>moteur de détection d'événements no-code</strong> qui surveille des flux de données en continu et déclenche des actions automatiques quand des conditions sont remplies. Il est au cœur de la stack Real-Time Intelligence de Fabric.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8,marginBottom:"0.75rem"}}>
        {[
          {step:"1. Sources",desc:"Eventstream, Power BI visuals, Warehouse SQL queries",c:C.blue},
          {step:"2. Objets",desc:"Entités suivies (ex: capteur IoT, commande, KPI)",c:C.teal},
          {step:"3. Règles",desc:"Conditions : seuil, transition d'état, absence de données",c:C.purple},
          {step:"4. Actions",desc:"Email, Teams, Power Automate, Pipeline, Notebook",c:C.amber},
        ].map((s,i)=>(
          <div key={i} style={{background:`${s.c}10`,border:`1px solid ${s.c}30`,borderRadius:8,padding:"0.75rem",textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:700,color:s.c,marginBottom:4}}>{s.step}</div>
            <div style={{fontSize:12,color:"#374151",lineHeight:1.4}}>{s.desc}</div>
          </div>
        ))}
      </div>
    </Card>

    <Card title="Sources de données supportées" accent={C.blue} icon="📥">
      <T headers={["Source","Description","Status"]}
         rows={[
           ["Eventstream","Flux temps réel (IoT Hub, Event Hub, Kafka, HTTP...)","✅ GA"],
           ["Power BI report visuals","Détecter quand une mesure dépasse un seuil dans un rapport publié","✅ GA"],
           ["Warehouse SQL query rules","Surveiller les résultats d'une requête SQL planifiée","🔵 Preview (mars 2026)"],
           ["Mirrored Database Change Feed","Flux CDC depuis Azure SQL, CosmosDB, Snowflake, PostgreSQL...","🔵 Preview (avril 2026)"],
           ["Azure Blob Storage events","Détecter l'arrivée de nouveaux fichiers","✅ GA"],
         ]}
      />
    </Card>

    <Card title="Types de règles (Rule conditions)" accent={C.teal} icon="📏">
      <T headers={["Type de règle","Déclenchement","Exemple"]}
         rows={[
           ["Seuil simple (threshold)","Valeur hors plage (seuil)","Température > 30°C"],
           ["BECOMES","Transition d'état : était faux, devient vrai","Stock passe sous le seuil réapprovisionnement"],
           ["INCREASES / DECREASES","La valeur augmente/diminue de N% entre deux observations","CA diminue de plus de 10% par rapport à hier"],
           ["EXIT RANGE","La valeur sort d'une plage définie","Tension hors de [220V, 240V]"],
           ["Heartbeat (absence)","Aucun événement reçu dans un délai donné","Capteur n'envoie plus de données depuis 5 min"],
         ]}
      />
      <Important>Activator gère l'état par objet — il ne déclenchera pas une alerte à chaque événement mais uniquement lors d'une transition de condition (edge-based), évitant le spam d'alertes.</Important>
    </Card>

    <Card title="Actions disponibles" accent={C.purple} icon="⚡">
      <T headers={["Action","Description","Status"]}
         rows={[
           ["Email","Envoyer un email à un ou plusieurs destinataires","✅ GA"],
           ["Teams notification","Envoyer un message dans un canal Teams","✅ GA"],
           ["Power Automate flow","Déclencher un workflow Power Automate","✅ GA"],
           ["Fabric Pipeline","Lancer un Data Factory Pipeline (ex: recharger une table)","✅ GA"],
           ["Notebook","Exécuter un Notebook Spark (ex: corriger une anomalie data)","✅ GA"],
           ["Spark Job Definition","Soumettre un job batch/streaming Spark","✅ GA"],
           ["Dataflow","Déclencher un refresh Dataflow Gen2","🔵 Preview"],
           ["User Data Function","Exécuter une fonction custom business logic","🔵 Preview"],
         ]}
      />
    </Card>

    <Card title={`Scénarios types d'Activator`} accent={C.green} icon="💡">
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[
          {scenario:"IoT Temperature Monitor",desc:"Eventstream reçoit des données de capteurs → Activator détecte temp > seuil → Email au technicien + Pipeline pour logguer l'incident",color:C.red},
          {scenario:"KPI Power BI Alert",desc:"CA région < objectif mensuel → Notification Teams au directeur régional automatiquement lors du refresh du rapport",color:C.amber},
          {scenario:"Ingestion event-driven",desc:"Nouveau fichier arrive dans Azure Blob → Activator déclenche un Pipeline pour l'ingérer dans le Lakehouse Bronze immédiatement",color:C.blue},
          {scenario:"Qualité des données",desc:"Warehouse SQL query détecte des lignes NULL > 5% → Activator lance un Notebook de nettoyage + alerte l'équipe DQ",color:C.purple},
          {scenario:"Mirrored CDC → temps réel",desc:"Changement dans Azure SQL (INSERT/UPDATE/DELETE) → Change Feed → Eventstream → Activator → action métier immédiate (ex: notifications clients)",color:C.teal},
        ].map((s,i)=>(
          <div key={i} style={{padding:"0.75rem",background:"#f9fafb",borderRadius:8,borderLeft:`3px solid ${s.color}`}}>
            <div style={{fontWeight:600,fontSize:13,color:"#111827",marginBottom:3}}>{s.scenario}</div>
            <div style={{fontSize:12,color:"#6b7280",lineHeight:1.5}}>{s.desc}</div>
          </div>
        ))}
      </div>
      <Tip>DP-700 : Activator = "watchdog" event-driven. Différent d'un Pipeline planifié. Pour des actions déclenchées par des conditions de données en temps réel → Activator. Pour des workflows batch périodiques → Pipeline avec scheduler.</Tip>
    </Card>
  </div>
);

/* ─────────────── COPILOT / AI SECTION ─────────────── */
const CopilotSection = () => (
  <div>
    <STitle sub={`Copilot intégré dans tous les workloads, Data Agents, Fabric IQ — l'IA au cœur de la plateforme data.`}>🤖 Copilot & IA dans Microsoft Fabric</STitle>

    <Card title="Prérequis pour Copilot" accent={C.indigo} icon="🔑">
      <T headers={["Prérequis","Détail"]}
         rows={[
           ["Capacité Fabric","F2 minimum ou Power BI Premium P1 — Trial SKU ne supporte PAS Copilot"],
           ["Licence utilisateur","Power BI Pro ou PPU seuls ne suffisent pas — capacité organisationnelle requise"],
           ["Région supportée","Si hors US/France, activer le paramètre cross-geo data processing dans le tenant admin"],
           ["Sovereign clouds","Azure Government et autres clouds souverains : support limité ou indisponible"],
           ["Activation tenant","L'admin Fabric doit activer Copilot dans les tenant settings"],
         ]}
      />
      <Warn>Un Trial SKU (60 jours gratuits) ne supporte pas Copilot. Une capacité F2+ achetée est requise. C'est un piège fréquent aux examens.</Warn>
    </Card>

    <Card title="Copilot par workload" accent={C.blue} icon="🤖">
      <T headers={["Workload","Copilot disponible ?","Ce que fait Copilot","Status"]}
         rows={[
           ["Notebooks (Data Engineering/Science)","✅","Génération de code PySpark/SQL, explication de code, débogage, complétion contextuelle","Preview"],
           ["Power BI / Semantic Models","✅","Génération de rapports depuis description NL, création de mesures DAX, Q&A sur les données","Preview"],
           ["Data Factory (Pipelines)","✅","Suggestion d'activités, explication d'erreurs pipeline, Error Insights Summary","Preview"],
           ["Data Warehouse","✅","Génération de requêtes T-SQL, explication de résultats, création de vues","Preview"],
           ["Real-Time Intelligence","✅","Génération de requêtes KQL, aide à la configuration Eventstream","Preview"],
           ["OneLake Catalog","✅","Exploration data en langage naturel via Fabric IQ","Preview"],
         ]}
      />
    </Card>

    <Card title="Fabric IQ (Preview) — La couche intelligence unifiée" accent={C.indigo} icon="🧠">
      <p style={{fontSize:14,color:"#374151",marginBottom:"0.75rem",lineHeight:1.6}}>
        Fabric IQ est un nouveau workload (preview, Build 2026) qui unifie le contexte métier de l'organisation pour alimenter les agents IA et les copilots.
      </p>
      <T headers={["Composant","Description"]}
         rows={[
           ["Ontology (preview)","Modèle sémantique structuré des entités métier — alimente les agents IA avec le contexte organisationnel"],
           ["Data Agent","Agent IA qui répond aux questions en langage naturel sur les données Lakehouse, Warehouse, Semantic Model, Eventhouse"],
           ["Operations Agent","Agent proactif qui monitore et déclenche des actions automatiques sur les données"],
           ["Fabric Graph","Connecte les entités OneLake pour navigation et exploration contextuelle"],
           ["Semantic Model + Ontology","Les semantic models existants génèrent des ontologies pour assurer la cohérence du vocabulaire métier"],
         ]}
      />
      <div style={{background:C.lIndigo,borderRadius:8,padding:"0.875rem",marginTop:"0.75rem",border:`1px solid ${C.indigo}30`}}>
        <div style={{fontWeight:600,fontSize:12,color:C.indigo,marginBottom:6}}>🔗 Intégrations Fabric IQ</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12,color:"#374151"}}>
          {["Microsoft Foundry (multi-agent orchestration)","Copilot Studio (embed agents dans Teams, web apps)","Microsoft 365 Copilot (Outlook, Excel, Teams)","Power BI Q&A enrichie avec contexte ontologie","Activator (déclencher des actions depuis agents)","OneLake (source de données unifiée pour tous les agents)"].map((s,i)=>(
            <div key={i} style={{padding:"4px 8px",background:"#fff",borderRadius:6,border:`1px solid ${C.indigo}20`}}>• {s}</div>
          ))}
        </div>
      </div>
    </Card>

    <Card title="Fonctions IA natives dans le Warehouse (T-SQL)" accent={C.teal} icon="🔬">
      <Code code={`-- Analyse de sentiments (texte)
SELECT
    ReviewText,
    ai_analyze_sentiment(ReviewText) AS Sentiment,
    ai_extract_key_phrases(ReviewText) AS KeyPhrases
FROM dbo.CustomerReviews;

-- Classification de texte
SELECT
    Description,
    ai_classify_text(Description, ['Complaint', 'Compliment', 'Question']) AS Category
FROM dbo.SupportTickets;

-- Génération de texte (résumé)
SELECT
    ClientID,
    ai_generate_text('Résume ce historique client en 2 phrases: ' + History) AS Summary
FROM dbo.ClientHistory;`}/>
      <Important>Ces fonctions AI native dans Warehouse (preview mars 2026) permettent d'exécuter des opérations ML/NLP directement en T-SQL sans quitter le Warehouse — utile pour l'enrichissement de données Gold.</Important>
    </Card>

    <Card title="Data Science — Cycle ML complet dans Fabric" accent={C.purple} icon="🔬">
      <T headers={["Étape","Outil Fabric","Description"]}
         rows={[
           ["Exploration","Notebooks + Lakehouse","EDA avec PySpark, pandas, matplotlib sur données OneLake"],
           ["Préparation","Notebooks + Delta tables","Feature engineering, nettoyage, encodage → Silver/Gold"],
           ["Expérimentation","MLflow intégré","Tracking des métriques, hyperparamètres, artefacts de modèle"],
           ["Entraînement","Notebooks Spark (CPU/GPU)","Scikit-learn, PyTorch, TensorFlow, XGBoost sur Spark"],
           ["Enregistrement","MLflow Model Registry","Versioning des modèles, promotion Staging → Production"],
           ["Déploiement","Fabric Real-Time Inference Endpoint","Exposer un modèle comme endpoint REST depuis Fabric"],
           ["Consommation","Notebooks / Pipelines / Power BI","Prédictions en batch (Notebook) ou temps réel (endpoint)"],
         ]}
      />
    </Card>
  </div>
);

/* ─────────────── MEMO SECTION ─────────────── */
const MemoSection = () => (
  <div>
    <STitle sub="Les raccourcis mentaux essentiels à avoir en tête pour les examens DP-600 et DP-700.">📌 Fiche Mémo — Certification DP-600 / DP-700</STitle>

    <Card title={`Règle d'or : Bypass de sécurité`} accent={C.red} icon="🚨">
      <div style={{background:"#fff1f2",borderRadius:8,padding:"1rem",border:"1px solid #fecdd3",fontSize:13,color:"#881337"}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:8}}>TOUJOURS mémoriser :</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {["Admin ⟹ bypass RLS, CLS, DDM, OneLake Security","Member ⟹ bypass RLS, CLS, DDM, OneLake Security","Contributor ⟹ bypass RLS, CLS, DDM, OneLake Security","Viewer ⟹ SOUMIS à RLS, CLS, DDM, OneLake Security","Item-level Read ⟹ SOUMIS aux contrôles granulaires","UNMASK permission ⟹ bypass DDM"].map((s,i)=>(
            <div key={i} style={{padding:"4px 8px",background:i<3?"#ffe4e6":"#dcfce7",borderRadius:5,fontWeight:i<3?600:400}}>{s}</div>
          ))}
        </div>
      </div>
    </Card>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1rem"}}>
      {[
        {t:"Quand utiliser RLS",c:C.blue,items:["Filtrer des lignes selon l'utilisateur","Segmentation par région/département","1 rapport pour N profils utilisateurs","Warehouse ou Semantic Model PBI"]},
        {t:"Quand utiliser CLS",c:C.teal,items:["Colonnes Salaire, SSN, données sensibles","Interdire l'accès (pas juste masquer)","T-SQL GRANT/DENY dans Warehouse","Complémentaire à RLS"]},
        {t:"Quand utiliser OLS",c:C.purple,items:["Cacher une TABLE entière du modèle","Même les métadonnées invisibles","Via Tabular Editor / XMLA","Semantic Model Power BI uniquement"]},
        {t:"Quand utiliser DDM",c:C.amber,items:["Masquer des valeurs (format visible)","Environnement dev/test avec données réalistes","Numéros partiels (last 4 digits)","NE PAS utiliser comme vraie sécurité"]},
      ].map((box,i)=>(
        <div key={i} style={{background:`${box.c}0d`,border:`1px solid ${box.c}30`,borderRadius:10,padding:"0.875rem"}}>
          <div style={{fontWeight:700,fontSize:13,color:box.c,marginBottom:8}}>{box.t}</div>
          {box.items.map((s,j)=><div key={j} style={{fontSize:12,color:"#374151",marginBottom:3}}>✓ {s}</div>)}
        </div>
      ))}
    </div>

    <Card title="Arbre de décision ingestion / transformation" accent={C.teal} icon="🌳">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:13}}>
        {[
          {q:"Source OLTP → temps réel dans Fabric",r:"→ Mirroring",c:C.teal},
          {q:"Données externes sans copie physique",r:"→ Shortcut",c:C.green},
          {q:"200+ sources, low-code, batch",r:"→ Dataflow Gen2",c:C.blue},
          {q:"Orchestration multi-étapes complexe",r:"→ Pipeline Data Factory",c:C.purple},
          {q:"Transformations Spark/ML/Delta MERGE",r:"→ Notebook PySpark",c:C.amber},
          {q:"Ingestion streaming IoT/Kafka",r:"→ Eventstream → Eventhouse",c:C.red},
          {q:"CDC incrémental simple, sans Pipeline lourd",r:"→ Copy Job (CDC mode)",c:C.teal},
          {q:"Sync streaming avec actions automatiques",r:"→ Mirrored Change Feed + Activator",c:C.indigo},
        ].map((item,i)=>(
          <div key={i} style={{padding:"0.6rem",background:"#f9fafb",borderRadius:8,borderLeft:`3px solid ${item.c}`}}>
            <div style={{fontSize:11,color:"#6b7280"}}>{item.q}</div>
            <div style={{fontSize:13,fontWeight:700,color:item.c}}>{item.r}</div>
          </div>
        ))}
      </div>
    </Card>

    <Card title="Arbre de décision stockage / architecture" accent={C.purple} icon="🏗️">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:13}}>
        {[
          {q:"Équipe T-SQL/BI, pas de Spark ni ML",r:"→ Warehouse (Gold)",c:C.blue},
          {q:"Équipe Spark/Python/ML",r:"→ Lakehouse",c:C.teal},
          {q:"Isolation sécurité par couche Médaillon",r:"→ 1 Workspace par couche (Bronze/Silver/Gold)",c:C.red},
          {q:"Dev → Test → Prod automatisé",r:"→ Deployment Pipelines + Git",c:C.purple},
          {q:"Endorsement items pour toute l'org",r:"→ Certified (via OneLake Catalog)",c:C.green},
          {q:"Lineage bout en bout",r:"→ OneLake Catalog > onglet Lineage",c:C.amber},
          {q:"Refresh PBI Direct Lake + performance",r:"→ V-Order + OPTIMIZE Gold avant refresh",c:C.teal},
          {q:"Actions auto sur données (alertes)",r:"→ Activator (no-code event detection)",c:C.red},
        ].map((item,i)=>(
          <div key={i} style={{padding:"0.6rem",background:"#f9fafb",borderRadius:8,borderLeft:`3px solid ${item.c}`}}>
            <div style={{fontSize:11,color:"#6b7280"}}>{item.q}</div>
            <div style={{fontSize:13,fontWeight:700,color:item.c}}>{item.r}</div>
          </div>
        ))}
      </div>
    </Card>

    <Card title="Commandes T-SQL critiques à connaître" accent={C.slate} icon="💻">
      <Code code={`-- RLS : créer une politique de sécurité
CREATE SECURITY POLICY dbo.RegionFilter
ADD FILTER PREDICATE dbo.fn_RLS_Region(Region) ON dbo.Ventes
WITH (STATE = ON);

-- CLS : interdire une colonne
DENY SELECT ON dbo.Employes(Salaire) TO [AnalystesFinanciers];

-- DDM : ajouter un masque
ALTER TABLE dbo.Clients
ALTER COLUMN NumCarte ADD MASKED WITH (FUNCTION = 'partial(0,"XXXX-",4)');

-- DDM : accorder le droit de voir les vraies valeurs
GRANT UNMASK ON dbo.Clients(NumCarte) TO [AdminFinance];

-- Tester RLS sous une autre identité
EXECUTE AS USER = 'analyste@entreprise.com';
SELECT * FROM dbo.Ventes;
REVERT;

-- Delta : maintenance Gold
OPTIMIZE gold.Ventes;
VACUUM gold.Ventes RETAIN 168 HOURS;`}/>
    </Card>
  </div>
);

/* ─────────────── PIEGES SECTION ─────────────── */
const PiegesSection = () => (
  <div>
    <STitle sub="Les erreurs les plus fréquentes aux examens DP-600 et DP-700 — et comment les éviter.">⚠️ Pièges classiques & Points critiques</STitle>

    {[
      {
        cat:"Sécurité", color:C.red,
        items:[
          {p:"❌ Piège","t":"Admin/Member/Contributor bypass tout","d":"Ces 3 rôles contournent RLS, CLS, OneLake Security, et DDM. Pour tester la sécurité, utiliser un compte Viewer ou un utilisateur avec item-level Read uniquement."},
          {p:"❌ Piège","t":"DDM = vraie sécurité","d":"DDM masque visuellement les données mais un utilisateur avec UNMASK ou des droits admin voit les vraies valeurs. DDM = obfuscation, pas sécurité. Combiner avec CLS pour vraiment protéger."},
          {p:"❌ Piège","t":"OLS dans Warehouse = idem Semantic Model","d":"OLS (Object-Level Security) dans Power BI/Semantic Model ≠ OneLake OLS. Dans Warehouse, utiliser CLS (DENY) pour interdire des colonnes. OLS ne s'applique qu'au modèle sémantique."},
          {p:"❌ Piège","t":"UNMASK = accès global","d":"GRANT UNMASK TO permet de voir toutes les colonnes masquées. GRANT UNMASK ON table(colonne) TO est le grant granulaire sur une seule colonne."},
          {p:"❌ Piège","t":"Direct Lake on SQL = pas de fallback DirectQuery","d":"Direct Lake on OneLake n'a pas de fallback DirectQuery. Direct Lake on SQL endpoint PEUT tomber en DirectQuery si la source est une vue SQL (pas une table Delta)."},
        ]
      },
      {
        cat:"Architecture & Ingestion", color:C.purple,
        items:[
          {p:"❌ Piège","t":"Shortcut = Mirroring","d":"Shortcut = lien virtuel, pas de copie, accès temps réel. Mirroring = réplication continue physique dans OneLake. Un Shortcut vers Azure SQL n'existe pas — utiliser Mirroring."},
          {p:"❌ Piège","t":"SQL Analytics Endpoint = Warehouse","d":"Le SQL Analytics Endpoint d'un Lakehouse est en LECTURE SEULE. Pas de DML, pas de CREATE SECURITY POLICY, pas d'OPTIMIZE/VACUUM. Pour T-SQL complet → Warehouse."},
          {p:"❌ Piège","t":"Dataflow Gen2 = Streaming Dataflow","d":"Dataflow Gen2 = batch (refresh planifié). Streaming Dataflows = traitement continu temps réel. Modèles de traitement totalement différents."},
          {p:"❌ Piège","t":"Copy Job = Pipeline simple","d":"Copy Job est entre Mirroring (automatique) et Pipeline (complexe). Il supporte CDC, bulk, et incremental sans nécessiter de Pipeline complet. Nouveau en 2025."},
        ]
      },
      {
        cat:"Delta & Performance", color:C.amber,
        items:[
          {p:"❌ Piège","t":"OPTIMIZE/VACUUM dans SQL endpoint","d":"OPTIMIZE et VACUUM ne fonctionnent PAS dans le SQL Analytics Endpoint ni dans l'éditeur SQL du Warehouse. Exécuter dans un Notebook Spark ou via la UI Maintenance du Lakehouse."},
          {p:"❌ Piège","t":"V-Order désactivé = performances identiques","d":"V-Order activé sur tables Gold = lectures Direct Lake significativement plus rapides. Pour les nouveaux workspaces F SKU, V-Order est désactivé par défaut en Spark — à activer manuellement."},
          {p:"❌ Piège","t":"Liquid Clustering + Partitionnement","d":"Liquid Clustering est incompatible avec le partitionnement Hive-style. Choisir l'un ou l'autre. Pour de nouvelles tables → Liquid Clustering recommandé."},
          {p:"❌ Piège","t":"VACUUM < 7 jours = sûr","d":"Descendre la rétention VACUUM sous 7 jours désactive le Time Travel et peut casser l'Incremental Refresh des semantic models (Direct Lake framing). Ne jamais faire sans analyse des impacts."},
          {p:"❌ Piège","t":"V-Order irréversible dans Warehouse","d":"Dans Fabric Warehouse, V-Order est activé par défaut et ne peut PAS être désactivé. Ce comportement est différent du Lakehouse Spark où V-Order est configurable."},
        ]
      },
      {
        cat:"Déploiement & Gouvernance", color:C.teal,
        items:[
          {p:"❌ Piège","t":"Deployment Pipelines sans workspaces séparés","d":"Les Deployment Pipelines requièrent 1 workspace SÉPARÉ par stage. Impossible de l'utiliser dans un workspace unique (Pattern monolithique)."},
          {p:"❌ Piège","t":"Git = Deployment Pipeline","d":"Git = versionning du code source. Deployment Pipeline = promotion entre environnements. Les deux sont complémentaires, pas interchangeables."},
          {p:"❌ Piège","t":"RLS identique Dev/Prod non nécessaire","d":"La configuration RLS/CLS DOIT être identique entre Test et Prod pour valider correctement le comportement sécurité avant promotion."},
          {p:"❌ Piège","t":"Copilot sur Trial SKU","d":"Le Trial SKU (60 jours) ne supporte pas Copilot. Une capacité F2+ achetée est requise. Trial = Copilot indisponible."},
          {p:"❌ Piège","t":"Enhanced Metadata requis pour Deployment Pipelines","d":"Depuis février 2026, les Deployment Pipelines ne supportent plus les Semantic Models non migrés vers Enhanced Metadata (format legacy obsolète)."},
        ]
      },
    ].map((cat,ci)=>(
      <Card key={ci} title={cat.cat} accent={cat.color} icon="⚠️">
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {cat.items.map((item,i)=>(
            <div key={i} style={{padding:"0.75rem",background:"#fafafa",borderRadius:8,borderLeft:`3px solid ${cat.color}`}}>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:700,color:cat.color}}>Piège {ci*10+i+1}</span>
                <span style={{fontWeight:600,fontSize:13,color:"#111827"}}>{item.t}</span>
              </div>
              <div style={{fontSize:12.5,color:"#374151",lineHeight:1.55}}>{item.d}</div>
            </div>
          ))}
        </div>
      </Card>
    ))}
  </div>
);

/* ─────────────── FULL CONTENT FROM V1 (imported sections) ─────────────── */
const FULL_CONTENT = {};
/* populated below via section definitions */

/* ─────────────── REUSED HELPERS (aliases for v1 compatibility) ─────────────── */
const Table = T;
const CodeBlock = Code;
const ExamTip = Tip;
const Warning = Warn;
const SectionTitle = ({children}) => <STitle>{children}</STitle>;

/* ─────────────── ALL DETAILED SECTIONS ─────────────── */
/* ─────────────── MAIN APP ─────────────── */
const _SECTIONS_DATA = {
  overview: (
    <div>
      <SectionTitle>🏛️ Modèle de sécurité Microsoft Fabric — Vue d'ensemble</SectionTitle>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: 14 }}>
        Fabric utilise une sécurité en couches (Defense in Depth). Un utilisateur doit passer <strong>3 niveaux</strong> pour accéder aux données.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {[
          { n: "Niveau 1", title: "Authentification", desc: "Microsoft Entra ID — identité vérifiée", color: "blue", icon: "🪪" },
          { n: "Niveau 2", title: "Autorisation Fabric", desc: "Workspace roles, item permissions, tenant settings", color: "purple", icon: "🏢" },
          { n: "Niveau 3", title: "Sécurité des données", desc: "RLS, CLS, OLS, DDM, OneLake roles", color: "teal", icon: "🔒" },
        ].map((lvl, i) => (
          <div key={i} style={{
            background: colors[`light${lvl.color.charAt(0).toUpperCase() + lvl.color.slice(1)}`],
            border: `1px solid ${colors[lvl.color]}30`, borderRadius: 12,
            padding: "1rem", textAlign: "center"
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{lvl.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: colors[lvl.color], letterSpacing: 1, marginBottom: 4 }}>{lvl.n}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>{lvl.title}</div>
            <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.4 }}>{lvl.desc}</div>
          </div>
        ))}
      </div>
      <Card title="Matrice des contrôles de sécurité" accent={colors.blue} icon="📊">
        <Table
          headers={["Contrôle", "Niveau", "Où ?", "Ce qu'il protège", "Bypass par"]}
          rows={[
            ["Workspace Roles", "2", "Workspace", "Tous les items du workspace", "—"],
            ["Item Permissions", "2", "Item individuel", "Un seul item (Lakehouse, Warehouse...)", "—"],
            ["RLS", "3", "Warehouse / Semantic model", "Lignes (filtrage horizontal)", "Admin, Member, Contributor"],
            ["CLS", "3", "Warehouse", "Colonnes (accès interdit)", "Admin, Member, Contributor"],
            ["OLS", "3", "Semantic model Power BI", "Tables/colonnes (invisibles)", "—"],
            ["DDM", "3", "Warehouse", "Masquage de valeurs (format visible)", "unmask_permission"],
            ["OneLake Roles", "3", "Lakehouse / OneLake", "Fichiers/dossiers", "Admin, Member, Contributor"],
          ]}
        />
      </Card>
      <ExamTip>
        Mémorisez que Admin, Member et Contributor bypasse RLS, CLS et OneLake Security. Seuls les Viewers et les utilisateurs avec permission Read item-level sont soumis à ces contrôles.
      </ExamTip>
    </div>
  ),

  auth: (
    <div>
      <SectionTitle>🔐 Authentification & Sécurité Réseau</SectionTitle>
      <Card title="Microsoft Entra ID (anciennement Azure AD)" accent={colors.blue} icon="🪪">
        <p style={{ fontSize: 14, color: "#374151", margin: "0 0 0.75rem", lineHeight: 1.6 }}>
          Fabric utilise exclusivement Microsoft Entra ID pour l'authentification. Tout accès est chiffré par défaut. Seule l'authentification Entra est supportée pour CLS et RLS.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "MFA", desc: "Multi-Factor Authentication via Conditional Access" },
            { label: "Conditional Access", desc: "Restrictions par IP, pays, type d'appareil" },
            { label: "Service Principal", desc: "Authentification machine-to-machine pour pipelines" },
            { label: "Managed Identity", desc: "Identité workspace pour accès Azure sécurisé" },
          ].map((f, i) => (
            <div key={i} style={{ background: "#f8fafc", borderRadius: 8, padding: "0.75rem", border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: colors.blue, marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Sécurité réseau — Inbound" accent={colors.purple} icon="🌐">
        <Table
          headers={["Solution", "Usage", "Avantage"]}
          rows={[
            ["Private Links", "Restreindre à un VNet Azure uniquement", "Bloque tout accès Internet public"],
            ["Conditional Access", "MFA, IP allowlist, device compliance", "Flexible, sans infrastructure"],
            ["Tenant Isolation", "Séparation logique des tenants", "Automatique dans Fabric"],
          ]}
        />
      </Card>
      <Card title="Sécurité réseau — Outbound" accent={colors.teal} icon="🔗">
        <Table
          headers={["Solution", "Usage"]}
          rows={[
            ["Trusted Workspace Access", "Accès ADLS Gen2 avec firewall activé (requiert F SKU)"],
            ["Managed Private Endpoints", "Connexion sécurisée à Azure SQL, etc. sans réseau public"],
            ["Managed VNet", "Isolation réseau pour workloads Spark"],
            ["On-premises Data Gateway", "Connexion aux sources on-prem via tunnel sécurisé"],
            ["VNet Data Gateway", "Connexion sources dans un VNet Azure"],
          ]}
        />
      </Card>
      <ExamTip>
        Trusted Workspace Access requiert un F SKU (Fabric capacity). Les workspace identities ne peuvent être créées que sur des capacités F SKU. Limite par défaut : 10 000 identities par tenant.
      </ExamTip>
    </div>
  ),

  workspace: (
    <div>
      <SectionTitle>🏢 Workspace Roles & Capacité</SectionTitle>
      <Card title="Les 4 rôles Workspace" accent={colors.purple} icon="👥">
        <Table
          headers={["Rôle", "Lire", "Modifier", "Partager", "Gérer membres", "Bypass sécurité data"]}
          rows={[
            ["Admin", "✅", "✅", "✅", "✅ (tous rôles)", "✅ OUI"],
            ["Member", "✅", "✅", "✅", "✅ (Contributor/Viewer)", "✅ OUI"],
            ["Contributor", "✅", "✅", "❌", "❌", "✅ OUI"],
            ["Viewer", "✅ (lecture seule)", "❌", "❌", "❌", "❌ NON — soumis RLS/CLS/OneLake"],
          ]}
        />
        <Warning>Admin, Member et Contributor bypassent RLS, CLS et OneLake Security. Utilisez le rôle Viewer + item permissions pour les utilisateurs soumis à la sécurité granulaire.</Warning>
      </Card>
      <Card title="Item-Level Permissions" accent={colors.teal} icon="🔑">
        <p style={{ fontSize: 14, color: "#374151", margin: "0 0 0.75rem", lineHeight: 1.6 }}>
          Partager un item spécifique sans donner accès à tout le workspace.
        </p>
        <Table
          headers={["Permission", "Description"]}
          rows={[
            ["Read", "Connecter à l'item, voir son contenu"],
            ["ReadAll", "Accès complet aux données (bypass OneLake roles si non configuré)"],
            ["Write", "Modifier le contenu de l'item"],
            ["Reshare", "Partager l'item avec d'autres utilisateurs"],
            ["Build", "Créer du contenu basé sur cet item (ex: rapport sur un dataset)"],
          ]}
        />
        <ExamTip>Un utilisateur sans rôle workspace peut toujours accéder à un item partagé directement. La règle : la permission la plus permissive entre workspace role et item permission gagne.</ExamTip>
      </Card>
      <Card title="Hiérarchie Admin — Tenant → Capacité → Workspace" accent={colors.amber} icon="🏗️">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { level: "Fabric Admin (Tenant)", desc: "Contrôle global : activer/désactiver Fabric, tenant settings, audit logs", color: colors.red },
            { level: "Capacity Admin", desc: "Gérer une capacité, déléguer des tenant settings, assigner des workspaces", color: colors.amber },
            { level: "Capacity Contributor", desc: "Déplacer des workspaces dans la capacité sans admin complet", color: colors.green },
            { level: "Workspace Admin", desc: "Gérer les membres, items, et settings du workspace", color: colors.blue },
          ].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "0.75rem", background: "#f9fafb", borderRadius: 8, borderLeft: `3px solid ${l.color}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{l.level}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Domaines (Domains)" accent={colors.teal} icon="🗂️">
        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
          Un domaine est un regroupement logique de workspaces (ex: Finance, RH, Marketing). Un Domain Admin gère les workspaces de son domaine sans être Fabric Admin global. Utile pour déléguer la gouvernance métier.
        </p>
      </Card>
    </div>
  ),

  rls: (
    <div>
      <SectionTitle>↔️ Row-Level Security (RLS)</SectionTitle>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        RLS filtre les <strong>lignes</strong> retournées par une requête selon l'identité de l'utilisateur. C'est le "tranche horizontale" de la sécurité data.
      </p>
      <Card title="Implémentation dans Fabric Warehouse (T-SQL)" accent={colors.blue} icon="🏭">
        <p style={{ fontSize: 13, color: "#374151", marginBottom: "0.5rem" }}>Exemple : chaque manager ne voit que les ventes de sa région.</p>
        <CodeBlock code={`
-- 1. Créer une fonction de filtre
CREATE FUNCTION dbo.fn_RLS_Region(@Region NVARCHAR(50))
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 AS fn_result
WHERE @Region = SESSION_CONTEXT(N'Region')
   OR IS_MEMBER('DirecteurGlobal') = 1;

-- 2. Créer la politique de sécurité
CREATE SECURITY POLICY RegionFilter
ADD FILTER PREDICATE dbo.fn_RLS_Region(Region)
ON dbo.Ventes
WITH (STATE = ON);

-- 3. Définir le contexte utilisateur
EXEC sp_set_session_context @key = N'Region', @value = 'Europe';
`} />
        <ExamTip>L'examen peut demander la syntaxe exacte de CREATE SECURITY POLICY et la différence entre FILTER PREDICATE (lecture) et BLOCK PREDICATE (écriture).</ExamTip>
      </Card>
      <Card title="RLS dans un Semantic Model Power BI (DAX)" accent={colors.purple} icon="📊">
        <CodeBlock code={`
-- Dans Power BI Desktop > Modélisation > Gérer les rôles
-- Rôle : "Vendeur_Region"
-- Table : Ventes
-- Filtre DAX :
[Region] = LOOKUPVALUE(
    Employes[Region],
    Employes[Email],
    USERPRINCIPALNAME()
)
`} lang="dax" />
        <p style={{ fontSize: 13, color: "#374151", marginTop: "0.5rem", lineHeight: 1.5 }}>
          Fonctions DAX utiles pour RLS : <code>USERPRINCIPALNAME()</code> (email), <code>USERNAME()</code> (domain\user), <code>CUSTOMDATA()</code> (valeur custom dans connection string).
        </p>
      </Card>
      <Card title="RLS — Points clés certification" accent={colors.green} icon="📌">
        <ul style={{ fontSize: 13, color: "#374151", paddingLeft: "1.25rem", lineHeight: 2 }}>
          <li>Seule l'<strong>authentification Entra ID</strong> est supportée pour RLS dans Warehouse</li>
          <li>Les rôles <strong>Admin/Member/Contributor bypasse RLS</strong> — seuls Viewers sont filtrés</li>
          <li><strong>FILTER PREDICATE</strong> = restreint SELECT. <strong>BLOCK PREDICATE</strong> = restreint INSERT/UPDATE/DELETE</li>
          <li>Pour <strong>tester le RLS</strong> sans changer d'utilisateur : <code>EXECUTE AS USER = 'user@domain.com'</code></li>
          <li>Dans Power BI : tester avec "Afficher en tant que rôle" dans Power BI Desktop</li>
          <li>RLS et OLS <strong>ne se combinent pas directement</strong> dans Power BI — OLS est dans le modèle, RLS dans les rôles</li>
        </ul>
      </Card>
    </div>
  ),

  cls: (
    <div>
      <SectionTitle>📋 Column-Level Security (CLS)</SectionTitle>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        CLS restreint l'accès à des <strong>colonnes spécifiques</strong> dans un Warehouse. Les utilisateurs non autorisés reçoivent une erreur s'ils tentent de SELECT une colonne protégée.
      </p>
      <Card title="Implémentation via GRANT/DENY" accent={colors.teal} icon="🔒">
        <CodeBlock code={`
-- Accorder l'accès à toutes les colonnes SAUF les sensibles
GRANT SELECT ON dbo.Employes TO [AnalystesRH];

-- Retirer l'accès aux colonnes sensibles
DENY SELECT ON dbo.Employes(Salaire, BonusAnnuel, NumeroSecu)
    TO [AnalystesRH];

-- Vérification : l'utilisateur ne peut pas faire
-- SELECT Salaire FROM dbo.Employes  → ERREUR
-- SELECT Nom, Prenom FROM dbo.Employes  → OK
`} />
      </Card>
      <Card title="CLS vs DDM — Quelle différence ?" accent={colors.amber} icon="⚖️">
        <Table
          headers={["Critère", "CLS", "DDM"]}
          rows={[
            ["Effet", "Erreur si la colonne est demandée", "Valeur masquée retournée"],
            ["Visibilité colonne", "La colonne est inaccessible", "La colonne est visible mais masquée"],
            ["Requête SELECT *", "Exclut la colonne protégée", "Inclut la colonne masquée"],
            ["Metadata visible ?", "Non (erreur d'accès)", "Oui (structure visible)"],
            ["Usage recommandé", "Données strictement confidentielles", "Tests, environnements dev"],
          ]}
        />
      </Card>
      <Card title="Points clés certification CLS" accent={colors.purple} icon="📌">
        <ul style={{ fontSize: 13, color: "#374151", paddingLeft: "1.25rem", lineHeight: 2 }}>
          <li>CLS s'applique uniquement dans <strong>Fabric Warehouse</strong> via T-SQL GRANT/DENY</li>
          <li>Seule l'<strong>authentification Microsoft Entra</strong> est supportée</li>
          <li>CLS et RLS sont <strong>complémentaires</strong> — utilisez les deux pour une défense en profondeur</li>
          <li>Un <code>SELECT *</code> par un utilisateur avec CLS retourne <strong>toutes les colonnes autorisées</strong> seulement</li>
          <li>Pas de CLS dans Lakehouse — utilisez des vues ou OneLake security pour les fichiers</li>
        </ul>
        <ExamTip>Si une question décrit que des utilisateurs ne doivent pas voir des colonnes salaire/identité mais peuvent accéder au reste de la table → réponse : CLS via DENY.</ExamTip>
      </Card>
    </div>
  ),

  ols: (
    <div>
      <SectionTitle>👁️ Object-Level Security (OLS)</SectionTitle>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        OLS cache des <strong>tables ou colonnes entières</strong> dans un semantic model Power BI. L'utilisateur ne voit même pas que l'objet existe (métadonnées cachées).
      </p>
      <Card title="OLS dans Power BI / Semantic Model" accent={colors.purple} icon="👁️">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          OLS se configure dans <strong>Tabular Editor</strong> ou <strong>SSMS via XMLA</strong>. Contrairement à CLS (Warehouse), OLS s'applique au niveau du modèle sémantique Power BI.
        </p>
        <CodeBlock code={`
// Dans Tabular Editor ou via API TMSL
// Configurer la permission "None" sur une table pour un rôle
{
  "tablePermissions": [
    {
      "name": "DonnéesRH",
      "filterExpression": "",
      "metadataPermission": "None"  // Cache même les métadonnées
    }
  ]
}

// Via DAX dans une mesure OLS-like (alternative)
Table OLS via Tabular Editor > Rôle > 
  Table Permission = "None" → table invisible
`} />
      </Card>
      <Card title="OLS dans OneLake (Lakehouse)" accent={colors.blue} icon="🏔️">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Dans OneLake, OLS permet de cacher des <strong>tables ou dossiers entiers</strong> aux utilisateurs non autorisés. En preview, configurable via les OneLake Data Access Roles.
        </p>
        <CodeBlock code={`
-- Via OneLake Security (en preview)
-- Créer un rôle d'accès restreint
-- Ne pas inclure la table "DonnéesConfidentielles" 
-- dans les tables autorisées du rôle

-- Résultat : l'utilisateur ne voit pas la table
-- dans l'explorateur du Lakehouse
`} />
      </Card>
      <Card title="Comparatif OLS vs CLS vs RLS" accent={colors.teal} icon="📊">
        <Table
          headers={["", "OLS", "CLS", "RLS"]}
          rows={[
            ["Granularité", "Table/Colonne entière", "Colonne", "Lignes"],
            ["Où s'applique", "Semantic model / OneLake", "Warehouse (T-SQL)", "Warehouse / Semantic model"],
            ["Métadonnées cachées ?", "✅ Oui", "❌ Non (erreur accès)", "❌ Non"],
            ["Configuration", "Tabular Editor / XMLA / OneLake roles", "T-SQL DENY", "T-SQL CREATE SECURITY POLICY / DAX"],
            ["Cas d'usage", "Cacher des tables RH, financières", "Interdire colonnes sensibles", "Filtrer par région/utilisateur"],
          ]}
        />
      </Card>
      <ExamTip>OLS = les métadonnées sont invisibles. CLS = accès refusé avec erreur mais la colonne "existe" dans le schéma. Si la question parle de "l'utilisateur ne doit même pas savoir que la table existe" → OLS.</ExamTip>
    </div>
  ),

  ddm: (
    <div>
      <SectionTitle>🎭 Dynamic Data Masking (DDM)</SectionTitle>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        DDM remplace les valeurs sensibles par des valeurs masquées <strong>à la volée</strong>, sans modifier les données stockées. La structure de la table reste visible.
      </p>
      <Card title="Fonctions de masquage disponibles" accent={colors.teal} icon="🎭">
        <Table
          headers={["Fonction", "Syntaxe", "Exemple résultat"]}
          rows={[
            ["default()", "MASKED WITH (FUNCTION = 'default()')", "0 (numérique) / XXXX (texte) / 01-01-1900 (date)"],
            ["email()", "MASKED WITH (FUNCTION = 'email()')", "aXXX@XXXX.com"],
            ["partial()", "MASKED WITH (FUNCTION = 'partial(0,\"XXX-\",4)')", "XXX-1234"],
            ["random()", "MASKED WITH (FUNCTION = 'random(1, 100)')", "Valeur aléatoire entre 1 et 100"],
          ]}
        />
      </Card>
      <Card title="Implémentation T-SQL" accent={colors.blue} icon="💻">
        <CodeBlock code={`
-- À la création de la table
CREATE TABLE dbo.Clients (
    ClientID INT NOT NULL,
    Nom NVARCHAR(100),
    Email NVARCHAR(100) MASKED WITH (FUNCTION = 'email()'),
    Telephone NVARCHAR(20) MASKED WITH (FUNCTION = 'partial(0,"XXX-XXX-",4)'),
    NumCarte NVARCHAR(19) MASKED WITH (FUNCTION = 'partial(0,"XXXX-XXXX-XXXX-",4)'),
    Salaire DECIMAL(10,2) MASKED WITH (FUNCTION = 'default()')
);

-- Ajouter un masque à une colonne existante
ALTER TABLE dbo.Clients
ALTER COLUMN NumSecu ADD MASKED WITH (FUNCTION = 'default()');

-- Supprimer un masque
ALTER TABLE dbo.Clients
ALTER COLUMN NumSecu DROP MASKED;

-- Accorder la permission de voir les vraies valeurs
GRANT UNMASK TO [UtilisateursPrivilégiés];

-- Accorder l'unmask sur une colonne spécifique
GRANT UNMASK ON dbo.Clients(Salaire) TO [AdminRH];
`} />
      </Card>
      <Card title="Points critiques DDM" accent={colors.amber} icon="⚠️">
        <ul style={{ fontSize: 13, color: "#374151", paddingLeft: "1.25rem", lineHeight: 2 }}>
          <li>DDM <strong>n'est pas une vraie sécurité</strong> — un utilisateur avec des droits d'inférence peut deviner les valeurs</li>
          <li>Les utilisateurs avec <strong>UNMASK permission</strong> voient les vraies valeurs</li>
          <li>DDM peut être <strong>contourné</strong> via des opérations de déduction (WHERE, JOIN) si l'utilisateur a accès à la table</li>
          <li>DDM est idéal pour les <strong>environnements de dev/test</strong></li>
          <li>DDM s'applique uniquement dans <strong>Fabric Warehouse</strong></li>
          <li>Les <strong>admins de la table bypasse automatiquement</strong> le masquage</li>
        </ul>
        <Warning>DDM ne remplace pas CLS ou RLS. Combinez-les pour une vraie sécurité des données sensibles.</Warning>
      </Card>
    </div>
  ),

  onelake: (
    <div>
      <SectionTitle>🏔️ OneLake Security & Data Access Roles</SectionTitle>
      <Card title="Architecture de sécurité OneLake" accent={colors.blue} icon="🏔️">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          OneLake est le data lake unifié de Fabric. La sécurité est définie en couches superposées.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { layer: "Workspace permissions", desc: "Couche la plus haute — Admin/Member/Contributor bypasse tout", color: colors.red },
            { layer: "Item permissions", desc: "ReadAll = accès complet aux données de l'item", color: colors.amber },
            { layer: "OneLake Data Access Roles", desc: "Contrôle granulaire dossiers/tables (preview)", color: colors.purple },
            { layer: "RLS / CLS / DDM", desc: "Contrôle au niveau lignes/colonnes/valeurs", color: colors.teal },
          ].map((l, i) => (
            <div key={i} style={{ padding: "0.6rem 0.875rem", background: "#f9fafb", borderRadius: 6, borderLeft: `3px solid ${l.color}`, display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{l.layer} </span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>— {l.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="OneLake Data Access Roles (Preview)" accent={colors.purple} icon="🔐">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Permettent de définir l'accès en lecture au niveau <strong>dossier ou table</strong> dans un Lakehouse. Deux rôles système par défaut :
        </p>
        <Table
          headers={["Rôle", "Description"]}
          rows={[
            ["DefaultReader", "Accès en lecture à toutes les tables/dossiers du Lakehouse"],
            ["Rôles personnalisés", "Accès restreint à des tables/dossiers spécifiques"],
          ]}
        />
        <CodeBlock code={`
-- Accès via SQL Analytics Endpoint :
-- OneLake security est traduit automatiquement en SQL
-- Les politiques RLS/CLS/OLS définies dans OneLake
-- sont honorées via le SQL endpoint

-- Dans OneLake Security, on NE PEUT PAS définir
-- RLS/CLS/OLS directement en T-SQL
-- La définition se fait via l'interface OneLake
-- et est synchronisée vers le SQL endpoint
`} />
      </Card>
      <Card title="SQL Analytics Endpoint — comportement sécurité" accent={colors.teal} icon="⚡">
        <ul style={{ fontSize: 13, color: "#374151", paddingLeft: "1.25rem", lineHeight: 2 }}>
          <li>Quand OneLake Security est activé, les politiques sont <strong>centralement appliquées</strong></li>
          <li>On <strong>ne peut pas</strong> définir RLS/CLS/OLS directement en T-SQL via le SQL endpoint en mode OneLake Security</li>
          <li>Les <strong>vues, fonctions, procédures</strong> peuvent toujours recevoir des GRANT/EXECUTE</li>
          <li>Les <strong>shortcuts</strong> (raccourcis vers d'autres Lakehouses) héritent de la sécurité OneLake source</li>
        </ul>
        <ExamTip>Question fréquente : "Comment garantir que les raccourcis (shortcuts) respectent la sécurité du Lakehouse source ?" → OneLake Security synchronise automatiquement les politiques.</ExamTip>
      </Card>
      <Card title="Workspace Identity" accent={colors.amber} icon="🤖">
        <ul style={{ fontSize: 13, color: "#374151", paddingLeft: "1.25rem", lineHeight: 2 }}>
          <li>Permet à un workspace d'avoir une <strong>identité managée</strong> pour accès Azure</li>
          <li>Requiert un <strong>F SKU capacity</strong> (pas disponible sur Trial ou PPU)</li>
          <li>Limite : <strong>10 000 workspace identities</strong> par défaut par tenant</li>
          <li>Utilisé pour : Trusted Workspace Access vers ADLS Gen2, Managed Private Endpoints</li>
          <li>Non supporté dans les <strong>scénarios B2B ou cross-tenant</strong></li>
        </ul>
      </Card>
    </div>
  ),

  purview: (
    <div>
      <SectionTitle>🛡️ Gouvernance — Microsoft Purview & Conformité</SectionTitle>
      <Card title="Microsoft Purview Integration" accent={colors.blue} icon="🛡️">
        <Table
          headers={["Fonctionnalité", "Description", "Usage"]}
          rows={[
            ["Sensitivity Labels", "Étiquettes de classification des données (Confidentiel, Public...)", "GDPR, classification automatique"],
            ["Data Loss Prevention (DLP)", "Règles qui bloquent le partage de données sensibles", "Empêcher fuite d'informations"],
            ["Information Protection", "Chiffrement basé sur les étiquettes", "Protection des exports"],
            ["Purview Hub", "Portail de gouvernance centralisé dans Fabric", "Vue unifiée des actifs de données"],
            ["Data Lineage", "Traçabilité des données de la source au rapport", "Impact analysis, audit"],
            ["Audit Logs", "Journal de toutes les activités Fabric", "Conformité, investigation"],
          ]}
        />
      </Card>
      <Card title="Audit & Monitoring" accent={colors.teal} icon="📋">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Toutes les activités Fabric sont loggées dans les <strong>Audit Logs Microsoft 365</strong>.
        </p>
        <CodeBlock code={`
-- Accès aux audit logs via PowerShell
Search-UnifiedAuditLog -StartDate "2026-01-01" 
    -EndDate "2026-06-08" 
    -RecordType PowerBIAudit

-- Ou dans le portail Admin Fabric :
-- Admin Portal > Audit Logs > Track user activities

-- Pour les Capacity Metrics (monitoring CU) :
-- Installer l'app "Microsoft Fabric Capacity Metrics"
-- depuis AppSource
`} />
      </Card>
      <Card title="Chiffrement des données" accent={colors.green} icon="🔒">
        <Table
          headers={["Couche", "Mécanisme"]}
          rows={[
            ["At rest", "Chiffrement AES-256 automatique dans OneLake"],
            ["In transit", "TLS 1.2+ pour toutes les communications"],
            ["Customer-Managed Keys", "Possibilité d'apporter ses propres clés (BYOK) via Azure Key Vault"],
            ["Multi-Geo", "Contrôle de la localisation des données pour conformité régionale"],
          ]}
        />
      </Card>
      <Card title="Multi-Geo & Data Residency" accent={colors.purple} icon="🌍">
        <ul style={{ fontSize: 13, color: "#374151", paddingLeft: "1.25rem", lineHeight: 2 }}>
          <li>Le <strong>tenant home cluster</strong> stocke les métadonnées dans une région unique</li>
          <li>Les <strong>capacités</strong> peuvent être dans des régions différentes (conformité RGPD, souveraineté)</li>
          <li>Les workspaces s'assignent à des capacités → contrôle de <strong>résidence des données</strong></li>
          <li>Admin peut <strong>bloquer la réassignation</strong> de My Workspace via tenant setting</li>
        </ul>
      </Card>
    </div>
  ),

  catalogue: (
    <div>
      <SectionTitle>📚 OneLake Catalog & Gouvernance des données</SectionTitle>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        Le OneLake Catalog est le portail de découverte, gouvernance et sécurité unifié de Fabric. Il remplace le Hub Purview dans Fabric et centralise toutes les capacités de gouvernance.
      </p>
      <Card title="Les 3 onglets du OneLake Catalog" accent={colors.blue} icon="📚">
        <Table
          headers={["Onglet", "Pour qui", "Ce qu'il contient"]}
          rows={[
            ["Explore", "Tous les utilisateurs", "Découverte d'items, recherche, filtres par type/domaine/tag/endorsement"],
            ["Govern", "Data owners + Fabric Admins", "Curation state, sensitivity label coverage, DLP violations, endorsements, fraîcheur des données"],
            ["Secure", "Admins", "Roles/permissions par workspace et item, OneLake security roles, audit centralisé"],
          ]}
        />
        <ExamTip>Le Govern tab dans OneLake Catalog remplace le Microsoft Purview Hub pour les insights Fabric. Les Fabric Admins voient 3 sous-onglets : "Manage data estate", "Protect secure & comply", "Discover trust and reuse".</ExamTip>
      </Card>
      <Card title="Endorsement — Promouvoir & Certifier" accent={colors.green} icon="✅">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          L'endorsement permet de distinguer les assets de confiance des assets exploratoires.
        </p>
        <Table
          headers={["Niveau", "Qui peut l'appliquer ?", "Signification"]}
          rows={[
            ["Promoted (Promu)", "Tout propriétaire d'item", "L'item est prêt pour une utilisation plus large"],
            ["Certified (Certifié)", "Utilisateurs désignés par l'admin (ou Domain Admin)", "L'item est validé, testé, conforme aux standards"],
          ]}
        />
        <CodeBlock code={`
-- Bonnes pratiques d'endorsement :
-- 1. Seuls les items testés et prêts à la production = Certified
-- 2. La certification peut être déléguée aux Domain Admins
-- 3. Les items certifiés apparaissent en priorité dans les recherches
-- 4. Les data consumers doivent être formés à n'utiliser
--    que des items Certified dans leurs rapports
`} />
        <Warning>Ne pas certifier automatiquement tous les items. La certification doit être un signal clair de confiance pour les consommateurs de données.</Warning>
      </Card>
      <Card title="Data Lineage — Traçabilité bout en bout" accent={colors.purple} icon="🔗">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          La lineage montre le chemin complet des données : source → Lakehouse → Pipeline → Semantic Model → Rapport Power BI.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", background: "#f0fdf4", padding: "0.75rem", borderRadius: 8, marginBottom: "0.75rem" }}>
          {["Source (SQL/ADLS)", "→", "Bronze Lakehouse", "→", "Pipeline", "→", "Silver/Gold LH", "→", "Semantic Model", "→", "Rapport PBI"].map((item, i) => (
            <span key={i} style={{
              background: item === "→" ? "transparent" : "#dcfce7",
              color: item === "→" ? "#6b7280" : "#15803d",
              padding: item === "→" ? "0" : "4px 10px",
              borderRadius: 6, fontSize: 12, fontWeight: item === "→" ? 400 : 600
            }}>{item}</span>
          ))}
        </div>
        <Table
          headers={["Vue Lineage", "Description"]}
          rows={[
            ["Vue liste", "Relations upstream/downstream en liste structurée"],
            ["Vue graphe", "Visualisation graphique des dépendances, item courant mis en évidence"],
            ["Impact analysis", "Identifier quels rapports/items sont impactés si une source change"],
          ]}
        />
        <ExamTip>Lineage est disponible dans le OneLake Catalog (onglet item details &gt; Lineage). Utilisez des conventions de nommage cohérentes pour améliorer la lisibilité du lineage.</ExamTip>
      </Card>
      <Card title="OneLake Catalog vs Microsoft Purview Unified Catalog" accent={colors.amber} icon="⚖️">
        <Table
          headers={["", "OneLake Catalog", "Purview Unified Catalog"]}
          rows={[
            ["Portée", "Items Fabric uniquement", "Tout le data estate (Azure, AWS, GCP, on-prem, Fabric)"],
            ["Public cible", "Data engineers/owners Fabric", "Équipes de gouvernance enterprise-wide"],
            ["Lineage", "Au sein de Fabric", "End-to-end multi-système"],
            ["Classification", "Sensitivity labels Fabric", "Scanning automatique multi-sources"],
            ["Usage recommandé", "Gouvernance opérationnelle Fabric", "Gouvernance enterprise globale"],
          ]}
        />
      </Card>
      <Card title="Sensitivity Labels — Labels de sensibilité" accent={colors.teal} icon="🏷️">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Les sensitivity labels (via Microsoft Purview Information Protection) classifient les données selon leur niveau de confidentialité.
        </p>
        <Table
          headers={["Caractéristique", "Détail"]}
          rows={[
            ["Héritage", "Les labels se propagent aux items downstream (export Excel, copie...)"],
            ["Chiffrement", "Labels hauts peuvent forcer le chiffrement des exports"],
            ["DLP", "Les politiques DLP peuvent bloquer le partage basé sur le label"],
            ["Domaine default", "Un Domain Admin peut définir un label par défaut pour son domaine"],
            ["Prérequis licence", "Microsoft 365 E5 ou E5 Compliance requis pour les fonctions avancées"],
          ]}
        />
      </Card>
      <Card title="DLP (Data Loss Prevention)" accent={colors.red} icon="🚫">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Les politiques DLP détectent et bloquent le partage de données sensibles hors des canaux autorisés.
        </p>
        <ul style={{ fontSize: 13, color: "#374151", paddingLeft: "1.25rem", lineHeight: 2 }}>
          <li>Détecter des données PII, financières, de santé dans les semantic models</li>
          <li>Générer des alertes ou bloquer les actions selon la politique</li>
          <li>Le Govern tab du OneLake Catalog montre les violations DLP actives</li>
          <li>Configurable depuis le portail Microsoft Purview compliance</li>
          <li>Applicable aux workspaces Premium ou Fabric capacity</li>
        </ul>
      </Card>
    </div>
  ),

  architecture: (
    <div>
      <SectionTitle>🏗️ Patterns d'architecture Fabric</SectionTitle>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        Les questions d'architecture sont parmi les plus fréquentes aux examens DP-600 et DP-700. Comprendre quand utiliser chaque composant est essentiel.
      </p>
      <Card title="Architecture Médaillon (Medallion) — Bronze / Silver / Gold" accent={colors.amber} icon="🥇">
        <Table
          headers={["Couche", "Contenu", "Format", "Sécurité recommandée"]}
          rows={[
            ["Bronze (Raw)", "Données brutes, identiques à la source, ingestion minimale", "Delta + format source (Parquet, CSV...)", "Accès restreint — data engineers seulement"],
            ["Silver (Curated)", "Données nettoyées, validées, dédupliquées, jointes", "Delta tables", "Data engineers + analystes techniques"],
            ["Gold (Refined)", "Agrégations business, modèles dimensionnels, KPIs", "Delta tables / Warehouse tables", "Analystes métier, consommateurs Power BI"],
          ]}
        />
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "0.75rem 1rem", marginTop: "0.75rem" }}>
          <p style={{ fontSize: 13, color: "#92400e", margin: 0, lineHeight: 1.5 }}>
            <strong>Recommandation Microsoft Learn :</strong> Créer chaque couche dans un workspace séparé pour un contrôle d'accès indépendant, un suivi de lineage propre et une isolation des incidents (blast radius). Un job défaillant en Silver ne consomme pas le compute de Gold.
          </p>
        </div>
      </Card>
      <Card title="Lakehouse vs Warehouse — Quand utiliser quoi ?" accent={colors.blue} icon="⚖️">
        <Table
          headers={["Critère", "Lakehouse", "Warehouse"]}
          rows={[
            ["Langage principal", "PySpark, Spark SQL, Python, Scala", "T-SQL uniquement"],
            ["Type de données", "Structurées + semi-structurées + non-structurées", "Structurées uniquement"],
            ["Workloads", "Data engineering, ML, streaming, ELT", "OLAP, reporting, BI, OLTP-like"],
            ["Format de stockage", "Delta Lake sur OneLake (Parquet)", "Delta Lake sur OneLake"],
            ["SQL endpoint", "SQL Analytics Endpoint (lecture seule via T-SQL)", "Full T-SQL (DML + DDL complet)"],
            ["RLS/CLS/DDM", "Via OneLake Security ou SQL endpoint", "Natif T-SQL (CREATE SECURITY POLICY)"],
            ["Profil équipe", "Data engineers, data scientists", "DBA, analystes SQL, BI developers"],
          ]}
        />
        <ExamTip>Question fréquente : "L'équipe utilise principalement T-SQL et des outils BI" → Warehouse. "L'équipe fait du ML et de la transformation PySpark" → Lakehouse.</ExamTip>
      </Card>
      <Card title="Shortcut vs Mirroring vs Pipeline Copy" accent={colors.teal} icon="🔀">
        <Table
          headers={["Méthode", "Description", "Latence", "Quand l'utiliser"]}
          rows={[
            ["Shortcut", "Lien virtuel vers données externes (ADLS, S3, autre LH) — pas de copie", "Temps réel (accès direct)", "Éviter la duplication, accès cross-workspace, données externes fréquemment mises à jour"],
            ["Mirroring", "Réplication continue d'une base externe (Azure SQL, Snowflake, CosmosDB) dans OneLake", "Quasi temps réel", "Sources OLTP à synchroniser dans Fabric pour analytique"],
            ["Pipeline Copy", "Copie explicite et orchestrée via Data Factory", "Batch (planifié)", "Contrôle total sur la transformation, sources non supportées par Mirroring"],
          ]}
        />
        <ExamTip>Shortcut = pas de copie physique, données restent à la source. Mirroring = copie répliquée automatiquement. Pipeline = copie orchestrée manuelle. Les shortcuts héritent de la sécurité OneLake source.</ExamTip>
      </Card>
      <Card title="Patterns de déploiement Fabric (4 patterns Microsoft)" accent={colors.purple} icon="🏢">
        <Table
          headers={["Pattern", "Structure", "Isolation", "Gouvernance", "Usage typique"]}
          rows={[
            ["1 — Monolithique", "1 workspace pour tout", "Faible", "Centralisée", "POC, petite équipe"],
            ["2 — Workspaces multiples", "1 workspace par domaine/équipe", "Moyenne", "Par workspace", "PME, équipes séparées"],
            ["3 — Workspaces + Domaines", "Workspaces groupés par domaines Fabric", "Bonne", "Déléguée par domaine", "Grande entreprise, data mesh"],
            ["4 — Multi-tenant", "Tenants séparés par business unit", "Maximale", "Complètement indépendante", "Filiales, conformité stricte"],
          ]}
        />
      </Card>
      <Card title="Architecture sécurité recommandée — Séparation Data / Analytics" accent={colors.green} icon="🔐">
        <p style={{ fontSize: 13, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.5 }}>
          Pattern recommandé pour les environnements enterprise avec isolation sécurité forte :
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { ws: "Data Workspace (Bronze/Silver/Gold)", desc: "Accès réservé aux data engineers. Contient les Lakehouses et pipelines. Jamais exposé aux utilisateurs métier.", color: colors.amber },
            { ws: "Analytics Workspace", desc: "Contient les Semantic Models et rapports PBI. Pointe vers Gold via Shortcuts. Accessible aux analystes et consommateurs.", color: colors.blue },
            { ws: "Shared Workspace (optionnel)", desc: "Datasets partagés entre équipes. RLS/CLS appliqués pour filtrage fin.", color: colors.teal },
          ].map((item, i) => (
            <div key={i} style={{ padding: "0.75rem", background: "#f9fafb", borderRadius: 8, borderLeft: `3px solid ${item.color}` }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{item.ws}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <ExamTip>Les business users ne devraient jamais accéder directement aux Lakehouses ou Warehouses. Leur accès passe par le Analytics Workspace via Power BI App ou Semantic Model avec RLS.</ExamTip>
      </Card>
      <Card title="Outil de transformation — Quand utiliser quoi ?" accent={colors.red} icon="⚙️">
        <Table
          headers={["Outil", "Profil", "Usage idéal", "Quand éviter"]}
          rows={[
            ["Dataflows Gen2", "Low-code / Power Query", "Transformations simples, ingestion source → Bronze/Silver", "Volumes très élevés, logique complexe"],
            ["Notebooks (PySpark)", "Code-first / Data engineers", "Transformations complexes, ML, streaming, Delta MERGE", "Équipes non techniques"],
            ["T-SQL (Warehouse)", "SQL developers", "Agrégations Gold, vues, stored procedures", "Données non-structurées, ML"],
            ["Pipelines Data Factory", "Orchestration", "Orchestrer notebooks/dataflows, Copy Activity, conditionnels", "Transformations inline (utiliser notebooks)"],
            ["KQL (Eventhouse)", "Temps réel", "Streaming analytics, IoT, logs, séries temporelles", "Données batch traditionnelles"],
          ]}
        />
      </Card>
    </div>
  ),

  deployment: (
    <div>
      <SectionTitle>🚀 Ingestion · Transformation · Streaming · Déploiement · CI/CD</SectionTitle>

      {/* ── INGESTION ── */}
      <div style={{ fontSize: 13, fontWeight: 700, color: colors.blue, letterSpacing: 1, textTransform: "uppercase", marginBottom: "0.75rem", paddingBottom: 4, borderBottom: `2px solid ${colors.blue}` }}>
        1 — Ingestion des données
      </div>

      <Card title={`Vue d'ensemble — Choisir son outil d'ingestion`} accent={colors.blue} icon="📥">
        <Table
          headers={["Outil", "Modèle", "Profil", "Latence", "Cas d'usage type"]}
          rows={[
            ["Dataflow Gen2", "Batch / Low-code", "Analyste / Power Query", "Minutes–heures", "200+ sources, nettoyage visuel, Bronze/Silver"],
            ["Pipeline + Copy Activity", "Batch / Orchestration", "Data engineer", "Planifié", "Large volumes, orchestration multi-étapes, retry logic"],
            ["Copy Job", "Batch / CDC", "Data engineer", "Quasi temps réel", "Ingestion incrémentale simple, plus simple qu'un Pipeline"],
            ["Notebook (PySpark)", "Batch / Code-first", "Data scientist/engineer", "Planifié", "Transformations complexes, logique custom, Delta MERGE"],
            ["Mirroring", "Réplication continue", "Data engineer", "Quasi temps réel", "Sources OLTP (Azure SQL, Snowflake, CosmosDB) → OneLake"],
            ["Shortcut", "Virtuel (pas de copie)", "Tous profils", "Temps réel", "ADLS, S3, GCS, autre Lakehouse — accès sans duplication"],
            ["Eventstream", "Streaming temps réel", "Data engineer temps réel", "Secondes", "IoT, Event Hub, Kafka, clickstream → Eventhouse/Lakehouse"],
          ]}
        />
        <ExamTip>Copy Job = entre Mirroring (automatique) et Pipeline (complexe). Pour une ingestion incrémentale simple sans orchestration lourde → Copy Job. Pour une réplication continue d'une source OLTP → Mirroring.</ExamTip>
      </Card>

      <Card title="Ingestion par type de source" accent={colors.teal} icon="🔌">
        <Table
          headers={["Type de source", "Outil recommandé", "Raison"]}
          rows={[
            ["Azure SQL / SQL Server (OLTP)", "Mirroring ou Copy Activity", "Mirroring pour temps réel, Copy Activity pour batch contrôlé"],
            ["Azure Data Lake Gen2 / ADFS", "Shortcut ou Pipeline Copy", "Shortcut si pas de transformation, Pipeline si ETL requis"],
            ["Amazon S3 / Google Cloud Storage", "Shortcut (virtuel) ou Pipeline", "Shortcut pour accès direct, Pipeline pour Copy avec transform"],
            ["Fichiers plats (CSV, Parquet, JSON)", "Dataflow Gen2 ou Notebook", "Dataflow pour low-code, Notebook pour schema complexe"],
            ["REST API / Web", "Dataflow Gen2 (connecteur Web) ou Notebook (requests)", "Selon complexité de l'API"],
            ["On-premises (SQL, Oracle, SAP...)", "Pipeline + Gateway ou Dataflow Gen2 + Gateway", "Gateway requis pour connexion sécurisée on-prem"],
            ["Event Hub / Kafka / IoT Hub", "Eventstream → Eventhouse / Lakehouse", "Streaming temps réel natif Fabric"],
            ["Snowflake / CosmosDB / PostgreSQL", "Mirroring (si supporté) ou Dataflow Gen2", "Mirroring pour sync continue, Dataflow pour batch"],
          ]}
        />
      </Card>

      <Card title="Patterns de chargement de données" accent={colors.purple} icon="🔄">
        <Table
          headers={["Pattern", "Description", "Outil typique", "Quand l'utiliser"]}
          rows={[
            ["Full Load", "Recharge toutes les données à chaque run", "Copy Activity / Dataflow", "Tables petites, pas d'historique, source sans CDC"],
            ["Incremental Load (Date)", "Charge uniquement les données nouvelles/modifiées selon une date", "Copy Activity / Notebook (RangeStart–RangeEnd)", "Tables avec colonne date fiable, gros volumes"],
            ["Change Data Capture (CDC)", "Capture les INSERT/UPDATE/DELETE depuis les logs de la source", "Copy Job (CDC mode) / Mirroring", "Sources transactionnelles, synchronisation fidèle"],
            ["Delta MERGE (Upsert)", "Insère les nouveaux enregistrements, met à jour les existants", "Notebook PySpark (MERGE INTO) / SQL MERGE", "Synchronisation bidirectionnelle, SCD Type 1"],
            ["Streaming / Micro-batch", "Données ingérées en continu, traitées en fenêtres temporelles", "Eventstream + Eventhouse / Spark Structured Streaming", "Données temps réel, faible latence requise"],
          ]}
        />
        <CodeBlock code={`-- Exemple Delta MERGE (Upsert) en PySpark
from delta.tables import DeltaTable

delta_table = DeltaTable.forPath(spark, "abfss://gold@onelake.dfs.fabric.microsoft.com/.../Clients")

delta_table.alias("cible").merge(
    nouveaux_df.alias("source"),
    "cible.ClientID = source.ClientID"
).whenMatchedUpdateAll()     # Met à jour si correspondance
 .whenNotMatchedInsertAll()  # Insère si nouveau
 .execute()`} lang="python" />
      </Card>

      {/* ── TRANSFORMATION ── */}
      <div style={{ fontSize: 13, fontWeight: 700, color: colors.teal, letterSpacing: 1, textTransform: "uppercase", margin: "1.5rem 0 0.75rem", paddingBottom: 4, borderBottom: `2px solid ${colors.teal}` }}>
        2 — Transformation des données
      </div>

      <Card title="Outil de transformation — Arbre de décision" accent={colors.teal} icon="⚙️">
        <Table
          headers={["Outil", "Langage", "Profil", "Idéal pour", "Limite"]}
          rows={[
            ["Dataflow Gen2", "Power Query (M)", "Low-code", "Nettoyage simple, jointures, pivots, 200+ connecteurs", "Volumes limités, pas de ML"],
            ["Notebook PySpark", "Python / Spark SQL / Scala", "Code-first", "Transformations complexes, ML, Delta MERGE, streaming", "Requiert expertise Spark"],
            ["T-SQL (Warehouse)", "T-SQL", "SQL developer", "Agrégations Gold, vues, stored procedures, CDC", "Structuré uniquement, pas de fichiers bruts"],
            ["Pipeline (activités)", "Low-code + expressions", "Data engineer", "Orchestration, Copy, conditionnels, boucles ForEach", "Pas de logique de transformation inline"],
            ["KQL (Eventhouse)", "Kusto Query Language", "Data analyst temps réel", "Streaming analytics, séries temporelles, logs, IoT", "Non adapté au batch traditionnel"],
          ]}
        />
        <ExamTip>Question type : "L'équipe veut transformer des données avec des jointures complexes et du ML sans écrire de SQL" → Notebook PySpark. "Transformation low-code sur 50 sources différentes" → Dataflow Gen2.</ExamTip>
      </Card>

      <Card title="Médaillon — Règles de transformation par couche" accent={colors.amber} icon="🥇">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { couche: "Bronze (Raw)", color: "#b45309", rules: ["Ingestion sans transformation (ou minimale)", "Format proche de la source (JSON, CSV, Parquet)", "Conserver les données brutes pour audit/retraitement", "Pas de nettoyage — traçabilité maximale"] },
            { couche: "Silver (Curated)", color: "#0f766e", rules: ["Nettoyage : types, nulls, doublons, encodages", "Standardisation des noms de colonnes", "Jointures avec tables de référence", "Validation des règles métier basiques"] },
            { couche: "Gold (Refined)", color: "#15803d", rules: ["Agrégations et métriques métier (KPIs)", "Modèle dimensionnel (faits + dimensions)", "Tables pré-calculées pour performances BI", "Semantic Model / rapport directement connecté"] },
          ].map((l, i) => (
            <div key={i} style={{ padding: "0.75rem", background: "#f9fafb", borderRadius: 8, borderLeft: `3px solid ${l.color}` }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: l.color, marginBottom: 4 }}>{l.couche}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                {l.rules.map((r, j) => <div key={j} style={{ fontSize: 12, color: "#374151" }}>• {r}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── STREAMING ── */}
      <div style={{ fontSize: 13, fontWeight: 700, color: colors.purple, letterSpacing: 1, textTransform: "uppercase", margin: "1.5rem 0 0.75rem", paddingBottom: 4, borderBottom: `2px solid ${colors.purple}` }}>
        3 — Streaming & temps réel
      </div>

      <Card title="Architecture streaming Fabric — Eventstream + Eventhouse" accent={colors.purple} icon="⚡">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Fabric propose deux stacks pour le temps réel : <strong>Eventstream</strong> (ingestion + routage) et <strong>Eventhouse / KQL</strong> (stockage + analyse). Ils sont conçus pour fonctionner ensemble.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", background: "#faf5ff", padding: "0.75rem", borderRadius: 8, marginBottom: "0.75rem", fontSize: 12 }}>
          {["Sources (Event Hub, Kafka, IoT Hub, HTTP)", "→", "Eventstream (no-code)", "→ Transformations (filtrer, enrichir, agréger)", "→", "Eventhouse (KQL)", "→", "Power BI Real-Time Dashboard"].map((s, i) => (
            <span key={i} style={{ color: s === "→" ? "#9ca3af" : s.startsWith("→") ? "#7c3aed" : "#1f2937", fontWeight: s === "→" || s.startsWith("→") ? 400 : 600, background: s.startsWith("Sources") ? "#ede9fe" : s.includes("Eventstream") ? "#ddd6fe" : s.includes("Eventhouse") ? "#c4b5fd" : s.includes("Power BI") ? "#a78bfa" : "transparent", padding: s.startsWith("Sources") || s.includes("Eventstream") || s.includes("Eventhouse") || s.includes("Power BI") ? "3px 8px" : "0", borderRadius: 4 }}>{s}</span>
          ))}
        </div>
        <Table
          headers={["Composant", "Rôle", "Stockage permanent ?", "Destinations supportées"]}
          rows={[
            ["Eventstream", "Ingestion + routage + transformations en flux", "❌ Non — stream en mémoire", "Eventhouse, Lakehouse (Delta), Activator, Event Hub, HTTP, Warehouse"],
            ["Eventhouse (KQL DB)", "Stockage et requêtage temps réel (séries temporelles)", "✅ Oui — stockage KQL natif", "Power BI Real-Time, Shortcuts OneLake, exports"],
            ["Spark Structured Streaming", "Streaming via notebooks PySpark, micro-batches", "✅ Oui — écrit en Delta", "Lakehouse Delta tables"],
            ["Streaming Dataflows", "Dataflows continus (non batch) pour ingestion temps réel", "✅ Oui — via destinations", "Eventhouse, Lakehouse"],
          ]}
        />
      </Card>

      <Card title="Fenêtres temporelles KQL — Tumbling, Sliding, Session" accent={colors.teal} icon="🪟">
        <Table
          headers={["Type", "Description", "Exemple d'usage"]}
          rows={[
            ["Tumbling (bin)", "Fenêtres fixes, non chevauchantes. Chaque événement appartient à une seule fenêtre.", "Agrégation horaire des ventes"],
            ["Sliding", "Fenêtres qui glissent, chevauchement possible. Un événement peut apparaître dans plusieurs fenêtres.", "Moyenne mobile sur 5 minutes"],
            ["Session", "Fenêtres basées sur l'activité utilisateur (gap d'inactivité = fin de session).", "Durée de session web, parcours utilisateur"],
          ]}
        />
        <CodeBlock code={`// KQL — Exemple de tumbling window (bin)
SalesEvents
| where EventTime > ago(1h)
| summarize TotalAmount = sum(Amount), EventCount = count()
    by bin(EventTime, 5m), Region
| order by EventTime desc

// KQL — Exemple de sliding window
SalesEvents
| summarize AvgAmount = avg(Amount)
    by bin(EventTime, 1m)
| extend MovingAvg5m = series_stats_dynamic(AvgAmount)`} lang="kql" />
        <ExamTip>DP-700 : savoir choisir entre tumbling (agrégation périodique) et sliding (moyenne mobile). Tumbling = bin() dans KQL. Streaming Dataflows ≠ Dataflows Gen2 — ils ont des modèles de traitement différents.</ExamTip>
      </Card>

      <Card title="Eventstream vs Spark Structured Streaming — Quand choisir ?" accent={colors.red} icon="⚖️">
        <Table
          headers={["Critère", "Eventstream", "Spark Structured Streaming"]}
          rows={[
            ["Expérience", "No-code, canvas visuel", "Code PySpark/Scala"],
            ["Latence", "Millisecondes à secondes", "Secondes à minutes (micro-batch)"],
            ["Transformations", "Filtrage, enrichissement, agrégations simples", "Logique complexe, ML, jointures complexes"],
            ["Destination", "Eventhouse, Lakehouse, Activator, webhooks", "Lakehouse (Delta tables)"],
            ["Persistance", "Non — stream en mémoire uniquement", "Oui — écrit des fichiers Delta"],
            ["Sources supportées", "140+ (Event Hub, Kafka, IoT Hub, HTTP...)", "Spark sources (Kafka, Delta, fichiers)"],
          ]}
        />
      </Card>

      {/* ── DÉPENDANCES & ACTUALISATION ── */}
      <div style={{ fontSize: 13, fontWeight: 700, color: colors.green, letterSpacing: 1, textTransform: "uppercase", margin: "1.5rem 0 0.75rem", paddingBottom: 4, borderBottom: `2px solid ${colors.green}` }}>
        4 — Dépendances d'éléments & Stratégies d'actualisation
      </div>

      <Card title="Chaîne de dépendances dans un Pipeline orchestré" accent={colors.green} icon="🔗">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Un pipeline Fabric peut orchestrer des éléments dans l'ordre en respectant les dépendances. Chaque activité attend le succès de la précédente avant de démarrer.
        </p>
        <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "0.875rem", marginBottom: "0.75rem", fontFamily: "monospace", fontSize: 12, lineHeight: 2, color: "#374151" }}>
          <div style={{ color: colors.green, fontWeight: 700 }}>Exemple de chaîne end-to-end :</div>
          <div>1️⃣  <strong>Dataflow Gen2</strong>  → Ingère et nettoie les données sources → écrit en Bronze</div>
          <div>2️⃣  <strong>Notebook PySpark</strong>  → Transforme Bronze → Silver (si succès Dataflow)</div>
          <div>3️⃣  <strong>Notebook PySpark</strong>  → Agrège Silver → Gold (si succès étape 2)</div>
          <div>4️⃣  <strong>Script SQL</strong>  → Rafraîchit vues Warehouse (si succès Gold)</div>
          <div>5️⃣  <strong>Semantic Model Refresh</strong>  → Actualise le modèle Power BI (si succès SQL)</div>
        </div>
        <Table
          headers={["Activité de contrôle", "Rôle dans l'orchestration"]}
          rows={[
            ["ForEach", "Itérer sur une liste de tables, fichiers, entités — parallelisme configurable"],
            ["If Condition", "Branchement conditionnel (succès/échec/complétion)"],
            ["Wait", "Pause planifiée entre activités"],
            ["Lookup", "Récupère des métadonnées pour paramétrer les activités suivantes"],
            ["Set Variable", "Stocke des résultats intermédiaires pour les passer aux activités suivantes"],
            ["Web / Webhook", "Appel HTTP pour notifier un système externe ou déclencher une action"],
          ]}
        />
        <ExamTip>La condition de dépendance peut être : Succeeded, Failed, Skipped ou Completed. Un Pipeline peut ainsi gérer les erreurs et brancher vers une logique de compensation.</ExamTip>
      </Card>

      <Card title={`Stratégies d'actualisation du Semantic Model`} accent={colors.blue} icon="🔁">
        <Table
          headers={["Stratégie", "Description", "Mode stockage requis", "Quand l'utiliser"]}
          rows={[
            ["Full Refresh", "Recharge toutes les tables du modèle", "Import", "Modèles petits, données changeant entièrement"],
            ["Incremental Refresh", "Rafraîchit seulement la fenêtre de données récentes (RangeStart/RangeEnd)", "Import", "Grandes tables de faits avec colonne date fiable"],
            ["Direct Lake", "Lit directement les Delta tables dans OneLake — pas de refresh Import", "Direct Lake", "Lakehouse/Warehouse Gold, latence quasi temps réel"],
            ["DirectQuery", "Requête la source à chaque interaction utilisateur", "DirectQuery", "Données très fraîches, petits volumes, tolérance de latence"],
            ["Composite Model", "Mix Direct Lake + Import ou DirectQuery + Import", "Composite", "Faits en Direct Lake, dimensions en Import (performances)"],
          ]}
        />
        <div style={{ background: "#eff6ff", borderRadius: 8, padding: "0.875rem", marginTop: "0.75rem", border: "1px solid #bfdbfe" }}>
          <div style={{ fontWeight: 600, fontSize: 12, color: colors.blue, marginBottom: 6 }}>⚠️ Direct Lake — points critiques</div>
          <ul style={{ fontSize: 12, color: "#1e40af", margin: 0, paddingLeft: "1.25rem", lineHeight: 1.9 }}>
            <li>Direct Lake lit les fichiers Delta <strong>directement depuis OneLake</strong> — pas de copie en mémoire lors du refresh</li>
            <li>Si la source est une <strong>vue SQL</strong> (pas une table Delta), Direct Lake tombe en mode <strong>DirectQuery</strong> — plus lent</li>
            <li>L'<strong>Incremental Refresh classique</strong> (RangeStart/RangeEnd) n'est pas supporté en Direct Lake pur — gérer l'incrémental au niveau des partitions Delta</li>
            <li>Direct Lake on <strong>OneLake</strong> (multi-source) vs Direct Lake on <strong>SQL endpoint</strong> (mono-source) — comportements différents</li>
          </ul>
        </div>
        <CodeBlock code={`-- Incremental Refresh (Import mode) — Power Query / Pipeline
-- 1. Créer les paramètres RangeStart et RangeEnd (type DateTime)
-- 2. Filtrer sur la colonne date de la table source
-- 3. Configurer la politique d'actualisation incrémentale dans le Service

-- Dans un Pipeline, passer les dates dynamiquement :
-- @utcNow() et @addDays(utcNow(), -30)

-- Pour Direct Lake : gérer l'incrémental à la source
-- Partitionner la table Delta par année/mois
-- OneLake scanne uniquement les partitions nouvelles`} />
      </Card>

      <Card title="Semantic Model Refresh Templates (Août 2025)" accent={colors.teal} icon="🆕">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Depuis août 2025, Fabric permet de créer un pipeline d'actualisation orchestré directement depuis l'interface du Semantic Model (template-driven).
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { step: "1", desc: "Ouvrir le Semantic Model → Refresh dropdown → Create Advanced Refresh" },
            { step: "2", desc: "Sélectionner le template : enchaîner Dataflow → Notebook → Semantic Model Refresh" },
            { step: "3", desc: "Le pipeline est créé automatiquement avec les dépendances correctes" },
            { step: "4", desc: "Planifier le pipeline ou le déclencher à la demande" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "0.5rem 0.75rem", background: "#f0fdfa", borderRadius: 6, border: "1px solid #99f6e4", alignItems: "flex-start" }}>
              <span style={{ background: colors.teal, color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.step}</span>
              <span style={{ fontSize: 13, color: "#134e4a" }}>{s.desc}</span>
            </div>
          ))}
        </div>
        <ExamTip>Avant août 2025, la chaîne Dataflow → Notebook → Semantic Model Refresh devait être créée manuellement dans un Pipeline. Les templates automatisent ce workflow commun.</ExamTip>
      </Card>

      {/* ── COLLABORATION ── */}
      <div style={{ fontSize: 13, fontWeight: 700, color: colors.amber, letterSpacing: 1, textTransform: "uppercase", margin: "1.5rem 0 0.75rem", paddingBottom: 4, borderBottom: `2px solid ${colors.amber}` }}>
        5 — Collaboration & Stratégie Git
      </div>

      <Card title="Modèle de collaboration par rôle" accent={colors.amber} icon="👥">
        <Table
          headers={["Profil", "Outil principal", "Rôle workspace", "Workflow Git"]}
          rows={[
            ["Data engineer", "Notebooks, Pipelines, PBIP", "Contributor", "Feature branch → PR → merge main"],
            ["Analytics engineer", "Semantic Models, Dataflows Gen2", "Contributor", "Feature branch → PR → merge main"],
            ["BI developer", "Power BI Desktop (PBIP/PBIX), Rapports", "Contributor", "PBIP + Git, ou publish depuis Desktop"],
            ["QA / Test", "Monitoring Hub, requêtes SQL", "Viewer (Test env)", "Validation avant merge vers main"],
            ["Data consumer", "Rapports Power BI, Apps", "Viewer", "Pas de contribution Git"],
            ["Domain Admin", "OneLake Catalog, Endorsement", "Workspace Admin", "Certification des items Gold"],
          ]}
        />
      </Card>

      <Card title="Stratégie de branches Git recommandée" accent={colors.purple} icon="🌿">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Il n'y a pas d'isolation de branche au sein d'un workspace Fabric partagé. Tout changement direct dans le workspace est immédiatement visible de tous. La bonne pratique est de travailler en isolation sur des branches personnelles.
        </p>
        <div style={{ background: "#faf5ff", borderRadius: 8, padding: "0.875rem", marginBottom: "0.75rem", fontSize: 12, lineHeight: 2 }}>
          <div style={{ color: colors.purple, fontWeight: 700, marginBottom: 4 }}>Workflow recommandé Microsoft :</div>
          <div><strong>main</strong> → branche protégée, connectée au workspace Prod</div>
          <div><strong>dev</strong> → branche d'intégration, connectée au workspace Dev partagé</div>
          <div><strong>feature/xxx</strong> → branche personnelle du développeur, connectée à son workspace isolé</div>
          <div style={{ marginTop: 8, color: "#6b7280" }}>feature/xxx → commit → PR vers dev → review → merge → Deployment Pipeline → Test → Prod</div>
        </div>
        <Table
          headers={["Règle Git Fabric", "Explication"]}
          rows={[
            ["1 workspace = 1 branche", "Un workspace ne peut être connecté qu'à une seule branche à la fois"],
            ["Workspace partagé = risque", "Modifier directement le workspace dev partagé affecte tous les utilisateurs immédiatement"],
            ["Workspace isolé par dev", "Chaque développeur crée son propre workspace temporaire connecté à sa feature branch"],
            ["commit size limit", "Ne pas commiter de gros fichiers (images, binaires) — risque de dépasser la limite de taille"],
            ["Pas de données dans Git", "Les données Delta (.parquet, .abf) ne doivent jamais être committées"],
          ]}
        />
        <ExamTip>Limitation clé Fabric Git : il n'y a pas d'isolation de branche dans un workspace. Pour isoler les développeurs, créer des workspaces individuels avec feature branches.</ExamTip>
      </Card>

      {/* ── DÉPLOIEMENT CI/CD ── */}
      <div style={{ fontSize: 13, fontWeight: 700, color: colors.blue, letterSpacing: 1, textTransform: "uppercase", margin: "1.5rem 0 0.75rem", paddingBottom: 4, borderBottom: `2px solid ${colors.blue}` }}>
        6 — Déploiement & CI/CD
      </div>

      <Card title="Deployment Pipelines — Dev → Test → Prod" accent={colors.blue} icon="🚀">
        <Table
          headers={["Caractéristique", "Détail"]}
          rows={[
            ["Stages possibles", "De 2 à 10 stages configurables (défaut : Dev / Test / Prod)"],
            ["Structure requise", "1 workspace SÉPARÉ par stage — mandatory"],
            ["Items supportés", "Lakehouses, Warehouses, Pipelines, Notebooks, Semantic Models, Rapports, Dataflows Gen2"],
            ["Promotion", "Sélective (item par item) ou globale (tout le workspace)"],
            ["Deployment Rules", "Paramètres différents par stage (server, database, connection strings)"],
            ["Rôles requis", "Admin du pipeline de déploiement + accès aux workspaces source et cible"],
            ["Git integration", "Git pour versionning + Deployment Pipelines pour promotion — peuvent coexister"],
          ]}
        />
        <Warning>Depuis février 2026, les Deployment Pipelines ne supportent plus les Semantic Models non migrés vers Enhanced Metadata. Vérifier la compatibilité avant déploiement.</Warning>
        <ExamTip>Deployment Pipeline = outil ALM (Application Lifecycle Management) de Fabric. Git = outil de versionning. Les deux sont complémentaires : Git pour le code source, Deployment Pipelines pour la promotion entre environnements.</ExamTip>
      </Card>

      <Card title="Monitoring — Outils disponibles" accent={colors.purple} icon="📊">
        <Table
          headers={["Outil", "Usage", "Portée"]}
          rows={[
            ["Monitoring Hub", "Statut des runs pipeline, notebook, dataflow — en cours et récents", "Workspace"],
            ["Capacity Metrics App", "Consommation CU, throttling, smoothing par workload", "Capacity (tenant)"],
            ["Query Insights", "Historique requêtes Warehouse (performances, durée, user)", "Warehouse"],
            ["DMVs (sys.dm_exec_*)", "Sessions actives et requêtes en cours (temps réel)", "Warehouse"],
            ["Spark UI", "DAG, stages, tasks des jobs Spark", "Notebook / Lakehouse"],
            ["Workspace Monitoring", "Logs KQL-queryables sur activités du workspace", "Workspace"],
            ["Audit Logs (M365)", "Toutes les activités Fabric (accès, modifications, partage)", "Tenant"],
          ]}
        />
        <ExamTip>"Requêtes Warehouse dégradées les 60 dernières minutes avec nom d'utilisateur" → Query Insights. "Consommation totale de capacité et throttling" → Capacity Metrics App. "Qui a accédé à quel dataset ?" → Audit Logs.</ExamTip>
      </Card>

      <Card title="Capacity Management — SKUs & Throttling" accent={colors.amber} icon="⚡">
        <Table
          headers={["Concept", "Explication"]}
          rows={[
            ["CU (Capacity Unit)", "Unité de mesure compute. SKUs F2 à F2048 définissent le pool disponible"],
            ["Smoothing (lissage)", "Fabric lisse les pics de consommation sur 24h — pas de throttling immédiat sur un burst court"],
            ["Throttling", "Si les CU dépassent le pool sur une période prolongée, les requêtes sont ralenties puis rejetées"],
            ["Autoscale Billing (Spark)", "Facturation à la seconde pour Spark — évite de surdimensionner la capacité fixe"],
            ["F SKU requis pour", "Workspace Identity, Trusted Access, Managed VNet — non disponibles sur Trial ou PPU"],
          ]}
        />
      </Card>

      <Card title="Stratégie de sécurité par environnement" accent={colors.green} icon="🔒">
        <Table
          headers={["Environnement", "Workspace roles", "Données", "Sécurité granulaire"]}
          rows={[
            ["Dev", "Data engineers = Contributor/Admin", "Données fictives ou anonymisées (DDM)", "RLS/CLS en cours de développement"],
            ["Test", "Data engineers = Contributor, QA = Viewer", "Données masquées (DDM + subset réel)", "RLS/CLS IDENTIQUES à Prod"],
            ["Prod", "Data engineers = Contributor, Users = Viewer / item-level", "Données réelles", "RLS + CLS + DDM + OneLake roles complets"],
          ]}
        />
        <ExamTip>La configuration RLS/CLS doit être IDENTIQUE entre Test et Prod pour valider correctement la sécurité avant promotion. Ne jamais exposer les données de production en Dev.</ExamTip>
      </Card>

      <Card title="Déploiement Frontend de l'Application — Vercel & CI/CD" accent={colors.blue} icon="⚡">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Cette application interactive est un projet React moderne packagé avec Vite et configuré pour un déploiement continu (CI/CD) vers <strong>Vercel</strong>.
        </p>
        <Table
          headers={["Composant", "Rôle / Configuration", "Détails"]}
          rows={[
            ["Vercel SPA Routing", "vercel.json (réécritures)", "Toutes les routes pointent vers index.html pour gérer le routage Single Page App."],
            ["Linter & Validation", "npm run lint & npm run build", "Exécutés automatiquement par GitHub Actions sur chaque commit/PR."],
            ["Vercel Deployment", "GitHub Actions workflow", "Les modifications poussées sur 'main' sont poussées en Production, et 'dev' en Preview."],
          ]}
        />
        <CodeBlock code={`// vercel.json (Configuration SPA)
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`} lang="json" />
        <CodeBlock code={`# .github/workflows/deploy.yml (Extrait CI/CD)
name: CI & Deploy to Vercel
jobs:
  build:
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run build
  deploy:
    steps:
      - run: vercel deploy --prebuilt --prod --token=\${{ secrets.VERCEL_TOKEN }}`} lang="yaml" />
      </Card>
    </div>
  ),

  pbiformats: (
    <div>
      <SectionTitle>📄 Formats de fichiers Power BI — PBIX · PBIT · PBIP · PBIDS</SectionTitle>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        Chaque format Power BI a un rôle précis dans le cycle de développement. Le choix du format impacte directement la sécurité, la gouvernance et la capacité à versionner le code.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {[
          { fmt: ".pbix", name: "Power BI Report", color: colors.blue, icon: "📊", tagline: "Le format standard tout-en-un" },
          { fmt: ".pbit", name: "Power BI Template", color: colors.teal, icon: "📋", tagline: "Structure sans données" },
          { fmt: ".pbip", name: "Power BI Project", color: colors.purple, icon: "🗂️", tagline: "Fichiers texte — Git ready" },
          { fmt: ".pbids", name: "PBI Data Source", color: colors.amber, icon: "🔗", tagline: "Connexion uniquement" },
        ].map((f, i) => (
          <div key={i} style={{
            background: `${f.color}10`, border: `1.5px solid ${f.color}40`,
            borderRadius: 12, padding: "1rem", textAlign: "center"
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{f.icon}</div>
            <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: f.color, marginBottom: 4 }}>{f.fmt}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 }}>{f.name}</div>
            <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4 }}>{f.tagline}</div>
          </div>
        ))}
      </div>

      <Card title=".pbix — Power BI Report File (format standard)" accent={colors.blue} icon="📊">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Fichier binaire compressé qui contient <strong>tout</strong> : modèle sémantique, données en cache, rapports, visuels, connexions, RLS, OLS. C'est le format par défaut de Power BI Desktop.
        </p>
        <Table
          headers={["Contenu", "Inclus ?"]}
          rows={[
            ["Modèle sémantique (tables, relations, DAX)", "✅ Oui"],
            ["Données en cache (Import mode)", "✅ Oui — données embarquées dans le fichier"],
            ["Pages et visuels du rapport", "✅ Oui"],
            ["Connexions aux sources (DirectQuery/Live)", "✅ Oui (chaînes de connexion)"],
            ["Rôles RLS définis", "✅ Oui"],
            ["Sensitivity label", "✅ Oui (si appliqué)"],
            ["Lisible par Git / diff", "❌ Non — fichier binaire"],
          ]}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: "0.75rem" }}>
          <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "0.75rem", border: "1px solid #bbf7d0" }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#15803d", marginBottom: 4 }}>✅ Quand l'utiliser</div>
            <ul style={{ fontSize: 12, color: "#166534", margin: 0, paddingLeft: "1.25rem", lineHeight: 1.8 }}>
              <li>Travail solo ou petite équipe</li>
              <li>Partage rapide d'un rapport complet</li>
              <li>Démonstrations et prototypes</li>
              <li>Migration / archivage de rapports</li>
            </ul>
          </div>
          <div style={{ background: "#fff7ed", borderRadius: 8, padding: "0.75rem", border: "1px solid #fed7aa" }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#c2410c", marginBottom: 4 }}>⚠️ Risques sécurité</div>
            <ul style={{ fontSize: 12, color: "#9a3412", margin: 0, paddingLeft: "1.25rem", lineHeight: 1.8 }}>
              <li>Données réelles embarquées = fuite si partagé</li>
              <li>Chaînes de connexion visibles dans le fichier</li>
              <li>Impossible de faire des diff Git propres</li>
              <li>Conflits de merge en équipe</li>
            </ul>
          </div>
        </div>
        <Warning>Ne jamais partager un .pbix contenant des données de production par email ou stockage non sécurisé. Préférer la publication dans le Service avec RLS configuré.</Warning>
        <ExamTip>PBIX = données embarquées → risque de fuite. Pour les données sensibles, publier directement dans le Service et contrôler l'accès via workspace roles + RLS.</ExamTip>
      </Card>

      <Card title=".pbit — Power BI Template (structure sans données)" accent={colors.teal} icon="📋">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Identique au PBIX mais <strong>sans les données en cache</strong>. À l'ouverture, Power BI demande les paramètres de connexion. Idéal pour standardiser des rapports à travers plusieurs équipes ou clients.
        </p>
        <Table
          headers={["Contenu", "Inclus ?"]}
          rows={[
            ["Modèle sémantique (structure, DAX, relations)", "✅ Oui"],
            ["Données en cache", "❌ Non — demandées à l'ouverture"],
            ["Pages et visuels", "✅ Oui"],
            ["Paramètres de connexion (prompts)", "✅ Oui (variables demandées à l'ouverture)"],
            ["Rôles RLS", "✅ Oui (structure des rôles)"],
          ]}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: "0.75rem" }}>
          <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "0.75rem", border: "1px solid #bbf7d0" }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#15803d", marginBottom: 4 }}>✅ Quand l'utiliser</div>
            <ul style={{ fontSize: 12, color: "#166534", margin: 0, paddingLeft: "1.25rem", lineHeight: 1.8 }}>
              <li>Standardiser un rapport pour plusieurs régions</li>
              <li>Distribuer des templates à des clients/filiales</li>
              <li>Onboarding de nouvelles équipes avec la même structure</li>
              <li>Partage sans risque de fuite de données</li>
            </ul>
          </div>
          <div style={{ background: "#f0f9ff", borderRadius: 8, padding: "0.75rem", border: "1px solid #bae6fd" }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#0369a1", marginBottom: 4 }}>📌 Avantage sécurité</div>
            <ul style={{ fontSize: 12, color: "#075985", margin: 0, paddingLeft: "1.25rem", lineHeight: 1.8 }}>
              <li>Aucune donnée réelle dans le fichier</li>
              <li>Peut être partagé librement (email, SharePoint)</li>
              <li>La structure RLS est incluse — chaque équipe branche ses propres données</li>
            </ul>
          </div>
        </div>
        <ExamTip>PBIT = template réutilisable sans données. Si une question demande "comment distribuer la même structure de rapport à 10 régions sans exposer les données des autres" → PBIT.</ExamTip>
      </Card>

      <Card title=".pbip — Power BI Project (Git & CI/CD)" accent={colors.purple} icon="🗂️">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Format moderne basé sur une <strong>structure de dossiers avec fichiers texte</strong> (JSON + TMDL). Conçu pour les équipes de développement, la collaboration Git et les pipelines CI/CD. Depuis janvier 2026, les nouveaux rapports créés dans le Power BI Service utilisent PBIR (sous-format du PBIP) par défaut.
        </p>
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: "0.875rem", marginBottom: "0.75rem", fontFamily: "monospace", fontSize: 12, color: "#374151", lineHeight: 1.8 }}>
          <div style={{ color: "#7c3aed", fontWeight: 600, marginBottom: 4 }}>Structure d'un projet PBIP :</div>
          <div>📁 MonRapport.Report/</div>
          <div style={{ paddingLeft: 16 }}>📄 definition.pbir  <span style={{ color: "#6b7280" }}>(manifest du rapport)</span></div>
          <div style={{ paddingLeft: 16 }}>📄 report.json  <span style={{ color: "#6b7280" }}>(pages, visuels)</span></div>
          <div style={{ paddingLeft: 16 }}>📄 StaticResources/  <span style={{ color: "#6b7280" }}>(images, thèmes)</span></div>
          <div>📁 MonRapport.SemanticModel/</div>
          <div style={{ paddingLeft: 16 }}>📁 definition/  <span style={{ color: "#6b7280" }}>(TMDL — tables, mesures, rôles)</span></div>
          <div style={{ paddingLeft: 32 }}>📄 tables/Ventes.tmdl</div>
          <div style={{ paddingLeft: 32 }}>📄 roles/RLS_Region.tmdl  <span style={{ color: "#6b7280" }}>← RLS versionnée !</span></div>
          <div style={{ paddingLeft: 16 }}>📁 .pbi/</div>
          <div style={{ paddingLeft: 32 }}>📄 cache.abf  <span style={{ color: "#e11d48" }}>(⚠️ à exclure du Git)</span></div>
          <div style={{ paddingLeft: 32 }}>📄 localSettings.json  <span style={{ color: "#e11d48" }}>(⚠️ à exclure du Git)</span></div>
          <div>📄 MonRapport.pbip  <span style={{ color: "#6b7280" }}>(manifest du projet)</span></div>
        </div>
        <Table
          headers={["Contenu", "Inclus / Détail"]}
          rows={[
            ["Modèle sémantique (TMDL)", "✅ Fichiers texte lisibles et versionnables"],
            ["Pages et visuels (JSON)", "✅ Diff Git propre ligne par ligne"],
            ["Rôles RLS / OLS", "✅ Versionnés dans /definition/roles/*.tmdl"],
            ["Données en cache (.abf)", "⚠️ Présent localement — à exclure du .gitignore"],
            ["localSettings.json", "⚠️ Paramètres locaux — à exclure du .gitignore"],
            ["Lisible/diffable par Git", "✅ Oui — format texte humain-lisible"],
          ]}
        />
        <div style={{ background: "#faf5ff", borderRadius: 8, padding: "0.875rem", marginTop: "0.75rem", border: "1px solid #ddd6fe" }}>
          <div style={{ fontWeight: 600, fontSize: 12, color: "#7c3aed", marginBottom: 6 }}>🔒 Impact sécurité du format PBIP</div>
          <ul style={{ fontSize: 12, color: "#5b21b6", margin: 0, paddingLeft: "1.25rem", lineHeight: 1.9 }}>
            <li>Les <strong>définitions RLS et OLS sont vues en clair</strong> dans les fichiers .tmdl → contrôler l'accès au dépôt Git</li>
            <li>Le fichier <code>cache.abf</code> contient des données réelles → <strong>obligatoirement dans .gitignore</strong></li>
            <li>Les <strong>chaînes de connexion</strong> peuvent apparaître en clair → utiliser des variables de paramètre</li>
            <li>La séparation rapport / modèle permet de versionner le modèle seul sans exposer les visuels</li>
            <li>Facilite les <strong>code reviews de sécurité</strong> (PR sur les rôles RLS, les mesures DAX)</li>
          </ul>
        </div>
        <CodeBlock code={`# .gitignore recommandé pour un projet PBIP
*.SemanticModel/.pbi/cache.abf
*.SemanticModel/.pbi/localSettings.json
*.Report/.pbi/localSettings.json
# Ne PAS ignorer les fichiers TMDL ni les JSON de définition
# Ne PAS ignorer les fichiers de rôles (roles/*.tmdl)`} lang="bash" />
        <ExamTip>PBIP + Git = les définitions RLS/OLS sont versionnées dans des fichiers texte. C'est l'approche recommandée pour les équipes enterprise avec CI/CD. Le cache.abf (données locales) doit TOUJOURS être dans .gitignore.</ExamTip>
      </Card>

      <Card title=".pbids — Power BI Data Source (connexion uniquement)" accent={colors.amber} icon="🔗">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Fichier JSON léger qui stocke uniquement les <strong>informations de connexion</strong> à une source de données. N'ouvre pas un rapport — démarre Power BI Desktop en mode "Obtenir des données" avec la source pré-configurée.
        </p>
        <CodeBlock code={`{
  "version": "0.1",
  "connections": [
    {
      "details": {
        "protocol": "tds",
        "address": {
          "server": "monserveur.database.windows.net",
          "database": "FabricWarehouse"
        }
      },
      "options": {},
      "mode": "DirectQuery"
    }
  ]
}`} lang="json" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: "0.75rem" }}>
          <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "0.75rem", border: "1px solid #bbf7d0" }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#15803d", marginBottom: 4 }}>✅ Quand l'utiliser</div>
            <ul style={{ fontSize: 12, color: "#166534", margin: 0, paddingLeft: "1.25rem", lineHeight: 1.8 }}>
              <li>Onboarding de nouveaux développeurs</li>
              <li>Standardiser les connexions à un Warehouse/Lakehouse</li>
              <li>Distribuer des configurations de source sans rapport</li>
              <li>Automatiser la configuration des connexions via scripts</li>
            </ul>
          </div>
          <div style={{ background: "#fff7ed", borderRadius: 8, padding: "0.75rem", border: "1px solid #fed7aa" }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#c2410c", marginBottom: 4 }}>⚠️ Points de vigilance</div>
            <ul style={{ fontSize: 12, color: "#9a3412", margin: 0, paddingLeft: "1.25rem", lineHeight: 1.8 }}>
              <li>Ne jamais inclure de credentials dans le fichier</li>
              <li>Utiliser l'authentification Windows/Entra uniquement</li>
              <li>Vérifier que le serveur cible est bien le serveur de prod autorisé</li>
            </ul>
          </div>
        </div>
        <ExamTip>PBIDS ne contient ni données ni visuels — juste la connexion. Utile pour distribuer uniformément la configuration de connexion à un Fabric Warehouse à toute une équipe.</ExamTip>
      </Card>

      <Card title="Tableau de décision — Quel format choisir ?" accent={colors.green} icon="🎯">
        <Table
          headers={["Besoin", "Format recommandé", "Raison"]}
          rows={[
            ["Rapport final à publier dans le Service", ".pbix → publier via Desktop ou Deployment Pipeline", "Format standard, publication directe"],
            ["Partager une structure de rapport sans données", ".pbit", "Aucune donnée embarquée"],
            ["Collaboration en équipe + Git + CI/CD", ".pbip (+ TMDL)", "Fichiers texte, diff propre, versionner les rôles RLS"],
            ["Standardiser une connexion source pour l'équipe", ".pbids", "Connexion uniquement, sans rapport ni données"],
            ["Développement solo, rapport simple", ".pbix", "Simplicité, tout-en-un"],
            ["Environnement enterprise avec audit des rôles RLS", ".pbip", "Rôles RLS versionnés et auditables dans Git"],
            ["Template multi-clients avec données différentes", ".pbit", "Structure partagée, chaque client branche ses données"],
          ]}
        />
      </Card>

      <Card title="Sensitivity Labels & formats de fichiers" accent={colors.red} icon="🏷️">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          Les sensitivity labels se comportent différemment selon le format de fichier.
        </p>
        <Table
          headers={["Format", "Label conservé ?", "Chiffrement appliqué ?", "Comportement"]}
          rows={[
            [".pbix", "✅ Oui", "✅ Si label avec protection", "Label et chiffrement appliqués au fichier sauvegardé"],
            [".pbit", "✅ Oui", "✅ Si label avec protection", "Label hérité par les rapports créés depuis le template"],
            [".pbip", "✅ Oui (dans métadonnées)", "⚠️ Partiel", "Label versionnable, mais le chiffrement s'applique au niveau service"],
            [".pbids", "❌ Non applicable", "❌ Non", "Fichier de connexion uniquement, pas de données à protéger"],
          ]}
        />
        <Warning>Un .pbix avec un sensitivity label "Confidentiel" et chiffrement activé ne peut être ouvert que par les utilisateurs ayant les permissions Purview correspondantes — même si le fichier est partagé par email.</Warning>
      </Card>

      <Card title="PBIX vs PBIP — Résumé visuel" accent={colors.purple} icon="⚖️">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            {
              fmt: "PBIX", color: colors.blue,
              pros: ["Simple à partager", "Tout-en-un", "Compatibilité maximale"],
              cons: ["Données embarquées (risque fuite)", "Binaire → pas de diff Git", "Conflits en équipe", "Impossible d'auditer les changements RLS"]
            },
            {
              fmt: "PBIP", color: colors.purple,
              pros: ["Git ready (diff, PR, branches)", "RLS/OLS versionnés et auditables", "CI/CD et Deployment Pipelines", "Revue de code des mesures DAX"],
              cons: ["Cache.abf à exclure du Git", "Setup initial plus complexe", "Preview features à activer", "Pas de format binaire simple à partager"]
            }
          ].map((item, i) => (
            <div key={i} style={{ background: `${item.color}08`, border: `1px solid ${item.color}30`, borderRadius: 10, padding: "1rem" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: item.color, marginBottom: 8 }}>.{item.fmt.toLowerCase()}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#15803d", marginBottom: 4 }}>✅ Avantages</div>
              {item.pros.map((p, j) => <div key={j} style={{ fontSize: 12, color: "#166534", marginBottom: 2 }}>• {p}</div>)}
              <div style={{ fontSize: 12, fontWeight: 600, color: "#b91c1c", margin: "8px 0 4px" }}>❌ Inconvénients</div>
              {item.cons.map((c, j) => <div key={j} style={{ fontSize: 12, color: "#991b1b", marginBottom: 2 }}>• {c}</div>)}
            </div>
          ))}
        </div>
      </Card>
    </div>
  ),

  scenarios: (
    <div>
      <SectionTitle>🎯 Scénarios de Certification (DP-600 / DP-700)</SectionTitle>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        Testez vos connaissances avec ces scénarios réalistes basés sur le style des examens DP-600 et DP-700. Sélectionnez une réponse puis cliquez sur "Voir la réponse".
      </p>
      {scenarios.map(s => <ScenarioCard key={s.id} scenario={s} />)}
      <Card title="Récapitulatif — Arbre de décision sécurité" accent={colors.blue} icon="🌳">
        <div style={{ fontSize: 13, color: "#374151", lineHeight: 2 }}>
          <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Quand utiliser quoi ?</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { q: "Cacher des LIGNES selon l'utilisateur", r: "→ RLS", color: colors.blue },
              { q: "Interdire l'accès à des COLONNES", r: "→ CLS (DENY)", color: colors.teal },
              { q: "Cacher une TABLE entière (même les métas)", r: "→ OLS (Semantic model)", color: colors.purple },
              { q: "Masquer des valeurs (garder le format)", r: "→ DDM", color: colors.amber },
              { q: "Restreindre accès dossiers/fichiers Lakehouse", r: "→ OneLake Data Access Roles", color: colors.green },
              { q: "Isoler des équipes complètes", r: "→ Workspaces séparés", color: colors.red },
              { q: "Conformité + classification données", r: "→ Purview Sensitivity Labels", color: colors.gray },
              { q: "Accès machine-to-machine sécurisé", r: "→ Service Principal / Workspace Identity", color: colors.blue },
            ].map((item, i) => (
              <div key={i} style={{ padding: "0.6rem", background: "#f9fafb", borderRadius: 8, borderLeft: `3px solid ${item.color}` }}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{item.q}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.r}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
};
Object.assign(FULL_CONTENT, _SECTIONS_DATA);
function ArchiScenariosSection() {
  const archiScenarios = [
    {
      id: 7, difficulty: "Moyen", color: "amber",
      question: "Une entreprise veut que ses data engineers accèdent aux couches Bronze et Silver, mais que les analystes métier n'accèdent qu'à Gold. Quelle architecture recommandez-vous ?",
      options: [
        "A. Un seul Lakehouse avec 3 schémas (bronze, silver, gold) et RLS par couche",
        "B. 3 Lakehouses dans un même workspace avec des rôles item différents",
        "C. 3 Lakehouses dans 3 workspaces séparés, avec des rôles workspace différents par workspace",
        "D. Un Warehouse unique avec des vues par couche et CLS",
      ],
      answer: 2,
      explanation: "Workspaces séparés par couche = contrôle d'accès indépendant + isolation des incidents (blast radius) + lineage clair. Les data engineers ont Contributor sur Bronze/Silver, les analystes ont Viewer sur Gold uniquement. Microsoft Learn recommande explicitement cette approche pour les environnements enterprise.",
    },
    {
      id: 8, difficulty: "Moyen", color: "amber",
      question: "Votre équipe BI utilise principalement T-SQL, crée des vues, procédures stockées et rapports Power BI. Elle n'a pas besoin de Spark ni de ML. Quelle solution pour la couche Gold ?",
      options: [
        "A. Lakehouse — plus flexible et supporté par toutes les équipes",
        "B. Warehouse — T-SQL complet (DDL + DML), RLS/CLS natifs, idéal pour les équipes SQL",
        "C. Eventhouse — pour des requêtes analytiques rapides",
        "D. Lakehouse avec SQL Analytics Endpoint uniquement",
      ],
      answer: 1,
      explanation: "Warehouse = T-SQL complet pour les équipes SQL. CREATE SECURITY POLICY (RLS), GRANT/DENY (CLS), DDM, views, stored procedures — tout en T-SQL natif. Le SQL Analytics Endpoint d'un Lakehouse est en lecture seule et ne supporte pas DML ni les politiques de sécurité T-SQL.",
    },
    {
      id: 9, difficulty: "Difficile", color: "red",
      question: "Vous avez un Lakehouse Gold dans Workspace A. L'équipe Analytics veut créer des semantic models Power BI pointant vers ces données SANS copier les données dans leur workspace. Quelle solution ?",
      options: [
        "A. Créer un Pipeline qui copie les données Gold dans Analytics Workspace toutes les heures",
        "B. Utiliser un Shortcut depuis Analytics Workspace vers le Gold Lakehouse du Data Workspace",
        "C. Configurer Mirroring entre les deux Lakehouses",
        "D. Donner aux analystes le rôle Contributor dans le Data Workspace",
      ],
      answer: 1,
      explanation: "Shortcut = lien virtuel sans copie physique. Les données restent dans le Gold Lakehouse (Workspace A), les analystes y accèdent depuis Analytics Workspace via shortcut. La sécurité OneLake source est héritée automatiquement. Pas de duplication, accès quasi temps réel, une seule copie des données.",
    },
    {
      id: 10, difficulty: "Difficile", color: "red",
      question: "Un Fabric Admin veut permettre à un groupe d'utilisateurs de créer des workspaces Fabric sans leur donner des droits admin globaux. Comment procéder ?",
      options: [
        "A. Les ajouter comme Capacity Admin sur toutes les capacités",
        "B. Créer un groupe de sécurité et l'ajouter au tenant setting 'Create workspaces' dans le portail Admin",
        "C. Donner le rôle Member dans tous les workspaces existants",
        "D. Activer le tenant setting 'Enable Microsoft Fabric for the entire organization'",
      ],
      answer: 1,
      explanation: "Le tenant setting 'Create workspaces' permet de restreindre la création de workspaces à des groupes de sécurité spécifiques sans donner des droits admin globaux. Capacity Admin donnerait trop de pouvoir. Member dans les workspaces existants n'autorise pas la création de nouveaux workspaces.",
    },
    {
      id: 11, difficulty: "Expert", color: "purple",
      question: "Votre organisation veut synchroniser une base Azure SQL (OLTP, données changeant en continu) dans Fabric pour l'analytique, avec une latence maximale de quelques minutes. Quelle solution ?",
      options: [
        "A. Pipeline Data Factory avec trigger toutes les 15 minutes (Copy Activity)",
        "B. Shortcut vers Azure SQL Database",
        "C. Fabric Mirroring d'Azure SQL Database vers OneLake",
        "D. Dataflow Gen2 avec refresh planifié toutes les 30 minutes",
      ],
      answer: 2,
      explanation: "Mirroring = réplication continue automatique d'Azure SQL dans OneLake, quasi temps réel (Change Data Capture), sans orchestration manuelle. Shortcut ne supporte pas Azure SQL directement (seulement ADLS, S3, GCS). Pipeline/Dataflow sont batch et ajoutent de la latence. Mirroring est la solution native pour les sources OLTP → Fabric analytique.",
    },
    {
      id: 12, difficulty: "Expert", color: "purple",
      question: "SCÉNARIO COMPLET : Une entreprise Healthcare veut (1) accès patients uniquement aux médecins de leur service, (2) numéros de dossier masqués pour les administratifs, (3) table 'RechercheClinique' invisible aux non-chercheurs, (4) traçabilité complète HIPAA. Combinaison optimale ?",
      options: [
        "A. RLS + DDM + audit logs uniquement",
        "B. RLS (par service) + DDM (numéros dossier) + OLS (table RechercheClinique) + Purview Audit Logs",
        "C. CLS + OLS + audit logs — RLS n'est pas nécessaire",
        "D. OneLake Security Roles uniquement avec des rôles personnalisés par service",
      ],
      answer: 1,
      explanation: "Defense in depth complète : RLS filtre les lignes par service du médecin (accès horizontal), DDM masque les numéros de dossier pour les administratifs (format visible, valeur masquée), OLS cache totalement la table RechercheClinique aux non-chercheurs (même les métadonnées sont invisibles), Purview Audit Logs pour la traçabilité HIPAA. Chaque besoin correspond à un outil précis.",
    },
  ];
  const [selected, setSelected] = useState({});
  const [revealed, setRevealed] = useState({});
  return (
    <div>
      <SectionTitle>🧠 Scénarios Architecture & Gouvernance</SectionTitle>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: 14, lineHeight: 1.6 }}>
        Questions d'architecture, choix de composants et gouvernance — style cas pratiques DP-600 / DP-700.
      </p>
      {archiScenarios.map(scenario => {
        const sel = selected[scenario.id];
        const rev = revealed[scenario.id];
        return (
          <Card key={scenario.id} accent={colors[scenario.color] || colors.blue}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
              <Badge text={`Q${scenario.id}`} color="blue" />
              <Badge text={scenario.difficulty} color={scenario.color} />
            </div>
            <p style={{ fontSize: 14, color: "#1f2937", marginBottom: "0.75rem", fontWeight: 500, lineHeight: 1.5 }}>
              {scenario.question}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "0.75rem" }}>
              {scenario.options.map((opt, i) => {
                let bg = "#f9fafb", border = "1px solid #e5e7eb", col = "#374151";
                if (rev) {
                  if (i === scenario.answer) { bg = "#dcfce7"; border = "1px solid #86efac"; col = "#15803d"; }
                  else if (sel === i) { bg = "#fee2e2"; border = "1px solid #fca5a5"; col = "#b91c1c"; }
                } else if (sel === i) { bg = "#dbeafe"; border = "1px solid #93c5fd"; col = "#1d4ed8"; }
                return (
                  <button key={i} id={`archi-q${scenario.id}-opt-${i}`} onClick={() => !rev && setSelected(p => ({ ...p, [scenario.id]: i }))} style={{
                    background: bg, border, borderRadius: 6, padding: "8px 12px",
                    cursor: rev ? "default" : "pointer", textAlign: "left",
                    fontSize: 13, color: col, transition: "all 0.15s"
                  }}>{opt}</button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button id={`archi-q${scenario.id}-reveal-btn`} onClick={() => sel !== undefined && setRevealed(p => ({ ...p, [scenario.id]: true }))} disabled={sel === undefined} style={{
                background: sel !== undefined ? colors.blue : "#d1d5db",
                color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px",
                fontSize: 13, cursor: sel !== undefined ? "pointer" : "not-allowed", fontWeight: 600
              }}>Voir la réponse</button>
              <button id={`archi-q${scenario.id}-reset-btn`} onClick={() => { setSelected(p => { const n = {...p}; delete n[scenario.id]; return n; }); setRevealed(p => { const n = {...p}; delete n[scenario.id]; return n; }); }} style={{
                background: "transparent", border: "1px solid #d1d5db", borderRadius: 6,
                padding: "6px 14px", fontSize: 13, cursor: "pointer", color: "#6b7280"
              }}>Réinitialiser</button>
            </div>
            {rev && (
              <div style={{ marginTop: "0.75rem", padding: "0.75rem 1rem", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                <p style={{ fontSize: 13, color: "#166534", margin: "0 0 0.4rem", fontWeight: 600 }}>
                  ✅ Réponse : {scenario.options[scenario.answer]}
                </p>
                <p style={{ fontSize: 13, color: "#166534", margin: 0, lineHeight: 1.5 }}>{scenario.explanation}</p>
              </div>
            )}
          </Card>
        );
      })}
      <Card title="Arbre de décision — Architecture Fabric" accent={colors.purple} icon="🌳">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
          {[
            { q: "Équipe SQL, BI, T-SQL natif", r: "→ Warehouse (Gold)", color: colors.blue },
            { q: "Équipe Spark/Python/ML", r: "→ Lakehouse", color: colors.teal },
            { q: "Données externes sans copie", r: "→ Shortcut", color: colors.green },
            { q: "Source OLTP → temps réel", r: "→ Mirroring", color: colors.purple },
            { q: "Orchestration ETL complexe", r: "→ Pipeline Data Factory", color: colors.amber },
            { q: "Isolation sécurité par couche", r: "→ 1 Workspace par couche Médaillon", color: colors.red },
            { q: "Dev → Test → Prod automatisé", r: "→ Deployment Pipelines + Git", color: colors.blue },
            { q: "Délégation gouvernance métier", r: "→ Domains + Domain Admins", color: colors.teal },
            { q: "Trust d'un dataset pour toute l'org", r: "→ Endorsement Certified", color: colors.green },
            { q: "Lineage bout en bout", r: "→ OneLake Catalog > onglet Lineage", color: colors.purple },
            { q: "Streaming IoT/logs temps réel", r: "→ Eventhouse + KQL", color: colors.amber },
            { q: "Low-code transformation", r: "→ Dataflows Gen2", color: colors.blue },
          ].map((item, i) => (
            <div key={i} style={{ padding: "0.6rem", background: "#f9fafb", borderRadius: 8, borderLeft: `3px solid ${item.color}` }}>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{item.q}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.r}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════ GIT & COLLABORATION ═══════════════ */
const GIT_PROFILES = [
  { id:"solo",       label:"Solo / POC",        icon:"👤", team:"1-2 devs",  region:"1 region",       constraint:"Simplicite maximale" },
  { id:"small",      label:"Petite equipe",      icon:"👥", team:"3-8 devs",  region:"1 region",       constraint:"Collaboration legere" },
  { id:"medium",     label:"Equipe moyenne",     icon:"🏢", team:"8-25 devs", region:"1-2 regions",    constraint:"CI/CD structure" },
  { id:"large",      label:"Grande organisation",icon:"🌐", team:"25+ devs",  region:"Multi-regions",  constraint:"Gouvernance stricte" },
  { id:"regulated",  label:"Secteur regule",     icon:"🏦", team:"Variable",  region:"Multi-pays",     constraint:"Audit + Compliance" },
];

const GIT_STRATEGIES = {
  solo: {
    color:C.green,
    branches:["main (production)", "feature/nom-ticket (developpement)"],
    workspaces:["1 workspace Dev connecte a main", "Pas de workspace Test/Prod separe pour le POC"],
    flow:"feature branch → commit → merge main direct (pas de PR obligatoire)",
    gitignore:["*.SemanticModel/.pbi/cache.abf", "*.Report/.pbi/localSettings.json"],
    risks:["Pas d'isolation Dev/Prod — risque de casser la prod","Pas de review de code","Pas adapte a la certification"],
    tip:"Acceptable pour exploration. Migrer vers strategie equipe avant mise en production reelle.",
  },
  small: {
    color:C.blue,
    branches:["main (prod, protegee)", "dev (integration partagee)", "feature/nom/ticket (dev individuel)"],
    workspaces:["Workspace Dev Partage → branche dev","Workspace Prod → branche main","Chaque dev: workspace isole personnel → feature branch"],
    flow:"feature → PR vers dev → review 1 approbateur → merge → Deployment Pipeline → Prod",
    gitignore:["*.SemanticModel/.pbi/cache.abf","*.SemanticModel/.pbi/localSettings.json","*.Report/.pbi/localSettings.json"],
    risks:["Le workspace dev partage est un environnement live","Conflits de merge si plusieurs devs sur le meme item"],
    tip:"1 workspace = 1 branche Git (regle absolue Fabric). Chaque dev DOIT avoir son workspace isole.",
  },
  medium: {
    color:C.purple,
    branches:["main (prod, protected)","release/version (staging, freeze avant prod)","dev (integration continue)","feature/equipe/ticket","hotfix/id (correctifs urgents)"],
    workspaces:["WS Prod → branche main","WS Staging → branche release","WS Dev → branche dev","WS isole par dev → feature branch"],
    flow:"feature → PR vers dev → tests CI → merge → release freeze → UAT → Deployment Pipeline → Prod",
    gitignore:["*.SemanticModel/.pbi/cache.abf","*.SemanticModel/.pbi/localSettings.json","*.Report/.pbi/localSettings.json"],
    risks:["Merge contention sur branche dev","Deployment Pipelines: 1 workspace SEPARE par stage obligatoire","Cout Fabric: chaque workspace consomme des ressources"],
    tip:"Separer les workspaces par couche (Bronze/Silver/Gold) ET par environnement (Dev/Test/Prod).",
  },
  large: {
    color:C.red,
    branches:["main (prod globale)","release/version","dev/domaine (Finance-dev, RH-dev...)","feature/equipe/ticket","hotfix/id"],
    workspaces:["Workspaces par domaine metier + par environnement","Ex: Finance-Bronze-Dev, Finance-Silver-Dev, Finance-Gold-Dev","Workspace isolation par region geographique (RGPD, souverainete)"],
    flow:"feature → PR vers domain-dev → review equipe → merge → release planning → multi-stage Deployment Pipeline → Prod",
    gitignore:["*.SemanticModel/.pbi/cache.abf","*.SemanticModel/.pbi/localSettings.json","*.Report/.pbi/localSettings.json","**/Credentials/**","**/secrets/**"],
    risks:["Explosion du nombre de workspaces","Coherence des Deployment Rules entre regions","Gouvernance des permissions Git cross-equipes"],
    tip:"Utiliser les Fabric Domains pour grouper les workspaces par domaine metier.",
  },
  regulated: {
    color:C.amber,
    branches:["main (prod, IMMUTABLE — pas de force push jamais)","release/version (code freeze obligatoire)","dev (integration)","feature/ticket-compliance","audit/id (branches investigation)"],
    workspaces:["Separation stricte Dev/Test/Prod (Deployment Pipelines obligatoires)","Workspace Audit dedie (lecture seule)","Workspace de Test de securite (test RLS/CLS avant promotion)"],
    flow:"feature → review securite → PR 2 approbateurs → merge dev → QA → release freeze → Deployment Pipeline → Prod → audit log",
    gitignore:["*.SemanticModel/.pbi/cache.abf","*.SemanticModel/.pbi/localSettings.json","*.Report/.pbi/localSettings.json","**/PrivateKeys/**"],
    risks:["Audit Trail: chaque commit Git doit referencer un ticket de change management","Sensitivity Labels appliques avant la promotion vers Prod","RGPD/HIPAA: donnees de test anonymisees obligatoires"],
    tip:"Les roles RLS/CLS doivent etre definis en TMDL (versions Git) et valides via PR review avant merge vers main.",
  },
};

const GIT_EXPERT_QS = [
  {
    q:"Combien de developpeurs travaillent simultanement sur les memes items Fabric ?",
    why:"Si plusieurs devs partagent un workspace, tout changement direct impacte tous immediatement.",
    choices:["1-2 devs → workspace partage OK","3-8 devs → workspaces isoles par dev","8+ devs → workspaces par domaine + CI/CD automatise"],
  },
  {
    q:"Vos donnees sont-elles soumises a des contraintes regionales (RGPD, HIPAA, souverainete) ?",
    why:"La residence des donnees dans OneLake depend de la capacite assignee. Chaque region necessite une capacite distincte.",
    choices:["1 region → 1 capacite + workspace standard","Multi-regions EU → F SKU par region + Multi-Geo","Souverainete stricte → capacites dediees par pays"],
  },
  {
    q:"Avez-vous besoin d'un audit trail complet des modifications ?",
    why:"Git fournit l'historique des commits. Mais les modifications directes dans le workspace ne sont pas capturees par Git.",
    choices:["Audit leger → Git history suffit","Audit complet → Git + Audit Logs M365 + PR reviews documentees","Audit reglementaire → branches protegees + 2 approbateurs + tags immutables"],
  },
  {
    q:"Vos politiques RLS, OLS et CLS evoluent-elles frequemment ?",
    why:"En format PBIP, les roles RLS/OLS sont versions dans des fichiers TMDL. Les PR permettent de valider les changements de securite.",
    choices:["Stables → versionner une fois, peu de reviews","Variables → PBIP obligatoire + PR review securite","Critiques → reviewer dedie securite pour toute PR touchant les roles"],
  },
];

function GitSection() {
  const [profile, setProfile] = useState(null);
  const sel = profile ? GIT_STRATEGIES[profile] : null;

  return (
    <div>
      <STitle>{"🌿 Git Integration & Collaboration — Strategies par profil"}</STitle>
      <p style={{color:"#6b7280",marginBottom:"1.5rem",fontSize:14,lineHeight:1.6}}>
        {"Strategies Git adaptees au profil d'equipe, nombre de developpeurs, contraintes regionales et de conformite."}
      </p>

      <Card title={"Regles fondamentales Git dans Fabric"} accent={C.teal} icon={"📋"}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[
            {r:"1 Workspace = 1 branche Git",d:"Un workspace ne peut etre connecte qu'a une seule branche a la fois. Regle absolue Fabric.",c:C.red},
            {r:"Workspace = environnement LIVE",d:"Tout changement direct dans le workspace est immediatement visible de tous les membres.",c:C.red},
            {r:"Branch out to new workspace",d:"Creer un workspace isole connecte a une feature branch en quelques clics depuis Source Control.",c:C.green},
            {r:"Donnees jamais dans Git",d:"cache.abf, fichiers Parquet, Delta — jamais commites. Seules les definitions TMDL et JSON.",c:C.amber},
            {r:"Providers supportes",d:"Azure DevOps (Azure Repos) et GitHub. GitLab non supporte nativement.",c:C.blue},
            {r:"Items non versionnables",d:"Certains items Fabric ne supportent pas Git (items preview). Verifier la liste officielle.",c:C.purple},
          ].map((item,i)=>(
            <div key={i} style={{padding:"0.75rem",background:"#f9fafb",borderRadius:8,borderLeft:`3px solid ${item.c}`}}>
              <div style={{fontWeight:700,fontSize:12,color:item.c,marginBottom:3}}>{item.r}</div>
              <div style={{fontSize:12,color:"#374151",lineHeight:1.5}}>{item.d}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={"Selectionner votre profil"} accent={C.purple} icon={"👥"}>
        <p style={{fontSize:13,color:"#6b7280",marginBottom:"0.75rem"}}>{"Choisissez votre profil pour voir la strategie Git recommandee :"}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {GIT_PROFILES.map(p=>(
            <button key={p.id} id={`git-profile-btn-${p.id}`} onClick={()=>setProfile(p.id)} style={{
              background:profile===p.id?C.purple:C.lPurple,
              color:profile===p.id?"#fff":C.purple,
              border:`2px solid ${profile===p.id?C.purple:C.purple+"40"}`,
              borderRadius:10,padding:"0.75rem 0.5rem",cursor:"pointer",textAlign:"center"
            }}>
              <div style={{fontSize:20,marginBottom:4}}>{p.icon}</div>
              <div style={{fontWeight:700,fontSize:11,marginBottom:2}}>{p.label}</div>
              <div style={{fontSize:10,opacity:0.8}}>{p.team}</div>
            </button>
          ))}
        </div>
      </Card>

      {sel && (
        <Card title={GIT_PROFILES.find(p=>p.id===profile).label} accent={sel.color} icon={"🌿"}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"0.75rem"}}>
            <div>
              <div style={{fontWeight:600,fontSize:12,color:sel.color,marginBottom:6}}>{"Branches"}</div>
              {sel.branches.map((b,i)=><div key={i} style={{fontFamily:"monospace",fontSize:11,color:"#374151",marginBottom:3,padding:"3px 8px",background:"#f0fdf4",borderRadius:4}}>{b}</div>)}
            </div>
            <div>
              <div style={{fontWeight:600,fontSize:12,color:sel.color,marginBottom:6}}>{"Workspaces"}</div>
              {sel.workspaces.map((w,i)=><div key={i} style={{fontSize:11,color:"#374151",marginBottom:3,padding:"3px 8px",background:C.lPurple,borderRadius:4}}>{w}</div>)}
            </div>
          </div>
          <div style={{padding:"0.75rem",background:"#f8fafc",borderRadius:8,marginBottom:"0.75rem"}}>
            <div style={{fontWeight:600,fontSize:12,color:C.blue,marginBottom:4}}>{"Flow de developpement"}</div>
            <div style={{fontFamily:"monospace",fontSize:11,color:"#374151",lineHeight:1.7}}>{sel.flow}</div>
          </div>
          <Code code={["# .gitignore recommande", ...sel.gitignore].join("\n")} lang="bash"/>
          <div style={{marginTop:"0.75rem"}}>
            <div style={{fontWeight:600,fontSize:12,color:C.red,marginBottom:6}}>{"Risques specifiques"}</div>
            {sel.risks.map((r,i)=><div key={i} style={{fontSize:12,color:"#9a3412",marginBottom:4,padding:"4px 8px",background:"#fff7ed",borderRadius:4}}>{"• "}{r}</div>)}
          </div>
          <Tip>{sel.tip}</Tip>
        </Card>
      )}

      <Card title={"Questions d'expert a se poser"} accent={C.indigo} icon={"🧠"}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {GIT_EXPERT_QS.map((item,i)=>(
            <div key={i} style={{padding:"0.875rem",background:C.lIndigo,borderRadius:10,border:`1px solid ${C.indigo}25`}}>
              <div style={{fontWeight:600,fontSize:13,color:C.indigo,marginBottom:4}}>{"Q: "}{item.q}</div>
              <div style={{fontSize:12,color:"#6b7280",marginBottom:6,fontStyle:"italic"}}>{item.why}</div>
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                {item.choices.map((c,j)=>(
                  <div key={j} style={{fontSize:12,color:"#374151",padding:"3px 8px",background:"#fff",borderRadius:5,border:`1px solid ${C.indigo}20`}}>{"→ "}{c}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={"Variable Library — Parametrage par environnement"} accent={C.teal} icon={"📦"}>
        <p style={{fontSize:14,color:"#374151",marginBottom:"0.75rem",lineHeight:1.6}}>
          {"La Variable Library stocke des parametres differents par environnement (Dev/Test/Prod) referenced dans les Pipelines sans modifier le code."}
        </p>
        <T headers={["Variable","Dev","Test","Prod"]}
           rows={[
             ["ServerName","dev-sql.database.windows.net","test-sql.database.windows.net","prod-sql.database.windows.net"],
             ["DatabaseName","FabricDev","FabricTest","FabricProd"],
             ["StorageAccount","devlake","testlake","prodlake"],
           ]}
        />
        <Tip>{"Variable Library + Deployment Rules = zero modification de code entre environnements."}</Tip>
      </Card>

      <Card title={"fabric-cicd — Automatisation via Python"} accent={C.slate} icon={"🐍"}>
        <Code code={`# Installation
pip install fabric-cicd

from fabric_cicd import FabricWorkspace, publish_all_items

workspace = FabricWorkspace(
    workspace_id="PROD-WORKSPACE-ID",
    repository_directory="./fabric_items",
    item_type_in_scope=["Notebook","Pipeline","Lakehouse","SemanticModel"]
)
publish_all_items(workspace)`} lang="python"/>
        <Important>{"fabric-cicd permet d'automatiser le deploiement Fabric dans des pipelines CI/CD Azure DevOps ou GitHub Actions."}</Important>
      </Card>
    </div>
  );
}

/* ═══════════════ ANALYTICS DATA STORES ═══════════════ */
const DS_EXPERT_QS = [
  {q:"Quel est le profil de votre equipe ?",choices:["SQL / DBA → Warehouse","Python/Spark/ML → Lakehouse","T-SQL + Spark → Les deux (Better Together)","Streaming/IoT/KQL → Eventhouse"]},
  {q:"Quel type de donnees traitez-vous ?",choices:["Structurees uniquement → Warehouse","Structurees + semi-struct + non-struct → Lakehouse","Time-series, logs, IoT → Eventhouse","OLTP applicatif dans Fabric → SQL Database"]},
  {q:"Quelle est la latence acceptable ?",choices:["Batch (heures) → Lakehouse Import ou Warehouse","Quasi temps reel (minutes) → Mirroring + Direct Lake","Temps reel (secondes) → Eventhouse + KQL","Streaming live (ms) → Eventstream → Eventhouse"]},
  {q:"Avez-vous besoin de DML T-SQL complet (INSERT/UPDATE/DELETE) ?",choices:["Oui → Warehouse (DML complet)","Non, lecture seule → SQL Analytics Endpoint du Lakehouse","DML via Delta → Lakehouse + Delta MERGE via Spark"]},
];

function DataStoresSection() {
  return (
    <div>
      <STitle>{"🗄️ Analytics Data Stores in Fabric"}</STitle>
      <p style={{color:"#6b7280",marginBottom:"1.5rem",fontSize:14,lineHeight:1.6}}>
        {"En tant qu'expert : comprendre quand choisir Lakehouse, Warehouse, Eventhouse, SQL DB ou Mirrored DB."}
      </p>

      <Card title={"Questions d'expert avant de choisir"} accent={C.indigo} icon={"❓"}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {DS_EXPERT_QS.map((item,i)=>(
            <div key={i} style={{padding:"0.75rem",background:C.lIndigo,borderRadius:8,border:`1px solid ${C.indigo}25`}}>
              <div style={{fontWeight:600,fontSize:13,color:C.indigo,marginBottom:5}}>{"❓ "}{item.q}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                {item.choices.map((c,j)=><div key={j} style={{fontSize:12,color:"#374151",padding:"3px 6px",background:"#fff",borderRadius:4}}>{c}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={"Comparatif complet des stores analytiques"} accent={C.blue} icon={"🗄️"}>
        <T headers={["Store","Moteur","Langage","DML","Streaming","Cas usage ideal"]}
           rows={[
             ["Lakehouse","Spark / VertiPaq","PySpark, Spark SQL","Via Spark MERGE","Micro-batch","Data engineering, ML, volumes massifs"],
             ["Warehouse","SQL engine","T-SQL complet","INSERT UPDATE DELETE MERGE","Non natif","OLAP, BI, equipes SQL, RLS/CLS T-SQL"],
             ["Eventhouse","Kusto engine","KQL","Append-only","Natif temps reel","IoT, logs, series temporelles"],
             ["SQL Database","SQL Server","T-SQL complet","Complet","Non","Applications OLTP, APIs"],
             ["Mirrored DB","Source repliquee","Selon source","Lecture seule Fabric","CDC continu","Sync Azure SQL, Snowflake, CosmosDB"],
           ]}
        />
      </Card>

      <Card title={"Lakehouse — Points critiques"} accent={C.teal} icon={"🏠"}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{fontWeight:600,fontSize:12,color:C.teal,marginBottom:6}}>{"Quand choisir"}</div>
            {["Transformation PySpark complexe (ML, feature engineering)","Donnees multi-format (JSON, CSV, Parquet, Delta)","Architecture Medallion Bronze/Silver/Gold","Notebooks interactifs pour exploration"].map((s,i)=><div key={i} style={{fontSize:12,color:"#374151",marginBottom:3}}>{"• "}{s}</div>)}
          </div>
          <div>
            <div style={{fontWeight:600,fontSize:12,color:C.red,marginBottom:6}}>{"Limitations critiques"}</div>
            {["SQL Analytics Endpoint = LECTURE SEULE (pas de DML T-SQL)","Pas de CREATE SECURITY POLICY (RLS via OneLake roles)","OPTIMIZE/VACUUM = Spark uniquement, pas via SQL endpoint","Pas de stored procedures T-SQL"].map((s,i)=><div key={i} style={{fontSize:12,color:"#9a3412",marginBottom:3}}>{"• "}{s}</div>)}
          </div>
        </div>
        <Code code={`-- SQL Analytics Endpoint (lecture seule)
SELECT * FROM LakehouseName.dbo.GoldVentes WHERE Region = 'Europe';

-- Ecrire dans Lakehouse → PySpark obligatoire :
df.write.format("delta").mode("append").saveAsTable("gold.Ventes")

-- Delta MERGE pour upsert :
DeltaTable.forName(spark,"gold.Clients").alias("t").merge(
    df.alias("s"), "t.ClientID = s.ClientID"
).whenMatchedUpdateAll().whenNotMatchedInsertAll().execute()`}/>
      </Card>

      <Card title={"Warehouse — Points critiques"} accent={C.purple} icon={"🏦"}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <div style={{fontWeight:600,fontSize:12,color:C.purple,marginBottom:6}}>{"Quand choisir"}</div>
            {["Equipe DBA/SQL full T-SQL","RLS/CLS/DDM natifs via T-SQL","Stored procedures + vues complexes","SCD Type 2 via MERGE INTO","Modele dimensionnel (faits/dimensions)"].map((s,i)=><div key={i} style={{fontSize:12,color:"#374151",marginBottom:3}}>{"• "}{s}</div>)}
          </div>
          <div>
            <div style={{fontWeight:600,fontSize:12,color:C.red,marginBottom:6}}>{"Limitations critiques"}</div>
            {["Pas de Spark (pas de PySpark, ML)","OPTIMIZE/VACUUM non supportes dans Warehouse","V-Order active + irreversible","Pas de streaming natif"].map((s,i)=><div key={i} style={{fontSize:12,color:"#9a3412",marginBottom:3}}>{"• "}{s}</div>)}
          </div>
        </div>
        <Tip>{"Better Together : Lakehouse pour Bronze/Silver (Spark), Warehouse pour Gold (T-SQL). Connecter via Cross-Database queries ou shortcuts."}</Tip>
      </Card>

      <Card title={"Eventhouse / KQL — Temps reel"} accent={C.amber} icon={"⚡"}>
        <T headers={["Caracteristique","Detail"]}
           rows={[
             ["Modele de donnees","Append-only, time-series optimise. Pas d'UPDATE/DELETE natif."],
             ["Latence ingestion","Millisecondes via Eventstream. Secondes via batch."],
             ["OneLake Availability","Donnees exposees comme Delta tables dans OneLake (lecture via Spark/SQL endpoint)"],
             ["Cas usage","IoT, logs applicatifs, clickstream, monitoring, series temporelles"],
           ]}
        />
        <Code code={`// KQL — Requete analytique temps reel
SalesEvents
| where EventTime > ago(1h) and Region == "Europe"
| summarize TotalCA = sum(Amount), NbTx = count()
    by bin(EventTime, 5m), Product
| order by EventTime desc`} lang="kql"/>
      </Card>
    </div>
  );
}

/* ═══════════════ DESIGN & TRANSFORM ═══════════════ */
const TRANSFORM_EXPERT_QS = [
  {q:"Niveau de complexite de la transformation ?",choices:["Simple (filtres, joins) → Dataflow Gen2","Complexe (ML, MERGE, logique custom) → Notebook PySpark","SQL-centric → T-SQL Stored Procedure","Mix → Pipeline orchestrant Notebook + Dataflow"]},
  {q:"Donnees en temps reel ou batch ?",choices:["Batch quotidien/horaire → Pipeline + Dataflow Gen2","Batch incremental → Copy Job (CDC mode)","Quasi temps reel (CDC) → Mirroring","Temps reel (streaming) → Eventstream → Eventhouse"]},
  {q:"Comment gerer les donnees manquantes ?",choices:["Dropna / fillna → Notebook ou Dataflow Gen2","Validation a la source → expectations dans Notebook","Quarantine pattern → table d'erreurs Bronze separee","Regles DQ automatisees → Activator sur metriques qualite"]},
  {q:"Besoin de conserver l'historique (SCD) ?",choices:["SCD Type 1 (ecrasement) → simple UPDATE ou MERGE","SCD Type 2 (historique) → MERGE avec DateDebut/DateFin","SCD Type 3 (valeur precedente) → colonne additionnelle","Event sourcing → Eventhouse append-only"]},
];

function TransformSection() {
  return (
    <div>
      <STitle>{"⚙️ Design & Transform Analytics Data"}</STitle>
      <p style={{color:"#6b7280",marginBottom:"1.5rem",fontSize:14,lineHeight:1.6}}>
        {"Concevoir et transformer les donnees analytiques — les decisions d'expert, les patterns, les pieges."}
      </p>

      <Card title={"Questions d'expert"} accent={C.indigo} icon={"❓"}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {TRANSFORM_EXPERT_QS.map((item,i)=>(
            <div key={i} style={{padding:"0.75rem",background:C.lIndigo,borderRadius:8,border:`1px solid ${C.indigo}25`}}>
              <div style={{fontWeight:600,fontSize:13,color:C.indigo,marginBottom:5}}>{"❓ "}{item.q}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                {item.choices.map((c,j)=><div key={j} style={{fontSize:12,color:"#374151",padding:"3px 6px",background:"#fff",borderRadius:4}}>{c}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={"Schema en etoile vs Flocon"} accent={C.blue} icon={"⭐"}>
        <T headers={["Critere","Etoile (Star Schema)","Flocon (Snowflake)","Recommandation Fabric"]}
           rows={[
             ["Structure","Fait + dimensions denormalisees","Fait + dimensions normalisees","Etoile preferee pour Direct Lake/Power BI"],
             ["Performance PBI","Excellent (moins de JOINs)","Plus lent (JOINs supplementaires)","Etoile = moins de hops VertiPaq"],
             ["Maintenance","Plus simple","Plus complexe","Etoile = moins de pipelines de sync"],
           ]}
        />
      </Card>

      <Card title={"Pattern Bronze → Silver complet (PySpark)"} accent={C.teal} icon={"🔄"}>
        <Code code={`from pyspark.sql import functions as F
from pyspark.sql.window import Window

# 1. Lire Bronze
df = spark.read.format("delta").table("bronze.RawVentes")

# 2. Deduplication
win = Window.partitionBy("TransactionID").orderBy(F.desc("IngestedAt"))
df = df.withColumn("rn", F.row_number().over(win)).filter("rn = 1").drop("rn")

# 3. Nettoyage + typage
df = (df
    .withColumn("Montant", F.col("Montant").cast("decimal(12,2)"))
    .withColumn("DateVente", F.to_date("DateVente","yyyy-MM-dd"))
    .fillna({"Region":"Inconnu","Canal":"Direct"})
)

# 4. Enrichissement
dim = spark.read.format("delta").table("silver.DimClients")
df = df.join(dim, on="ClientID", how="left")

# 5. MERGE upsert vers Silver
from delta.tables import DeltaTable
DeltaTable.forName(spark,"silver.Ventes").alias("t") \\
    .merge(df.alias("s"),"t.TransactionID = s.TransactionID") \\
    .whenMatchedUpdateAll() \\
    .whenNotMatchedInsertAll() \\
    .execute()`} lang="python"/>
      </Card>

      <Card title={"Outils de transformation — Decision"} accent={C.purple} icon={"⚙️"}>
        <T headers={["Outil","Langage","Profil","Ideal pour","Limite"]}
           rows={[
             ["Dataflow Gen2","Power Query (M)","Low-code","Nettoyage simple, 200+ connecteurs","Volumes limites, pas de ML"],
             ["Notebook PySpark","Python / Spark SQL","Code-first","Transformations complexes, ML, Delta MERGE","Requiert expertise Spark"],
             ["T-SQL (Warehouse)","T-SQL","SQL developer","Agregations Gold, vues, stored procedures","Structure uniquement"],
             ["Pipeline (activites)","Low-code + expressions","Data engineer","Orchestration, Copy, conditionnels","Pas de logique inline"],
             ["KQL (Eventhouse)","Kusto","Data analyst temps reel","Streaming analytics, series temporelles","Non adapte au batch"],
           ]}
        />
      </Card>
    </div>
  );
}

/* ═══════════════ SEMANTIC MODELS ═══════════════ */
const SEMANTIC_QS = [
  {q:"Taille des tables de faits ?",choices:["Moins de 100M lignes → Import mode (performances max)","100M a 1B lignes → Direct Lake sur OneLake","Plus de 1B lignes → Direct Lake + partitionnement Delta","Temps reel → Direct Lake + Incremental Refresh"]},
  {q:"Frequence des mises a jour ?",choices:["Quotidien → Import + Incremental Refresh planifie","Toutes les heures → Direct Lake (lit OneLake directement)","Continue → Direct Lake (framing sur Delta log)","Temps reel strict → DirectQuery (acceptable perf Warehouse)"]},
  {q:"Besoin de colonnes calculees sur les tables de faits ?",choices:["Oui → Composite model (Direct Lake fact + Import dim)","Non → Direct Lake pur (optimal)","Hierarchies uniquement → Possible en Direct Lake depuis 2026","Logique DAX complexe → Import mode plus flexible"]},
];

function SemanticSection() {
  return (
    <div>
      <STitle>{"📐 Design & Manage Semantic Models"}</STitle>
      <p style={{color:"#6b7280",marginBottom:"1.5rem",fontSize:14,lineHeight:1.6}}>
        {"Concevoir et gerer des semantic models — Direct Lake, composite models, DAX, deploiement XMLA."}
      </p>

      <Card title={"Questions d'expert — Choisir le mode de stockage"} accent={C.indigo} icon={"❓"}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {SEMANTIC_QS.map((item,i)=>(
            <div key={i} style={{padding:"0.75rem",background:C.lIndigo,borderRadius:8,border:`1px solid ${C.indigo}25`}}>
              <div style={{fontWeight:600,fontSize:13,color:C.indigo,marginBottom:5}}>{"❓ "}{item.q}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                {item.choices.map((c,j)=><div key={j} style={{fontSize:12,color:"#374151",padding:"3px 6px",background:"#fff",borderRadius:4}}>{c}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={"Direct Lake — OneLake vs SQL"} accent={C.blue} icon={"🏎️"}>
        <T headers={["","Direct Lake on SQL","Direct Lake on OneLake"]}
           rows={[
             ["Source","SQL Analytics Endpoint (Warehouse ou Lakehouse)","Tables Delta directement dans OneLake"],
             ["Fallback DirectQuery","Oui si limites SKU ou vues SQL","Non — pas de fallback DQ"],
             ["Colonnes calculees","Limitees","Supportees (depuis 2026)"],
             ["Composite model","Non (mono-source)","Oui — multi-source + Import tables"],
             ["Recommandation","Migration legacy, Warehouse existant","Nouvelles architectures — recommande"],
           ]}
        />
        <Warn>{"Direct Lake on SQL : referencer l'endpoint par GUID (pas par nom convivial) dans TMDL pour eviter les problemes de refresh."}</Warn>
      </Card>

      <Card title={"Composite Semantic Model — Patterns"} accent={C.teal} icon={"🔀"}>
        <T headers={["Pattern","Structure","Avantage","Cas usage"]}
           rows={[
             ["Direct Lake + Import Dims","Faits DL, dims Import","Refresh reduit, colonnes calculees sur dims","Tables de faits massives + dims avec hierarchies"],
             ["Direct Lake multi-source","Tables depuis plusieurs Lakehouses","Pas de duplication, chaque equipe gere sa source","Architecture Mesh multi-sources"],
             ["Migration progressive","Large tables DL, petites tables Import","Migration sans reecriture complete","Migration progressive vers Fabric"],
           ]}
        />
      </Card>

      <Card title={"DAX — Patterns critiques"} accent={C.purple} icon={"📐"}>
        <Code code={`-- Variables DAX (performance + lisibilite)
CA YTD =
VAR AnneeCourante = YEAR(MAX(DimDate[Date]))
VAR FiltreYTD = FILTER(DimDate,
    DimDate[Annee] = AnneeCourante
    && DimDate[Date] <= MAX(DimDate[Date]))
RETURN CALCULATE([Total CA], FiltreYTD)

-- CALCULATE + REMOVEFILTERS
CA Toutes Regions =
CALCULATE([Total CA], REMOVEFILTERS(DimRegion))

-- Division sans erreur (zero)
Pct Total = DIVIDE([Total CA], CALCULATE([Total CA], ALL(DimProduit)), 0)

-- Time Intelligence
CA vs N-1 =
VAR n1 = CALCULATE([Total CA], DATEADD(DimDate[Date], -1, YEAR))
RETURN IF(ISBLANK(n1), BLANK(), [Total CA] - n1)

-- Rang
Rang Produit = RANKX(ALL(DimProduit), [Total CA], , DESC, Dense)`} lang="dax"/>
        <Tip>{"DP-600 : fonctions les plus testees : CALCULATE, REMOVEFILTERS/ALL, DIVIDE, DATEADD, DATESYTD, RANKX, USERELATIONSHIP. Variables VAR quasi-obligatoires."}</Tip>
      </Card>

      <Card title={"Deploiement XMLA — Outils"} accent={C.amber} icon={"🔧"}>
        <T headers={["Outil","Usage"]}
           rows={[
             ["XMLA endpoint (lecture)","F SKU ou PBI Premium — connexion via SSMS, DAX Studio, Excel"],
             ["XMLA endpoint (ecriture)","Deployer, modifier le modele via Tabular Editor, ALM Toolkit"],
             ["Tabular Editor 3","UI pro pour TMDL, OLS, calculation groups, partitions"],
             ["Semantic Link Labs","Python library pour operations sur semantic models depuis Notebooks"],
             ["TMDL sur le web","Editer les metadonnees en TMDL dans le navigateur Fabric"],
           ]}
        />
      </Card>
    </div>
  );
}

/* ═══════════════ AI-READY DATA ═══════════════ */
const AI_EXPERT_QS = [
  {q:"Mes donnees sont-elles de qualite suffisante pour l'IA ?",choices:["Valeurs manquantes sup. 5% → imputation ou exclusion","Desequilibre de classes → SMOTE, undersampling","Drift des features dans le temps → monitoring","Data leakage (futur dans les features) → exclusion"]},
  {q:"Comment stocker et partager mes features ?",choices:["Feature Store dans Lakehouse Gold (Delta tables)","Convention nommage : prefix 'feat_' pour les features","Versionner features via Git + Delta time travel","Documentation via OneLake Catalog (descriptions, proprietaire)"]},
  {q:"Comment garantir la reproducibilite des experiences ML ?",choices:["MLflow Experiment Tracking (metriques, params, artifacts)","Snapshot des donnees d'entrainement avec Delta time travel","Environnements Conda/pip lockes dans les notebooks","Versionning des requetes de generation de datasets"]},
  {q:"Comment deployer un modele ML en production ?",choices:["Real-Time Inference via endpoint REST (Fabric ML endpoints)","Batch scoring via Notebook planifie dans Pipeline","Scoring inline dans Warehouse T-SQL (AI functions)","Integration Power BI via fonctions R/Python visuels"]},
];

function AIReadySection() {
  return (
    <div>
      <STitle>{"🤖 Preparer des donnees AI-Ready"}</STitle>
      <p style={{color:"#6b7280",marginBottom:"1.5rem",fontSize:14,lineHeight:1.6}}>
        {"Feature engineering, feature store, data quality, gouvernance des modeles ML dans Fabric."}
      </p>

      <Card title={"Questions d'expert"} accent={C.indigo} icon={"❓"}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {AI_EXPERT_QS.map((item,i)=>(
            <div key={i} style={{padding:"0.75rem",background:C.lIndigo,borderRadius:8,border:`1px solid ${C.indigo}25`}}>
              <div style={{fontWeight:600,fontSize:13,color:C.indigo,marginBottom:5}}>{"❓ "}{item.q}</div>
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                {item.choices.map((c,j)=><div key={j} style={{fontSize:12,color:"#374151",padding:"3px 6px",background:"#fff",borderRadius:4}}>{c}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={"Feature Engineering — Pipeline Silver vers Feature Store"} accent={C.blue} icon={"🔬"}>
        <Code code={`from pyspark.sql import functions as F
from pyspark.sql.window import Window

df = spark.read.format("delta").table("silver.Transactions")

# Features temporelles
df = df \\
    .withColumn("DayOfWeek", F.dayofweek("DateTx")) \\
    .withColumn("IsWeekend", (F.col("DayOfWeek").isin([1,7])).cast("int")) \\
    .withColumn("HourOfDay", F.hour("DateTx"))

# Rolling window 7 jours
win7d = (Window.partitionBy("ClientID")
    .orderBy(F.col("DateTx").cast("long"))
    .rangeBetween(-7*86400, 0))

df = df \\
    .withColumn("feat_sum_7d", F.sum("Montant").over(win7d)) \\
    .withColumn("feat_count_7d", F.count("TransactionID").over(win7d)) \\
    .withColumn("feat_avg_7d", F.avg("Montant").over(win7d))

# Ecrire dans Feature Store (Gold)
df.write.format("delta") \\
    .mode("overwrite") \\
    .option("overwriteSchema","true") \\
    .saveAsTable("gold.feat_transactions")`} lang="python"/>
      </Card>

      <Card title={"MLflow — Tracking dans Fabric"} accent={C.teal} icon={"📊"}>
        <Code code={`import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score

mlflow.set_experiment("Churn_Prediction_v2")

with mlflow.start_run(run_name="RandomForest_Baseline"):
    params = {"n_estimators": 200, "max_depth": 10}
    mlflow.log_params(params)

    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mlflow.log_metrics({
        "accuracy": accuracy_score(y_test, y_pred),
        "f1_score": f1_score(y_test, y_pred),
    })

    mlflow.sklearn.log_model(model, "churn_model",
        registered_model_name="ChurnPrediction")
    mlflow.set_tags({"team":"data-science","stage":"baseline"})`} lang="python"/>
      </Card>

      <Card title={"AI Functions T-SQL natives dans Warehouse"} accent={C.purple} icon={"🧪"}>
        <Code code={`-- Analyse de sentiment
SELECT ReviewID, ReviewText,
    ai_analyze_sentiment(ReviewText) AS Sentiment,
    ai_extract_key_phrases(ReviewText) AS KeyPhrases
FROM dbo.CustomerReviews;

-- Classification de texte
SELECT ProductID, Description,
    ai_classify_text(Description,
        ARRAY['Electronique','Vetements','Alimentation']
    ) AS Categorie
FROM dbo.Produits;

-- Generation de texte (resume)
SELECT ClientID,
    ai_generate_text(
        'Resume en 2 phrases: ' + HistoriqueAchats
    ) AS ResumeClient
FROM dbo.ClientsVIP WHERE IsVIP = 1;`}/>
        <Tip>{"AI Functions dans Warehouse = ML sans quitter T-SQL. Ideal pour enrichissement des tables Gold sans pipeline Spark separe."}</Tip>
      </Card>
    </div>
  );
}

/* ═══════════════ SECURITE & GOUVERNANCE EXPERTE ═══════════════ */
const SECGOV_EXPERT_QS = [
  {q:"Qui doit acceder a quoi, et comment cela evolue ?",choices:["Cataloguer les roles metier → mapper vers workspace roles + item permissions","Rotation equipes → groupes de securite Entra (pas d'utilisateurs directs)","Prevoir substitution temporaire → groupes delegues","Documenter les acces dans OneLake Catalog (proprietaire par item)"]},
  {q:"Quelles donnees sont vraiment sensibles ?",choices:["Classification via Purview sensitivity labels","Scan automatique pour PII (numeros, emails, dates de naissance)","Cartographier : quelle table contient quelles categories de donnees","Definir colonnes DDM vs CLS selon le niveau de sensibilite"]},
  {q:"Comment garantir la conformite (RGPD, HIPAA, SOX) ?",choices:["RGPD : droit a l'effacement → Delta time travel + VACUUM controle","HIPAA : audit complet → M365 Audit Logs + Workspace Monitoring","SOX : separation des roles (qui cree les pipelines ≠ qui les approuve)","Residence des donnees : capacites par region geographique (Multi-Geo)"]},
  {q:"Comment tester la securite avant la production ?",choices:["Test RLS : EXECUTE AS USER dans Warehouse","Test OLS : verifier que la table n'apparait pas dans le modele","Test DDM : connexion sans UNMASK et verifier le masquage","Test OneLake roles : SQL endpoint avec un compte Viewer"]},
];

function SecGovSection() {
  return (
    <div>
      <STitle>{"🔒 Securite & Gouvernance — Vue Experte"}</STitle>
      <p style={{color:"#6b7280",marginBottom:"1.5rem",fontSize:14,lineHeight:1.6}}>
        {"Les decisions strategiques, les questions a se poser, les arbitrages — vision architecte."}
      </p>

      <Card title={"Questions d'expert"} accent={C.indigo} icon={"❓"}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {SECGOV_EXPERT_QS.map((item,i)=>(
            <div key={i} style={{padding:"0.75rem",background:C.lIndigo,borderRadius:8,border:`1px solid ${C.indigo}25`}}>
              <div style={{fontWeight:600,fontSize:13,color:C.indigo,marginBottom:5}}>{"❓ "}{item.q}</div>
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                {item.choices.map((c,j)=><div key={j} style={{fontSize:12,color:"#374151",padding:"3px 6px",background:"#fff",borderRadius:4}}>{c}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={"Matrice de decision securite"} accent={C.red} icon={"📋"}>
        <T headers={["Besoin","Controle","Ou","Bypass par"]}
           rows={[
             ["Filtrer des lignes par utilisateur","RLS (FILTER PREDICATE)","Warehouse / Semantic Model","Admin, Member, Contributor"],
             ["Interdire acces a une colonne","CLS (DENY SELECT)","Warehouse","Admin, Member, Contributor"],
             ["Cacher table/colonne (metadonnees)","OLS (None permission)","Semantic Model","—"],
             ["Masquer valeurs (format visible)","DDM (MASKED WITH)","Warehouse","UNMASK permission"],
             ["Restreindre fichiers Lakehouse","OneLake Data Access Roles","Lakehouse / OneLake","Admin, Member, Contributor"],
             ["Proteger les exports","Sensitivity Labels + Protection","Purview","Admins Purview"],
             ["Bloquer partage donnees PII","DLP Policies","Purview","Compliance Admins"],
             ["Audit des acces","M365 Audit Logs + Workspace Monitoring","Tenant/Workspace","—"],
           ]}
        />
      </Card>

      <Card title={"Bonnes pratiques — Groupes vs utilisateurs directs"} accent={C.amber} icon={"👥"}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{background:"#fff7ed",borderRadius:8,padding:"0.875rem",border:"1px solid #fed7aa"}}>
            <div style={{fontWeight:700,fontSize:12,color:C.amber,marginBottom:6}}>{"NE PAS faire"}</div>
            {["Ajouter des utilisateurs individuels dans les workspace roles","RLS avec noms d'utilisateurs hardcodes dans la fonction DAX","Sensitivity labels appliques manuellement sans politique","Permissions au cas par cas sans documentation"].map((s,i)=><div key={i} style={{fontSize:12,color:"#9a3412",marginBottom:3}}>{"• "}{s}</div>)}
          </div>
          <div style={{background:"#f0fdf4",borderRadius:8,padding:"0.875rem",border:"1px solid #bbf7d0"}}>
            <div style={{fontWeight:700,fontSize:12,color:C.green,marginBottom:6}}>{"TOUJOURS faire"}</div>
            {["Groupes de securite Entra pour tous les roles workspace","RLS avec USERPRINCIPALNAME() + table de mapping","Labels par defaut par domaine Fabric","Documenter chaque acces dans OneLake Catalog"].map((s,i)=><div key={i} style={{fontSize:12,color:"#166534",marginBottom:3}}>{"• "}{s}</div>)}
          </div>
        </div>
        <Code code={`-- RLS dynamique via table de mapping (best practice)
CREATE TABLE dbo.RLS_UserRegions (
    UserEmail NVARCHAR(200), Region NVARCHAR(50)
);

CREATE FUNCTION dbo.fn_RLS_Region(@Region NVARCHAR(50))
RETURNS TABLE WITH SCHEMABINDING AS
RETURN SELECT 1 AS fn_result
WHERE @Region IN (
    SELECT Region FROM dbo.RLS_UserRegions
    WHERE UserEmail = SESSION_CONTEXT(N'CurrentUser')
)
OR IS_MEMBER('GlobalDirectors') = 1;

-- Politique de securite
CREATE SECURITY POLICY RegionFilter
ADD FILTER PREDICATE dbo.fn_RLS_Region(Region)
ON dbo.Ventes WITH (STATE = ON);`}/>
      </Card>

      <Card title={"RGPD — Droit a l'effacement (Right to be Forgotten)"} accent={C.purple} icon={"🗑️"}>
        <Code code={`-- Etape 1 : Warehouse (DML direct)
DELETE FROM dbo.Transactions WHERE ClientID = @ClientID;
DELETE FROM dbo.DimClients WHERE ClientID = @ClientID;

-- Etape 2 : Lakehouse (Delta via PySpark)
spark.sql(f"""
    DELETE FROM silver.Transactions WHERE ClientID = {client_id}
""")

-- Etape 3 : VACUUM pour supprimer anciennes versions
-- ATTENTION : desactive le Time Travel
spark.sql("VACUUM silver.Transactions RETAIN 0 HOURS")

-- Etape 4 : Documenter dans audit log
spark.sql(f"""
    INSERT INTO dbo.RGPDLog VALUES
    ({client_id}, current_timestamp(), 'Suppression complete')
""")`}/>
        <Warn>{"VACUUM RETAIN 0 HOURS desactive le Time Travel. Verifier que l'Incremental Refresh du Semantic Model ne depend pas d'anciennes versions Delta."}</Warn>
      </Card>

      <Card title={"Tableau de bord gouvernance — Indicateurs cles"} accent={C.teal} icon={"📊"}>
        <T headers={["Indicateur","Source","Frequence","Action si anomalie"]}
           rows={[
             ["Items sans proprietaire","OneLake Catalog (Govern tab)","Hebdomadaire","Assigner un proprietaire ou archiver"],
             ["Items non certifies","OneLake Catalog","Mensuelle","Promouvoir ou marquer obsolete"],
             ["Violations DLP actives","Purview / Govern tab","Quotidienne","Investiguer et corriger"],
             ["Acces Prod sans groupe de securite","Audit Logs","Continue","Convertir en groupe immediatement"],
             ["RLS non teste depuis 30 jours","Script de monitoring","Mensuelle","Re-tester avec compte Viewer dedie"],
           ]}
        />
      </Card>
    </div>
  );
}


export default function App() {
  const [active, setActive] = useState("home");

  // Dynamic import of full section content
  const renderSection = (id) => {
    if (id === "home")         return <HomePage onNav={setActive}/>;
    if (id === "optimization") return <OptimizationSection/>;
    if (id === "activator")    return <ActivatorSection/>;
    if (id === "copilot")      return <CopilotSection/>;
    if (id === "memo")         return <MemoSection/>;
    if (id === "pieges")       return <PiegesSection/>;
    if (id === "scenarios")    return <div><STitle>🎯 Scénarios Sécurité</STitle><Quiz qs={SECU_QS}/></div>;
    if (id === "archi_scenarios") return <ArchiScenariosSection/>;
    if (id === "git")       return <GitSection/>;
    if (id === "datastores")return <DataStoresSection/>;
    if (id === "transform") return <TransformSection/>;
    if (id === "semantic")  return <SemanticSection/>;
    if (id === "aiready")   return <AIReadySection/>;
    if (id === "secgov")    return <SecGovSection/>;
    if (id === "git")       return <GitSection/>;
    if (id === "datastores")return <DataStoresSection/>;
    if (id === "transform") return <TransformSection/>;
    if (id === "semantic")  return <SemanticSection/>;
    if (id === "aiready")   return <AIReadySection/>;
    if (id === "secgov")    return <SecGovSection/>;
    const c = FULL_CONTENT[id];
    if (c) return c;
    return (
      <div>
        <STitle>{SECTIONS.find(s=>s.id===id)?.icon} {SECTIONS.find(s=>s.id===id)?.label}</STitle>
        <Card accent={C.blue}><p style={{fontSize:14,color:"#374151"}}>Section en cours de chargement…</p></Card>
      </div>
    );
  };

  const activeSection = SECTIONS.find(s=>s.id===active);
  const groupColor = activeSection ? GROUPS[activeSection.group]?.color : C.blue;

  return (
    <div className="app-container">
      {/* LEFT COLUMN: MAIN CONTENT */}
      <div className="main-content">
        {/* HEADER */}
        <div className="header-gradient" style={{ background: `linear-gradient(135deg, #1e3a8a, ${groupColor || C.blue})` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Microsoft Fabric — Guide Ultime 2026</span>
            <span style={{ color: "#bfdbfe", fontSize: 11, fontWeight: 600 }}>DP-600 · DP-700</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>
            {active === "home" ? "🏠 Microsoft Fabric" : `${activeSection?.icon || ""} ${activeSection?.label || ""}`}
          </h1>
        </div>

        {/* CONTENT */}
        <div className="content-card">
          {renderSection(active)}
        </div>

        <div style={{ textAlign: "center", padding: "0.75rem", fontSize: 11, color: "#94a3b8" }}>
          Basé sur Microsoft Learn · learn.microsoft.com/fabric · Mis à jour juin 2026 · DP-600 / DP-700
        </div>
      </div>

      {/* RIGHT COLUMN: STICKY SIDEBAR */}
      <aside className="sidebar-container">
        {/* Pinned Home / Accueil button */}
        <div style={{
          padding: "1rem",
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
          background: "rgba(248, 250, 252, 0.9)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)"
        }}>
          <button
            id="nav-btn-home"
            onClick={() => {
              setActive("home");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: active === "home" ? "linear-gradient(135deg, #1e3a8a, #1d4ed8)" : "#ffffff",
              color: active === "home" ? "#ffffff" : "#1e3a8a",
              border: active === "home" ? "none" : "1px solid #cbd5e1",
              borderRadius: 10,
              padding: "0.75rem 1rem",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: active === "home" ? "0 4px 12px rgba(29, 78, 216, 0.2)" : "none",
              transition: "all 0.2s ease"
            }}
          >
            🏠 Retour à l'Accueil
          </button>
        </div>

        {/* Scrollable list of category-grouped tabs */}
        <div className="sidebar-scroll">
          {Object.entries(GROUPS).filter(([gk]) => gk !== "intro").map(([gk, g]) => (
            <div key={gk} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {/* Category Header */}
              <div style={{
                fontSize: 10,
                fontWeight: 800,
                color: g.color,
                letterSpacing: "1px",
                textTransform: "uppercase",
                padding: "0.25rem 0.5rem",
                borderBottom: `2px solid ${g.color}20`,
                marginBottom: "0.25rem"
              }}>
                {g.label}
              </div>
              {/* Tabs */}
              {SECTIONS.filter(s => s.group === gk).map(s => (
                <button
                  key={s.id}
                  id={`nav-btn-${s.id}`}
                  onClick={() => {
                    setActive(s.id);
                    // Smooth scroll main content window to top on change
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`nav-btn ${active === s.id ? 'active' : ''}`}
                  style={{
                    background: active === s.id ? `${g.color}12` : "transparent",
                    color: active === s.id ? g.color : "#475569",
                    borderLeft: active === s.id ? `3px solid ${g.color}` : "3px solid transparent",
                    paddingLeft: active === s.id ? "11px" : "12px", // align text nicely despite border
                  }}
                >
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                  <span style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>{s.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
