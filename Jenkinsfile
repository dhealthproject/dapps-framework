pipeline {
  agent any
  stages {
    stage('Download dependencies') {
      steps {
        echo 'Downloading dependencies...'
        sh 'npm install'
      }
    }

    stage('Lerna bootstrap') {
      steps {
        echo 'Bootstrapping lerna...'
        sh './node_modules/.bin/lerna bootstrap'
      }
    }

    stage('Run linter checks') {
      steps {
        echo 'Running linter checks...'
        sh 'npm run lint'
      }
    }

    stage('Build software') {
      steps {
        echo 'Running compiler...'
        sh 'npm run build'
      }
    }

    stage('Run unit tests') {
      steps {
        echo 'Running unit tests...'
        sh 'npm run test'
      }
    }
  }
}