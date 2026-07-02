# -*- coding: utf-8 -*-
"""
LUVORA — Canonical catalog data (single source of truth).

Extracted from the three "Entre Besos" 2025 PDF catalogs:
  - EB1 : "Catálogo Entre besos 1-2025"   (50 pp, text layer)
  - EB2 : "Catálogo Entre Besos 2-2025"    (64 pp, text layer)
  - MALLAS : "Colección Mallas"            (24 pp, image-only, read visually)

Notes
-----
* Currency: Colombian Pesos (COP). Prices in the catalog are written "$29.999"
  i.e. 29,999 COP. Stored here as integer `price` (COP, no decimals).
  The LUVORA design mockups showed placeholder EUR prices; the REAL prices are COP.
* `ref` is the catalog reference number = the SKU. Products that come in several
  flavors / scents / colors / sizes are modeled as ONE product with `variants`,
  each variant carrying its own catalog ref (SKU). Products with a single ref have
  a single implicit variant generated at build time.
* Category keys map to categories.json. Subcategory is a free label under the parent.
* `badges`: merchandising flags shown in the storefront (nuevo / mas_vendido / regalo_ideal / premium).
* House/distributor brand is "Entre Besos"; where a product line/manufacturer is
  identifiable (Satisfyer, Svakom, Elixir, Bassika, Erotika, Sen, Pocket Pleasure,
  Erotic Scence, Feroz, Magnetic, HemoLub) it is used as `brand`.
"""

BRAND_DEFAULT = "Entre Besos"
CURRENCY = "COP"

# ---------------------------------------------------------------------------
# CATEGORY TREE  (key -> definition).  Order = display order.
# ---------------------------------------------------------------------------
CATEGORIES = [
    {
        "key": "lubricantes", "name": "Lubricantes y Geles", "icon": "droplet",
        "description": "Lubricantes íntimos a base de agua: saborizados, con efecto calor/frío, "
                       "electrizantes, anales, estrechantes, multiorgásmicos, retardantes y neutros.",
        "subcategories": [
            "Saborizados y comestibles", "Efecto calor", "Efecto frío",
            "Electrizantes / Vibradores líquidos", "Anales", "Estrechantes",
            "Multiorgásmicos", "Retardantes", "Naturales y neutros", "Especiales",
        ],
    },
    {
        "key": "cosmetica", "name": "Cosmética Íntima y Sensual", "icon": "sparkles",
        "description": "Feromonas, splash corporales, aceites y velas de masaje, y cuidado íntimo.",
        "subcategories": [
            "Feromonas", "Splash corporales", "Aceites de masaje", "Velas de masaje",
            "Cuidado íntimo", "Cremas y exfoliantes",
        ],
    },
    {
        "key": "juguetes", "name": "Juguetes", "icon": "toy",
        "description": "Vibradores, succionadores, balas, huevos, anillos, consoladores, "
                       "masturbadores, fundas, plugs y más.",
        "subcategories": [
            "Vibradores", "Succionadores", "Balas vibradoras", "Huevos vibradores",
            "Anillos para pene", "Consoladores y dildos", "Masturbadores masculinos",
            "Fundas para pene", "Plugs y juguetes anales", "Bolas chinas y Kegel",
            "Bombas", "Arneses", "Higiene (duchas y enemas)",
        ],
    },
    {
        "key": "bienestar", "name": "Bienestar y Salud Sexual", "icon": "heart-pulse",
        "description": "Potenciadores y suplementos, perlas y esferas, y cuidado íntimo especial.",
        "subcategories": ["Potenciadores y suplementos", "Perlas y esferas", "Cuidado especial"],
    },
    {
        "key": "lenceria", "name": "Lencería y Mallas", "icon": "dress",
        "description": "Colección de mallas: bodysuits cortos, bodystockings enteros, "
                       "sets de dos piezas, medias y pezoneras.",
        "subcategories": ["Mallas cortas", "Mallas enteras", "Mallas dos piezas", "Medias", "Pezoneras"],
    },
    {
        "key": "bdsm", "name": "BDSM y Fetish", "icon": "handcuffs",
        "description": "Esposas, látigos y paletas, mordazas, antifaces, kits fetish y accesorios de rol.",
        "subcategories": ["Esposas", "Látigos y paletas", "Mordazas", "Antifaces y tapaojos",
                          "Kits fetish", "Rol y cosplay"],
    },
    {
        "key": "juegos", "name": "Juegos y Regalos", "icon": "gift",
        "description": "Juegos de mesa y cartas para pareja, dados eróticos, kits y combos de regalo.",
        "subcategories": ["Juegos de mesa y cartas", "Dados", "Kits y combos"],
    },
]

