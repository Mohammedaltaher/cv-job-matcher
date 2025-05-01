import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatcherService } from '../../services/matcher.service';
import { MatchResult, ResumeDto } from '../../models/matcher.model';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-cv-job-matcher',
    templateUrl: './cv-job-matcher.component.html',
    styleUrls: ['./cv-job-matcher.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor]
})
export class CvJobMatcherComponent implements OnInit {
    matcherForm: FormGroup;
    cvText = '';
    jobDescriptionText = '';
    cvFile: File | null = null;
    jobDescriptionFile: File | null = null;
    matchResult: ResumeDto | null = null;
    isLoading = false;
    errorMessage = '';
    selectedTemplate = 'classic';
    templates = [
        { value: 'classic', label: 'Classic' },
        { value: 'vivid_vision', label: 'Vivid Vision' },
        { value: 'mono_slate', label: 'Mono Slate' },
        { value: 'slate_lite', label: 'Slate Lite' }
    ];

    constructor(
        private fb: FormBuilder,
        private matcherService: MatcherService
    ) {
        this.matcherForm = this.fb.group({
            cvText: [''],
            jobDescriptionText: [''],
            template: ['classic']
        });
    }

    ngOnInit(): void { }

    onCvFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.cvFile = file;
        }
    }

    onJobDescriptionFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.jobDescriptionFile = file;
        }
    }

    onCvTextChange(event: any): void {
        this.cvText = event.target.value;
    }

    onJobDescriptionTextChange(event: any): void {
        this.jobDescriptionText = event.target.value;
    }

    onSubmit(): void {
        if (!this.cvText && !this.cvFile && !this.jobDescriptionText && !this.jobDescriptionFile) {
            this.errorMessage = 'Please provide either CV text/file or job description text/file.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.matchResult = null;

        this.matcherService.matchCvWithJob(
            this.cvFile,
            this.jobDescriptionFile,
            this.cvText,
            this.jobDescriptionText,
            this.selectedTemplate
        ).subscribe({
            next: (response: ResumeDto) => {
                this.isLoading = false;
                this.matchResult = response;
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = 'An error occurred. Please try again.';
                console.error('Error submitting data:', error);
            }
        });
    }

    downloadPdf(): void {
        if (!this.matchResult?.pdfPath) return;
        
        this.matcherService.downloadPdf(this.matchResult.pdfPath).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cv.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            },
            error: (error) => {
                this.errorMessage = 'Error downloading PDF. Please try again.';
                console.error('Error downloading PDF:', error);
            }
        });
    }

    downloadResult(): void {
        if (!this.matchResult) return;
        
        const resultText = this.formatResultForDownload();
        const element = document.createElement('a');
        const file = new Blob([resultText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'cv-job-match-analysis.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    private formatResultForDownload(): string {
        if (!this.matchResult) return '';
        
        const result = this.matchResult  ;
        let text = 'CV & Job Match Analysis\n\n';
        
        // Personal Info
        text += 'Personal Information:\n';
        text += `Name: ${result.personalInfo.name}\n`;
        text += `Title: ${result.personalInfo.title}\n`;
        text += `Location: ${result.personalInfo.location}\n`;
        text += `Email: ${result.personalInfo.email}\n`;
        text += `Phone: ${result.personalInfo.phone}\n`;
        text += `Nationality: ${result.personalInfo.nationality}\n\n`;
        
        // Profile
        text += 'Profile:\n';
        text += `${result.profile}\n\n`;
        
        // Skills
        text += 'Skills:\n';
        Object.entries(result.skills).forEach(([category, skills]: [string, string[]]) => {
            text += `${category}:\n`;
            skills.forEach(skill => text += `- ${skill}\n`);
            text += '\n';
        });
        
        // Professional Experience
        text += 'Professional Experience:\n';
        result.professionalExperiences.forEach(exp => {
            text += `\nRole: ${exp.role}\n`;
            text += `Company: ${exp.company}\n`;
            text += `Duration: ${exp.duration}\n`;
            text += `Location: ${exp.location}\n`;
            text += `Tools: ${exp.tools}\n`;
            text += `Description: ${exp.description}\n`;
            text += 'Achievements:\n';
            exp.achievements.forEach(achievement => text += `- ${achievement}\n`);
            text += 'Projects:\n';
            exp.projects.forEach(project => {
                text += `- ${project.name}: ${project.description}\n`;
            });
        });
        text += '\n';
        
        // Education
        text += 'Education:\n';
        result.education.forEach(edu => {
            text += `\nDegree: ${edu.degree}\n`;
            text += `Institution: ${edu.institution}\n`;
            text += `Location: ${edu.location}\n`;
            text += `Year: ${edu.year}\n`;
        });
        text += '\n';
        
        // Languages
        text += 'Languages:\n';
        result.languages.forEach(lang => text += `- ${lang}\n`);
        text += '\n';
        
        // Suggestions
        text += 'Suggestions for Improvement:\n';
        text += 'Interview Focus Tips:\n';
        result.agentNotes.interviewFocusTips.forEach(skill => text += `- ${skill}\n`);
        text += '\nSummary of Changes:\n';
        result.agentNotes.summaryOfChanges.forEach(exp => text += `- ${exp}\n`);
        
        return text;
    }

    clearForm(): void {
        this.matcherForm.reset();
        this.cvText = '';
        this.jobDescriptionText = '';
        this.cvFile = null;
        this.jobDescriptionFile = null;
        this.matchResult = null;
        this.errorMessage = '';
    }
}
