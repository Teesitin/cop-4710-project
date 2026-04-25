// src/app.d.ts

export {};

declare global {
    // BASE TYPES
    type ID = string;
    type DateString = string;
    type TimestampString = string;

    // STATUS TYPES
    type JobStatus = 'Open' | 'Interviewing' | 'Filled' | 'Closed' | string;
    type ApplicationStatus = 'Pending' | 'Accepted' | 'Denied' | string;

    // JOB
    type JobRow = {
        id: ID;
        title: string;
        status: JobStatus;
        salary?: number | null;
    };

    // APPLICATION
    type ApplicationRow = {
        id: ID;
        name: string;
        email: string;
        jobId?: ID | null;
        job?: JobRow | null;
        salaryProposed?: number | null;
        status: ApplicationStatus;
        appliedDate: DateString;
    };

    // EMPLOYEE
    type EmployeeRow = {
        id: ID;
        name: string;
        email: string;
        role: string;
        jobId?: ID | null;
        originalApplicationId?: ID | null;
        job?: JobRow | null;
        originalApplication?: ApplicationRow | null;
    };

    // INTERVIEW
    type InterviewApplicationRow = {
        id: ID;
        name?: string | null;
        email?: string | null;
        job?: {
            id?: ID | null;
            title?: string | null;
            status?: JobStatus | null;
            salary?: number | null;
        } | null;
    };

    type InterviewRow = {
        id: ID;
        applicationId?: ID | null;
        application?: InterviewApplicationRow | null;
        interviewerName?: string | null;
        interviewStartDate?: TimestampString | null;
        interviewEndDate?: TimestampString | null;
        interviewModality?: string | null;
    };
}