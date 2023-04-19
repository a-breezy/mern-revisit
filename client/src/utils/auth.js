import decode from "jwt-decode";

class AuthService {
	getProfile() {
		return decode(this.getToken());
	}

	// check if user is logged in
	loggedIn() {
		const token = this.getToken();
		return !!token && !this.isTokenExpired(token);
	}

    // check if token has expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true
            } else {
                return false
            }
        } catch (err) {
            return false
        }
    }

    // get token from local storage
    getToken() {
        return localStorage.getItem('id_token')
    }

    // set token to local storage adn reload page to home
    login(idToken) {
        localStorage.setItem('id_token', idToken) 
        window.location.assign('/')
    }

    // clear token from localstorage and force logout with reload
    logout() {
        localStorage.removeItem('id_token')
        window.location.assign('/')
    }
}

export default new AuthService();
