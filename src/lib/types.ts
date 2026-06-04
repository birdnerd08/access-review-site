export type AccessNeed =
  | "Power wheelchair"
  | "Manual wheelchair"
  | "Limited stamina / fatigue"
  | "Chronic pain / sitting tolerance"
  | "Heat sensitivity"
  | "Mobility aid"
  | "Companion / caregiver"
  | "Sensory sensitivity"
  | "Service animal";

export type VenueType =
  | "Football Stadium"
  | "Baseball Stadium"
  | "Basketball / Concert Arena"
  | "College Stadium"
  | "Other";

export type EventType =
  | "Football game"
  | "Baseball game"
  | "Basketball game"
  | "Concert"
  | "College sports"
  | "Other stadium event";

export type Recommendation =
  | "Yes"
  | "Maybe, with preparation"
  | "No"
  | "Not sure";

export type ReviewStatus =
  | "pending"
  | "published"
  | "flagged"
  | "hidden";

  export type AccessMarkerType =
  | "accessible_entrance"
  | "accessible_parking"
  | "dropoff_zone"
  | "elevator"
  | "accessible_restroom"
  | "problem_area"
  | "other";

export interface AccessMarker {
  id: string;
  stadiumId: string;
  reviewId?: string | null;
  markerType: AccessMarkerType;
  label: string;
  notes?: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
}
export interface Stadium {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  venueType: VenueType;
  description?: string;
  officialAccessibilityUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
}
export interface Review {
  id: string;
  stadiumId: string;
  eventType: EventType;
  accessNeeds: AccessNeed[];
  overallUsabilityRating: 1 | 2 | 3 | 4 | 5;
  whatWorkedWell: string;
  barriersOrHardMoments: string;
  specificDetailToKnow: string;
  whoItWorksFor: string;
  wouldRecommend: Recommendation;
  seatSection?: string;
  eventDate?: string;
  arrivalMethod?: string;
  parkingOrDropoffNotes?: string;
  bathroomDistanceNotes?: string;
  elevatorExitNotes?: string;
  shadeOrWeatherNotes?: string;
  status: ReviewStatus;
  outdatedFlagCount: number;
  createdAt: string;
}

export interface StadiumSummary extends Stadium {
  averageRating: number;
  reviewCount: number;
  summary: string;
  tags: string[];
  strengths: string[];
  concerns: string[];
  reviewerContext: string;
  seatArea?: string;
  bestFor: string;
  watchOut: string;
}