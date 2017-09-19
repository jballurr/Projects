node {
   def mvnHome
   stage('Preparation') { // for display purposes
      // Get some code from a GitHub repository
      git 'https://jravi@www.hnsdevops.com/scm/scm/dsspop/dsspop.git'
      // Get the Maven tool.
      // ** NOTE: This 'M3' Maven tool must be configured
      // **       in the global configuration.           
      mvnHome = tool 'M3'
   }
   stage('Build') {
      // Run the maven build
      if (isUnix()) {
         sh "'${mvnHome}/bin/mvn'  -f iag/work/POProject/ASRestAPIFrwk/Releases/pom.xml clean install -DskipTests"
      } else {
         bat(/"${mvnHome}\bin\mvn" -f iag\work\POProject\ASRestAPIFrwk\Releases\pom.xml clean install -Dmaven.test.failure.ignore /)
      }
   }
