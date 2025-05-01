import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatcherService } from '../../services/matcher.service';
import { MatchResult } from '../../models/matcher.model';
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
    matchResult: MatchResult | null = null;
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

    getSkillCategories(): string[] {
        if (!this.matchResult?.textResult?.skills) return [];
        return Object.keys(this.matchResult.textResult.skills);
    }

    onCvFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.cvFile = file;
            this.readFileContent(file, 'cv');
        }
    }

    onJobDescriptionFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.jobDescriptionFile = file;
            this.readFileContent(file, 'jobDescription');
        }
    }

    readFileContent(file: File, type: 'cv' | 'jobDescription'): void {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (type === 'cv') {
                this.cvText = content;
                this.matcherForm.get('cvText')?.setValue(content);
            } else {
                this.jobDescriptionText = content;
                this.matcherForm.get('jobDescriptionText')?.setValue(content);
            }
        };
        reader.readAsText(file);
    }

    onCvTextChange(event: any): void {
        this.cvText = event.target.value;
    }

    onJobDescriptionTextChange(event: any): void {
        this.jobDescriptionText = event.target.value;
    }

    onSubmit(): void {
        if (!this.cvText && !this.jobDescriptionText) {
            this.errorMessage = 'Please provide either CV text or job description text.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.matchResult = null;

        this.matcherService.matchCvWithJob(this.cvText, this.jobDescriptionText, this.selectedTemplate).subscribe({
            next: (response: MatchResult) => {
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
        if (!this.matchResult?.pdf_path) return;
        
        this.matcherService.downloadPdf(this.matchResult.pdf_path).subscribe({
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
        
        const result = this.matchResult.textResult;
        let text = 'CV & Job Match Analysis\n\n';
        
        // Personal Info
        text += 'Personal Information:\n';
        text += `Name: ${result.personal_info.name}\n`;
        text += `Title: ${result.personal_info.title}\n`;
        text += `Location: ${result.personal_info.location}\n`;
        text += `Email: ${result.personal_info.email}\n`;
        text += `Phone: ${result.personal_info.phone}\n`;
        text += `Nationality: ${result.personal_info.nationality}\n\n`;
        
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
        result.professional_experience.forEach(exp => {
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
        text += 'Missing Skills:\n';
        result.suggestions.missing_skills.forEach(skill => text += `- ${skill}\n`);
        text += '\nUnder-emphasized Experiences:\n';
        result.suggestions.under_emphasized_experiences.forEach(exp => text += `- ${exp}\n`);
        text += '\nPhrasing Improvements:\n';
        result.suggestions.phrasing_improvements.forEach(imp => text += `- ${imp}\n`);
        text += '\nAdditional Suggestions:\n';
        result.suggestions.additional_suggestions.forEach(sugg => text += `- ${sugg}\n`);
        
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
