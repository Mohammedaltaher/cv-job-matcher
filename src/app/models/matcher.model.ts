export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  nationality: string;
}

export interface Skills {
  [key: string]: string[];
  "Teaching Methodologies": string[];
  "Assessment & Reporting": string[];
  "Communication & Interpersonal": string[];
}

export interface Project {
  name: string;
  description: string;
}

export interface ProfessionalExperience {
  role: string;
  company: string;
  duration: string;
  location: string;
  tools: string;
  description: string;
  achievements: string[];
  projects: Project[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  year: string;
}

export interface Suggestions {
  missing_skills: string[];
  under_emphasized_experiences: string[];
  phrasing_improvements: string[];
  additional_suggestions: string[];
  score:string;
}

export interface TextResult {
  personal_info: PersonalInfo;
  profile: string;
  skills: Skills;
  professional_experience: ProfessionalExperience[];
  education: Education[];
  languages: string[];
  suggestions: Suggestions;
}

export interface ResumeDto {
    id: string;
    pdfPath: string;
    personalInfo: PersonalInfoDto;
    profile: string;
    skills: SkillsDto;
    professionalExperiences: ProfessionalExperienceDto[];
    education: EducationDto[];
    languages: string[];
    agentNotes: AgentNotesDto;
}

export interface PersonalInfoDto {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    nationality: string;
}

export interface SkillsDto {
    categories: CategoryDto[];
}

export interface CategoryDto {
    name: string;
    skills: string[];
}

export interface ProfessionalExperienceDto {
    role: string;
    company: string;
    duration: string;
    location: string;
    tools: string;
    description: string;
    achievements: string[];
    projects: ProjectDto[];
}

export interface ProjectDto {
    name: string;
    description: string;
}

export interface EducationDto {
    degree: string;
    institution: string;
    location: string;
    year: string;
}

export interface AgentNotesDto {
    summaryOfChanges: string[];
    interviewFocusTips: string[];
}

export interface MatchResult {
    resume: ResumeDto;
    matchScore: number;
    matchingSkills: string[];
    missingSkills: string[];
}
  