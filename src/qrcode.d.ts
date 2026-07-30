declare module 'qrcode' {
  interface ToStringOptions {
    type?: 'svg' | 'utf8' | 'terminal';
    margin?: number;
    width?: number;
    color?: { dark?: string; light?: string };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }
  const QRCode: {
    toString(text: string, options?: ToStringOptions): Promise<string>;
  };
  export default QRCode;
}
