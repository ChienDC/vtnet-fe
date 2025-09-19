// Định nghĩa các types cho hệ thống quản lý sự nghiệp VTNET

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  level: string;
  joinDate: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'on_leave';
  manager?: string;
  skills: string[];
  certifications: Certification[];
  careerPath: CareerPath;
}

export interface CareerPath {
  id: string;
  employeeId: string;
  currentLevel: string;
  targetLevel: string;
  department: string;
  profession: string;
  progressPercentage: number;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  requirements: string[];
  progress: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  status: 'active' | 'expired' | 'pending';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  manager: string;
  employeeCount: number;
}

export interface Position {
  id: string;
  title: string;
  department: string;
  level: string;
  description: string;
  requirements: string[];
  skills: string[];
}

export interface CareerMatrix {
  id: string;
  department: string;
  profession: string;
  positions: MatrixPosition[];
}

export interface MatrixPosition {
  id: string;
  title: string;
  level: string;
  requirements: string[];
  skills: string[];
  nextPositions: string[];
}

export interface PersonalCareerTrack {
  id: string;
  employeeId: string;
  matrixId: string;
  currentPositionId: string;
  targetPositionId: string;
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'paused';
  progressPercentage: number;
  trackingSteps: TrackingStep[];
  evaluations: CareerEvaluation[];
  createdAt: string;
  updatedAt: string;
}

export interface PersonalDevelopmentMatrix {
  id: string;
  employeeId: string;
  department: string;
  profession: string;
  currentLevel: string;
  targetLevel: string;
  positions: PersonalMatrixPosition[];
  createdAt: string;
  updatedAt: string;
}

export interface PersonalMatrixPosition {
  id: string;
  title: string;
  level: string;
  status: 'current' | 'target' | 'completed' | 'future' | 'not_applicable';
  progress: number;
  requirements: PositionRequirement[];
  completedDate?: string;
  estimatedDate?: string;
}

export interface PositionRequirement {
  id: string;
  title: string;
  type: 'skill' | 'certification' | 'experience' | 'training';
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  description: string;
  evidence?: string[];
  completedDate?: string;
}

export interface DevelopmentLevel {
  code: string;
  name: string;
  description: string;
}

export interface DevelopmentPosition {
  id: string;
  title: string;
  shortCode: string;
  level: string;
  description: string;
  requirements: string[];
}

export interface TrackingStep {
  id: string;
  title: string;
  description: string;
  type: 'skill_development' | 'certification' | 'project_experience' | 'training' | 'mentoring';
  requirements: string[];
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  startDate?: string;
  completedDate?: string;
  progress: number;
  evidence: Evidence[];
  mentor?: string;
  estimatedHours: number;
  actualHours?: number;
}

export interface Evidence {
  id: string;
  type: 'document' | 'certificate' | 'project' | 'feedback';
  title: string;
  description: string;
  url?: string;
  uploadDate: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

export interface CareerEvaluation {
  id: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluationDate: string;
  period: string;
  overallScore: number;
  skillAssessments: SkillAssessment[];
  strengths: string[];
  improvementAreas: string[];
  recommendations: string[];
  nextSteps: string[];
}

export interface SkillAssessment {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  progress: number;
  notes: string;
}

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItem[];
  path?: string;
}

export interface UploadFile {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error';
  url?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeCareerPaths: number;
  completedMilestones: number;
  pendingCertifications: number;
  departmentStats: DepartmentStats[];
}

export interface DepartmentStats {
  department: string;
  employeeCount: number;
  averageProgress: number;
}

// Lộ trình cá nhân - Career Roadmap
export interface Industry {
  id: string;
  name: string;
  code: string;
  description: string;
  professions: Profession[];
}

export interface Profession {
  id: string;
  name: string;
  code: string;
  industryId: string;
  description: string;
  positions: JobPosition[];
}

export interface JobPosition {
  id: string;
  title: string;
  shortCode: string;
  professionId: string;
  levels: JobLevel[];
  requirements: JobRequirement[];
  skills: string[];
  description: string;
  careerFlow: CareerFlow[];
}

export interface JobLevel {
  id: string;
  level: string;
  salaryGrade: string;
  description: string;
  requirements: string[];
  experience: string;
  responsibilities: string[];
}

export interface JobRequirement {
  id: string;
  category: 'education' | 'experience' | 'skill' | 'certification' | 'language';
  title: string;
  description: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  mandatory: boolean;
  weight: number;
}

export interface CareerFlow {
  fromPositionId: string;
  toPositionId: string;
  fromLevel: string;
  toLevel: string;
  requirements: string[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface EmployeePosition {
  employeeId: string;
  currentPositionId: string;
  currentLevel: string;
  targetPositionId?: string;
  targetLevel?: string;
  progress: number;
  startDate: string;
  expectedDate?: string;
}

export interface JobComparison {
  position1: JobPosition;
  position2: JobPosition;
  level1: string;
  level2: string;
  comparisonResults: ComparisonResult[];
}

export interface ComparisonResult {
  category: string;
  position1Score: number;
  position2Score: number;
  position1Details: string[];
  position2Details: string[];
  recommendation: string;
}