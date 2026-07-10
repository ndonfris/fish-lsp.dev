/** Frontmatter shape for every page in src/content/ */
export interface PageFrontmatter {
  title:       string;
  description: string;
  slug:        string;
  order?:      number;
  section?:    string;
  permalink?:  string;
}

/** Grouped nav structure used by DocsLayout sidebar */
export interface NavSection {
  label: string;
  pages: NavPage[];
}

export interface NavPage {
  title: string;
  slug:  string;
}

/** Download option shown in the header */
export interface DownloadOption {
  label: string;
  url:   string;
  icon:  string;
}
