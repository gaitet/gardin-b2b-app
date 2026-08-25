import { colors } from '@/theme/colors';

type HeaderProps = {
  title: string;
};

export const Header = ({ title }: HeaderProps) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: colors.white,
        borderBottom: `1px solid ${colors.border}`,
        padding: '16px 20px',
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 700,
          color: colors.text,
        }}
      >
        {title}
      </h1>
    </header>
  );
};