<script lang="ts">
    type Applicant = {
        id: string;
        name: string;
        email: string;
    };

    type Application = {
        id: string;
        applicant: Applicant;
        jobTitle: string;
        companyName: string;
        salaryProposed: number;
        status: 'Pending' | 'Accepted' | 'Denied';
        appliedDate: string;
    };


    let applications = $state<Application[]>([

    ]);
</script>