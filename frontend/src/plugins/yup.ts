import * as yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

declare module 'yup' {
  interface StringSchema extends yup.Schema<string> {
    phoneNumber(): StringSchema;
    password(): StringSchema;
  }
}
interface YupLocaleAdditionalFields {
  string: {
    phoneNumber: any;
    password: any;
  };
}

yup.addMethod(yup.string, 'phoneNumber', function PhoneNumberTestFnOuter() {
  const errorMessage = { key: 'validation.invalid-phone-number' };
  return this.test('test-phone-number', errorMessage, function PhoneNumberTestFn(value) {
    const { path } = this;

    return isValidPhoneNumber(value as string) || this.createError({ path, message: errorMessage });
  });
});

yup.addMethod(yup.string, 'password', function PhoneNumberTestFnOuter() {
  const errorMessage = { key: 'validation.invalid-password' };
  return this.test('test-password', errorMessage, function PhoneNumberTestFn(value) {
    const { path } = this;

    return new RegExp(PASSWORD_REGEX).test(value as string) || this.createError({ path, message: errorMessage });
  });
});

const configuredYupLocale: yup.LocaleObject & YupLocaleAdditionalFields = {
  mixed: {
    default: {
      key: 'validation.invalid',
    },
    required: {
      key: 'validation.required',
    },
    oneOf: {
      key: 'validation.one-of',
    },
    notOneOf: {
      key: 'validation.not-one-of',
    },
    notType: ({ type }) => {
      if (type === 'number')
        return {
          key: 'validation.number',
        };
      return {
        key: 'validation.invalid',
      };
    },
  },
  string: {
    length: ({ length }) => ({
      key: 'validation.length',
      values: { length },
    }),
    min: ({ min }) => ({
      key: 'validation.min',
      values: { min },
    }),
    max: ({ max }) => ({
      key: 'validation.max',
      values: { max },
    }),
    matches: {
      key: 'validation.matches',
    },
    email: {
      key: 'validation.email',
    },
    url: {
      key: 'validation.url',
    },
    uuid: {
      key: 'validation.uuid',
    },
    trim: {
      key: 'validation.trim',
    },
    lowercase: {
      key: 'validation.lowercase',
    },
    uppercase: {
      key: 'validation.uppercase',
    },
    phoneNumber: {
      key: 'validation.phonenumber',
    },
    password: {
      key: 'validation.password-not-match',
    },
  },
  number: {
    min: ({ min }) => ({
      key: 'validation.min-number',
      values: { min },
    }),
    max: ({ max }) => ({
      key: 'validation.max-number',
      values: { max },
    }),
    lessThan: ({ less }) => ({
      key: 'validation.less-than',
      values: { less },
    }),
    moreThan: ({ more }) => ({
      key: 'validation.more-than',
      values: { more },
    }),
    positive: {
      key: 'validation.positive',
    },
    negative: {
      key: 'validation.negative',
    },
    integer: {
      key: 'validation.integer',
    },
  },
  date: {
    min: ({ min }) => ({
      key: 'validation.min-date',
      values: { min },
    }),
    max: ({ max }) => ({
      key: 'validation.max-date',
      values: { max },
    }),
  },
  array: {
    min: ({ min }) => ({
      key: 'validation.min-array',
      values: { min },
    }),
    max: ({ max }) => ({
      key: 'validation.max-array',
      values: { max },
    }),
  },
};

yup.setLocale(configuredYupLocale);

export default yup;
