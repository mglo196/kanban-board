import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    //return the decoded token
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  loggedIn() {
    // return a value that indicates if the user is logged in
    const token = this.getToken();
    // If token exists and is not expired, user is logged in
    return !!token && !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    // return a value that indicates if the token is expired
    try {
      const decoded: JwtPayload = jwtDecode(token);
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        // Token has expired
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  getToken(): string {
    // return the token
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string) {
    // set the token to localStorage
    localStorage.setItem('id_token', idToken);
    //redirect to the home page
    window.location.href = '/'; // Redirect to home page
  }

  logout() {
    //remove the token from localStorage
    localStorage.removeItem('id_token');
    //redirect to the home page
    window.location.href = '/login';
  }
}

export default new AuthService();
