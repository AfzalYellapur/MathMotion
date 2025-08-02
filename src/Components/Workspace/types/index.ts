export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export interface KernelMessage {
  header: {
    msg_type: string;
    msg_id: string;
    username: string;
    session: string;
    version: string;
  };
  parent_header: {};
  metadata: {};
  content: any;
}

export type ViewType = 'editor' | 'preview';