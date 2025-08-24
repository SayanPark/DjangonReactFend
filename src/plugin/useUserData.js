import React from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

function useUserData() {
    // Retrieve the access token and refresh token from browser cookies
    let access_token = Cookies.get("access_token");
    let refresh_token = Cookies.get("refresh_token");

    if (access_token && refresh_token) {
        try {
            // Both access and refresh tokens exist
            // Decode the refresh token to extract user information
            const token = refresh_token;
            const decoded = jwtDecode(token);

            // Return the decoded user data, which may include user information
            return decoded;
        } catch (error) {
            console.error("Failed to decode refresh token:", error);
            return undefined;
        }
    } else {
        // Tokens missing
        return undefined;
    }
}

export default useUserData;
