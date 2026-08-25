// src/utils/home.js
// home.js

// Función para obtener el texto de la descripción basado en la zona seleccionada
export const getTextoDescripcion = (zonaSeleccionada) => {
  switch (zonaSeleccionada) {
    case 'ZMP':
      return 'Las Comisiones de la Zona Metropolitana de Pachuca son órganos auxiliares del Consejo, cuya labor consiste en informar, desahogar, proponer, recomendar, analizar, investigar, opinar y evaluar los Asuntos Metropolitanos que corresponden a la problemática sectorial que atiende cada Comisión en particular.';
    case 'ZMTula':
      return 'Las Comisiones de la Zona Metropolitana de Tula tienen la responsabilidad de coordinar y gestionar iniciativas relacionadas con el desarrollo sostenible, el manejo ambiental y la planificación urbana que afecta a la Zona Metropolitana de Tula.';
    case 'ZMTulancingo':
      return 'Las Comisiones de la Zona Metropolitana de Tulancingo se encargan de analizar y promover políticas que favorezcan el desarrollo económico y social del territorio metropolitano de Tulancingo, enfocándose en temas de infraestructura, movilidad y servicios públicos.';
    case 'ZMVM':
      return 'Las Comisiones del Valle de México son órganos auxiliares del Consejo, cuya labor consiste en informar, desahogar, proponer, recomendar, analizar, investigar, opinar y evaluar los Asuntos Metropolitanos que corresponden a la problemática sectorial que atiende cada Comisión en particular.';
    default:
      return 'Las Comisiones del Valle de México son órganos auxiliares del Consejo, cuya labor consiste en informar, desahogar, proponer, recomendar, analizar, investigar, opinar y evaluar los Asuntos Metropolitanos que corresponden a la problemática sectorial que atiende cada Comisión en particular.';
  }
};

// Función para obtener el título de la zona basado en la zona seleccionada
export const getTituloZona = (zonaSeleccionada) => {
  switch (zonaSeleccionada) {
    case 'ZMP':
      return 'Pachuca';
    case 'ZMTula':
      return 'Tula';
    case 'ZMTulancingo':
      return 'Tulancingo';
    case 'ZMVM':
      return 'Valle de México';
    default:
      return 'Valle de México';
  }
};

// Función para obtener el texto del objetivo basado en la zona seleccionada
export const getTextoObjetivo = (zonaSeleccionada) => {
  switch (zonaSeleccionada) {
    case 'ZMP':
      return 'La Zona Metropolitana de Pachuca es un territorio clave en el desarrollo urbano del estado de Hidalgo, conformada por los municipios de Epazoyucan, Mineral de la Reforma, Mineral del Monte, Pachuca de Soto, San Agustín Tlaxiaca, Zapotlán de Juárez y Zempoala. Esta área representa una integración funcional y territorial que facilita la planificación conjunta en aspectos económicos, sociales y de infraestructura, promoviendo un crecimiento ordenado y sostenible que mejora la calidad de vida de sus habitantes.';
    case 'ZMTula':
      return 'La Zona Metropolitana de Tula es una conurbación estratégica en el estado de Hidalgo, integrada por los municipios de Atitalaquia, Atotonilco de Tula, Tlahuelilpan, Tlaxcoapan y Tula de Allende. Esta zona destaca por su importancia económica, social y territorial, promoviendo la colaboración intermunicipal para un desarrollo urbano ordenado y sostenible, así como para el fortalecimiento de la infraestructura y los servicios que beneficien a sus habitantes.';
    case 'ZMTulancingo':
      return 'La Zona Metropolitana de Tulancingo, ubicada en el estado de Hidalgo, está conformada por los municipios de Cuautepec de Hinojosa, Santiago Tulantepec de Lugo Guerrero y Tulancingo de Bravo. Esta Zona Metropolitana representa una integración estratégica para impulsar el desarrollo económico, social y urbano, fortaleciendo la infraestructura y servicios, y promoviendo un crecimiento sostenible que beneficie a los habitantes de los municipios que la integran.';
    case 'ZMVM':
      return 'La Zona Metropolitana del Valle de México (ZMVM) es uno de los núcleos urbanos más extensos y dinámicos del país. Integra **_16 alcaldías de la Ciudad de México_**, así como **_59 municipios del Estado de México_**, **_8 municipios del Estado de Hidalgo_** y **_1 municipio del Estado de Morelos_**. \n\n Este territorio metropolitano, estrechamente interconectado en lo social, económico y cultural, constituye un motor clave del desarrollo metropolitano de México.';
    default:
      return 'La Zona Metropolitana del Valle de México (ZMVM) es uno de los núcleos urbanos más extensos y dinámicos del país. Integra **_16 alcaldías de la Ciudad de México_**, así como **_59 municipios del Estado de México_**, **_8 municipios del Estado de Hidalgo_** y **_1 municipio del Estado de Morelos_**. \n\n Este territorio metropolitano, estrechamente interconectado en lo social, económico y cultural, constituye un motor clave del desarrollo metropolitano de México.';
  }
};

