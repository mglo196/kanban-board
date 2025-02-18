import { UserLogin } from "../interfaces/UserLogin";

// Function to handle user login
const login = async (userInfo: UserLogin) => {
  try {
    // Send POST request to login route
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('User information not retrieved, check network tab!');
    }


    return data;
  } catch (err) {
    console.error('Error during login:', err);
    return Promise.reject('Could not fetch user info');
  }
};

export { login };
