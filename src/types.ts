export interface Invitation {
  id: number;
  slug: string;
  groomNameAr: string;
  groomNameEn: string;
  brideNameAr: string;
  brideNameEn: string;
  titleAr: string;
  titleEn: string;
  eventDate: string;
  venueNameAr: string;
  venueNameEn: string;
  venueAddress: string;
  venueMapUrl?: string;
  configJson?: string;
  isActive: boolean;
  createdAt: string;
  messagesCount: number;
}

export interface GuestMessage {
  id: number;
  invitationId: number;
  guestName: string;
  attendanceStatus: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
}

export interface CreateGuestMessage {
  guestName: string;
  attendanceStatus: string;
  message: string;
}

export type CalligraphyStyle = 'script' | 'royal' | 'editorial';
export type PaperMode = 'parchment' | 'night';

