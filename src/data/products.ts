import { Product, PriceTier } from '../lib/types'

const NO_PRICE: PriceTier = { unitPrice: null, acrePrice: null, byRequest: false }

/** Bare-bones product entry used in the hardcoded fallback list. Pricing is left empty. */
type FallbackEntry = Pick<Product, 'id' | 'name' | 'category' | 'unit' | 'description'>

function withEmptyPricing(entry: FallbackEntry): Product {
  return { ...entry, shareholder: NO_PRICE, retail: NO_PRICE, acresPerUnit: null }
}

export const fallbackProducts: Product[] = ([
  // ── Glyphosate ──
  { id: 'gly-01', name: 'Roundup WeatherMAX', category: 'Glyphosate', unit: 'L', description: '540 g/L glyphosate potassium salt' },
  { id: 'gly-02', name: 'Credit Xtreme', category: 'Glyphosate', unit: 'L', description: '540 g/L glyphosate potassium salt' },
  { id: 'gly-03', name: 'Factor 540', category: 'Glyphosate', unit: 'L', description: '540 g/L glyphosate' },
  { id: 'gly-04', name: 'RT 540', category: 'Glyphosate', unit: 'L', description: '540 g/L glyphosate IPA salt' },
  { id: 'gly-05', name: 'Maverick 540', category: 'Glyphosate', unit: 'L', description: '540 g/L glyphosate' },
  { id: 'gly-06', name: 'Glyphosate 360', category: 'Glyphosate', unit: 'L', description: '360 g/L glyphosate IPA salt' },
  { id: 'gly-07', name: 'Touchdown Total', category: 'Glyphosate', unit: 'L', description: '500 g/L glyphosate trimesium salt' },

  // ── Pre-Emerge Herbicides ──
  { id: 'pre-01', name: 'Prowl H2O', category: 'Pre-Emerge Herbicides', unit: 'L', description: 'Pendimethalin 455 g/L micro-encapsulated' },
  { id: 'pre-02', name: 'Edge Granular', category: 'Pre-Emerge Herbicides', unit: 'kg', description: 'Ethalfluralin 5% granular' },
  { id: 'pre-03', name: 'Treflan EC', category: 'Pre-Emerge Herbicides', unit: 'L', description: 'Trifluralin 480 g/L EC' },
  { id: 'pre-04', name: 'Authority Supreme', category: 'Pre-Emerge Herbicides', unit: 'L', description: 'Sulfentrazone + pyroxasulfone' },
  { id: 'pre-05', name: 'Fierce', category: 'Pre-Emerge Herbicides', unit: 'kg', description: 'Flumioxazin + pyroxasulfone WDG' },
  { id: 'pre-06', name: 'Valtera EZ', category: 'Pre-Emerge Herbicides', unit: 'L', description: 'Flumioxazin 480 g/L' },
  { id: 'pre-07', name: 'Focus', category: 'Pre-Emerge Herbicides', unit: 'L', description: 'S-metolachlor 963 g/L' },
  { id: 'pre-08', name: 'Heat LQ (Pre)', category: 'Pre-Emerge Herbicides', unit: 'L', description: 'Saflufenacil 342 g/L pre-emerge use' },

  // ── Seed Treatment ──
  { id: 'sdt-01', name: 'CruiserMaxx Cereals', category: 'Seed Treatment', unit: 'L', description: 'Thiamethoxam + difenoconazole + metalaxyl-M + fludioxonil' },
  { id: 'sdt-02', name: 'CruiserMaxx Vibrance', category: 'Seed Treatment', unit: 'L', description: 'Thiamethoxam + sedaxane + difenoconazole + metalaxyl-M + fludioxonil' },
  { id: 'sdt-03', name: 'Raxil PRO', category: 'Seed Treatment', unit: 'L', description: 'Tebuconazole + prothioconazole + metalaxyl' },
  { id: 'sdt-04', name: 'EverGol Energy', category: 'Seed Treatment', unit: 'L', description: 'Penflufen + prothioconazole + metalaxyl' },
  { id: 'sdt-05', name: 'Prosper EverGol', category: 'Seed Treatment', unit: 'L', description: 'Clothianidin + penflufen + prothioconazole + metalaxyl' },
  { id: 'sdt-06', name: 'Insure Cereal FX4', category: 'Seed Treatment', unit: 'L', description: 'Clothianidin + carbathiin + trifloxystrobin + metalaxyl' },
  { id: 'sdt-07', name: 'Vitaflo 280', category: 'Seed Treatment', unit: 'L', description: 'Carbathiin + thiram' },
  { id: 'sdt-08', name: 'Helix Vibrance', category: 'Seed Treatment', unit: 'L', description: 'Thiamethoxam + difenoconazole + sedaxane + fludioxonil + metalaxyl-M' },

  // ── In-Crop Herbicides - Cereals ──
  { id: 'cer-01', name: 'Axial BIA', category: 'In-Crop Herbicides - Cereals', unit: 'L', description: 'Pinoxaden 50 g/L for wild oat & green foxtail' },
  { id: 'cer-02', name: 'Horizon NG', category: 'In-Crop Herbicides - Cereals', unit: 'L', description: 'Clodinafop-propargyl 240 g/L' },
  { id: 'cer-03', name: 'Puma Advance', category: 'In-Crop Herbicides - Cereals', unit: 'L', description: 'Fenoxaprop-p-ethyl 120 g/L' },
  { id: 'cer-04', name: 'Infinity FX', category: 'In-Crop Herbicides - Cereals', unit: 'L', description: 'Pyrasulfotole + bromoxynil' },
  { id: 'cer-05', name: 'Buctril M', category: 'In-Crop Herbicides - Cereals', unit: 'L', description: 'Bromoxynil + MCPA ester' },
  { id: 'cer-06', name: 'Curtail M', category: 'In-Crop Herbicides - Cereals', unit: 'L', description: 'Clopyralid + MCPA amine' },
  { id: 'cer-07', name: 'Prestige XC', category: 'In-Crop Herbicides - Cereals', unit: 'L', description: 'Bromoxynil + pyrasulfotole' },
  { id: 'cer-08', name: 'Trophy', category: 'In-Crop Herbicides - Cereals', unit: 'L', description: 'Tralkoxydim 400 g/L' },
  { id: 'cer-09', name: 'Pixxaro', category: 'In-Crop Herbicides - Cereals', unit: 'L', description: 'Arylex active + fluroxypyr' },
  { id: 'cer-10', name: 'Lontrel 360', category: 'In-Crop Herbicides - Cereals', unit: 'L', description: 'Clopyralid 360 g/L' },

  // ── In-Crop Herbicides - Canola ──
  { id: 'can-01', name: 'Liberty 200 SN', category: 'In-Crop Herbicides - Canola', unit: 'L', description: 'Glufosinate ammonium 200 g/L for LL canola' },
  { id: 'can-02', name: 'Centurion', category: 'In-Crop Herbicides - Canola', unit: 'L', description: 'Clethodim 240 g/L' },
  { id: 'can-03', name: 'Select', category: 'In-Crop Herbicides - Canola', unit: 'L', description: 'Clethodim 240 g/L' },
  { id: 'can-04', name: 'Assure II', category: 'In-Crop Herbicides - Canola', unit: 'L', description: 'Quizalofop-p-ethyl 96 g/L' },
  { id: 'can-05', name: 'Lontrel 360 (Canola)', category: 'In-Crop Herbicides - Canola', unit: 'L', description: 'Clopyralid 360 g/L for Clearfield canola' },
  { id: 'can-06', name: 'Muster', category: 'In-Crop Herbicides - Canola', unit: 'g', description: 'Ethametsulfuron 75% WDG' },
  { id: 'can-07', name: 'Odyssey DLX (Canola)', category: 'In-Crop Herbicides - Canola', unit: 'L', description: 'Imazamox + imazethapyr for Clearfield canola' },
  { id: 'can-08', name: 'Poast Ultra', category: 'In-Crop Herbicides - Canola', unit: 'L', description: 'Sethoxydim 450 g/L' },

  // ── In-Crop Herbicides - Pulses ──
  { id: 'pul-01', name: 'Basagran Forte', category: 'In-Crop Herbicides - Pulses', unit: 'L', description: 'Bentazon 600 g/L for lentil, pea, bean' },
  { id: 'pul-02', name: 'Sencor 480 SC', category: 'In-Crop Herbicides - Pulses', unit: 'L', description: 'Metribuzin 480 g/L' },
  { id: 'pul-03', name: 'Pursuit', category: 'In-Crop Herbicides - Pulses', unit: 'L', description: 'Imazethapyr 240 g/L' },
  { id: 'pul-04', name: 'Solo', category: 'In-Crop Herbicides - Pulses', unit: 'L', description: 'Imazamox 40 g/L' },
  { id: 'pul-05', name: 'Viper ADV', category: 'In-Crop Herbicides - Pulses', unit: 'L', description: 'Imazamox + bentazon for chickpea, lentil' },
  { id: 'pul-06', name: 'Odyssey DLX', category: 'In-Crop Herbicides - Pulses', unit: 'L', description: 'Imazamox + imazethapyr for Clearfield lentil' },
  { id: 'pul-07', name: 'Arrow', category: 'In-Crop Herbicides - Pulses', unit: 'L', description: 'Clethodim 240 g/L' },
  { id: 'pul-08', name: 'MCPA Amine 600', category: 'In-Crop Herbicides - Pulses', unit: 'L', description: 'MCPA amine salt 600 g/L for pea' },

  // ── Fungicide ──
  { id: 'fun-01', name: 'Prosaro XTR', category: 'Fungicide', unit: 'L', description: 'Prothioconazole + tebuconazole for fusarium' },
  { id: 'fun-02', name: 'Tilt 250 EC', category: 'Fungicide', unit: 'L', description: 'Propiconazole 250 g/L' },
  { id: 'fun-03', name: 'Stratego PRO', category: 'Fungicide', unit: 'L', description: 'Trifloxystrobin + prothioconazole' },
  { id: 'fun-04', name: 'Priaxor', category: 'Fungicide', unit: 'L', description: 'Pyraclostrobin + fluxapyroxad' },
  { id: 'fun-05', name: 'Trivapro', category: 'Fungicide', unit: 'L', description: 'Azoxystrobin + propiconazole + benzovindiflupyr' },
  { id: 'fun-06', name: 'Headline AMP', category: 'Fungicide', unit: 'L', description: 'Pyraclostrobin 250 g/L' },
  { id: 'fun-07', name: 'Delaro Complete', category: 'Fungicide', unit: 'L', description: 'Prothioconazole + trifloxystrobin + fluopyram' },
  { id: 'fun-08', name: 'Miravis Ace', category: 'Fungicide', unit: 'L', description: 'Pydiflumetofen + propiconazole' },
  { id: 'fun-09', name: 'Cotegra', category: 'Fungicide', unit: 'L', description: 'Boscalid + metconazole for sclerotinia' },
  { id: 'fun-10', name: 'Lance WDG', category: 'Fungicide', unit: 'kg', description: 'Boscalid 70% WDG for sclerotinia' },

  // ── Desiccant ──
  { id: 'des-01', name: 'Reglone', category: 'Desiccant', unit: 'L', description: 'Diquat 240 g/L' },
  { id: 'des-02', name: 'Heat LQ', category: 'Desiccant', unit: 'L', description: 'Saflufenacil 342 g/L' },
  { id: 'des-03', name: 'Aim EC', category: 'Desiccant', unit: 'L', description: 'Carfentrazone-ethyl 240 g/L' },
  { id: 'des-04', name: 'Valtera (Desiccant)', category: 'Desiccant', unit: 'L', description: 'Flumioxazin 480 g/L desiccation use' },
  { id: 'des-05', name: 'CleanStart', category: 'Desiccant', unit: 'L', description: 'Glufosinate ammonium pre-harvest' },
  { id: 'des-06', name: 'Eragon LQ', category: 'Desiccant', unit: 'L', description: 'Saflufenacil + dimethenamid-P pre-harvest dry-down' },

  // ── Insecticide ──
  { id: 'ins-01', name: 'Silencer 120 EC', category: 'Insecticide', unit: 'L', description: 'Lambda-cyhalothrin 120 g/L' },
  { id: 'ins-02', name: 'Decis', category: 'Insecticide', unit: 'L', description: 'Deltamethrin 50 g/L' },
  { id: 'ins-03', name: 'Matador 120 EC', category: 'Insecticide', unit: 'L', description: 'Lambda-cyhalothrin 120 g/L' },
  { id: 'ins-04', name: 'Coragen', category: 'Insecticide', unit: 'L', description: 'Chlorantraniliprole 200 g/L' },
  { id: 'ins-05', name: 'Lagon 480 EC', category: 'Insecticide', unit: 'L', description: 'Dimethoate 480 g/L' },
  { id: 'ins-06', name: 'Concept', category: 'Insecticide', unit: 'L', description: 'Imidacloprid 240 g/L' },
  { id: 'ins-07', name: 'Closer', category: 'Insecticide', unit: 'L', description: 'Sulfoxaflor 240 g/L' },

  // ── Water Conditioner ──
  { id: 'wc-01', name: 'Ammonium Sulphate (liquid)', category: 'Water Conditioner', unit: 'L', description: 'AMS liquid water conditioner' },
  { id: 'wc-02', name: 'Ammonium Sulphate (dry)', category: 'Water Conditioner', unit: 'kg', description: 'AMS dry granular water conditioner' },
  { id: 'wc-03', name: 'LI 700', category: 'Water Conditioner', unit: 'L', description: 'Acidifier + surfactant + drift retardant' },
  { id: 'wc-04', name: 'Ag-Surf II', category: 'Water Conditioner', unit: 'L', description: 'Non-ionic surfactant 80%' },
  { id: 'wc-05', name: 'Merge', category: 'Water Conditioner', unit: 'L', description: 'Surfactant blend for wild oat herbicides' },
  { id: 'wc-06', name: 'Turbocharge', category: 'Water Conditioner', unit: 'L', description: 'Adjuvant/surfactant for Odyssey' },
  { id: 'wc-07', name: 'Gateway', category: 'Water Conditioner', unit: 'L', description: 'AMS replacement water conditioner' },
] as FallbackEntry[]).map(withEmptyPricing)
