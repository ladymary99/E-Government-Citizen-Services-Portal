Quick Start GuideGet the E-Government backend running in 5 minutes!
PrerequisitesNode.js installedPostgreSQL installed and running1. Install Dependenciesundefined
npm install 2. Setup DatabaseCreate Databaseundefined

# Login to PostgreSQL

psql -U postgres

# Create database

CREATE DATABASE egovernment_db;

# Exit

\q
Update .envThe .env file already exists. Just update your database password:
undefined
DB_PASSWORD=your_postgres_password

3. Run Migrations & Seedundefined

# Create tables

npm run db:migrate

# Add sample data

npm run db:seed 4. Start Serverundefined
npm run dev
The server will start at: http://localhost:5000 5. Test the APIView API DocumentationOpen in browser: http://localhost:5000/api-docs
Test Loginundefined
curl -X POST http://localhost:5000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "admin@egovernment.gov",
"password": "Admin123!"
}'
Sample CredentialsAdmin
Email: admin@egovernment.govPassword: Admin123!Citizen
Email: john.smith@example.comPassword: Citizen123!Officer
Email: officer1.doi@egovernment.govPassword: Officer123!Common Commandsundefined

# Start development server

npm run dev

# Start production server

npm start

# Run migrations

npm run db:migrate

# Seed database

npm run db:seed

# Reset database (WARNING: deletes all data)

npm run db:reset

API Endpoints (Quick Reference)AuthenticationPOST /api/auth/register - RegisterPOST /api/auth/login - LoginGET /api/auth/profile - Get profileDepartments & ServicesGET /api/departments - Get departmentsGET /api/services - Get servicesRequestsGET /api/requests - Get requestsPOST /api/requests - Create request (Citizen)PATCH /api/requests/:id/status - Update status (Officer)PaymentsPOST /api/payments/simulate - Simulate paymentReportsGET /api/reports/dashboard - Dashboard statsNeed More Help?Full documentation: README.mdSetup guide: SETUP.mdAPI reference: API_REFERENCE.mdSwagger UI: http://localhost:5000/api-docsTroubleshootingDatabase connection error?
Check PostgreSQL is runningVerify password in .envPort already in use?
Change PORT in .envMigration failed?
Drop database and recreate:psql -U postgres
DROP DATABASE egovernment_db;
CREATE DATABASE egovernment_db;
\q
npm run db:migrateYou're all set!
