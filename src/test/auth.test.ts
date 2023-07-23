import { settingsOptions } from '@/enums/settings';
import { createAdminToken } from '@/utils/tokenHelper';
import axios from 'axios';

// Replace this URL with your API endpoint
const apiUrl = 'http://localhost:3000';

const {token: adminToken} = createAdminToken();

const userData = {
  email: 'test@email.com',
  phone: '0912349956789',
  password: "password123"
};

let userId = 0;

let userToken = ""

let verifactionToken = ""

describe('Testing Auth', () => {

  // disable email signup
  describe('[POST] /admin/setting/:name', () => {
    it('disable email signup', async () => {
      const response = await axios.put(`${apiUrl}/admin/setting/${settingsOptions.DISABLE_EMAIL_SIGNUP}`, { value: "true" }, { headers: { Authorization: `Bearer ${adminToken}` } });
      expect(response.status).toEqual(200);
    });
  });

  // try to signup with email
  describe('[POST] /signup/email', () => {
    it('email signup should be disabled', async () => {
      try{
      const response = await axios.post(`${apiUrl}/auth/signup/email`, userData);
      }catch(error){
      expect(error.response.status).toEqual(403);
      }
    });
  });

  // enable email signup
  describe('[POST] /admin/setting/:name', () => {
    it('enable email signup', async () => {
      const response = await axios.put(`${apiUrl}/admin/setting/${settingsOptions.DISABLE_EMAIL_SIGNUP}`, { value: "false" }, { headers: { Authorization: `Bearer ${adminToken}` } });
      expect(response.status).toEqual(200);
    });
  });

  // signup with email
  describe('[POST] /signup/email', () => {
    it('email signup should be enabled', async () => {
      const response = await axios.post(`${apiUrl}/auth/signup/email`, userData);
      expect(response.status).toEqual(201);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data).toHaveProperty('email');
      expect(response.data.data).toHaveProperty('password');
      userId = response.data.data.id;
      verifactionToken = response.data.token;
    });
  });

  // test duplicate email
  describe('[POST] /signup/email', () => {
    it('duplicate email should give error', async () => {
      try{
      const response = await axios.post(`${apiUrl}/auth/signup/email`, userData);

      console.log(response);
      }catch(error){
      expect(error.response.status).toEqual(409);
      }

    });
  });

  // disallow unverified email login
  describe('[POST] /admin/setting/:name', () => {
    it('disable email login', async () => {
      const response = await axios.put(`${apiUrl}/admin/setting/${settingsOptions.ALLOW_UNVERIFIED_EMAIL_LOGIN}`, { value: "true" }, { headers: { Authorization: `Bearer ${adminToken}` } });
      expect(response.status).toEqual(200);
    });
  });

  // enable email login
  describe('[POST] /admin/setting/:name', () => {
    it('enable email login', async () => {
      const response = await axios.put(`${apiUrl}/admin/setting/${settingsOptions.DISABLE_EMAIL_LOGIN}`, { value: "false" }, { headers: { Authorization: `Bearer ${adminToken}` } });
      expect(response.status).toEqual(200);
    });
  });

  // try to login with email
  describe('[POST] /login/email', () => {
    it('email login should be disabled', async () => {
      try{
      const response = await axios.post(`${apiUrl}/auth/login/email`, userData);
      }catch(error){
      expect(error.response.status).toEqual(403);
      }
    });
  });

  // verify email
  describe('[POST] /verify', () => {
    it('verify email', async () => {
      const response = await axios.get(`${apiUrl}/auth/verify/${verifactionToken}`);
      expect(response.status).toEqual(200);
    });
  });

  // should be able to login with email
  describe('[POST] /login/email', () => {
    it('email login should be enabled', async () => {
      const response = await axios.post(`${apiUrl}/auth/login/email`, userData);
      expect(response.status).toEqual(200);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data).toHaveProperty('email');
    });
  });

  // disable email login
  describe('[POST] /admin/setting/:name', () => {
    it('disable email login', async () => {
      const response = await axios.put(`${apiUrl}/admin/setting/${settingsOptions.DISABLE_EMAIL_LOGIN}`, { value: "true" }, { headers: { Authorization: `Bearer ${adminToken}` } });
      expect(response.status).toEqual(200);
    });
  });

  // try to login with email
  describe('[POST] /login/email', () => {
    it('email login should be disabled', async () => {
      try{
      const response = await axios.post(`${apiUrl}/auth/login/email`, userData);
      }catch(error){
      expect(error.response.status).toEqual(403);
      }
    });
  });

  describe('[delete] /admin/user', () => {
    it('delete user', async () => {
      const response = await axios.delete(`${apiUrl}/admin/user/${userId}`, { headers: { Authorization: `Bearer ${adminToken}` } });

      expect(response.status).toEqual(200);

    });
  })

  describe('[POST] /signup/phone', () => {
    it('response should have the Create userData', async () => {
      const response = await axios.post(`${apiUrl}/auth/signup/phone`, userData);

      expect(response.status).toEqual(201);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data).toHaveProperty('phone');

      userId = response.data.data.id;
    });
  });

  describe('[POST] /signup/phone', () => {
    it('response should give error for user exist', async () => {
      try{
      
      const response = await axios.post(`${apiUrl}/auth/signup/phone`, userData);

      }catch(error){
      expect(error.response.status).toEqual(409);
      }
    });
  });

  describe('[delete] /admin/user', () => {
    it('response should have the delete userData', async () => {
      const response = await axios.delete(`${apiUrl}/admin/user/${userId}`, { headers: { Authorization: `Bearer ${adminToken}` } });

      expect(response.status).toEqual(200);

    })
  })

});
