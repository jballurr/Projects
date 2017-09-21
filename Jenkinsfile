node {
   def mvnHome
   stage('Preparation') { 
      // Get code from a GitHub repository
      git 'https://github.com/jballurr/Projects.git'
      // Get the Maven tool.
      
      mvnHome = tool 'M3'
   }
   stage('Build') {
      // Run the maven build
      if (isUnix()) {
         sh "'${mvnHome}/bin/mvn'  -f TokenVerifier/pom.xml clean install -DskipTests"
      } else {
         bat(/"${mvnHome}\bin\mvn" -f TokenVerifier\pom.xml clean install -Dmaven.test.failure.ignore /)
      }
   }
}
