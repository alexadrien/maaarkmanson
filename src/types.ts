export type Message = {
  author: "Human" | "Mark";
  content: string;
};

export type History = Array<Message>;
