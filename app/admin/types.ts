export interface RsvpEntry {
  name?: string;
  phone?: string;
  rsvp?: Record<string, string>;
  allergies?: string[];
  other?: string;
  submittedAt?: string;
}
