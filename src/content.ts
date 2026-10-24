export type Language = 'en' | 'zh';

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface Project {
  title: string;
  category: string;
  summary: string;
  detail: string;
  meta: string;
}

export interface DownloadableFile {
  name: string;
  href: string;
  size: string;
}

export interface SkillNode {
  id: string;
  title: string;
  children?: SkillNode[];
  emptyNote?: string;
  file?: DownloadableFile;
}

export interface PageContent {
  brand: string;
  languageToggle: string;
  languageLabel: string;
  menuOpen: string;
  menuClose: string;
  nav: NavItem[];
  headerContact: string;
  headerWork: string;
  hero: {
    title: string;
    subtitle: string;
    imageAlt: string;
    primary: string;
    divider: string;
    secondary: string;
    note: string;
    about: string;
  };
  about: {
    title: string;
    intro: string;
    body: string;
    link: string;
  };
  work: {
    title: string;
    intro: string;
    projects: Project[];
  };
  skills: {
    title: string;
    groups: SkillNode[];
  };
  download: {
    action: string;
    count: string;
  };
  journey: {
    title: string;
    items: { period: string; title: string; description: string }[];
  };
  contact: {
    title: string;
    body: string;
    email: string;
    copy: string;
    copied: string;
    copyError: string;
  };
  footer: {
    note: string;
    backToTop: string;
  };
}

const algorithmsAssignment = {
  name: '大作业-算法设计与分析.doc',
  href: '/files/algorithms-and-program-design-assignment.doc',
  size: '39 KB',
};

