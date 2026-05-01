# StayNest PG / Hostel Management Software - Implementation Plan

## 1. Current Project State

The project already has a working base for a React + Spring Boot application:

- Frontend: Vite, React, React Router, Bootstrap-style UI, protected routes, login, signup, forgot password, dashboard, tenants, add tenant, and rent pages.
- Backend: Spring Boot, Spring Security, JWT utility, auth controller/service, user entity/repository, MySQL configuration, base audit entity, and global exception handling.
- Database: MySQL with Hibernate `ddl-auto=update`.

The next implementation work should focus on completing the core hostel-management modules before adding advanced features like reminders, reports, and SaaS support.

## 2. Implementation Strategy

Build the product in vertical slices. Each module should include database entity, repository, service, controller, DTOs, frontend API client, pages, forms, validation, and basic testing.

Recommended order:

1. Stabilize authentication and security.
2. Implement room and bed management.
3. Implement tenant management.
4. Implement rent and payment tracking.
5. Implement security deposit management.
6. Add dashboard metrics and reports.
7. Add file upload for tenant documents.
8. Add future operational features.

## 3. Phase 0 - Foundation Cleanup

### Backend Tasks

- Move sensitive values out of `application.properties`.
  - Use environment variables for database password, JWT secret, and mail credentials.
- Finalize JWT request filtering.
  - Add a JWT authentication filter.
  - Validate `Authorization: Bearer <token>` for protected APIs.
  - Keep `/api/auth/**` public.
- Standardize API responses.
  - Success responses should return DTOs.
  - Error responses should return `{ "message": "..." }`.
- Add validation annotations to request DTOs.
  - `@NotBlank`, `@Email`, `@Size`, `@NotNull`.
- Add package structure for each module:
  - `controller`
  - `service`
  - `repository`
  - `entity`
  - `dto`

### Frontend Tasks

- Move API calls into module-based files:
  - `src/api/authApi.js`
  - `src/api/tenantApi.js`
  - `src/api/roomApi.js`
  - `src/api/rentApi.js`
- Add an authenticated API client.
  - Automatically attach JWT token to protected requests.
  - Redirect to login on `401`.
- Organize pages into folders:
  - `pages/tenants`
  - `pages/rooms`
  - `pages/rent`
  - `pages/reports`

### Acceptance Criteria

- Login returns JWT and user details.
- Protected backend APIs reject requests without a valid token.
- Frontend protected pages work after refresh.
- Errors display meaningful messages.

## 4. Phase 1 - Room And Bed Management

Rooms should be implemented before tenants because tenant allocation depends on room and bed availability.

### Backend Entities

#### Room

Fields:

- `id`
- `roomNo`
- `floor`
- `capacity`
- `occupiedCount`
- `rentAmount`
- `status`
- audit fields from `BaseEntity`

#### Bed

Fields:

- `id`
- `room`
- `bedNo`
- `status`
- `tenant`
- audit fields from `BaseEntity`

Recommended enums:

- `RoomStatus`: `AVAILABLE`, `FULL`, `INACTIVE`
- `BedStatus`: `VACANT`, `OCCUPIED`, `INACTIVE`

### Backend APIs

- `GET /api/rooms`
- `POST /api/rooms`
- `GET /api/rooms/{id}`
- `PUT /api/rooms/{id}`
- `DELETE /api/rooms/{id}`
- `GET /api/rooms/available`
- `GET /api/rooms/{id}/beds`

### Frontend Pages

- `RoomList.jsx`
- `AddRoom.jsx`
- `EditRoom.jsx`
- `RoomDetails.jsx`

### Acceptance Criteria

- Admin can create rooms with capacity and rent amount.
- Beds are generated or maintained for each room.
- Room occupancy updates when a bed is assigned or freed.
- UI shows occupied and vacant bed counts.

## 5. Phase 2 - Tenant Management

Tenant management is the core workflow of the application.

### Backend Entity

#### Tenant

Fields:

