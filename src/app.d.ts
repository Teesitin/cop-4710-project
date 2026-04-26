// src/app.d.ts

export {};

declare global {
    // BASE TYPES
    type ID = string;
    type Timestamp = string;

    // STATUS TYPES
    type JobStatus = 'Open' | 'Interviewing' | 'Filled' | 'Closed' | string;
    type ApplicationStatus = 'Pending' | 'Accepted' | 'Denied' | string;

    // JOB
    type Job = {
        id: ID;
        title: string;
        status: JobStatus;
        salary?: number | null;
    };

    // APPLICATION
    type Application = {
        id: ID;
        name: string;
        email: string;

        job: Job;

        salaryProposed?: number | null;
        status: ApplicationStatus;

        appliedDate: Timestamp;
    };

    // EMPLOYEE
    type Employee = {
        id: ID;
        name: string;
        email: string;
        role: string;

        job: Job;
        originalApplication: Application;
    };

    // INTERVIEW
    type Interview = {
        id: ID;

        application: Application;

        interviewerName?: string | null;
        interviewStartDate?: Timestamp | null;
        interviewEndDate?: Timestamp | null;
        interviewModality?: string | null;
    };
}