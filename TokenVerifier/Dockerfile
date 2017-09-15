
# Using pre created Jboss image
FROM jboss-soaserver


ADD soaserver-standalone.xml /opt/jboss/jboss-eap-6.4/soaserver/configuration/


# deploy app
ADD TokenVerifier.jar /opt/jboss/jboss-eap-6.4/soaserver/deployments/
