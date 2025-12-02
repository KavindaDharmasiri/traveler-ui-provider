import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faDollarSign,
  faTag,
  faPhone,
  faMapMarkerAlt,
  faUsers,
  faCar,
  faBed
} from "@fortawesome/free-solid-svg-icons";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import axiosInstance from "../api/axiosInstance";
import Swal from 'sweetalert2';
import LoadingScreen from "../components/common/LoadingScreen";

const AddItem = ({ setCurrentPage, editItemId }) => {
  const [category, setCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    description: "",
    pricePerDay: ""
  });
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [currencySearch, setCurrencySearch] = useState("");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [phoneError, setPhoneError] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const allCountryCodes = [
    { code: "+1", country: "United States", iso: "US" },
    { code: "+1", country: "Canada", iso: "CA" },
    { code: "+7", country: "Russia", iso: "RU" },
    { code: "+20", country: "Egypt", iso: "EG" },
    { code: "+27", country: "South Africa", iso: "ZA" },
    { code: "+30", country: "Greece", iso: "GR" },
    { code: "+31", country: "Netherlands", iso: "NL" },
    { code: "+32", country: "Belgium", iso: "BE" },
    { code: "+33", country: "France", iso: "FR" },
    { code: "+34", country: "Spain", iso: "ES" },
    { code: "+36", country: "Hungary", iso: "HU" },
    { code: "+39", country: "Italy", iso: "IT" },
    { code: "+40", country: "Romania", iso: "RO" },
    { code: "+41", country: "Switzerland", iso: "CH" },
    { code: "+43", country: "Austria", iso: "AT" },
    { code: "+44", country: "United Kingdom", iso: "GB" },
    { code: "+45", country: "Denmark", iso: "DK" },
    { code: "+46", country: "Sweden", iso: "SE" },
    { code: "+47", country: "Norway", iso: "NO" },
    { code: "+48", country: "Poland", iso: "PL" },
    { code: "+49", country: "Germany", iso: "DE" },
    { code: "+51", country: "Peru", iso: "PE" },
    { code: "+52", country: "Mexico", iso: "MX" },
    { code: "+53", country: "Cuba", iso: "CU" },
    { code: "+54", country: "Argentina", iso: "AR" },
    { code: "+55", country: "Brazil", iso: "BR" },
    { code: "+56", country: "Chile", iso: "CL" },
    { code: "+57", country: "Colombia", iso: "CO" },
    { code: "+58", country: "Venezuela", iso: "VE" },
    { code: "+60", country: "Malaysia", iso: "MY" },
    { code: "+61", country: "Australia", iso: "AU" },
    { code: "+62", country: "Indonesia", iso: "ID" },
    { code: "+63", country: "Philippines", iso: "PH" },
    { code: "+64", country: "New Zealand", iso: "NZ" },
    { code: "+65", country: "Singapore", iso: "SG" },
    { code: "+66", country: "Thailand", iso: "TH" },
    { code: "+81", country: "Japan", iso: "JP" },
    { code: "+82", country: "South Korea", iso: "KR" },
    { code: "+84", country: "Vietnam", iso: "VN" },
    { code: "+86", country: "China", iso: "CN" },
    { code: "+90", country: "Turkey", iso: "TR" },
    { code: "+91", country: "India", iso: "IN" },
    { code: "+92", country: "Pakistan", iso: "PK" },
    { code: "+93", country: "Afghanistan", iso: "AF" },
    { code: "+94", country: "Sri Lanka", iso: "LK" },
    { code: "+95", country: "Myanmar", iso: "MM" },
    { code: "+98", country: "Iran", iso: "IR" },
    { code: "+212", country: "Morocco", iso: "MA" },
    { code: "+213", country: "Algeria", iso: "DZ" },
    { code: "+216", country: "Tunisia", iso: "TN" },
    { code: "+218", country: "Libya", iso: "LY" },
    { code: "+220", country: "Gambia", iso: "GM" },
    { code: "+221", country: "Senegal", iso: "SN" },
    { code: "+222", country: "Mauritania", iso: "MR" },
    { code: "+223", country: "Mali", iso: "ML" },
    { code: "+224", country: "Guinea", iso: "GN" },
    { code: "+225", country: "Ivory Coast", iso: "CI" },
    { code: "+226", country: "Burkina Faso", iso: "BF" },
    { code: "+227", country: "Niger", iso: "NE" },
    { code: "+228", country: "Togo", iso: "TG" },
    { code: "+229", country: "Benin", iso: "BJ" },
    { code: "+230", country: "Mauritius", iso: "MU" },
    { code: "+231", country: "Liberia", iso: "LR" },
    { code: "+232", country: "Sierra Leone", iso: "SL" },
    { code: "+233", country: "Ghana", iso: "GH" },
    { code: "+234", country: "Nigeria", iso: "NG" },
    { code: "+235", country: "Chad", iso: "TD" },
    { code: "+236", country: "Central African Republic", iso: "CF" },
    { code: "+237", country: "Cameroon", iso: "CM" },
    { code: "+238", country: "Cape Verde", iso: "CV" },
    { code: "+239", country: "Sao Tome and Principe", iso: "ST" },
    { code: "+240", country: "Equatorial Guinea", iso: "GQ" },
    { code: "+241", country: "Gabon", iso: "GA" },
    { code: "+242", country: "Republic of the Congo", iso: "CG" },
    { code: "+243", country: "Democratic Republic of the Congo", iso: "CD" },
    { code: "+244", country: "Angola", iso: "AO" },
    { code: "+245", country: "Guinea-Bissau", iso: "GW" },
    { code: "+246", country: "British Indian Ocean Territory", iso: "IO" },
    { code: "+248", country: "Seychelles", iso: "SC" },
    { code: "+249", country: "Sudan", iso: "SD" },
    { code: "+250", country: "Rwanda", iso: "RW" },
    { code: "+251", country: "Ethiopia", iso: "ET" },
    { code: "+252", country: "Somalia", iso: "SO" },
    { code: "+253", country: "Djibouti", iso: "DJ" },
    { code: "+254", country: "Kenya", iso: "KE" },
    { code: "+255", country: "Tanzania", iso: "TZ" },
    { code: "+256", country: "Uganda", iso: "UG" },
    { code: "+257", country: "Burundi", iso: "BI" },
    { code: "+258", country: "Mozambique", iso: "MZ" },
    { code: "+260", country: "Zambia", iso: "ZM" },
    { code: "+261", country: "Madagascar", iso: "MG" },
    { code: "+262", country: "Reunion", iso: "RE" },
    { code: "+263", country: "Zimbabwe", iso: "ZW" },
    { code: "+264", country: "Namibia", iso: "NA" },
    { code: "+265", country: "Malawi", iso: "MW" },
    { code: "+266", country: "Lesotho", iso: "LS" },
    { code: "+267", country: "Botswana", iso: "BW" },
    { code: "+268", country: "Swaziland", iso: "SZ" },
    { code: "+269", country: "Comoros", iso: "KM" },
    { code: "+290", country: "Saint Helena", iso: "SH" },
    { code: "+291", country: "Eritrea", iso: "ER" },
    { code: "+297", country: "Aruba", iso: "AW" },
    { code: "+298", country: "Faroe Islands", iso: "FO" },
    { code: "+299", country: "Greenland", iso: "GL" },
    { code: "+350", country: "Gibraltar", iso: "GI" },
    { code: "+351", country: "Portugal", iso: "PT" },
    { code: "+352", country: "Luxembourg", iso: "LU" },
    { code: "+353", country: "Ireland", iso: "IE" },
    { code: "+354", country: "Iceland", iso: "IS" },
    { code: "+355", country: "Albania", iso: "AL" },
    { code: "+356", country: "Malta", iso: "MT" },
    { code: "+357", country: "Cyprus", iso: "CY" },
    { code: "+358", country: "Finland", iso: "FI" },
    { code: "+359", country: "Bulgaria", iso: "BG" },
    { code: "+370", country: "Lithuania", iso: "LT" },
    { code: "+371", country: "Latvia", iso: "LV" },
    { code: "+372", country: "Estonia", iso: "EE" },
    { code: "+373", country: "Moldova", iso: "MD" },
    { code: "+374", country: "Armenia", iso: "AM" },
    { code: "+375", country: "Belarus", iso: "BY" },
    { code: "+376", country: "Andorra", iso: "AD" },
    { code: "+377", country: "Monaco", iso: "MC" },
    { code: "+378", country: "San Marino", iso: "SM" },
    { code: "+380", country: "Ukraine", iso: "UA" },
    { code: "+381", country: "Serbia", iso: "RS" },
    { code: "+382", country: "Montenegro", iso: "ME" },
    { code: "+383", country: "Kosovo", iso: "XK" },
    { code: "+385", country: "Croatia", iso: "HR" },
    { code: "+386", country: "Slovenia", iso: "SI" },
    { code: "+387", country: "Bosnia and Herzegovina", iso: "BA" },
    { code: "+389", country: "North Macedonia", iso: "MK" },
    { code: "+420", country: "Czech Republic", iso: "CZ" },
    { code: "+421", country: "Slovakia", iso: "SK" },
    { code: "+423", country: "Liechtenstein", iso: "LI" },
    { code: "+500", country: "Falkland Islands", iso: "FK" },
    { code: "+501", country: "Belize", iso: "BZ" },
    { code: "+502", country: "Guatemala", iso: "GT" },
    { code: "+503", country: "El Salvador", iso: "SV" },
    { code: "+504", country: "Honduras", iso: "HN" },
    { code: "+505", country: "Nicaragua", iso: "NI" },
    { code: "+506", country: "Costa Rica", iso: "CR" },
    { code: "+507", country: "Panama", iso: "PA" },
    { code: "+508", country: "Saint Pierre and Miquelon", iso: "PM" },
    { code: "+509", country: "Haiti", iso: "HT" },
    { code: "+590", country: "Guadeloupe", iso: "GP" },
    { code: "+591", country: "Bolivia", iso: "BO" },
    { code: "+592", country: "Guyana", iso: "GY" },
    { code: "+593", country: "Ecuador", iso: "EC" },
    { code: "+594", country: "French Guiana", iso: "GF" },
    { code: "+595", country: "Paraguay", iso: "PY" },
    { code: "+596", country: "Martinique", iso: "MQ" },
    { code: "+597", country: "Suriname", iso: "SR" },
    { code: "+598", country: "Uruguay", iso: "UY" },
    { code: "+599", country: "Netherlands Antilles", iso: "AN" },
    { code: "+670", country: "East Timor", iso: "TL" },
    { code: "+672", country: "Antarctica", iso: "AQ" },
    { code: "+673", country: "Brunei", iso: "BN" },
    { code: "+674", country: "Nauru", iso: "NR" },
    { code: "+675", country: "Papua New Guinea", iso: "PG" },
    { code: "+676", country: "Tonga", iso: "TO" },
    { code: "+677", country: "Solomon Islands", iso: "SB" },
    { code: "+678", country: "Vanuatu", iso: "VU" },
    { code: "+679", country: "Fiji", iso: "FJ" },
    { code: "+680", country: "Palau", iso: "PW" },
    { code: "+681", country: "Wallis and Futuna", iso: "WF" },
    { code: "+682", country: "Cook Islands", iso: "CK" },
    { code: "+683", country: "Niue", iso: "NU" },
    { code: "+684", country: "American Samoa", iso: "AS" },
    { code: "+685", country: "Samoa", iso: "WS" },
    { code: "+686", country: "Kiribati", iso: "KI" },
    { code: "+687", country: "New Caledonia", iso: "NC" },
    { code: "+688", country: "Tuvalu", iso: "TV" },
    { code: "+689", country: "French Polynesia", iso: "PF" },
    { code: "+690", country: "Tokelau", iso: "TK" },
    { code: "+691", country: "Micronesia", iso: "FM" },
    { code: "+692", country: "Marshall Islands", iso: "MH" },
    { code: "+850", country: "North Korea", iso: "KP" },
    { code: "+852", country: "Hong Kong", iso: "HK" },
    { code: "+853", country: "Macau", iso: "MO" },
    { code: "+855", country: "Cambodia", iso: "KH" },
    { code: "+856", country: "Laos", iso: "LA" },
    { code: "+880", country: "Bangladesh", iso: "BD" },
    { code: "+886", country: "Taiwan", iso: "TW" },
    { code: "+960", country: "Maldives", iso: "MV" },
    { code: "+961", country: "Lebanon", iso: "LB" },
    { code: "+962", country: "Jordan", iso: "JO" },
    { code: "+963", country: "Syria", iso: "SY" },
    { code: "+964", country: "Iraq", iso: "IQ" },
    { code: "+965", country: "Kuwait", iso: "KW" },
    { code: "+966", country: "Saudi Arabia", iso: "SA" },
    { code: "+967", country: "Yemen", iso: "YE" },
    { code: "+968", country: "Oman", iso: "OM" },
    { code: "+970", country: "Palestine", iso: "PS" },
    { code: "+971", country: "United Arab Emirates", iso: "AE" },
    { code: "+972", country: "Israel", iso: "IL" },
    { code: "+973", country: "Bahrain", iso: "BH" },
    { code: "+974", country: "Qatar", iso: "QA" },
    { code: "+975", country: "Bhutan", iso: "BT" },
    { code: "+976", country: "Mongolia", iso: "MN" },
    { code: "+977", country: "Nepal", iso: "NP" },
    { code: "+992", country: "Tajikistan", iso: "TJ" },
    { code: "+993", country: "Turkmenistan", iso: "TM" },
    { code: "+994", country: "Azerbaijan", iso: "AZ" },
    { code: "+995", country: "Georgia", iso: "GE" },
    { code: "+996", country: "Kyrgyzstan", iso: "KG" },
    { code: "+998", country: "Uzbekistan", iso: "UZ" }
  ];

  const filteredCountries = allCountryCodes.filter(country => 
    country.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.includes(countrySearch) ||
    country.iso.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const getPhoneValidation = (countryCode) => {
    const validations = {
      '+1': { length: 10, pattern: /^[0-9]{10}$/, example: '1234567890' },
      '+44': { length: 10, pattern: /^[0-9]{10}$/, example: '1234567890' },
      '+91': { length: 10, pattern: /^[0-9]{10}$/, example: '9876543210' },
      '+86': { length: 11, pattern: /^[0-9]{11}$/, example: '13812345678' },
      '+81': { length: 10, pattern: /^[0-9]{10}$/, example: '9012345678' },
      '+49': { length: 11, pattern: /^[0-9]{10,11}$/, example: '15123456789' },
      '+33': { length: 9, pattern: /^[0-9]{9}$/, example: '123456789' },
      '+39': { length: 10, pattern: /^[0-9]{9,10}$/, example: '3123456789' },
      '+34': { length: 9, pattern: /^[0-9]{9}$/, example: '612345678' },
      '+61': { length: 9, pattern: /^[0-9]{9}$/, example: '412345678' },
      '+55': { length: 11, pattern: /^[0-9]{10,11}$/, example: '11987654321' },
      '+7': { length: 10, pattern: /^[0-9]{10}$/, example: '9123456789' },
      '+82': { length: 10, pattern: /^[0-9]{9,10}$/, example: '1012345678' },
      '+65': { length: 8, pattern: /^[0-9]{8}$/, example: '91234567' },
      '+852': { length: 8, pattern: /^[0-9]{8}$/, example: '91234567' },
      '+66': { length: 9, pattern: /^[0-9]{9}$/, example: '812345678' },
      '+60': { length: 9, pattern: /^[0-9]{9,10}$/, example: '123456789' },
      '+62': { length: 10, pattern: /^[0-9]{9,12}$/, example: '8123456789' },
      '+63': { length: 10, pattern: /^[0-9]{10}$/, example: '9171234567' },
      '+84': { length: 9, pattern: /^[0-9]{9}$/, example: '912345678' },
      '+92': { length: 10, pattern: /^[0-9]{10}$/, example: '3001234567' },
      '+94': { length: 9, pattern: /^[0-9]{9}$/, example: '712345678' },
      '+880': { length: 10, pattern: /^[0-9]{10}$/, example: '1712345678' },
      '+966': { length: 9, pattern: /^[0-9]{9}$/, example: '501234567' },
      '+971': { length: 9, pattern: /^[0-9]{9}$/, example: '501234567' },
      '+972': { length: 9, pattern: /^[0-9]{9}$/, example: '501234567' },
      '+90': { length: 10, pattern: /^[0-9]{10}$/, example: '5321234567' },
      '+27': { length: 9, pattern: /^[0-9]{9}$/, example: '821234567' },
      '+20': { length: 10, pattern: /^[0-9]{10}$/, example: '1012345678' },
      '+234': { length: 10, pattern: /^[0-9]{10}$/, example: '8012345678' },
      '+254': { length: 9, pattern: /^[0-9]{9}$/, example: '712345678' }
    };
    return validations[countryCode] || { length: 10, pattern: /^[0-9]{7,15}$/, example: '1234567890' };
  };

  const currentValidation = getPhoneValidation(selectedCountryCode);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
    { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
    { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
    { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee' },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
    { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
    { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' }
  ];

  const filteredCurrencies = currencies.filter(currency => 
    currency.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    currency.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    currency.symbol.includes(currencySearch)
  );

  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    vehicleNumber: "",
    passengerCount: "",
    condition: "AC",
    kmPerDay: "",
    pricePerExtraKm: "",
    driverStatus: "WITH_DRIVER",
    waitingChargePerNight: ""
  });
  const [hotelData, setHotelData] = useState({
    address: "",
    roomNumber: "",
    maxGuests: ""
  });

  const contentRef = useRef(null);

  // Fetch item data for editing
  useEffect(() => {
    console.log('EditItemId changed:', editItemId);
    if (editItemId) {
      console.log('Setting edit mode to true');
      setIsEditMode(true);
      fetchItemForEdit(editItemId);
    } else {
      console.log('Setting edit mode to false');
      setIsEditMode(false);
      // Reset form when not editing
      resetForm();
    }
  }, [editItemId]);

  const resetForm = () => {
    setFormData({ name: "", contact: "", description: "", pricePerDay: "" });
    setCategory("");
    setImages([]);
    setImageUrls([]);
    setVehicleData({
      vehicleNumber: "",
      passengerCount: "",
      condition: "AC",
      kmPerDay: "",
      pricePerExtraKm: "",
      driverStatus: "WITH_DRIVER",
      waitingChargePerNight: ""
    });
    setHotelData({
      address: "",
      roomNumber: "",
      maxGuests: ""
    });
    setSelectedCurrency("USD");
    setSelectedCountryCode("+1");
  };

  const fetchItemForEdit = async (itemId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`core/api/v1/provider/item/${itemId}`);
      const item = response.data;
      
      // Populate form with existing data
      setCategory(item.category.toLowerCase());
      
      // Extract country code and phone number
      let countryCode = "+1";
      let phoneNumber = item.contact;
      
      // Try to find matching country code
      for (const country of allCountryCodes) {
        if (item.contact.startsWith(country.code)) {
          countryCode = country.code;
          phoneNumber = item.contact.substring(country.code.length);
          break;
        }
      }
      
      setSelectedCountryCode(countryCode);
      setFormData({
        name: item.name,
        contact: phoneNumber,
        description: item.description,
        pricePerDay: item.pricePerDay.toString()
      });
      setSelectedCurrency(item.currency);
      
      // Load images
      if (item.images && item.images.length > 0) {
        setImages(item.images);
        const imageUrls = [];
        for (const uuid of item.images) {
          try {
            const imageResponse = await axiosInstance.get(`storage/files/download/${uuid}`, {
              responseType: 'blob'
            });
            imageUrls.push(URL.createObjectURL(imageResponse.data));
          } catch (error) {
            console.error(`Error fetching image ${uuid}:`, error);
          }
        }
        setImageUrls(imageUrls);
      }
      
      // Load category-specific data
      if (item.vehicleDetails) {
        setVehicleData({
          vehicleNumber: item.vehicleDetails.vehicleNumber || "",
          passengerCount: item.vehicleDetails.passengerCount?.toString() || "",
          condition: item.vehicleDetails.condition || "AC",
          kmPerDay: item.vehicleDetails.kmPerDay?.toString() || "",
          pricePerExtraKm: item.vehicleDetails.pricePerExtraKm?.toString() || "",
          driverStatus: item.vehicleDetails.driverStatus || "WITH_DRIVER",
          waitingChargePerNight: item.vehicleDetails.waitingChargePerNight?.toString() || ""
        });
      }
      
      if (item.hotelDetails) {
        setHotelData({
          address: item.hotelDetails.address || "",
          roomNumber: item.hotelDetails.roomNumber || "",
          maxGuests: item.hotelDetails.maxGuests?.toString() || ""
        });
      }
    } catch (error) {
      console.error('Error fetching item for edit:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load item data for editing.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'contact') {
      const validation = getPhoneValidation(selectedCountryCode);
      if (value && !validation.pattern.test(value)) {
        setPhoneError(`Invalid format. Expected ${validation.length} digits. Example: ${validation.example}`);
      } else {
        setPhoneError('');
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: value
    });
  };

  const handleHotelChange = (e) => {
    const { name, value } = e.target;
    setHotelData({
      ...hotelData,
      [name]: value
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];
    const newImageUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axiosInstance.post('storage/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        uploadedImages.push(response.data);
        
        const imageResponse = await axiosInstance.get(`storage/files/download/${response.data}`, {
          responseType: 'blob'
        });
        newImageUrls.push(URL.createObjectURL(imageResponse.data));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    setImages([...images, ...uploadedImages]);
    setImageUrls([...imageUrls, ...newImageUrls]);
    
    // Clear the file input to allow re-uploading
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setImageUrls(newImageUrls);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Delete Service?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axiosInstance.delete(`core/api/v1/provider/item/${editItemId}`);
        Swal.fire('Deleted!', 'Service has been deleted.', 'success');
        setCurrentPage('services');
      } catch (error) {
        console.error('Error deleting service:', error);
        Swal.fire('Error!', 'Failed to delete service.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate main form fields
    if (!category || !formData.name || !formData.contact || !formData.description || !formData.pricePerDay) {
      Swal.fire({
        title: 'Missing Required Fields!',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Validate at least one image
    if (images.length === 0) {
      Swal.fire({
        title: 'No Images!',
        text: 'Please upload at least one image.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Validate category-specific fields
    if (category === "vehicles") {
      if (!vehicleData.vehicleNumber || !vehicleData.passengerCount || !vehicleData.kmPerDay || !vehicleData.pricePerExtraKm || !vehicleData.waitingChargePerNight) {
        Swal.fire({
          title: 'Missing Vehicle Details!',
          text: 'Please fill in all vehicle details.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }
    }
    
    if (category === "hotels") {
      if (!hotelData.address || !hotelData.maxGuests) {
        Swal.fire({
          title: 'Missing Hotel Details!',
          text: 'Please fill in address and max guests.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }
    }
    
    setLoading(true);

    try {
      const payload = {
        category: category.toUpperCase(),
        name: formData.name,
        contact: selectedCountryCode + formData.contact,
        description: formData.description,
        pricePerDay: parseFloat(formData.pricePerDay),
        currency: selectedCurrency,
        images: images
      };

      if (category === "vehicles") {
        payload.vehicleDetails = {
          vehicleNumber: vehicleData.vehicleNumber,
          passengerCount: parseInt(vehicleData.passengerCount),
          condition: vehicleData.condition,
          kmPerDay: parseFloat(vehicleData.kmPerDay),
          pricePerExtraKm: parseFloat(vehicleData.pricePerExtraKm),
          driverStatus: vehicleData.driverStatus,
          waitingChargePerNight: parseFloat(vehicleData.waitingChargePerNight)
        };
      }

      if (category === "hotels") {
        payload.hotelDetails = {
          address: hotelData.address,
          roomNumber: hotelData.roomNumber,
          maxGuests: parseInt(hotelData.maxGuests)
        };
      }

      console.log('Is Edit Mode:', isEditMode, 'Edit Item ID:', editItemId);
      if (isEditMode) {
        console.log('Sending PUT request with ID:', editItemId);
        payload.id = editItemId;
        await axiosInstance.put('core/api/v1/provider/item', payload);
      } else {
        console.log('Sending POST request to: core/api/v1/provider/item');
        await axiosInstance.post('core/api/v1/provider/item', payload);
      }
      
      Swal.fire({
        title: 'Success!',
        text: isEditMode ? 'Service updated successfully!' : 'Service added successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        setCurrentPage('services');
      });
      
      if (!isEditMode) {
        resetForm();
      }
    } catch (error) {
      console.error('Error saving service:', error);
      Swal.fire({
        title: 'Error!',
        text: isEditMode ? 'Error updating service. Please try again.' : 'Error creating service. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message={isEditMode ? "Loading service data..." : "Creating your service..."} />;
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
      <div ref={contentRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {isEditMode ? ' Edit Service' : ' Add New Service'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            {isEditMode ? 'Update your service details' : 'Create a new service offering for your customers'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-3">
              Select Category
            </label>
            <select
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#217964] focus:ring-2 focus:ring-[#217964]/20 transition-all duration-200"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-- Choose Category --</option>
              <option value="camping">🏕️ Camping Gear</option>
              <option value="electronics">📱 Electronics</option>
              <option value="luggage">🧳 Luggage</option>
              <option value="watersports">🏄 Water Sports</option>
              <option value="outdoor">🧥 Outdoor Apparel</option>
              <option value="vehicles">🚗 Vehicles</option>
              <option value="hotels">🏨 Hotels</option>
            </select>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-3 font-semibold text-gray-900">Service Name</label>
              <input 
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#217964] focus:ring-2 focus:ring-[#217964]/20 transition-all duration-200" 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your service name"
                required
              />
            </div>

            <div>
              <label className="block mb-3 font-semibold text-gray-900">Price per Day</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative w-full sm:w-32">
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#217964] cursor-pointer hover:border-[#217964]/50 transition-all duration-200"
                    value={`${currencies.find(c => c.code === selectedCurrency)?.symbol} ${selectedCurrency}`}
                    onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    readOnly
                    placeholder="Currency"
                  />
                  {showCurrencyDropdown && (
                    <div className="absolute top-full left-0 w-full sm:w-80 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 max-h-60 overflow-hidden">
                      <input
                        type="text"
                        className="w-full p-3 border-b-2 border-gray-200 focus:outline-none focus:border-[#217964]"
                        placeholder="Search currency..."
                        value={currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                      />
                      <div className="max-h-48 overflow-y-auto">
                        {filteredCurrencies.map((currency) => (
                          <div
                            key={currency.code}
                            className="p-3 hover:bg-[#217964]/10 cursor-pointer text-sm transition-colors duration-150"
                            onClick={() => {
                              setSelectedCurrency(currency.code);
                              setShowCurrencyDropdown(false);
                              setCurrencySearch('');
                            }}
                          >
                            {currency.symbol} {currency.code} - {currency.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <input 
                  className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-[#217964] focus:ring-2 focus:ring-[#217964]/20 transition-all duration-200" 
                  type="number" 
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  placeholder={`Price in ${selectedCurrency}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-3 font-semibold text-gray-900">Contact Number</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="hidden sm:block text-gray-500" />
                <div className="relative w-full sm:w-32">
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#217964] cursor-pointer hover:border-[#217964]/50 transition-all duration-200"
                    value={selectedCountryCode}
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    readOnly
                    placeholder="Code"
                  />
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 w-full sm:w-80 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 max-h-60 overflow-hidden">
                      <input
                        type="text"
                        className="w-full p-3 border-b-2 border-gray-200 focus:outline-none focus:border-[#217964]"
                        placeholder="Search country..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                      />
                      <div className="max-h-48 overflow-y-auto">
                        {filteredCountries.map((country, index) => (
                          <div
                            key={`${country.code}-${country.iso}-${index}`}
                            className="p-3 hover:bg-[#217964]/10 cursor-pointer text-sm transition-colors duration-150"
                            onClick={() => {
                              setSelectedCountryCode(country.code);
                              setShowCountryDropdown(false);
                              setCountrySearch('');
                            }}
                          >
                            {country.code} - {country.country}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <input 
                  className={`flex-1 p-4 border-2 rounded-xl focus:ring-2 focus:ring-[#217964]/20 transition-all duration-200 ${phoneError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#217964]'}`}
                  type="text" 
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder={`Enter phone number (e.g., ${currentValidation.example})`}
                  pattern={currentValidation.pattern.source}
                  maxLength={currentValidation.length}
                  required
                />
              </div>
              {phoneError && (
                <div className="text-red-500 text-sm mt-2">{phoneError}</div>
              )}
            </div>

            <div>
              <label className="block mb-3 font-semibold text-gray-900">Upload Images</label>
              <div className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#217964] transition-colors duration-200">
                <FontAwesomeIcon icon={faCamera} className="text-gray-500" />
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
              </div>
              {images.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-3 font-medium">
                    {images.length} image(s) uploaded
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-3 font-semibold text-gray-900">Description</label>
              <textarea 
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#217964] focus:ring-2 focus:ring-[#217964]/20 transition-all duration-200" 
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your service..."
                required
              ></textarea>
            </div>
          </div>

          {/* Category-specific sections remain the same but with updated styling */}
          {category === "vehicles" && (
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-blue-900">
                <FontAwesomeIcon icon={faCar} /> Vehicle Details
              </h2>
              <div className="space-y-4">
                <input 
                  className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all duration-200" 
                  placeholder="Vehicle Number" 
                  name="vehicleNumber"
                  value={vehicleData.vehicleNumber}
                  onChange={handleVehicleChange}
                  required
                />
                <input 
                  className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all duration-200" 
                  type="number" 
                  placeholder="Passenger Count" 
                  name="passengerCount"
                  value={vehicleData.passengerCount}
                  onChange={handleVehicleChange}
                  required
                />
                <select 
                  className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all duration-200"
                  name="condition"
                  value={vehicleData.condition}
                  onChange={handleVehicleChange}
                >
                  <option value="AC">AC</option>
                  <option value="NON_AC">Non-AC</option>
                </select>
                <input 
                  className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all duration-200" 
                  type="number" 
                  placeholder="KM Per Day" 
                  name="kmPerDay"
                  value={vehicleData.kmPerDay}
                  onChange={handleVehicleChange}
                  required
                />
                <input 
                  className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all duration-200" 
                  type="number" 
                  placeholder="Price Per Extra KM" 
                  name="pricePerExtraKm"
                  value={vehicleData.pricePerExtraKm}
                  onChange={handleVehicleChange}
                  required
                />
                <select 
                  className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all duration-200"
                  name="driverStatus"
                  value={vehicleData.driverStatus}
                  onChange={handleVehicleChange}
                >
                  <option value="WITH_DRIVER">With Driver</option>
                  <option value="WITHOUT_DRIVER">Without Driver</option>
                  <option value="BOTH">Both Options</option>
                </select>
                <input 
                  className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 transition-all duration-200" 
                  type="number" 
                  placeholder="Waiting Charge Per Night" 
                  name="waitingChargePerNight"
                  value={vehicleData.waitingChargePerNight}
                  onChange={handleVehicleChange}
                  required
                />
              </div>
            </div>
          )}

          {category === "hotels" && (
            <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-purple-900">
                <FontAwesomeIcon icon={faBed} /> Hotel Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-600" />
                  <input 
                    className="flex-1 p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-all duration-200" 
                    placeholder="Address" 
                    name="address"
                    value={hotelData.address}
                    onChange={handleHotelChange}
                    required
                  />
                </div>
                <input 
                  className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-all duration-200" 
                  placeholder="Room Number" 
                  name="roomNumber"
                  value={hotelData.roomNumber}
                  onChange={handleHotelChange}
                />
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faUsers} className="text-purple-600" />
                  <input 
                    className="flex-1 p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 transition-all duration-200" 
                    type="number" 
                    placeholder="Max Guests" 
                    name="maxGuests"
                    value={hotelData.maxGuests}
                    onChange={handleHotelChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-4">
              {isEditMode && (
                <>
                  <button 
                    onClick={() => setCurrentPage('services')}
                    className="flex-1 bg-gray-500 text-white p-4 rounded-xl text-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  {/*<button */}
                  {/*  onClick={handleDelete}*/}
                  {/*  disabled={loading}*/}
                  {/*  className="flex-1 bg-red-500 text-white p-4 rounded-xl text-lg font-semibold hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"*/}
                  {/*>*/}
                  {/*  🗑️ Delete*/}
                  {/*</button>*/}
                </>
              )}
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#217964] to-[#1a5d4e] text-white p-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isEditMode ? ' Update Service' : ' Create Service'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
