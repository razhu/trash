import * as AWS from 'aws-sdk';
import { UserRole } from '../../src/enums/userRole';
import { PrismaService } from '../../src/modules/prisma';

AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });
const cognito = new AWS.CognitoIdentityServiceProvider();

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const adminEmail = process.env.ADMIN_EMAIL;

export async function createAdminUser(prisma: PrismaService) {
  try {
    // Step 1: Check if the user exists in Cognito
    // const existingUserCognito = await checkCognitoUserExists(adminEmail);
    // if (existingUserCognito) {
    //   console.log(
    //     `User ${adminEmail} already exists in Cognito. Skipping creation.`,
    //   );
    //   return successResponse('User already exists in Cognito');
    // }

    // // Step 2: Create Cognito User
    // const createdUserCognito = await createCognitoUser(adminEmail);
    // console.log('Cognito User created:', JSON.stringify(createdUserCognito));

    const cognitoSub = '64d8b488-6091-704c-4ae6-f9161eb69668'; //getCognitoSub(createdUserCognito);
    if (!cognitoSub) {
      throw new Error('Cognito sub not found in the created user attributes.');
    }

    // Step 3: Check if user exists in DB
    const existingUserDB = await checkDBUserExists(prisma, adminEmail);
    if (existingUserDB) {
      console.log(
        `User ${adminEmail} already exists in database. Skipping creation.`,
      );
      return successResponse('User already exists in database');
    }

    // Step 4: Create DB User
    const createdUserDB = await createDBUser(prisma, adminEmail, cognitoSub);
    console.log('Admin user created in DB:', createdUserDB);

    // Step 5: Assign UserRole to User
    await assignRoleToUser(
      prisma,
      createdUserDB,
      UserRole.PANDO_ADMIN || 'Pando Admin',
    );

    return successResponse('User created and assigned role');
  } catch (error) {
    return errorResponse(error as Error, 'Failed to create user'); // FIXED ERROR 1
  } finally {
    await prisma.$disconnect();
  }
}

async function checkCognitoUserExists(
  email: string,
): Promise<AWS.CognitoIdentityServiceProvider.AdminGetUserResponse | null> {
  try {
    const existingUser = await cognito
      .adminGetUser({
        UserPoolId: userPoolId,
        Username: email,
      })
      .promise();
    return existingUser;
  } catch (error: unknown) {
    if ((error as AWS.AWSError).code === 'UserNotFoundException') {
      return null;
    }
    throw error;
  }
}

async function createCognitoUser(
  email: string,
): Promise<AWS.CognitoIdentityServiceProvider.AdminCreateUserResponse> {
  return await cognito
    .adminCreateUser({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        {
          Name: 'custom:roleType',
          Value: UserRole.PANDO_ADMIN || 'Pando Admin',
        },
      ],
    })
    .promise();
}

function getCognitoSub(
  createdUserCognito: AWS.CognitoIdentityServiceProvider.AdminCreateUserResponse,
): string | undefined {
  return createdUserCognito.User?.Attributes?.find(
    (attr) => attr.Name === 'sub',
  )?.Value;
}

async function checkDBUserExists(prisma: PrismaService, email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function createDBUser(
  prisma: PrismaService,
  email: string,
  cognitoSub: string,
) {
  return await prisma.user.create({
    data: {
      cognito_sub: cognitoSub,
      first_name: process.env.ADMIN_FIRST_NAME || '',
      last_name: process.env.ADMIN_LAST_NAME || '',
      email,
      phone_number: process.env.ADMIN_PHONE_NUMBER || null,
      timezone: process.env.ADMIN_TIMEZONE || 'PST',
      last_login: new Date(),
      is_active: true,
    },
  });
}

async function assignRoleToUser(
  prisma: PrismaService,
  user: { id: string; email: string },
  roleName: string,
) {
  const role = await prisma.role.findUnique({
    where: { role_name: roleName },
  });

  if (role) {
    await prisma.userRole.create({
      data: {
        user_id: user.id,
        role_id: role.id,
      },
    });
    console.log(`Assigned role '${roleName}' to user ${user.email}`);
  } else {
    console.error(`UserRole '${roleName}' not found`);
  }
}

function successResponse(message: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message }),
  };
}

function errorResponse(error: Error, message: string) {
  // FIXED ERROR 1
  console.error(message, error);
  return {
    statusCode: 500,
    body: JSON.stringify({ error: message, details: error.message }),
  };
}
