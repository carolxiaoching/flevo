export type Pagination = {
  totalPage: number;
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export type AppErrorResponse = {
  status: string;
  message: string;
  // 開發環境才有
  error?: {
    statusCode?: number;
    isOperational?: boolean;
    code?: number;
  };
  stack?: string; // 開發環境才有
};

export type Message = {
  style: string;
  title: string;
  text: string;
};
