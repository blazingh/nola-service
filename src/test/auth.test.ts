import { settingsOptions } from '@/enums/settings';
import { createAdminToken } from '@/utils/tokenHelper';
import axios from 'axios';

// Replace this URL with your API endpoint
const apiUrl = 'http://localhost:3000';

const {token: adminToken} = createAdminToken();

const userData = {
  email: 'hadilobabooauuuki@dibaka.com',
  phone: '0912349956789',
  password: "q1w2e3r4!"
};

let userId = 0;

let userToken = ""

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

    });
  });

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
