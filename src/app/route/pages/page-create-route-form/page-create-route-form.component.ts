import {Component, OnInit} from '@angular/core';
import {Country} from "../../../shared/models/country";
import {Region} from "../../../shared/models/region";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CountryService} from "../../../shared/services/country.service";
import {RegionService} from "../../../shared/services/region.service";
import {distinctUntilChanged, map, Observable, startWith} from "rxjs";
import {AirportService} from "../../../shared/services/airport.service";
import {
  ADDING_ROUTE_FORM_TITLE,
  ALREADY_EXISTING_AIRPORT_ERROR_MESSAGE,
  ALREADY_EXISTING_ROUTE_ERROR_MESSAGE,
  EMPTY_COUNTRY_FLAG,
  EMPTY_REGION_FLAG,
  EMPTY_REQUIRED_FIELD_ERROR_MESSAGE,
  HUB_AIRPORT_IDENTICAL_ERROR_MESSAGE,
  INVALID_FORM_ERROR_MESSAGE,
  INVALID_IATA_ERROR_MESSAGE,
  UNKNOWN_AIRPORT_ERROR_MESSAGE,
  UNKNOWN_COUNTRY_ERROR_MESSAGE,
  UNKNOWN_HUB_ERROR_MESSAGE,
  UNKNOWN_REGION_ERROR_MESSAGE
} from "../../../shared/constants/form-constants";
import {NotificationService} from "../../../shared/services/notification.service";
import {buildAirportName, formatAirportCity, formatAirportName} from "../../../shared/utils";
import {COUNTRIES_WITH_REGIONS} from "../../../shared/constants/app-constants";
import {Airport} from "../../../shared/models/airport";
import {RouteService} from "../../../shared/services/route.service";

@Component({
  selector: 'app-page-route-form',
  templateUrl: './page-create-route-form.component.html',
  styleUrls: ['../../../shared/styles/forms.scss', '../../../shared/styles/airport-form.scss']
})
export class PageCreateRouteFormComponent implements OnInit {

  /* Form + its title and fields */
  public routeForm!: FormGroup;
  public routeFormTitle = ADDING_ROUTE_FORM_TITLE;
  public departureHub: FormControl = new FormControl();
  public existingArrivalAirport: boolean = false;
  public arrivalAirportSelected: FormControl = new FormControl();
  public newArrivalAirportIATA: FormControl = new FormControl();
  public newArrivalAirportName: FormControl = new FormControl();
  public cityIncludedInName: boolean = false;
  public newArrivalAirportCity: FormControl = new FormControl();
  public newArrivalAirportCharacteristicsCaseRespected = false;
  public newArrivalAirportCountry: FormControl = new FormControl();
  public newArrivalAirportRegion: FormControl = new FormControl();

  // Flag of current selected departure hub's country
  public flagDepartureHubCountry!: string;
  // Flag of current selected arrival airport's country
  public flagArrivalAirport!: string;
  // Flag of current selected country for new arrival airport
  public flagNewArrivalAirportCountry!: string;
  // Indicator to know if current country selected for new arrival airport has regions
  public countrySelectedHasRegions!: boolean;
  // Flag of potential current selected region for new arrival airport
  public flagNewArrivalAirportRegion!: string;

  // List of all arrival airports
  public allArrivalAirports: Airport[] = [];
  // List of already existing routes
  public existingRoutes: any[] = [];

  // List of available departure hubs
  public departureHubs: Airport[] = [];
  // List of available arrival airports
  public arrivalAirportsAvailable: Airport[] = [];
  // List of available countries
  public countries: Country[] = [];
  // List of available regions
  public regions: Region[] = [];
  // List of departure hubs matching to value entered in field
  public filteredDepartureHubs: Observable<Airport[]> = new Observable<Airport[]>();
  // List of arrival airports matching to value entered in field
  public filteredArrivalAirports: Observable<Airport[]> = new Observable<Airport[]>();
  // List of countries matching to value entered in field
  public filteredCountries: Observable<Country[]> = new Observable<Country[]>();
  // List of regions matching to value entered in field
  public filteredRegions: Observable<Region[]> = new Observable<Region[]>();

  // Indicator to know if the form has been submitted at least once
  public formSubmitted: boolean = false;
  // Custom error message for Departure hub field (if it's invalid)
  public departureHubFieldErrorMessage!: string;
  // Custom error message for Arrival airport field (if it's invalid)
  public arrivalAirportFieldErrorMessage!: string;
  // Custom error message for IATA field (if it's invalid)
  public iataFieldErrorMessage!: string;
  // Custom error message for Country field (if it's invalid)
  public countryFieldErrorMessage!: string;
  // Custom error message for Region field (if it's invalid)
  public regionFieldErrorMessage!: string;
  // Generic error message for required but empty field(s)
  public emptyRequiredFieldErrorMessage: string = EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;

