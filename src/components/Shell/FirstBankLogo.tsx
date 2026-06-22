interface FirstBankLogoProps {
  height?: number;
  className?: string;
}

export function FirstBankLogo({ height = 44, className }: FirstBankLogoProps) {
  return (
    <img
      src="/firstbank-logo.png"
      alt="First Bank of Nigeria – Since 1894"
      height={height}
      className={className}
      style={{ display: 'block', width: 'auto' }}
    />
  );
}
