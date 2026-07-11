import { useState, useEffect } from "react";

// ============================================================
//  KOSTDAGBOK — fristående kostapp
//  Glutenfritt · Laktosfritt · Proteinfokus
//  Utbruten ur Träningsdagbok v3.1.2
// ============================================================

// ---------- FÄRGER & TYPOGRAFI ----------
const C = {
  ink: "#171B21",
  bone: "#F2EFE9",
  paper: "#FBFAF7",
  amber: "#E8850C",
  amberSoft: "#FDEEDC",
  pull: "#2E6E8E",
  legs: "#4F7A3C",
  safe: "#2F7A5B",
  line: "#D9D4CA",
  gray: "#6B6558",
};
const DISPLAY = "'Archivo', 'Arial Black', sans-serif";

// ---------- MÅLTIDSDATABAS ----------
const KOST = [
  {
    cat: "Frukost", icon: "🌅",
    items: [
      { name: "Gröt-frukost", desc: "Glutenfria havregryn + laktosfri mjölk + 2 kokta ägg + banan", protein: 28, carbs: 60, fat: 14, kcal100: 110 },
      { name: "Kvarg-frukost", desc: "300 g laktosfri kvarg + frysta bär + nävfull glutenfri müsli", protein: 35, carbs: 30, fat: 5, kcal100: 90 },
      { name: "Äggröra", desc: "4 ägg + 2 skivor glutenfritt bröd + tomat", protein: 30, carbs: 30, fat: 20, kcal100: 160 },
      { name: "Overnight oats", desc: "GF havregryn + laktosfri yoghurt + chiafrön + bär. Gör kvällen innan", protein: 22, carbs: 45, fat: 10, kcal100: 120 },
      { name: "Proteinpannkakor", desc: "2 ägg + 1 banan + 1 dl GF havregryn — mixa och stek. Kvarg på toppen", protein: 26, carbs: 40, fat: 12, kcal100: 150 },
      { name: "Skyr-bowl", desc: "Laktosfri skyr + GF granola + honung + skivad banan", protein: 30, carbs: 40, fat: 6, kcal100: 100 },
      { name: "Omelett med skinka", desc: "3 ägg + rökt skinka + paprika + gräslök", protein: 28, carbs: 5, fat: 18, kcal100: 150 },
      { name: "Frukostsmoothie", desc: "Proteinpulver + banan + frysta bär + laktosfri mjölk. Klar på 2 min", protein: 30, carbs: 40, fat: 5, kcal100: 80 },
      { name: "Makrillmacka + ägg", desc: "GF bröd + makrill i tomatsås + 1 kokt ägg", protein: 24, carbs: 30, fat: 18, kcal100: 180 },
      { name: "Keso-tallrik", desc: "Laktosfri keso + persika eller ananas + nävfull nötter", protein: 26, carbs: 20, fat: 14, kcal100: 120 },
      { name: "Frukostwrap", desc: "Majstortilla + äggröra på 2 ägg + avokado + tomat", protein: 20, carbs: 30, fat: 18, kcal100: 170 },
      { name: "Chiapudding", desc: "Chiafrön + laktosfri mjölk + proteinpulver. Svalna över natten, toppa med bär", protein: 24, carbs: 20, fat: 12, kcal100: 110 },
      { name: "Ägg & avokadomacka", desc: "2 skivor GF bröd + 2 ägg + ½ avokado + flingsalt", protein: 20, carbs: 30, fat: 20, kcal100: 180 },
      { name: "Risgrynsgröt-frukost", desc: "Risgrynsgröt på laktosfri mjölk + kanel + 2 kokta ägg vid sidan", protein: 22, carbs: 50, fat: 12, kcal100: 110 },
      { name: "Turbofrukost", desc: "Laktosfri drickkvarg + banan + nävfull mandlar. När det är bråttom", protein: 25, carbs: 35, fat: 10, kcal100: 120 },
    ],
  },
  {
    cat: "Lunch", icon: "🍱",
    items: [
      { name: "Matlåda: kyckling & ris", desc: "150 g kycklingfilé + 1,5 dl ris + fryst broccoli + olivolja", protein: 42, carbs: 50, fat: 10, kcal100: 130 },
      { name: "Matlåda: köttfärs & potatis", desc: "150 g stekt köttfärs (max 12%) + kokt potatis + morötter", protein: 35, carbs: 40, fat: 15, kcal100: 120 },
      { name: "Tonfisksallad", desc: "1 burk tonfisk + kokta ägg + bönor + majs + olivolja. Klar på 5 min", protein: 40, carbs: 25, fat: 15, kcal100: 110 },
      { name: "Kycklingsallad", desc: "Strimlad kycklingfilé + blandsallad + gurka + tomat + vinägrett", protein: 38, carbs: 10, fat: 12, kcal100: 90 },
      { name: "Räksallad", desc: "Räkor + 2 kokta ägg + avokado + romansallad + citron", protein: 32, carbs: 8, fat: 16, kcal100: 100 },
      { name: "Kycklingwok", desc: "Kyckling + wokgrönsaker + risnudlar + GF soja (tamari)", protein: 40, carbs: 45, fat: 10, kcal100: 120 },
      { name: "Lax & quinoa-bowl", desc: "Varmrökt lax + kokt quinoa + edamame + gurka", protein: 34, carbs: 35, fat: 18, kcal100: 140 },
      { name: "Köttfärsbiffar & mos", desc: "Biffar på färs + potatismos gjort på laktosfri mjölk + lingon", protein: 36, carbs: 40, fat: 18, kcal100: 130 },
      { name: "Stekt ris med ägg", desc: "Gårdagens ris + 2 ägg + kycklingrester + ärtor + tamari", protein: 38, carbs: 50, fat: 14, kcal100: 150 },
      { name: "Pulled chicken-wrap", desc: "Majstortilla + kyckling + majs + laktosfri gräddfil", protein: 35, carbs: 35, fat: 10, kcal100: 140 },
      { name: "Omelett på rester", desc: "3–4 ägg + gårdagens middagsrester + grönsaker", protein: 30, carbs: 15, fat: 18, kcal100: 140 },
      { name: "Linssoppa + ägg", desc: "Röda linser + krossade tomater + buljong. GF bröd + kokt ägg till", protein: 24, carbs: 45, fat: 8, kcal100: 90 },
      { name: "Ugnsbakad torsk", desc: "Torskfilé + kokt potatis + smält smör eller laktosfri remoulad", protein: 32, carbs: 35, fat: 8, kcal100: 90 },
      { name: "Kikärtsgryta (veg)", desc: "Kikärtor + kokosmjölk + curry + ris. Billig och mättande", protein: 22, carbs: 60, fat: 18, kcal100: 120 },
      { name: "Grillad kyckling & potatissallad", desc: "Grillad kycklingfilé + kall potatissallad på laktosfri gräddfil", protein: 40, carbs: 35, fat: 12, kcal100: 120 },
    ],
  },
  {
    cat: "Middag", icon: "🍽️",
    items: [
      { name: "Kyckling & ris (storkok)", desc: "Kycklingfilé i ugn 200° i 20 min + ris + fryst grönsaksblandning", protein: 42, carbs: 50, fat: 10, kcal100: 130 },
      { name: "Kycklinglårfilé i ugn", desc: "Kycklinglårfilé + klyftpotatis + morötter i ugn 200° i 35 min. Saftigare än filé", protein: 40, carbs: 40, fat: 18, kcal100: 130 },
      { name: "Ugnslax & potatis", desc: "Fryst laxfilé 200° i 25 min + kokt potatis + citron", protein: 34, carbs: 35, fat: 20, kcal100: 130 },
      { name: "Chili con carne (storkok)", desc: "Färs + kidneybönor + krossade tomater + ris. Billigast per portion", protein: 40, carbs: 45, fat: 14, kcal100: 120 },
      { name: "Tacos fredag", desc: "Majstortillas (naturligt glutenfria) + färs + laktosfri gräddfil", protein: 35, carbs: 40, fat: 20, kcal100: 160 },
      { name: "Kycklinggryta med kokosmjölk", desc: "Kyckling + kokosmjölk + röd curry + paprika + ris", protein: 38, carbs: 45, fat: 22, kcal100: 130 },
      { name: "Lövbiff & klyftpotatis", desc: "Lövbiff + klyftpotatis i ugn + laktosfri bearnaise", protein: 40, carbs: 40, fat: 22, kcal100: 140 },
      { name: "Fläskfilé med svampsås", desc: "Fläskfilé i ugn + ris + sås på laktosfri matlagningsgrädde", protein: 42, carbs: 45, fat: 18, kcal100: 130 },
      { name: "Hemmagjorda hamburgare", desc: "Burgare på färs + GF hamburgerbröd + laktosfri ost + sallad, tomat & lök", protein: 38, carbs: 40, fat: 22, kcal100: 180 },
      { name: "Kyckling-fajitas", desc: "Strimlad kyckling + paprika + lök + fajitakrydda + majstortillas", protein: 38, carbs: 40, fat: 14, kcal100: 140 },
      { name: "Köttbullar & mos", desc: "Färs + GF ströbröd + ägg. Mos på laktosfri mjölk + lingon", protein: 34, carbs: 45, fat: 20, kcal100: 140 },
      { name: "GF lasagne (storkok)", desc: "Glutenfria plattor + köttfärssås + laktosfri ost. Frys i portioner", protein: 36, carbs: 45, fat: 20, kcal100: 150 },
      { name: "Thaicurry med räkor", desc: "Räkor eller kyckling + grön curry + kokosmjölk + ris", protein: 32, carbs: 45, fat: 18, kcal100: 120 },
      { name: "Pytt i panna + stekta ägg", desc: "Tärnad potatis + korv/kött + lök + 2 stekta ägg + rödbetor", protein: 30, carbs: 40, fat: 22, kcal100: 140 },
      { name: "Spaghetti & köttfärssås", desc: "GF spaghetti + färs + krossade tomater + lök & vitlök. Riven laktosfri ost på toppen", protein: 38, carbs: 55, fat: 16, kcal100: 140 },
      { name: "Kycklingspett & tzatziki", desc: "Kycklingspett + ris + tzatziki på laktosfri yoghurt", protein: 40, carbs: 45, fat: 10, kcal100: 120 },
    ],
  },
  {
    cat: "Mellanmål", icon: "🍎",
    items: [
      { name: "Laktosfri kvarg + frukt", desc: "", protein: 25, carbs: 20, fat: 3, kcal100: 70 },
      { name: "2–3 kokta ägg", desc: "Koka i förväg — snabbast av allt", protein: 18, carbs: 1, fat: 14, kcal100: 155 },
      { name: "Proteinshake + banan", desc: "Laktosfritt eller veganskt pulver", protein: 28, carbs: 30, fat: 3, kcal100: 90 },
      { name: "Nävfull nötter + ett äpple", desc: "", protein: 6, carbs: 20, fat: 18, kcal100: 250 },
      { name: "Proteinbar (GF)", desc: "Kolla att den är märkt glutenfri", protein: 20, carbs: 20, fat: 8, kcal100: 350 },
      { name: "Laktosfri skyr på burk", desc: "Perfekt att ha med sig", protein: 17, carbs: 7, fat: 0, kcal100: 60 },
      { name: "Riskakor + jordnötssmör", desc: "2–3 riskakor med ett tunt lager", protein: 10, carbs: 25, fat: 14, kcal100: 400 },
      { name: "Beef jerky / torkat kött", desc: "Lätt att ha i väskan", protein: 15, carbs: 3, fat: 2, kcal100: 250 },
      { name: "Edamamebönor", desc: "Frysta — ånga och salta", protein: 12, carbs: 8, fat: 5, kcal100: 120 },
      { name: "Keso + ananas", desc: "Laktosfri keso", protein: 15, carbs: 15, fat: 2, kcal100: 80 },
      { name: "Tonfisk på riskakor", desc: "1 liten burk tonfisk + 2 riskakor", protein: 20, carbs: 15, fat: 2, kcal100: 150 },
      { name: "Färdiga kycklingbitar", desc: "Grillbitar från kyldisken", protein: 20, carbs: 1, fat: 3, kcal100: 110 },
      { name: "Proteinpudding (laktosfri)", desc: "Färdig från kyldisken", protein: 20, carbs: 10, fat: 3, kcal100: 80 },
      { name: "Bärsmoothie", desc: "Frysta bär + laktosfri yoghurt + honung", protein: 12, carbs: 30, fat: 2, kcal100: 70 },
      { name: "Banan + mandlar", desc: "Snabb energi före passet", protein: 8, carbs: 30, fat: 14, kcal100: 200 },
    ],
  },
];

