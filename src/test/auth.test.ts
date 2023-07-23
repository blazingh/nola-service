import { createAdminToken } from '@/utils/tokenHelper';
import axios from 'axios';

// Replace this URL with your API endpoint
const apiUrl = 'http://localhost:3000';

const {token: adminToken} = createAdminToken();

const userData = {
  email: 'hadibabaki@hadi.com',
  phone: '09123456789',
  password: "q1w2e3r4!"
};

let userId = 0;

let userToken = ""

describe('Testing Auth', () => {

  describe('[POST] /signup/email', () => {
    it('response should have the Create userData', async () => {
      const response = await axios.post(`${apiUrl}/auth/signup/email`, userData);

      expect(response.status).toEqual(201);
      expect(response.data.data).toHaveProperty('id');
      expect(response.data.data).toHaveProperty('email');
      expect(response.data.data).toHaveProperty('password');

      userId = response.data.data.id;

    });
  });

  describe('[POST] /signup/email', () => {
    it('response should give error for user exist', async () => {
      try{
      const response = await axios.post(`${apiUrl}/auth/signup/email`, userData);

      console.log(response);
      }catch(error){
      expect(error.response.status).toEqual(409);
      }

    });
  });

  describe('[delete] /admin/user', () => {
    it('response should have the delete userData', async () => {
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
