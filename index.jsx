import { useState, useEffect } from "react";

// ============================================================
//  KOSTDAGBOK v2 — fristående kostapp
//  Glutenfritt · Laktosfritt · Proteinfokus
//  Nytt i v2: tryckbara måltider med pop-up (lagom portion,
//  enkelt recept, "bra att veta"), handmåttsguide och
//  konkreta mängder genomgående.
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

// ---------- HANDMÅTTSGUIDEN ----------
const HAND_GUIDE = [
  { icon: "✋", what: "Handflata", food: "Kött, fisk & kyckling", amount: "ungefär en kortlek ≈ 150 g" },
  { icon: "✊", what: "Knuten näve", food: "Ris, pasta & potatis (kokt)", amount: "≈ 1,5 dl" },
  { icon: "👍", what: "Tumme", food: "Fett — olja, smör, jordnötssmör", amount: "≈ 1 msk" },
  { icon: "🤲", what: "Två kupade händer", food: "Grönsaker", amount: "fyll på — mer är bara bra" },
  { icon: "🌰", what: "Kupad handflata", food: "Nötter & müsli", amount: "≈ 30 g" },
];

// ---------- MÅLTIDSDATABAS ----------
// Varje måltid: portion (lagom mängd med handmått), recept (enkla steg
// med konkreta mängder) och veta (varför maten är bra — enkelt språk).
const KOST = [
  {
    cat: "Frukost", icon: "🌅",
    items: [
      {
        name: "Gröt-frukost", desc: "Glutenfria havregryn + laktosfri mjölk + 2 kokta ägg + banan",
        protein: 28, carbs: 60, fat: 14, kcal100: 110,
        portion: "1 dl torra havregryn + 2 ägg + 1 banan. Grynen sväller till ungefär en knuten näve färdig gröt.",
        recept: ["Koka 1 dl glutenfria havregryn med 2 dl laktosfri mjölk eller vatten, ca 3 min", "Koka äggen 8 min — gör gärna flera i förväg", "Skiva bananen över gröten och strö på lite kanel"],
        veta: "Havregryn ger långsamma kolhydrater som håller blodsockret jämnt — du blir mätt länge och slipper sötsug innan lunch.",
        kop: "Köp rena glutenfria havregryn — färdiga grötmixer och \"frukostgröt\" har ofta tillsatt socker. Ingredienslistan ska helst bara säga: havregryn.",
      },
      {
        name: "Kvarg-frukost", desc: "300 g naturell laktosfri kvarg + frysta bär + en kupad handflata glutenfri müsli",
        protein: 35, carbs: 30, fat: 5, kcal100: 90,
        portion: "300 g kvarg är ungefär 3 dl — en stor mugg. Müsli: en kupad handflata (≈ 30 g) räcker.",
        recept: ["Lägg 300 g laktosfri kvarg i en skål", "Toppa med en näve frysta bär — de tinar på några minuter", "Strö över en kupad handflata GF müsli"],
        veta: "Kvarg är ett av de mest proteintäta livsmedel som finns — mättar länge utan många kalorier.",
        kop: "Välj naturell kvarg — den har ca 4 g socker per 100 g, och det är mjölkens eget. Smaksatt kvarg kan ha dubbelt så mycket, alltså flera teskedar tillsatt socker per burk. Bär: frysta utan sockerlag.",
      },
      {
        name: "Äggröra", desc: "4 ägg + 2 skivor mörkt glutenfritt bröd + tomat",
        protein: 30, carbs: 30, fat: 20, kcal100: 160,
        portion: "4 ägg + 2 brödskivor. Välj mörkt GF-bröd med frön om det finns — det mättar längre än ljust.",
        recept: ["Vispa 4 ägg med en nypa salt", "Stek på medelvärme i 1 tsk smör eller olja — rör tills krämig", "Servera på 2 skivor rostat bröd med tomatskivor"],
        veta: "Mörkt bröd med hela korn och frön ger ett jämnare blodsocker än ljust bröd — det betyder jämnare humör, mer ork och mindre sötsug strax efter. Äggen innehåller alla aminosyror kroppen behöver.",
        kop: "Brödet: välj mörkt GF-bröd med synliga frön och minst 5 g fiber per 100 g. Många glutenfria bröd är ljusa och gjorda mest på stärkelse — de ger snabbt blodsocker och kort mättnad.",
      },
      {
        name: "Overnight oats", desc: "GF havregryn + laktosfri yoghurt + chiafrön + bär. Görs kvällen innan",
        protein: 22, carbs: 45, fat: 10, kcal100: 120,
        portion: "1 dl gryn + 1 msk chiafrön (en tumme). Det låter lite men chiafröna sväller rejält.",
        recept: ["Blanda 1 dl GF havregryn, 1 msk chiafrön och 1,5 dl laktosfri yoghurt i en burk", "Ställ i kylen över natten", "Toppa med en näve bär på morgonen"],
        veta: "Chiafrön och havre är fulla av fibrer som håller dig mätt hela förmiddagen och ger ett stabilt blodsocker.",
        kop: "Yoghurt: välj naturell — smaksatt yoghurt kan innehålla 2–3 sockerbitar per portion.",
      },
      {
        name: "Proteinpannkakor", desc: "2 ägg + 1 banan + 1 dl GF havregryn — mixa och stek. 1–2 msk kvarg på toppen",
        protein: 26, carbs: 40, fat: 12, kcal100: 150,
        portion: "Hela satsen är en portion — det blir 3–4 små pannkakor.",
        recept: ["Mixa 2 ägg, 1 banan och 1 dl GF havregryn till en smet", "Stek små pannkakor på medelvärme, ca 2 min per sida", "Toppa med 1–2 msk kvarg och en näve bär"],
        veta: "Bananen sötar naturligt — inget socker behöver tillsättas. Ägg och havre ger både protein och långsam energi.",
      },
      {
        name: "Skyr-bowl", desc: "Naturell laktosfri skyr + GF granola + 1 tsk honung + skivad banan",
        protein: 30, carbs: 40, fat: 6, kcal100: 100,
        portion: "2–3 dl skyr + en kupad handflata granola. Honung: 1 tsk räcker — det är sött nog och bara ca 20 kcal.",
        recept: ["Häll upp 2–3 dl laktosfri skyr", "Strö över en kupad handflata GF granola", "Ringla över 1 tsk honung och skiva en halv banan på toppen"],
        veta: "Skyr har mest protein av alla mejeriprodukter. Honung är socker — teskeden ger smaken utan att göra frukosten till en efterrätt.",
        kop: "Välj naturell skyr. Granola: vänd på påsen — under ca 15 g socker per 100 g är bra, och nötter ska stå högt upp i ingredienslistan.",
      },
      {
        name: "Omelett med skinka", desc: "3 ägg + rökt skinka + paprika + gräslök",
        protein: 28, carbs: 5, fat: 18, kcal100: 150,
        portion: "3 ägg + 2–3 skivor skinka är en lagom omelett för de flesta.",
        recept: ["Vispa 3 ägg med en nypa salt", "Häll i het panna med 1 tsk smör och låt stelna på medelvärme", "Lägg på strimlad skinka, paprika och gräslök — vik ihop"],
        veta: "En proteinrik start utan snabba kolhydrater — bra de dagar du vill hålla blodsockret extra jämnt.",
        kop: "Skinka: välj en med minst 85–90 % kötthalt — billigare pålägg drygas ut med vatten och stärkelse.",
      },
      {
        name: "Frukostsmoothie", desc: "Proteinpulver + banan + frysta bär + laktosfri mjölk. Klar på 2 min",
        protein: 30, carbs: 40, fat: 5, kcal100: 80,
        portion: "1 skopa pulver (ca 30 g) + 1 banan + en näve bär — mer behövs inte.",
        recept: ["Mixa 1 skopa proteinpulver, 1 banan, en näve frysta bär och 2–3 dl laktosfri mjölk", "Klart på 2 minuter"],
        veta: "Bra när tiden inte finns — men mat man tuggar mättar oftast bättre än dryck. Välj smoothien när alternativet är ingen frukost alls.",
        kop: "Ett bra pulver: minst 70 g protein per 100 g (står på näringstabellen), kort ingredienslista där proteinet står först, och under 3 g socker per portion. Ett dåligt: nere på 50–60 g protein och maltodextrin eller socker högt upp i listan — maltodextrin är i praktiken billigt socker som fyller ut. Laktosfritt: välj vassleisolat (nästan laktosfritt av naturen) eller veganskt av ärt/soja — vanligt vasslekoncentrat innehåller laktos.",
      },
      {
        name: "Makrillmacka + ägg", desc: "Mörkt GF bröd + makrill i tomatsås + 1 kokt ägg",
        protein: 24, carbs: 30, fat: 18, kcal100: 180,
        portion: "1 burk makrill räcker till 2 mackor. Välj mörkt GF-bröd med frön — det mättar längst.",
        recept: ["Rosta 1–2 skivor GF-bröd", "Bred på makrill i tomatsås", "Servera med 1 kokt ägg"],
        veta: "Makrill är fet fisk — full av omega-3 som hjärta och hjärna behöver. Fisk 2–3 gånger i veckan, gärna fet, är Livsmedelsverkets rekommendation.",
        kop: "Samma brödregel som alltid: mörkt GF-bröd med frön och minst 5 g fiber per 100 g.",
      },
      {
        name: "Keso-tallrik", desc: "Laktosfri keso + persika eller ananas + en kupad handflata nötter",
        protein: 26, carbs: 20, fat: 14, kcal100: 120,
        portion: "En burk keso (250 g) + en kupad handflata nötter (≈ 30 g). Nötter är nyttiga men energitäta — handflatan är gränsen.",
        recept: ["Häll upp keson", "Skiva persika eller ananas över", "Toppa med nötterna"],
        veta: "Keso ger mycket protein för få kalorier. Nötternas fett är av det nyttiga slaget — men mängden avgör: ca 30 g om dagen är lagom.",
      },
      {
        name: "Frukostwrap", desc: "Majstortilla + äggröra på 2 ägg + ½ avokado + tomat",
        protein: 20, carbs: 30, fat: 18, kcal100: 170,
        portion: "1 wrap med 2 ägg och en halv avokado räcker gott.",
        recept: ["Gör äggröra på 2 ägg", "Bred ½ mosad avokado på en majstortilla", "Lägg på äggröran och tomat — rulla ihop"],
        veta: "Avokado ger nyttigt fett som mättar — en halv räcker, en hel dubblar kalorierna. Spara andra halvan med kärnan kvar.",
        kop: "Tortillas: kolla att de är 100 % majs — vissa \"majstortillas\" blandar i vetemjöl och är då inte glutenfria.",
      },
      {
        name: "Chiapudding", desc: "3 msk chiafrön + laktosfri mjölk + proteinpulver. Svalnar över natten",
        protein: 24, carbs: 20, fat: 12, kcal100: 110,
        portion: "3 msk chiafrön låter lite — men de sväller till en hel skål.",
        recept: ["Blanda 3 msk chiafrön, 1 skopa proteinpulver och 2,5 dl laktosfri mjölk", "Rör om efter 10 min så det inte klumpar sig", "Låt stå i kylen över natten — toppa med bär"],
        veta: "Chiafrön är små fiberbomber — de sväller i magen och håller dig mätt länge.",
        kop: "Ett bra pulver: minst 70 g protein per 100 g (står på näringstabellen), kort ingredienslista där proteinet står först, och under 3 g socker per portion. Ett dåligt: nere på 50–60 g protein och maltodextrin eller socker högt upp i listan — maltodextrin är i praktiken billigt socker som fyller ut. Laktosfritt: välj vassleisolat (nästan laktosfritt av naturen) eller veganskt av ärt/soja — vanligt vasslekoncentrat innehåller laktos.",
      },
      {
        name: "Ägg & avokadomacka", desc: "2 skivor mörkt GF bröd + 2 ägg + ½ avokado + flingsalt",
        protein: 20, carbs: 30, fat: 20, kcal100: 180,
        portion: "2 skivor mörkt GF-bröd + ½ avokado. Den andra halvan håller till imorgon om kärnan får sitta kvar.",
        recept: ["Rosta brödet", "Mosa ½ avokado med lite flingsalt och bred på", "Skiva 2 kokta ägg över"],
        veta: "Mörkt fröbröd + ägg + avokado är en trio som håller blodsockret jämnt hela förmiddagen — jämnare ork och mindre sug.",
        kop: "Brödet: mörkt GF-bröd med frön och minst 5 g fiber per 100 g mättar längst och håller blodsockret jämnast.",
      },
      {
        name: "Risgrynsgröt-frukost", desc: "Risgrynsgröt på laktosfri mjölk + kanel + 2 kokta ägg vid sidan",
        protein: 22, carbs: 50, fat: 12, kcal100: 110,
        portion: "En djup tallrik gröt (ca 3 dl) + 2 ägg.",
        recept: ["Koka risgrynsgröt på laktosfri mjölk — eller värm färdigkokt", "Strö över kanel", "Ät 2 kokta ägg vid sidan för proteinet"],
        veta: "Risgrynsgröt är snabb energi — äggen bromsar blodsockret och gör frukosten komplett.",
      },
      {
        name: "Turbofrukost", desc: "Naturell laktosfri drickkvarg + banan + en kupad handflata mandlar. När det är bråttom",
        protein: 25, carbs: 35, fat: 10, kcal100: 120,
        portion: "1 flaska drickkvarg + 1 banan + en kupad handflata mandlar (ca 20 st).",
        recept: ["Ta med dig allt — ät på vägen"],
        veta: "Räddaren när det är bråttom. Mandlarna gör att energin räcker längre än bara kvarg och banan.",
        kop: "Drickkvarg: välj naturell eller \"utan tillsatt socker\" — smaksatta kan innehålla 3–4 sockerbitar per flaska.",
      },
    ],
  },
  {
    cat: "Lunch", icon: "🍱",
    items: [
      {
        name: "Matlåda: kyckling & ris", desc: "150 g kycklingfilé + 1,5 dl kokt ris + fryst broccoli + 1 msk olivolja",
        protein: 42, carbs: 50, fat: 10, kcal100: 130,
        portion: "Kyckling: en handflata, stor som en kortlek (≈ 150 g). Ris: en knuten näve kokt (≈ 1,5 dl). Broccoli: så mycket du vill.",
        recept: ["Stek eller ugnsbaka kycklingfilén — 200° i ca 20 min", "Koka riset", "Ånga broccolin och ringla över 1 msk olivolja (en tumme)"],
        veta: "Klassikern av en anledning: mager proteinkälla, långsam energi och grönsaker. Olivoljan hjälper kroppen ta upp grönsakernas vitaminer.",
      },
      {
        name: "Matlåda: köttfärs & potatis", desc: "150 g stekt köttfärs (max 12 %) + kokt potatis + morötter",
        protein: 35, carbs: 40, fat: 15, kcal100: 120,
        portion: "Färs: en handflata (≈ 150 g). Potatis: 2–3 stycken i nävstorlek.",
        recept: ["Stek färsen med hackad lök — salta och peppra", "Koka potatisen ca 20 min", "Koka eller ånga morötterna"],
        veta: "Välj färs med max 12 % fett — samma protein men färre kalorier. Potatis är naturligt glutenfri och mättar bra.",
      },
      {
        name: "Tonfisksallad", desc: "1 burk tonfisk + 2 kokta ägg + bönor + majs + 1 msk olivolja. Klar på 5 min",
        protein: 40, carbs: 25, fat: 15, kcal100: 110,
        portion: "1 burk tonfisk + 2 ägg. Olivolja: 1 msk (en tumme) — det gör salladen mättande utan att bli för mycket.",
        recept: ["Häll av tonfisken", "Blanda med kokta ägg i klyftor, bönor och majs", "Ringla över 1 msk olivolja och pressa citron"],
        veta: "Tonfisk är mager och proteintät fisk. Bönorna ger fibrer som gör att salladen mättar på riktigt — och allt är klart på 5 minuter.",
        kop: "Tonfisk: välj i vatten, inte i olja — halva kalorierna, samma protein.",
      },
      {
        name: "Kycklingsallad", desc: "Strimlad kycklingfilé + blandsallad + gurka + tomat + 1 msk vinägrett",
        protein: 38, carbs: 10, fat: 12, kcal100: 90,
        portion: "Kyckling: en handflata (≈ 150 g). Sallad och grönsaker: så mycket du orkar. Vinägrett: 1 msk.",
        recept: ["Strimla stekt eller färdiggrillad kycklingfilé", "Blanda med sallad, gurka och tomat", "Toppa med 1 msk vinägrett"],
        veta: "Grönsaker kan du alltid ta mer av — det är dressingen som avgör kalorierna i en sallad. Håll den till en tumme.",
        kop: "Dressing: i köpta vinägretter står socker ofta högt i listan. Enklast och bäst: 1 msk olivolja + lite vinäger, salt och peppar.",
      },
      {
        name: "Räksallad", desc: "Räkor + 2 kokta ägg + ½ avokado + romansallad + citron",
        protein: 32, carbs: 8, fat: 16, kcal100: 100,
        portion: "150–200 g skalade räkor + 2 ägg + ½ avokado.",
        recept: ["Skala räkorna", "Blanda med romansallad, ägg i klyftor och skivad avokado", "Pressa över citron"],
        veta: "Räkor är nästan rent protein. Avokadon står för det nyttiga fettet — en halv räcker.",
      },
      {
        name: "Kycklingwok", desc: "Kyckling + wokgrönsaker + risnudlar + GF soja (tamari)",
        protein: 40, carbs: 45, fat: 10, kcal100: 120,
        portion: "Kyckling: en handflata. Nudlar: en knuten näve kokta. Grönsaker: två kupade händer.",
        recept: ["Stek strimlad kyckling i het panna", "Lägg i wokgrönsaker och stek 3–4 min", "Blanda i kokta risnudlar och 1–2 msk tamari"],
        veta: "Tamari är soja gjord utan vete — samma smak, helt glutenfri. Mycket grönsaker gör woken mättande utan många kalorier.",
      },
      {
        name: "Lax & quinoa-bowl", desc: "Varmrökt lax + kokt quinoa + edamame + gurka",
        protein: 34, carbs: 35, fat: 18, kcal100: 140,
        portion: "Lax: en handflata (≈ 125–150 g). Quinoa: en knuten näve kokt.",
        recept: ["Koka quinoan enligt paketet, ca 15 min", "Bryt laxen i bitar", "Blanda med edamame och gurka i en skål"],
        veta: "Lax är fet fisk med omega-3 — bra för hjärta och hjärna. Quinoa ger både protein och långsamma kolhydrater.",
      },
      {
        name: "Köttfärsbiffar & mos", desc: "Biffar på färs + potatismos på laktosfri mjölk + 1–2 tsk lingon",
        protein: 36, carbs: 40, fat: 18, kcal100: 130,
        portion: "2 biffar i handflatestorlek + mos av 2–3 potatisar i nävstorlek. Lingon: 1–2 tsk.",
        recept: ["Forma biffar av 150 g färs — stek 4–5 min per sida", "Mosa kokt potatis med ca ½ dl laktosfri mjölk", "Servera med 1–2 tsk lingonsylt"],
        veta: "Lingonsylt är socker — ett par teskedar ger smaken utan att måltiden blir en efterrätt.",
      },
      {
        name: "Stekt ris med ägg", desc: "Gårdagens ris + 2 ägg + kycklingrester + ärtor + tamari",
        protein: 38, carbs: 50, fat: 14, kcal100: 150,
        portion: "Ris: en knuten näve. Ägg: 2 st. Kyckling: en halv handflata rester.",
        recept: ["Stek gårdagens kalla ris i het panna med 1 msk olja", "Skjut riset åt sidan, knäck i 2 ägg och rör om", "Blanda i kycklingrester, ärtor och 1 msk tamari"],
        veta: "Perfekt resträtt — kallt kokt ris får dessutom mer så kallad resistent stärkelse, som är snäll mot både magen och blodsockret.",
      },
      {
        name: "Pulled chicken-wrap", desc: "Majstortilla + kyckling + majs + 1 msk laktosfri gräddfil",
        protein: 35, carbs: 35, fat: 10, kcal100: 140,
        portion: "1–2 tortillas. En handflata kyckling per wrap. Gräddfil: 1 msk per wrap räcker för krämigheten.",
        recept: ["Värm pulled chicken — eller strimla färdiggrillad kyckling", "Fyll majstortillan med kyckling, majs och 1 msk laktosfri gräddfil", "Rulla ihop"],
        veta: "Majstortillas är naturligt glutenfria. Med gräddfilen är det matskeden som avgör — en per wrap räcker.",
        kop: "Färdig pulled chicken ligger ofta i sötad BBQ-sås — välj naturell/okryddad, eller kolla att socker inte står bland de första ingredienserna.",
      },
      {
        name: "Omelett på rester", desc: "3–4 ägg + gårdagens middagsrester + grönsaker",
        protein: 30, carbs: 15, fat: 18, kcal100: 140,
        portion: "3–4 ägg + ungefär en handflata rester.",
        recept: ["Vispa 3–4 ägg", "Stek gårdagens rester varma i pannan", "Häll över äggen och låt stelna på medelvärme"],
        veta: "Bästa sättet att rädda gårdagens middag — äggen gör resterna till en komplett måltid.",
      },
      {
        name: "Linssoppa + ägg", desc: "Röda linser + krossade tomater + buljong. GF bröd + kokt ägg till",
        protein: 24, carbs: 45, fat: 8, kcal100: 90,
        portion: "En djup tallrik soppa (ca 4 dl) + 1 brödskiva + 1 ägg.",
        recept: ["Koka 2 dl röda linser med krossade tomater och buljong, ca 15 min", "Smaka av med spiskummin eller curry", "Servera med mörkt GF-bröd och 1 kokt ägg"],
        veta: "Linser är billigt växtprotein fullt av fibrer — snällt mot blodsockret och mättar länge. Ägget lyfter proteinet till en full lunch.",
      },
      {
        name: "Ugnsbakad torsk", desc: "Torskfilé + kokt potatis + smält smör eller laktosfri remoulad",
        protein: 32, carbs: 35, fat: 8, kcal100: 90,
        portion: "En handflata torsk är lagom — ungefär som en kortlek, ca 150 g. Ingen våg behövs. Smör: 1 tsk–1 msk.",
        recept: ["Salta torskfilén och lägg i en ugnsform", "Baka i 175° i 15–20 min", "Servera med kokt potatis och 1 tsk–1 msk smält smör"],
        veta: "Torsk är mager fisk — nästan rent protein och skonsam för magen. Vitfisk som torsk får gärna ätas ofta.",
      },
      {
        name: "Kikärtsgryta (veg)", desc: "Kikärtor + kokosmjölk + curry + ris. Billig och mättande",
        protein: 22, carbs: 60, fat: 18, kcal100: 120,
        portion: "En djup tallrik gryta + en knuten näve ris. Kokosmjölken är fet — ½ burk räcker till 2 portioner.",
        recept: ["Fräs 1 msk curry i en kastrull och häll i ½ burk kokosmjölk", "Lägg i 1 burk avsköljda kikärtor och sjud 10 min", "Servera med ris"],
        veta: "Kikärtor ger protein och fibrer till lågt pris. Kokosmjölk är gott men energitätt — det är den som avgör grytans kalorier.",
        kop: "Kokosmjölk: light-varianten har ungefär halva kalorierna och funkar precis lika bra i gryta.",
      },
      {
        name: "Grillad kyckling & potatissallad", desc: "Grillad kycklingfilé + kall potatissallad på laktosfri gräddfil",
        protein: 40, carbs: 35, fat: 12, kcal100: 120,
        portion: "Kyckling: en handflata. Potatis: 2–3 kalla i nävstorlek. Gräddfil: 1–2 msk till salladen.",
        recept: ["Grilla eller stek kycklingfilén", "Blanda kall kokt potatis med 1–2 msk laktosfri gräddfil, gräslök och lite senap", "Servera ihop"],
        veta: "Kall kokt potatis innehåller resistent stärkelse — mättar bra och är snällare mot blodsockret än varm.",
      },
    ],
  },
  {
    cat: "Middag", icon: "🍽️",
    items: [
      {
        name: "Kyckling & ris (storkok)", desc: "Kycklingfilé i ugn 200° i 20 min + ris + fryst grönsaksblandning",
        protein: 42, carbs: 50, fat: 10, kcal100: 130,
        portion: "Per portion: en handflata kyckling (≈ 150 g) + en knuten näve ris + två kupade händer grönsaker.",
        recept: ["Lägg kycklingfiléer i ugnsform, salta och peppra — 200° i 20 min", "Koka riset", "Värm grönsaksblandningen och fördela allt i matlådor"],
        veta: "Storkok betyder flera dagars bra mat på en gång — när maten redan står klar i kylen är det mycket lättare att äta rätt.",
      },
      {
        name: "Kycklinglårfilé i ugn", desc: "Kycklinglårfilé + klyftpotatis + morötter i ugn 200° i 35 min. Saftigare än filé",
        protein: 40, carbs: 40, fat: 18, kcal100: 130,
        portion: "2–3 lårfiléer ≈ en handflata. Klyftpotatis: 2–3 potatisar per person.",
        recept: ["Lägg lårfiléer, klyftad potatis och morötter i en ugnsform", "Ringla över 1 msk olja, salta och strö på paprikapulver", "In i ugnen — 200° i 35 min"],
        veta: "Lårfilé är saftigare än bröstfilé och nästan omöjlig att torka ut — lite mer fett, men fortfarande ett riktigt bra proteinval.",
      },
      {
        name: "Ugnslax & potatis", desc: "Fryst laxfilé 200° i 25 min + kokt potatis + citron",
        protein: 34, carbs: 35, fat: 20, kcal100: 130,
        portion: "En laxfilé (≈ 125 g) är en lagom portion — ungefär en handflata.",
        recept: ["Lägg fryst laxfilé i en form — ingen upptining behövs", "Salta och lägg citronskivor på toppen", "200° i 25 min. Servera med kokt potatis"],
        veta: "Lax är fet fisk — och omega-3-fettet är själva poängen. Fet fisk 2–3 gånger i veckan är rekommendationen, och den här kräver noll planering.",
      },
      {
        name: "Chili con carne (storkok)", desc: "Färs + kidneybönor + krossade tomater + ris. Billigast per portion",
        protein: 40, carbs: 45, fat: 14, kcal100: 120,
        portion: "En djup tallrik chili + en knuten näve ris per person.",
        recept: ["Bryn 500 g färs med lök och vitlök", "Häll i krossade tomater, avsköljda kidneybönor och chilipulver", "Sjud minst 20 min — räcker till 4 portioner"],
        veta: "Bönorna gör chilin billigare, fiberrikare och mer mättande — du behöver mindre kött per portion utan att tappa protein.",
      },
      {
        name: "Tacos fredag", desc: "Majstortillas (naturligt glutenfria) + färs + laktosfri gräddfil",
        protein: 35, carbs: 40, fat: 20, kcal100: 160,
        portion: "100–150 g färs per person + 2–3 tortillas. Gräddfil: 1 msk per taco räcker.",
        recept: ["Stek färsen och krydda — kolla att kryddmixen är glutenfri", "Värm majstortillas", "Bygg med grönsaker och 1 msk laktosfri gräddfil per taco"],
        veta: "Fyll halva tacon med grönsaker — samma goda smak, hälften så tung. Majstortillas är naturligt glutenfria.",
        kop: "Kryddmixen: kolla att den är glutenfri och att socker inte står först i listan — eller krydda själv med spiskummin, paprikapulver och chili.",
      },
      {
        name: "Kycklinggryta med kokosmjölk", desc: "Kyckling + kokosmjölk + röd curry + paprika + ris",
        protein: 38, carbs: 45, fat: 22, kcal100: 130,
        portion: "En handflata kyckling per person + en knuten näve ris. 1 burk kokosmjölk räcker till 3–4 portioner.",
        recept: ["Stek kycklingbitar med 1 msk röd currypasta", "Häll i kokosmjölk och strimlad paprika — sjud 10 min", "Servera med ris"],
        veta: "Kokosmjölken står för de flesta kalorierna i en gryta — sprid ut burken på flera portioner så blir den lagom.",
      },
      {
        name: "Lövbiff & klyftpotatis", desc: "Lövbiff + klyftpotatis i ugn + laktosfri bearnaise",
        protein: 40, carbs: 40, fat: 22, kcal100: 140,
        portion: "150–200 g lövbiff = en stor handflata. Bearnaise: 1–2 msk — inte fritt fram.",
        recept: ["Klyfta potatis, ringla över olja och salt — 225° i 30 min", "Stek lövbiffen hastigt, ca 1 min per sida i het panna", "Servera med 1–2 msk laktosfri bearnaise"],
        veta: "Lövbiff är magert nötkött som är klart på minuter. Såsen är det godaste — och fetaste — så det är matskedarna som avgör måltiden.",
      },
      {
        name: "Fläskfilé med svampsås", desc: "Fläskfilé i ugn + ris + sås på laktosfri matlagningsgrädde",
        protein: 42, carbs: 45, fat: 18, kcal100: 130,
        portion: "En handflata fläskfilé (≈ 150 g) + en knuten näve ris.",
        recept: ["Bryn fläskfilén runt om och sätt in i ugnen, 175° tills den är genomstekt", "Stek svamp, häll i laktosfri matlagningsgrädde och låt sjuda ihop", "Servera med ris"],
        veta: "Fläskfilé är en av de magraste styckdetaljerna som finns — nästan lika mager som kycklingfilé.",
      },
      {
        name: "Hemmagjorda hamburgare", desc: "Burgare på färs + GF hamburgerbröd + laktosfri ost + sallad, tomat & lök",
        protein: 38, carbs: 40, fat: 22, kcal100: 180,
        portion: "1 burgare på 150 g färs räcker — vill du ha mer, ta mer sallad hellre än dubbel burgare.",
        recept: ["Forma biffar av färsen, salta och peppra", "Stek eller grilla 3–4 min per sida", "Bygg med GF-bröd, laktosfri ost, sallad, tomat och lök"],
        veta: "Hemmagjort slår alltid snabbmat — du bestämmer fetthalten och mängden själv. Och grönsakerna i burgaren räknas!",
        kop: "Bröd: GF-hamburgerbröd med fiber om det finns. Och ketchupen är det sötaste på bordet — 1 msk räcker.",
      },
      {
        name: "Kyckling-fajitas", desc: "Strimlad kyckling + paprika + lök + fajitakrydda + majstortillas",
        protein: 38, carbs: 40, fat: 14, kcal100: 140,
        portion: "En handflata kyckling per person + 2–3 tortillas.",
        recept: ["Stek strimlad kyckling i het panna", "Lägg i strimlad paprika och lök — stek 5 min till", "Krydda med fajitakrydda och servera i varma majstortillas"],
        veta: "Paprikan och löken gör halva rätten till grönsaker utan att det märks — ett smart sätt att äta mer grönt.",
      },
      {
        name: "Köttbullar & mos", desc: "Färs + GF ströbröd + ägg. Mos på laktosfri mjölk + 1–2 tsk lingon",
        protein: 34, carbs: 45, fat: 20, kcal100: 140,
        portion: "6–8 köttbullar + mos av 2–3 potatisar. Lingon: 1–2 tsk.",
        recept: ["Blanda 500 g färs med 1 ägg och 0,5 dl GF ströbröd", "Rulla bullar och stek runt om", "Mosa kokt potatis med ca ½ dl laktosfri mjölk — servera med 1–2 tsk lingon"],
        veta: "Husmanskost kan absolut vara vardagsmat — kolla bara att ströbrödet är glutenfritt. Lingonsylt är socker, så teskedarna räcker.",
        kop: "Ströbrödet måste vara märkt glutenfritt — vanligt ströbröd är gjort på vete.",
      },
      {
        name: "GF lasagne (storkok)", desc: "Glutenfria plattor + köttfärssås + laktosfri ost. Frys i portioner",
        protein: 36, carbs: 45, fat: 20, kcal100: 150,
        portion: "En bit stor som din handflata — och lite till på höjden — är en portion.",
        recept: ["Gör köttfärssås på 500 g färs och krossade tomater", "Varva sås och GF-plattor i en form, laktosfri ost mellan lagren och på toppen", "225° i 30 min. Frys resten i portionsbitar"],
        veta: "Lasagne går utmärkt att göra glutenfri. Frys i portioner — då finns snabb hemlagad mat de dagar orken inte finns, istället för att beställa.",
      },
      {
        name: "Thaicurry med räkor", desc: "Räkor eller kyckling + grön curry + kokosmjölk + ris",
        protein: 32, carbs: 45, fat: 18, kcal100: 120,
        portion: "150–200 g räkor + en knuten näve ris. Kokosmjölk: ½ burk till 2 portioner.",
        recept: ["Fräs 1 msk grön currypasta och häll i kokosmjölken", "Lägg i räkorna och sjud 3–4 min tills de är rosa", "Servera med ris"],
        veta: "Räkor är klara på minuter och nästan rent protein. Precis som i andra grytor är det kokosmjölken som bär kalorierna.",
      },
      {
        name: "Pytt i panna + stekta ägg", desc: "Tärnad potatis + korv/kött + lök + 2 stekta ägg + rödbetor",
        protein: 30, carbs: 40, fat: 22, kcal100: 140,
        portion: "En djup tallrik pytt + 2 ägg. Rödbetor: 3–4 skivor.",
        recept: ["Stek tärnad potatis tills den är gyllene", "Lägg i tärnat kött eller korv och lök — stek klart", "Toppa med 2 stekta ägg och rödbetor"],
        veta: "Klassisk resträtt — äggen på toppen gör pytten till en komplett måltid med fullvärdigt protein.",
      },
      {
        name: "Spaghetti & köttfärssås", desc: "GF spaghetti + färs + krossade tomater + lök & vitlök. Lite riven laktosfri ost på toppen",
        protein: 38, carbs: 55, fat: 16, kcal100: 140,
        portion: "Pasta: en knuten näve kokt. Färs i såsen: en handflata per person. Riven ost: två tummar.",
        recept: ["Bryn färsen med lök och vitlök", "Häll i krossade tomater och sjud minst 15 min", "Koka GF-spaghettin — toppa med två tummar riven laktosfri ost"],
        veta: "Glutenfri pasta blir lätt överkokt — ta den 1 min tidigare än paketet säger. Osten på toppen: två tummar räcker gott.",
      },
      {
        name: "Kycklingspett & tzatziki", desc: "Kycklingspett + ris + tzatziki på laktosfri yoghurt",
        protein: 40, carbs: 45, fat: 10, kcal100: 120,
        portion: "2 spett ≈ en handflata kyckling. Tzatziki: 2–3 msk.",
        recept: ["Trä kycklingbitar på spett — grilla eller stek", "Riv gurka och krama ur vätskan, blanda med laktosfri yoghurt och pressad vitlök", "Servera med ris"],
        veta: "Tzatziki på yoghurt är en av de smartaste såserna som finns — krämig och proteinrik istället för fet.",
      },
    ],
  },
  {
    cat: "Mellanmål", icon: "🍎",
    items: [
      {
        name: "Laktosfri kvarg + frukt", desc: "En burk naturell kvarg (250 g) + valfri frukt",
        protein: 25, carbs: 20, fat: 3, kcal100: 70,
        portion: "En burk kvarg (250 g) + 1 frukt.",
        recept: ["Häll upp kvargen och skiva frukten över"],
        veta: "Kvargen gör att frukten mättar mycket längre än om du äter den ensam — proteinet bromsar blodsockret.",
        kop: "Naturell kvarg är valet — smaksatt kan ha lika mycket socker som läsk per burk. Söta hellre själv med frukten.",
      },
      {
        name: "2–3 kokta ägg", desc: "Koka i förväg — snabbast av allt",
        protein: 18, carbs: 1, fat: 14, kcal100: 155,
        portion: "2–3 ägg räcker gott som mellanmål.",
        recept: ["Koka 8 min", "Förvara skalade i en burk i kylen — de håller flera dagar"],
        veta: "Naturens egen proteinbar. Kolesterolet i ägg är inget problem för de flesta — ett par ägg om dagen är helt okej.",
      },
      {
        name: "Proteinshake + banan", desc: "Laktosfritt eller veganskt pulver",
        protein: 28, carbs: 30, fat: 3, kcal100: 90,
        portion: "1 skopa pulver (ca 30 g) + 1 banan.",
        recept: ["Skaka pulvret med vatten eller laktosfri mjölk", "Ät bananen till"],
        veta: "Snabbt och funkar — men mat man tuggar mättar mer. Se shaken som en reserv, inte en vana.",
        kop: "Ett bra pulver: minst 70 g protein per 100 g (står på näringstabellen), kort ingredienslista där proteinet står först, och under 3 g socker per portion. Ett dåligt: nere på 50–60 g protein och maltodextrin eller socker högt upp i listan — maltodextrin är i praktiken billigt socker som fyller ut. Laktosfritt: välj vassleisolat (nästan laktosfritt av naturen) eller veganskt av ärt/soja — vanligt vasslekoncentrat innehåller laktos.",
      },
      {
        name: "Nävfull nötter + ett äpple", desc: "En kupad handflata nötter (ca 30 g) + 1 äpple",
        protein: 6, carbs: 20, fat: 18, kcal100: 250,
        portion: "En kupad handflata nötter (≈ 30 g) — inte mer. Nötter är nyttiga men bland det mest energitäta som finns.",
        recept: ["Häll upp din näve i handen och lägg undan påsen", "Äpplet fyller ut"],
        veta: "Direkt ur påsen blir det lätt 3–4 nävar utan att man märker det. Mät i handen — det är hela tricket.",
      },
      {
        name: "Proteinbar (GF)", desc: "Kolla att den är märkt glutenfri",
        protein: 20, carbs: 20, fat: 8, kcal100: 350,
        portion: "1 bar. Välj en med minst 15–20 g protein.",
        recept: ["Ha en i väskan för nödlägen"],
        veta: "Bra reserv — men många barer är i praktiken godis med extra protein. Därför är baksidan viktigare än framsidan.",
        kop: "Vänd på baren: minst 15–20 g protein, under 5 g socker och GF-märkning. Framsidan säljer — baksidan berättar sanningen.",
      },
      {
        name: "Laktosfri skyr på burk", desc: "Perfekt att ha med sig",
        protein: 17, carbs: 7, fat: 0, kcal100: 60,
        portion: "1 burk (150–200 g).",
        recept: ["Öppna och ät — färdigt"],
        veta: "Ett av de bästa köpta mellanmålen som finns: mycket protein, nästan inget socker eller fett.",
        kop: "Välj naturell — smaksatt skyr har ofta 2–3 teskedar socker per burk. Naturell + egna bär ger samma smak utan sockret.",
      },
      {
        name: "Riskakor + jordnötssmör", desc: "2–3 riskakor med ett tunt lager",
        protein: 10, carbs: 25, fat: 14, kcal100: 400,
        portion: "2–3 riskakor med ca 1 tsk jordnötssmör per kaka — en tumme totalt.",
        recept: ["Bred tunt — jordnötssmör är gott men väldigt energitätt"],
        veta: "Jordnötssmörets fett är av det nyttiga slaget, men 1 msk = ca 90 kcal. Det tunna lagret är skillnaden mellan mellanmål och efterrätt.",
        kop: "Jordnötssmör: ingredienslistan ska säga 100 % jordnötter — många märken tillsätter socker och palmolja.",
      },
      {
        name: "Beef jerky / torkat kött", desc: "Lätt att ha i väskan",
        protein: 15, carbs: 3, fat: 2, kcal100: 250,
        portion: "En liten påse (30–50 g).",
        recept: ["Ha i väskan — tål värme och stötar"],
        veta: "Mycket protein och lite av allt annat. Det är dock salt — drick gärna vatten till.",
        kop: "Kolla sockret — många jerky-sorter är marinerade i socker. Under 5 g per 100 g är ett bra val.",
      },
      {
        name: "Edamamebönor", desc: "Frysta — ånga och salta",
        protein: 12, carbs: 8, fat: 5, kcal100: 120,
        portion: "En skål på ca 2 dl skalade bönor.",
        recept: ["Ånga eller koka frysta edamame 4–5 min", "Salta lätt"],
        veta: "Gröna sojabönor — komplett växtprotein som är kul att äta. Bra val när du vill småäta något framför tv:n.",
      },
      {
        name: "Keso + ananas", desc: "Laktosfri keso",
        protein: 15, carbs: 15, fat: 2, kcal100: 80,
        portion: "En halv burk keso (≈ 125 g) + några ananasbitar.",
        recept: ["Blanda och ät"],
        veta: "Sött och proteinrikt utan tillsatt socker — ananasens egen sötma räcker gott.",
        kop: "Konserverad ananas: välj \"i egen juice\", inte i sockerlag.",
      },
      {
        name: "Tonfisk på riskakor", desc: "1 liten burk tonfisk + 2 riskakor",
        protein: 20, carbs: 15, fat: 2, kcal100: 150,
        portion: "1 liten burk tonfisk + 2 riskakor.",
        recept: ["Häll av tonfisken och fördela på riskakorna", "Lite svartpeppar på toppen"],
        veta: "Ett av de proteintätaste mellanmålen som finns — runt 20 g protein för bara ca 150 kcal.",
      },
      {
        name: "Färdiga kycklingbitar", desc: "Grillbitar från kyldisken",
        protein: 20, carbs: 1, fat: 3, kcal100: 110,
        portion: "En handflata bitar (ca 100 g).",
        recept: ["Köp grillbitar i kyldisken — ät direkt"],
        veta: "Snabbmatens motsats, fast lika snabb — rent protein helt utan tillagning.",
      },
      {
        name: "Proteinpudding (laktosfri)", desc: "Färdig från kyldisken",
        protein: 20, carbs: 10, fat: 3, kcal100: 80,
        portion: "1 förpackning.",
        recept: ["Kyldisken → skeden → klart"],
        veta: "Smakar dessert men ger protein. Kolla bara att den är laktosfri — de flesta proteinpuddingar är det.",
        kop: "Kolla baksidan: runt 20 g protein och under 5 g socker per förpackning är ett bra val.",
      },
      {
        name: "Bärsmoothie", desc: "Frysta bär + laktosfri yoghurt + 1 tsk honung",
        protein: 12, carbs: 30, fat: 2, kcal100: 70,
        portion: "2 dl bär + 2 dl yoghurt. Honung: 1 tsk räcker — bären är söta nog.",
        recept: ["Mixa frysta bär med laktosfri yoghurt", "Smaka innan du tillsätter honungen — ofta behövs den inte alls"],
        veta: "Frysta bär är lika nyttiga som färska och mycket billigare. Honung är socker — 1 tsk är lagom, och ofta räcker bärens egen sötma.",
        kop: "Yoghurt: naturell. Frysta bär: kolla att påsen bara innehåller bär — inga sockrade blandningar.",
      },
      {
        name: "Banan + mandlar", desc: "Snabb energi före passet",
        protein: 8, carbs: 30, fat: 14, kcal100: 200,
        portion: "1 banan + en kupad handflata mandlar (ca 20 st).",
        recept: ["Ät 30–60 min före träningen"],
        veta: "Bananen ger snabb energi till passet — mandlarna gör att den räcker längre.",
        kop: "Mandlar: naturella — inte rostade och saltade, och absolut inte honungsrostade (det är godis).",
      },
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
  const [handOpen, setHandOpen] = useState(false); // handmåttsguiden ut-/infälld
  const [mealInfo, setMealInfo] = useState(null); // { meal, cat, key } — öppen pop-up

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
      age: parseInt(form.age),
      weight: parseFloat(form.weight),
      height: parseInt(form.height),
      activity: form.activity || "medel",
      goal: form.goal,
    };
    setProfile(p);
    setEditProfile(false);
    try { await window.storage.set("kostdagbok-profil", JSON.stringify(p)); } catch (e) {}
  };
  // Rensning av sifferfält: bara siffror, begränsat antal
  const cleanInt = (v, max) => v.replace(/[^0-9]/g, "").slice(0, max);
  const cleanWeight = (v) => {
    v = v.replace(/[^0-9.,]/g, "").replace(/,/g, ".");
    const parts = v.split(".");
    let out = parts[0].slice(0, 3);
    if (parts.length > 1) out += "." + parts.slice(1).join("").slice(0, 1);
    return out;
  };
  const ageVal = parseInt(form.age), weightVal = parseFloat(form.weight), heightVal = parseInt(form.height);
  const ageOk = ageVal >= 15 && ageVal <= 100;
  const weightOk = weightVal >= 35 && weightVal <= 250;
  const heightOk = heightVal >= 120 && heightVal <= 230;
  const formOk = form.sex && form.goal && ageOk && weightOk && heightOk;
  const openProfileEditor = () => {
    if (profile) setForm({ sex: profile.sex, age: String(profile.age), weight: String(profile.weight), height: String(profile.height), activity: profile.activity, goal: profile.goal });
    setEditProfile(true);
  };

  // ---------- SÄKERHETSKOPIA ----------
  const exportData = () => {
    const payload = { app: "kostdagbok", version: 2, exported: new Date().toISOString(), profile, kostHist };
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
    modalSection: { fontFamily: DISPLAY, fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", margin: "16px 0 6px" },
  };

  // ---------- POP-UP: MÅLTIDSINFO ----------
  const renderMealModal = () => {
    if (!mealInfo) return null;
    const { meal, cat, key } = mealInfo;
    const added = justAdded === key;
    return (
      <div
        onClick={() => setMealInfo(null)}
        style={{
          position: "fixed", inset: 0, background: "rgba(23,27,33,0.55)", zIndex: 100,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: C.paper, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 560,
            maxHeight: "88vh", overflowY: "auto", padding: "18px 18px 22px", boxSizing: "border-box",
            animation: "slideUp 0.25s ease",
          }}
        >
          {/* Rubrik + stäng */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9A5A08" }}>{cat}</div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 21, textTransform: "uppercase", lineHeight: 1.1, marginTop: 3 }}>{meal.name}</div>
            </div>
            <button onClick={() => setMealInfo(null)} style={{ background: C.bone, border: `1px solid ${C.line}`, borderRadius: 10, width: 34, height: 34, fontSize: 16, cursor: "pointer", color: C.gray, flexShrink: 0 }}>✕</button>
          </div>

          {/* Makro-chips */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
            <span style={S.macro("#FDEEDC", "#9A5A08")}>P {meal.protein} g</span>
            <span style={S.macro("#E3EDF3", C.pull)}>K {meal.carbs} g</span>
            <span style={S.macro("#EFE7F3", "#6B4E85")}>F {meal.fat} g</span>
            <span style={S.macro("#EAEFE6", C.legs)}>{meal.kcal100} kcal/100 g</span>
          </div>

          {/* Lagom portion */}
          <div style={{ ...S.modalSection, color: "#9A5A08" }}>🍽️ Lagom portion</div>
          <div style={{ background: C.amberSoft, border: `1px solid #F0D9BC`, borderRadius: 12, padding: "11px 13px", fontSize: 13.5, lineHeight: 1.55 }}>
            {meal.portion}
          </div>

          {/* Recept */}
          <div style={{ ...S.modalSection, color: C.ink }}>📝 Så gör du</div>
          <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12, padding: "4px 13px" }}>
            {meal.recept.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", fontSize: 13.5, lineHeight: 1.5, borderBottom: i < meal.recept.length - 1 ? `1px dashed ${C.line}` : "none" }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 13, color: C.amber, flexShrink: 0, width: 16 }}>{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          {/* Bra att veta */}
          <div style={{ ...S.modalSection, color: C.pull }}>💡 Bra att veta</div>
          <div style={{ background: "#E3EDF3", border: `1px solid #C9DBE6`, borderRadius: 12, padding: "11px 13px", fontSize: 13.5, lineHeight: 1.55 }}>
            {meal.veta}
          </div>

          {/* Välj rätt i butiken */}
          {meal.kop && (
            <div>
              <div style={{ ...S.modalSection, color: C.legs }}>🛒 Välj rätt i butiken</div>
              <div style={{ background: "#EAEFE6", border: `1px solid #D3DECB`, borderRadius: 12, padding: "11px 13px", fontSize: 13.5, lineHeight: 1.55 }}>
                {meal.kop}
              </div>
            </div>
          )}

          {/* Logga-knapp */}
          <button
            onClick={() => { logMeal(cat, meal, key); setTimeout(() => setMealInfo(null), 500); }}
            style={{
              width: "100%", padding: "14px 0", marginTop: 18, borderRadius: 14, border: "none",
              background: added ? C.safe : C.amber, color: added ? "#fff" : C.ink,
              fontFamily: DISPLAY, fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.05em",
              cursor: "pointer", transition: "background 0.2s",
            }}
          >
            {added ? "✓ Loggad!" : "+ Logga den här måltiden"}
          </button>
        </div>
      </div>
    );
  };

  // ---------- VY: IDAG ----------
  const renderIdag = () => {
    const pct = Math.min(100, Math.round((todayProtein / proteinGoal) * 100));
    return (
      <div style={{ padding: "18px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 20, textTransform: "uppercase", textTransform: "capitalize" }}>{todayStr()}</div>
          <button onClick={openProfileEditor} style={{ background: "none", border: `1px solid ${C.line}`, borderRadius: 10, padding: "7px 11px", fontFamily: DISPLAY, fontWeight: 800, fontSize: 12, color: C.gray, cursor: "pointer" }}>
            ⚙️ Profil
          </button>
        </div>
        <div style={{ fontSize: 13, color: C.gray, margin: "6px 0 14px" }}>Glutenfritt · Laktosfritt · Tryck på en måltid för recept & portionsguide, + för att logga</div>

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
                <div key={k} style={{ flex: 1, textAlign: "center", padding: "7px 2px", borderRadius: 10, background: profile.goal === k ? "#E5F0EA" : C.bone, border: profile.goal === k ? `2px solid ${C.safe}` : `1px solid ${C.line}` }}>
                  <div style={{ color: C.gray }}>{l}</div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 13, color: profile.goal === k ? "#245F47" : C.ink }}>{v}</div>
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

        {/* HANDMÅTTSGUIDEN */}
        <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderLeft: `6px solid ${C.pull}`, borderRadius: 14, marginBottom: 12, overflow: "hidden" }}>
          <button
            onClick={() => setHandOpen(!handOpen)}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "13px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 14, textTransform: "uppercase", color: C.pull }}>
              🖐️ Mät med handen — ingen våg behövs
            </span>
            <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 16, color: C.gray }}>{handOpen ? "▾" : "▸"}</span>
          </button>
          {handOpen && (
            <div style={{ padding: "0 14px 13px" }}>
              {HAND_GUIDE.map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 0", borderBottom: i < HAND_GUIDE.length - 1 ? `1px dashed ${C.line}` : "none" }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{h.icon}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, display: "block" }}>{h.what} = {h.food}</span>
                    <span style={{ fontSize: 12.5, color: C.gray }}>{h.amount}</span>
                  </span>
                </div>
              ))}
              <div style={{ fontSize: 12.5, color: C.gray, marginTop: 10, lineHeight: 1.5, background: C.bone, borderRadius: 10, padding: "9px 11px" }}>
                Alla är olika stora — en större kropp har större händer och behöver större portioner. Det är just därför handmåttet funkar så bra: din hand är alltid rätt storlek för dig.
              </div>
            </div>
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
                        <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setMealInfo({ meal: m, cat: section.cat, key })}>
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
                            <span style={S.macro("#EDEAE2", C.gray)}>📖 Recept & portion</span>
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
      border: active ? `2px solid ${C.safe}` : `2px solid ${C.line}`,
      background: active ? "#E5F0EA" : "#fff", color: active ? "#245F47" : C.ink,
      fontFamily: DISPLAY, fontWeight: 800, fontSize: 13, textTransform: "uppercase",
    });
    const numInput = (bad) => ({
      width: "100%", padding: "12px 10px", borderRadius: 12, border: `2px solid ${bad ? "#C2472F" : C.line}`,
      fontFamily: DISPLAY, fontWeight: 800, fontSize: 18, textAlign: "center", background: bad ? "#FBEFEC" : "#fff",
      color: bad ? "#C2472F" : C.ink, boxSizing: "border-box",
    });
    const fieldError = { fontSize: 11, color: "#C2472F", fontWeight: 700, marginTop: 4, textAlign: "center" };
    const ageBad = form.age !== "" && !ageOk;
    const weightBad = form.weight !== "" && !weightOk;
    const heightBad = form.height !== "" && !heightOk;
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
            <input style={numInput(ageBad)} type="text" inputMode="numeric" maxLength={3} placeholder="35" value={form.age} onChange={(e) => setForm({ ...form, age: cleanInt(e.target.value, 3) })} />
            {ageBad && <div style={fieldError}>15–100 år</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={label}>Vikt (kg)</div>
            <input style={numInput(weightBad)} type="text" inputMode="decimal" maxLength={5} placeholder="80" value={form.weight} onChange={(e) => setForm({ ...form, weight: cleanWeight(e.target.value) })} />
            {weightBad && <div style={fieldError}>35–250 kg</div>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={label}>Längd (cm)</div>
            <input style={numInput(heightBad)} type="text" inputMode="numeric" maxLength={3} placeholder="178" value={form.height} onChange={(e) => setForm({ ...form, height: cleanInt(e.target.value, 3) })} />
            {heightBad && <div style={fieldError}>120–230 cm</div>}
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
                border: form.goal === g.key ? `2px solid ${C.safe}` : `2px solid ${C.line}`,
                background: form.goal === g.key ? "#E5F0EA" : "#fff",
              }}
            >
              <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 15, textTransform: "uppercase", color: form.goal === g.key ? "#245F47" : C.ink }}>{g.icon} {g.title}</div>
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0.5; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
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

      {renderMealModal()}
    </div>
  );
}
