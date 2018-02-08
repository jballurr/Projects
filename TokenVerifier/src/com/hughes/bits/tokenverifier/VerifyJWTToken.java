package com.hughes.bits.tokenverifier;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.xml.bind.DatatypeConverter;

import org.apache.log4j.Logger;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;

public class VerifyJWTToken {

	private final static Logger logger = Logger.getLogger(VerifyJWTToken.class);

	 public static String ENCODE_KEY = "xZv2ZiV9KoYNmMD33KnUtA==";
	//Sample method to validate and read the JWT
	public static String parseJWT(String jwt, String san)
	{
	    String isVerified = "Error : Invlid Token";
	    
		//This line will throw an exception if it is not a signed JWS (as expected)
	    try{
	    	Claims claims = Jwts.parser().setSigningKey(DatatypeConverter.parseBase64Binary(ENCODE_KEY))
	    			.parseClaimsJws(jwt)
	    			.getBody();
	    	
		    String hashsan = hashSAN(san);
		    if(hashsan != "" && hashsan.equalsIgnoreCase(claims.getSubject())|| claims.getSubject().equalsIgnoreCase(hashSAN("SYSTEM_SAN")))
		    {
		    	logger.debug("VerifyJWTToken : token valid");
		    	isVerified = "true";
		    } else {
		    	logger.debug("VerifyJWTToken : token invalid");

		    	isVerified = "Error : Token is not valid for used SAN";
		    }
		    	    	
	    }
	    catch(Exception ex)
	    {
	    	logger.error("VerifyJWTToken : exception ");
	    	logger.error("VerifyJWTToken :"+ex.getMessage());

	    }
	    
	    return isVerified;
	}
	
	
	public static String hashSAN(String san){
		MessageDigest md;
		System.out.println("IN Hash SAN"+san);
		try {
			md = MessageDigest.getInstance("SHA-256");
			md.update(san.getBytes());
			
			byte[] mdArray = md.digest();
			StringBuilder sb = new StringBuilder(mdArray.length*2);
			for(byte b :mdArray){
				int v = b & 0xff;
				if(v<16){
					sb.append('0');
				}
				sb.append(Integer.toHexString(v));
			}
			return sb.toString();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return e.getMessage();
		}
	
	}

}
