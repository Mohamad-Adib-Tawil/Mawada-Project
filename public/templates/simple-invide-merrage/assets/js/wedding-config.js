/**
 * Wedding content lives here so personal details can be updated without touching
 * presentation or interaction code. Empty values keep optional sections hidden.
 */
export const weddingConfig = Object.freeze({
  groomArabic: 'آدم',
  groomEnglish: 'Adam',
  brideArabic: 'جنى',
  brideEnglish: 'Jana',
  monogramGroomArabic: 'م',
  monogramBrideArabic: 'ر',
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
    enabled: true,
    contactName: '',
    whatsappNumber: '963992688759', // International digits only, without +
    deadline: '',
    companionsAllowed: null,
    requestAttendeeCount: false,
    messageTemplate: '',
  },
  invitationVideo: '', // Relative asset path, e.g. assets/video/invitation.mp4
  invitationPoster: '',
  socialPreview: 'assets/images/social-preview.jpg',
  wording: {
    occasion: 'دعوة بمحبة', // Neutral temporary copy
    opening: 'يسعدنا أن تشاركونا فرحتنا', // Neutral temporary copy
    closing: 'بمحبتكم تكتمل فرحتنا', // Neutral temporary copy
    footer: 'بكل الحب، ننتظركم', // Neutral temporary copy
    heroEyebrow: 'بكل الحب',
    sceneDetailsLead: 'بكل الحب ننتظركم',
    countdownHeading: 'الوقت حتى لقائنا',
    detailsHeading: 'تفاصيل لقائنا',
    detailsSubtitle: 'ننتظر أن نشارككم هذه اللحظات',
    dateHeading: 'الموعد',
    guestNotesHeading: 'ملاحظات للضيوف',
    rsvpEyebrow: 'حضوركم يسعدنا',
    rsvpHeading: 'هل تشاركوننا فرحتنا؟',
    share: '',
    familyNames: [],
    story: '',
  },
});
