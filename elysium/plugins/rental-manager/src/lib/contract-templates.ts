// Mietvertrag-Vorlagen für verschiedene Typen und Sprachen

export interface ContractTemplate {
  id: string;
  type: 'wohnung' | 'haus' | 'gewerbe';
  language: 'de' | 'en' | 'tr';
  name: string;
  sections: ContractSection[];
}

export interface ContractSection {
  title: string;
  content: string;
  order: number;
  required: boolean;
}

export const contractTemplates: ContractTemplate[] = [
  // Deutsche Wohnungsvorlage
  {
    id: 'wohnung-de-standard',
    type: 'wohnung',
    language: 'de',
    name: 'Standard Mietvertrag (Wohnung)',
    sections: [
      {
        title: '§1 Mietobjekt',
        content: `Der Vermieter vermietet an den Mieter die Wohnung in [ADRESSE] mit einer Wohnfläche von [QM] m². Die Wohnung besteht aus [ZIMMER] Zimmern, Küche, Bad und [WEITERE_RAEUME].`,
        order: 1,
        required: true,
      },
      {
        title: '§2 Mietbeginn und Dauer',
        content: `Das Mietverhältnis beginnt am [STARTDATUM] und läuft auf unbestimmte Zeit. Eine Befristung besteht nicht.`,
        order: 2,
        required: true,
      },
      {
        title: '§3 Miete und Nebenkosten',
        content: `Die monatliche Kaltmiete beträgt [KALTMETE] EUR. Zusätzlich sind Vorauszahlungen für Betriebskosten in Höhe von [NEBENKOSTEN] EUR zu leisten. Die Gesamtmiete (Warmmiete) beträgt somit [WARMMIETE] EUR.`,
        order: 3,
        required: true,
      },
      {
        title: '§4 Kaution',
        content: `Der Mieter leistet eine Mietkaution in Höhe von [KAUTION] EUR. Die Kaution ist in drei gleichen monatlichen Raten zu zahlen, beginnend mit dem ersten Mietmonat.`,
        order: 4,
        required: true,
      },
      {
        title: '§5 Betriebskosten',
        content: `Neben der Miete hat der Mieter die folgenden Betriebskosten zu tragen: Grundsteuer, Wasser, Abwasser, Müllgebühren, Straßenreinigung, Hausmeister, Gartenpflege, Beleuchtung, Schornsteinfeger, Sach- und Haftpflichtversicherung, Heizung und Warmwasser gemäß Verbrauch.`,
        order: 5,
        required: true,
      },
      {
        title: '§6 Instandhaltung und Reparaturen',
        content: `Der Mieter hat die Mietsache pfleglich zu behandeln. Schönheitsreparaturen sind vom Mieter gemäß der üblichen Fristen durchzuführen. Kleinreparaturen bis zu einem Betrag von 100 EUR sind vom Mieter zu tragen.`,
        order: 6,
        required: true,
      },
      {
        title: '§7 Kündigung',
        content: `Die Kündigungsfrist für den Mieter beträgt drei Monate zum Monatsende. Für den Vermieter gelten die gesetzlichen Fristen gemäß § 573c BGB.`,
        order: 7,
        required: true,
      },
      {
        title: '§8 Haushaltsangehörige und Untervermietung',
        content: `Der Mieter kann mit dem Vermieter vereinbaren, dass weitere Personen in die Wohnung aufgenommen werden. Eine Untervermietung bedarf der schriftlichen Zustimmung des Vermieters.`,
        order: 8,
        required: false,
      },
      {
        title: '§9 Haustiere',
        content: `Die Haltung von Kleintieren (z.B. Zierfische, Hamster) ist gestattet. Die Haltung von Hunden, Katzen oder anderen größeren Tieren bedarf der schriftlichen Zustimmung des Vermieters.`,
        order: 9,
        required: false,
      },
      {
        title: '§10 Rauchverbot',
        content: `Das Rauchen in der Wohnung ist [RAUCHEN_ERLAUBT ? gestattet : untersagt]. Bei Verstößen kann der Vermieter abmahnen und im Wiederholungsfall kündigen.`,
        order: 10,
        required: false,
      },
      {
        title: '§11 Besondere Vereinbarungen',
        content: `[BESONDERE_VEREINBARUNGEN]`,
        order: 11,
        required: false,
      },
      {
        title: '§12 Salvatorische Klausel',
        content: `Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so wird die Wirksamkeit der übrigen Bestimmungen hierdurch nicht berührt.`,
        order: 12,
        required: true,
      },
      {
        title: '§13 Datenschutzhinweis (DSGVO)',
        content: `Die Parteien stimmen zu, dass ihre personenbezogenen Daten zum Zwecke der Vertragsdurchführung, der Abrechnung und der Kommunikation gespeichert und verarbeitet werden. Die Daten werden vertraulich behandelt und nicht an Dritte weitergegeben, es sei denn, dies ist gesetzlich erforderlich oder zur Durchsetzung von Ansprüchen notwendig.`,
        order: 13,
        required: true,
      },
    ],
  },
  // Englische Wohnungsvorlage
  {
    id: 'wohnung-en-standard',
    type: 'wohnung',
    language: 'en',
    name: 'Standard Rental Agreement (Apartment)',
    sections: [
      {
        title: '§1 Rental Property',
        content: `The landlord rents to the tenant the apartment located at [ADDRESS] with a living area of [SQM] m². The apartment consists of [ROOMS] rooms, kitchen, bathroom, and [OTHER_ROOMS].`,
        order: 1,
        required: true,
      },
      {
        title: '§2 Lease Term',
        content: `The tenancy begins on [START_DATE] and runs for an indefinite period. There is no fixed term.`,
        order: 2,
        required: true,
      },
      {
        title: '§3 Rent and Utilities',
        content: `The monthly base rent is [COLD_RENT] EUR. In addition, advance payments for operating costs amounting to [UTILITIES] EUR are to be made. The total rent (warm rent) is therefore [WARM_RENT] EUR.`,
        order: 3,
        required: true,
      },
      {
        title: '§4 Security Deposit',
        content: `The tenant shall pay a security deposit of [DEPOSIT] EUR. The deposit is to be paid in three equal monthly installments, starting with the first month of rent.`,
        order: 4,
        required: true,
      },
      {
        title: '§5 Operating Costs',
        content: `In addition to the rent, the tenant shall bear the following operating costs: property tax, water, sewage, garbage collection, street cleaning, caretaker, garden maintenance, lighting, chimney sweep, property and liability insurance, heating and hot water according to consumption.`,
        order: 5,
        required: true,
      },
      {
        title: '§6 Maintenance and Repairs',
        content: `The tenant shall treat the rented property with care. Cosmetic repairs are to be carried out by the tenant according to usual periods. Minor repairs up to an amount of 100 EUR are to be borne by the tenant.`,
        order: 6,
        required: true,
      },
      {
        title: '§7 Termination',
        content: `The notice period for the tenant is three months to the end of the month. For the landlord, the statutory periods according to § 573c BGB apply.`,
        order: 7,
        required: true,
      },
      {
        title: '§8 GDPR Notice',
        content: `The parties agree that their personal data will be stored and processed for the purpose of contract execution, billing, and communication. The data will be treated confidentially and not passed on to third parties unless required by law or necessary to enforce claims.`,
        order: 8,
        required: true,
      },
    ],
  },
  // Türkische Wohnungsvorlage
  {
    id: 'wohnung-tr-standard',
    type: 'wohnung',
    language: 'tr',
    name: 'Standart Kira Sözleşmesi (Daire)',
    sections: [
      {
        title: '§1 Kiralık Mülk',
        content: `Ev sahibi, kiracıya [ADRES] adresinde bulunan, [QM] m² yaşam alanına sahip daireyi kiralar. Daire, [ZIMMER] oda, mutfak, banyo ve [DIGER_ODALAR] içerir.`,
        order: 1,
        required: true,
      },
      {
        title: '§2 Kira Süresi',
        content: `Kira ilişkisi [BASLANGIC_TARIHI] tarihinde başlar ve belirsiz süreyle devam eder. Belirli bir süre yoktur.`,
        order: 2,
        required: true,
      },
      {
        title: '§3 Kira ve Yardımcı Maliyetler',
        content: `Aylık net kira [KIRALMIKTE] EUR'dur. Buna ek olarak, [YARDIMCI_MALIYETLER] EUR tutarında işletme gideri avansı ödenmelidir. Toplam kira (sıcak kira) bu nedenle [SICAK_KIRA] EUR'dur.`,
        order: 3,
        required: true,
      },
      {
        title: '§4 Depozito',
        content: `Kiracı, [DEPOZITO] EUR tutarında kira depozitosu öder. Depozito, ilk kira ayından başlayarak üç eşit aylık taksitte ödenir.`,
        order: 4,
        required: true,
      },
      {
        title: '§5 İşletme Giderleri',
        content: `Kiraya ek olarak kiracı aşağıdaki işletme giderlerini üstlenir: Emlak vergisi, su, kanalizasyon, çöp toplama, sokak temizliği, kapıcı, bahçe bakımı, aydınlatma, baca temizleyici, mülk ve sorumluluk sigortası, tüketime göre ısıtma ve sıcak su.`,
        order: 5,
        required: true,
      },
      {
        title: '§6 Bakım ve Onarımlar',
        content: `Kiracı, kiralanan mülke özenle davranmalıdır. Kozmetik onarımlar, kiracı tarafından olağan sürelere göre yapılmalıdır. 100 EUR'ya kadar küçük onarımlar kiracı tarafından karşılanır.`,
        order: 6,
        required: true,
      },
      {
        title: '§7 Fesih',
        content: `Kiracı için fesih süresi, ay sonu için üç aydır. Ev sahibi için § 573c BGB'ye göre yasal süreler geçerlidir.`,
        order: 7,
        required: true,
      },
      {
        title: '§8 GDPR Bildirimi',
        content: `Taraflar, kişisel verilerinin sözleşmenin uygulanması, faturalandırma ve iletişim amacıyla saklanmasını ve işlenmesini kabul eder. Veriler gizli tutulur ve yasal olarak gerekli olmadıkça veya hakların uygulanması için gerekli olmadıkça üçüncü taraflara aktarılmaz.`,
        order: 8,
        required: true,
      },
    ],
  },
  // Haus (Haus auf Deutsch)
  {
    id: 'haus-de-standard',
    type: 'haus',
    language: 'de',
    name: 'Mietvertrag (Haus)',
    sections: [
      {
        title: '§1 Mietobjekt',
        content: `Der Vermieter vermietet an den Mieter das Einfamilienhaus in [ADRESSE] mit einer Wohnfläche von [QM] m². Das Haus besteht aus [ZIMMER] Zimmern, Küche, [BAEDER] Bädern, Keller, Dachboden und Garten.`,
        order: 1,
        required: true,
      },
      {
        title: '§2 Gartenpflege',
        content: `Der Mieter ist für die Pflege des Gartens verantwortlich. Dies umfasst Rasenmähen, Hecken schneiden, Unkraut entfernen und allgemeines Aufräumen. Die Kosten für Pflanzen und Gartengeräte trägt der Mieter.`,
        order: 2,
        required: true,
      },
      {
        title: '§3 Kehrwoche und Schneeräumung',
        content: `Der Mieter übernimmt die Kehrwoche und ist für die Schneeräumung und das Streuen im Winter verantwortlich. Dies gilt für den Gehweg vor dem Haus sowie für die Zufahrt.`,
        order: 3,
        required: true,
      },
      {
        title: '§4 Miete und Nebenkosten',
        content: `Die monatliche Kaltmiete beträgt [KALTMETE] EUR. Zusätzlich sind Vorauszahlungen für Betriebskosten in Höhe von [NEBENKOSTEN] EUR zu leisten.`,
        order: 4,
        required: true,
      },
      {
        title: '§5 Kaution',
        content: `Der Mieter leistet eine Mietkaution in Höhe von [KAUTION] EUR.`,
        order: 5,
        required: true,
      },
      {
        title: '§6 Kündigung',
        content: `Die Kündigungsfrist für den Mieter beträgt drei Monate zum Monatsende.`,
        order: 6,
        required: true,
      },
      {
        title: '§7 Datenschutzhinweis (DSGVO)',
        content: `Die Parteien stimmen zu, dass ihre personenbezogenen Daten zum Zwecke der Vertragsdurchführung gespeichert und verarbeitet werden.`,
        order: 7,
        required: true,
      },
    ],
  },
  // Gewerbe
  {
    id: 'gewerbe-de-standard',
    type: 'gewerbe',
    language: 'de',
    name: 'Mietvertrag (Gewerbe)',
    sections: [
      {
        title: '§1 Mietobjekt',
        content: `Der Vermieter vermietet an den Mieter die Gewerberäume in [ADRESSE] mit einer Fläche von [QM] m². Die Räume sind für [NUTZUNGSZWECK] vorgesehen.`,
        order: 1,
        required: true,
      },
      {
        title: '§2 Gewerbliche Nutzung',
        content: `Der Mieter darf die Räume ausschließlich für den oben genannten Zweck nutzen. Eine Änderung der Nutzung bedarf der schriftlichen Zustimmung des Vermieters.`,
        order: 2,
        required: true,
      },
      {
        title: '§3 Miete und Umsatzbeteiligung',
        content: `Die monatliche Miete beträgt [MIETE] EUR. Zusätzlich vereinbaren die Parteien eine Umsatzbeteiligung von [PROZENT]% des monatlichen Umsatzes, sofern dieser [SCHWELLE] EUR übersteigt.`,
        order: 3,
        required: true,
      },
      {
        title: '§4 Laufzeit',
        content: `Das Mietverhältnis beginnt am [STARTDATUM] und endet am [ENDDATUM]. Eine Verlängerung bedarf einer schriftlichen Vereinbarung.`,
        order: 4,
        required: true,
      },
      {
        title: '§5 Kaution',
        content: `Der Mieter leistet eine Mietkaution in Höhe von [KAUTION] EUR.`,
        order: 5,
        required: true,
      },
      {
        title: '§6 Gewährleistung',
        content: `Der Vermieter übernimmt keine Gewährleistung für die Eignung der Räume für den betrieblichen Zweck des Mieters.`,
        order: 6,
        required: true,
      },
      {
        title: '§7 Datenschutzhinweis (DSGVO)',
        content: `Die Parteien stimmen zu, dass ihre personenbezogenen Daten zum Zwecke der Vertragsdurchführung gespeichert und verarbeitet werden.`,
        order: 7,
        required: true,
      },
    ],
  },
];

export function getTemplate(
  type: 'wohnung' | 'haus' | 'gewerbe',
  language: 'de' | 'en' | 'tr' = 'de'
): ContractTemplate | undefined {
  return contractTemplates.find(
    (t) => t.type === type && t.language === language
  );
}

export function getAllTemplates(): ContractTemplate[] {
  return contractTemplates;
}
