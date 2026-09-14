// Catálogo de Productos Nativa
const PRODUCTS = [
  {
    id: 'te-vital-energizante',
    legacyId: 'portfolio-6.html',
    name: 'Té vital',
    tagline: 'Té Verde Sencha, Jengibre & Naranja',
    category: 'Infusiones & Tés',
    categorySlug: 'infusiones',
    price: '$ 28.000',
    priceNum: 28000,
    image: 'img/portfolio/Tevital.png',
    weight: '100 g',
    shortDesc: 'Blend energizante de hojas de té verde sencha, trozos de jengibre fresco y cáscaras de naranja silvestre.',
    description: 'El impulso natural perfecto para iniciar tus jornadas con concentración, agilidad mental y vitalidad. Este blend armoniza selectas hojas de té verde sencha con la nota picante del jengibre secado al sol, cascaritas aromáticas de naranja y extracto natural de guaraná. Brinda vitalidad duradera sin los picos de ansiedad del café.',
    benefits: [
      'Energía limpia y sostenida para mente y cuerpo',
      'Aumenta el enfoque cognitivo y estimula el metabolismo',
      'Extraordinaria concentración de catequinas antioxidantes',
      'Delicioso frío o caliente en cualquier momento'
    ],
    details: {
      'Contenido Neto': '100 g',
      'Preparación': '1 cucharadita en agua a 80°C durante 3 a 4 minutos',
      'Ingredientes': 'Té verde sencha, jengibre deshidratado, cáscara de naranja, semillas de guaraná',
      'Nivel de Estimulación': 'Medio natural'
    }
  },
  {
    id: 'granola-artesanal',
    legacyId: 'portfolio-2.html',
    name: 'Granola',
    tagline: 'Avena Integral Horneada Lentamente',
    category: 'Desayunos & Cereales',
    categorySlug: 'desayunos',
    price: '$ 32.000',
    priceNum: 32000,
    image: 'img/portfolio/Granola.png',
    weight: '400 g',
    shortDesc: 'Avena integral horneada con miel pura de abeja, coco laminado, canela y semillas de chía.',
    description: 'Nuestra Granola Artesanal está horneada a baja temperatura en pequeños lotes para garantizar un crujido perfecto y dorado. Endulzada exclusivamente con miel pura de abeja y enriquecida con láminas de coco tostado, copos de avena entera, lino y semillas de chía ricas en fibra.',
    benefits: [
      'Endulzada naturalmente sólo con miel pura de abeja',
      'Avena integral de grano entero no refinada',
      'Energía limpia y saciedad prolongada',
      'Perfecta para acompañar con yogur, kéfir o frutas frescas'
    ],
    details: {
      'Contenido Neto': '400 g',
      'Origen': 'Producción agroartesanal Nativa',
      'Ingredientes': 'Avena entera, miel de abeja pura, coco laminado, chía, lino, canela en polvo',
      'Conservación': 'Cerrar herméticamente tras cada uso para mantener el crocante'
    }
  },
  {
    id: 'miel-pura-abeja',
    legacyId: 'portfolio-5.html',
    name: 'Miel De Montaña',
    tagline: 'Cosecha Cruda Multifloral Nativa',
    category: 'Mieles Puras',
    categorySlug: 'mieles',
    price: '$ 36.000',
    priceNum: 36000,
    image: 'img/portfolio/Miel.png',
    weight: '500 g',
    shortDesc: 'Miel cruda de bosque nativo sin pasteurizar, rica en polen y enzimas activas benéficas.',
    description: 'Cosechada directamente de apiarios sostenibles ubicados en áreas protegidas de flora nativa. Nuestra miel no es pasteurizada ni sometida a microfiltración térmica, preservando intactos sus nutrientes vivos, propóleos, trazas de polen y minerales. Su consistencia cremosa y suave cristalización natural son sello de autenticidad pura.',
    benefits: [
      'Miel 100% cruda, natural y sin pasteurizar',
      'Preserva enzimas vivas, polen nativo y antioxidantes',
      'Potente acción antibacteriana y reconstituyente del sistema inmune',
      'Apicultura ética comprometida con el cuidado de los ecosistemas'
    ],
    details: {
      'Contenido Neto': '500 g en frasco de vidrio reciclable',
      'Origen': 'Bosques templados de montaña',
      'Ingredientes': '100% Miel pura de abeja multifloral',
      'Consistencia': 'Cremosa natural con cristalización auténtica'
    }
  },
  {
    id: 'infusion-digestiva',
    legacyId: 'portfolio-4.html',
    name: 'Infusión Digestiva',
    tagline: 'Menta Andina, Cedrón & Boldo',
    category: 'Infusiones & Tés',
    categorySlug: 'infusiones',
    price: '$ 24.000',
    priceNum: 24000,
    image: 'img/portfolio/Infusiondige.png',
    weight: '80 g (aprox. 35 tazas)',
    shortDesc: 'Combinación fresca de menta, hojas de cedrón cítrico y boldo para una digestión liviana.',
    description: 'Diseñada específicamente para después de las comidas principales. Esta fórmula herbal reúne la frescura balsámica de la menta andina, el toque cítrico del cedrón y la reconocida tradición digestiva del boldo y poleo silvestre. Ayuda a mitigar la pesadez estomacal de forma natural y eficaz.',
    benefits: [
      'Alivia la sensación de pesadez e inflamación post comidas',
      'Estimula una digestión saludable y ligera',
      'Sabor fresco, herbal y reconfortante',
      'Hojas seleccionadas secadas a la sombra'
    ],
    details: {
      'Contenido Neto': '80 g en hebras',
      'Preparación': '1 cucharada pequeña en agua a 95°C, infusionar 5 minutos tapado',
      'Ingredientes': 'Cedrón silvestre, menta andina, boldo aromático, hinojo',
      'Conservación': 'Conservar en frasco cerrado en lugar seco'
    }
  },
  {
    id: 'infusion-relajante',
    legacyId: 'portfolio-3.html',
    name: 'Infusión',
    tagline: 'Hierbas Silvestres & Flores Andinas',
    category: 'Infusiones & Tés',
    categorySlug: 'infusiones',
    price: '$ 24.000',
    priceNum: 24000,
    image: 'img/portfolio/Infusion.png',
    weight: '80 g (aprox. 35 tazas)',
    shortDesc: 'Hojas y flores enteras de melisa, lavanda y manzanilla para desconectar y calmar el estrés.',
    description: 'Una infusión botánica aromática y reconstituyente formulada con hojas y flores enteras recolectadas a mano. Combina la suave acción sedante de la melisa silvestre, flores de lavanda aromática y pétalos dorados de manzanilla. Su aroma reconfortante prepara el cuerpo y la mente para un sueño reparador.',
    benefits: [
      'Favorece la relajación natural y el descanso nocturno',
      'Hierbas en hoja entera sin triturar ni polvillo',
      '100% libre de teína y cafeína',
      'Sabor floral delicado, suave y armonioso'
    ],
    details: {
      'Contenido Neto': '80 g en hebras botánicas',
      'Preparación': '1 cucharadita en agua a 90°C, reposar 5 a 7 minutos',
      'Ingredientes': 'Melisa silvestre, flores de lavanda, manzanilla, menta piperita',
      'Certificación': 'Cultivo limpio sin pesticidas'
    }
  },
  {
    id: 'frutos-del-silvestre',
    legacyId: 'portfolio-1.html',
    name: 'Frutos Deshidratados',
    tagline: 'Mix Selecto de Frutos Secos & Semillas',
    category: 'Snacks & Semillas',
    categorySlug: 'snacks',
    price: '$ 38.000',
    priceNum: 38000,
    image: 'img/portfolio/Frutosdesi.png',
    weight: '350 g',
    shortDesc: 'Selección premium de almendras, nueces, arándanos deshidratados y semillas tostadas al natural.',
    description: 'Una mezcla energética y nutritiva recolectada cuidadosamente en los valles del sur. Frutos Deshidratados combina almendras seleccionadas, nueces de nogal crujientes, arándanos deshidratados naturalmente al sol y semillas de calabaza tostadas sin aceite añadido. Sin azúcares agregados, sin conservantes y libre de sodio artificial.',
    benefits: [
      'Alto contenido en ácidos grasos Omega 3 y 6',
      '100% libre de conservantes, sal y aditivos artificiales',
      'Rico en fibra dietaria, magnesio y antioxidantes naturales',
      'Envase hermético con cierre zipper reutilizable'
    ],
    details: {
      'Contenido Neto': '350 g',
      'Origen': 'Valle Central',
      'Ingredientes': 'Almendras, nueces, arándanos deshidratados, semillas de calabaza',
      'Conservación': 'Mantener en lugar fresco, seco y protegido de la luz directa'
    }
  },
  {
    id: 'matcha-organico',
    name: 'Matcha Orgánico',
    tagline: 'Té Verde Ceremonial en Polvo',
    category: 'Infusiones & Tés',
    categorySlug: 'infusiones',
    price: '$ 48.000',
    priceNum: 48000,
    image: 'img/portfolio/Matcha.jpg',
    weight: '80 g',
    shortDesc: 'Té verde matcha de grado ceremonial molido en piedra, 100% puro y rebosante de antioxidantes.',
    description: 'Cosechado a la sombra para potenciar sus niveles naturales de clorofila, L-teanina y antioxidantes EGCG. Nuestro Matcha Orgánico se muele artesanalmente en molinos de piedra para obtener un polvo finísimo de color verde esmeralda brillante. Aporta claridad mental, energía sostenida y calma enfocada sin provocar sobresaltos.',
    benefits: [
      'Grado ceremonial de primera cosecha primaveral',
      'Rico en L-teanina y antioxidantes bioactivos',
      'Energía constante sin ansiedad ni caídas bruscas',
      'Versátil para batidos, lattes vegetales y repostería saludable'
    ],
    details: {
      'Contenido Neto': '80 g en lata hermética de conservación',
      'Preparación': '1/2 cucharadita batida en agua a 75°C con batidor de bambú',
      'Ingredientes': '100% Té verde matcha orgánico molido',
      'Origen': 'Cultivo ecológico certificado'
    }
  },
  {
    id: 'polen-dorado',
    name: 'Polen Dorado',
    tagline: 'Superalimento Apícola Multifloral',
    category: 'Mieles Puras',
    categorySlug: 'mieles',
    price: '$ 34.000',
    priceNum: 34000,
    image: 'img/portfolio/Polen.jpg',
    weight: '250 g',
    shortDesc: 'Gránulos dorados de polen puro recolectado por abejas en bosques y praderas nativas vírgenes.',
    description: 'Considerado uno de los alimentos más completos de la naturaleza. El Polen Dorado Nativa es secado suavemente a temperatura ambiente de colmena para proteger intactos sus 22 aminoácidos esenciales, vitaminas del complejo B, enzimas digestivas y minerales como el zinc y selenio. Un potente tónico revitalizante natural.',
    benefits: [
      'Concentración excepcional de proteínas y aminoácidos esenciales',
      'Fortalece el sistema inmunitario y combate el cansancio físico',
      'Mejora el rendimiento atlético y la vitalidad diaria',
      'Cosecha responsable y respetuosa de la biodiversidad apícola'
    ],
    details: {
      'Contenido Neto': '250 g en frasco de vidrio reciclable',
      'Consumo Sugerido': '1 cucharadita al desayuno con frutas, batidos o avena',
      'Ingredientes': '100% Polen multifloral de abeja deshidratado en frío',
      'Conservación': 'Lugar fresco y seco, alejado de la humedad'
    }
  },
  {
    id: 'semillas-chia-lino',
    name: 'Mix Semillas Chía & Lino',
    tagline: 'Supermix Agroecológico Rico en Omega 3',
    category: 'Snacks & Semillas',
    categorySlug: 'snacks',
    price: '$ 22.000',
    priceNum: 22000,
    image: 'img/portfolio/Semillas.jpg',
    weight: '450 g',
    shortDesc: 'Combinación de semillas seleccionadas de chía negra y lino dorado, fuente natural de fibra y omega 3.',
    description: 'Un dúo vegetal imprescindible en cualquier despensa consciente. Seleccionamos semillas de chía negra y lino dorado de cultivos agroecológicos sin químicos. Al contacto con líquidos forman un mucílago protector ideal para el tránsito intestinal y la salud cardiovascular, manteniendo una saciedad duradera.',
    benefits: [
      'Extraordinaria fuente vegetal de ácidos grasos Omega 3 (ALA)',
      'Alto contenido de fibra soluble e insoluble prebiótica',
      'Promueve la digestión regular y la saciedad saludable',
      'Empaque compostable con cierre hermético'
    ],
    details: {
      'Contenido Neto': '450 g',
      'Uso Recomendado': 'Ideal para pudines de chía, masas caseras, ensaladas y yogures',
      'Ingredientes': 'Semillas de chía negra (50%), semillas de lino dorado (50%)',
      'Alérgenos': 'Libre de gluten por naturaleza'
    }
  }
];

function getProductById(id) {
  if (!id) return null;
  const cleanId = id.trim().toLowerCase();
  return PRODUCTS.find(p => p.id === cleanId || p.legacyId === cleanId);
}

function getAllProducts() {
  return PRODUCTS;
}

// Export for node or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, getProductById, getAllProducts };
}