# ---------------------------------------------------------------------------
# PRODUCTS
# Each dict: ref | name | brand? | cat | sub | catalog | page | price(COP) |
#            size? | badges? | tags? | desc? | variants?[ {sku,label,type,price?,size?} ]
# When `variants` is present, `ref` may be omitted (the variants carry the SKUs).
# ---------------------------------------------------------------------------
PRODUCTS = [

    # ===================== EB1 — Cosmética / Feromonas =====================
    dict(ref="11672", name="Splash con Feromonas Frutos Rojos", brand="Magnetic",
         cat="cosmetica", sub="Feromonas", catalog="EB1", page=2, price=29999, size="125 ml",
         tags=["feromonas", "frutos rojos", "corporal"],
         desc="Splash corporal con feromonas de fragancia envolvente y notas dulces y seductoras, "
              "diseñado para realzar tu atractivo y atraer miradas."),
    dict(ref="11671", name="Crema Humectante con Feromonas Frutos Rojos", brand="Magnetic",
         cat="cosmetica", sub="Cuidado íntimo", catalog="EB1", page=2, price=29999, size="125 ml",
         tags=["feromonas", "hidratante", "brillos"],
         desc="Crema humectante con feromonas y brillitos que hidrata profundamente la piel y la "
              "envuelve en un aroma irresistible."),
    dict(ref="11688", name="Agua de Rosas con Feromonas Magnetic Elixir", brand="Magnetic",
         cat="cosmetica", sub="Feromonas", catalog="EB1", page=3, price=29999, size="30 ml",
         tags=["feromonas", "agua de rosas", "ácido hialurónico", "aloe vera"],
         desc="Bruma facial de agua de rosas con feromonas y activos iluminadores (ácido hialurónico, "
              "extracto de pepino, aloe vera y vitamina C) de textura ultraligera."),
    dict(name="Aceite para Masajes (Fragancia)", cat="cosmetica", sub="Aceites de masaje",
         catalog="EB1", page=4, price=17999, size="30 ml", tags=["aceite", "masaje", "juego previo", "premium"],
         desc="Aceite premium para masajes de textura ligera y delicioso aroma, con una leve sensación "
              "caliente ideal para el juego previo.",
         variants=[dict(sku="11295", label="Rosas", type="aroma"),
                   dict(sku="11296", label="Coco", type="aroma")]),
    dict(ref="11685", name="Aceite Corporal con Feromonas para Masajes y Aromaterapia",
         cat="cosmetica", sub="Aceites de masaje", catalog="EB1", page=5, price=52999, size="250 ml",
         tags=["aceite", "feromonas", "aromaterapia", "sensación sedosa"],
         desc="Aceite corporal con feromonas para masajes y aromaterapia, de sensación sedosa; "
              "aplicar sobre la piel para conectar, sentir y relajarse. Uso externo."),
    dict(ref="10393", name="Aceite Trifásico para Masajes", cat="cosmetica", sub="Aceites de masaje",
         catalog="EB1", page=6, price=12999, size="60 ml", tags=["aceite", "trifásico", "masaje"],
         desc="Aceites que al mezclarse humectan y suavizan la piel dándole un placentero aroma; "
              "aplicar con suaves masajes circulares."),
    dict(ref="10392", name="Crema de Manos Seducer Rose", cat="cosmetica", sub="Cremas y exfoliantes",
         catalog="EB1", page=6, price=8999, size="60 ml", tags=["crema de manos", "rosa"],
         desc="Crema de manos de rápida absorción con aroma Seducer Rose."),
    dict(name="Vela para Masaje", cat="cosmetica", sub="Velas de masaje", catalog="EB1", page=6,
         price=8999, tags=["vela", "masaje", "ambiente", "ingredientes naturales"],
         desc="Velas para masaje con ingredientes naturales y sostenibles que crean ambientes "
              "relajantes; al encenderse se transforman en un aceite tibio para la pareja.",
         variants=[dict(sku="10944", label="Verbena Excitante", type="aroma"),
                   dict(sku="10945", label="Love Pasión", type="aroma")]),
    dict(name="Loción con Feromonas Deluxe", cat="cosmetica", sub="Feromonas", catalog="EB1", page=7,
         price=42999, size="30 ml", tags=["feromonas", "loción", "atracción"],
         desc="Loción con feromonas que atrae al sexo opuesto a través del sentido olfativo y "
              "sensorial, mejorando la química y la receptividad.",
         variants=[dict(sku="11659", label="Deluxe for Men", type="genero"),
                   dict(sku="11658", label="Deluxe for Woman", type="genero")]),
    dict(name="Splash Corporal con Feromonas", cat="cosmetica", sub="Splash corporales",
         catalog="EB1", page=8, price=27999, size="120 ml", tags=["feromonas", "splash", "corporal"],
         desc="Splash corporal con feromonas para ser el centro de atracción y resaltar tu "
              "sensualidad innata; haz de las feromonas tu aliado en el amor.",
         variants=[dict(sku="11653", label="Coco Vainilla", type="aroma"),
                   dict(sku="11654", label="Frutos Rojos", type="aroma"),
                   dict(sku="11656", label="Mango Kiwi", type="aroma"),
                   dict(sku="11657", label="Ámbar", type="aroma"),
                   dict(sku="11655", label="Tropical", type="aroma")]),
    dict(name="Piu Amore — Splash con Feromonas", cat="cosmetica", sub="Splash corporales",
         catalog="EB1", page=10, price=19999, tags=["feromonas", "floral", "premium"],
         desc="Elegante fragancia floral que abre con violeta y toques verdes, cuerpo floral de rosa, "
              "lirio, jazmín y gardenia, y base de almizcle, ámbar, sándalo y vainilla.",
         variants=[dict(sku="10388", label="60 ml", type="tamaño", price=19999, size="60 ml"),
                   dict(sku="10652", label="260 ml", type="tamaño", price=26999, size="260 ml")]),
    dict(name="Seducción Rose — Splash con Feromonas", cat="cosmetica", sub="Splash corporales",
         catalog="EB1", page=10, price=19999, tags=["feromonas", "frutal floral"],
         desc="Acorde frutal floral con salida cítrica de bergamota y naranja, combinada con manzana "
              "verde, melón, durazno, fresa, ciruela y piña.",
         variants=[dict(sku="10389", label="60 ml", type="tamaño", price=19999, size="60 ml"),
                   dict(sku="10653", label="260 ml", type="tamaño", price=26999, size="260 ml")]),
    dict(name="Dolce Passione — Splash con Feromonas", cat="cosmetica", sub="Splash corporales",
         catalog="EB1", page=10, price=19999, tags=["feromonas", "coco", "vainilla"],
         desc="Rica fragancia con notas cremosas de coco, corazón floral de lirio, rosa y jazmín, "
              "y base de vainilla, heliotropo, ámbar y almizcle.",
         variants=[dict(sku="10390", label="60 ml", type="tamaño", price=19999, size="60 ml"),
                   dict(sku="10654", label="260 ml", type="tamaño", price=26999, size="260 ml")]),
    dict(ref="11284", name="Crema de Manos Grape", cat="cosmetica", sub="Cremas y exfoliantes",
         catalog="EB1", page=12, price=24999, size="260 ml", tags=["crema de manos", "uva"],
         desc="Crema de manos hidratante y humectante de rápida absorción con aroma Grape."),
    dict(name="Exfoliante Corporal", cat="cosmetica", sub="Cremas y exfoliantes", catalog="EB1", page=12,
         price=24999, size="260 ml", tags=["exfoliante", "frutal"],
         desc="Exfoliante corporal de fragancia frutal; Merlot con notas de ciruela cálida, "
              "Blackcurrant con grosella negra, naranja, jazmín y almizcle y semillas de uva.",
         variants=[dict(sku="11290", label="Merlot", type="aroma"),
                   dict(sku="11291", label="Blackcurrant", type="aroma")]),

    # ===================== EB1 — Lubricantes =====================
    dict(ref="11673", name="Lubricante Íntimo Neutro con Ácido Hialurónico y Aloe Vera",
         cat="lubricantes", sub="Especiales", catalog="EB1", page=13, price=34999, size="55 ml",
         badges=["nuevo"], tags=["neutro", "ácido hialurónico", "aloe vera", "hidratante"],
         desc="Nuevo lubricante que cuida tu piel con ácido hialurónico y aloe vera: hidrata, alivia "
              "irritaciones, protege y mejora la elasticidad de la zona íntima."),
    dict(ref="10142", name="Gel Anal Pocket Pleasure", brand="Pocket Pleasure",
         cat="lubricantes", sub="Anales", catalog="EB1", page=14, price=12999, size="5 ml",
         tags=["anal", "gel", "sachet"],
         desc="Gel anal en formato pocket para facilitar la penetración."),
    dict(ref="10143", name="Like a Virgin Pocket Pleasure", brand="Pocket Pleasure",
         cat="lubricantes", sub="Estrechantes", catalog="EB1", page=14, price=12999, size="5 ml",
         tags=["estrechante", "sachet"],
         desc="Gel estrechante en formato pocket que contrae suavemente las paredes vaginales."),
    dict(ref="10144", name="Retardante Pocket Pleasure", brand="Pocket Pleasure",
         cat="lubricantes", sub="Retardantes", catalog="EB1", page=14, price=12999, size="5 ml",
         tags=["retardante", "sachet"],
         desc="Gel retardante en formato pocket para prolongar la duración del encuentro."),
    dict(name="Lubricante Íntimo + Dados", brand="Pocket Pleasure", cat="lubricantes",
         sub="Saborizados y comestibles", catalog="EB1", page=15, price=22999, size="20 ml",
         tags=["saborizado", "dados", "juego previo"],
         desc="Lubricante íntimo saborizado acompañado de dados Pocket Pleasure para jugar y disfrutar.",
         variants=[dict(sku="11304", label="Fresa", type="sabor"),
                   dict(sku="11305", label="Cereza", type="sabor"),
                   dict(sku="11647", label="Frambuesa", type="sabor")]),
    dict(ref="10394", name="Lubricante Estrechante Virgin Dream Sen", brand="Sen",
         cat="lubricantes", sub="Estrechantes", catalog="EB1", page=16, price=36999, size="30 ml",
         tags=["estrechante"],
         desc="Lubricante íntimo con efecto estrechante para intensificar las sensaciones."),
    dict(ref="10395", name="Lubricante Anal Sen", brand="Sen", cat="lubricantes", sub="Anales",
         catalog="EB1", page=16, price=36999, size="30 ml", tags=["anal"],
         desc="Lubricante íntimo anal Sen para una penetración cómoda y placentera."),
    dict(ref="10396", name="Multiorgasmos Sen", brand="Sen", cat="lubricantes", sub="Multiorgásmicos",
         catalog="EB1", page=16, price=39999, size="30 ml", tags=["multiorgasmo"],
         desc="Lubricante íntimo multiorgásmico Sen que incrementa el placer y la sensibilidad."),
    dict(ref="10397", name="Multiorgasmos Electrizante Sen", brand="Sen", cat="lubricantes",
         sub="Electrizantes / Vibradores líquidos", catalog="EB1", page=17, price=42999, size="5 ml",
         tags=["multiorgasmo", "electrizante"],
         desc="Lubricante multiorgásmico con efecto electrizante para llevar la excitación a otro nivel."),
    dict(ref="11674", name="Vibrador Líquido Frío Multiorgasmo Electrizante", cat="lubricantes",
         sub="Electrizantes / Vibradores líquidos", catalog="EB1", page=17, price=39999, size="5 ml",
         tags=["vibrador líquido", "frío", "electrizante", "yerbabuena"],
         desc="Vibrador líquido electrizante frío con rico sabor a yerbabuena; con 2 gotas en las zonas "
              "erógenas eleva la excitación a una nueva dimensión."),
    dict(ref="11677", name="HemoLub — Calmante para Hemorroides", brand="HemoLub",
         cat="bienestar", sub="Cuidado especial", catalog="EB1", page=18, price=62999, size="60 ml",
         tags=["hemorroides", "calmante", "extractos naturales"],
         desc="Lubricante calmante con más de 10 extractos naturales que disminuye la picazón y el dolor; "
              "aplicar cada 8 horas limpiando bien el área."),
    dict(ref="11686", name="Lubricante Estrechante Vaginal Friction", cat="lubricantes",
         sub="Estrechantes", catalog="EB1", page=19, price=36999, size="30 ml",
         tags=["estrechante", "aloe vera"],
         desc="Lubricante con efecto estrechante que restaura la elasticidad natural y aumenta la "
              "fricción; enriquecido con aloe vera de efecto calmante."),
    dict(ref="11689", name="Multiorgasmo Multi-O", cat="lubricantes", sub="Multiorgásmicos",
         catalog="EB1", page=19, price=39999, size="30 ml",
         tags=["multiorgasmo", "afrodisíaco", "L-arginina"],
         desc="Lubricante estimulante con extractos de jengibre, ginkgo biloba, ginseng y flor de "
              "spilanthes más L-arginina, que intensifica la sensibilidad y la circulación íntima."),
    dict(ref="11680", name="Vibrador Líquido Frequency Intense", cat="lubricantes",
         sub="Electrizantes / Vibradores líquidos", catalog="EB1", page=20, price=44999, size="15 ml",
         badges=["nuevo"], tags=["vibrador líquido", "intenso", "clítoris"],
         desc="Gel vibrador líquido de intensidad alta: más vibración y más placer, con alquilamidas "
              "naturales que estimulan el sistema nervioso."),
    dict(ref="11675", name="Vibrador Líquido Frequency", cat="lubricantes",
         sub="Electrizantes / Vibradores líquidos", catalog="EB1", page=20, price=39999, size="15 ml",
         tags=["vibrador líquido", "clítoris", "pezones"],
         desc="Gel vibrador líquido que con una gota provoca una sensación vibrante en el clítoris o "
              "pezones, similar a la de un juguete sexual."),
    dict(ref="11678", name="Lubricante Cool Sensation", cat="lubricantes", sub="Efecto frío",
         catalog="EB1", page=21, price=26999, size="30 ml", tags=["efecto frío", "sexo oral"],
         desc="Lubricante a base de agua con efecto frío que potencia la sensibilidad; sabor agradable, "
              "compatible con preservativos y juguetes, ideal para sexo oral."),
    dict(ref="11681", name="Lubricante 5 Sensaciones", cat="lubricantes", sub="Especiales",
         catalog="EB1", page=21, price=24999, size="15 ml",
         tags=["multiefecto", "frío", "calor", "aloe vera"],
         desc="Lubricante multiefecto que activa cinco modos de placer: frescura, calor, sabor, "
              "sensación calmante con aloe vera y lubricación sedosa prolongada."),
    dict(ref="11643", name="Blow Pop Elixir", brand="Elixir", cat="lubricantes",
         sub="Saborizados y comestibles", catalog="EB1", page=22, price=5999,
         tags=["saborizado", "sexo oral", "sabor sorpresa"],
         desc="Lubricante saborizado para llevar la experiencia de placer oral a nuevas alturas; "
              "sabor sorpresa."),
    dict(name="Lubricante Saborizado Elixir", brand="Elixir", cat="lubricantes",
         sub="Saborizados y comestibles", catalog="EB1", page=23, price=24999, size="30 ml",
         tags=["saborizado", "sexo oral"],
         desc="Lubricante vaginal saborizado Elixir para experimentar una sensación caliente y deliciosa.",
         variants=[dict(sku="11644", label="Sandía", type="sabor"),
                   dict(sku="11645", label="Chicle", type="sabor"),
                   dict(sku="11646", label="Fresa Bombón", type="sabor")]),
    dict(name="Flavor Sex — Lubricante Caliente", cat="lubricantes", sub="Efecto calor",
         catalog="EB1", page=24, price=17999, size="20 ml",
         tags=["saborizado", "efecto calor", "comestible", "juego previo"],
         desc="Lubricante íntimo comestible con agradable sensación caliente, ideal para masajes "
              "eróticos en las zonas erógenas durante el juego previo.",
         variants=[dict(sku="10083", label="Cereza", type="sabor"),
                   dict(sku="10084", label="Ron", type="sabor"),
                   dict(sku="10093", label="Uva", type="sabor"),
                   dict(sku="10094", label="Piña Colada", type="sabor")]),
    dict(ref="10088", name="Lubricante Neutro", cat="lubricantes", sub="Naturales y neutros",
         catalog="EB1", page=25, price=22999, size="60 ml", tags=["neutro", "base agua", "pH balanceado"],
         desc="Lubricante neutro a base de agua con pH balanceado que evita irritación y resequedad; "
              "no mancha ni altera el pH natural."),
    dict(ref="10095", name="Multiorgasmo Sensation", cat="lubricantes", sub="Multiorgásmicos",
         catalog="EB1", page=25, price=17999, size="15 ml", tags=["multiorgasmo"],
         desc="Incrementa el placer, la sensibilidad y la circulación sanguínea de la zona íntima."),
    dict(ref="10096", name="Estrechante Corpo Stress", cat="lubricantes", sub="Estrechantes",
         catalog="EB1", page=25, price=17999, size="15 ml", tags=["estrechante"],
         desc="Aplicar 12–15 minutos antes en el área vaginal para revivir la magia de la primera vez."),
    dict(ref="10097", name="Retardante Delay for Men", cat="lubricantes", sub="Retardantes",
         catalog="EB1", page=25, price=17999, size="7 ml", tags=["retardante", "hombre"],
         desc="Aplícalo en la cabeza y cuello del pene 12–15 minutos antes de la penetración para "
              "prolongar el encuentro."),
    dict(name="Aceite Erotic Corazón — Lubricante Caliente", brand="Erotic Scence",
         cat="lubricantes", sub="Efecto calor", catalog="EB1", page=26, price=14999, size="24 ml",
         tags=["saborizado", "efecto calor", "comestible"],
         desc="Lubricante íntimo saborizado con sensación caliente, leve aroma y comestible, ideal "
              "para cultivar el arte del erotismo.",
         variants=[dict(sku="10763", label="Bombombum", type="sabor"),
                   dict(sku="10765", label="Cereza", type="sabor"),
                   dict(sku="10766", label="Chicle", type="sabor"),
                   dict(sku="10767", label="Uva", type="sabor"),
                   dict(sku="10768", label="Manzana", type="sabor")]),
    dict(name="Sachet Erotic Scence 3gr", brand="Erotic Scence", cat="lubricantes", sub="Especiales",
         catalog="EB1", page=27, price=10999, size="3 gr", tags=["sachet", "erotic scence"],
         desc="Sachets Erotic Scence de 3 gr en distintas funciones para estimular la zona íntima.",
         variants=[dict(sku="10776", label="Multi Ohh (multiorgásmico)", type="tipo"),
                   dict(sku="10778", label="Virgin Feel (estrechante)", type="tipo"),
                   dict(sku="10779", label="Easy Anal (anal)", type="tipo"),
                   dict(sku="10780", label="Retardante Thunder", type="tipo")]),
    dict(ref="11597", name="Crema Retardante Minotauro Prolong", cat="lubricantes", sub="Retardantes",
         catalog="EB1", page=27, price=16999, size="3 gr", tags=["retardante", "crema"],
         desc="Crema para prolongar la erección y retardar la eyaculación; aplicar una pequeña "
              "cantidad 10 minutos antes de la relación."),
    dict(ref="11614", name="Gel Erotic Anal", brand="Erotic Scence", cat="lubricantes", sub="Anales",
         catalog="EB1", page=28, price=26999, size="30 ml", tags=["anal", "gel", "base agua"],
         desc="Gel anal a base de agua ideal para uso con juguetes y preservativos; genera humedad y "
              "desensibiliza para facilitar la penetración anal."),
    dict(ref="11617", name="Retardante Thunder Erotic Gel", brand="Erotic Scence", cat="lubricantes",
         sub="Retardantes", catalog="EB1", page=28, price=26999, size="30 ml",
         tags=["retardante", "gel", "base agua"],
         desc="Gel lubricante retardante a base de agua para mejorar la comodidad y prolongar la "
              "relación; seguro con preservativo."),
    dict(ref="11615", name="Multi Ohh Gel", brand="Erotic Scence", cat="lubricantes",
         sub="Multiorgásmicos", catalog="EB1", page=28, price=24999, size="30 ml",
         tags=["multiorgasmo", "gel"],
         desc="Multiorgásmico Multi Ohh que sensibiliza la zona íntima con una agradable sensación de "
              "cosquilleo, aumentando la excitación."),
    dict(ref="11611", name="Virgin Feel Gel", brand="Erotic Scence", cat="lubricantes",
         sub="Estrechantes", catalog="EB1", page=28, price=24999, size="30 ml",
         tags=["estrechante", "gel"],
         desc="Gel estrechante Virgin Feel que actúa sobre los músculos vaginales dejando una "
              "sensación estrecha y aumentando la sensibilidad."),
    dict(ref="10774", name="Lubricante Ice Gel", cat="lubricantes", sub="Efecto frío",
         catalog="EB1", page=29, price=21999, size="40 ml", tags=["efecto frío", "gel", "saborizado"],
         desc="Lubricante en gel a base de agua con doble sensación: fría al aplicar y caliente con la "
              "fricción; saborizado y compatible con todos los materiales."),
    dict(ref="10775", name="Lubricante Hot Gel", cat="lubricantes", sub="Efecto calor",
         catalog="EB1", page=29, price=21999, size="40 ml", tags=["efecto calor", "gel", "base agua"],
         desc="Lubricante en gel a base de agua con pH balanceado que evita irritación y resequedad; "
              "no mancha."),
    dict(ref="10783", name="Cocool Sensación Fría", cat="lubricantes", sub="Efecto frío",
         catalog="EB1", page=29, price=19999, size="30 ml", tags=["efecto frío", "multiorgásmico", "clítoris"],
         desc="Multiorgásmico con sensación de frío; frotar suavemente en el clítoris con masajes "
              "circulares para estimular la zona."),

    # ===================== EB1 — Bienestar / Suplementos =====================
    dict(ref="11694", name="Power-X Rosada para Dama", cat="bienestar", sub="Potenciadores y suplementos",
         catalog="EB1", page=30, price=7999, tags=["suplemento", "libido femenino", "afrodisíaco"],
         desc="Suplemento concentrado que potencia el deseo sexual femenino y mantiene la libido y la "
              "energía; tomar 1 pastilla 30 minutos antes."),
    dict(ref="11698", name="Perlas Hot & Ice Exotic Ball x3", cat="bienestar", sub="Perlas y esferas",
         catalog="EB1", page=30, price=29999, tags=["perlas", "esferas", "sensorial"],
         desc="Esferas blandas de gelatina en variedad de sabores y aromas; cada una ofrece una "
              "experiencia sensorial diferente."),
    dict(ref="11146", name="SCX Bull x2", cat="bienestar", sub="Potenciadores y suplementos",
         catalog="EB1", page=31, price=12999, tags=["suplemento", "unisex"],
         desc="Pastilla potenciadora para consumo femenino y masculino. Registro INVIMA."),
    dict(ref="11555", name="Emental Suplemento x3", cat="bienestar", sub="Potenciadores y suplementos",
         catalog="EB1", page=31, price=7999, tags=["suplemento", "L-arginina", "vitaminas"],
         desc="Suplemento con L-arginina, chontaduro, borojó, zinc y vitaminas C, B1, B2, B6 y calcio."),
    dict(ref="11147", name="Powers-X", cat="bienestar", sub="Potenciadores y suplementos",
         catalog="EB1", page=31, price=7999, tags=["suplemento", "erección", "hombre"],
         desc="Potenciador natural que brinda una erección más firme y duradera e incrementa la "
              "excitación, el deseo y el placer, sin contraindicaciones."),
    dict(ref="11175", name="Mega Vit Advance", cat="bienestar", sub="Potenciadores y suplementos",
         catalog="EB1", page=31, price=5999, tags=["suplemento", "energía"],
         desc="Potenciador natural que estimula el aumento de energía y disposición sexual en hombres."),

    # ===================== EB1 — Juegos =====================
    dict(ref="11691", name="Verdad o Se Atreve — Juego Erótico", cat="juegos",
         sub="Juegos de mesa y cartas", catalog="EB1", page=32, price=39999,
         tags=["juego", "pareja", "amigos", "40 tarjetas"],
         desc="Juego erótico con 40 tarjetas de verdades o retos para disfrutar en pareja o con amigos; "
              "incluye ficha «Verdad o se Atreve»."),
    dict(ref="11682", name="Juego de Cartas Hot Drinks", cat="juegos", sub="Juegos de mesa y cartas",
         catalog="EB1", page=32, price=39999, tags=["juego", "cartas", "pareja", "amigos"],
         desc="Juego de cartas con las mejores ideas para divertirse al máximo con tu pareja o grupo de amigos."),
    dict(ref="11683", name="Fondo Blanco — Juego de Cartas", cat="juegos", sub="Juegos de mesa y cartas",
         catalog="EB1", page=32, price=39999, tags=["juego", "cartas", "shots"],
         desc="Cada participante toma una carta y cumple lo que dice: ¡cumples o te emborrachas!"),
    dict(ref="11692", name="Póker Kamasutra Lésbico", cat="juegos", sub="Juegos de mesa y cartas",
         catalog="EB1", page=33, price=39999, tags=["juego", "cartas", "kamasutra", "lésbico"],
         desc="Juego de cartas Póker con posiciones del Kamasutra para ellas; 58 cartas (54 posiciones "
              "y 4 penitencias)."),
    dict(ref="11693", name="Póker Kamasutra Gay", cat="juegos", sub="Juegos de mesa y cartas",
         catalog="EB1", page=33, price=39999, tags=["juego", "cartas", "kamasutra", "gay"],
         desc="Juego de cartas Póker erótico gay con posiciones del Kamasutra."),
    dict(ref="11690", name="Juego Jenga Hot Picante", cat="juegos", sub="Juegos de mesa y cartas",
         catalog="EB1", page=34, price=89999, tags=["juego", "jenga", "retos", "shots"],
         desc="Torre Jenga picante de retos y shots: saca una ficha, cumple el reto subido de tono o "
              "toma el shot; pierde quien tumbe la torre."),
    dict(ref="11684", name="Juego Jenga Hot Erótico", cat="juegos", sub="Juegos de mesa y cartas",
         catalog="EB1", page=34, price=89999, tags=["juego", "jenga", "sensual"],
         desc="Clásico Jenga erótico: cada bloque incluye un reto sensual, una caricia atrevida o una "
              "propuesta que aviva la imaginación."),

    # ===================== EB1 — BDSM / Fetish / Accesorios =====================
    dict(ref="10110", name="Tapa Ojos (Antifaz)", cat="bdsm", sub="Antifaces y tapaojos",
         catalog="EB1", page=35, price=9999, tags=["antifaz", "sentidos"],
         desc="Antifaz tapaojos para jugar con los sentidos y crear una experiencia diferente."),
    dict(ref="10111", name="Esposas de Terciopelo", cat="bdsm", sub="Esposas", catalog="EB1", page=35,
         price=22999, tags=["esposas", "terciopelo"],
         desc="Esposas de terciopelo suaves para juegos de dominación y sumisión."),
    dict(name="Pezoneras", cat="lenceria", sub="Pezoneras", catalog="EB1", page=35, price=16999,
         tags=["pezoneras", "lentejuela", "flecos"],
         desc="Pezoneras con lentejuelas y flecos que realzan tus pechos y añaden un toque de intriga "
              "y seducción a tus momentos íntimos.",
         variants=[dict(sku="11529", label="Rojo", type="color"),
                   dict(sku="11528", label="Negro", type="color")]),
    dict(ref="10751", name="Kit Lover Fara Fetish — Esposas + Tapa Ojos + Látigo", cat="bdsm",
         sub="Kits fetish", catalog="EB1", page=36, price=52999, badges=["regalo_ideal"],
         tags=["kit", "esposas", "antifaz", "látigo"],
         desc="Kit fetish 3 en 1: esposas, tapaojos y látigo para iniciarte en el juego de rol."),
    dict(ref="11660", name="Sujetador Fetish con Ball Gag", cat="bdsm", sub="Mordazas",
         catalog="EB1", page=37, price=44999, tags=["bdsm", "ball gag", "inmovilizador"],
         desc="Inmovilizador de manos que se sujeta al cuello y trae mordaza (ball gag) con correa "
              "ajustable, ideal para practicantes BDSM."),
    dict(ref="11457", name="Kit Mordaza Ball Gag + Pezonera", cat="bdsm", sub="Mordazas",
         catalog="EB1", page=37, price=44999, tags=["ball gag", "pezonera", "kit"],
         desc="Mordaza tipo bola con agujeros para respirar más pezonera; perfecto 2 en 1 para "
              "iniciarse en las prácticas de dominación/sumisión."),
    dict(ref="11213", name="Látigo Thor — Corto de Flecos", cat="bdsm", sub="Látigos y paletas",
         catalog="EB1", page=38, price=39999, tags=["látigo", "cuero sintético"],
         desc="Látigo corto de flecos en cuero fino sintético negro, ideal para juegos de nalgadas y "
              "latigazos sin causar lesiones si se usa con prudencia."),
    dict(ref="11308", name="Látigo Luke Negro Corto", cat="bdsm", sub="Látigos y paletas",
         catalog="EB1", page=38, price=24999, tags=["látigo", "animal print"],
         desc="Látigo con diseño animal print en el mango y punta rodeada de flecos de cuero sintético "
              "para explorar nuevas sensaciones."),

    # ===================== EB1 — Juguetes =====================
    dict(ref="10584", name="Bomba para el Pene Remo", cat="juguetes", sub="Bombas", catalog="EB1",
         page=39, price=89999, tags=["bomba", "vacío", "erección"],
         desc="Bomba de vacío manual en tubo acrílico que mejora la circulación y las erecciones; "
              "longitud 20,5 cm, diámetro interno 6,5 cm. Úsala con lubricante."),
    dict(ref="11696", name="Ducha Anal Boxter", cat="juguetes", sub="Higiene (duchas y enemas)",
         catalog="EB1", page=40, price=39999, tags=["ducha anal", "silicona", "higiene", "90 ml"],
         desc="Ducha anal 100% silicona de alta calidad, suave y flexible; capacidad 90 ml. Compañera "
              "ideal para una limpieza anal cómoda, segura y discreta."),
    dict(ref="11695", name="Enema para Limpieza Anal Jervis", cat="juguetes",
         sub="Higiene (duchas y enemas)", catalog="EB1", page=40, price=49999, size="310 ml",
         tags=["enema", "higiene"],
         desc="Enema ergonómico de 310 ml en materiales seguros para el cuerpo que facilita la "
              "inserción y la higiene íntima."),
    dict(ref="11023", name="Enema para Limpieza Anal", cat="juguetes",
         sub="Higiene (duchas y enemas)", catalog="EB1", page=40, price=49999,
         tags=["enema", "higiene"],
         desc="Enema para una evacuación intestinal y limpieza del área anal completa e higiénica."),
    dict(ref="10830", name="Plug Anal Metálico Aquiles Tornasol", cat="juguetes",
         sub="Plugs y juguetes anales", catalog="EB1", page=41, price=49999,
         tags=["plug", "metálico", "mediano"],
         desc="Plug anal metálico tornasol, tamaño mediano, para iniciarte en el mundo del sexo anal."),
    dict(ref="11697", name="Anillo Atum — Anal Próstata", cat="juguetes", sub="Anillos para pene",
         catalog="EB1", page=41, price=44999, tags=["anillo", "próstata", "silicona"],
         desc="Anillo anal de silicona elástica que mantiene erecciones firmes y prolongadas y "
              "estimula la próstata."),
    dict(ref="11371", name="Anillo Stay Hard x3", cat="juguetes", sub="Anillos para pene",
         catalog="EB1", page=41, price=12999, tags=["anillo", "silicona", "pack x3"],
         desc="Set de 3 anillos de silicona que ayudan a mantener erecciones firmes y duraderas."),
    dict(ref="10099", name="Anillo Vibrador", cat="juguetes", sub="Anillos para pene",
         catalog="EB1", page=42, price=17999, tags=["anillo", "vibrador", "clítoris"],
         desc="Anillo vibrador que estimula el clítoris al contacto y ayuda a retardar la eyaculación; "
              "sencillo y útil para la pareja."),
    dict(ref="11661", name="Anillo Bala", cat="juguetes", sub="Anillos para pene", catalog="EB1",
         page=42, price=39999, tags=["anillo", "bala vibradora"],
         desc="Anillo con bala vibradora removible para estimulación extra durante el encuentro."),
    dict(ref="10825", name="Bala con Carga USB", cat="juguetes", sub="Balas vibradoras",
         catalog="EB1", page=42, price=69999, size="8 cm", badges=["nuevo"],
         tags=["bala", "recargable", "usb", "6 modos"],
         desc="Bala con potente vibración recargable por USB, 6 modos de vibración; 8 cm de largo, "
              "ideal para estimular las zonas erógenas."),
    dict(ref="10106", name="Vibrador Jelly Sweet 7 Rosado", cat="juguetes", sub="Vibradores",
         catalog="EB1", page=43, price=52999, tags=["vibrador", "silicona", "múltiples velocidades"],
         desc="Vibrador muy suave de silicona con múltiples velocidades controladas desde la base; "
              "requiere 2 baterías AA (no incluidas)."),
    dict(ref="10590", name="Consolador con Ventosa Midra", cat="juguetes", sub="Consoladores y dildos",
         catalog="EB1", page=43, price=64999, size="24 cm", tags=["consolador", "ventosa", "TPR", "realista"],
         desc="Dildo clásico con ventosa que se adhiere a superficies lisas; suave y flexible en TPR, "
              "24 cm de largo y 4,2 cm de diámetro."),
    dict(ref="10746", name="Vibrador Aphrodisia Crystal", cat="juguetes", sub="Vibradores",
         catalog="EB1", page=44, price=79999, tags=["vibrador", "conejo", "silicona", "clítoris"],
         desc="Vibrador 100% silicona con conejo estimulador de clítoris y vibración graduable; "
              "funciona con 2 baterías AA (no incluidas)."),
    dict(ref="11624", name="Succionador Bear", cat="juguetes", sub="Succionadores", catalog="EB1",
         page=45, price=139999, size="12 cm", tags=["succionador", "silicona médica", "usb", "10 modos", "discreto"],
         desc="Succionador discreto en forma de osito en silicona médica, carga USB, 10 modos de "
              "vibración, 12 cm de largo, resistente a salpicaduras."),
    dict(ref="11625", name="Bala Vibradora Lilo We-love Osito", cat="juguetes", sub="Succionadores",
         catalog="EB1", page=46, price=104999, tags=["bala", "onda de presión", "clítoris", "carga magnética"],
         desc="Estimulación por onda de presión sin contacto para el clítoris, en silicona amigable "
              "con la piel; incluye cable de carga magnética USB."),
    dict(ref="10832", name="Huevo Vibrador Inalámbrico", cat="juguetes", sub="Huevos vibradores",
         catalog="EB1", page=46, price=179999, tags=["huevo", "control inalámbrico", "10 funciones", "recargable"],
         desc="Huevo vibrador con control inalámbrico hasta 5 m y 10 funciones de vibración; silicona "
              "segura + ABS, recargable por USB. Largo total 18,2 cm."),
    dict(ref="11662", name="Vibrador Doble Tifany", cat="juguetes", sub="Vibradores", catalog="EB1",
         page=47, price=159999, tags=["vibrador doble", "recargable", "resistente al agua", "silencioso"],
         desc="Vibrador doble discreto y elegante con motor independiente, potente y silencioso; "
              "recargable con batería de litio y resistente al agua."),
    dict(ref="11679", name="Vibrador Doble Estimulación Lausa Ohlala", cat="juguetes", sub="Succionadores",
         catalog="EB1", page=48, price=209999, tags=["vibrador", "succionador", "doble estimulación", "ergonómico"],
         desc="Vibrador y succionador 2 en 1 que combina vibración y succión (simula sexo oral) con "
              "variedad de intensidades y patrones; diseño ergonómico."),
    dict(ref="10473", name="Satisfyer Pro 2 Generación 2", brand="Satisfyer", cat="juguetes",
         sub="Succionadores", catalog="EB1", page=49, price=399999,
         badges=["premium"], tags=["succionador", "air pulse", "impermeable", "app gratis"],
         desc="Succionador de clítoris con innovadora estimulación por ondas de presión; impermeable, "
              "11 configuraciones y modo susurro."),
    dict(ref="10962", name="Satisfyer Curvy 1+", brand="Satisfyer", cat="juguetes", sub="Succionadores",
         catalog="EB1", page=49, price=399999, badges=["premium"],
         tags=["succionador", "air pulse", "app", "silicona médica"],
         desc="Succionador de clítoris con tecnología Air Pulse y app, cuerpo ergonómico, 2 motores y "
              "silicona grado médico + ABS, hipoalergénico."),
    dict(ref="10963", name="Satisfyer Curvy 2+", brand="Satisfyer", cat="juguetes", sub="Succionadores",
         catalog="EB1", page=49, price=399999, badges=["premium"],
         tags=["succionador", "air pulse", "app", "silicona médica"],
         desc="Succionador de clítoris Curvy 2+ con ondas de presión, múltiples funciones de vibración "
              "y app; silicona grado médico + ABS."),

    # ===================== EB2 — Cosmética / Feromonas =====================
    dict(name="Splash Corporales", cat="cosmetica", sub="Splash corporales", catalog="EB2", page=2,
         price=10999, tags=["splash", "corporal", "fragancia"],
         desc="Splash corporales de fragancias frescas para consentir tus sentidos y refrescar tu piel.",
         variants=[dict(sku="10670", label="Coco Vainilla", type="aroma"),
                   dict(sku="10671", label="Frutos Rojos", type="aroma"),
                   dict(sku="10672", label="Tropical", type="aroma"),
                   dict(sku="10673", label="Kiwi", type="aroma"),
                   dict(sku="10674", label="Ámbar", type="aroma")]),
    dict(name="Splash Corporal Dulce Pecado", cat="cosmetica", sub="Splash corporales", catalog="EB2",
         page=3, price=19999, tags=["splash", "frutal", "inspiración BBW"],
         desc="Fragancia frutal (inspiración Mad About You de BBW): bergamota, fresa del bosque y "
              "frambuesa; cuerpo de pasiflora, fresia, rosa, piña y durazno; fondo de almizcles, "
              "vainilla, algodón de azúcar y sándalo.",
         variants=[dict(sku="11375", label="45 ml", type="tamaño", price=19999, size="45 ml"),
                   dict(sku="11372", label="130 ml", type="tamaño", price=26999, size="130 ml")]),
    dict(name="Splash Corporal Pasión Mágica", cat="cosmetica", sub="Splash corporales", catalog="EB2",
         page=4, price=19999, tags=["splash", "floral frutal"],
         desc="Fragancia floral frutal (Moon Sparkle de Escada): fresa, frambuesa, durazno y frutas "
              "exóticas; cuerpo de pétalos de rosa, freesia, lirio del valle y piña.",
         variants=[dict(sku="11376", label="45 ml", type="tamaño", price=19999, size="45 ml"),
                   dict(sku="11373", label="130 ml", type="tamaño", price=26999, size="130 ml")]),
    dict(name="Splash Corporal Amor Puro", cat="cosmetica", sub="Splash corporales", catalog="EB2",
         page=4, price=19999, tags=["splash", "floral frutal", "inspiración BBW"],
         desc="Fragancia floral frutal (inspiración Pink Chiffon de BBW): grosellas negras, frambuesa, "
              "fresa y mora; cuerpo de fresia, jazmín y rosa; fondo de vainilla, ámbar y almizcle.",
         variants=[dict(sku="11377", label="45 ml", type="tamaño", price=19999, size="45 ml"),
                   dict(sku="11374", label="130 ml", type="tamaño", price=26999, size="130 ml")]),
    dict(ref="10459", name="Feromonas Femeninas", cat="cosmetica", sub="Feromonas", catalog="EB2",
         page=5, price=24999, size="15 ml", tags=["feromonas", "mujer"],
         desc="Feromonas femeninas de exquisito aroma que despiertan emociones y favorecen el "
              "encuentro con el sexo opuesto."),
    dict(ref="10140", name="Feromonas Concentradas Woman", cat="cosmetica", sub="Feromonas",
         catalog="EB2", page=5, price=39999, size="10 ml", tags=["feromonas", "concentradas", "mujer", "rollon"],
         desc="Feromonas concentradas para mujer que aumentan la atracción; ahora en rollón, más fácil "
              "de aplicar y cómodo para llevar."),
    dict(ref="10312", name="Feromonas Concentradas Men", cat="cosmetica", sub="Feromonas",
         catalog="EB2", page=5, price=39999, size="10 ml", tags=["feromonas", "concentradas", "hombre", "rollon"],
         desc="Feromonas concentradas para hombre en rollón que desatan la pasión y el efecto de atracción."),
    dict(ref="11652", name="Feromona Feroz", brand="Feroz", cat="cosmetica", sub="Feromonas",
         catalog="EB2", page=6, price=39999, size="30 ml", badges=["nuevo"],
         tags=["feromonas", "sin aroma"],
         desc="Feromonas concentradas sin aroma que puedes aplicar sola o combinar con tu loción o "
              "crema favorita para potenciar su efecto seductor."),
    dict(ref="10678", name="Brillo Labial con Feromonas 15 ml", cat="cosmetica", sub="Feromonas",
         catalog="EB2", page=6, price=14999, size="15 ml", tags=["brillo labial", "feromonas"],
         desc="Brillo labial con feromonas que te vuelve más seductora y atractiva."),
    dict(ref="10139", name="Brillo Labial con Feromonas 10 ml", cat="cosmetica", sub="Feromonas",
         catalog="EB2", page=6, price=24999, size="10 ml", tags=["brillo labial", "feromonas"],
         desc="Brillo labial concentrado con feromonas para irradiar seducción."),
    dict(name="Desodorante Íntimo", cat="cosmetica", sub="Cuidado íntimo", catalog="EB2", page=7,
         price=21999, size="35 ml", tags=["desodorante íntimo", "cuidado íntimo", "pH"],
         desc="Desodorante íntimo que brinda una sensación fresca y un aroma delicado sin alterar el "
              "equilibrio ni el pH de tu zona íntima.",
         variants=[dict(sku="11387", label="Menta", type="aroma"),
                   dict(sku="11388", label="Algodón", type="aroma")]),
    dict(ref="10680", name="Jabón Íntimo Sen", brand="Sen", cat="cosmetica", sub="Cuidado íntimo",
         catalog="EB2", page=8, price=36999, size="250 ml", tags=["jabón íntimo", "manzanilla", "aloe vera", "pH"],
         desc="Jabón íntimo con extractos de manzanilla y aloe vera para el cuidado diario; refresca, "
              "equilibra y protege la piel más sensible sin alterar el pH."),
    dict(ref="10679", name="Desodorante Íntimo Feroz for Women", brand="Feroz", cat="cosmetica",
         sub="Cuidado íntimo", catalog="EB2", page=8, price=17999, size="16 ml",
         tags=["desodorante íntimo", "feromonas"],
         desc="Desodorante íntimo con feromonas y suave fragancia, ideal para los momentos previos o "
              "posteriores a la intimidad; previene malos olores sin irritar ni manchar."),
    dict(ref="11598", name="Despigmentante y Aclarante de Zonas Íntimas", cat="cosmetica",
         sub="Cuidado íntimo", catalog="EB2", page=9, price=44999, badges=["nuevo"],
         tags=["despigmentante", "aclarante", "cuidado íntimo"],
         desc="Tratamiento que combate la hiperpigmentación y homogeneiza el color de la piel; ideal "
              "para zonas íntimas, axilas, rodillas, codos y más. Aplicar de noche; usar protector solar de día."),
    dict(ref="10684", name="Aceite para Masajes Euforia (Cannabis)", brand="Erotika", cat="cosmetica",
         sub="Aceites de masaje", catalog="EB2", page=11, price=19999, size="30 ml",
         tags=["aceite", "masaje", "cannabis sativa", "relajante"],
         desc="Aceite para masajes con extracto de cannabis sativa que invita a un momento de "
              "tranquilidad, bienestar y relajación."),
    dict(name="Aceite Corporal Erotika para Masajes", brand="Erotika", cat="cosmetica",
         sub="Aceites de masaje", catalog="EB2", page=11, price=14999, size="30 ml",
         tags=["aceite", "masaje", "pareja"],
         desc="Aceites corporales Erotika para masajes que crean un espacio de tranquilidad y "
              "relajación en pareja.",
         variants=[dict(sku="10453", label="Crema de Whisky", type="aroma"),
                   dict(sku="10454", label="Piña Colada", type="aroma")]),
    dict(ref="10681", name="Vela Sensual para Masajes", cat="cosmetica", sub="Velas de masaje",
         catalog="EB2", page=12, price=29999, size="25 ml", tags=["vela", "masaje", "aroma"],
         desc="Vela sensual para masajes que al encenderse se convierte en un sedoso aceite; enciende "
              "la pasión con su delicioso aroma."),
    dict(name="Sensual Warming — Aceite Efecto Calor", cat="cosmetica", sub="Aceites de masaje",
         catalog="EB2", page=12, price=29999, size="60 ml", tags=["aceite", "efecto calor", "masaje"],
         desc="Aceite de masaje con efecto calor para un seductor masaje acompañado de un excitante aroma.",
         variants=[dict(sku="10682", label="Warming Passion", type="aroma"),
                   dict(sku="10683", label="Warming Love", type="aroma")]),

    # ===================== EB2 — Lubricantes =====================
    dict(name="Hot Ball Duplo — Esfera Lubricante", cat="lubricantes", sub="Especiales", catalog="EB2",
         page=13, price=21999, size="3 gr", tags=["hot ball", "esfera", "cápsula", "aroma"],
         desc="Lubricante en esfera revestido en cápsula de gelatina blanda con aceite vegetal; alto "
              "grado de lubricación y agradable aroma. Introdúcela en la cavidad vaginal.",
         variants=[dict(sku="11390", label="Morango", type="sabor"),
                   dict(sku="11391", label="Fresa con Champaña", type="sabor"),
                   dict(sku="11392", label="Frutos Rojos", type="sabor"),
                   dict(sku="11393", label="Uva", type="sabor"),
                   dict(sku="11395", label="Menta", type="sabor")]),
    dict(ref="11396", name="Hot Ball Mix de Sabores x4", cat="lubricantes", sub="Especiales",
         catalog="EB2", page=14, price=36999, size="3 gr c/u", tags=["hot ball", "mix", "pack x4"],
         desc="Set de 4 esferas lubricantes Hot Ball en surtido de sabores, envueltas en cápsula de "
              "gelatina con aceites vegetales para una lubricación superior."),
    dict(ref="10456", name="Lubricante Íntimo Multiorgasmos Sen", brand="Sen", cat="lubricantes",
         sub="Multiorgásmicos", catalog="EB2", page=15, price=10999, size="7 gr", tags=["multiorgasmo", "sachet"],
         desc="Fórmula que intensifica los momentos íntimos permitiendo una conexión más profunda y "
              "duradera."),
    dict(ref="10457", name="Lubricante Íntimo Anal Sen", brand="Sen", cat="lubricantes", sub="Anales",
         catalog="EB2", page=15, price=10999, size="7 gr", tags=["anal", "sachet"],
         desc="Lubricante anal con fórmula diseñada para un deslizamiento suave y prolongado, "
              "explorando la intimidad con serenidad y comodidad."),
    dict(ref="10458", name="Lubricante Íntimo Retardante Sen", brand="Sen", cat="lubricantes",
         sub="Retardantes", catalog="EB2", page=15, price=10999, size="7 gr", tags=["retardante", "sachet"],
         desc="Fórmula que maximiza la duración de tus momentos íntimos para una experiencia más "
              "prolongada y gratificante."),
    dict(name="Lubricante Íntimo Bassika", brand="Bassika", cat="lubricantes",
         sub="Efecto calor", catalog="EB2", page=16, price=8999, size="7 gr",
         tags=["saborizado", "efecto calor", "sexo oral"],
         desc="Lubricante caliente saborizado Bassika, ideal para sexo oral y juego previo.",
         variants=[dict(sku="10442", label="Whisky", type="sabor"),
                   dict(sku="10441", label="Cereza", type="sabor"),
                   dict(sku="10443", label="Ron", type="sabor"),
                   dict(sku="10444", label="Uva", type="sabor"),
                   dict(sku="10446", label="Chicle", type="sabor"),
                   dict(sku="10445", label="Tequila", type="sabor")]),
    dict(ref="10439", name="Lubricante Íntimo Anal Gel con Aroma", cat="lubricantes", sub="Anales",
         catalog="EB2", page=17, price=31999, size="30 ml", tags=["anal", "gel", "aroma", "base agua"],
         desc="Lubricante en gel enriquecido con extractos naturales y aroma cautivador, soluble en "
              "agua, sin anestésicos ni preservativos; suave y sin residuos."),
    dict(ref="10440", name="Retardante Íntimo Extra Placer en Spray", cat="lubricantes",
         sub="Retardantes", catalog="EB2", page=17, price=31999, size="30 ml", tags=["retardante", "spray"],
         desc="Spray retardante de duración extendida; rocía sobre la zona 10 minutos antes del "
              "momento íntimo para un efecto envolvente sin interrupciones."),
    dict(ref="10438", name="Lubricante Íntimo Trío Sabor Frutos Rojos", cat="lubricantes",
         sub="Saborizados y comestibles", catalog="EB2", page=18, price=24999, size="30 ml",
         tags=["saborizado", "3 en 1", "base agua"],
         desc="Lubricante saborizado multifunción (masaje, exploración sensorial y lubricación) de "
              "suave textura y sabor a frutos rojos; a base de agua, no mancha."),
    dict(ref="10435", name="Lubricante Íntimo Efecto Caliente Sabor Fresa", cat="lubricantes",
         sub="Efecto calor", catalog="EB2", page=18, price=20999, size="30 ml",
         tags=["saborizado", "efecto calor", "fresa", "base agua"],
         desc="Lubricante saborizado de fresa con sensación térmica que aumenta suavemente; a base de "
              "agua, compatible con juguetes y preservativos."),
    dict(ref="10436", name="Lubricante Íntimo Efecto Frío Sabor Menta", cat="lubricantes",
         sub="Efecto frío", catalog="EB2", page=18, price=20999, size="30 ml",
         tags=["saborizado", "efecto frío", "menta", "base agua"],
         desc="Lubricante de menta con efecto frío que estimula y realza cada contacto dejando una "
              "sensación de frescura prolongada; a base de agua."),
    dict(ref="10133", name="Lubricante Anal Sen Sachet", brand="Sen", cat="lubricantes", sub="Anales",
         catalog="EB2", page=19, price=10999, size="7 ml", tags=["anal", "sachet", "base agua"],
         desc="Lubricante anal a base de agua que mantiene una alta lubricación para relaciones "
              "placenteras y sin dolor."),
    dict(ref="10135", name="Estrechante Sen Sachet", brand="Sen", cat="lubricantes", sub="Estrechantes",
         catalog="EB2", page=19, price=8999, size="7 ml", tags=["estrechante", "sachet"],
         desc="Gel estrechante; aplícalo 15 minutos antes de la relación para revivir la magia de la "
              "primera vez. A base de agua y seguro con preservativos."),
    dict(ref="10137", name="Multiorgasmo Sen Sachet", brand="Sen", cat="lubricantes",
         sub="Multiorgásmicos", catalog="EB2", page=19, price=8999, size="7 ml", tags=["multiorgasmo", "sachet"],
         desc="Potenciador de sensaciones que aumenta la percepción y el placer para explorar el "
              "éxtasis a un nivel completamente nuevo."),
    dict(ref="10465", name="Lubricante Íntimo Sachet Hemp Cannabis", cat="lubricantes",
         sub="Especiales", catalog="EB2", page=20, price=12999, size="7 ml", tags=["cannabis", "relajante", "sachet"],
         desc="Combina placer natural con relajación profunda para disfrutar de sensaciones intensas y "
              "una satisfacción plena."),
    dict(ref="11650", name="Lubricante Íntimo Anal Electrizante Sachet", cat="lubricantes",
         sub="Electrizantes / Vibradores líquidos", catalog="EB2", page=20, price=12999, size="7 ml",
         badges=["nuevo"], tags=["anal", "electrizante", "sachet"],
         desc="Lubricante anal electrizante que ofrece una experiencia de sensaciones vivas y "
              "lubricación superior, sin anestésicos."),
    dict(ref="11649", name="Lubricante Íntimo Electrizante Lychee Sachet", cat="lubricantes",
         sub="Electrizantes / Vibradores líquidos", catalog="EB2", page=20, price=12999, size="7 ml",
         badges=["nuevo"], tags=["electrizante", "lychee", "efecto calor"],
         desc="Lubricante electrizante sabor lychee con efecto cálido y lubricación prolongada para "
              "explorar el placer con intensidad renovada."),
    dict(name="Lubricante Caliente Sen Sachet", brand="Sen", cat="lubricantes", sub="Efecto calor",
         catalog="EB2", page=21, price=8999, size="7 ml", badges=["nuevo"],
         tags=["saborizado", "efecto calor", "sachet"],
         desc="Colección de lubricantes calientes en sabores exquisitos que aportan una dimensión "
              "sensorial y una sensación de calor que intensifica cada experiencia.",
         variants=[dict(sku="10463", label="Crema de Whisky", type="sabor"),
                   dict(sku="11651", label="Chocolate", type="sabor"),
                   dict(sku="11663", label="Caramelo", type="sabor")]),
    dict(ref="10134", name="Estrechante Vaginal Sen Corazón", brand="Sen", cat="lubricantes",
         sub="Estrechantes", catalog="EB2", page=22, price=24999, size="10 ml", tags=["estrechante"],
         desc="Gel estrechante; aplícalo suavemente 15 minutos antes de la intimidad para potenciar "
              "sensaciones. A base de agua y seguro con preservativos."),
    dict(ref="10132", name="Lubricante Anal Sen Corazón", brand="Sen", cat="lubricantes", sub="Anales",
         catalog="EB2", page=22, price=24999, size="10 ml", tags=["anal", "base agua"],
         desc="Lubricante anal a base de agua para una sensación suave y continua, seguro con "
              "preservativos."),
    dict(ref="10136", name="Multiorgasmo Sen Corazón", brand="Sen", cat="lubricantes",
         sub="Multiorgásmicos", catalog="EB2", page=22, price=24999, size="10 ml", tags=["multiorgasmo"],
         desc="Gel multiorgásmico que intensifica las sensaciones y la sensibilidad en las zonas "
              "erógenas para explorar nuevos niveles de éxtasis."),
    dict(ref="10686", name="Lubricante Íntimo Trío", cat="lubricantes", sub="Saborizados y comestibles",
         catalog="EB2", page=23, price=39999, size="75 ml", tags=["3 en 1", "saborizado", "no graso"],
         desc="Lubricante íntimo multifuncional ideal para masajes en zonas erógenas gracias a su "
              "textura sedosa y delicioso sabor; no mancha, no deja residuos y es no graso."),
    dict(name="Lubricante Besable Saborizado", cat="lubricantes", sub="Saborizados y comestibles",
         catalog="EB2", page=24, price=24999, tags=["saborizado", "comestible", "pareja"],
         desc="Lubricantes saborizados que maximizan el placer a través del sabor; los momentos "
              "íntimos también deben saber delicioso.",
         variants=[dict(sku="10125", label="Crema de Whisky", type="sabor"),
                   dict(sku="11397", label="Chocolate", type="sabor"),
                   dict(sku="10462", label="Caramelo", type="sabor")]),
    dict(ref="10325", name="Multiorgasmo Frío & Calor", cat="lubricantes", sub="Multiorgásmicos",
         catalog="EB2", page=25, price=36999, size="30 ml", tags=["multiorgasmo", "frío", "calor", "saborizado"],
         desc="Multiorgásmico con rico sabor a fresa o choco cereza que ofrece sensación de frío y "
              "calor al mismo tiempo."),
    dict(ref="10129", name="Lubricante Íntimo Euforia Cannabis", cat="lubricantes", sub="Especiales",
         catalog="EB2", page=25, price=39999, size="30 ml", tags=["cannabis", "relajante"],
         desc="Lubricante que fusiona las propiedades naturales del cannabis con una fórmula suave que "
              "intensifica cada sensación para un confort prolongado."),
    dict(name="Lubricante Íntimo Electrizante", cat="lubricantes",
         sub="Electrizantes / Vibradores líquidos", catalog="EB2", page=26, price=39999, size="30 ml",
         tags=["electrizante", "saborizado"],
         desc="Lubricantes electrizantes en sabores exóticos que ofrecen una sensación cálida y "
              "vibrante para intensificar cada momento de intimidad.",
         variants=[dict(sku="11398", label="Lychee", type="sabor"),
                   dict(sku="11399", label="Mango", type="sabor")]),
    dict(ref="11400", name="Lubricante Íntimo Electrizante Crema de Whisky", cat="lubricantes",
         sub="Electrizantes / Vibradores líquidos", catalog="EB2", page=27, price=39999, size="30 ml",
         tags=["electrizante", "crema de whisky"],
         desc="Lubricante íntimo electrizante sabor crema de whisky que enciende cada momento."),
    dict(ref="11172", name="Body Paint Chocolate", cat="lubricantes", sub="Saborizados y comestibles",
         catalog="EB2", page=27, price=24999, tags=["body paint", "chocolate", "comestible"],
         desc="Pintura corporal comestible de chocolate para pintar, saborear y jugar sobre la piel."),
    dict(ref="11173", name="Lubricante Ice Cream Crema Besable", cat="lubricantes",
         sub="Saborizados y comestibles", catalog="EB2", page=27, price=24999, tags=["crema besable", "comestible"],
         desc="Crema besable tipo helado para disfrutar de un juego previo dulce y sensual."),
    dict(ref="10130", name="Ejaculation Delay Sen", brand="Sen", cat="lubricantes", sub="Retardantes",
         catalog="EB2", page=28, price=36999, size="15 ml", tags=["retardante", "control"],
         desc="Producto retardante para prolongar los momentos de placer y controlar tus sensaciones; "
              "no dejes que el juego termine antes de empezar."),
    dict(ref="11627", name="Lubricante Desensibilizante Garganta Profunda", cat="lubricantes",
         sub="Especiales", catalog="EB2", page=28, price=44999, size="15 ml", badges=["nuevo"],
         tags=["desensibilizante", "garganta profunda", "sexo oral"],
         desc="Spray desensibilizante que relaja suavemente la garganta y reduce la sensibilidad para "
              "un disfrute más profundo y confortable."),
    dict(ref="11622", name="Lubricante Anal Electrizante", cat="lubricantes",
         sub="Electrizantes / Vibradores líquidos", catalog="EB2", page=29, price=44999, size="30 ml",
         badges=["nuevo"], tags=["anal", "electrizante"],
         desc="Lubricante anal electrizante que añade toques de emoción y excitación para vivir "
              "momentos únicos."),
    dict(ref="11626", name="Lubricante Tequila Electrizante Edición Especial", cat="lubricantes",
         sub="Electrizantes / Vibradores líquidos", catalog="EB2", page=29, price=44999, size="30 ml",
         badges=["nuevo"], tags=["electrizante", "tequila", "edición especial"],
         desc="Edición especial de lubricante electrizante sabor tequila para electrizar tus sentidos."),
    dict(ref="10693", name="Lubricante Íntimo Natural", cat="lubricantes", sub="Naturales y neutros",
         catalog="EB2", page=30, price=62999, size="500 ml", tags=["natural", "base agua", "familiar", "500ml"],
         desc="Lubricante a base de agua para uso diario, seguro con preservativos y juguetes; apto "
              "para embarazadas en posparto o menopausia. Presentación familiar de 500 ml."),
    dict(ref="10689", name="Lubricante Neutro", cat="lubricantes", sub="Naturales y neutros",
         catalog="EB2", page=30, price=34999, size="75 ml", tags=["neutro", "base agua"],
         desc="Lubricante neutro a base de agua para el día a día."),
    dict(ref="10690", name="Lubricante Íntimo Milk", cat="lubricantes", sub="Especiales", catalog="EB2",
         page=31, price=49999, size="250 ml", tags=["fantasía", "textura semen"],
         desc="Lubricante íntimo formulado con textura y color similar al semen: viscoso, blanco y "
              "cremoso."),
    dict(ref="10691", name="Lubricante Íntimo Cum", cat="lubricantes", sub="Especiales", catalog="EB2",
         page=31, price=46999, size="250 ml", tags=["fantasía", "eyaculación femenina", "piel sensible"],
         desc="Lubricante que simula la eyaculación femenina y cambia de color al frotarse; nueva "
              "fórmula para piel sensible."),
    dict(name="Gel Lubricante Íntimo Natural Elixir", brand="Elixir", cat="lubricantes",
         sub="Naturales y neutros", catalog="EB2", page=32, price=36999, tags=["natural", "gel", "base agua"],
         desc="Gel lubricante a base de agua que realza la comodidad y la naturalidad de tus momentos "
              "íntimos manteniendo una hidratación óptima.",
         variants=[dict(sku="11027", label="Sachet 5 ml", type="tamaño", price=3999, size="5 ml"),
                   dict(sku="11025", label="Tubo 100 ml", type="tamaño", price=36999, size="100 ml"),
                   dict(sku="11026", label="500 ml", type="tamaño", price=69999, size="500 ml")]),
    dict(ref="10316", name="Lubricante Íntimo Natural 20 ml", cat="lubricantes", sub="Naturales y neutros",
         catalog="EB2", page=33, price=17999, size="20 ml", tags=["natural"],
         desc="Lubricante íntimo natural; aplicar directamente en las zonas deseadas y esparcir "
              "suavemente para disfrutar de grandes sensaciones."),
    dict(ref="10317", name="Lubricante Íntimo Frío 20 ml", cat="lubricantes", sub="Efecto frío",
         catalog="EB2", page=33, price=17999, size="20 ml", tags=["efecto frío", "masaje"],
         desc="Lubricante íntimo con refrescante sensación de frío, ideal para masajes y juegos "
              "eróticos que intensifican las sensaciones."),
    dict(ref="10685", name="Perlas Íntimas x3", cat="bienestar", sub="Perlas y esferas", catalog="EB2",
         page=33, price=17999, size="3.6 ml c/u", tags=["perlas", "aceite lubricante", "tropical"],
         desc="Perlas que explotan al contacto con el calor y la humedad corporal liberando su aceite "
              "lubricante; sabores tropicales."),
    dict(ref="10152", name="Dilatador Anal Corpolub", cat="lubricantes", sub="Anales", catalog="EB2",
         page=34, price=17999, size="15 ml", tags=["anal", "dilatador", "desensibilizante"],
         desc="Lubricante con efecto desensibilizante para una experiencia cómoda y sin dolor; "
              "aplícalo 10 minutos antes del uso."),
    dict(ref="10151", name="Multiorgasmo Up", cat="lubricantes", sub="Multiorgásmicos", catalog="EB2",
         page=34, price=17999, size="5 ml", tags=["multiorgasmo", "sensibilidad"],
         desc="Gel que aumenta la sensibilidad de las zonas íntimas para explorar un éxtasis renovado; "
              "aplicación discreta."),

    # ===================== EB2 — Juegos / Dados =====================
    dict(ref="11593", name="La Ruleta Erótica 3 Play", cat="juegos", sub="Juegos de mesa y cartas",
         catalog="EB2", page=35, price=36999, badges=["nuevo"], tags=["juego", "ruleta", "3 en 1"],
         desc="Juego erótico de mesa 3 en 1 (posiciones, penitencias, prendas): escoge tu licor, haz "
              "girar la ruleta y la imaginación para un momento inolvidable."),
    dict(ref="11638", name="Parqués Erótico", cat="juegos", sub="Juegos de mesa y cartas", catalog="EB2",
         page=35, price=49999, badges=["nuevo"], tags=["juego", "parqués", "picante"],
         desc="Parqués con picante: cada vez que un jugador va a la cárcel toma una tarjeta y responde "
              "una pregunta caliente; si miente, penitencia."),
    dict(ref="10354", name="Toma Todo Posiciones y Condiciones", cat="juegos", sub="Dados", catalog="EB2",
         page=36, price=4999, tags=["juego", "toma todo"],
         desc="Juego tipo toma todo con posiciones y condiciones para animar la noche en pareja."),
    dict(ref="10700", name="Dados x2 Amart Negros", cat="juegos", sub="Dados", catalog="EB2", page=36,
         price=9999, tags=["dados", "pareja"],
         desc="Set de 2 dados eróticos Amart en caja para jugar en pareja."),
    dict(ref="10701", name="Dados Penitencia x3 Amart", cat="juegos", sub="Dados", catalog="EB2", page=36,
         price=4999, tags=["dados", "penitencia"],
         desc="Set de 3 dados de penitencia Amart en caja."),
    dict(ref="10699", name="Dados x2 Amart Fluorescentes", cat="juegos", sub="Dados", catalog="EB2",
         page=36, price=5999, tags=["dados", "fluorescente"],
         desc="Set de 2 dados eróticos fluorescentes Amart en caja."),
    dict(ref="11422", name="Juego Kamasutra", cat="juegos", sub="Juegos de mesa y cartas", catalog="EB2",
         page=37, price=69999, tags=["juego", "kamasutra", "pareja"],
         desc="Juego fantasioso para conectar de forma divertida con tu pareja añadiendo emoción, "
              "picardía y complicidad."),
    dict(ref="11036", name="Juego Cincuenta Sombras de Grey", cat="juegos", sub="Juegos de mesa y cartas",
         catalog="EB2", page=37, price=69999, tags=["juego", "fantasía", "pareja"],
         desc="Juego inspirado en Cincuenta Sombras para experimentar con emoción y complicidad en pareja."),

    # ===================== EB2 — Juguetes =====================
    dict(ref="10526", name="Anillo Vibrador Testículos", cat="juguetes", sub="Anillos para pene",
         catalog="EB2", page=38, price=16999, tags=["anillo", "vibrador"],
         desc="Anillo vibrador con estimulación extra que eleva la experiencia al máximo, con orejas "
              "suaves para llegar a las áreas sensibles externas."),
    dict(ref="10702", name="Anillo Vibrador Zeus", cat="juguetes", sub="Anillos para pene", catalog="EB2",
         page=38, price=59999, tags=["anillo", "vibrador", "bala removible"],
         desc="Anillo vibrador con bala removible para explorar y estimular otras áreas del cuerpo; "
              "transforma cada encuentro en algo inolvidable."),
    dict(ref="11031", name="Anillo para el Pene Delfín", cat="juguetes", sub="Anillos para pene",
         catalog="EB2", page=38, price=99999, size="9,5 cm", tags=["anillo", "vibrador", "10 funciones", "usb"],
         desc="Anillo vibrador con forma de delfín, 10 funciones de vibración, silicona segura, "
              "impermeable y recargable por USB. Largo 9,5 cm."),
    dict(ref="11018", name="Anillo Vibrador Ciro", cat="juguetes", sub="Anillos para pene", catalog="EB2",
         page=39, price=39999, size="9 cm", tags=["anillo", "vibrador", "silicona flexible"],
         desc="Anillo vibrador de silicona flexible en colores morado y rosado; 1 modo de vibración, "
              "9 cm de largo."),
    dict(ref="11006", name="Anillo Vibrador y Consolador Frodo", cat="juguetes", sub="Anillos para pene",
         catalog="EB2", page=39, price=104999, size="15,2 cm", tags=["anillo", "consolador", "7 velocidades", "silicona médica"],
         desc="Anillo vibrador y consolador que dilata la zona anal, 7 velocidades de vibración, "
              "silicona médica; tipo conejo, consolador anatómico. Colores rojo y negro."),
    dict(ref="10957", name="Vibrador Funday", cat="juguetes", sub="Vibradores", catalog="EB2", page=40,
         price=56999, tags=["vibrador", "2 en 1", "bala"],
         desc="Doble diversión: úsalo como vibrador o quítale la funda y úsalo como bala vibradora."),
    dict(ref="10328", name="Vibrador Pandora", cat="juguetes", sub="Vibradores", catalog="EB2", page=40,
         price=39999, tags=["vibrador", "velocidad graduable"],
         desc="Vibrador de un modo de vibración con velocidad graduable; se puede usar con o sin funda. "
              "Requiere 2 pilas AAA (no incluidas)."),
    dict(ref="10329", name="Huevo Masturbador Masculino", cat="juguetes", sub="Masturbadores masculinos",
         catalog="EB2", page=41, price=29999, tags=["masturbador", "huevo", "impermeable", "discreto"],
         desc="Huevo masturbador suave, flexible e impermeable, con texturas variadas; empaque "
              "compacto y discreto ideal para llevar."),
    dict(ref="11086", name="Vagina Linterna 7 Funciones", cat="juguetes", sub="Masturbadores masculinos",
         catalog="EB2", page=41, price=139999, tags=["masturbador", "7 funciones"],
         desc="Masturbador tipo linterna con 7 funciones diseñado para liberar y satisfacer tus deseos "
              "más íntimos con variadas maneras de exploración."),
    dict(name="Funda para el Pene", cat="juguetes", sub="Fundas para pene", catalog="EB2", page=42,
         price=29999, tags=["funda", "texturizada", "reutilizable"],
         desc="Fundas texturizadas reutilizables que aumentan la estimulación; algunas con vibración. "
              "No son anticonceptivos, se colocan como un condón.",
         variants=[dict(sku="10707", label="Perseo (vibración, 12 cm)", type="modelo", price=39999),
                   dict(sku="10706", label="Apolo (silicona flexible con vibración)", type="modelo", price=26999),
                   dict(sku="10705", label="Hades", type="modelo", price=24999),
                   dict(sku="11103", label="Dragon", type="modelo", price=29999)]),
    dict(ref="10485", name="Huevo Mini Gladme", brand="Gladme", cat="juguetes", sub="Huevos vibradores",
         catalog="EB2", page=43, price=19999, tags=["huevo", "1 velocidad"],
         desc="Huevo vibrador de una velocidad y un solo modo de vibración; requiere 2 pilas AAA (no incluidas)."),
    dict(ref="10484", name="Bala Punto G Gladme", brand="Gladme", cat="juguetes", sub="Balas vibradoras",
         catalog="EB2", page=43, price=19999, tags=["bala", "punto g"],
         desc="Mini vibrador estimulador de punto G con un solo modo de vibración; requiere 1 pila AA "
              "(no incluida)."),
    dict(ref="10703", name="Huevo Vibrador Annie", cat="juguetes", sub="Huevos vibradores", catalog="EB2",
         page=44, price=62999, tags=["huevo", "control remoto", "10 modos", "punto g"],
         desc="Huevo vibrador a control remoto con 10 modos de vibración; silencioso, flexible y "
              "potente para estimular el punto G."),
    dict(ref="11550", name="Huevo Inalámbrico Murney", cat="juguetes", sub="Huevos vibradores",
         catalog="EB2", page=44, price=84999, size="3,6 x 9,2 cm", tags=["huevo", "inalámbrico", "10 modos", "impermeable"],
         desc="Huevo inalámbrico en silicona ABS con 10 modos de vibración, diseño ergonómico y "
              "grabados para mejor estimulación; silencioso e impermeable."),
    dict(ref="10704", name="Huevo Vibrador Gemini", cat="juguetes", sub="Huevos vibradores", catalog="EB2",
         page=44, price=81999, tags=["huevo", "control remoto", "10 modos"],
         desc="Huevo vibrador operado a control remoto con 10 modos de vibración; incluye batería del "
              "control (huevo requiere 2 pilas AAA)."),
    dict(ref="11632", name="Huevo Inalámbrico Lilo que se Calienta", brand="Lilo", cat="juguetes",
         sub="Huevos vibradores", catalog="EB2", page=45, price=144999, badges=["nuevo"],
         tags=["huevo", "temperatura", "10 modos", "usb", "silicona biomédica"],
         desc="Huevo inalámbrico innovador con temperatura: se calienta para sensaciones más intensas; "
              "control remoto, 10 modos de vibración, carga USB y silicona ABS."),
    dict(ref="11630", name="Huevo Gladme de Baterías Sencillo", brand="Gladme", cat="juguetes",
         sub="Huevos vibradores", catalog="EB2", page=45, price=29999, badges=["nuevo"],
         tags=["huevo", "grabados", "cordón"],
         desc="Huevo de forma alargada con patrones grabados; funciona con 2 baterías AAA y ofrece un "
              "modo de vibración. Fácil de manejar y limpiar gracias a su cordón."),
    dict(ref="11633", name="Huevo Inalámbrico Born to Feeling FCT-785", cat="juguetes",
         sub="Huevos vibradores", catalog="EB2", page=45, price=134999, badges=["nuevo"],
         tags=["huevo", "inalámbrico", "10 modos", "usb", "silicona ABS"],
         desc="Huevo inalámbrico de diseño elegante con 10 modos de vibración controlados a distancia, "
              "carga USB y textura grabada para mejor sensación."),
    dict(ref="11635", name="Mini Masajeador Aselia FCT-765", cat="juguetes", sub="Vibradores",
         catalog="EB2", page=46, price=104999, badges=["nuevo"],
         tags=["vibrador", "recargable", "10 modos", "punto g"],
         desc="Vibrador de estimulación interna y externa con múltiples velocidades y patrones, forma "
              "curva y textura suave; recargable USB, silencioso, 10 modos."),
    dict(ref="11634", name="Vibrador Cerdito Recargable", cat="juguetes", sub="Succionadores",
         catalog="EB2", page=46, price=104999, badges=["nuevo"], tags=["succionador", "lengua", "6 modos", "usb"],
         desc="Cerdito que 'lame' con 6 modos, para una estimulación increíble; silicona ABS, carga "
              "USB (tiempo de carga 69 min)."),
    dict(ref="10712", name="Vibrador Hitachi Jay", cat="juguetes", sub="Vibradores", catalog="EB2",
         page=47, price=229999, tags=["masajeador", "hitachi", "doble propósito"],
         desc="Masajeador tipo Hitachi de doble propósito, ideal para masajes relajantes y para una "
              "experiencia íntima, con modos de vibración ajustables."),
    dict(ref="11666", name="Huevo Vibrador con App FCT-814", cat="juguetes", sub="Huevos vibradores",
         catalog="EB2", page=48, price=169999, size="140x75x40", badges=["premium"],
         tags=["huevo", "app", "a distancia", "9 patrones", "usb"],
         desc="Huevo vibrador con control por app y a distancia, 9 patrones de vibración, silicona "
              "biomédica ABS, carga USB y resistente a salpicaduras. Colores surtidos."),
    dict(ref="11631", name="Vibrador Lotus Rose Majestic", cat="juguetes", sub="Vibradores", catalog="EB2",
         page=49, price=309999, badges=["nuevo", "premium"],
         tags=["vibrador", "rosa", "lengua", "bala", "2 motores", "IPX7"],
         desc="Vibrador de dos extremos: bala vibradora en uno y una rosa con lengua para simular sexo "
              "oral en el otro, con motores independientes; carga USB magnética, 10 modos por extremo, IPX7."),
    dict(ref="11636", name="Vibrador Masajeador Mini Sex Toy FCT-536", cat="juguetes", sub="Vibradores",
         catalog="EB2", page=50, price=159999, size="152 mm", badges=["nuevo"],
         tags=["masajeador", "hitachi mini", "28 modos", "usb", "resistente al agua"],
         desc="Mini masajeador tipo Hitachi con 28 modos de vibración, recargable USB, silicona ABS y "
              "resistente al agua; 36 mm de ancho y 152 mm de largo."),
    dict(ref="11637", name="Vibrador Masajeador We-Love Doble Función FCT-827", cat="juguetes",
         sub="Vibradores", catalog="EB2", page=50, price=124999, badges=["nuevo"],
         tags=["masajeador", "hitachi", "10 modos", "silicona médica", "usb"],
         desc="Masajeador tipo Hitachi de doble función con potente motor, 10 modos de vibración, "
              "silicona médica, resistente al agua y recargable USB; cabezal para masajes y mango multipropósito."),
    dict(ref="11407", name="Bala Vibradora Diamond Princess", cat="juguetes", sub="Balas vibradoras",
         catalog="EB2", page=51, price=39999, tags=["bala", "compacta", "discreta"],
         desc="Bala vibradora pequeña, potente y versátil, fácil de llevar y guardar para disparar el "
              "placer con discreción."),
    dict(ref="11408", name="Masajeador Ares", cat="juguetes", sub="Balas vibradoras", catalog="EB2",
         page=51, price=49999, tags=["masajeador", "compacto"],
         desc="Masajeador compacto y potente, versátil a la hora de estimular las zonas íntimas."),
    dict(ref="11409", name="Bala Vibradora Larga Cromada", cat="juguetes", sub="Balas vibradoras",
         catalog="EB2", page=51, price=29999, tags=["bala", "cromada"],
         desc="Bala vibradora larga cromada, discreta y potente para estimular con precisión."),
    dict(ref="11412", name="Bolas Estimulantes Kegel Balls", cat="juguetes", sub="Bolas chinas y Kegel",
         catalog="EB2", page=52, price=39999, tags=["kegel", "suelo pélvico", "salud íntima"],
         desc="Bolas Kegel que fortalecen el suelo pélvico, previenen la incontinencia y mejoran la "
              "confianza, la salud íntima y la capacidad muscular."),
    dict(ref="10112", name="Bolas Duotone en Silicona", cat="juguetes", sub="Bolas chinas y Kegel",
         catalog="EB2", page=52, price=49999, tags=["bolas chinas", "silicona", "orgasmos"],
         desc="Bolas chinas Duotone en silicona para orgasmos intensos y fortalecimiento del suelo pélvico."),
    dict(ref="10750", name="Vibrador Top Real Light", cat="juguetes", sub="Consoladores y dildos",
         catalog="EB2", page=53, price=56999, size="22,5 cm", tags=["vibrador", "realista", "venas"],
         desc="Vibrador realista extra suave en TPR, lleno de venas y con glande pronunciado; 21,5 cm "
              "de largo y 4 cm de diámetro. Funciona con pilas AA (no incluidas)."),
    dict(ref="11021", name="Vibrador Kanon", cat="juguetes", sub="Consoladores y dildos", catalog="EB2",
         page=53, price=59999, size="22,5 cm", tags=["vibrador", "realista", "principiantes"],
         desc="Vibrador realista en material suave al tacto, tamaño ideal para todos los gustos; "
              "requiere baterías AA."),
    dict(ref="11639", name="Dildo Vertebrado con Chupa Realista 8.1", cat="juguetes",
         sub="Consoladores y dildos", catalog="EB2", page=54, price=119999, size="8.1\"", badges=["nuevo"],
         tags=["dildo", "vertebrado", "ventosa", "realista", "testículos"],
         desc="Dildo vertebrado con textura tipo piel ultrarrealista, 8.1'' de longitud, con "
              "testículos y chupa para adherirse a superficies planas."),
    dict(ref="11640", name="Vibrador Realista Vertebrado Pellizcable con Chupa 9.4 FCT-883",
         cat="juguetes", sub="Consoladores y dildos", catalog="EB2", page=54, price=149999, size="9.4\"",
         badges=["nuevo"], tags=["vibrador", "vertebrado", "ventosa", "realista", "potencia gradual"],
         desc="Vibrador ultrarrealista vertebrado con doble capa para sensación de piel real, cabeza "
              "pronunciada, chupa para superficies planas y potencia gradual."),
    dict(ref="11414", name="Vibrador Snake", cat="juguetes", sub="Vibradores", catalog="EB2", page=55,
         price=99999, size="18 cm", tags=["vibrador", "doble estimulación", "lengua", "silicona biomédica"],
         desc="Vibrador de doble estimulación con simulación de lengua, silicona biomédica suave, "
              "3 modos de vibración y resistente a salpicaduras; 18 cm de largo."),
    dict(ref="11629", name="Vibrador Recargable Estimulador Clitorial & Punto G FCT-736", cat="juguetes",
         sub="Vibradores", catalog="EB2", page=55, price=129999, badges=["nuevo"],
         tags=["vibrador", "clítoris", "punto g", "10 modos", "usb", "silicona ABS"],
         desc="Vibrador recargable que se adapta al contorno del cuerpo con 10 modos de vibración para "
              "una estimulación profunda y precisa; silicona ABS, carga USB."),
    dict(ref="11418", name="Masturbador Smith", cat="juguetes", sub="Consoladores y dildos", catalog="EB2",
         page=56, price=59999, size="20 cm", tags=["consolador", "ventosa", "TPE", "manos libres"],
         desc="Consolador de textura suave y realista con ventosa para disfrutar con manos libres en "
              "cualquier superficie lisa; TPE, 20 cm de largo."),
    dict(ref="11416", name="Masturbador Ever", cat="juguetes", sub="Consoladores y dildos", catalog="EB2",
         page=57, price=69999, tags=["dildo", "colores surtidos"],
         desc="Dildo para explorar la sexualidad y descubrir nuevas formas de placer; colores surtidos."),
    dict(ref="11417", name="Masturbador Alvin", cat="juguetes", sub="Consoladores y dildos", catalog="EB2",
         page=57, price=42999, tags=["dildo", "colores surtidos"],
         desc="Dildo siempre listo para buscar emoción; colores surtidos."),
    dict(name="Vibrador Anibal con Chupa", cat="juguetes", sub="Consoladores y dildos", catalog="EB2",
         page=58, price=69999, tags=["vibrador", "ventosa", "autoexploración"],
         desc="Vibrador con chupa para romper estigmas y vivir la sexualidad de forma segura y "
              "saludable; disponible en negro y color piel.",
         variants=[dict(sku="11424", label="Negro", type="color"),
                   dict(sku="11423", label="Piel", type="color")]),
    dict(ref="10716", name="Plug Anal Pimpo Bolas Chinas", cat="juguetes", sub="Plugs y juguetes anales",
         catalog="EB2", page=59, price=24999, size="27 cm insertable", tags=["plug", "bolas chinas", "TPE", "principiantes"],
         desc="Bolas anales Pimpo para una adaptación gradual y placentera; apto para principiantes y "
              "expertos, en TPE. Longitud insertable 27 cm."),
    dict(ref="11430", name="Kit Anal Dreams", cat="juguetes", sub="Plugs y juguetes anales", catalog="EB2",
         page=59, price=69999, tags=["kit anal", "TPE", "progresivo", "colores surtidos"],
         desc="Kit anal cómodo y fácil de limpiar, diseñado para una experiencia placentera y "
              "progresiva; material TPE, colores surtidos."),
    dict(ref="11085", name="Arnés Female Doble Penetración", cat="juguetes", sub="Arneses", catalog="EB2",
         page=60, price=169999, tags=["arnés", "doble penetración", "correas ajustables"],
         desc="Arnés con dildo frontal e interno desmontables y correas ajustables a cualquier talla. "
              "Colores disponibles: Piel (frontal 14 cm) y Lila/Morado (frontal 16 cm), interno 9 cm.",
         variants=[dict(sku="11085-PIEL", label="Piel", type="color"),
                   dict(sku="11085-LILA", label="Lila", type="color")]),
    dict(ref="11427", name="Plug Cola Cedric", cat="juguetes", sub="Plugs y juguetes anales", catalog="EB2",
         page=61, price=39999, tags=["plug", "cola", "roleplay", "cosplay", "colores surtidos"],
         desc="Cola con plug metálico incorporado, ideal para juegos de rol, fetichistas y cosplay; "
              "colores surtidos."),
    dict(ref="11428", name="Plug Pompón Colita de Conejo", cat="juguetes", sub="Plugs y juguetes anales",
         catalog="EB2", page=61, price=59999, tags=["plug", "colita conejo", "roleplay", "colores surtidos"],
         desc="Plug con pompón de colita de conejo para juegos de rol y cosplay; colores surtidos."),
    dict(ref="11429", name="Kit Plug Cola de Zorro y Orejas", cat="juguetes", sub="Plugs y juguetes anales",
         catalog="EB2", page=61, price=79999, tags=["kit", "plug", "cola de zorro", "orejas", "cosplay"],
         desc="Kit con plug cola de zorro y orejas a juego para juegos de rol, fetichistas y cosplay; "
              "colores surtidos."),
    dict(ref="11022", name="Vibrador Bala Interactiva con App Phoenix Neo 2", brand="Svakom",
         cat="juguetes", sub="Balas vibradoras", catalog="EB2", page=64, price=494999,
         badges=["nuevo", "premium"], tags=["bala", "app", "control remoto", "webcam", "11 frecuencias", "carga magnética"],
         desc="Bala vibradora interactiva Svakom Phoenix Neo 2 con control inteligente desde la app y "
              "acceso remoto para el placer a distancia; apta para webcam, 11 frecuencias, luz LED "
              "sincronizada, impermeable y carga magnética."),

    # ===================== EB2 — BDSM / Fetish =====================
    dict(ref="11433", name="Sujetador Fetish", cat="bdsm", sub="Kits fetish", catalog="EB2", page=62,
         price=49999, tags=["fetish", "sumisión"],
         desc="Sujetador fetish diseñado para satisfacer tus deseos más atrevidos con estilo y "
              "seguridad, invitándote a explorar nuevas dimensiones de placer y sumisión."),
    dict(ref="11437", name="Esposas Fern Negro", cat="bdsm", sub="Esposas", catalog="EB2", page=63,
         price=29999, tags=["esposas", "fetish"],
         desc="Esposas para someter a tu amante y explorar tus fantasías fetichistas."),
    dict(ref="11436", name="Esposas Sado Peluche", cat="bdsm", sub="Esposas", catalog="EB2", page=63,
         price=32999, tags=["esposas", "peluche", "sado"],
         desc="Esposas sado con peluche para juegos de dominación cómodos y sensuales."),
    dict(name="Paleta Sado", cat="bdsm", sub="Látigos y paletas", catalog="EB2", page=63, price=39999,
         tags=["paleta", "nalgadas", "sado"],
         desc="Paletas de nalgadas para darle una buena lección a tu amante.",
         variants=[dict(sku="11438", label="Soxo", type="modelo"),
                   dict(sku="11439", label="Con Taches", type="modelo")]),

    # ===================== MALLAS — Mallas Cortas =====================
    dict(ref="11713", name="Malla Eva", cat="lenceria", sub="Mallas cortas", catalog="MALLAS", page=3,
         price=29999, tags=["body", "malla", "semitransparente", "negro"],
         desc="Malla de líneas limpias que resalta la silueta con sensualidad discreta y sofisticada; "
              "tejido elástico semitransparente con detalle sutil en el escote."),
    dict(ref="11714", name="Malla Naia", cat="lenceria", sub="Mallas cortas", catalog="MALLAS", page=3,
         price=29999, tags=["body", "malla", "aberturas frontales", "negro"],
         desc="Malla audaz que combina sensualidad y diseño geométrico con aberturas frontales de "
              "entramado decorativo y ajuste ceñido que realza el busto y la cintura."),
    dict(ref="11715", name="Malla Lady", cat="lenceria", sub="Mallas cortas", catalog="MALLAS", page=4,
         price=29999, tags=["body", "malla", "textura animal", "mangas largas", "negro"],
         desc="Malla tipo vestido con textura animal que transmite fuerza, deseo y elegancia salvaje; "
              "mangas ajustadas que estilizan los brazos."),
    dict(ref="11716", name="Malla Tayra", cat="lenceria", sub="Mallas cortas", catalog="MALLAS", page=4,
         price=29999, tags=["body", "malla", "encaje geométrico", "mangas largas", "negro"],
         desc="Pieza sofisticada de encaje geométrico con transparencias y mangas largas que aportan "
              "elegancia y contraste."),
    dict(name="Malla Tessa", cat="lenceria", sub="Mallas cortas", catalog="MALLAS", page=6, price=29999,
         tags=["body", "malla", "red", "mangas largas"],
         desc="Body de malla tipo red con mangas largas y escote amplio; look sensual y versátil, ideal "
              "como pieza principal o complemento de outfit.",
         variants=[dict(sku="11719", label="Negro", type="color"),
                   dict(sku="11717", label="Fucsia", type="color"),
                   dict(sku="11718", label="Verde", type="color")]),
    dict(ref="11720", name="Malla Yunara", cat="lenceria", sub="Mallas cortas", catalog="MALLAS", page=6,
         price=29999, tags=["body", "malla", "halter", "encaje", "floral", "negro"],
         desc="Malla halter de encaje y red que realza el cuerpo con equilibrio entre elegancia y "
              "sensualidad; tejido elástico con patrón floral y transparencias seductoras."),
    dict(ref="11721", name="Malla Nalira", cat="lenceria", sub="Mallas cortas", catalog="MALLAS", page=8,
         price=29999, tags=["vestido", "malla", "textura animal", "halter", "negro"],
         desc="Malla tipo vestido con textura animal que transmite fuerza, deseo y elegancia salvaje; "
              "diseño halter que estiliza hombros y cuello, con patrón animal y transparencias estratégicas."),
    dict(ref="11722", name="Malla Velina", cat="lenceria", sub="Mallas cortas", catalog="MALLAS", page=8,
         price=29999, tags=["vestido", "malla", "red amplia", "negro"],
         desc="Malla negra semitransparente tipo vestido de red amplia con ajuste elástico al cuerpo; "
              "trama abierta que da una sensación ligera y fresca en la piel."),
    dict(ref="11723", name="Malla Zahira", cat="lenceria", sub="Mallas cortas", catalog="MALLAS", page=9,
         price=29999, tags=["vestido", "malla", "strapless", "negro"],
         desc="Malla strapless que envuelve el cuerpo con una sensualidad limpia y provocadora; diseño "
              "sin tirantes con ajuste cómodo y seguro y tejido de malla amplia que define la figura."),
    dict(name="Malla Jadel", cat="lenceria", sub="Mallas cortas", catalog="MALLAS", page=9, price=29999,
         tags=["vestido", "malla", "red", "minivestido"],
         desc="Clásico minivestido de malla de red, pieza versátil y atemporal de la lencería; el "
              "patrón de red ayuda a definir y estilizar la silueta.",
         variants=[dict(sku="11724", label="Negro", type="color"),
                   dict(sku="11725", label="Verde", type="color"),
                   dict(sku="11726", label="Fucsia", type="color")]),

    # ===================== MALLAS — Mallas Enteras =====================
    dict(ref="11727", name="Malla Musa (Catsuit con Liguero)", cat="lenceria", sub="Mallas enteras",
         catalog="MALLAS", page=12, price=29999, tags=["catsuit", "malla", "halter", "liguero", "medias", "negro"],
         desc="Malla enteriza catsuit negra con escote halter, red semitransparente y cortes laterales "
              "circulares; incluye liguero integrado conectado a medias en red, efecto segunda piel. No incluye pantie."),
    dict(ref="11728", name="Malla Swin", cat="lenceria", sub="Mallas enteras", catalog="MALLAS", page=13,
         price=29999, tags=["bodystocking", "catsuit", "red amplia", "negro"],
         desc="Malla enteriza negra tipo catsuit con patrón de red amplia, sin costuras visibles y "
              "ajuste al cuerpo; patrón de red grande que permite comodidad, movilidad y un look ligero."),
    dict(ref="11729", name="Malla Musa (Tiras Frontales)", cat="lenceria", sub="Mallas enteras",
         catalog="MALLAS", page=13, price=29999, tags=["bodystocking", "malla", "tiras frontales", "liguero", "negro"],
         desc="Malla enteriza negra con tiras frontales decorativas y ajuste ceñido; con liguero y "
              "medias, mantiene el ajuste sin deslizarse. No incluye pantie."),
    dict(ref="11730", name="Malla Coquette", cat="lenceria", sub="Mallas enteras", catalog="MALLAS",
         page=14, price=29999, tags=["bodystocking", "malla", "off-shoulder", "liguero", "negro"],
         desc="Malla enteriza negra semitransparente con escote off-shoulder y abertura frontal "
              "inferior; cortes frontales y laterales que resaltan la figura. No incluye pantie."),
    dict(ref="11731", name="Malla Ivony", cat="lenceria", sub="Mallas enteras", catalog="MALLAS", page=14,
         price=29999, tags=["bodystocking", "malla", "animal print", "negro"],
         desc="Vestido/bodystocking en red negra con diseño ajustado y patrón animal que realza las "
              "curvas con un efecto sensual y moderno; tejido en red elástica que se ajusta al cuerpo."),
    dict(name="Malla Tina", cat="lenceria", sub="Mallas enteras", catalog="MALLAS", page=16, price=29999,
         tags=["bodystocking", "catsuit", "halter", "cortes laterales"],
         desc="Malla enteriza con escote halter y cortes laterales, ajuste sin costuras y estilo "
              "sensual; se estira para adaptarse al cuerpo y recupera su forma sin deformarse.",
         variants=[dict(sku="11732", label="Negro", type="color"),
                   dict(sku="11733", label="Verde", type="color"),
                   dict(sku="11734", label="Fucsia", type="color")]),

    # ===================== MALLAS — Dos Piezas =====================
    dict(ref="11735", name="Malla Dance (Short)", cat="lenceria", sub="Mallas dos piezas",
         catalog="MALLAS", page=19, price=29999, tags=["short", "malla", "red amplia", "negro"],
         desc="Short de malla negra con patrón de red amplia y ajuste elástico al cuerpo; diseño "
              "abierto que permite movilidad y sensación ligera en la piel."),
    dict(ref="11736", name="Malla Twerla (Set Top + Short)", cat="lenceria", sub="Mallas dos piezas",
         catalog="MALLAS", page=19, price=29999, tags=["set", "top", "short", "malla", "red amplia", "negro"],
         desc="Set de top y short en malla negra con red amplia y ajuste elástico al cuerpo; fit ceñido "
              "que acompaña el movimiento, ligero y visualmente llamativo, ideal para combinar."),

    # ===================== MALLAS — Medias =====================
    dict(ref="11737", name="Media Lunel", cat="lenceria", sub="Medias", catalog="MALLAS", page=21,
         price=24999, tags=["media", "catsuit", "red", "liguero", "negro"],
         desc="Malla catsuit negra para piernas con patrón tipo red y cortes frontales, ajuste al "
              "cuerpo sin costuras visibles; diseño abierto que resalta la silueta. No incluye pantie."),
    dict(ref="11738", name="Media Marlen", cat="lenceria", sub="Medias", catalog="MALLAS", page=21,
         price=24999, tags=["media", "red", "cintura elástica", "negro"],
         desc="Malla negra para piernas con trama tipo red, diseño ajustado y cintura elástica; sujeta "
              "bien en los muslos sin deslizarse. No incluye pantie."),
    dict(ref="11739", name="Media Nia", cat="lenceria", sub="Medias", catalog="MALLAS", page=22,
         price=24999, tags=["media", "red", "liguero integrado", "fucsia"],
         desc="Malla fucsia para piernas con diseño tipo red y liguero integrado, ajuste ceñido sin "
              "costuras; banda firme que mantiene la prenda en su lugar. No incluye pantie."),
    dict(ref="11740", name="Media Thaly", cat="lenceria", sub="Medias", catalog="MALLAS", page=22,
         price=24999, tags=["media", "corazones", "cintura elástica", "negro"],
         desc="Malla negra para piernas con detalles en forma de corazón, cintura elástica y look "
              "coqueto y sensual; banda flexible que se ajusta sin marcar ni deslizarse."),
    dict(ref="11741", name="Media Maelle", cat="lenceria", sub="Medias", catalog="MALLAS", page=23,
         price=24999, tags=["media", "red", "lazo decorativo", "negro"],
         desc="Malla negra para piernas tipo red con lazo decorativo en los muslos, sin costuras; se "
              "adapta al muslo sin deslizarse y permite ventilación y movimiento cómodo. No incluye pantie."),
    dict(ref="11742", name="Media Melan", cat="lenceria", sub="Medias", catalog="MALLAS", page=23,
         price=24999, tags=["media", "enteriza", "laterales abiertos", "halter", "negro"],
         desc="Malla enteriza negra con laterales abiertos y escote halter, ajuste segunda piel; alta "
              "elasticidad que se adapta a la figura y diseño abierto que resalta cintura y piernas. No incluye pantie."),
]