const PROTEIN_GOAL = 160; // fallback om profil saknas

// ---------- HJÄLPFUNKTIONER ----------
const todayStr = () => new Date().toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });
const dateKey = () => new Date().toISOString().slice(0, 10);
const timeNow = () => new Date().toTimeString().slice(0, 5);

// ---------- KOMPONENT ----------
export default function Kostdagbok() {
  const [tab, setTab] = useState("idag");
  const [kostHist, setKostHist] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [kostExpanded, setKostExpanded] = useState(null);
  const [justAdded, setJustAdded] = useState(null); // "cat-idx" för blink-feedback
  const [openCat, setOpenCat] = useState(null); // vilken måltidskategori som är utfälld
  const [luck, setLuck] = useState({}); // { catIdx: itemIdx } — slumpat förslag per kategori
  const [profile, setProfile] = useState(null); // { sex, age, weight, height, activity, goal }
  const [editProfile, setEditProfile] = useState(false);
  const [importMsg, setImportMsg] = useState(null); // "ok" | "fel"
  const [form, setForm] = useState({ sex: null, age: "", weight: "", height: "", activity: null, goal: null });

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("kostdagbok-logg");
        if (res && res.value) setKostHist(JSON.parse(res.value));
      } catch (e) {}
      try {
        const res2 = await window.storage.get("kostdagbok-profil");
        if (res2 && res2.value) setProfile(JSON.parse(res2.value));
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  // ---------- LOGGNING ----------
  const logMeal = async (cat, meal, blinkKey) => {
    const item = { name: meal.name, protein: meal.protein, cat, time: timeNow() };
    const idx = kostHist.findIndex((d) => d.date === dateKey());
    let newHist;
    if (idx >= 0) {
      newHist = kostHist.map((d, i) => (i === idx ? { ...d, meals: [...d.meals, item] } : d));
    } else {
      newHist = [...kostHist, { date: dateKey(), dateLabel: todayStr(), meals: [item] }];
    }
    setKostHist(newHist);
    setJustAdded(blinkKey);
    setTimeout(() => setJustAdded(null), 900);
    try { await window.storage.set("kostdagbok-logg", JSON.stringify(newHist)); } catch (e) {}
  };

  const removeMeal = async (dayIdx, mealIdx) => {
    let newHist = kostHist.map((d, i) =>
      i === dayIdx ? { ...d, meals: d.meals.filter((_, j) => j !== mealIdx) } : d
    );
    newHist = newHist.filter((d) => d.meals.length > 0);
    setKostHist(newHist);
    try { await window.storage.set("kostdagbok-logg", JSON.stringify(newHist)); } catch (e) {}
  };

  const todayIdx = kostHist.findIndex((d) => d.date === dateKey());
  const todayMeals = todayIdx >= 0 ? kostHist[todayIdx].meals : [];
  const todayProtein = todayMeals.reduce((a, m) => a + m.protein, 0);

  // ---------- PROFIL & ENERGIBEHOV ----------
  // Mifflin-St Jeor: BMR = 10×vikt + 6,25×längd − 5×ålder (+5 man / −161 kvinna)
  const calcNeeds = (p) => {
    if (!p) return null;
    const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === "man" ? 5 : -161);
    const factor = p.activity === "hog" ? 1.7 : p.activity === "lag" ? 1.3 : 1.5;
    const tdee = Math.round((bmr * factor) / 10) * 10;
    return {
      tdee,
      minska: tdee - 400,   // ca 0,3–0,5 kg/vecka ner
      behall: tdee,
      oka: tdee + 300,      // kontrollerad viktökning
    };
  };
  const needs = calcNeeds(profile);
  const kcalTarget = needs ? (profile.goal === "minska" ? needs.minska : profile.goal === "oka" ? needs.oka : needs.behall) : null;
  const proteinGoal = profile ? Math.round((profile.weight * 1.8) / 5) * 5 : PROTEIN_GOAL;
  const GOAL_LABEL = { minska: "Minska i vikt", behall: "Behålla vikt", oka: "Öka i vikt" };

  const saveProfile = async () => {
    const p = {
      sex: form.sex,
      age: Math.min(100, Math.max(15, parseInt(form.age) || 0)),
      weight: Math.min(250, Math.max(35, parseFloat(form.weight) || 0)),
      height: Math.min(230, Math.max(120, parseInt(form.height) || 0)),
      activity: form.activity || "medel",
      goal: form.goal,
    };
    setProfile(p);
    setEditProfile(false);
    try { await window.storage.set("kostdagbok-profil", JSON.stringify(p)); } catch (e) {}
  };
  const formOk = form.sex && form.goal && parseInt(form.age) >= 15 && parseFloat(form.weight) >= 35 && parseInt(form.height) >= 120;
  const openProfileEditor = () => {
    if (profile) setForm({ sex: profile.sex, age: String(profile.age), weight: String(profile.weight), height: String(profile.height), activity: profile.activity, goal: profile.goal });
    setEditProfile(true);
  };

  // ---------- SÄKERHETSKOPIA ----------
  const exportData = () => {
    const payload = { app: "kostdagbok", version: 1, exported: new Date().toISOString(), profile, kostHist };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kostdagbok-backup-${dateKey()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.app !== "kostdagbok" || !Array.isArray(data.kostHist)) throw new Error("fel format");
        setKostHist(data.kostHist);
        try { await window.storage.set("kostdagbok-logg", JSON.stringify(data.kostHist)); } catch (err) {}
        if (data.profile) {
          setProfile(data.profile);
          try { await window.storage.set("kostdagbok-profil", JSON.stringify(data.profile)); } catch (err) {}
        }
        setImportMsg("ok");
        setTimeout(() => { setImportMsg(null); setEditProfile(false); }, 1500);
      } catch (err) {
        setImportMsg("fel");
        setTimeout(() => setImportMsg(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ---------- STILAR ----------
  const S = {
    app: { fontFamily: "'Inter', sans-serif", background: C.bone, minHeight: "100vh", color: C.ink, paddingBottom: 90 },
    header: { background: C.ink, color: C.bone, padding: "26px 18px 20px" },
    kicker: { fontFamily: DISPLAY, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 11, color: C.amber },
    h1: { fontFamily: DISPLAY, fontWeight: 900, fontSize: 30, lineHeight: 1.05, textTransform: "uppercase", marginTop: 6 },
    tabbar: { position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", background: C.ink, borderTop: `3px solid ${C.amber}`, zIndex: 50 },
    tabBtn: (active) => ({
      flex: 1, padding: "14px 0 18px", background: "none", border: "none", cursor: "pointer",
      fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em",
      color: active ? C.amber : "#8A939F",
    }),
    addBtn: (added) => ({
      width: 40, height: 40, borderRadius: 12, border: "none", flexShrink: 0,
      background: added ? C.safe : C.amber, color: added ? "#fff" : C.ink,
      fontSize: 22, fontWeight: 800, cursor: "pointer", transition: "background 0.2s",
    }),
    macro: (bg, color) => ({
      fontFamily: DISPLAY, fontWeight: 800, fontSize: 10.5, background: bg, color,
      padding: "2px 7px", borderRadius: 8, whiteSpace: "nowrap",
    }),
  };

  // ---------- VY: IDAG ----------
  const renderIdag = () => {
    const pct = Math.min(100, Math.round((todayProtein / proteinGoal) * 100));

    return (
      <div style={{ padding: "18px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 20, textTransform: "uppercase" }}>Idag</div>
            <div style={{ fontSize: 13, color: C.gray, textTransform: "capitalize" }}>{todayStr()}</div>
          </div>
          <button onClick={openProfileEditor} style={{ background: "none", border: `2px solid ${C.line}`, borderRadius: 10, padding: "5px 10px", cursor: "pointer", fontFamily: DISPLAY, fontWeight: 800, fontSize: 11, textTransform: "uppercase", color: C.gray }}>
            ⚙️ Profil
          </button>
        </div>
        <div style={{ fontSize: 13, color: C.gray, margin: "6px 0 14px" }}>Glutenfritt · Laktosfritt · Bläddra bland förslagen och tryck + för att logga</div>

        {/* DITT DAGLIGA MÅL */}
        {needs && (
          <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderLeft: `6px solid ${C.amber}`, borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9A5A08" }}>
                Mål: {GOAL_LABEL[profile.goal]}
              </span>
              <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 22 }}>
                {kcalTarget} <span style={{ fontSize: 12, color: C.gray }}>kcal/dag</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, fontSize: 11.5 }}>
              {[["minska", "📉 Minska", needs.minska], ["behall", "⚖️ Behålla", needs.behall], ["oka", "📈 Öka", needs.oka]].map(([k, l, v]) => (
                <div key={k} style={{ flex: 1, textAlign: "center", padding: "7px 2px", borderRadius: 10, background: profile.goal === k ? C.amberSoft : C.bone, border: profile.goal === k ? `2px solid ${C.amber}` : `1px solid ${C.line}` }}>
                  <div style={{ color: C.gray }}>{l}</div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 13, color: profile.goal === k ? "#9A5A08" : C.ink }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: C.gray, marginTop: 8 }}>
              {profile.sex === "man" ? "Man" : "Kvinna"} · {profile.age} år · {profile.weight} kg · {profile.height} cm — ändra under ⚙️ Profil
            </div>
          </div>
        )}

        {/* DAGENS LOGG */}
        <div style={{ background: C.ink, color: C.bone, borderRadius: 14, padding: "16px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 15, textTransform: "uppercase", color: C.amber }}>Dagens protein</span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 20 }}>
              {todayProtein}<span style={{ fontSize: 13, color: "#9AA3AE" }}> / {proteinGoal} g</span>
            </span>
          </div>
          {/* Progress-mätare */}
          <div style={{ background: "#2E3540", borderRadius: 999, height: 12, marginTop: 10, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? C.safe : C.amber, borderRadius: 999, transition: "width 0.4s" }} />
          </div>
          <div style={{ fontSize: 12, color: "#9AA3AE", marginTop: 6 }}>
            {pct >= 100 ? "✓ Proteinmålet nått — bra jobbat!" : `${proteinGoal - todayProtein} g kvar till målet`}
          </div>

          {todayMeals.length > 0 && (
            <div style={{ marginTop: 12, borderTop: "1px dashed #3A424D", paddingTop: 8 }}>
              {todayMeals.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 13 }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 11, color: "#9AA3AE", width: 38 }}>{m.time}</span>
                  <span style={{ flex: 1, color: C.bone }}>{m.name}</span>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 12, color: C.amber }}>{m.protein} g</span>
                  <button onClick={() => removeMeal(todayIdx, i)} style={{ background: "none", border: "none", color: "#9AA3AE", fontSize: 16, cursor: "pointer", padding: "0 4px" }}>✕</button>
                </div>
              ))}
            </div>
          )}
          {todayMeals.length === 0 && (
            <div style={{ marginTop: 10, fontSize: 13, color: "#9AA3AE" }}>Inget loggat ännu — tryck + på en måltid nedan.</div>
          )}
        </div>

        {/* MÅLTIDSDATABAS — hopfällbara kategorier med slump-förslag */}
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 17, textTransform: "uppercase", margin: "6px 0 4px" }}>Måltidsförslag</div>
        <div style={{ fontSize: 13, color: C.gray, marginBottom: 12 }}>Tryck på en kategori för att bläddra — eller låt 🎲 välja åt dig</div>
        {KOST.map((section, si) => {
          const catOpen = openCat === si;
          const luckIdx = luck[si];
          return (
            <div key={si} style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 14, margin: "0 0 12px", overflow: "hidden" }}>
              <button
                onClick={() => setOpenCat(catOpen ? null : si)}
                style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  padding: "13px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
                  borderBottom: catOpen ? `2px solid ${C.ink}` : "none",
                }}
              >
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 15, textTransform: "uppercase", color: C.amber }}>
                  {section.icon} {section.cat}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: C.gray }}>{section.items.length} förslag</span>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 16, color: C.gray }}>{catOpen ? "▾" : "▸"}</span>
                </span>
              </button>

              {catOpen && (
                <div style={{ padding: "10px 14px 12px" }}>
                  <button
                    onClick={() => setLuck({ ...luck, [si]: Math.floor(Math.random() * section.items.length) })}
                    style={{
                      width: "100%", padding: "10px 0", marginBottom: 8, borderRadius: 10, border: `2px dashed ${C.amber}`,
                      background: C.amberSoft, color: "#9A5A08", fontFamily: DISPLAY, fontWeight: 800,
                      fontSize: 13, textTransform: "uppercase", letterSpacing: "0.04em", cursor: "pointer",
                    }}
                  >
                    🎲 Slumpa ett förslag
                  </button>

                  {section.items.map((m, i) => {
                    const key = `${si}-${i}`;
                    const added = justAdded === key;
                    const lucky = luckIdx === i;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: lucky ? "9px 8px" : "9px 0",
                          borderBottom: i < section.items.length - 1 ? `1px dashed ${C.line}` : "none",
                          background: lucky ? C.amberSoft : "none", borderRadius: lucky ? 10 : 0,
                          outline: lucky ? `2px solid ${C.amber}` : "none", transition: "background 0.3s",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
                            {lucky && <span style={{ fontSize: 13 }}>🎲</span>}
                            <span style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</span>
                          </div>
                          {m.desc && <div style={{ fontSize: 12.5, color: C.gray, marginTop: 2 }}>{m.desc}</div>}
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 5 }}>
                            <span style={S.macro("#FDEEDC", "#9A5A08")}>P {m.protein} g</span>
                            <span style={S.macro("#E3EDF3", C.pull)}>K {m.carbs} g</span>
                            <span style={S.macro("#EFE7F3", "#6B4E85")}>F {m.fat} g</span>
                            <span style={S.macro("#EAEFE6", C.legs)}>{m.kcal100} kcal/100 g</span>
                          </div>
                        </div>
                        <button style={S.addBtn(added)} onClick={() => logMeal(section.cat, m, key)}>
                          {added ? "✓" : "+"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ fontSize: 11.5, color: C.gray, textAlign: "center", padding: "8px 10px 10px" }}>
          Alla näringsvärden (protein, kolhydrater, fett, kcal) är ungefärliga per portion. Målet: {proteinGoal}+ g protein per dag, anpassat efter din vikt.
        </div>
      </div>
    );
  };

  // ---------- VY: HISTORIK ----------
  const renderHistorik = () => {
    const pastDays = kostHist
      .map((d, i) => ({ ...d, realIdx: i }))
      .filter((d) => d.date !== dateKey())
      .reverse();

    const daysHit = pastDays.filter((d) => d.meals.reduce((a, m) => a + m.protein, 0) >= proteinGoal).length;

    return (
      <div style={{ padding: "18px 14px" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 20, textTransform: "uppercase" }}>Historik</div>
        <div style={{ fontSize: 13, color: C.gray, margin: "4px 0 14px" }}>
          {pastDays.length} tidigare dagar · tryck på en dag för detaljer
        </div>

        {pastDays.length > 0 && (
          <div style={{ background: C.ink, color: C.bone, borderRadius: 14, padding: "14px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: C.amber }}>
              Dagar med nått proteinmål
            </span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 22 }}>
              {daysHit}<span style={{ fontSize: 13, color: "#9AA3AE" }}> / {pastDays.length}</span>
            </span>
          </div>
        )}

        {pastDays.length === 0 && (
          <div style={{ background: C.paper, border: `1px dashed ${C.line}`, borderRadius: 14, padding: "20px 16px", textAlign: "center", color: C.gray, fontSize: 13, marginBottom: 12 }}>
            Historiken byggs upp automatiskt — varje dags loggade måltider sparas här vid midnatt.
          </div>
        )}
        {pastDays.map((d) => {
          const open = kostExpanded === d.realIdx;
          const dayProtein = d.meals.reduce((a, m) => a + m.protein, 0);
          const hit = dayProtein >= proteinGoal;
          return (
            <div key={d.realIdx} style={{ background: C.paper, border: `1px solid ${C.line}`, borderLeft: `5px solid ${hit ? C.safe : C.amber}`, borderRadius: 14, margin: "0 0 10px", overflow: "hidden" }}>
              <button
                onClick={() => setKostExpanded(open ? null : d.realIdx)}
                style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>
                  <span style={{ fontWeight: 700, fontSize: 14, textTransform: "capitalize", display: "block" }}>{d.dateLabel}</span>
                  <span style={{ fontSize: 12, color: C.gray }}>{d.meals.length} måltider</span>
                </span>
                <span style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 15, color: hit ? C.safe : "#9A5A08", display: "block" }}>
                    {dayProtein} g {hit ? "✓" : ""}
                  </span>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 16, color: C.gray }}>{open ? "▾" : "▸"}</span>
                </span>
              </button>
              {open && (
                <div style={{ borderTop: `2px solid ${C.ink}`, padding: "8px 14px 12px" }}>
                  {d.meals.map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 13, borderBottom: i < d.meals.length - 1 ? `1px dotted ${C.line}` : "none" }}>
                      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 11, color: C.gray, width: 38 }}>{m.time}</span>
                      <span style={{ flex: 1 }}>{m.name}</span>
                      <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 12, color: "#9A5A08" }}>{m.protein} g</span>
                      <button onClick={() => removeMeal(d.realIdx, i)} style={{ background: "none", border: "none", color: C.gray, fontSize: 15, cursor: "pointer", padding: "0 4px" }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ---------- VY: PROFIL / ONBOARDING ----------
  const renderSetup = () => {
    const preview = formOk
      ? calcNeeds({ sex: form.sex, age: parseInt(form.age), weight: parseFloat(form.weight), height: parseInt(form.height), activity: form.activity || "medel" })
      : null;
    const previewKcal = preview ? (form.goal === "minska" ? preview.minska : form.goal === "oka" ? preview.oka : preview.behall) : null;

    const pickBtn = (active) => ({
      flex: 1, padding: "12px 6px", borderRadius: 12, cursor: "pointer",
      border: active ? `2px solid ${C.amber}` : `2px solid ${C.line}`,
      background: active ? C.amberSoft : "#fff", color: active ? "#9A5A08" : C.ink,
      fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, textTransform: "uppercase",
    });
    const numInput = {
      width: "100%", padding: "12px 10px", borderRadius: 12, border: `2px solid ${C.line}`,
      fontFamily: DISPLAY, fontWeight: 800, fontSize: 18, textAlign: "center", background: "#fff", color: C.ink,
      boxSizing: "border-box",
    };
    const label = { fontFamily: DISPLAY, fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: C.gray, margin: "16px 0 6px" };

    return (
      <div style={{ padding: "18px 14px" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 20, textTransform: "uppercase" }}>
          {profile ? "Din profil" : "Välkommen! 👋"}
        </div>
        <div style={{ fontSize: 13.5, color: C.gray, margin: "4px 0 4px" }}>
          {profile
            ? "Uppdatera dina uppgifter — behovet räknas om direkt."
            : "Innan vi kör: berätta lite om dig, så räknar appen ut exakt hur mycket du behöver äta per dag för att nå ditt mål."}
        </div>

        <div style={label}>Kön</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={pickBtn(form.sex === "man")} onClick={() => setForm({ ...form, sex: "man" })}>👨 Man</button>
          <button style={pickBtn(form.sex === "kvinna")} onClick={() => setForm({ ...form, sex: "kvinna" })}>👩 Kvinna</button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={label}>Ålder</div>
            <input style={numInput} type="number" inputMode="numeric" placeholder="35" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={label}>Vikt (kg)</div>
            <input style={numInput} type="number" inputMode="decimal" placeholder="80" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={label}>Längd (cm)</div>
            <input style={numInput} type="number" inputMode="numeric" placeholder="178" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
          </div>
        </div>

        <div style={label}>Aktivitetsnivå</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={pickBtn(form.activity === "lag")} onClick={() => setForm({ ...form, activity: "lag" })}>Låg</button>
          <button style={pickBtn(form.activity === "medel" || !form.activity)} onClick={() => setForm({ ...form, activity: "medel" })}>Medel</button>
          <button style={pickBtn(form.activity === "hog")} onClick={() => setForm({ ...form, activity: "hog" })}>Hög</button>
        </div>
        <div style={{ fontSize: 12, color: C.gray, marginTop: 5 }}>Låg = mest stillasittande · Medel = rör dig en del dagligen · Hög = fysiskt jobb, träning eller mycket vardagsmotion</div>

        <div style={label}>Vad är ditt mål med appen?</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { key: "minska", icon: "📉", title: "Minska i vikt", sub: "Ät ca 400 kcal under ditt behov — ca 0,3–0,5 kg ner per vecka" },
            { key: "behall", icon: "⚖️", title: "Behålla vikt", sub: "Ät i nivå med ditt behov — stabil vikt och bra energi" },
            { key: "oka", icon: "📈", title: "Öka i vikt", sub: "Ät ca 300 kcal över ditt behov — kontrollerad viktuppgång" },
          ].map((g) => (
            <button
              key={g.key}
              onClick={() => setForm({ ...form, goal: g.key })}
              style={{
                textAlign: "left", padding: "13px 14px", borderRadius: 14, cursor: "pointer",
                border: form.goal === g.key ? `2px solid ${C.amber}` : `2px solid ${C.line}`,
                background: form.goal === g.key ? C.amberSoft : "#fff",
              }}
            >
              <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 15, textTransform: "uppercase", color: form.goal === g.key ? "#9A5A08" : C.ink }}>{g.icon} {g.title}</div>
              <div style={{ fontSize: 12.5, color: C.gray, marginTop: 2 }}>{g.sub}</div>
            </button>
          ))}
        </div>

        {previewKcal && (
          <div style={{ background: C.ink, color: C.bone, borderRadius: 14, padding: "14px 16px", marginTop: 16 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.amber }}>Ditt dagliga mål</div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 28, marginTop: 2 }}>
              {previewKcal} <span style={{ fontSize: 14, color: "#9AA3AE" }}>kcal/dag</span>
            </div>
            <div style={{ fontSize: 12.5, color: "#9AA3AE", marginTop: 4 }}>
              Underhållsbehov: {preview.behall} kcal · Protein: {Math.round((parseFloat(form.weight) * 1.8) / 5) * 5} g/dag
            </div>
          </div>
        )}

        <button
          onClick={saveProfile}
          disabled={!formOk}
          style={{
            width: "100%", padding: "15px 0", marginTop: 14, borderRadius: 14, border: "none",
            background: formOk ? C.amber : C.line, color: formOk ? C.ink : C.gray,
            fontFamily: DISPLAY, fontWeight: 900, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.05em",
            cursor: formOk ? "pointer" : "default",
          }}
        >
          {profile ? "Spara ändringar" : "Spara & kom igång"}
        </button>
        {profile && (
          <button onClick={() => setEditProfile(false)} style={{ width: "100%", padding: "12px 0", marginTop: 8, borderRadius: 14, border: `2px solid ${C.line}`, background: "none", color: C.gray, fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, textTransform: "uppercase", cursor: "pointer" }}>
            Avbryt
          </button>
        )}
        {/* SÄKERHETSKOPIA */}
        <div style={label}>Säkerhetskopia</div>
        <div style={{ fontSize: 12.5, color: C.gray, marginBottom: 8 }}>
          Spara en fil med din profil och all historik — bra vid telefonbyte eller om webbläsarens data rensas.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={exportData}
            style={{ flex: 1, padding: "12px 6px", borderRadius: 12, cursor: "pointer", border: `2px solid ${C.line}`, background: "#fff", color: C.ink, fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, textTransform: "uppercase" }}
          >
            💾 Exportera
          </button>
          <label
            style={{ flex: 1, padding: "12px 6px", borderRadius: 12, cursor: "pointer", border: `2px solid ${C.line}`, background: "#fff", color: C.ink, fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, textTransform: "uppercase", textAlign: "center" }}
          >
            📥 Importera
            <input type="file" accept=".json,application/json" onChange={importData} style={{ display: "none" }} />
          </label>
        </div>
        {importMsg === "ok" && (
          <div style={{ marginTop: 8, padding: "10px 12px", borderRadius: 10, background: "#E5F0EA", color: C.safe, fontSize: 13, fontWeight: 700, textAlign: "center" }}>
            ✓ Datan är återställd!
          </div>
        )}
        {importMsg === "fel" && (
          <div style={{ marginTop: 8, padding: "10px 12px", borderRadius: 10, background: "#F7E3DE", color: "#C2472F", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
            Filen kunde inte läsas — kontrollera att det är en Kostdagbok-backup.
          </div>
        )}

        <div style={{ fontSize: 11.5, color: C.gray, textAlign: "center", padding: "12px 10px 4px" }}>
          Beräkningen använder Mifflin-St Jeor-formeln och är en uppskattning. Justera efter hur vikten faktiskt rör sig över några veckor.
        </div>
      </div>
    );
  };

  // ---------- RENDER ----------
  return (
    <div style={S.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <div style={S.header}>
        <div style={S.kicker}>Glutenfritt · Laktosfritt · Enkelt</div>
        <div style={S.h1}>Kost<span style={{ color: C.amber }}>dagbok</span></div>
      </div>

      {!loaded ? (
        <div style={{ padding: 40, textAlign: "center", color: C.gray }}>Laddar…</div>
      ) : !profile || editProfile ? renderSetup() : tab === "idag" ? renderIdag() : renderHistorik()}

      {loaded && profile && !editProfile && (
        <div style={S.tabbar}>
          <button style={S.tabBtn(tab === "idag")} onClick={() => setTab("idag")}>Idag</button>
          <button style={S.tabBtn(tab === "historik")} onClick={() => setTab("historik")}>Historik</button>
        </div>
      )}
    </div>
  );
}
