import dp from './dp/dpSelector';

export const authService = {
  requestOtp: (phone) => {
    return dp.requestOtp(phone);
  },

  signup: (payload) => {
    return dp.signup(payload);
  },
  
  verifyOtp: (phone, otp) => {
    return dp.verifyOtp(phone, otp);
  },
  
  updateProfile: (userId, updatedData) => {
    return dp.updateProfile(userId, updatedData);
  },

  getUsers: () => {
    return dp.getUsers();
  }
};

export default authService;