export const content: Record<Language, PageContent> = {
  en: {
    brand: 'Bob',
    languageToggle: '中文',
    languageLabel: 'Switch to Chinese',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    nav: [
      { label: 'About', href: '#about' },
      {
        label: 'Projects',
        href: '#work',
        children: [
          { label: 'Selected projects', href: '#work' },
          { label: 'Coursework', href: '#coursework' },
          { label: 'Papers', href: '#papers' },
          { label: 'Course-related code', href: '#code' },
        ],
      },
      { label: 'Skills', href: '#skills' },
      { label: 'Journey', href: '#journey' },
      { label: 'Contact', href: '#contact' },
    ],
    headerContact: 'Get in touch',
    headerWork: 'View projects',
    hero: {
      title: 'Question what’s next',
      subtitle: 'I’m Bob, and I hope my sharing is useful to you.',
      imageAlt: 'A sunlit creative workspace with sketches, books, and a laptop',
      primary: 'View selected projects',
      divider: 'OR',
      secondary: 'Get in touch',
      note: 'Open to collaborations, internships, and conversations about design, code, and everything in between.',
      about: 'More about me',
    },
    about: {
      title: 'A curious mind, a careful maker.',
      intro: 'I ask questions through coursework, organize my thinking in papers, and test ideas with code.',
      body: 'This site is where I keep what I’m learning through course assignments, research writing, and hands-on coding. I hope these notes and projects are useful to you.',
      link: 'See my learning focus',
    },
    work: {
      title: 'Selected projects',
      intro: 'Project details are being prepared for coursework, papers, and code.',
      projects: [],
    },
    skills: {
      title: 'What I’m learning',
      groups: [
        {
          id: 'coursework',
          title: 'Coursework',
          children: [
            {
              id: 'algorithms-and-program-design',
              title: 'Algorithms and Program Design',
              children: [
                { id: 'algorithms-assignment-prompts', title: 'Assignment prompts', file: algorithmsAssignment },
                { id: 'algorithms-assignment-solutions', title: 'Prompts & answers', emptyNote: 'Answers for this course will be added soon.' },
                { id: 'algorithms-final-materials', title: 'Final course materials', emptyNote: 'Final review materials for this course will be added soon.' },
              ],
            },
          ],
        },
        {
          id: 'papers',
          title: 'Papers',
          children: [
            {
              id: 'papers-algorithms-and-program-design',
              title: 'Algorithms and Program Design',
              emptyNote: 'Papers for this course will be added soon.',
            },
          ],
        },
        {
          id: 'code',
          title: 'Course-related code',
          children: [
            {
              id: 'code-algorithms-and-program-design',
              title: 'Algorithms and Program Design',
              emptyNote: 'Course-related code will be added soon.',
            },
          ],
        },
      ],
    },
    download: {
      action: 'Download file',
      count: 'Downloads',
    },
    journey: {
      title: 'My learning journey',
      items: [
        { period: '2026', title: 'Coursework', description: 'Organizing course projects, assignments, and study notes while reflecting on the process.' },
        { period: '2026', title: 'Papers', description: 'Reading literature, developing research ideas, and documenting academic writing methods.' },
        { period: '2026', title: 'Code', description: 'Testing ideas through code and building practical front-end development experience.' },
      ],
    },
    contact: {
      title: 'Let’s make something thoughtful.',
      body: 'Have a project, an opportunity, or just a good question? I’d love to hear from you.',
      email: 'hello@example.com',
      copy: 'Copy email address',
      copied: 'Email address copied',
      copyError: 'Copy failed. Please select the email address above.',
    },
    footer: {
      note: 'A portfolio of questions, ideas, and things made with care.',
      backToTop: 'Back to top',
    },
  },
  zh: {
    brand: 'Bob',
    languageToggle: 'EN',
    languageLabel: '切换到英文',
    menuOpen: '打开菜单',
    menuClose: '关闭菜单',
    nav: [
      { label: '关于', href: '#about' },
      {
        label: '项目',
        href: '#work',
        children: [
          { label: '精选项目', href: '#work' },
          { label: '课程作业', href: '#coursework' },
          { label: '论文', href: '#papers' },
          { label: '课程相关代码', href: '#code' },
        ],
      },
      { label: '技能', href: '#skills' },
      { label: '经历', href: '#journey' },
      { label: '联系', href: '#contact' },
    ],
    headerContact: '联系我',
    headerWork: '查看项目',
    hero: {
      title: 'Question what’s next',
      subtitle: '你好，我是 Bob，希望我的分享对你有用。',
      imageAlt: '洒满阳光的创意工作台，摆放着草图、书籍和笔记本电脑',
      primary: '查看精选项目',
      divider: '或',
      secondary: '与我联系',
      note: '欢迎交流合作、实习机会，也欢迎聊聊设计、代码，以及两者之间的一切。',
      about: '了解更多关于我',
    },
    about: {
      title: '保持好奇，认真创造。',
      intro: '在课程作业中提出问题，在论文中梳理思路，在代码中验证想法。',
      body: '这里记录我的课程作业、论文写作与代码实践，也整理学习过程中的方法与思考。希望这些分享对你有用。',
      link: '看看我的学习方向',
    },
    work: {
      title: '精选项目',
      intro: '项目内容正在整理，之后会补充课程作业、论文与代码项目。',
      projects: [],
    },
    skills: {
      title: '我正在学习',
      groups: [
        {
          id: 'coursework',
          title: '课程作业',
          children: [
            {
              id: 'algorithms-and-program-design',
              title: '算法与程序设计',
              children: [
                { id: 'algorithms-assignment-prompts', title: '作业题目', file: algorithmsAssignment },
                { id: 'algorithms-assignment-solutions', title: '作业题目及答案', emptyNote: '该课程的题目与答案待补充。' },
                { id: 'algorithms-final-materials', title: '课程期末资料', emptyNote: '该课程的期末资料待补充。' },
              ],
            },
          ],
        },
        {
          id: 'papers',
          title: '论文',
          children: [
            {
              id: 'papers-algorithms-and-program-design',
              title: '算法与程序设计',
              emptyNote: '该课程的论文待补充。',
            },
          ],
        },
        {
          id: 'code',
          title: '课程相关代码',
          children: [
            {
              id: 'code-algorithms-and-program-design',
              title: '算法与程序设计',
              emptyNote: '该课程的相关代码待补充。',
            },
          ],
        },
      ],
    },
    download: {
      action: '下载文档',
      count: '下载次数',
    },
    journey: {
      title: '我的学习记录',
      items: [
        { period: '2026', title: '课程作业', description: '整理课程项目、作业与学习笔记，记录每一次实践和复盘。' },
        { period: '2026', title: '论文', description: '阅读文献、梳理研究思路，并记录论文写作中的方法与思考。' },
        { period: '2026', title: '代码', description: '通过代码验证想法，积累前端开发与编程实践经验。' },
      ],
    },
    contact: {
      title: '一起做点有意义的事。',
      body: '有一个项目、一个机会，或只是一个好问题？都欢迎和我聊聊。',
      email: 'hello@example.com',
      copy: '复制邮箱地址',
      copied: '邮箱地址已复制',
      copyError: '复制失败，请手动选择上方邮箱。',
    },
    footer: {
      note: '收集问题、想法，以及每一份认真完成的项目。',
      backToTop: '回到顶部',
    },
  },
};
