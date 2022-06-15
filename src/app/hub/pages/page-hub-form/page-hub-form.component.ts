import {Component, Input, OnInit} from '@angular/core';
import {Country} from "../../../shared/models/country";
import {Region} from "../../../shared/models/region";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CountryService} from "../../../shared/services/country.service";
import {RegionService} from "../../../shared/services/region.service";
import {distinctUntilChanged, map, Observable, startWith} from "rxjs";
import {Airport} from "../../../shared/models/airport";
import {AirportService} from "../../../shared/services/airport.service";
import {
  ADDING_HUB_FORM_TITLE,
  EMPTY_COUNTRY_FLAG,
  EMPTY_REGION_FLAG,
  EMPTY_REQUIRED_FIELD_ERROR_MESSAGE,
  INVALID_FORM_ERROR_MESSAGE,
  INVALID_IATA_ERROR_MESSAGE,
  UNKNOWN_COUNTRY_ERROR_MESSAGE,
  UNKNOWN_REGION_ERROR_MESSAGE
} from "../../../shared/constants/form-constants";
import {NotificationService} from "../../../shared/services/notification.service";
import {buildAirportName, formatAirportCharacteristic} from "../../../shared/utils";
import {COUNTRIES_WITH_REGIONS} from "../../../shared/constants/app-constants";

@Component({
  selector: 'app-page-hub-form',
  templateUrl: './page-hub-form.component.html',
  styleUrls: ['../../../shared/styles/forms.scss', '../../../shared/styles/airport-form.scss']
})
export class PageHubFormComponent implements OnInit {

  @Input() public hubAirport: Airport = new Airport();

  /* Form + its title and fields */
  public hubForm!: FormGroup;
  public hubFormTitle = ADDING_HUB_FORM_TITLE;
  public iata:FormControl = new FormControl();
  public name:FormControl = new FormControl();
  public cityIncludedInName:boolean = false;
  public city:FormControl = new FormControl();
  public country:FormControl = new FormControl();
  public region:FormControl = new FormControl();

  // Flag of current selected country
  public flagAirportCountry!: string;
  // Indicator to know if current country selected has regions
  public countrySelectedHasRegions!: boolean;
  // Flag of potential current selected region
  public flagAirportRegion!: string;

  // List of available countries
  public countries: Country[] = [];
  // List of available regions
  public regions: Region[] = [];
  // List of countries matching to value entered in field
  public filteredCountries: Observable<Country[]> = new Observable<Country[]>();
  // List of regions matching to value entered in field
  public filteredRegions: Observable<Region[]> = new Observable<Region[]>();

  // Indicator to know if the form has been submitted at least once
  public formSubmitted: boolean = false;
  // Custom error message for IATA field (if it's invalid)
  public iataFieldErrorMessage!: string;
  // Custom error message for country field (if it's invalid)
  public countryFieldErrorMessage!: string;
  // Custom error message for region field (if it's invalid)
  public regionFieldErrorMessage!: string;
  // Generic error message for required but empty field(s)
  public emptyRequiredFieldErrorMessage: string = EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;

