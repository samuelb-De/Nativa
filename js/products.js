// Catálogo de Productos Nativa
const PRODUCTS = [
  {
    id: 'frutos-del-silvestre',
    legacyId: 'portfolio-1.html',
    name: 'Frutos del Silvestre',
    tagline: 'Mix Selecto de Frutos Secos & Semillas',
    category: 'Snacks Saludables',
    categorySlug: 'snacks',
    price: '$8.500',
    priceNum: 8500,
    image: 'img/portfolio/Frutosdesi.png',
    weight: '350 g',
    shortDesc: 'Selección premium de almendras, nueces, arándanos deshidratados y semillas tostadas al natural.',
    description: 'Una mezcla energética y nutritiva recolectada cuidadosamente en los valles del sur. Frutos del Silvestre combina almendras seleccionadas, nueces de nogal crujientes, arándanos deshidratados naturalmente al sol y semillas de calabaza tostadas sin aceite añadido. Sin azúcares agregados, sin conservantes y libre de sodio artificial.',
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
    id: 'granola-artesanal',
    legacyId: 'portfolio-2.html',
    name: 'Granola Artesanal con Miel',
    tagline: 'Avena Integral Horneada Lentamente',
    category: 'Desayunos & Cereales',
    categorySlug: 'desayunos',
    price: '$6.900',
    priceNum: 6900,
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
    id: 'infusion-relajante',
    legacyId: 'portfolio-3.html',
    name: 'Infusión Natural Relajante',
    tagline: 'Hierbas Silvestres & Flores Andinas',
    category: 'Infusiones & Hierbas',
    categorySlug: 'infusiones',
    price: '$5.500',
    priceNum: 5500,
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
    id: 'infusion-digestiva',
    legacyId: 'portfolio-4.html',
    name: 'Infusión Herbal Digestiva',
    tagline: 'Menta Andina, Cedrón & Boldo',
    category: 'Infusiones & Hierbas',
    categorySlug: 'infusiones',
    price: '$5.500',
    priceNum: 5500,
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
    id: 'miel-pura-abeja',
    legacyId: 'portfolio-5.html',
    name: 'Miel Pura de Abeja Orgánica',
    tagline: 'Cosecha Cruda Multifloral Nativa',
    category: 'Mieles & Endulzantes',
    categorySlug: 'mieles',
    price: '$7.900',
    priceNum: 7900,
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
      'Origen': 'Bosques templados del sur',
      'Ingredientes': '100% Miel pura de abeja multifloral',
      'Consistencia': 'Cremosa natural con cristalización auténtica'
    }
  },
  {
    id: 'te-vital-energizante',
    legacyId: 'portfolio-6.html',
    name: 'Té Vital Energizante',
    tagline: 'Té Verde Sencha, Jengibre & Naranja',
    category: 'Infusiones & Hierbas',
    categorySlug: 'infusiones',
    price: '$6.200',
    priceNum: 6200,
    image: 'img/portfolio/Tevital.png',
    weight: '100 g (aprox. 40 tazas)',
    shortDesc: 'Blend energizante de hojas de té verde, trozos de jengibre fresco y cáscaras de naranja silvestre.',
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