  constructor(public countryService: CountryService, public regionService: RegionService, private airportService: AirportService, private routeService: RouteService, private formBuilder: FormBuilder, private notificationService: NotificationService) {
    // Form fields constraints definition
    this.routeForm = this.formBuilder.group({
      departureHub: [Validators.required],
      arrivalAirport: [Validators.required],
      iata: [[Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      name: [],
      city: [Validators.required],
      country: [Validators.required],
      region: []
    });
  }

  ngOnInit(): void {
    this.setDefaultDepartureHub();
    this.setDefaultArrivalAirport();
    this.setDefaultCountry();

    this.routeService.getRoutes().subscribe(routes => Object.assign(this.existingRoutes, routes));

    this.airportService.getAirports().subscribe(airports => {
      Object.assign(this.departureHubs, airports.filter(a => a.hub));
      Object.assign(this.allArrivalAirports, airports);
      this.configureDepartureHubFieldAutocomplete();
    });

    this.configureCountryFieldAutocomplete();

    this.departureHub.valueChanges.subscribe(departureHubValueChanged => this.addDepartureHubListener(departureHubValueChanged));
    this.newArrivalAirportCountry.valueChanges.subscribe(countryValueChanged => this.addCountryListener(countryValueChanged));
  }

  // Departure hub definition (with default value)
  private setDefaultDepartureHub() {
    this.flagDepartureHubCountry = EMPTY_COUNTRY_FLAG;
  }

  // Arrival airport definition (with default value)
  private setDefaultArrivalAirport() {
    this.flagArrivalAirport = EMPTY_COUNTRY_FLAG;
  }

  // Country definition (with default value)
  private setDefaultCountry() {
    this.flagNewArrivalAirportCountry = EMPTY_COUNTRY_FLAG;
    this.countrySelectedHasRegions = false;
    this.setDefaultRegion();
  }

  // Region definition (with default value)
  private setDefaultRegion() {
    this.flagNewArrivalAirportRegion = EMPTY_REGION_FLAG;
    this.newArrivalAirportRegion.setValue(null);
    this.routeForm.value.region = null;
  }

  // Departure hub field autocomplete configuration
  private configureDepartureHubFieldAutocomplete() {
    this.filteredDepartureHubs = this.departureHub.valueChanges.pipe(distinctUntilChanged(),
      startWith(''),
      map(hub => (hub ? this.getMatchedDepartureHubs(hub) : this.departureHubs.slice()))
    );
  }

  // Departure hubs filtering (matched to the entered value)
  private getMatchedDepartureHubs(departureHubValue: any): Airport[] {
    if (departureHubValue === null || departureHubValue === undefined) {
      return this.departureHubs;
    }

    const filterValue = typeof departureHubValue === 'string' ? departureHubValue.toUpperCase() : departureHubValue.iata.toUpperCase();
    return this.departureHubs.filter(departureHub => departureHub.iata.includes(filterValue) || departureHub.name.includes(formatAirportName(filterValue, false)));
  }

  // Arrival airport field autocomplete configuration
  private configureArrivalAirportFieldAutocomplete(departureHub: Airport) {
    if(this.arrivalAirportSelected.value) {
      let isDepartureHubIdentical: boolean = typeof this.arrivalAirportSelected.value === 'string' ? departureHub.iata === this.arrivalAirportSelected.value.toUpperCase() || departureHub.name === formatAirportName(this.arrivalAirportSelected.value, false) : departureHub.iata === this.arrivalAirportSelected.value.iata.toUpperCase() || departureHub.name === formatAirportName(this.arrivalAirportSelected.value.name, false);

      if(isDepartureHubIdentical) {
        this.arrivalAirportSelected.setValue(null);
      }
    }

    this.arrivalAirportsAvailable = this.allArrivalAirports.filter(airport => airport.id != departureHub.id);

    this.filteredArrivalAirports = this.arrivalAirportSelected.valueChanges.pipe(distinctUntilChanged(),
      startWith(''),
      map(airport => (airport ? this.getMatchedArrivalAirports(airport) : this.arrivalAirportsAvailable.slice()))
    );
  }

  // Arrival airports filtering (matched to the entered value)
  private getMatchedArrivalAirports(arrivalAirportValue: any): Airport[] {
    if (arrivalAirportValue === null || arrivalAirportValue === undefined) {
      return this.arrivalAirportsAvailable;
    }

    const filterValue = typeof arrivalAirportValue === 'string' ? arrivalAirportValue.toUpperCase() : arrivalAirportValue.iata.toUpperCase();
    return this.arrivalAirportsAvailable.filter(arrivalAirport => arrivalAirport.iata.includes(filterValue) || arrivalAirport.name.includes(formatAirportName(filterValue, false)));
  }

  // Country field autocomplete configuration
  private configureCountryFieldAutocomplete() {
    this.countryService.getCountries().subscribe(countriesAvailable => {
      Object.assign(this.countries, countriesAvailable);

      this.filteredCountries = this.newArrivalAirportCountry.valueChanges.pipe(distinctUntilChanged(),
        startWith(''),
        map(country => (country ? this.getMatchedCountries(country) : this.countries.slice())),
      );
    });
  }

  // Countries filtering (matched to the entered value)
  private getMatchedCountries(countryValue: any): Country[] {
    if (countryValue === null || countryValue === undefined) {
      return this.countries;
    }

    const filterValue = typeof countryValue === 'string' ? countryValue.toUpperCase() : countryValue.name.toUpperCase();
    return this.countries.filter(country => country.name.startsWith(filterValue));
  }

  // Region field autocomplete configuration
  private configureRegionFieldAutocomplete(countryFound: Country) {
    this.regionService.getRegionsByCountry(countryFound.id).subscribe(regionsAvailable => {
      this.regions = regionsAvailable;

      this.filteredRegions = this.newArrivalAirportRegion.valueChanges.pipe(distinctUntilChanged(),
        startWith(''),
        map(region => (region ? this.getMatchedRegions(region) : this.regions.slice())),
      );
    });
  }

  // Regions filtering (matched to the entered value)
  private getMatchedRegions(regionValue: any): Region[] {
    const filterValue = typeof regionValue === 'string' ? regionValue.toUpperCase() : regionValue.name.toUpperCase();
    return this.regions.filter(region => region.name.startsWith(filterValue));
  }

  // Departure hub field listener
  addDepartureHubListener(departureHubValueChanged: any) {
    if (departureHubValueChanged != null) {
      const departureHubFound = this.departureHubs.find(hub => typeof departureHubValueChanged === 'string' ? hub.iata === departureHubValueChanged.toUpperCase() || hub.name === formatAirportName(departureHubValueChanged, false) : hub.iata === departureHubValueChanged.iata.toUpperCase() || hub.name === formatAirportName(departureHubValueChanged.name, false));

      if (departureHubFound != undefined) {
        this.flagDepartureHubCountry = departureHubFound.country.isoAlpha2;
        this.routeForm.value.departureHub = {};
        Object.assign(this.routeForm.value.departureHub, departureHubFound);

        this.configureArrivalAirportFieldAutocomplete(departureHubFound);
        this.addArrivalAirportListener();
      } else {
        this.setDefaultDepartureHub();
        this.arrivalAirportsAvailable = [];
        this.arrivalAirportSelected.setValue(null);
      }
    } else {
      this.setDefaultDepartureHub();
      this.arrivalAirportsAvailable = [];
      this.arrivalAirportSelected.setValue(null);
    }
  }

  // Arrival airport type toggle listener
  addArrivalAirportTypeListener() {
    if (this.existingArrivalAirport) {
      this.arrivalAirportSelected.setValue(null);
    } else {
      this.newArrivalAirportIATA.setValue(null);
      this.newArrivalAirportName.setValue(null);
      this.newArrivalAirportCity.setValue(null);
      this.newArrivalAirportCountry.setValue(null);
      this.newArrivalAirportRegion.setValue(null);
    }
    this.existingArrivalAirport = !this.existingArrivalAirport;
  }

  // Arrival airport field listener
  addArrivalAirportListener() {
    this.arrivalAirportSelected.valueChanges.subscribe(arrivalAirportValueChanged => {
      if (arrivalAirportValueChanged != null) {
        const arrivalAirportFound = this.allArrivalAirports.find(arrivalAirport => typeof arrivalAirportValueChanged === 'string' ? arrivalAirport.iata === arrivalAirportValueChanged.toUpperCase() || arrivalAirport.name === formatAirportName(arrivalAirportValueChanged, false) : arrivalAirport.iata === arrivalAirportValueChanged.iata.toUpperCase() || arrivalAirport.name === formatAirportName(arrivalAirportValueChanged.name, false));

        if (arrivalAirportFound != undefined) {
          this.flagArrivalAirport = arrivalAirportFound.country.isoAlpha2;
          this.routeForm.value.arrivalAirport = {};
          Object.assign(this.routeForm.value.arrivalAirport, arrivalAirportFound);
        } else {
          this.setDefaultArrivalAirport();
        }
      } else {
        this.setDefaultArrivalAirport();
      }
    });
  }

  // Country field listener
  addCountryListener(countryValueChanged: any) {
    if (countryValueChanged != null) {
      const countryFound = this.countries.find(country => typeof countryValueChanged === 'string' ? country.name === countryValueChanged.toUpperCase() : country.name === countryValueChanged.name.toUpperCase());

      if (countryFound != undefined) {
        this.flagNewArrivalAirportCountry = countryFound.isoAlpha2;
        this.routeForm.value.country = {};
        Object.assign(this.routeForm.value.country, countryFound);
        this.setDefaultRegion();

        if (COUNTRIES_WITH_REGIONS.includes(countryFound.isoAlpha2)) {
          this.configureRegionFieldAutocomplete(countryFound);
          this.addRegionListener();
          this.countrySelectedHasRegions = true;
        }
      } else {
        this.setDefaultCountry();
      }
    } else {
      this.setDefaultCountry();
    }
  }

  // Region field listener
  private addRegionListener() {
    this.newArrivalAirportRegion.valueChanges.subscribe(regionValueChanged => {
      if (regionValueChanged != null) {
        const regionFound = this.regions.find(region => typeof regionValueChanged === 'string' ? region.name === regionValueChanged.toUpperCase() : region.name === regionValueChanged.name.toUpperCase());

        if (regionFound != undefined) {
          this.flagNewArrivalAirportRegion = `assets/regions-flag/${this.routeForm.value.country.isoAlpha2}/${regionFound.isoAlpha2}.svg`;
          this.routeForm.value.region = {};
          Object.assign(this.routeForm.value.region, regionFound);
        } else {
          this.flagNewArrivalAirportRegion = EMPTY_REGION_FLAG;
        }
      } else {
        this.flagNewArrivalAirportRegion = EMPTY_REGION_FLAG;
      }
    });
  }

  // Custom airport display (by name and potential region)
  displayAirportByName(airport: Airport) {
    return airport ? airport.name : '';
  }

  // Custom country display (by name)
  displayCountryByName(country: Country) {
    return country ? country.name : '';
  }

  // Custom region display (by name)
  displayRegionByName(region: Region) {
    return region ? region.name : '';
  }

  // Form submit
  submitRouteForm() {
    this.formSubmitted = true;

    if (this.existingArrivalAirport) {
      if (this.isValidDepartureHub() && this.isValidArrivalAirport()) {
        this.createNewRoute(this.routeForm.value.departureHub.id, this.routeForm.value.arrivalAirport.id);
      }
    } else {
      if (this.isValidDepartureHub() && this.isValidIATA() && this.isValidCity() && this.isValidCountry() && this.isValidRegion()) {
        this.routeForm.value.iata = this.newArrivalAirportIATA.value.toUpperCase();
        this.routeForm.value.city = formatAirportCity(this.newArrivalAirportCity.value.trim(), this.newArrivalAirportCharacteristicsCaseRespected);
        this.routeForm.value.name = buildAirportName(this.newArrivalAirportName.value, this.newArrivalAirportCharacteristicsCaseRespected, this.cityIncludedInName, this.routeForm.value.city);
        let arrivalAirport = {
          iata: this.routeForm.value.iata,
          name: this.routeForm.value.name,
          city: this.routeForm.value.city,
          country: this.routeForm.value.country,
          region: this.routeForm.value.region,
          hub: false
        };

        this.airportService.createAirport(arrivalAirport).subscribe(arrivalAirportCreated => {
          if (arrivalAirportCreated.id != null) {
            this.allArrivalAirports.push(arrivalAirportCreated);
            this.createNewRoute(this.routeForm.value.departureHub.id, arrivalAirportCreated.id);
          }
        });
      } else {
        this.notificationService.showError(this.routeFormTitle, INVALID_FORM_ERROR_MESSAGE);
      }
    }
  }

  // Route creation
  private createNewRoute(departureHubId: number, arrivalAirportId: number) {
    this.routeService.createRoute(departureHubId, arrivalAirportId).subscribe(routeCreated => {
      if (routeCreated.id != null) {
        this.existingRoutes.push(routeCreated);
        this.notificationService.showSuccess(this.routeFormTitle, 'Votre ligne a bien été créée !');
        this.resetRouteForm();
      }
    });
  }

  // Departure hub field validation
  isValidDepartureHub() {
    if (this.departureHub.value === null) {
      this.departureHubFieldErrorMessage = EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
      return false;
    } else if (this.flagDepartureHubCountry === EMPTY_COUNTRY_FLAG) {
      this.departureHubFieldErrorMessage = UNKNOWN_HUB_ERROR_MESSAGE;
      return false;
    }
    return true;
  }

  // Arrival airport field validation
  isValidArrivalAirport() {
    let existingRoutesArrivalsForDepartureHub: any[] = this.existingRoutes.filter(route => route.departureHubId === this.routeForm.value.departureHub.id).map(route => route.arrivalAirportId);

    if (this.arrivalAirportSelected.value === null) {
      this.arrivalAirportFieldErrorMessage = EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
      return false;
    } else if (this.flagArrivalAirport === EMPTY_COUNTRY_FLAG) {
      this.arrivalAirportFieldErrorMessage = UNKNOWN_AIRPORT_ERROR_MESSAGE;
      return false;
    } else if(existingRoutesArrivalsForDepartureHub.includes(this.routeForm.value.arrivalAirport.id)) {
      this.arrivalAirportFieldErrorMessage = ALREADY_EXISTING_ROUTE_ERROR_MESSAGE;
      return false;
    } else if(this.routeForm.value.departureHub.id === this.routeForm.value.arrivalAirport.id) {
      this.arrivalAirportFieldErrorMessage = HUB_AIRPORT_IDENTICAL_ERROR_MESSAGE;
      return false;
    }
    return true;
  }

  // IATA field validation
  isValidIATA() {
    let alreadyExistingAirportsIATA: string[] = this.allArrivalAirports.map(a => a.iata);

    if (this.newArrivalAirportIATA.value === null || this.newArrivalAirportIATA.value.trim() === '') {
      this.iataFieldErrorMessage = EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
      return false;
    } else if (this.newArrivalAirportIATA.value.length < 3) {
      this.iataFieldErrorMessage = INVALID_IATA_ERROR_MESSAGE;
      return false;
    } else if (alreadyExistingAirportsIATA.includes(this.newArrivalAirportIATA.value.toUpperCase())) {
      this.iataFieldErrorMessage = ALREADY_EXISTING_AIRPORT_ERROR_MESSAGE;
      return false;
    }
    return true;
  }

  // City field validation
  isValidCity() {
    return this.newArrivalAirportCity.value && this.newArrivalAirportCity.value.trim() != '';
  }

  // Country field validation
  isValidCountry() {
    if (this.newArrivalAirportCountry.value === null) {
      this.countryFieldErrorMessage = EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
      return false;
    } else if (this.flagNewArrivalAirportCountry === EMPTY_COUNTRY_FLAG) {
      this.countryFieldErrorMessage = UNKNOWN_COUNTRY_ERROR_MESSAGE;
      return false;
    }
    return true;
  }

  // Region field validation
  isValidRegion() {
    if (this.countrySelectedHasRegions) {
      if (this.newArrivalAirportRegion.value === null) {
        this.regionFieldErrorMessage = EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
        return false;
      } else if (this.flagNewArrivalAirportRegion === EMPTY_REGION_FLAG) {
        this.regionFieldErrorMessage = UNKNOWN_REGION_ERROR_MESSAGE;
        return false;
      }
    }
    return true;
  }

  // Form reset
  resetRouteForm() {
    this.formSubmitted = false;

    this.flagDepartureHubCountry = EMPTY_COUNTRY_FLAG;
    this.existingArrivalAirport = false;
    this.flagArrivalAirport = EMPTY_COUNTRY_FLAG;
    this.cityIncludedInName = false;
    this.newArrivalAirportCharacteristicsCaseRespected = false;
    this.flagNewArrivalAirportCountry = EMPTY_COUNTRY_FLAG;
    this.countrySelectedHasRegions = false;
    this.flagNewArrivalAirportRegion = EMPTY_REGION_FLAG;

    this.arrivalAirportsAvailable = [];

    this.departureHub.setValue(null);
    this.arrivalAirportSelected.setValue(null);
    this.newArrivalAirportIATA.setValue(null);
    this.newArrivalAirportName.setValue(null);
    this.newArrivalAirportCity.setValue(null);
    this.newArrivalAirportCountry.setValue(null);
    this.newArrivalAirportRegion.setValue(null);
  }
}
