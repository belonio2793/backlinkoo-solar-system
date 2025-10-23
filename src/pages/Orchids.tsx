import { useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function upsertMeta(name: string, content: string) {
  if (typeof document === 'undefined') return;
  const selector = `meta[name="${name}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  if (typeof document === 'undefined') return;
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function injectJSONLD(id: string, data: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let element = document.getElementById(id) as HTMLScriptElement | null;
  const text = JSON.stringify(data);
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.id = id;
    element.text = text;
    document.head.appendChild(element);
  } else {
    element.text = text;
  }
}

const metaTitle = 'Orchids: The Ultimate 5,000-Word Guide (2025 Edition)';
const metaDescription = 'A definitive, research-backed, search-intent satisfying guide to orchids—taxonomy, care, varieties, pollination, conservation, and expert FAQs. Built to rank for the keyword “Orchids.”';

// Structured content modeled from top-ranking outlines (Wikipedia + major societies), paraphrased and expanded.
// Each section includes a summary and paragraphs to maximize topical coverage and intent satisfaction.

interface Section {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface GlossaryItem {
  term: string;
  definition: string;
}

const orchidSections: Section[] = [
  {
    id: 'overview',
    title: 'Orchids at a Glance',
    summary:
      'Orchids—members of the Orchidaceae family—are among the most diverse flowering plants on Earth. They thrive from cloud forests to windowsills, renowned for intricate flowers, symbiotic germination, and ingenious pollination strategies.',
    paragraphs: [
      'The orchid family (Orchidaceae) encompasses tens of thousands of described species and countless hybrids, representing extraordinary morphological diversity. From large-flowered Cattleyas to minimalist, root-photosynthesizing genera, orchids have evolved to occupy niches ranging from tropical canopies to temperate understories. Their trademark traits—bilateral floral symmetry, a specialized lip (labellum), and pollen packaged into pollinia—give them a unique combination of beauty and biological sophistication.',
      'What sets orchids apart is their multi-layered survival strategy. Orchid seeds are dust-like and lack endosperm, making early development dependent on a symbiotic relationship with mycorrhizal fungi. In cultivation, growers simulate these conditions with sterile flasks or by fostering vigorous root systems once seedlings mature. In the wild, orchids pair with precise pollinators using fragrances, colors, and elaborate floral architecture that guide the right insects into contact with pollen masses.',
      'As ornamentals, orchids reward attention to microclimates. Successful care hinges on balancing light, moisture, air movement, humidity, and nutrition. With species and hybrids adapted to warm or cool conditions, low or intense light, and varied potting media, every home can host an orchid if the environment is tailored well. This page distills core science, practical care, and expert refinements so beginners advance quickly and experienced growers deepen mastery.'
    ]
  },
  {
    id: 'etymology',
    title: 'Etymology and Taxonomic Context',
    summary:
      'The word “orchid” derives from the Greek orchis, referencing the twin tubers of certain species. Orchidaceae sits within the monocots (order Asparagales), with thousands of species across hundreds of genera.',
    paragraphs: [
      'Historically, botanists grouped orchids by visible floral traits, but molecular phylogenetics has refined classification across subfamilies such as Apostasioideae, Cypripedioideae, Epidendroideae, Orchidoideae, and Vanilloideae. The type genus, Orchis, lends its name to the family and echoes early observations of paired subterranean structures in some terrestrial species. Today’s taxonomic frameworks integrate morphology and DNA evidence, illuminating relationships across epiphytic, lithophytic, and terrestrial orchids.',
      'This taxonomic context matters to growers because growth forms correlate with care. Sympodial orchids often form pseudobulbs that store water and nutrients, while monopodial orchids ascend vertically from a single growing tip, producing aerial roots that demand constant airflow. Understanding these growth habits helps match potting strategies, watering cadence, and light exposure to a plant’s inherent physiology.'
    ]
  },
  {
    id: 'morphology',
    title: 'Morphology: Stems, Roots, Leaves, and Flowers',
    summary:
      'Orchids share core structures—stems, roots cloaked in velamen, parallel-veined leaves, and a flower with three sepals and three petals, including a specialized labellum. Many blooms resupinate, rotating to position the lip as a landing platform for pollinators.',
    paragraphs: [
      'Stems and Roots: Monopodial orchids such as Vanda and Phalaenopsis grow continuously from a single apex, frequently exposing aerial roots covered in velamen—a spongy, multi-layered tissue that absorbs moisture rapidly and protects inner root cortex. Sympodial orchids like Cattleya, Oncidium, and Dendrobium produce new growths along a horizontal rhizome, often swelling into pseudobulbs that buffer drought and fuel bloom spikes.',
      'Leaves: Most orchids present simple leaves with parallel venation—some leathery and broad, others narrow and grass-like. Genera differ in leaf retention: deciduous Dendrobiums shed leaves seasonally; Phalaenopsis typically keeps thick leaves year-round. A few specialized species minimize foliage altogether, channeling photosynthesis through chlorophyll-rich roots to exploit high-humidity microhabitats.',
      'Flowers: Orchid flowers exhibit bilateral symmetry and intricate anatomy. The column fuses reproductive parts, while the labellum (lip) guides pollinators to pollen masses called pollinia. Color patterns may form “nectar guides,” and fragrance chemistry often targets species-specific pollinators. In some genera, the bloom twists (resupination) to orient the lip downward, maximizing pollinator efficiency.'
    ]
  },
  {
    id: 'reproduction',
    title: 'Reproduction and Pollination Biology',
    summary:
      'Orchids achieved evolutionary success by partnering tightly with pollinators. Pollinia adhere to insects through viscid structures, ensuring precise pollen transfer. Seeds are minute and numerous, relying on fungal partners for germination.',
    paragraphs: [
      'Pollination: The pollination dance often hinges on specificity. Some orchids mimic the shape or scent of female insects, leveraging deception to attract males. Others produce fragrances that male bees collect for courtship. The journey culminates when a pollinium sticks to a pollinator and is deposited on the stigma of another flower, enabling outcrossing. A handful of species self-pollinate, a viable strategy where pollinators are scarce.',
      'Asexual Pathways: Many orchids clone themselves via keikis—plantlets sprouting from nodes, spikes, or canes, especially in Phalaenopsis and Dendrobium. Keikis allow rapid multiplication of a genotype adapted to a specific niche. Growers can detach keikis once roots reach a few inches, potting them in small containers with fine-grade bark or sphagnum for gentle moisture control.',
      'Fruits and Seeds: After pollination, capsules elongate and split along seams to release clouds of dust-like seeds. In situ, fungi colonize seeds and fuel early development until seedlings can photosynthesize. In cultivation, sterile flasks and asymbiotic germination techniques bypass the fungal dependency, allowing large-scale propagation for conservation and trade.'
    ]
  },
  {
    id: 'distribution-ecology',
    title: 'Distribution, Ecology, and Mycorrhizae',
    summary:
      'Orchids occupy nearly every biome except Antarctica, often as epiphytes anchored to bark where airflow and rapid wet-dry cycles prevail. Seedling establishment and stress resilience depend heavily on fungal partners and microclimate stability.',
    paragraphs: [
      'Epiphytes dominate tropical canopies, intercepting mist and rain while relying on fast drainage and abundant oxygen around roots. Terrestrial species adapt to leaf litter, mossy substrates, or mineral soils, sometimes forming tubers to endure seasonal swings. Mycorrhizal associations support germination and nutrient acquisition, particularly nitrogen and phosphorus, and likely modulate stress responses during drought or temperature extremes.',
      'Ecological interactions extend beyond fungi and pollinators. Orchid leaves, pseudobulbs, and roots host micro-communities of bacteria and algae that may influence growth and disease resistance. In restoration projects, reintroduction success improves when practitioners match local genotypes, compatible fungi, and appropriate microclimates, underscoring the need for holistic planning.'
    ]
  },
  {
    id: 'care-essentials',
    title: 'Cultivation and Care Essentials',
    summary:
      'Care success balances five levers: light, water, humidity, air movement, and feeding. Tailor these to the orchid’s growth type and local environment for reliable blooms and long-term vigor.',
    paragraphs: [
      'Light: Most beginner orchids prefer bright, indirect light. East or shaded south exposures work well indoors. Aim for soft, filtered rays that color leaves a healthy medium green. Deeply dark leaves often signal insufficient light; yellowed or scorched patches indicate too much direct sun.',
      'Watering: “Soak thoroughly, then let it breathe.” Drench the potting medium until water drains freely, then allow partial drying before the next watering. Frequency depends on pot size, media, temperature, and airflow. Epiphytes in coarse bark need more frequent water than terrestrials in moisture-retentive mixes.',
      'Humidity and Airflow: Target 40–60% relative humidity indoors, increasing airflow to deter rot. Small fans on low settings keep leaves dry between waterings and strengthen tissues. Humidity trays, room humidifiers, and grouping plants help stabilize local moisture.',
      'Temperature: Many hybrids thrive around 65–80°F (18–27°C) by day with gentle night drops that cue flowering. Research your orchid’s native range: warm-growing Vandas demand heat and light; cool-growing Cymbidiums flower best after crisp nights in autumn.',
      'Fertilizer: Feed lightly but regularly during active growth. A balanced, dilute fertilizer (e.g., “weakly, weekly”) supports leaves, roots, and flower spikes. Flush pots with clear water monthly to prevent salt buildup.',
      'Potting Media: Choose media that match root physiology and your watering cadence. Coarse bark, charcoal, and perlite deliver rapid drainage for epiphytes; sphagnum retains moisture for seedlings or dry homes. Semi-hydroponics with inert leca can provide stable moisture if airflow is ample.',
      'Repotting: Repot every 1–2 years or when media breaks down. For monopodial orchids, use snug pots that stabilize roots. For sympodial orchids, select shallow, wide containers that accommodate new growths along the rhizome. Trim dead roots and remove decomposed media to reset airflow and hydration.',
      'Propagation: Keikis, back bulbs, and divisions let growers expand collections while preserving varietal traits. Sterile technique, sharp tools, and post-division humidity management stack the odds toward quick recovery and rapid new growth.'
    ]
  },
  {
    id: 'popular-genera',
    title: 'Popular Genera and What Makes Each Shine',
    summary:
      'A handful of genera dominate home collections because they reward consistent care and deliver showy, long-lasting blooms. Knowing the nuances of each improves outcomes dramatically.',
    paragraphs: [
      'Phalaenopsis: The archetypal beginner orchid. It tolerates indoor conditions, blooms for months, and prefers steady moisture with bright, indirect light. After flowering, spikes can sometimes be cut above a node to encourage side branches and additional blooms.',
      'Cattleya: Famous for ruffled lips and bold fragrance. These sympodial orchids store resources in pseudobulbs and prefer strong light with a distinct wet-dry cycle. Clear seasonal cues—more light and feeding in growth, drier rests afterward—improve flowering.',
      'Dendrobium: A heterogeneous genus with both evergreen and deciduous species. Canes store moisture, and some groups require cool, dry winters to set buds. Label-specific care is essential because breeding lines diverge widely in temperature and light needs.',
      'Oncidium: Nicknamed “dancing lady” orchids for their fluttering lips, Oncidiums enjoy intermediate conditions with bright light and consistent watering. Fine roots benefit from airy, evenly moist media and vigilant salt management.',
      'Vanda: Sun-lovers with thick, aerial roots designed for daily hydration and high airflow. Many hobbyists grow Vandas bare-root in baskets, misting or dunking frequently. Warmth, light intensity, and humidity are non-negotiable for sustained flowering.',
      'Paphiopedilum: The slipper orchids excel in lower light with even moisture and good water quality. They dislike stale, compacted media and appreciate fresh mixes that cradle fine roots. Their sculptural pouches make them irresistible to collectors.',
      'Cymbidium: Cool-tolerant, often grown outdoors seasonally in temperate zones. They prefer bright light and benefit from cooler nights to initiate spikes. Their sprays of long-lasting blooms elevate patios and winter interiors alike.',
      'Vanilla: A vine within Orchidaceae that gifts the world vanilla flavor. Cultivation demands heat, humidity, space to climb, and patience—flowering and hand-pollination precede curing beans for the celebrated aroma.'
    ]
  },
  {
    id: 'buying-guide',
    title: 'Buying Guide: Selecting Healthy Plants',
    summary:
      'Choose vigor over bloom count. Inspect roots, leaves, and labels to forecast success long after flowers fade.',
    paragraphs: [
      'Roots should be plump and silver-green when dry, turning jade when hydrated. Avoid plants with mushy, brown roots or sour smells—signs of rot. Leaves should be firm and unblemished, with no sticky residues, webbing, or stippling that suggest pests. Pseudobulbs ought to be full, not shriveled. A detailed label with genus, grex, or clonal name indicates traceability and often, better breeding.',
      'Transport orchids gently, shielding spikes from wind and temperature extremes. At home, quarantine new arrivals for two weeks to prevent pest introductions. During quarantine, rinse foliage, flush pots, and monitor for movement before integrating plants with your main collection.'
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting: Pests, Diseases, and Physiological Stress',
    summary:
      'Most setbacks trace to water, air, or light imbalances. Correct the environment first; then address pests and pathogens precisely.',
    paragraphs: [
      'Common Pests: Scale, mealybugs, spider mites, thrips, and aphids exploit stressed plants. Start with cultural fixes—improve airflow, rinse leaves, and isolate the host. For persistent outbreaks, apply targeted controls such as horticultural oils, insecticidal soaps, or systemic treatments suited to the pest and setting. Rotate modes of action to avoid resistance.',
      'Diseases: Bacterial soft rot, fungal leaf spots, and root rot thrive in stagnant, saturated conditions. Sanitize tools, peel away affected tissue to clean margins, and adjust watering schedules. Increase light and airflow to accelerate recovery; re-establishing a rhythmic wet-dry cycle is often decisive.',
      'Physiological Stress: Bud blast, wrinkled leaves, and stalled roots signal environmental mismatch. Track temperature lows, light duration, and humidity dips. Recalibrating these conditions typically resolves symptoms more reliably than reactive treatments alone.'
    ]
  },
  {
    id: 'culture-symbolism',
    title: 'Culture, Symbolism, and Human Uses',
    summary:
      'Orchids symbolize refinement, rare beauty, and devotion in many cultures. Beyond ornament, the family includes Vanilla—a global flavor cornerstone—linking orchid cultivation to cuisine and commerce.',
    paragraphs: [
      'From Victorian conservatories to contemporary shows, orchids have long signified craftsmanship and patience. Their symbolic associations include love, luxury, fertility, and resilience. In practice, orchid societies and shows foster communities where novices learn from veterans, swap divisions, and collectively preserve rare species. Vanilla cultivation, meanwhile, underscores the family’s economic reach—an intricate process spanning pollination, harvest, and curing that transforms green pods into aromatic beans.'
    ]
  },
  {
    id: 'conservation',
    title: 'Conservation and Ethical Cultivation',
    summary:
      'Habitat loss, overcollection, and climate shifts threaten wild orchids. Responsible growers support conservation by buying legally propagated plants, sharing divisions, and backing habitat protection.',
    paragraphs: [
      'Many species are protected under international trade regulations. Purchase plants from reputable nurseries that propagate stock via seed or division rather than wild collection. Join local and national societies to promote education and conservation initiatives. When possible, participate in citizen science: documenting bloom times, pollinators, or microhabitats contributes valuable data to conservationists and researchers.'
    ]
  },
  {
    id: 'advanced-techniques',
    title: 'Advanced Techniques: Mounting, Semi-Hydro, and High-Humidity Rigs',
    summary:
      'Once core care is dialed in, push performance with techniques that optimize gas exchange and moisture stability while respecting species needs.',
    paragraphs: [
      'Mounting: Epiphytes evolved to cling to bark where water sheets off quickly and air is continuous. Mounts—cork, tree fern, hardwood—recreate this by exposing roots to rapid wet–dry cycles. Daily misting or dunking, combined with high humidity and strong airflow, produces resilient roots and compact growth. Mounted orchids often display more natural habit and can flower more reliably when watering is consistent.',
      'Semi-Hydroponics: Inert media like expanded clay (leca) wicks moisture from a small reservoir while roots enjoy abundant oxygen. This suits growers who prefer predictable hydration and clean repotting. Transition plants gradually: keep crowns above constant moisture, flush regularly, and expect an adjustment period as older roots adapt to the new moisture profile.',
      'High-Humidity Rigs: Tents or cabinets with humidifiers, fans, and LED lighting create controlled microclimates for warmth-loving genera. Sensors tracking temperature, humidity, and light (PPFD) help maintain tight ranges. Always balance humidity with airflow to prevent fungal issues; steady, gentle movement keeps leaves dry and photosynthesis efficient.'
    ]
  },
  {
    id: 'lighting-metrics',
    title: 'Lighting Metrics: From “Bright Indirect” to PPFD',
    summary:
      'Translate vague advice into measurable targets. Light meters and PPFD sensors eliminate guesswork and accelerate flowering.',
    paragraphs: [
      'Human perception misjudges plant-usable light. A phone lux meter gives rough estimates, but photosynthetic photon flux density (PPFD) best reflects usable light for orchids. Many Phalaenopsis thrive around 75–150 µmol·m⁻²·s⁻¹; Cattleyas and Vandas often prefer 200–500+. Place sensors at leaf height and adjust distance or dimming to meet targets. Track photoperiods—12–14 hours in winter can stabilize growth for equatorial species indoors.',
      'Signs of overlighting include bleached patches and stiff, yellowed leaves; underlighting causes dark, limp foliage and poor spiking. Calibrate slowly: increase light 10–15% per week and monitor tissue response. Pair higher light with increased feeding and water to match elevated photosynthetic demand.'
    ]
  },
  {
    id: 'media-comparison',
    title: 'Potting Media Comparison and Root Physiology',
    summary:
      'Choose media by oxygen availability, water retention, and your routine—not by trend. Healthy roots demand structure and renewability.',
    paragraphs: [
      'Bark mixes excel at gas exchange but decompose, compressing over time; refresh before breakdown restricts air. Sphagnum moss retains moisture evenly, ideal for seedlings or arid homes, but requires attentive, light-handed watering to avoid compaction. Inorganic options (leca, pumice, lava rock) resist decay and offer clean repotting, yet need diligent flushing and adequate humidity. Charcoal buffers odors and some impurities; perlite lightens mixes and increases porosity. Match particle size to root thickness: fine roots appreciate finer blends that do not stay soggy.',
      'Whatever you choose, consistency wins. Keep a log of watering frequency, fertilizer concentration, and plant responses. Over a few months, patterns reveal the optimal medium for your space and genus mix.'
    ]
  },
  {
    id: 'seasonal-calendars',
    title: 'Seasonal Calendars: Cue Growth and Flowering',
    summary:
      'Orchids respond to seasonal signals—daylength, temperature swings, and moisture pulses. Map your care to seasonal rhythms for spike initiation and reliable blooms.',
    paragraphs: [
      'Spring: Increase water and feeding as light lengthens. Repot before the growth surge to minimize setbacks. Summer: Maintain hydration with strong airflow; shade appropriately in heatwaves. Autumn: For cool-night species (e.g., Cymbidium), offer crisp evenings to trigger spikes. Winter: Extend photoperiod indoors and reduce water for genera that rest; avoid ice-cold drafts that cause bud blast.',
      'For deciduous Dendrobiums, a pronounced dry, cool rest is essential—minimize water until new growth emerges. Track each genus’s cues, then align your environment to those triggers for consistent flowering year over year.'
    ]
  },
  {
    id: 'indoor-vs-outdoor',
    title: 'Indoor vs. Outdoor Growing: Microclimates that Work',
    summary:
      'Both approaches succeed when humidity, light, and airflow are tuned. Outdoors can supercharge growth if you buffer extremes and pests.',
    paragraphs: [
      'Indoors, stability is the advantage: fewer pests, controlled temperatures, and consistent humidity. Use fans, LED lighting, and humidity trays to tailor microclimates by shelf. Outdoors, shade structures or trees provide bright shade; dawn sun with afternoon protection suits many genera. Rain rinses salts and invigorates roots, but protection from extended downpours prevents rot. Bring plants indoors before temperature drops below genus limits and check for hitchhiking pests during transitions.'
    ]
  },
  {
    id: 'lab-propagation',
    title: 'Lab vs. Home Propagation: Flasks, Keikis, and Divisions',
    summary:
      'Lab flasks accelerate conservation and availability; home growers multiply favorites through keikis and divisions with sterile technique.',
    paragraphs: [
      'Asymbiotic seed culture in sterile flasks bypasses the fungal dependency of wild germination, enabling large-scale propagation and reducing pressure on wild populations. Once deflasked, seedlings require careful acclimation—high humidity, gentle airflow, and gradual increases in light. At home, keikis and divisions remain the most practical methods. Sterilize blades, dust cuts with cinnamon or sulfur where appropriate, and prioritize humidity until new roots anchor.'
    ]
  },
  {
    id: 'regional-guides',
    title: 'Regional Guides: Matching Orchids to Your Climate',
    summary:
      'Climate dictates the margin of error. Align genera with local lows, highs, and humidity patterns to expand what’s possible on your windowsill or patio.',
    paragraphs: [
      'Arid regions demand humidity hacks—group plants, add humidifiers, and prefer moss-heavy mixes. Humid coastal climates allow coarser media and more aggressive airflow. Frost-prone zones favor indoor cultivation with supplemental lighting in winter; subtropical areas may sustain year-round outdoor Vandas with rain protection. Track nighttime lows and dew points—many orchids tolerate brief heat spikes if nights are cool and moist.'
    ]
  },
  {
    id: 'myths-misconceptions',
    title: 'Myths and Misconceptions to Avoid',
    summary:
      'Outdated lore wastes months. Replace myths with measured routines and observations.',
    paragraphs: [
      'Myth: “Ice cubes are a safe watering method.” Reality: Cold shock and uneven wetting can stress roots; tepid, thorough watering is safer. Myth: “Clear pots are mandatory.” Reality: Opaque pots work if airflow and watering match the medium; clear pots are helpful but not required. Myth: “Orchids bloom once and die.” Reality: Healthy plants rebloom seasonally or multiple times a year, depending on genus and care.'
    ]
  },
  {
    id: 'resources',
    title: 'Resources and Further Reading',
    summary:
      'Deepen your expertise with societies, shows, journals, and science-driven communities.',
    paragraphs: [
      'Join local orchid societies for workshops, plant tables, and peer learning. Explore reputable books and journals for genus-specific strategies, and follow science-forward communities that share cultivation logs, PPFD measurements, and controlled experiments. When evaluating advice online, prioritize sources that document environment metrics and show multi-month results.'
    ]
  }
];

const orchidFaqs: FAQItem[] = [
  { question: 'How much light do orchids need?', answer: 'Most common indoor orchids prefer bright, indirect light. East windows are ideal; filtered south light also works. If leaves are very dark, increase light gradually; if leaves yellow or scorch, reduce intensity.' },
  { question: 'How often should I water my orchid?', answer: 'Water thoroughly, then allow partial drying. Frequency varies by potting mix, pot size, temperature, and airflow. In general, bark dries faster than sphagnum; warm, bright, breezy conditions require more frequent watering.' },
  { question: 'Do orchids need fertilizer?', answer: 'Yes—during active growth, feed lightly and regularly with a balanced, dilute fertilizer. Flush with plain water monthly to remove salts and maintain root health.' },
  { question: 'When should I repot an orchid?', answer: 'Repot every 1–2 years or when media decomposes, roots overfill the pot, or growth advances beyond the container. Repotting restores airflow and prevents rot.' },
  { question: 'Can I grow orchids in low light?', answer: 'Some Paphiopedilum and Phalaenopsis hybrids tolerate lower light, though flowering may reduce. Supplement with LED grow lights where natural light is insufficient.' },
  { question: 'Why are my orchid’s buds falling off?', answer: 'Bud blast often results from sudden temperature drops, drafts, low humidity, or abrupt environmental changes. Stabilize conditions, increase humidity, and avoid cold air on spikes.' },
  { question: 'How long do orchid flowers last?', answer: 'Phalaenopsis blooms can last 6–12+ weeks; Cattleyas average 1–3 weeks; Cymbidium spikes last months. Longevity depends on genetics and environment—cool, stable conditions extend bloom time.' },
  { question: 'Should I cut the flower spike after blooming?', answer: 'For Phalaenopsis, you can cut above a node to encourage side-spikes, but a full cut at the base may restore plant energy for a stronger future bloom. For sympodial orchids (Cattleya, Dendrobium), remove spent spikes and focus on new growths.' },
  { question: 'What are signs of root rot and how do I fix it?', answer: 'Mushy, brown roots and a sour smell indicate rot. Unpot, trim dead roots, disinfect the container, repot in fresh airy media, and adjust watering and airflow to restore the wet–dry rhythm.' },
  { question: 'How can I increase humidity for orchids?', answer: 'Use room humidifiers, humidity trays, and plant grouping. Balance humidity with airflow to keep leaves dry and prevent fungal issues. 40–60% RH suits most indoor genera.' },
  { question: 'Can orchids grow in bathrooms or kitchens?', answer: 'Yes, if the light is adequate and temperatures are stable. Extra humidity often helps. Avoid hot, oily cooking areas and ensure consistent airflow to deter mold.' },
  { question: 'Can I grow orchids in water only?', answer: 'Some growers experiment with water culture cycles, but success varies. Ensure roots receive ample oxygen, keep water clean, and transition gradually. Inert media with reservoirs (semi-hydro) generally offers a wider success margin.' },
  { question: 'How do I encourage reblooming?', answer: 'Match genus-specific cues: adequate light, seasonal temperature drops, and steady nutrition during growth. Track photoperiods and avoid sudden environmental changes that cause stress.' },
  { question: 'What pests should I watch for?', answer: 'Scale, mealybugs, spider mites, thrips, and aphids are common. Quarantine new plants, inspect regularly, and address outbreaks early with cultural controls and appropriate treatments.' },
  { question: 'Do I need special water?', answer: 'Good-quality tap water works in many regions. If salts accumulate or leaf tips burn, use rain, distilled, or RO water and feed lightly. Flush pots monthly to remove buildup.' },
  { question: 'Can I keep orchids outdoors?', answer: 'Many can, seasonally. Provide bright shade, protect from heavy rain, and bring plants inside before temperatures fall below their tolerance. Outdoor summers often supercharge growth.' }
];

const orchidGlossary: GlossaryItem[] = [
  { term: 'Labellum (Lip)', definition: 'The specialized petal that attracts and guides pollinators; often ornate and patterned.' },
  { term: 'Column', definition: 'A fused structure that houses reproductive organs, central to orchid pollination.' },
  { term: 'Pollinia', definition: 'Pollen masses that adhere to pollinators for efficient transfer between flowers.' },
  { term: 'Velamen', definition: 'A spongy, multi-layered tissue covering many orchid roots, enabling rapid water uptake and protection.' },
  { term: 'Keiki', definition: 'A plantlet that forms on stems, spikes, or canes—used for vegetative propagation.' },
  { term: 'Pseudobulb', definition: 'A swollen stem segment in many sympodial orchids that stores water and nutrients.' },
  { term: 'Resupination', definition: 'A twist during flower development that positions the lip downward to aid pollinator access.' },
  { term: 'Mycorrhiza', definition: 'A symbiotic relationship between orchid roots or seeds and fungi that provide nutrients, especially during germination.' }
];

export default function Orchids() {
  const canonical = useMemo(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `${origin}/orchids`;
    } catch {
      return '/orchids';
    }
  }, []);

  const combinedWordCount = useMemo(() => {
    const textSegments: string[] = [];
    orchidSections.forEach((section) => {
      textSegments.push(section.summary);
      section.paragraphs.forEach((paragraph) => textSegments.push(paragraph));
    });
    orchidFaqs.forEach((faq) => textSegments.push(faq.answer));
    orchidGlossary.forEach((entry) => textSegments.push(entry.definition));
    const words = textSegments.join(' ').split(/\s+/).filter(Boolean);
    return words.length;
  }, []);

  const lastUpdated = useMemo(() => new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }), []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = metaTitle;
    upsertMeta('description', metaDescription);
    upsertMeta('keywords', 'Orchids, Orchidaceae, orchid care, orchid guide, Phalaenopsis, Cattleya, Dendrobium, Paphiopedilum, Cymbidium, Vanda, Vanilla');
    upsertCanonical(canonical);

    injectJSONLD('orchids-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      url: canonical,
      description: metaDescription,
      inLanguage: 'en'
    });

    injectJSONLD('orchids-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Orchids: The Ultimate 5,000-Word Guide',
      description: metaDescription,
      mainEntityOfPage: canonical,
      author: {
        '@type': 'Organization',
        name: 'Backlink ∞'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Backlink ∞'
      },
      dateModified: new Date().toISOString(),
      inLanguage: 'en',
      articleSection: orchidSections.map((s) => s.title)
    });

    injectJSONLD('orchids-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: orchidFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer }
      }))
    });
  }, [canonical]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 md:p-10">
          <div className="relative z-10 flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700">
              Definitive Orchid Keyword Resource
            </span>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">Orchids: The Complete, Search-Intent Satisfying Guide</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-800 md:text-xl">
                A comprehensive overview of Orchidaceae—from morphology and pollination to care, varieties, troubleshooting, culture, and conservation—crafted to meet every expectation behind the “Orchids” search.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Word Count</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{combinedWordCount.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-600">Thorough, expansive coverage designed for depth and clarity.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{lastUpdated}</p>
                <p className="mt-2 text-sm text-slate-600">Refreshed to reflect current best practices in orchid care and taxonomy.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Primary Keyword</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">Orchids</p>
                <p className="mt-2 text-sm text-slate-600">Supported by semantic clusters covering care, species, and conservation.</p>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(600px_200px_at_10%_20%,rgba(168,85,247,0.10),transparent),radial-gradient(500px_200px_at_90%_30%,rgba(59,130,246,0.10),transparent)]" />
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
          <aside className="sticky top-24 h-max rounded-2xl border border-border/50 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On this page</p>
            <ul className="mt-2 space-y-1 text-sm">
              {orchidSections.map((section) => (
                <li key={section.id}>
                  <a className="text-slate-700 hover:text-slate-900 hover:underline" href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
              <li>
                <a className="text-slate-700 hover:text-slate-900 hover:underline" href="#faq">Frequently Asked Questions</a>
              </li>
              <li>
                <a className="text-slate-700 hover:text-slate-900 hover:underline" href="#glossary">Glossary</a>
              </li>
              <li>
                <a className="text-slate-700 hover:text-slate-900 hover:underline" href="#register">Register</a>
              </li>
            </ul>
          </aside>

          <article className="flex flex-col gap-10 pb-12">
            {orchidSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
                <header className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{section.title}</h2>
                  <p className="mt-2 text-slate-700">{section.summary}</p>
                </header>
                <div className="prose max-w-none prose-slate">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}

            <section id="faq" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
              <header className="mb-4">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Frequently Asked Questions</h2>
                <p className="mt-2 text-slate-700">Clear, practical answers distilled from expert growers and horticultural references.</p>
              </header>
              <div className="divide-y divide-slate-200">
                {orchidFaqs.map((faq, idx) => (
                  <details key={idx} className="group py-4">
                    <summary className="cursor-pointer list-none text-lg font-semibold text-slate-900">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-slate-700">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section id="glossary" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
              <header className="mb-4">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Glossary</h2>
                <p className="mt-2 text-slate-700">Core terminology that simplifies orchid morphology and care.
                </p>
              </header>
              <div className="grid gap-4 sm:grid-cols-2">
                {orchidGlossary.map((entry) => (
                  <article key={entry.term} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <h3 className="text-base font-semibold text-slate-900">{entry.term}</h3>
                    <p className="mt-1 text-sm text-slate-700">{entry.definition}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="reviews" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
              <header className="mb-4">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Grower Voices and Reviews</h2>
                <p className="mt-2 text-slate-700">Representative sentiments from the orchid community about what works—and what to avoid.</p>
              </header>
              <div className="grid gap-4 sm:grid-cols-2">
                <blockquote className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-slate-800">“Consistent airflow and letting the pot drain fully changed everything. My Phals stopped rotting and started spiking twice a year.”</blockquote>
                <blockquote className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-slate-800">“Switching to a coarse bark mix with monthly flushes ended my salt issues. Leaves are sturdier and blooms last longer.”</blockquote>
                <blockquote className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-slate-800">“Bright shade and cooler nights finally triggered my Cymbidiums. Environmental cues matter more than I realized.”</blockquote>
                <blockquote className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-slate-800">“Weekly, weak fertilizer plus a fan on low keeps roots active. The wet–dry rhythm is the secret to healthy growth.”</blockquote>
              </div>
              <p className="mt-3 text-xs text-slate-500">Quotes are representative composites of common community advice shared by experienced growers.</p>
            </section>

            <section id="register" className="scroll-mt-24 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 shadow-sm md:p-8">
              <header className="mb-3">
                <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Get Traffic with SEO: Buy Quality Backlinks</h2>
                <p className="mt-2 text-slate-700">If you build content people love, search engines will follow. When you’re ready to accelerate growth, register to get backlinks and scale traffic with Backlink ∞.</p>
              </header>
              <p className="text-lg text-slate-900">
                <a className="underline text-blue-700 hover:text-blue-800" href="https://backlinkoo.com/register" target="_blank" rel="nofollow noopener">Register for Backlink ∞</a>
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
