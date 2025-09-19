import axios from 'axios';
import { Employee, CareerPath, Department, Position, CareerMatrix, DashboardStats, Certification, PersonalCareerTrack, TrackingStep, CareerEvaluation } from '../types';
import { PersonalDevelopmentMatrix, DevelopmentLevel, DevelopmentPosition, Industry, Profession, JobPosition, JobLevel, EmployeePosition, JobComparison } from '../types';

// Tạo instance axios với base config
const api = axios.create({
  baseURL: 'https://api.vtnet-career.com',
  timeout: 10000,
});

// Fake data cho demo
const fakeEmployees: Employee[] = [
  {
    id: '1',
    employeeCode: 'VT001',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@vtnet.vn',
    phone: '0901234567',
    department: 'Công nghệ thông tin',
    position: 'Kỹ sư phần mềm',
    level: 'Bậc 12',
    joinDate: '2022-01-15',
    status: 'active',
    manager: 'Trần Văn B',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    certifications: [
      {
        id: '1',
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2023-06-15',
        expiryDate: '2026-06-15',
        status: 'active'
      }
    ],
    careerPath: {
      id: '1',
      employeeId: '1',
      currentLevel: 'Bậc 12',
      targetLevel: 'Bậc 14',
      department: 'Công nghệ thông tin',
      profession: 'Phát triển phần mềm',
      progressPercentage: 65,
      milestones: [
        {
          id: '1',
          title: 'Hoàn thành khóa học Leadership',
          description: 'Tham gia và hoàn thành khóa học quản lý lãnh đạo',
          targetDate: '2024-06-30',
          status: 'completed',
          completedDate: '2024-05-15',
          requirements: ['Tham gia khóa học', 'Đạt điểm tối thiểu 80%'],
          progress: 100
        },
        {
          id: '2',
          title: 'Dẫn dắt dự án lớn',
          description: 'Làm team lead cho dự án có quy mô > 5 người',
          targetDate: '2024-12-31',
          status: 'in_progress',
          requirements: ['Quản lý team 5+ người', 'Hoàn thành dự án đúng hạn'],
          progress: 40
        }
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-20'
    }
  },
  {
    id: '2',
    employeeCode: 'VT002',
    fullName: 'Trần Thị Bình',
    email: 'binh.tran@vtnet.vn',
    phone: '0901234568',
    department: 'Quản lý tác động',
    position: 'Chuyên viên quản lý thay đổi',
    level: 'Bậc 11',
    joinDate: '2023-03-10',
    status: 'active',
    manager: 'Lê Văn C',
    skills: ['Project Management', 'Change Management', 'ITIL'],
    certifications: [
      {
        id: '2',
        name: 'PMP Certification',
        issuer: 'PMI',
        issueDate: '2023-09-20',
        expiryDate: '2026-09-20',
        status: 'active'
      }
    ],
    careerPath: {
      id: '2',
      employeeId: '2',
      currentLevel: 'Bậc 11',
      targetLevel: 'Bậc 13',
      department: 'Quản lý tác động',
      profession: 'Quản lý thay đổi',
      progressPercentage: 30,
      milestones: [
        {
          id: '3',
          title: 'Chứng chỉ ITIL Foundation',
          description: 'Lấy chứng chỉ ITIL Foundation',
          targetDate: '2024-08-31',
          status: 'pending',
          requirements: ['Tham gia khóa học ITIL', 'Thi đạt chứng chỉ'],
          progress: 0
        }
      ],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-20'
    }
  }
];

const fakeDepartments: Department[] = [
  {
    id: '1',
    name: 'Công nghệ thông tin',
    code: 'IT',
    description: 'Phòng ban phụ trách về công nghệ thông tin',
    manager: 'Nguyễn Văn D',
    employeeCount: 25
  },
  {
    id: '2',
    name: 'Quản lý tác động',
    code: 'CM',
    description: 'Phòng ban quản lý tác động và thay đổi',
    manager: 'Trần Thị E',
    employeeCount: 15
  }
];

const fakeCareerMatrix: CareerMatrix[] = [
  {
    id: '1',
    department: 'Công nghệ thông tin',
    profession: 'Phát triển phần mềm',
    positions: [
      {
        id: '1',
        title: 'Kỹ sư phần mềm',
        level: 'Bậc 11-12',
        requirements: ['Tốt nghiệp đại học IT', '1-3 năm kinh nghiệm'],
        skills: ['Programming', 'Database', 'Web Development'],
        nextPositions: ['2']
      },
      {
        id: '2',
        title: 'Kỹ sư phần mềm Senior',
        level: 'Bậc 13-14',
        requirements: ['3-5 năm kinh nghiệm', 'Dẫn dắt dự án'],
        skills: ['Advanced Programming', 'System Design', 'Team Leadership'],
        nextPositions: ['3']
      }
    ]
  }
];

const fakePersonalCareerTracks: PersonalCareerTrack[] = [
  {
    id: '1',
    employeeId: '1',
    matrixId: '1',
    currentPositionId: '1',
    targetPositionId: '2',
    startDate: '2024-01-01',
    expectedCompletionDate: '2024-12-31',
    status: 'in_progress',
    progressPercentage: 65,
    trackingSteps: [
      {
        id: '1',
        title: 'Hoàn thành khóa học System Design',
        description: 'Tham gia khóa học về thiết kế hệ thống quy mô lớn',
        type: 'training',
        requirements: ['Hoàn thành 40 giờ học', 'Đạt điểm tối thiểu 80%'],
        status: 'completed',
        startDate: '2024-01-15',
        completedDate: '2024-03-20',
        progress: 100,
        evidence: [
          {
            id: '1',
            type: 'certificate',
            title: 'System Design Certificate',
            description: 'Chứng chỉ hoàn thành khóa học System Design',
            uploadDate: '2024-03-21',
            verifiedBy: 'Nguyễn Văn B',
            verifiedDate: '2024-03-22'
          }
        ],
        mentor: 'Trần Văn C',
        estimatedHours: 40,
        actualHours: 42
      },
      {
        id: '2',
        title: 'Dẫn dắt dự án team 5+ người',
        description: 'Làm team lead cho dự án có quy mô từ 5 người trở lên',
        type: 'project_experience',
        requirements: ['Quản lý team 5+ người', 'Hoàn thành dự án đúng hạn', 'Đánh giá tích cực từ team'],
        status: 'in_progress',
        startDate: '2024-04-01',
        progress: 60,
        evidence: [
          {
            id: '2',
            type: 'project',
            title: 'Project Alpha - Team Lead',
            description: 'Dự án phát triển hệ thống quản lý nội bộ',
            uploadDate: '2024-06-15'
          }
        ],
        mentor: 'Lê Thị D',
        estimatedHours: 200,
        actualHours: 120
      },
      {
        id: '3',
        title: 'Chứng chỉ AWS Solutions Architect',
        description: 'Lấy chứng chỉ AWS Solutions Architect Associate',
        type: 'certification',
        requirements: ['Thi đạt chứng chỉ AWS SA', 'Điểm tối thiểu 720/1000'],
        status: 'not_started',
        progress: 0,
        evidence: [],
        estimatedHours: 80
      }
    ],
    evaluations: [
      {
        id: '1',
        evaluatorId: 'manager1',
        evaluatorName: 'Trần Văn B',
        evaluationDate: '2024-06-30',
        period: 'Q2 2024',
        overallScore: 4.2,
        skillAssessments: [
          {
            skill: 'Programming',
            currentLevel: 4,
            targetLevel: 5,
            progress: 80,
            notes: 'Có tiến bộ rõ rệt trong việc viết code clean'
          },
          {
            skill: 'System Design',
            currentLevel: 3,
            targetLevel: 4,
            progress: 75,
            notes: 'Đã hoàn thành khóa học, cần thực hành thêm'
          },
          {
            skill: 'Team Leadership',
            currentLevel: 2,
            targetLevel: 4,
            progress: 50,
            notes: 'Đang trong quá trình học hỏi và phát triển'
          }
        ],
        strengths: [
          'Kỹ năng lập trình tốt',
          'Học hỏi nhanh',
          'Có trách nhiệm với công việc'
        ],
        improvementAreas: [
          'Kỹ năng giao tiếp với team',
          'Quản lý thời gian dự án',
          'Presentation skills'
        ],
        recommendations: [
          'Tham gia thêm các khóa học về leadership',
          'Thực hành thuyết trình thường xuyên',
          'Tìm mentor có kinh nghiệm quản lý'
        ],
        nextSteps: [
          'Hoàn thành dự án team lead hiện tại',
          'Chuẩn bị cho chứng chỉ AWS',
          'Tham gia khóa học communication skills'
        ]
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-07-01'
  }
];

const developmentLevels: DevelopmentLevel[] = [
  { code: 'B11', name: 'Bậc 11', description: 'Nhân viên mới' },
  { code: 'B12', name: 'Bậc 12', description: 'Nhân viên có kinh nghiệm' },
  { code: 'B13', name: 'Bậc 13', description: 'Nhân viên senior' },
  { code: 'B14', name: 'Bậc 14', description: 'Chuyên gia' },
  { code: 'B15', name: 'Bậc 15', description: 'Chuyên gia cao cấp' },
  { code: 'B16', name: 'Bậc 16', description: 'Quản lý cấp trung' },
  { code: 'B17', name: 'Bậc 17', description: 'Quản lý cấp cao' }
];

const developmentPositions: DevelopmentPosition[] = [
  { id: '1', title: 'Quản lý bảo dưỡng', shortCode: 'PvM', level: 'B11-B12', description: 'Quản lý công tác bảo dưỡng hệ thống', requirements: ['Kinh nghiệm bảo dưỡng', 'Kỹ năng quản lý'] },
  { id: '2', title: 'Phó phòng Quản lý thay đổi', shortCode: 'PP', level: 'B14', description: 'Phó phòng quản lý thay đổi', requirements: ['Kinh nghiệm quản lý', 'Chứng chỉ ITIL'] },
  { id: '3', title: 'Trưởng phòng Quản lý thay đổi', shortCode: 'TP', level: 'B14', description: 'Trưởng phòng quản lý thay đổi', requirements: ['Kinh nghiệm lãnh đạo', 'Chứng chỉ PMP'] },
  { id: '4', title: 'Kỹ sư Quản lý thay đổi hệ thống mạng lõi', shortCode: 'CM', level: 'B11-B14', description: 'Kỹ sư quản lý thay đổi mạng lõi', requirements: ['Kiến thức mạng', 'Chứng chỉ Cisco'] },
  { id: '5', title: 'Kỹ sư Quản lý thay đổi hệ thống mạng truy nhập', shortCode: 'CM', level: 'B11-B14', description: 'Kỹ sư quản lý thay đổi mạng truy nhập', requirements: ['Kiến thức mạng', 'Kinh nghiệm triển khai'] },
  { id: '6', title: 'Kỹ sư Quản lý thay đổi thi trường', shortCode: 'CM', level: 'B11-B14', description: 'Kỹ sư quản lý thay đổi thi trường', requirements: ['Hiểu biết thị trường', 'Kỹ năng phân tích'] }
];

const fakePersonalDevelopmentMatrix: PersonalDevelopmentMatrix[] = [
  {
    id: '1',
    employeeId: '1',
    department: 'QUẢN LÝ TÁC ĐỘNG',
    profession: 'VẬN HÀNH KHAI THÁC',
    currentLevel: 'B12',
    targetLevel: 'B14',
    positions: [
      {
        id: '1',
        title: 'Quản lý bảo dưỡng',
        level: 'B11',
        status: 'completed',
        progress: 100,
        completedDate: '2023-06-15',
        requirements: [
          { id: '1', title: 'Kinh nghiệm bảo dưỡng 2 năm', type: 'experience', status: 'completed', progress: 100, description: 'Có kinh nghiệm bảo dưỡng hệ thống', completedDate: '2023-06-15' },
          { id: '2', title: 'Chứng chỉ kỹ thuật', type: 'certification', status: 'completed', progress: 100, description: 'Chứng chỉ kỹ thuật cơ bản', completedDate: '2023-06-15' }
        ]
      },
      {
        id: '2',
        title: 'Phó phòng Quản lý thay đổi',
        level: 'B14',
        status: 'target',
        progress: 65,
        estimatedDate: '2024-12-31',
        requirements: [
          { id: '3', title: 'Chứng chỉ ITIL Foundation', type: 'certification', status: 'completed', progress: 100, description: 'Chứng chỉ ITIL cơ bản', completedDate: '2024-03-20' },
          { id: '4', title: 'Kinh nghiệm quản lý team', type: 'experience', status: 'in_progress', progress: 70, description: 'Quản lý team 5+ người' },
          { id: '5', title: 'Khóa học Leadership', type: 'training', status: 'completed', progress: 100, description: 'Khóa học lãnh đạo', completedDate: '2024-05-15' }
        ]
      },
      {
        id: '3',
        title: 'Kỹ sư CM hệ thống mạng lõi',
        level: 'B12',
        status: 'current',
        progress: 80,
        requirements: [
          { id: '6', title: 'Chứng chỉ Cisco CCNA', type: 'certification', status: 'completed', progress: 100, description: 'Chứng chỉ mạng cơ bản', completedDate: '2024-01-10' },
          { id: '7', title: 'Kinh nghiệm troubleshooting', type: 'experience', status: 'in_progress', progress: 85, description: 'Xử lý sự cố mạng' },
          { id: '8', title: 'Dự án nâng cấp hạ tầng', type: 'experience', status: 'in_progress', progress: 60, description: 'Tham gia dự án nâng cấp' }
        ]
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-07-01'
  }
];

const fakeIndustries: Industry[] = [
  {
    id: '1',
    name: 'QUẢN LÝ TÁC ĐỘNG',
    code: 'QLTD',
    description: 'Ngành quản lý tác động và thay đổi',
    professions: [
      {
        id: '1',
        name: 'VẬN HÀNH KHAI THÁC',
        code: 'VHKT',
        description: 'Nghề vận hành và khai thác hệ thống',
        industryId: '1',
        positions: [
          {
            id: '1',
            title: 'Quản lý bảo dưỡng',
            code: 'PvM',
            description: 'Quản lý công tác bảo dưỡng hệ thống',
            professionId: '1',
            levels: [
              {
                code: 'B11',
                name: 'Bậc 11',
                salaryRange: '15-20 triệu',
                requirements: [
                  { id: '1', type: 'education', title: 'Tốt nghiệp đại học kỹ thuật', description: 'Bằng cử nhân kỹ thuật' },
                  { id: '2', type: 'experience', title: '1-2 năm kinh nghiệm', description: 'Kinh nghiệm làm việc cơ bản' }
                ]
              },
              {
                code: 'B12',
                name: 'Bậc 12',
                salaryRange: '20-25 triệu',
                requirements: [
                  { id: '3', type: 'experience', title: '2-4 năm kinh nghiệm', description: 'Kinh nghiệm bảo dưỡng hệ thống' },
                  { id: '4', type: 'certification', title: 'Chứng chỉ kỹ thuật', description: 'Chứng chỉ chuyên môn' }
                ]
              }
            ],
            careerFlow: [
              {
                fromLevel: 'B11',
                toLevel: 'B12',
                requirements: ['2 năm kinh nghiệm', 'Đánh giá tốt'],
                estimatedTime: '2-3 năm'
              }
            ]
          },
          {
            id: '2',
            title: 'Phó phòng Quản lý thay đổi',
            code: 'PP',
            description: 'Phó phòng quản lý thay đổi',
            professionId: '1',
            levels: [
              {
                code: 'B14',
                name: 'Bậc 14',
                salaryRange: '35-45 triệu',
                requirements: [
                  { id: '5', type: 'experience', title: '5+ năm kinh nghiệm', description: 'Kinh nghiệm quản lý' },
                  { id: '6', type: 'certification', title: 'Chứng chỉ ITIL', description: 'ITIL Foundation' }
                ]
              }
            ],
            careerFlow: []
          },
          {
            id: '3',
            title: 'Trưởng phòng Quản lý thay đổi',
            code: 'TP',
            description: 'Trưởng phòng quản lý thay đổi',
            professionId: '1',
            levels: [
              {
                code: 'B16',
                name: 'Bậc 16',
                salaryRange: '50-70 triệu',
                requirements: [
                  { id: '7', type: 'experience', title: '8+ năm kinh nghiệm', description: 'Kinh nghiệm lãnh đạo' },
                  { id: '8', type: 'certification', title: 'Chứng chỉ PMP', description: 'Project Management Professional' }
                ]
              }
            ],
            careerFlow: []
          },
          {
            id: '4',
            title: 'Kỹ sư CM hệ thống mạng lõi',
            code: 'CM',
            description: 'Kỹ sư quản lý thay đổi mạng lõi',
            professionId: '1',
            levels: [
              {
                code: 'B11',
                name: 'Bậc 11',
                salaryRange: '15-20 triệu',
                requirements: [
                  { id: '9', type: 'education', title: 'Tốt nghiệp IT/Telecom', description: 'Bằng cử nhân IT' },
                  { id: '10', type: 'certification', title: 'Cisco CCNA', description: 'Chứng chỉ mạng cơ bản' }
                ]
              },
              {
                code: 'B12',
                name: 'Bậc 12',
                salaryRange: '20-25 triệu',
                requirements: [
                  { id: '11', type: 'experience', title: '2-4 năm kinh nghiệm mạng', description: 'Kinh nghiệm troubleshooting' },
                  { id: '12', type: 'skill', title: 'Kỹ năng phân tích', description: 'Phân tích và xử lý sự cố' }
                ]
              },
              {
                code: 'B13',
                name: 'Bậc 13',
                salaryRange: '25-35 triệu',
                requirements: [
                  { id: '13', type: 'experience', title: '4-6 năm kinh nghiệm', description: 'Kinh nghiệm dự án lớn' },
                  { id: '14', type: 'certification', title: 'Cisco CCNP', description: 'Chứng chỉ mạng nâng cao' }
                ]
              },
              {
                code: 'B14',
                name: 'Bậc 14',
                salaryRange: '35-45 triệu',
                requirements: [
                  { id: '15', type: 'experience', title: '6+ năm kinh nghiệm', description: 'Kinh nghiệm chuyên sâu' },
                  { id: '16', type: 'skill', title: 'Kỹ năng lãnh đạo', description: 'Dẫn dắt nhóm kỹ thuật' }
                ]
              }
            ],
            careerFlow: [
              {
                fromLevel: 'B11',
                toLevel: 'B12',
                requirements: ['2 năm kinh nghiệm', 'Hoàn thành dự án'],
                estimatedTime: '2-3 năm'
              },
              {
                fromLevel: 'B12',
                toLevel: 'B13',
                requirements: ['4 năm kinh nghiệm', 'Chứng chỉ CCNP'],
                estimatedTime: '2-3 năm'
              },
              {
                fromLevel: 'B13',
                toLevel: 'B14',
                requirements: ['6 năm kinh nghiệm', 'Kỹ năng lãnh đạo'],
                estimatedTime: '2-4 năm'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'CÔNG NGHỆ THÔNG TIN',
    code: 'CNTT',
    description: 'Ngành công nghệ thông tin',
    professions: [
      {
        id: '2',
        name: 'PHÁT TRIỂN ỨNG DỤNG',
        code: 'PTUD',
        description: 'Nghề phát triển ứng dụng phần mềm',
        industryId: '2',
        positions: [
          {
            id: '5',
            title: 'Kỹ sư phần mềm',
            code: 'DEV',
            description: 'Kỹ sư phát triển phần mềm',
            professionId: '2',
            levels: [
              {
                code: 'B11',
                name: 'Bậc 11',
                salaryRange: '15-22 triệu',
                requirements: [
                  { id: '17', type: 'education', title: 'Tốt nghiệp IT', description: 'Bằng cử nhân CNTT' },
                  { id: '18', type: 'skill', title: 'Lập trình cơ bản', description: 'Java, Python, hoặc C#' }
                ]
              },
              {
                code: 'B12',
                name: 'Bậc 12',
                salaryRange: '22-30 triệu',
                requirements: [
                  { id: '19', type: 'experience', title: '2-3 năm kinh nghiệm', description: 'Kinh nghiệm phát triển' },
                  { id: '20', type: 'skill', title: 'Framework hiện đại', description: 'React, Spring Boot' }
                ]
              },
              {
                code: 'B13',
                name: 'Bậc 13',
                salaryRange: '30-40 triệu',
                requirements: [
                  { id: '21', type: 'experience', title: '4-5 năm kinh nghiệm', description: 'Kinh nghiệm senior' },
                  { id: '22', type: 'skill', title: 'System Design', description: 'Thiết kế hệ thống' }
                ]
              }
            ],
            careerFlow: [
              {
                fromLevel: 'B11',
                toLevel: 'B12',
                requirements: ['2 năm kinh nghiệm', 'Hoàn thành dự án'],
                estimatedTime: '2-3 năm'
              },
              {
                fromLevel: 'B12',
                toLevel: 'B13',
                requirements: ['4 năm kinh nghiệm', 'Kỹ năng system design'],
                estimatedTime: '2-3 năm'
              }
            ]
          }
        ]
      }
    ]
  }
];

const fakeEmployeePositions: EmployeePosition[] = [
  {
    id: '1',
    employeeId: '1',
    currentPositionId: '4',
    currentLevel: 'B12',
    targetPositionId: '2',
    targetLevel: 'B14',
    progressPercentage: 65,
    startDate: '2024-01-01',
    expectedDate: '2024-12-31'
  },
  {
    id: '2',
    employeeId: '2',
    currentPositionId: '5',
    currentLevel: 'B11',
    targetPositionId: '5',
    targetLevel: 'B13',
    progressPercentage: 30,
    startDate: '2024-03-01',
    expectedDate: '2025-06-30'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const employeeAPI = {
  getEmployees: async (): Promise<Employee[]> => {
    await delay(1000);
    return fakeEmployees;
  },

  getEmployee: async (id: string): Promise<Employee> => {
    await delay(800);
    const employee = fakeEmployees.find(emp => emp.id === id);
    if (!employee) throw new Error('Employee not found');
    return employee;
  },

  createEmployee: async (employeeData: Omit<Employee, 'id' | 'careerPath'>): Promise<Employee> => {
    await delay(800);
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
      careerPath: {
        id: Date.now().toString(),
        employeeId: Date.now().toString(),
        currentLevel: employeeData.level,
        targetLevel: employeeData.level,
        department: employeeData.department,
        profession: '',
        progressPercentage: 0,
        milestones: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    fakeEmployees.push(newEmployee);
    return newEmployee;
  },

  updateEmployee: async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    await delay(800);
    const index = fakeEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      fakeEmployees[index] = { ...fakeEmployees[index], ...employeeData };
      return fakeEmployees[index];
    }
    throw new Error('Employee not found');
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await delay(500);
    const index = fakeEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      fakeEmployees.splice(index, 1);
    } else {
      throw new Error('Employee not found');
    }
  },
};

export const departmentAPI = {
  getDepartments: async (): Promise<Department[]> => {
    await delay(800);
    return fakeDepartments;
  },

  createDepartment: async (departmentData: Omit<Department, 'id'>): Promise<Department> => {
    await delay(800);
    const newDepartment: Department = {
      ...departmentData,
      id: Date.now().toString(),
    };
    fakeDepartments.push(newDepartment);
    return newDepartment;
  },
};

export const careerAPI = {
  getCareerPaths: async (): Promise<CareerPath[]> => {
    await delay(800);
    return fakeEmployees.map(emp => emp.careerPath);
  },

  updateCareerPath: async (id: string, careerData: Partial<CareerPath>): Promise<CareerPath> => {
    await delay(800);
    const employee = fakeEmployees.find(emp => emp.careerPath.id === id);
    if (employee) {
      employee.careerPath = { ...employee.careerPath, ...careerData };
      return employee.careerPath;
    }
    throw new Error('Career path not found');
  },

  getCareerMatrix: async (): Promise<CareerMatrix[]> => {
    await delay(800);
    return fakeCareerMatrix;
  },

  getPersonalCareerTracks: async (): Promise<PersonalCareerTrack[]> => {
    await delay(800);
    return fakePersonalCareerTracks;
  },

  getPersonalCareerTrack: async (employeeId: string): Promise<PersonalCareerTrack | null> => {
    await delay(800);
    return fakePersonalCareerTracks.find(track => track.employeeId === employeeId) || null;
  },

  updateTrackingStep: async (trackId: string, stepId: string, stepData: Partial<TrackingStep>): Promise<TrackingStep> => {
    await delay(800);
    const track = fakePersonalCareerTracks.find(t => t.id === trackId);
    if (track) {
      const stepIndex = track.trackingSteps.findIndex(s => s.id === stepId);
      if (stepIndex !== -1) {
        track.trackingSteps[stepIndex] = { ...track.trackingSteps[stepIndex], ...stepData };
        return track.trackingSteps[stepIndex];
      }
    }
    throw new Error('Tracking step not found');
  },

  addEvaluation: async (trackId: string, evaluation: Omit<CareerEvaluation, 'id'>): Promise<CareerEvaluation> => {
    await delay(800);
    const track = fakePersonalCareerTracks.find(t => t.id === trackId);
    if (track) {
      const newEvaluation: CareerEvaluation = {
        ...evaluation,
        id: Date.now().toString()
      };
      track.evaluations.push(newEvaluation);
      return newEvaluation;
    }
    throw new Error('Career track not found');
  },

  getPersonalDevelopmentMatrix: async (employeeId: string): Promise<PersonalDevelopmentMatrix | null> => {
    await delay(800);
    return fakePersonalDevelopmentMatrix.find(matrix => matrix.employeeId === employeeId) || null;
  },

  updatePersonalDevelopmentMatrix: async (matrixId: string, updates: Partial<PersonalDevelopmentMatrix>): Promise<PersonalDevelopmentMatrix> => {
    await delay(800);
    const index = fakePersonalDevelopmentMatrix.findIndex(m => m.id === matrixId);
    if (index !== -1) {
      fakePersonalDevelopmentMatrix[index] = { ...fakePersonalDevelopmentMatrix[index], ...updates };
      return fakePersonalDevelopmentMatrix[index];
    }
    throw new Error('Development matrix not found');
  },

  getDevelopmentLevels: async (): Promise<DevelopmentLevel[]> => {
    await delay(500);
    return developmentLevels;
  },

  getDevelopmentPositions: async (): Promise<DevelopmentPosition[]> => {
    await delay(500);
    return developmentPositions;
  }
};

export const careerRoadmapAPI = {
  getIndustries: async (): Promise<Industry[]> => {
    await delay(800);
    return fakeIndustries;
  },

  getProfessionsByIndustry: async (industryId: string): Promise<Profession[]> => {
    await delay(600);
    const industry = fakeIndustries.find(ind => ind.id === industryId);
    return industry ? industry.professions : [];
  },

  getPositionsByProfession: async (professionId: string): Promise<JobPosition[]> => {
    await delay(600);
    const profession = fakeIndustries
      .flatMap(ind => ind.professions)
      .find(prof => prof.id === professionId);
    return profession ? profession.positions : [];
  },

  getJobPosition: async (positionId: string): Promise<JobPosition | null> => {
    await delay(500);
    const position = fakeIndustries
      .flatMap(ind => ind.professions)
      .flatMap(prof => prof.positions)
      .find(pos => pos.id === positionId);
    return position || null;
  },

  getEmployeePosition: async (employeeId: string): Promise<EmployeePosition | null> => {
    await delay(500);
    return fakeEmployeePositions.find(ep => ep.employeeId === employeeId) || null;
  },

  comparePositions: async (position1Id: string, level1: string, position2Id: string, level2: string): Promise<JobComparison> => {
    await delay(800);
    
    const position1 = await careerRoadmapAPI.getJobPosition(position1Id);
    const position2 = await careerRoadmapAPI.getJobPosition(position2Id);
    
    if (!position1 || !position2) {
      throw new Error('Positions not found');
    }

    // Giả lập kết quả so sánh
    const comparisonResults = [
      {
        category: 'Yêu cầu học vấn',
        position1Score: 85,
        position2Score: 90,
        position1Details: ['Đại học kỹ thuật', 'Chứng chỉ cơ bản'],
        position2Details: ['Đại học kỹ thuật', 'Chứng chỉ ITIL', 'Khóa đào tạo quản lý'],
        recommendation: 'Cần bổ sung chứng chỉ ITIL và khóa đào tạo quản lý'
      },
      {
        category: 'Kinh nghiệm',
        position1Score: 75,
        position2Score: 95,
        position1Details: ['2-4 năm kinh nghiệm kỹ thuật', 'Troubleshooting'],
        position2Details: ['5+ năm kinh nghiệm', 'Kinh nghiệm quản lý nhóm', 'Dẫn dắt dự án'],
        recommendation: 'Cần tích lũy thêm kinh nghiệm quản lý và lãnh đạo'
      },
      {
        category: 'Kỹ năng',
        position1Score: 80,
        position2Score: 85,
        position1Details: ['Kỹ thuật mạng', 'Cisco CCNA', 'Troubleshooting'],
        position2Details: ['Quản lý thay đổi', 'ITIL', 'Lãnh đạo', 'Phân tích rủi ro'],
        recommendation: 'Cần phát triển kỹ năng quản lý và soft skills'
      },
      {
        category: 'Trách nhiệm',
        position1Score: 70,
        position2Score: 90,
        position1Details: ['Thực hiện thay đổi', 'Giám sát hệ thống', 'Báo cáo kỹ thuật'],
        position2Details: ['Quản lý quy trình', 'Đánh giá tác động', 'Phối hợp bộ phận', 'Ra quyết định'],
        recommendation: 'Cần chuẩn bị cho vai trò quản lý và ra quyết định'
      }
    ];

    return {
      position1,
      position2,
      level1,
      level2,
      comparisonResults
    };
  }
};

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(1000);
    return {
      totalEmployees: fakeEmployees.length,
      activeCareerPaths: fakeEmployees.filter(emp => emp.careerPath.progressPercentage > 0).length,
      completedMilestones: fakeEmployees.reduce((total, emp) => 
        total + emp.careerPath.milestones.filter(m => m.status === 'completed').length, 0),
      pendingCertifications: fakeEmployees.reduce((total, emp) => 
        total + emp.certifications.filter(c => c.status === 'pending').length, 0),
      departmentStats: fakeDepartments.map(dept => ({
        department: dept.name,
        employeeCount: dept.employeeCount,
        averageProgress: Math.floor(Math.random() * 100)
      }))
    };
  },
};