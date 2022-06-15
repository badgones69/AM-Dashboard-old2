export function buildAirportName(airportName: string, airportCity: string, airportNameIncludesCity: boolean): string {
  if(airportName != null) {
    airportName = formatAirportCharacteristic(airportName.trim());
  }

  if(airportName === null || airportName === '') {
    return formatMultipleAirportCities(airportCity);
  } else {
    if (airportNameIncludesCity) {
      airportCity = formatAirportCharacteristic(airportCity);
      return `${airportCity} — ${airportName}`;
    } else {
      return airportName;
    }
  }
}

export function formatAirportCharacteristic(airportCharacteristic: string): string {
  let airportNameWords = airportCharacteristic.toLowerCase().split(' ');

  for (let i = 0; i < airportNameWords.length; i++) {
    airportNameWords[i] = airportNameWords[i].trim();

    const compoundSymbolIndex = airportNameWords[i].indexOf('-');

    if(compoundSymbolIndex > -1) {
      if(compoundSymbolIndex === 0) {
        airportNameWords[i] = airportNameWords[i].replace(airportNameWords[i].charAt(0), '');
      }

      let airportNameCompoundWords = airportNameWords[i].split('-');

      for (let j = 0; j < airportNameCompoundWords.length; j++) {
        airportNameCompoundWords[j] = airportNameCompoundWords[j].trim();
        airportNameCompoundWords[j] = capitalizeFirstLetter(airportNameCompoundWords[j]);
      }
      airportNameWords[i] = airportNameCompoundWords.join('-');
    } else {
      airportNameWords[i] = capitalizeFirstLetter(airportNameWords[i]);
    }
  }
  return airportNameWords.join(' ');
}

export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function formatMultipleAirportCities(multipleAirportCities: string): string {
  let airportCities = multipleAirportCities.toLowerCase().split(',');

  for (let i = 0; i < airportCities.length; i++) {
    airportCities[i] = airportCities[i].trim();

    const compoundSymbolIndex = airportCities[i].indexOf('-');

    if(compoundSymbolIndex > -1) {
      if(compoundSymbolIndex === 0) {
        airportCities[i] = airportCities[i].replace(airportCities[i].charAt(0), '');
      }

      let airportCityCompoundWords = airportCities[i].split('-');

      for (let j = 0; j < airportCityCompoundWords.length; j++) {
        airportCityCompoundWords[j] = airportCityCompoundWords[j].trim();
        airportCityCompoundWords[j] = capitalizeFirstLetter(airportCityCompoundWords[j]);
      }
      airportCities[i] = airportCityCompoundWords.join('-');
    } else {
      airportCities[i] = capitalizeFirstLetter(airportCities[i]);
    }
  }
  return airportCities.join('—');
}
