# HireNest: Premium Flow Verification Guide

This guide outlines the steps to verify the newly implemented Backend and Frontend flows for Company Profiles, Job Postings, and Applications.

## 🚀 Pre-requisites
1.  **Backend Running**: `mvn spring-boot:run` in `jobSite` folder.
2.  **Frontend Running**: `npm run dev` in `HireNest` folder.
3.  **Accounts**:
    *   One **Employer** account (must be verified/approved).
    *   One **Seeker** account (for testing discovery and application).

---

## 🏗️ Phase 1: Employer Branding & Setup
*Goal: Verify that the company identity is correctly established and immutable where required.*

1.  **Login as Employer**: Navigate to `/auth/login`.
2.  **Go to Profile**: Click "Company Profile" in the sidebar (Business Tools) or go to `/employer/profile`.
3.  **Initial View**: Verify that your **Company Name** and **Website** are correctly displayed (these are auto-filled from your verification data).
4.  **Edit Profile**:
    *   Click "Edit Profile".
    *   Add a premium **Description**, set a **Headquarters** location (e.g., "San Francisco, CA"), and upload a **Logo URL**.
    *   Click "Save Profile Changes".
5.  **Verification**: Refresh the page. Ensure all data persisted and the layout looks editorial and premium.

---

## 📝 Phase 2: Job Creation
*Goal: Verify the 3-step posting process and ownership logic.*

1.  **Post a Job**: Navigate to "Post a Job" in the sidebar or go to `/post-job`.
2.  **Step 1 (Basics)**: Enter a title like "Senior AI Resident" and select a category.
3.  **Step 2 (Experience)**: Add requirements and a long-form description.
4.  **Step 3 (Salary)**: Set range (e.g., $150k - $200k) and a deadline.
5.  **Publish**: Click "Verify & Publish".
6.  **Verify Listing**: Go to "Manage Jobs" (`/jobs/manage`). Your new job should appear in the table with "Active" status.

---

## 🔍 Phase 3: Seeker Discovery & Application
*Goal: Verify public visibility and application data integrity.*

1.  **Switch to Seeker**: Log out and log back in with your Seeker account.
2.  **Find Work**: Navigate to `/jobs`.
3.  **Browsing**:
    *   Verify your "Senior AI Resident" job is visible.
    *   Test the **Filters** (e.g., select "Remote" or "Full Time") to ensure the job card responds.
4.  **View Details**: Click "View Details" on the card. Verify all data (Experience, Salary, Company Branding) matches what was posted.
5.  **Apply**:
    *   Click "Apply Now".
    *   Enter a **Cover Letter** (> 100 characters) and an **Expected Salary**.
    *   Submit application.
    *   *System Note: Redirection to /applications confirms success (currently a placeholder).*

---

## 📊 Phase 4: Employer Review Cycle
*Goal: Verify that the employer can access candidate data including auto-filled seeker details.*

1.  **Return to Employer**: Login back as the Employer.
2.  **Track Applicants**: 
    *   Go to "Manage Jobs" (`/jobs/manage`).
    *   You should see the "Applicants" count incremented.
    *   Click "View All" or go to `/applicants?jobId=[ID]`.
3.  **Candidate Review**:
    *   Select the seeker from the left list.
    *   **Verify Auto-filled Data**: Ensure you see the seeker's **Skills**, **CV Link**, and contact details (fetched by the backend update).
    *   **Cover Letter**: Read the submitted cover letter in the premium display area.
4.  **Action**:
    *   Click **Approve** or **Reject**.
    *   Verify the status badge updates instantly.

---

## 💎 Design Consistency Checklist
- [ ] **Serif Typography**: Primary headings use `Playfair Display`.
- [ ] **Glassmorphism**: Modals and cards use subtle blur/border effects.
- [ ] **Micro-animations**: Hover effects on cards and buttons.
- [ ] **Dark Mode**: Toggle theme and ensure readability on all new pages.
