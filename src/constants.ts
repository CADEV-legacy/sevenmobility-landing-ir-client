export const TIME_FORMAT = {
  millisecond: 1,
  seconds: (second: number) => TIME_FORMAT.millisecond * 1000 * second,
  minutes: (minute: number) => TIME_FORMAT.seconds(60) * minute,
  hours: (hour: number) => TIME_FORMAT.minutes(60) * 60 * hour,
  days: (day: number) => TIME_FORMAT.hours(24) * day,
} as const;

export const PATH = {
  home: '/',
  authSignIn: '/auths/sign-in',
  authSignUp: '/auths/sign-up',
} as const;

export const COLOR = {
  background: '#FFFFFF',
  font: '#000000',
} as const;
