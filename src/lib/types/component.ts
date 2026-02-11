export interface Story {
  id: string;
  name: string;
  html: string;
  storyId: string;
}

export interface ExtractedComponent {
  id: string;
  name: string;
  group: string;
  stories: Story[];
  html: string;
  inlineStyles: string;
}

export interface ComponentGroup {
  name: string;
  components: ExtractedComponent[];
}
