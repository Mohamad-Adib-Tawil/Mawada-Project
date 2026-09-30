/**
 * Wedding content lives here so personal details can be updated without touching
 * presentation or interaction code. Empty values keep optional sections hidden.
 */
export const weddingConfig = Object.freeze({
  groomArabic: 'سليم',
  groomEnglish: 'Salim',
  brideArabic: 'ليان',
  brideEnglish: 'Layan',
  weddingDate: '', // ISO date: YYYY-MM-DD
  startTime: '', // 24-hour local time: HH:MM
  endTime: '',
  timeZone: '', // IANA time zone, e.g. Asia/Damascus
  venue: '',
  address: '',
  mapsUrl: '',
  audience: '',
  dressCode: '',
  guestInstructions: '',
  childrenInvited: null,
  rsvp: {
    enabled: false,
    contactName: '',
    whatsappNumber: '', // International digits only, without +
    deadline: '',
    companionsAllowed: null,
    requestAttendeeCount: false,
    messageTemplate: '',
  },
  invitationVideo: '', // Relative asset path, e.g. assets/video/invitation.mp4
  invitationPoster: '',
  socialPreview: 'assets/images/social-preview.png',
  wording: {
    occasion: 'دعوة بمحبة', // Neutral temporary copy
    opening: 'يسعدنا أن تشاركونا فرحتنا', // Neutral temporary copy
    closing: 'بمحبتكم تكتمل فرحتنا', // Neutral temporary copy
    footer: 'بكل الحب، ننتظركم', // Neutral temporary copy
    share: '',
    familyNames: [],
    story: '',
  },
});
