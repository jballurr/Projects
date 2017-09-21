node {
   def mvnHome
   stage('Preparation') { 
      // Get code from a GitHub repository
      git 'https://github.com/jballurr/Projects.git'
      // Get the Maven tool.
      
      mvnHome = tool 'M3'
   }
   stage('Build war') {
      // Run the maven build
      if (isUnix()) {
         sh "'${mvnHome}/bin/mvn'  -f TokenVerifier/pom.xml clean install -DskipTests"
      } else {
         bat(/"${mvnHome}\bin\mvn" -f TokenVerifier\pom.xml clean install -Dmaven.test.failure.ignore /)
      }
   }
   stage ('Build Docker'){
   
      echo 'Building Docker Image'
      bat "cp target/TokenVerifier.jar ./tmp-docker-build-context"
   
   
   }
   
}
