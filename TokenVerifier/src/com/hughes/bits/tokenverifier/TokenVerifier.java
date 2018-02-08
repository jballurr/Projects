package com.hughes.bits.tokenverifier;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.URL;
import java.net.UnknownHostException;

import org.apache.log4j.Logger;


public class TokenVerifier {
	
	private final static Logger logger = Logger.getLogger(TokenVerifier.class);
	
	public static String verifyToken(String token, String tokenType, String san) {
		
		
		String isValidToken = "false";
		if (("JWT").equalsIgnoreCase(tokenType)) {
			logger.debug("TokenVerifier: Token Type Received: JWT");
			isValidToken = VerifyJWTToken.parseJWT(token, san);
		} else {
			logger.debug("TokenVerifier: Token Type Received: OAuth2.0");
			isValidToken = validateTokenOnAuth2(token, san);
		}
		return isValidToken;
	}

	public static String validateTokenOnAuth2(String token, String san) {
		InetAddress ip;
		String ipAddress = null;
		String isValidToken = "false";
		try {
			try {
				// Server IP
				ip = InetAddress.getLocalHost();
				ipAddress = ip.getHostAddress();
				System.out.println("Oauth: Current IP address : " + ipAddress);

			} catch (UnknownHostException ex) {

				ipAddress = "soawsserver";
				ex.printStackTrace();
			}
			String urlFixed = "http://" + ipAddress + ":8081/oauth2/api/validToken/get?san=" + san;
			System.out.println("TokenVerifier: " + urlFixed);
			URL obj = new URL(urlFixed);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("Accept", "application/json");
			con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
			con.setRequestProperty("Authorization", "Bearer " + token);
			int responseCode = con.getResponseCode();
			if (200 == responseCode) {

				System.out.println("print ");
				InputStream inputStream = con.getInputStream();
				BufferedReader rd = new BufferedReader(new InputStreamReader(inputStream));
				StringBuffer response = new StringBuffer();
				System.out.println("TokenVerifier: BufferedReader" + rd.toString());
				String line = "";
				while ((line = rd.readLine()) != null) {
					response.append(line);
					System.out.println("TokenVerifier: response      " + response);
				}
				rd.close();
				isValidToken = response.toString();

			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return isValidToken;
	}

}