// Función para obtener las imágenes basadas en la zona seleccionada
// home.js

export const getImages = (zonaSeleccionada) => {
  switch (zonaSeleccionada) {
    case 'ZMP':
      return [
        '/img/About/ZMPachuca/pachuca reloj.png',
        '/img/About/ZMPachuca/pachuca 1.png',
        '/img/About/ZMPachuca/2.JPG',
        '/img/About/ZMPachuca/zempoala.JPG'
      ];
    case 'ZMTula':
      return [
        '/img/About/ZMTula/1.JPG',
        '/img/About/ZMTula/2.JPG'
      ];
    case 'ZMTulancingo':
      return [
        '/img/About/ZMTulancingo/puente tulanciongo.png',
        '/img/About/ZMTulancingo/puente tulanciongo.png'
      ];
    case 'ZMVM':
      return [
        '/img/About/ZMVM/Angel CDMX.jpg',
        '/img/About/ZMVM/bellas artes CDMX.jpg',
        '/img/About/ZMVM/CDMX 1.jpg',
        '/img/About/ZMVM/Torres de Satélite.jpg'
      ];
    default:
      // Asegúrate de que siempre se devuelva un arreglo, incluso si no hay zona seleccionada
      return [
        '/img/About/ZMVM/Angel CDMX.jpg',
        '/img/About/ZMVM/bellas artes CDMX.jpg',
        '/img/About/ZMVM/CDMX 1.jpg',
        '/img/About/ZMVM/Torres de Satélite.jpg'
      ];
  }
};


// Función para determinar si se usa "de" o "del"
export const getPreposicion = (zonaSeleccionada) => {
  return zonaSeleccionada === 'ZMVM' ? 'del' : 'de';
};

export const getMunAlc = (zonaSeleccionada) => {
  return zonaSeleccionada === 'ZMVM' ? 'municipios y alcaldías' : 'municipios';
};