- `id`
- `fullName`
- `fatherName`
- `mobile`
- `email`
- `aadhaarNo`
- `address`
- `room`
- `bed`
- `checkInDate`
- `checkOutDate`
- `status`
- `photo`
- `idProofFile`
- audit fields from `BaseEntity`

Recommended enum:

- `TenantStatus`: `ACTIVE`, `CHECKED_OUT`, `INACTIVE`

### Backend APIs

- `GET /api/tenants`
- `POST /api/tenants`
- `GET /api/tenants/{id}`
- `PUT /api/tenants/{id}`
- `DELETE /api/tenants/{id}`
- `POST /api/tenants/{id}/check-out`
- `GET /api/tenants/active`

### Frontend Pages

- `TenantList.jsx`
- `AddTenant.jsx`
- `EditTenant.jsx`
- `TenantDetails.jsx`

### Business Rules

- Tenant cannot be assigned to an occupied bed.
- Creating an active tenant should mark the bed as occupied.
- Checking out a tenant should mark the bed as vacant.
- Tenant mobile number should be unique for active tenants.
- Aadhaar number should be optional initially but unique when provided.

### Acceptance Criteria

- Admin can add, edit, view, and check out tenants.
- Tenant list supports search by name, mobile, room, and status.
- Tenant details show room, bed, rent, payment history, and deposit details.

## 6. Phase 3 - Rent And Payment Management

### Backend Entity

#### RentPayment

Fields:

- `id`
- `tenant`
- `month`
- `year`
- `rentAmount`
- `dueDate`
- `paidDate`
- `paymentMode`
- `status`
- `lateFee`
- `remarks`
- audit fields from `BaseEntity`

Recommended enums:

- `PaymentStatus`: `PENDING`, `PAID`, `PARTIAL`, `OVERDUE`
- `PaymentMode`: `CASH`, `UPI`, `BANK_TRANSFER`, `CARD`, `OTHER`

### Backend APIs

- `GET /api/rent`
- `GET /api/rent/pending`
- `GET /api/rent/tenant/{tenantId}`
- `POST /api/rent/generate-monthly`
- `POST /api/rent/{id}/pay`
- `PUT /api/rent/{id}`
- `GET /api/rent/history/{tenantId}`

### Frontend Pages

- `RentList.jsx`
- `PendingRent.jsx`
- `PaymentHistory.jsx`
- `MarkPaymentModal.jsx`
- `ReceiptView.jsx`

### Business Rules

- Rent should be generated monthly for active tenants.
- Rent should use the assigned room rent amount by default.
- Paid rent should store payment mode, paid date, and remarks.
- Overdue status should be calculated after due date.

### Acceptance Criteria

- Admin can see monthly rent list.
- Admin can filter pending, paid, and overdue rents.
- Admin can mark rent as paid.
- Tenant details page shows full payment history.

## 7. Phase 4 - Security Deposit Management

### Backend Entity

#### SecurityDeposit

Fields:

- `id`
- `tenant`
- `depositAmount`
- `paidDate`
- `refundAmount`
- `refundDate`
- `status`
- audit fields from `BaseEntity`

Recommended enum:

- `DepositStatus`: `PAID`, `PARTIAL`, `REFUNDED`, `PENDING`

### Backend APIs

- `GET /api/deposits`
- `GET /api/deposits/tenant/{tenantId}`
- `POST /api/deposits`
- `PUT /api/deposits/{id}`
- `POST /api/deposits/{id}/refund`

### Frontend Tasks

- Add deposit fields to tenant onboarding.
- Show deposit card on tenant details page.
- Add refund action during check-out.

### Acceptance Criteria

- Deposit can be recorded during tenant creation.
- Deposit refund can be tracked at check-out.
- Reports can include deposit collected and refunded amounts.

## 8. Phase 5 - Dashboard And Reports

### Dashboard Metrics

- Total tenants
- Active tenants
- Vacant beds
- Occupied beds
- Pending rent amount
- Monthly collection
- Recent check-ins
- Recent payments

