const request = require('supertest');
const app = require('../server');

const apiRoute = require('./routes/api')
const authRoute = require('./routes/auth')
const migrateRoute = require('./routes/migrate')

describe('POST /auth/register', () => {
  it('should register user successfully with default organisation', async () => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post(`${authRoute}/auth/register`)
      .send(userData)
      .expect(200);

    // Verify response contains expected user details and access token
    expect(response.body.user.firstName).toEqual('John');
    expect(response.body.organisation.name).toEqual("John's Organisation");
    expect(response.body.accessToken).toBeTruthy();
  });

  it('should log the user in successfully with valid credentials', async () => {
    const credentials = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post(`${authRoute}/auth/login`)
      .send(credentials)
      .expect(200);

    // Verify response contains expected user details and access token
    expect(response.body.user.firstName).toEqual('John');
    expect(response.body.accessToken).toBeTruthy();
  });

  it('should fail if required fields are missing', async () => {
    const invalidUserData = {
      // Missing firstName, lastName, email, password
    };

    const response = await request(app)
      .post(`${authRoute}/auth/register`)
      .send(invalidUserData)
      .expect(422);

    // Verify response contains appropriate error messages
    expect(response.body.error).toContain('firstName');
    expect(response.body.error).toContain('lastName');
    expect(response.body.error).toContain('email');
    expect(response.body.error).toContain('password');
  });

  it('should fail if there is duplicate email or userID', async () => {
    const duplicateUserData = {
      userid: '1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john.doe@example.com', // Use the same email as before
      password: 'password456',
    };

    const response = await request(app)
      .post(`${authRoute}/auth/register`)
      .send(duplicateUserData)
      .expect(422);

    // Verify response contains appropriate error messages
    expect(response.body.error).toContain('Email already exists');
    // Add similar checks for userID if applicable
  });
});
