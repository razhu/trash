import { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import { UserRole } from '../enums';

type UserAttributes = {
  email: string;
  firstName: string;
  lastName: string;
  cognitoSub: string;
  userRole: UserRole;
};

const attributeMap: Record<string, keyof UserAttributes> = {
  sub: 'cognitoSub',
  email: 'email',
  given_name: 'firstName',
  family_name: 'lastName',
  'custom:roleType': 'userRole',
};

export const extractCognitoUserAttributes = (
  userAttributes?: AttributeType[],
): UserAttributes => {
  const attributes: UserAttributes = {
    email: '',
    firstName: '',
    lastName: '',
    cognitoSub: '',
    userRole: undefined,
  };

  userAttributes?.forEach((attribute: AttributeType) => {
    const mappedKey = attributeMap[attribute.Name];
    if (mappedKey === 'userRole') {
      attributes[mappedKey] = attribute.Value as UserRole;
    } else if (mappedKey) {
      attributes[mappedKey] = attribute.Value;
    }
  });

  return attributes;
};
