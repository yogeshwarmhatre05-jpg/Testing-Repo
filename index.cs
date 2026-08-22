export type Role = "user" | "assistant";

export interface Attachment {
  id: string;
  name: string;
  type: "image" | "file";
  url: string; // object URL for local preview
  sizeLabel: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  attachments?: Attachment[];
  error?: string;
  streaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  folderId: string | null;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface ModelOption {
  id: string;
  label: string;
  description: string;
}