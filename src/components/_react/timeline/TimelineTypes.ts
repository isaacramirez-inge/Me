export interface ProjectRoleTimeline {
    role: string | number;
    start_date: string;
    end_date: string | null;
  }
  
  export interface Project {
    project_name: string;
    implementation_type: string;
    company: string;
    highlight?: boolean;
    company_logo_path: string;
    project_description: {
      description: string;
      bullet_points: string[];
    };
    technologies: number[];
    project_role_timeline: ProjectRoleTimeline[];
    project_id: number;
    orden: number;
    responsabilities?: { description: string }[];
  }
  
  export interface JobRole {
    job_role: string;
    job_role_id: number;
    show_first?: boolean;
    start_date?: string;
    end_date?: string | null;
    actually?: boolean;
    responsabilities: { description: string }[];
  }
  
  export interface MainCardData {
    type: string;
    company: string;
    description: string;
    resume?: string;
    logo_url: string;
    orden: number;
    job_roles: JobRole[];
    projects: Project[];
  }
  
  export interface Technology {
    id: number;
    name: string;
    logo_path: string;
    extension: string;
    bg_color?: string;
    text_color?: string;
    border_color?: string;
    display_text?: string;
  }
  
  export interface TimelineProps {
    main_cards: MainCardData[];
    technologies: Technology[];
  }
  
  export type ViewType = "resume" | "line";
  
  export interface TimeLineMenuBarProps {
    onCollapseAll?: () => void;
    viewType?: ViewType;
    setViewType?: (viewType: ViewType) => void;
  }
  
  export interface MainCardDetailsProps {
    group: MainCardData;
    expanded: { [company: string]: boolean };
    stickyRefs: { [company: string]: HTMLDivElement | null };
    menuBarRef: React.RefObject<HTMLDivElement | null>;
  }
  
  export interface ProjectResume {
    name: string;
    company: string;
    logo: string;
    order: number;
  }
    
  export interface ResumeModalProps {
    onClose: () => void;
  }
  
  export interface Experience {
    company: string;
    logo: string;
    roles: string[];
    summary: string;
    from_date?: string;
    to_date?: string;
    order: number;
    projects: ProjectResume[];
  }
  
  export interface ProjectCardProps {
    project: Project;
    onClose: () => void;
  }
  
  export interface ProjectGridProps {
    projects: Project[];
  }
  
  export interface TechIconCloudProps {
    techAll: Technology[];
    technologies: (number | string)[];
    base_path: string;
  }
    
  export interface IconState {
    x: number;
    y: number;
    dx: number;
    dy: number;
    speed: number;
    iconIdx: number;
  }