// Función para obtener el texto del mapa home en la zona seleccionada
export const getMapNom = (zonaSeleccionada) => {
  switch (zonaSeleccionada) {
    case 'ZMP':
      return 'La Zona Metropolitana de Pachuca es un territorio clave en el desarrollo urbano del estado de Hidalgo, conformada por los municipios de Epazoyucan, Mineral de la Reforma, Mineral del Monte, Pachuca de Soto, San Agustín Tlaxiaca, Zapotlán de Juárez y Zempoala.';
    case 'ZMTula':
      return 'La Zona Metropolitana de Tula es una conurbación estratégica en el estado de Hidalgo, integrada por los municipios de Atitalaquia, Atotonilco de Tula, Tlahuelilpan, Tlaxcoapan y Tula de Allende.';
    case 'ZMTulancingo':
      return 'La Zona Metropolitana de Tulancingo, ubicada en el estado de Hidalgo, está conformada por los municipios de Cuautepec de Hinojosa, Santiago Tulantepec de Lugo Guerrero y Tulancingo de Bravo.';
    case 'ZMVM':
      return '**_Ciudad de México (16 alcaldías):_** Álvaro Obregón, Azcapotzalco, Benito Juárez, Coyoacán, Cuajimalpa de Morelos, Cuauhtémoc, Gustavo A. Madero, Iztacalco, Iztapalapa, La Magdalena Contreras, Miguel Hidalgo, Milpa Alta, Tláhuac, Tlalpan, Venustiano Carranza y Xochimilco. \n **_Estado de México (59 municipios):_** Acolman, Amecameca, Apaxco, Atenco, Atizapán de Zaragoza, Atlautla, Axapusco, Ayapango, Chalco, Chiautla, Chicoloapan, Chiconcuac, Chimalhuacán, Coacalco de Berriozábal, Cocotitlán, Coyotepec, Cuautitlán, Cuautitlán Izcalli, Ecatepec de Morelos, Ecatzingo, Huehuetoca, Hueypoxtla, Huixquilucan, Isidro Fabela, Ixtapaluca, Jaltenco, Jilotzingo, Juchitepec, La Paz, Melchor Ocampo, Naucalpan de Juárez, Nextlalpan, Nezahualcóyotl, Nicolás Romero, Nopaltepec, Otumba, Ozumba, Papalotla, San Martín de las Pirámides, Tecámac, Temamatla, Temascalapa, Tenango del Aire, Teoloyucan, Teotihuacán, Tepetlaoxtoc, Tepetlixpa, Tepotzotlán, Tequixquiac, Texcoco, Tezoyuca, Tlalmanalco, Tlalnepantla de Baz, Tonanitla, Tultepec, Tultitlán, Valle de Chalco Solidaridad, Villa del Carbón y Zumpango. \n **_Hidalgo (8 municipios):_** Atitalaquia, Atotonilco de Tula, Tolcayuca, Tula de Allende, Villa de Tezontepec, Tizayuca, Tepeji del Río de Ocampo y Tlaxcoapan. \n **_Morelos (1 municipio):_** Huitzilac.';
    default:
      return '**_Ciudad de México (16 alcaldías):_** Álvaro Obregón, Azcapotzalco, Benito Juárez, Coyoacán, Cuajimalpa de Morelos, Cuauhtémoc, Gustavo A. Madero, Iztacalco, Iztapalapa, La Magdalena Contreras, Miguel Hidalgo, Milpa Alta, Tláhuac, Tlalpan, Venustiano Carranza y Xochimilco. \n **_Estado de México (59 municipios):_** Acolman, Amecameca, Apaxco, Atenco, Atizapán de Zaragoza, Atlautla, Axapusco, Ayapango, Chalco, Chiautla, Chicoloapan, Chiconcuac, Chimalhuacán, Coacalco de Berriozábal, Cocotitlán, Coyotepec, Cuautitlán, Cuautitlán Izcalli, Ecatepec de Morelos, Ecatzingo, Huehuetoca, Hueypoxtla, Huixquilucan, Isidro Fabela, Ixtapaluca, Jaltenco, Jilotzingo, Juchitepec, La Paz, Melchor Ocampo, Naucalpan de Juárez, Nextlalpan, Nezahualcóyotl, Nicolás Romero, Nopaltepec, Otumba, Ozumba, Papalotla, San Martín de las Pirámides, Tecámac, Temamatla, Temascalapa, Tenango del Aire, Teoloyucan, Teotihuacán, Tepetlaoxtoc, Tepetlixpa, Tepotzotlán, Tequixquiac, Texcoco, Tezoyuca, Tlalmanalco, Tlalnepantla de Baz, Tonanitla, Tultepec, Tultitlán, Valle de Chalco Solidaridad, Villa del Carbón y Zumpango. \n **_Hidalgo (8 municipios):_** Atitalaquia, Atotonilco de Tula, Tolcayuca, Tula de Allende, Villa de Tezontepec, Tizayuca, Tepeji del Río de Ocampo y Tlaxcoapan. \n **_Morelos (1 municipio):_** Huitzilac.';
  }
};