### Backend APIs

- `GET /api/dashboard/summary`
- `GET /api/reports/monthly-income?month=&year=`
- `GET /api/reports/pending-rent`
- `GET /api/reports/tenants`

### Frontend Pages

- `Dashboard.jsx`
- `MonthlyIncomeReport.jsx`
- `PendingRentReport.jsx`
- `TenantReport.jsx`

### Acceptance Criteria

- Dashboard reflects live database values.
- Reports can be filtered by month, year, tenant, room, and status.
- Report tables can be exported later without changing the backend contract.

## 9. Phase 6 - File Uploads

### Backend Tasks

- Add file upload configuration.
- Store files in local `uploads/` folder initially.
- Save only file paths in the database.
- Restrict allowed file types.
  - Images: `.jpg`, `.jpeg`, `.png`
  - Documents: `.pdf`
- Add max file size configuration.

### Backend APIs

- `POST /api/tenants/{id}/photo`
- `POST /api/tenants/{id}/documents`
- `GET /api/files/{fileName}`

### Frontend Tasks

- Add photo upload to tenant form.
- Add ID proof upload to tenant details.
- Preview uploaded files.

### Acceptance Criteria

- Admin can upload tenant photo and ID proof.
- Uploaded files are linked to the tenant record.
- Invalid file types are rejected.

## 10. Phase 7 - Roles And Permissions

### Roles

- `ADMIN`: full access.
- `MANAGER`: tenant, room, rent, and report access.
- `STAFF`: limited read access.

### Backend Tasks

- Add role-based endpoint authorization.
- Add role to JWT claims.
- Add user management APIs later if required.

### Frontend Tasks

- Hide restricted menu items based on role.
- Block restricted pages even if route is typed manually.

### Acceptance Criteria

- Staff cannot modify rent or delete tenants.
- Manager can manage daily operations.
- Admin has full access.

## 11. Phase 8 - Future Enhancements

These features should be added after the core product is stable:

- WhatsApp rent reminders.
- QR code rent payment.
- Complaint management.
- Visitor entry.
- Staff attendance.
- Mobile app.
- Multi-property support.
- Subscription billing.
- AWS S3 file storage.
- Docker deployment.

## 12. Suggested Development Milestones

### Milestone 1: Secure Base

- JWT filter complete.
- Auth error handling complete.
- API client complete.
- Existing pages compile and work.

### Milestone 2: Rooms

- Room and bed entities.
- Room CRUD APIs.
- Room list and form UI.

### Milestone 3: Tenants

- Tenant entity.
- Tenant CRUD APIs.
- Tenant list, form, and details UI.
- Room and bed assignment.

### Milestone 4: Rent

- Rent payment entity.
- Monthly rent generation.
- Pending rent and payment history.
- Mark payment paid workflow.

### Milestone 5: Dashboard

- Summary API.
- Live dashboard metrics.
- Recent activity data.

### Milestone 6: Reports And Files

- Report APIs.
- File upload APIs.
- Tenant document UI.

## 13. Testing Plan

### Backend

- Unit tests for service business rules.
- Controller tests for API response status.
- Repository tests for key queries.
- Manual Postman collection for all core endpoints.

### Frontend

- Validate all forms.
- Test protected route behavior.
- Test API error messages.
- Test tenant check-in and check-out workflow.
- Test rent payment workflow.

### Manual End-To-End Test Flow

1. Register admin user.
2. Login.
3. Create room with beds.
4. Add tenant and assign bed.
5. Verify room occupancy.
6. Generate rent for tenant.
7. Mark rent as paid.
8. View tenant payment history.
9. Check out tenant.
10. Verify bed becomes vacant.

## 14. Recommended Immediate Next Step

Start with Phase 0 and Phase 1:

1. Complete JWT authentication filter.
2. Add authenticated API client in frontend.
3. Implement room and bed backend.
4. Build room list and add-room UI.

After that, tenant onboarding becomes much cleaner because room and bed allocation will already exist.
