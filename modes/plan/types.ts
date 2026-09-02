export interface PlanStep {
    id: string;
    title: string;
    description: string;
    hints?: string[];
    complexity?: 'low' | 'medium' | 'high';
    filesInvolved?: string[];
    dependsOn?: number[];
}

export interface Plan {
    goal: string;
    researchSummary?: string;
    steps: PlanStep[];
    title?: string;
    assumptions?: string[];
    techStack?: { name: string; purpose?: string }[];
    diagrams?: { title: string; mermaid: string }[];
    risks?: string[];
    successCriteria?: string[];
}