export class Logger {
  static info(message: string, meta: any = {}) {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
  }

  static error(message: string, error: any = {}) {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    }));
  }

  static warn(message: string, meta: any = {}) {
    console.warn(JSON.stringify({ level: 'warn', message, ...meta }));
  }
}