  constructor(public countryService: CountryService, public regionService: RegionService, private airportService: AirportService, private formBuilder: FormBuilder, private notificationService: NotificationService) {
    // Form fields constraints definition
    this.hubForm = this.formBuilder.group({
      iata: [this.hubAirport.iata, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      name: [this.hubAirport.name],
      city: [this.hubAirport.city, Validators.required],
      country: [this.hubAirport.country, Validators.required],
      region: [this.hubAirport.region]
    });
  }

  ngOnInit(): void {
    this.setDefaultCountry();
    this.configureCountryFieldAutocomplete();

    this.country.valueChanges.subscribe(countryValueChanged => this.addCountryListener(countryValueChanged));
  }

  // Country definition (with default value)
  private setDefaultCountry() {
    this.flagAirportCountry = EMPTY_COUNTRY_FLAG;
    this.countrySelectedHasRegions = false;
    this.flagAirportRegion = EMPTY_REGION_FLAG;
  }

  // Country field autocomplete configuration
  private configureCountryFieldAutocomplete() {
    this.countryService.getCountries().subscribe(countriesAvailable => {
      Object.assign(this.countries, countriesAvailable);

      this.filteredCountries = this.country.valueChanges.pipe(distinctUntilChanged(),
        startWith(''),
        map(country => (country ? this.getMatchedCountries(country) : this.countries.slice())),
      );
    });
  }

  // Countries filtering (matched to the entered value)
  private getMatchedCountries(countryValue: any): Country[] {
    if(countryValue === null || countryValue === undefined) {
      return this.countries;
    }

    const filterValue = typeof countryValue === 'string' ? countryValue.toUpperCase() : countryValue.name.toUpperCase();
    return this.countries.filter(country => country.name.startsWith(filterValue));
  }

  // Region field autocomplete configuration
  private configureRegionFieldAutocomplete(countryFound: Country) {
    this.regionService.getRegionsByCountry(countryFound.id).subscribe(regionsAvailable => {
      Object.assign(this.regions, regionsAvailable);

      this.filteredRegions = this.region.valueChanges.pipe(distinctUntilChanged(),
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

  // Country field listener
  addCountryListener(countryValueChanged: any) {
    if(countryValueChanged != null) {
      const countryFound = this.countries.find(country => typeof countryValueChanged === 'string' ? country.name === countryValueChanged.toUpperCase() : country.name === countryValueChanged.name.toUpperCase());

      if(countryFound != undefined) {
        this.flagAirportCountry = countryFound.isoAlpha2;
        this.hubForm.value.country = {};
        Object.assign(this.hubForm.value.country, countryFound);

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
    this.region.valueChanges.subscribe(regionValueChanged => {
      if (regionValueChanged != null) {
        const regionFound = this.regions.find(region => typeof regionValueChanged === 'string' ? region.name === regionValueChanged.toUpperCase() : region.name === regionValueChanged.name.toUpperCase());

        if (regionFound != undefined) {
          this.flagAirportRegion = `assets/regions-flag/${this.hubForm.value.country.isoAlpha2}/${regionFound.isoAlpha2}.svg`;
          this.hubForm.value.region = {};
          Object.assign(this.hubForm.value.region, regionFound);
        } else {
          this.flagAirportRegion = EMPTY_REGION_FLAG;
        }
      } else {
        this.flagAirportRegion = EMPTY_REGION_FLAG;
      }
    });
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
  submitHubForm() {
    this.formSubmitted = true;

    if(this.isValidIATA() && this.isValidCity() && this.isValidCountry() && this.isValidRegion()) {
      this.hubForm.value.iata = this.iata.value.toUpperCase();
      this.hubForm.value.city = formatAirportCharacteristic(this.city.value.trim());
      this.hubForm.value.name = buildAirportName(this.name.value, this.hubForm.value.city, this.cityIncludedInName);
      this.hubAirport = this.hubForm.value;
      this.hubAirport.hub = true;

      this.airportService.createAirport(this.hubAirport).subscribe(hubAirportCreated => {
        if(hubAirportCreated.id != null) {
          this.notificationService.showSuccess(this.hubFormTitle, 'Votre hub a bien été créé !');
          this.resetHubForm();
        }
      });
    } else {
      this.notificationService.showError(this.hubFormTitle, INVALID_FORM_ERROR_MESSAGE);
    }
  }

  // IATA field validation
  isValidIATA() {
    if(this.iata.value === null || this.iata.value.trim() === '') {
      this.iataFieldErrorMessage = EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
      return false;
    } else if(this.iata.value.length < 3) {
      this.iataFieldErrorMessage = INVALID_IATA_ERROR_MESSAGE;
      return false;
    }
    return true;
  }

  // City field validation
  isValidCity() {
    return this.city.value && this.city.value.trim() != '';
  }

  // Country field validation
  isValidCountry() {
    if(this.country.value === null) {
      this.countryFieldErrorMessage = EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
      return false;
    } else if(this.flagAirportCountry === EMPTY_COUNTRY_FLAG) {
      this.countryFieldErrorMessage = UNKNOWN_COUNTRY_ERROR_MESSAGE;
      return false;
    }
    return true;
  }

  // Region field validation
  isValidRegion() {
    if(this.countrySelectedHasRegions) {
      if(this.region.value === null) {
        this.regionFieldErrorMessage = EMPTY_REQUIRED_FIELD_ERROR_MESSAGE;
        return false;
      } else if(this.flagAirportRegion === EMPTY_REGION_FLAG) {
        this.regionFieldErrorMessage = UNKNOWN_REGION_ERROR_MESSAGE;
        return false;
      }
    }
    return true;
  }

  // Form reset
  resetHubForm() {
    this.formSubmitted = false;
    this.hubAirport = new Airport();

    this.flagAirportCountry = EMPTY_COUNTRY_FLAG;
    this.countrySelectedHasRegions = false;
    this.flagAirportRegion = EMPTY_REGION_FLAG;

    this.iata.setValue(null);
    this.name.setValue(null);
    this.city.setValue(null);
    this.country.setValue(null);
    this.region.setValue(null);
  }
}
