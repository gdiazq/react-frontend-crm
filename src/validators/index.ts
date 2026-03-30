export { EMAIL_REGEX, selectRequiredRule } from './shared.validators'
export {
  loginValidationRules,
  registerValidationRules,
  verifyEmailValidationRules,
  preLoginValidationRules,
  loginCredentialsValidationRules,
} from './auth.validators'
export { settingsUpdateProfileValidationRules } from './settings.validators'
export { usersCreateValidationRules } from './users.validators'
export { employeesCreateValidationRules } from './employees.validators'
export { contractsCreateValidationRules } from './contracts.validators'
export { projectsCreateValidationRules } from './projects.validators'
export {
  rolesCreateValidationRules,
  projectStatusesCreateValidationRules,
  projectSpecialtiesCreateValidationRules,
  projectTypesCreateValidationRules,
} from './entity-name.validators'
