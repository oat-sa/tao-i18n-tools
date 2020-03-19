pipeline {
    agent {
        label 'builder'
    }
    stages {
        stage('Tests') {
            agent {
                docker {
                    image 'node:10.17.0-alpine'
                    reuseNode true
                }
            }
            environment {
                HOME = '.'
            }
            options {
                skipDefaultCheckout()
            }
            steps {
                dir('.') {
                    sh(
                        label: 'Setup frontend toolchain',
                        script: 'npm ci'
                    )
                    sh (
                        label : 'Run frontend tests',
                        script: 'npm test'
                    )
                }
            }
        }
    }
}
