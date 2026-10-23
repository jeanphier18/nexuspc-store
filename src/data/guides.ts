import type { CategoryKey } from "@/config/nav";

export type Locale = "es" | "en";

export type GuideLevel = "entry" | "mid" | "high";

export type GuideSection = {
  heading: string;
  body?: string;
  list?: string[];
  note?: string;
};

export type GuideCopy = {
  title: string;
  excerpt: string;
  intro: string;
  sections: GuideSection[];
  takeaway: string;
};

export type Guide = {
  slug: string;
  category: CategoryKey;
  level: GuideLevel;
  readMinutes: number;
  date: string;
  products: string[];
  featured?: boolean;
  copy: Record<Locale, GuideCopy>;
};

export const guides: Guide[] = [
  {
    slug: "gpu-1440p",
    category: "gpu",
    level: "mid",
    readMinutes: 6,
    date: "2026-10-08",
    featured: true,
    products: [
      "nvidia-rtx-5070-ti",
      "amd-radeon-rx-9070-xt",
      "nvidia-rtx-5080",
    ],
    copy: {
      es: {
        title: "GPU para 1440p: la guía para no pagar de más",
        excerpt:
          "Qué VRAM, consumo y funciones necesitas para 1440p a 144 Hz sin caer en la trampa del número más grande.",
        intro:
          "Elegir GPU para 1440p es un ejercicio de equilibrio: la resolución perdona menos que 1080p, pero el salto a 4K castiga el presupuesto y el consumo. Estas son las variables que de verdad mueven la aguja.",
        sections: [
          {
            heading: "Empieza por tu monitor",
            body: "Un panel de 1440p a 144 Hz pide una GPU que sostenga más de 100 FPS en tus juegos, no solo en benchmarks sintéticos. Si tu monitor es de 60 Hz, la prioridad cambia: mejor calidad de imagen y menos consumo. El objetivo no es el número más alto, sino el que tu pantalla puede mostrar.",
          },
          {
            heading: "VRAM: 16 GB es el punto dulce",
            body: "En 2026, 16 GB cubren con margen los lanzamientos con texturas altas a 1440p. 12 GB sigue funcionando, pero obliga a vigilar la configuración en los títulos más pesados; 8 GB ya se queda corto con ray tracing activado.",
            list: [
              "16 GB: margen para texturas altas, mods y varios años de lanzamientos.",
              "12 GB: válido si juegas en alto y dosificas el ray tracing.",
              "8 GB: solo para esports y presupuestos muy ajustados.",
            ],
          },
          {
            heading: "El coste escondido: consumo y fuente",
            body: "Cada vatio extra se paga en la factura y en la fuente. Una GPU de 300 W pide una fuente de 750 W con margen; una de 575 W, al menos 1000 W y un conector 12V-2x6 bien asentado. Comprueba también el largo disponible en tu caja antes de comprar.",
          },
          {
            heading: "Tres perfiles de compra",
            list: [
              "Presupuesto: RX 9070 XT de 16 GB para 1440p en alto.",
              "Equilibrado: RTX 5070 Ti si quieres DLSS 4 y mejor eficiencia.",
              "Sin concesiones: RTX 5080 para 1440p a 240 Hz o 4K con escalado.",
            ],
            note: "El cuello de botella casi nunca es la GPU sola: un CPU de gama media y 32 GB de RAM en dual channel cambian más de lo que parece.",
          },
        ],
        takeaway:
          "Compra por VRAM, consumo y funciones, no por el número del modelo. Para 1440p, 16 GB y una fuente con margen te duran más que 10 FPS extra hoy.",
      },
      en: {
        title: "1440p GPUs: the guide to not overpaying",
        excerpt:
          "The VRAM, power and features you actually need for 1440p at 144 Hz, without falling for the biggest number.",
        intro:
          "Choosing a 1440p GPU is a balancing act: the resolution is less forgiving than 1080p, but jumping to 4K punishes both your budget and your power bill. These are the variables that actually matter.",
        sections: [
          {
            heading: "Start with your monitor",
            body: "A 1440p 144 Hz panel needs a GPU that holds over 100 FPS in your games, not just in synthetic benchmarks. If your monitor is 60 Hz, the priority shifts: better image quality and lower power draw. The goal is not the highest number, but the one your screen can show.",
          },
          {
            heading: "VRAM: 16 GB is the sweet spot",
            body: "In 2026, 16 GB comfortably covers new releases with high textures at 1440p. 12 GB still works, but you have to watch settings in the heaviest titles; 8 GB falls short with ray tracing enabled.",
            list: [
              "16 GB: headroom for high textures, mods and years of releases.",
              "12 GB: fine if you play on high and use ray tracing sparingly.",
              "8 GB: esports and very tight budgets only.",
            ],
          },
          {
            heading: "The hidden cost: power and PSU",
            body: "Every extra watt shows up on your bill and in your power supply. A 300 W GPU wants a 750 W PSU with headroom; a 575 W card needs at least 1000 W and a properly seated 12V-2x6 connector. Check case clearance before you buy.",
          },
          {
            heading: "Three buying profiles",
            list: [
              "Budget: 16 GB RX 9070 XT for 1440p on high.",
              "Balanced: RTX 5070 Ti for DLSS 4 and better efficiency.",
              "No compromises: RTX 5080 for 1440p at 240 Hz or 4K with upscaling.",
            ],
            note: "The bottleneck is rarely the GPU alone: a mid-range CPU and 32 GB of dual-channel RAM change more than it seems.",
          },
        ],
        takeaway:
          "Buy for VRAM, power and features, not the model number. For 1440p, 16 GB and a PSU with headroom will outlast 10 extra FPS today.",
      },
    },
  },
  {
    slug: "cpu-gaming",
    category: "cpu",
    level: "mid",
    readMinutes: 5,
    date: "2026-09-24",
    products: [
      "amd-ryzen-7-9800x3d",
      "amd-ryzen-9-9950x3d",
      "intel-core-ultra-9-285k",
    ],
    copy: {
      es: {
        title: "CPU para gaming: la caché manda",
        excerpt:
          "Por qué un 8 núcleos con caché apilada puede sentirse mejor en juegos que un 16 núcleos genérico.",
        intro:
          "Los juegos no reparten el trabajo como un render. Lo que separa una CPU buena de una excelente en gaming es la latencia: cuántos datos llegan a tiempo al núcleo que está esperando.",
        sections: [
          {
            heading: "Núcleos frente a caché",
            body: "La mayoría de los motores usan pocos hilos para la lógica y la física. La caché L3 apilada reduce los viajes a memoria RAM y sube el 1% low, que es exactamente lo que percibes como fluidez cuando giras la cámara.",
          },
          {
            heading: "El 1% low importa más que el promedio",
            body: "Un promedio de 200 FPS con caídas a 60 se siente peor que 140 estables. Busca benchmarks de tu juego y tu resolución: las pruebas a 720p exageran diferencias que a 1440p casi desaparecen.",
            list: [
              "GPU de gama alta a 1080p o 1440p: invierte en CPU.",
              "4K: la GPU manda; un CPU de gama media es suficiente.",
              "Streaming o edición: suma núcleos y codificador dedicado.",
            ],
          },
          {
            heading: "Plataforma y longevidad",
            body: "AM5 sigue recibiendo generaciones; LGA1851 llega con una sola. Elige la plataforma por las actualizaciones que esperas y por el coste de la placa, no por el logo. Una placa B850 sensata rinde igual que una tope de gama si no haces overclock extremo.",
          },
          {
            heading: "No olvides el resto",
            body: "Una CPU rápida con memoria lenta pierde parte de la ventaja. Usa dos módulos, activa EXPO/XMP y apunta a 6000 MT/s con latencia baja en AM5.",
            note: "El TDP de la caja no cuenta toda la historia: revisa el consumo real en reviews y elige refrigeración con margen.",
          },
        ],
        takeaway:
          "Para gaming, prioriza caché y 1% low sobre número de núcleos. Si juegas a 4K, gasta ese presupuesto en GPU.",
      },
      en: {
        title: "Gaming CPUs: cache wins",
        excerpt:
          "Why an 8-core chip with stacked cache can feel better in games than a generic 16-core part.",
        intro:
          "Games don't split work like a render. What separates a good gaming CPU from a great one is latency: how much data reaches the core that is waiting for it.",
        sections: [
          {
            heading: "Cores versus cache",
            body: "Most engines use few threads for logic and physics. Stacked L3 cache cuts trips to system memory and lifts the 1% low, which is exactly what you feel as smoothness when you turn the camera.",
          },
          {
            heading: "1% lows matter more than averages",
            body: "A 200 FPS average with dips to 60 feels worse than a stable 140. Look for benchmarks in your game and resolution: 720p tests exaggerate differences that almost vanish at 1440p.",
            list: [
              "High-end GPU at 1080p or 1440p: invest in CPU.",
              "4K: the GPU leads; a mid-range CPU is enough.",
              "Streaming or editing: add cores and a dedicated encoder.",
            ],
          },
          {
            heading: "Platform and longevity",
            body: "AM5 keeps receiving generations; LGA1851 arrives with a single one. Pick the platform for the upgrades you expect and the board cost, not the logo. A sensible B850 board performs like a flagship if you are not into extreme overclocking.",
          },
          {
            heading: "Don't forget the rest",
            body: "A fast CPU with slow memory loses part of its edge. Use two modules, enable EXPO/XMP and aim for 6000 MT/s with low latency on AM5.",
            note: "The box TDP never tells the whole story: check real power draw in reviews and pick cooling with headroom.",
          },
        ],
        takeaway:
          "For gaming, prioritize cache and 1% lows over core count. If you play at 4K, spend that budget on the GPU.",
      },
    },
  },
  {
    slug: "ssd-nvme",
    category: "storage",
    level: "entry",
    readMinutes: 4,
    date: "2026-09-12",
    products: [
      "samsung-990-pro-2tb",
      "wd-black-sn850x-2tb",
      "crucial-t705-2tb",
    ],
    copy: {
      es: {
        title: "SSD NVMe: Gen4 frente a Gen5 sin mitos",
        excerpt:
          "Velocidad secuencial, TBW y disipación: lo que sí notas al abrir juegos y mover archivos.",
        intro:
          "Los números de caja venden: 7.000, 14.000 MB/s. Pero un juego no se carga como una película, y la diferencia real entre un Gen4 decente y un Gen5 tope de gama es mucho menor de lo que sugiere el marketing.",
        sections: [
          {
            heading: "Dónde se nota la velocidad",
            body: "Cargar un juego es lectura aleatoria de muchos archivos pequeños. La velocidad secuencial de 14 GB/s casi no interviene. Un Gen4 bien implementado sobra para jugar; el Gen5 brilla en transferencias grandes y cargas de trabajo profesionales.",
          },
          {
            heading: "Mira TBW, DRAM y garantía",
            body: "La resistencia (TBW) y la caché DRAM importan más que el pico de velocidad. Un SSD sin DRAM puede caer en picado al llenarse. Compara TBW por terabyte y años de garantía.",
            list: [
              "2 TB para una biblioteca de juegos moderna.",
              "DRAM o HMB bien implementado para uso sostenido.",
              "Disipador incluido si tu placa no trae uno.",
            ],
          },
          {
            heading: "Disipación y espacio",
            body: "Gen5 puede calentarse y bajar de rendimiento. Si tu placa tapa el slot o vives en un clima cálido, un disipador decente no es opcional. Deja margen libre: un SSD lleno al 95% pierde velocidad y resistencia.",
          },
          {
            heading: "¿Cuánto necesitas?",
            body: "Para jugar, 2 TB es el punto dulce en 2026. Para trabajo con vídeo o datasets, suma un segundo SSD de caché en lugar de comprar uno gigante.",
            note: "Antes de comprar, confirma la generación del slot M.2 de tu placa: un Gen5 en un slot Gen4 funciona, pero a velocidad Gen4.",
          },
        ],
        takeaway:
          "Compra por TBW, DRAM y temperatura, no por el número de MB/s. Un Gen4 de 2 TB con buen soporte es la compra inteligente para jugar.",
      },
      en: {
        title: "NVMe SSDs: Gen4 vs Gen5 without the myths",
        excerpt:
          "Sequential speed, TBW and cooling: what you actually notice when loading games and moving files.",
        intro:
          "Box numbers sell: 7,000, 14,000 MB/s. But a game doesn't load like a movie, and the real gap between a solid Gen4 drive and a flagship Gen5 is far smaller than marketing suggests.",
        sections: [
          {
            heading: "Where speed shows up",
            body: "Loading a game is random reads across many small files. A 14 GB/s sequential figure barely matters. A well-implemented Gen4 is plenty for gaming; Gen5 shines in large transfers and professional workloads.",
          },
          {
            heading: "Look at TBW, DRAM and warranty",
            body: "Endurance (TBW) and DRAM cache matter more than peak speed. A DRAM-less drive can fall off a cliff as it fills. Compare TBW per terabyte and warranty years.",
            list: [
              "2 TB for a modern game library.",
              "DRAM or well-implemented HMB for sustained use.",
              "Included heatsink if your board doesn't have one.",
            ],
          },
          {
            heading: "Cooling and free space",
            body: "Gen5 can run hot and throttle. If your board covers the slot or you live in a warm climate, a decent heatsink is not optional. Leave headroom: a drive at 95% capacity loses speed and endurance.",
          },
          {
            heading: "How much do you need?",
            body: "For gaming, 2 TB is the 2026 sweet spot. For video work or datasets, add a second scratch SSD instead of buying one giant drive.",
            note: "Before buying, confirm your board's M.2 generation: a Gen5 drive in a Gen4 slot works, but at Gen4 speed.",
          },
        ],
        takeaway:
          "Buy for TBW, DRAM and temperature, not MB/s. A 2 TB Gen4 drive with good support is the smart gaming purchase.",
      },
    },
  },
  {
    slug: "fuente-psu",
    category: "psu",
    level: "entry",
    readMinutes: 5,
    date: "2026-08-30",
    products: ["corsair-rm1000x", "seasonic-vertex-gx-850"],
    copy: {
      es: {
        title: "Fuente: vatios reales y el conector que importa",
        excerpt:
          "Cómo calcular margen, qué significa 80 Plus y por qué el 12V-2x6 no admite atajos.",
        intro:
          "La fuente es el componente que menos se ve y el que más caro sale cuando falla. No necesitas la más grande: necesitas la correcta, con protecciones y cables que no jueguen contra ti.",
        sections: [
          {
            heading: "Calcula con margen, no con miedo",
            body: "Suma el consumo de GPU y CPU, añade 150–200 W para placa, discos y ventiladores, y deja un 20% de margen. Una fuente trabajando al 50–70% de su capacidad es más eficiente y más silenciosa.",
          },
          {
            heading: "80 Plus no es sinónimo de calidad",
            body: "La certificación mide eficiencia, no protecciones ni componentes. Busca reviews con pruebas de rizado y protección OCP/OVP/SCP. Un modelo barato con 80 Plus Bronze puede ser mejor que uno Gold sin reviews.",
            list: [
              "850 W: builds de una GPU de gama media-alta.",
              "1000 W: GPU de 400–575 W con margen real.",
              "1200 W: solo si añades overclock o varias GPUs.",
            ],
          },
          {
            heading: "12V-2x6: sin adaptadores dudosos",
            body: "Conecta el cable hasta el fondo, evita codos cerrados junto al conector y no reutilices cables de otra fuente. Un conector mal asentado es un riesgo real, no un detalle estético.",
          },
          {
            heading: "Modular, pero con orden",
            body: "Una fuente modular ayuda a limpiar el cableado, siempre que uses los cables incluidos. Guarda la caja y las bridas: los accesorios se pierden justo cuando los necesitas.",
            note: "Si tu GPU trae adaptador de 4×8 pines, úsalo solo como solución temporal y con el cableado original de la fuente.",
          },
        ],
        takeaway:
          "Elige por protecciones y reviews, no solo por vatios. 850–1000 W de calidad cubren casi cualquier build moderna con margen.",
      },
      en: {
        title: "Power supplies: real watts and the connector that matters",
        excerpt:
          "How to size headroom, what 80 Plus really means and why 12V-2x6 leaves no room for shortcuts.",
        intro:
          "The PSU is the part you see least and the one that costs most when it fails. You don't need the biggest one: you need the right one, with protections and cables that don't work against you.",
        sections: [
          {
            heading: "Size with headroom, not fear",
            body: "Add GPU and CPU draw, add 150–200 W for board, drives and fans, then leave 20% headroom. A PSU running at 50–70% of capacity is more efficient and quieter.",
          },
          {
            heading: "80 Plus is not a quality label",
            body: "The certification measures efficiency, not protections or components. Look for reviews with ripple testing and OCP/OVP/SCP protection. A cheap Bronze unit can beat a Gold one with no reviews.",
            list: [
              "850 W: single upper-mid GPU builds.",
              "1000 W: 400–575 W GPUs with real headroom.",
              "1200 W: only with overclocking or multiple GPUs.",
            ],
          },
          {
            heading: "12V-2x6: no sketchy adapters",
            body: "Push the cable all the way in, avoid tight bends right at the connector and never reuse cables from another PSU. A poorly seated connector is a real risk, not a cosmetic detail.",
          },
          {
            heading: "Modular, but organized",
            body: "A modular PSU helps cable management, as long as you use the included cables. Keep the box and spare cables: accessories go missing exactly when you need them.",
            note: "If your GPU ships with a 4×8-pin adapter, treat it as a temporary solution and keep the PSU's original cabling.",
          },
        ],
        takeaway:
          "Choose for protections and reviews, not watts alone. A quality 850–1000 W unit covers almost any modern build with headroom.",
      },
    },
  },
  {
    slug: "monitor-1440p",
    category: "monitors",
    level: "mid",
    readMinutes: 5,
    date: "2026-09-02",
    products: ["lg-ultragear-27gr93u", "samsung-odyssey-oled-g9"],
    copy: {
      es: {
        title: "Monitor 1440p: refresco, panel y respuesta",
        excerpt:
          "De nada sirve una GPU rápida si el panel no acompaña. Tiempos de respuesta, HDR y ergonomía.",
        intro:
          "El monitor es la mitad de la experiencia y la parte que más se descuida. Antes de mirar Hz y pulgadas, define qué tipo de juego vas a jugar y a qué distancia.",
        sections: [
          {
            heading: "Refresco y respuesta",
            body: "144 Hz es el punto dulce para 1440p; 240 Hz solo tiene sentido si tu GPU sostiene esos FPS en esports. Mira el tiempo de respuesta real y el overshoot en reviews, no solo el número del fabricante.",
          },
          {
            heading: "Panel: IPS, VA u OLED",
            list: [
              "IPS: color y ángulos, contraste medio.",
              "VA: contraste alto, riesgo de smearing en escenas oscuras.",
              "OLED: negro perfecto y respuesta casi instantánea, con cuidado por burn-in.",
            ],
            body: "Para jugar de todo, un IPS rápido es la apuesta segura. Si ves cine y juegos oscuros, el VA o el OLED cambian la experiencia.",
          },
          {
            heading: "HDR y brillo",
            body: "HDR real pide brillo alto y atenuación local. Un panel con HDR400 certificado rara vez impresiona. Si el HDR es importante, busca OLED o mini-LED con reviews que midan nits reales.",
          },
          {
            heading: "Ergonomía y conexiones",
            body: "Altura ajustable, VESA y un soporte que no baile importan más de lo que parece. Para 1440p a 144 Hz, DisplayPort 1.4 es la conexión segura; HDMI 2.1 si compartes con consola.",
            note: "Un monitor rápido no arregla una mala calibración: si vas a editar color, reserva presupuesto para calibrar.",
          },
        ],
        takeaway:
          "Elige el panel según tu uso y comprueba respuesta y overshoot en reviews. 1440p a 144 Hz es el equilibrio más sensato en 2026.",
      },
      en: {
        title: "1440p monitors: refresh, panel and response",
        excerpt:
          "A fast GPU is wasted on a slow panel. Response times, HDR and ergonomics explained.",
        intro:
          "The monitor is half the experience and the most neglected part. Before looking at Hz and inches, decide what you play and how far you sit.",
        sections: [
          {
            heading: "Refresh and response",
            body: "144 Hz is the 1440p sweet spot; 240 Hz only makes sense if your GPU holds those frames in esports. Check real response time and overshoot in reviews, not just the manufacturer's number.",
          },
          {
            heading: "Panel: IPS, VA or OLED",
            list: [
              "IPS: color and angles, average contrast.",
              "VA: high contrast, risk of smearing in dark scenes.",
              "OLED: perfect blacks and near-instant response, watch for burn-in.",
            ],
            body: "For all-round gaming, a fast IPS is the safe bet. If you watch movies and play dark games, VA or OLED change the experience.",
          },
          {
            heading: "HDR and brightness",
            body: "Real HDR needs high brightness and local dimming. A panel with basic HDR400 certification rarely impresses. If HDR matters, look for OLED or mini-LED with reviews that measure real nits.",
          },
          {
            heading: "Ergonomics and ports",
            body: "Height adjustment, VESA and a stand that doesn't wobble matter more than they seem. For 1440p at 144 Hz, DisplayPort 1.4 is the safe connection; HDMI 2.1 if you share with a console.",
            note: "A fast monitor doesn't fix poor calibration: if you edit color, budget for a calibration tool.",
          },
        ],
        takeaway:
          "Pick the panel for your use and check response and overshoot in reviews. 1440p at 144 Hz is the most sensible balance in 2026.",
      },
    },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getFeaturedGuide(): Guide {
  return guides.find((guide) => guide.featured) ?? guides[0];
}

export function getRelatedGuides(guide: Guide, count = 2): Guide[] {
  return guides
    .filter((item) => item.slug !== guide.slug)
    .sort((a, b) => {
      const aSame = a.category === guide.category ? 0 : 1;
      const bSame = b.category === guide.category ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, count);
}
