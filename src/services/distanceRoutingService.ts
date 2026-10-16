import { Coordinates, VehicleType } from '@/types'

export interface ResolvedLocation {
  title: string
  subtitle: string
  fullAddress: string
  landmark?: string
  coords: Coordinates
  city: string
  isExactMatch?: boolean
}

export interface RouteEstimation {
  distanceKm: number
  durationMin: number
  method: 'google' | 'osrm' | 'calibrated_road'
  formattedDistance: string
  formattedDuration: string
  isIntercity: boolean
  encodedPolyline?: string
  polylinePoints?: Array<{ lat: number; lng: number }>
}

/**
 * Decodes Google's Encoded Polyline format into an array of { lat, lng } points
 */
export function decodePolyline(encoded: string): Array<{ lat: number; lng: number }> {
  if (!encoded) return []
  const poly: Array<{ lat: number; lng: number }> = []
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b
    let shift = 0
    let result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lng += dlng

    poly.push({ lat: Number((lat / 1e5).toFixed(6)), lng: Number((lng / 1e5).toFixed(6)) })
  }
  return poly
}

/**
 * Curated Database of High-Traffic Gujarat & Pan-India Logistics Hubs,
 * Universities, Colleges, Industrial Parks, and Landmarks.
 */
export const KNOWN_LOGISTICS_HUBS: ResolvedLocation[] = [
  // --- Anand & Vallabh Vidyanagar Hubs ---
  {
    title: 'A. D. Patel Institute of Technology (ADIT)',
    subtitle: 'CVM University Engineering Campus, New Vallabh Vidyanagar',
    fullAddress: 'A. D. Patel Institute of Technology (ADIT), New Vallabh Vidyanagar, Anand, Gujarat 388121',
    landmark: 'Behind CVM Satellite Campus',
    coords: { lat: 22.54607, lng: 72.9818 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'G H Patel College of Engineering & Technology (GCET)',
    subtitle: 'Bakrol Road, Vallabh Vidyanagar',
    fullAddress: 'G H Patel College of Engineering & Technology (GCET), Bakrol Road, Vallabh Vidyanagar, Anand, Gujarat 388120',
    landmark: 'Opposite BVM Boys Hostel, Bakrol Road',
    coords: { lat: 22.5528, lng: 72.9242 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Birla Vishvakarma Mahavidyalaya (BVM)',
    subtitle: 'Mota Bazar, Vallabh Vidyanagar',
    fullAddress: 'Birla Vishvakarma Mahavidyalaya (BVM Engineering College), Vallabh Vidyanagar, Anand, Gujarat 388120',
    landmark: 'Near Nana Bazar Post Office',
    coords: { lat: 22.5535, lng: 72.9240 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Sardar Patel University (SPU)',
    subtitle: 'University Road, Vallabh Vidyanagar',
    fullAddress: 'Sardar Patel University (SPU), University Road, Vallabh Vidyanagar, Anand, Gujarat 388120',
    landmark: 'Near SPU Central Library & Vice Chancellor Office',
    coords: { lat: 22.5558, lng: 72.9258 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Charotar University of Science and Technology (CHARUSAT)',
    subtitle: 'Education Campus, Changa',
    fullAddress: 'Charotar University of Science and Technology (CHARUSAT), Changa, Anand, Gujarat 388421',
    landmark: 'Near Petlad-Nadiad Road Crossing',
    coords: { lat: 22.6000, lng: 72.8200 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Anand Agricultural University (AAU)',
    subtitle: 'Borsad Chokdi, Anand',
    fullAddress: 'Anand Agricultural University (AAU) Main Campus, Borsad Chokdi, Anand, Gujarat 388110',
    landmark: 'Opposite Veterinary College Gate',
    coords: { lat: 22.5435, lng: 72.9698 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Amul Dairy & Plant',
    subtitle: 'Amul Dairy Road, Anand',
    fullAddress: 'Amul Dairy Head Office & Plant, Amul Dairy Road, Anand, Gujarat 388001',
    landmark: 'Near Amul Chocolate Factory & Museum',
    coords: { lat: 22.5590, lng: 72.9510 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Anand Junction Railway Station',
    subtitle: 'Station Road, Anand',
    fullAddress: 'Anand Junction Railway Station, Station Road, Anand, Gujarat 388001',
    landmark: 'Platform 1 Main Gate / Parcel Office',
    coords: { lat: 22.5645, lng: 72.9580 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Bakrol Cross Roads Commercial Hub',
    subtitle: 'Bakrol Road, Vallabh Vidyanagar',
    fullAddress: 'Bakrol Circle Commercial Complex, Bakrol Road, Vallabh Vidyanagar, Anand, Gujarat 388315',
    landmark: 'Near Vadtal Junction & Reliance Petrol Pump',
    coords: { lat: 22.5490, lng: 72.9350 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Karamsad (Pramukh Swami Hospital)',
    subtitle: 'Gokal Nagar, Karamsad',
    fullAddress: 'Pramukh Swami Medical College & Hospital, Gokal Nagar, Karamsad, Anand, Gujarat 388325',
    landmark: 'Shree Krishna Hospital Gate 1',
    coords: { lat: 22.5450, lng: 72.8980 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Zydus Hospitals, Anand',
    subtitle: 'Anand-Lambhvel Road, Nanikhodiyar',
    fullAddress: 'Zydus Hospitals, Anand-Lambhvel Road, Nanikhodiyar, Anand, Gujarat 388001',
    landmark: 'Near Lambhvel Hanuman Temple',
    coords: { lat: 22.566719, lng: 72.945839 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'DMart, Vallabh Vidyanagar',
    subtitle: 'Railway Station Road, Vallabh Vidyanagar',
    fullAddress: 'DMart, Sigma Complex, Railway Station Road, Vallabh Vidyanagar, Anand, Gujarat 388120',
    landmark: 'Near Sardar Vallabhbhai Patel Statue',
    coords: { lat: 22.546924, lng: 72.929146 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Borsad Chokdi, Anand',
    subtitle: 'Jitodia Road, Anand',
    fullAddress: 'Borsad Chokdi, Jitodia Road, Anand, Gujarat 388001',
    landmark: 'Near Highway Overbridge & Express Highway Exit',
    coords: { lat: 22.540848, lng: 72.955653 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Iskcon Temple, Vallabh Vidyanagar',
    subtitle: 'Mota Bazaar, Vallabh Vidyanagar',
    fullAddress: 'ISKCON Temple, University Road, Vallabh Vidyanagar, Anand, Gujarat 388120',
    landmark: 'Opposite Nana Bazaar Post Office',
    coords: { lat: 22.5512, lng: 72.9215 },
    city: 'Anand',
    isExactMatch: true,
  },
  {
    title: 'Vitthal Udyognagar GIDC Industrial Estate',
    subtitle: 'GIDC, Vitthal Udyognagar, Anand',
    fullAddress: 'Vitthal Udyognagar GIDC Industrial Estate, Phase 1 & 2, Anand, Gujarat 388121',
    landmark: 'Near GIDC Fire Station & Elecon Engineering',
    coords: { lat: 22.5280, lng: 72.9150 },
    city: 'Anand',
    isExactMatch: true,
  },

  // --- Nadiad Hubs ---
  {
    title: 'Nadiad Santram Mandir & City Center',
    subtitle: 'Santram Road, Nadiad',
    fullAddress: 'Santram Temple Area, Santram Road, Nadiad, Kheda, Gujarat 387001',
    landmark: 'Near Santram Bhakt Nivas',
    coords: { lat: 22.6916, lng: 72.8634 },
    city: 'Nadiad',
    isExactMatch: true,
  },
  {
    title: 'Dharmsinh Desai University (DDU)',
    subtitle: 'College Road, Nadiad',
    fullAddress: 'Dharmsinh Desai University (DDU), College Road, Nadiad, Gujarat 387001',
    landmark: 'Near Nadiad Railway Crossing',
    coords: { lat: 22.6802, lng: 72.8795 },
    city: 'Nadiad',
    isExactMatch: true,
  },

  // --- Ahmedabad Metro Hubs ---
  {
    title: 'Shivam Residency, Satellite',
    subtitle: 'Satellite, Ahmedabad',
    fullAddress: 'A-402, Shivam Residency, Behind Shyamal Cross Road, Satellite, Ahmedabad, Gujarat 380015',
    landmark: 'Opposite Shell Petrol Pump',
    coords: { lat: 23.0125, lng: 72.5285 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Pinnacle Business Hub, Navrangpura',
    subtitle: 'Navrangpura, Ahmedabad',
    fullAddress: '6th Floor, Pinnacle Business Hub, Near Mithakhali Six Roads, Navrangpura, Ahmedabad, Gujarat 380009',
    landmark: 'Next to Central Bank of India',
    coords: { lat: 23.0338, lng: 72.5615 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Titanium City Centre, Anandnagar',
    subtitle: 'Prahlad Nagar / Satellite, Ahmedabad',
    fullAddress: 'B-Wing Titanium City Centre, 100 Feet Anandnagar Road, Prahlad Nagar, Ahmedabad, Gujarat 380015',
    landmark: 'Near Sachin Tower',
    coords: { lat: 23.0142, lng: 72.5188 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Iscon Mega Mall, SG Highway',
    subtitle: 'SG Highway, Bodakdev, Ahmedabad',
    fullAddress: 'Near Iscon Cross Road, Sarkhej - Gandhinagar Highway, Bodakdev, Ahmedabad, Gujarat 380054',
    landmark: 'Opposite Rajpath Club',
    coords: { lat: 23.0289, lng: 72.5065 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'SOBO Center, South Bopal',
    subtitle: 'South Bopal, Ahmedabad',
    fullAddress: 'SOBO Center, Gala Gymkhana Road, South Bopal, Ahmedabad, Gujarat 380058',
    landmark: 'Near TRP Mall',
    coords: { lat: 23.0245, lng: 72.4632 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Vraj Vihar Bungalows, Bodakdev',
    subtitle: 'Bodakdev, Ahmedabad',
    fullAddress: 'B-12, Vraj Vihar Bungalows, Judges Bungalow Road, Bodakdev, Ahmedabad, Gujarat 380054',
    landmark: 'Behind Pakwan Dining Hall',
    coords: { lat: 23.0392, lng: 72.518 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Shed 12, Gujarat Industrial Estate, Changodar',
    subtitle: 'Changodar Industrial Zone, Ahmedabad',
    fullAddress: 'Shed 12, Gujarat Industrial Estate, Sarkhej-Bavla Road, Changodar, Ahmedabad, Gujarat 382213',
    landmark: 'Near Changodar Overbridge',
    coords: { lat: 22.921, lng: 72.441 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Narendra Modi Stadium, Motera',
    subtitle: 'Motera / Sabarmati, Ahmedabad',
    fullAddress: 'Stadium Road, Motera, Sabarmati, Ahmedabad, Gujarat 380005',
    landmark: 'Near Motera Metro Station Gate 2',
    coords: { lat: 23.0924, lng: 72.5975 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Kankaria Lake Front Gate 3, Maninagar',
    subtitle: 'Maninagar, Ahmedabad',
    fullAddress: 'Shop 18, Radhe Shopping Center, Near Kankaria Gate 3, Maninagar, Ahmedabad, Gujarat 380008',
    landmark: 'Near Balvatika Circle & Football Ground',
    coords: { lat: 22.9975, lng: 72.6025 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Sindhu Bhavan Road (SBR)',
    subtitle: 'Thaltej, Ahmedabad',
    fullAddress: 'SBR Social Tower, Sindhu Bhavan Marg, PRL Colony, Thaltej, Ahmedabad, Gujarat 380059',
    landmark: 'Near Taj Skyline Hotel',
    coords: { lat: 23.0478, lng: 72.5015 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Vastrapur Lake / Ahmedabad One Mall',
    subtitle: 'Vastrapur, Ahmedabad',
    fullAddress: 'Near AlphaOne Ahmedabad One Mall, Vastrapur, Ahmedabad, Gujarat 380054',
    landmark: 'Vastrapur Amphitheatre Entrance',
    coords: { lat: 23.0375, lng: 72.531 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Gota Flyover Commercial Hub',
    subtitle: 'Gota, Ahmedabad',
    fullAddress: 'Vandematram Cross Road, New SG Road, Gota, Ahmedabad, Gujarat 382481',
    landmark: 'Behind Shayona City',
    coords: { lat: 23.0985, lng: 72.5365 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },
  {
    title: 'Gandhi Ashram, Sabarmati',
    subtitle: 'Ashram Road, Ahmedabad',
    fullAddress: 'Hridaya Kunj, Gandhi Smarak Sangrahalaya, Ashram Road, Ahmedabad, Gujarat 380027',
    landmark: 'Near Vadaj Bus Terminal',
    coords: { lat: 23.0605, lng: 72.5802 },
    city: 'Ahmedabad',
    isExactMatch: true,
  },

  // --- Gandhinagar Hubs ---
  {
    title: 'GIFT City (Gujarat International Finance Tec-City)',
    subtitle: 'GIFT City, Gandhinagar',
    fullAddress: 'GIFT Tower 1 & 2, GIFT City Road, Gandhinagar, Gujarat 382355',
    landmark: 'Near GIFT Club & Bridge',
    coords: { lat: 23.1611, lng: 72.6842 },
    city: 'Gandhinagar',
    isExactMatch: true,
  },
  {
    title: 'Pandit Deendayal Energy University (PDEU)',
    subtitle: 'Raisan, Gandhinagar',
    fullAddress: 'PDEU Campus, Knowledge Corridor, Raisan, Gandhinagar, Gujarat 382007',
    landmark: 'Near Bhaijipura Cross Road',
    coords: { lat: 23.1557, lng: 72.6669 },
    city: 'Gandhinagar',
    isExactMatch: true,
  },
  {
    title: 'Infocity IT Park, Gandhinagar',
    subtitle: 'Infocity, Sector 0, Gandhinagar',
    fullAddress: 'Infocity Super Mall, Infocity IT Park, Sector 0, Gandhinagar, Gujarat 382007',
    landmark: 'Near GH-0 Circle',
    coords: { lat: 23.1906, lng: 72.6288 },
    city: 'Gandhinagar',
    isExactMatch: true,
  },

  // --- Vadodara Hubs ---
  {
    title: 'Alkapuri Business District, Vadodara',
    subtitle: 'Alkapuri, Vadodara',
    fullAddress: 'RC Dutt Road, Alkapuri, Vadodara, Gujarat 390007',
    landmark: 'Near Vadodara Central Mall',
    coords: { lat: 22.3108, lng: 73.1712 },
    city: 'Vadodara',
    isExactMatch: true,
  },
  {
    title: 'Sayajigunj & Vadodara Railway Station',
    subtitle: 'Sayajigunj, Vadodara',
    fullAddress: 'Station Road, Sayajigunj, Vadodara, Gujarat 390020',
    landmark: 'Near Sayaji Baug Zoo Entrance',
    coords: { lat: 22.3129, lng: 73.1812 },
    city: 'Vadodara',
    isExactMatch: true,
  },
  {
    title: 'Makarpura GIDC Industrial Area',
    subtitle: 'Makarpura, Vadodara',
    fullAddress: 'Makarpura GIDC Main Road, Vadodara, Gujarat 390010',
    landmark: 'Near Makarpura Depot',
    coords: { lat: 22.2514, lng: 73.1944 },
    city: 'Vadodara',
    isExactMatch: true,
  },

  // --- Surat Hubs ---
  {
    title: 'Ring Road Textile Market, Surat',
    subtitle: 'Ring Road, Surat',
    fullAddress: 'Surat Textile Market (STM), Ring Road, Surat, Gujarat 395002',
    landmark: 'Near Sahara Darwaja',
    coords: { lat: 21.1959, lng: 72.8464 },
    city: 'Surat',
    isExactMatch: true,
  },
  {
    title: 'Vesu Commercial Corridor, Surat',
    subtitle: 'VIP Road, Vesu, Surat',
    fullAddress: 'VIP Road, Vesu, Surat, Gujarat 395007',
    landmark: 'Near Surat Airport Road Junction',
    coords: { lat: 21.1418, lng: 72.7758 },
    city: 'Surat',
    isExactMatch: true,
  },
  {
    title: 'Adajan Commercial Hub, Surat',
    subtitle: 'Anand Mahal Road, Adajan, Surat',
    fullAddress: 'Prime Arcade, Anand Mahal Road, Adajan, Surat, Gujarat 395009',
    landmark: 'Near Gujarat Gas Circle',
    coords: { lat: 21.1925, lng: 72.7954 },
    city: 'Surat',
    isExactMatch: true,
  },

  // --- Rajkot Hubs ---
  {
    title: 'Yagnik Road Commercial Center, Rajkot',
    subtitle: 'Dr. Yagnik Road, Rajkot',
    fullAddress: 'Imperial Heights, Dr. Yagnik Road, Rajkot, Gujarat 360001',
    landmark: 'Near Jagnath Plot',
    coords: { lat: 22.2965, lng: 70.7981 },
    city: 'Rajkot',
    isExactMatch: true,
  },
  {
    title: 'Crystal Mall, Kalawad Road, Rajkot',
    subtitle: 'Kalawad Road, Rajkot',
    fullAddress: 'Crystal Mall, Opp. Rani Tower, Kalawad Road, Rajkot, Gujarat 360005',
    landmark: 'Near KKV Hall Circle',
    coords: { lat: 22.2789, lng: 70.7675 },
    city: 'Rajkot',
    isExactMatch: true,
  },

  // --- Mumbai Hubs ---
  {
    title: 'Bandra Kurla Complex (BKC), Mumbai',
    subtitle: 'G Block, Bandra East, Mumbai',
    fullAddress: 'Bandra Kurla Complex (BKC), Bandra East, Mumbai, Maharashtra 400051',
    landmark: 'Near Bharat Diamond Bourse & ICICI Towers',
    coords: { lat: 19.0657, lng: 72.8688 },
    city: 'Mumbai',
    isExactMatch: true,
  },
  {
    title: 'Andheri West (Lokhandwala / Link Road)',
    subtitle: 'Andheri West, Mumbai',
    fullAddress: 'Infinity Mall, New Link Road, Andheri West, Mumbai, Maharashtra 400053',
    landmark: 'Opp. Oshiwara Police Station',
    coords: { lat: 19.1412, lng: 72.8315 },
    city: 'Mumbai',
    isExactMatch: true,
  },
  {
    title: 'Andheri East (MIDC / SEEPZ)',
    subtitle: 'Chakala, Andheri East, Mumbai',
    fullAddress: 'MIDC Central Road, Chakala, Andheri East, Mumbai, Maharashtra 400093',
    landmark: 'Near Chakala Metro Station',
    coords: { lat: 19.1172, lng: 72.8682 },
    city: 'Mumbai',
    isExactMatch: true,
  },
  {
    title: 'Powai (Hiranandani Gardens), Mumbai',
    subtitle: 'Hiranandani Gardens, Powai, Mumbai',
    fullAddress: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
    landmark: 'Near Galleria Shopping Mall',
    coords: { lat: 19.1197, lng: 72.9056 },
    city: 'Mumbai',
    isExactMatch: true,
  },
  {
    title: 'Chhatrapati Shivaji Maharaj International Airport (BOM)',
    subtitle: 'Terminal 2, Sahar, Andheri East, Mumbai',
    fullAddress: 'CSMIA Terminal 2, Sahar Road, Andheri East, Mumbai, Maharashtra 400099',
    landmark: 'Terminal 2 Departures Gate 4',
    coords: { lat: 19.0896, lng: 72.8656 },
    city: 'Mumbai',
    isExactMatch: true,
  },

  // --- Delhi / NCR Hubs ---
  {
    title: 'Connaught Place (CP), New Delhi',
    subtitle: 'Inner Circle, Connaught Place, New Delhi',
    fullAddress: 'Inner Circle, Connaught Place, New Delhi, Delhi 110001',
    landmark: 'Near Rajiv Chowk Metro Gate 5',
    coords: { lat: 28.6315, lng: 77.2167 },
    city: 'Delhi',
    isExactMatch: true,
  },
  {
    title: 'Cyber City, DLF Phase 2, Gurugram',
    subtitle: 'DLF Cyber City, Sector 24, Gurugram',
    fullAddress: 'Building 10, DLF Cyber City, Sector 24, Gurugram, Haryana 122002',
    landmark: 'Near Cyber Hub & IndusInd Rapid Metro',
    coords: { lat: 28.4952, lng: 77.0895 },
    city: 'Delhi',
    isExactMatch: true,
  },
  {
    title: 'Sector 18 Commercial Hub, Noida',
    subtitle: 'Atta Market, Sector 18, Noida',
    fullAddress: 'Sector 18 Commercial Complex, Noida, Uttar Pradesh 201301',
    landmark: 'Near Wave Mall & Sector 18 Metro',
    coords: { lat: 28.5708, lng: 77.3218 },
    city: 'Delhi',
    isExactMatch: true,
  },

  // --- Bengaluru Hubs ---
  {
    title: 'Koramangala (80 Feet Road), Bengaluru',
    subtitle: '4th Block, Koramangala, Bengaluru',
    fullAddress: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    landmark: 'Near Sony World Signal',
    coords: { lat: 12.9344, lng: 77.6288 },
    city: 'Bangalore',
    isExactMatch: true,
  },
  {
    title: 'Indiranagar (100 Feet Road), Bengaluru',
    subtitle: 'HAL 2nd Stage, Indiranagar, Bengaluru',
    fullAddress: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    landmark: 'Near 12th Main Junction',
    coords: { lat: 12.9719, lng: 77.6412 },
    city: 'Bangalore',
    isExactMatch: true,
  },
  {
    title: 'Whitefield (ITPL Tech Park), Bengaluru',
    subtitle: 'ITPL Main Road, Whitefield, Bengaluru',
    fullAddress: 'International Tech Park (ITPL), Whitefield Main Road, Bengaluru, Karnataka 560066',
    landmark: 'Opposite Park Square Mall',
    coords: { lat: 12.9866, lng: 77.7303 },
    city: 'Bangalore',
    isExactMatch: true,
  },

  // --- Pune Hubs ---
  {
    title: 'Hinjewadi Infotech Park Phase 1, Pune',
    subtitle: 'Rajiv Gandhi Infotech Park, Hinjewadi, Pune',
    fullAddress: 'Phase 1, Hinjewadi Infotech Park, Pune, Maharashtra 411057',
    landmark: 'Near Shivaji Chowk Hinjewadi',
    coords: { lat: 18.5913, lng: 73.7389 },
    city: 'Pune',
    isExactMatch: true,
  },
  {
    title: 'Viman Nagar / Phoenix Marketcity, Pune',
    subtitle: 'Viman Nagar, Pune',
    fullAddress: 'Phoenix Marketcity, Nagar Road, Viman Nagar, Pune, Maharashtra 411014',
    landmark: 'Near Clover Park',
    coords: { lat: 18.5621, lng: 73.9168 },
    city: 'Pune',
    isExactMatch: true,
  },

  // --- Hyderabad Hubs ---
  {
    title: 'Hitec City (Cyber Towers), Hyderabad',
    subtitle: 'Madhapur, Hitec City, Hyderabad',
    fullAddress: 'Cyber Towers, Hitec City Main Road, Madhapur, Hyderabad, Telangana 500081',
    landmark: 'Near Hitec City Metro Station',
    coords: { lat: 17.4504, lng: 78.3808 },
    city: 'Hyderabad',
    isExactMatch: true,
  },
]

/**
 * City Centers for inter-city fallback and distance resolution
 */
export const CITY_COORDINATES: Record<string, Coordinates> = {
  anand: { lat: 22.5645, lng: 72.958 },
  vidyanagar: { lat: 22.5528, lng: 72.9242 },
  nadiad: { lat: 22.6916, lng: 72.8634 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  gandhinagar: { lat: 23.2156, lng: 72.6369 },
  vadodara: { lat: 22.3072, lng: 73.1812 },
  surat: { lat: 21.1702, lng: 72.8311 },
  rajkot: { lat: 22.3039, lng: 70.8022 },
  bhavnagar: { lat: 21.7645, lng: 72.1519 },
  jamnagar: { lat: 22.4707, lng: 70.0577 },
  bharuch: { lat: 21.7051, lng: 72.9959 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  delhi: { lat: 28.6139, lng: 77.209 },
  gurgaon: { lat: 28.4595, lng: 77.0266 },
  noida: { lat: 28.5355, lng: 77.391 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  indore: { lat: 22.7196, lng: 75.8577 },
}

/**
 * Normalizes text to lowercase alphanumeric tokens for robust comparison
 */
function normalizeTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1)
}

/**
 * Generates a deterministic geographic offset based on address text.
 * Ensures that two different unknown addresses in the same city are rendered
 * at distinct, realistic spots (e.g. 2 - 6 km apart) rather than collapsing onto 0 km!
 */
function getDeterministicOffset(seedText: string, radiusKm = 3.5): { latOffset: number; lngOffset: number } {
  let hash = 0
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash << 5) - hash + seedText.charCodeAt(i)
    hash |= 0
  }
  const angle = (Math.abs(hash) % 360) * (Math.PI / 180)
  const distKm = 0.8 + (Math.abs(hash >> 3) % Math.round(radiusKm * 10)) / 10
  // 1 deg lat ~ 111 km, 1 deg lng ~ 102 km at 23N
  const latOffset = (distKm / 111) * Math.sin(angle)
  const lngOffset = (distKm / 102) * Math.cos(angle)

  return {
    latOffset: Number(latOffset.toFixed(5)),
    lngOffset: Number(lngOffset.toFixed(5)),
  }
}

/**
 * Searches the curated database of landmarks for autocomplete and geocoding
 */
export function searchKnownLocations(query: string, maxResults = 8): ResolvedLocation[] {
  if (!query || query.trim().length < 2) {
    return KNOWN_LOGISTICS_HUBS.slice(0, maxResults)
  }

  const queryLower = query.toLowerCase().trim()
  const queryTokens = normalizeTokens(query)

  // Direct special keyword alias matches
  const hasAdit = queryTokens.includes('adit') || queryLower.includes('a d patel') || queryLower.includes('a. d. patel')
  const hasGcet = queryTokens.includes('gcet') || queryLower.includes('g h patel') || queryLower.includes('g. h. patel')
  const hasBvm = queryTokens.includes('bvm') || queryLower.includes('birla vishvakarma')
  const hasSpu = queryTokens.includes('spu') || queryLower.includes('sardar patel university')
  const hasCharusat = queryTokens.includes('charusat') || queryLower.includes('changa')

  const scored = KNOWN_LOGISTICS_HUBS.map((hub) => {
    let score = 0
    const titleLower = hub.title.toLowerCase()
    const subtitleLower = hub.subtitle.toLowerCase()
    const addressLower = hub.fullAddress.toLowerCase()
    const cityLower = hub.city.toLowerCase()
    const hubText = `${titleLower} ${subtitleLower} ${addressLower} ${hub.landmark || ''} ${cityLower}`

    if (hasAdit && hub.title.includes('ADIT')) score += 120
    if (hasGcet && hub.title.includes('GCET')) score += 120
    if (hasBvm && hub.title.includes('BVM')) score += 120
    if (hasSpu && hub.title.includes('SPU')) score += 120
    if (hasCharusat && hub.title.includes('CHARUSAT')) score += 120

    if (titleLower.startsWith(queryLower)) score += 150
    else if (titleLower.includes(queryLower)) score += 80
    else if (addressLower.includes(queryLower)) score += 50

    queryTokens.forEach((token) => {
      if (titleLower.includes(token)) {
        score += token.length >= 4 ? 20 : 8
      } else if (cityLower === token) {
        score += 15
      } else if (hubText.includes(token)) {
        score += 6
      }
    })

    return { hub, score }
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  if (scored.length > 0) {
    return scored.slice(0, maxResults).map((s) => s.hub)
  }

  return []
}

/**
 * Resolves address text to precise real-world coordinates and metadata.
 * Uses a 5-tier resilient resolution pipeline:
 * 1. Curated Gujarat/National Logistics Hub match (e.g. ADIT, GCET, SPU, Satellite)
 * 2. Active Google Maps Geocoder if Google Maps API is initialized in browser
 * 3. Photon Autocomplete Geocoder (Ultra-fast OpenStreetMap API, zero CORS issues, global coverage)
 * 4. Google Places API (New) Text Search via Local Move Backend Proxy
 * 5. OpenStreetMap Nominatim Geocoder
 * 6. Smart City/District parser with deterministic local street offset
 */
export async function resolveAddressCoordinates(addressText: string): Promise<ResolvedLocation> {
  const clean = addressText.trim()
  if (!clean) {
    return {
      title: 'Current Location',
      subtitle: 'Anand, Gujarat',
      fullAddress: 'Anand, Gujarat',
      coords: { lat: 22.5528, lng: 72.9242 },
      city: 'Anand',
    }
  }

  // Tier 1: Check known database
  const matches = searchKnownLocations(clean, 1)
  if (matches.length > 0 && matches[0].isExactMatch) {
    const m = matches[0]
    return {
      title: m.title,
      subtitle: m.subtitle,
      fullAddress: clean.length > m.fullAddress.length ? clean : m.fullAddress,
      landmark: m.landmark,
      coords: m.coords,
      city: m.city,
      isExactMatch: true,
    }
  }

  // Specific check for ADIT & GCET keywords even if extra words are typed
  const lower = clean.toLowerCase()
  if (lower.includes('adit') || lower.includes('a d patel') || lower.includes('a. d. patel') || lower.includes('a.d. patel')) {
    const hub = KNOWN_LOGISTICS_HUBS.find((h) => h.title.includes('ADIT'))
    if (hub) {
      return {
        title: 'A. D. Patel Institute of Technology (ADIT)',
        subtitle: 'New Vallabh Vidyanagar, Anand',
        fullAddress: clean,
        landmark: hub.landmark,
        coords: hub.coords,
        city: 'Anand',
        isExactMatch: true,
      }
    }
  }

  if (lower.includes('gcet') || lower.includes('g h patel') || lower.includes('g. h. patel') || lower.includes('g.h. patel')) {
    const hub = KNOWN_LOGISTICS_HUBS.find((h) => h.title.includes('GCET'))
    if (hub) {
      return {
        title: 'G H Patel College of Engineering & Technology (GCET)',
        subtitle: 'Bakrol Road, Vallabh Vidyanagar, Anand',
        fullAddress: clean,
        landmark: hub.landmark,
        coords: hub.coords,
        city: 'Anand',
        isExactMatch: true,
      }
    }
  }

  // Tier 2: Check Google Maps Geocoder if loaded in window
  const win = typeof window !== 'undefined' ? (window as any) : null
  if (win?.google?.maps?.Geocoder) {
    try {
      const geocoder = new win.google.maps.Geocoder()
      const geoResult = await new Promise<any>((resolve) => {
        geocoder.geocode(
          { address: clean, componentRestrictions: { country: 'in' } },
          (results: any, status: any) => {
            if (status === 'OK' && results?.[0]?.geometry?.location) {
              resolve(results[0])
            } else {
              resolve(null)
            }
          },
        )
      })

      if (geoResult?.geometry?.location) {
        const lat = Number(geoResult.geometry.location.lat().toFixed(5))
        const lng = Number(geoResult.geometry.location.lng().toFixed(5))
        return {
          title: clean.split(',')[0] || clean,
          subtitle: geoResult.formatted_address,
          fullAddress: geoResult.formatted_address || clean,
          coords: { lat, lng },
          city: extractCityFromAddress(geoResult.formatted_address || clean),
          isExactMatch: true,
        }
      }
    } catch {}
  }

  // Tier 3: Photon Autocomplete Geocoder (Ultra-fast OpenStreetMap API, no CORS issues, no key needed)
  if (typeof fetch !== 'undefined') {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(clean)}&limit=1`,
        { signal: controller.signal },
      )
      clearTimeout(timeoutId)
      if (res.ok) {
        const data = await res.json()
        const feat = data?.features?.[0]
        if (feat?.geometry?.coordinates && feat.geometry.coordinates.length >= 2) {
          const lng = Number(feat.geometry.coordinates[0].toFixed(5))
          const lat = Number(feat.geometry.coordinates[1].toFixed(5))
          const props = feat.properties || {}
          const city = props.city || props.district || props.state || extractCityFromAddress(clean)
          const name = props.name || clean.split(',')[0]
          return {
            title: name,
            subtitle: [props.street, props.city, props.state].filter(Boolean).join(', ') || clean,
            fullAddress: clean,
            coords: { lat, lng },
            city,
            isExactMatch: true,
          }
        }
      }
    } catch {}
  }

  // Tier 4: Real Google Places API (New) Text Search via Local Move Backend Proxy (if backend is running)
  if (typeof fetch !== 'undefined') {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200)
      const res = await fetch('/api/v1/maps/places-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: clean }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (res.ok) {
        const json = await res.json()
        const places = json?.data?.places || json?.places
        if (Array.isArray(places) && places.length > 0) {
          const top = places[0]
          return {
            title: top.title,
            subtitle: top.subtitle || top.fullAddress,
            fullAddress: top.fullAddress || clean,
            landmark: top.subtitle,
            coords: top.coords,
            city: top.city || extractCityFromAddress(top.fullAddress || clean),
            isExactMatch: true,
          }
        }
      }
    } catch {}
  }

  // Tier 5: OpenStreetMap Nominatim Geocoder
  if (typeof fetch !== 'undefined') {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1600)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          clean + ', India',
        )}&format=json&limit=1`,
        {
          signal: controller.signal,
          headers: { 'Accept-Language': 'en' },
        },
      )
      clearTimeout(timeoutId)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
          const lat = Number(parseFloat(data[0].lat).toFixed(5))
          const lng = Number(parseFloat(data[0].lon).toFixed(5))
          return {
            title: clean.split(',')[0] || clean,
            subtitle: data[0].display_name,
            fullAddress: clean,
            coords: { lat, lng },
            city: extractCityFromAddress(data[0].display_name || clean),
            isExactMatch: true,
          }
        }
      }
    } catch {}
  }

  // Tier 6: City detection and deterministic geographic hashing
  const city = extractCityFromAddress(clean)
  const baseCoords = CITY_COORDINATES[city.toLowerCase()] || CITY_COORDINATES.anand || CITY_COORDINATES.ahmedabad
  const { latOffset, lngOffset } = getDeterministicOffset(clean, 3.0)

  return {
    title: clean.split(',')[0] || clean,
    subtitle: `${city}, India`,
    fullAddress: clean,
    coords: {
      lat: Number((baseCoords.lat + latOffset).toFixed(5)),
      lng: Number((baseCoords.lng + lngOffset).toFixed(5)),
    },
    city,
    isExactMatch: false,
  }
}

/**
 * Extracts city name from an address string
 */
export function extractCityFromAddress(address: string): string {
  const lower = address.toLowerCase()
  if (
    lower.includes('vidyanagar') ||
    lower.includes('anand') ||
    lower.includes('bakrol') ||
    lower.includes('karamsad') ||
    lower.includes('adit') ||
    lower.includes('gcet') ||
    lower.includes('bvm') ||
    lower.includes('spu') ||
    lower.includes('changa')
  ) {
    return 'Anand'
  }
  if (lower.includes('nadiad')) return 'Nadiad'
  if (lower.includes('gandhinagar') || lower.includes('gift city') || lower.includes('pdeu') || lower.includes('infocity')) {
    return 'Gandhinagar'
  }
  if (lower.includes('vadodara') || lower.includes('baroda') || lower.includes('alkapuri') || lower.includes('makarpura')) {
    return 'Vadodara'
  }
  if (lower.includes('surat') || lower.includes('vesu') || lower.includes('adajan') || lower.includes('varachha')) return 'Surat'
  if (lower.includes('rajkot')) return 'Rajkot'
  if (lower.includes('bhavnagar')) return 'Bhavnagar'
  if (lower.includes('jamnagar')) return 'Jamnagar'
  if (
    lower.includes('mumbai') ||
    lower.includes('andheri') ||
    lower.includes('bandra') ||
    lower.includes('thane') ||
    lower.includes('powai') ||
    lower.includes('borivali') ||
    lower.includes('dadar') ||
    lower.includes('bkc')
  ) {
    return 'Mumbai'
  }
  if (lower.includes('pune') || lower.includes('hinjewadi') || lower.includes('kothrud') || lower.includes('viman nagar')) return 'Pune'
  if (
    lower.includes('delhi') ||
    lower.includes('noida') ||
    lower.includes('gurgaon') ||
    lower.includes('gurugram') ||
    lower.includes('saket') ||
    lower.includes('dwarka') ||
    lower.includes('connaught')
  ) {
    return 'Delhi'
  }
  if (
    lower.includes('bangalore') ||
    lower.includes('bengaluru') ||
    lower.includes('koramangala') ||
    lower.includes('indiranagar') ||
    lower.includes('whitefield') ||
    lower.includes('hsr layout')
  ) {
    return 'Bangalore'
  }
  if (lower.includes('hyderabad') || lower.includes('secunderabad') || lower.includes('hitec') || lower.includes('gachibowli')) return 'Hyderabad'
  if (lower.includes('chennai') || lower.includes('adyar') || lower.includes('velachery')) return 'Chennai'
  if (lower.includes('kolkata') || lower.includes('howrah') || lower.includes('salt lake')) return 'Kolkata'
  if (lower.includes('jaipur')) return 'Jaipur'
  if (
    lower.includes('satellite') ||
    lower.includes('navrangpura') ||
    lower.includes('bopal') ||
    lower.includes('bodakdev') ||
    lower.includes('vastrapur') ||
    lower.includes('prahlad') ||
    lower.includes('changodar') ||
    lower.includes('motera') ||
    lower.includes('maninagar') ||
    lower.includes('gota') ||
    lower.includes('ahmedabad')
  ) {
    return 'Ahmedabad'
  }

  return 'Gujarat'
}

/**
 * High-accuracy Great-Circle Distance (Haversine formula in Kilometers)
 */
export function calculateStraightDistanceKm(c1: Coordinates, c2: Coordinates): number {
  if (!c1 || !c2 || !Number.isFinite(c1.lat) || !Number.isFinite(c2.lat)) {
    return 1.0
  }

  const R = 6371 // Earth radius in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180
  const dLon = ((c2.lng - c1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Synchronous Real Driving Distance & ETA Calculator with dynamic Indian road circuity:
 * - Urban local trips (straight line < 15 km): 1.35x circuity factor (street turns, city grid)
 * - Sub-urban / arterial trips (15 to 45 km): 1.28x circuity factor
 * - Intercity / Highway trips (> 45 km): 1.22x circuity factor (expressways, NH roads)
 *
 * Provides instant, physically realistic distance for UI reactivity.
 */
export function calculateAccurateRouteDistanceSync(
  c1: Coordinates,
  c2: Coordinates,
  vehicleType: VehicleType = 'mini_truck',
): RouteEstimation {
  const straight = calculateStraightDistanceKm(c1, c2)

  let roadFactor = 1.35
  let isIntercity = false

  if (straight > 45) {
    roadFactor = 1.22
    isIntercity = true
  } else if (straight > 15) {
    roadFactor = 1.28
  }

  // Calculate actual road km with minimum 1.2 km threshold for logistics deployment
  const rawRoadKm = straight * roadFactor
  const distanceKm = Number(Math.max(1.2, rawRoadKm).toFixed(1))

  // Realistic vehicle transit speeds
  let avgSpeedKmph = 24
  let handlingBufferMin = 8

  switch (vehicleType) {
    case 'bike':
      avgSpeedKmph = isIntercity ? 45 : 30
      handlingBufferMin = 5
      break
    case 'cargo_auto':
      avgSpeedKmph = isIntercity ? 38 : 25
      handlingBufferMin = 8
      break
    case 'mini_truck':
      avgSpeedKmph = isIntercity ? 42 : 23
      handlingBufferMin = 12
      break
    case 'large_tempo':
      avgSpeedKmph = isIntercity ? 40 : 20
      handlingBufferMin = 18
      break
    case 'truck_eicher':
      avgSpeedKmph = isIntercity ? 38 : 18
      handlingBufferMin = 25
      break
  }

  const travelMinutes = Math.round((distanceKm / avgSpeedKmph) * 60)
  const durationMin = Math.max(5, travelMinutes + handlingBufferMin)

  return {
    distanceKm,
    durationMin,
    method: 'calibrated_road',
    formattedDistance: `${distanceKm} km`,
    formattedDuration: formatMinutesToReadable(durationMin),
    isIntercity,
  }
}

/**
 * Asynchronous Route Distance Estimator:
 * Attempts real road route from Google Maps or OSRM, falling back to calibrated road routing.
 */
export async function calculateAccurateRouteDistance(
  c1: Coordinates,
  c2: Coordinates,
  vehicleType: VehicleType = 'mini_truck',
): Promise<RouteEstimation> {
  const syncFallback = calculateAccurateRouteDistanceSync(c1, c2, vehicleType)

  // 1. Try Google Routes API (New) via Local Move API
  if (typeof fetch !== 'undefined') {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)
      const res = await fetch('/api/v1/maps/compute-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: { lat: c1.lat, lng: c1.lng },
          destination: { lat: c2.lat, lng: c2.lng },
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      if (res.ok) {
        const json = await res.json()
        const data = json?.data || json
        if (data?.distanceMeters && data.distanceMeters > 100) {
          const distanceKm = data.distanceKm || Number((data.distanceMeters / 1000).toFixed(1))
          const durationMin = data.durationMinutes || Math.max(5, Math.round(data.durationSeconds / 60))
          const encodedPolyline = data.encodedPolyline || ''
          const polylinePoints = encodedPolyline ? decodePolyline(encodedPolyline) : undefined
          return {
            distanceKm,
            durationMin,
            method: 'google',
            formattedDistance: `${distanceKm} km`,
            formattedDuration: formatMinutesToReadable(durationMin),
            isIntercity: distanceKm > 45,
            encodedPolyline,
            polylinePoints,
          }
        }
      }
    } catch {}
  }

  // 2. Try Google Maps Directions if active in browser
  const win = typeof window !== 'undefined' ? (window as any) : null
  if (win?.google?.maps?.DirectionsService) {
    try {
      const directionsService = new win.google.maps.DirectionsService()
      const gResult = await new Promise<any>((resolve) => {
        directionsService.route(
          {
            origin: { lat: c1.lat, lng: c1.lng },
            destination: { lat: c2.lat, lng: c2.lng },
            travelMode: win.google.maps.TravelMode.DRIVING,
          },
          (res: any, status: any) => {
            if (status === 'OK' && res?.routes?.[0]?.legs?.[0]) {
              resolve(res.routes[0].legs[0])
            } else {
              resolve(null)
            }
          },
        )
      })

      if (gResult) {
        const meters = gResult.distance?.value || 0
        const seconds = gResult.duration?.value || 0
        if (meters > 500) {
          const distanceKm = Number((meters / 1000).toFixed(1))
          const durationMin = Math.max(5, Math.round(seconds / 60))
          return {
            distanceKm,
            durationMin,
            method: 'google',
            formattedDistance: `${distanceKm} km`,
            formattedDuration: formatMinutesToReadable(durationMin),
            isIntercity: distanceKm > 45,
          }
        }
      }
    } catch {}
  }

  // 2. Try Public OSRM Real Road Router (Free public route service)
  if (typeof fetch !== 'undefined') {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1800)
      const url = `https://router.project-osrm.org/route/v1/driving/${c1.lng},${c1.lat};${c2.lng},${c2.lat}?overview=false`
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        if (data.code === 'Ok' && data.routes?.[0]) {
          const meters = data.routes[0].distance
          const seconds = data.routes[0].duration
          if (meters > 400) {
            const distanceKm = Number((meters / 1000).toFixed(1))
            const durationMin = Math.max(5, Math.round(seconds / 60) + 6)
            return {
              distanceKm,
              durationMin,
              method: 'osrm',
              formattedDistance: `${distanceKm} km`,
              formattedDuration: formatMinutesToReadable(durationMin),
              isIntercity: distanceKm > 45,
            }
          }
        }
      }
    } catch {}
  }

  return syncFallback
}

function formatMinutesToReadable(min: number): string {
  if (min < 60) return `~${min} mins`
  const hours = Math.floor(min / 60)
  const remaining = min % 60
  return remaining > 0 ? `~${hours}h ${remaining}m` : `~${hours}h`
}
