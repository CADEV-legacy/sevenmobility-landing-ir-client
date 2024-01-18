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
  black: '#000000',
  white: '#ffffff',
  grayScale1: '#00000099',
  grayScale2: '#00000061',
  grayScale10: '#1D1A22',
  grayScale20: '#322F37',
  grayScale30: '#49454F',
  grayScale40: '#605D66',
  grayScale50: '#79747E',
  grayScale60: '#938F99',
  grayScale70: '#AEA9B4',
  grayScale80: '#CAC4D0',
  grayScale90: '#E7E0EC',
  grayScale95: '#F5EEFA',
  grayScale99: '#FFFBFE',
  grayScale100: '#FFFFFF',
  save: '#D30000',
  saveHover: '#ED2939',
  systemError: '#FF0000',
  systemInfo: '#1700FF',
  systemTag: '#00376B',
  whiteAlpha: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
  blackAlpha: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
} as const;
