
# CV Job Matcher

An Angular application that allows users to upload or paste their CV and job description text to get matching analysis.

## Features

- Upload CV file or paste text directly
- Upload job description file or paste text directly
- Submit data to API for analysis
- Display results in a clean interface
- Download results as text or PDF

## Development

### Prerequisites

- Node.js (v14.x or later)
- Angular CLI (v15.x)

### Setup

1. Clone the repository
2. Run \`npm install\` to install dependencies
3. Run \`ng serve\` to start the development server
4. Navigate to \`http://localhost:4200/\` in your browser

### API Configuration

The application is configured to connect to an API endpoint to process the CV and job description data. Configure the API URL in the environment files:

- Development: \`src/environments/environment.ts\`
- Production: \`src/environments/environment.prod.ts\`

## Build

Run \`ng build\` to build the project. The build artifacts will be stored in the \`dist/\` directory.

## Deployment

For production deployment, use:

\`\`\`
ng build --configuration production
\`\`\`

Then deploy the contents of the \`dist/cv-job-matcher\` directory to your web server.