import { validateEmail, validateNewPassword, validatePassword, validateConfirmPassword, validateBirthdate, validateName, validateText } from '../src/utils/validation';

describe('user input validation', () => {
  test.each(['', 'a@', 'a@@b.com', 'a@b..com', '.a@b.com', 'a..b@c.com', 'a@-b.com', 'a b@c.com'])('rejects invalid email %s', value => {
    expect(validateEmail(value)).not.toBeNull();
  });
  test.each([' user+tag@example.co.in ', 'first.last@example.com'])('accepts valid email %s', value => {
    expect(validateEmail(value)).toBeNull();
  });
  test('requires passwords without imposing signup rules on existing logins', () => {
    expect(validatePassword('   ')).not.toBeNull();
    expect(validatePassword('short')).toBeNull();
    expect(validateNewPassword('short')).not.toBeNull();
    expect(validateNewPassword('long enough')).toBeNull();
    expect(validateConfirmPassword('secret', 'Secret')).not.toBeNull();
    expect(validateConfirmPassword('secret', 'secret')).toBeNull();
  });
  test.each(['02/29/2023', '04/31/2020', '13/01/2020', '00/00/2000', '01/01/0000', '1/1/2020', '01/01/2030'])('rejects invalid birthdate %s', value => {
    expect(validateBirthdate(value, new Date(2026, 8, 16))).not.toBeNull();
  });
  test('accepts leap day and today', () => {
    expect(validateBirthdate('02/29/2024')).toBeNull();
    expect(validateBirthdate('09/16/2026', new Date(2026, 8, 16))).toBeNull();
  });
  test('checks names and text boundaries without restricting international names', () => {
    expect(validateName('   ')).not.toBeNull();
    expect(validateName('a'.repeat(51))).not.toBeNull();
    expect(validateName('नितिन')).toBeNull();
    expect(validateName("O'Brien")).toBeNull();
    expect(validateText(' ', 'Answer', 1000)).not.toBeNull();
    expect(validateText('a'.repeat(1001), 'Answer', 1000)).not.toBeNull();
    expect(validateText('a'.repeat(1000), 'Answer', 1000)).toBeNull();
  });
});
