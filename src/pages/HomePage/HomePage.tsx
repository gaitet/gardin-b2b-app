import type { FC } from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';
import { Page } from '@/components/Page';
import { colors } from '@/theme/colors';
import gardinLogo from '@/assets/logos/gardin-logo.svg';

export const HomePage: FC = () => {
  const navigate = useNavigate();

  return (
    <Page back={false}>
      <div
        style={{
          minHeight: '100vh',
          background: colors.background,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 380,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 20,
            padding: 32,
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
        >
          <img
            src={gardinLogo}
            alt="Gardin"
            style={{
              width: 180,
              height: 'auto',
              marginBottom: 16,
            }}
          />

          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: colors.text,
              marginBottom: 12,
            }}
          >
            Для дилерів
          </div>

          <p
            style={{
              color: colors.textSecondary,
              fontSize: 15,
              lineHeight: 1.6,
              marginBottom: 40,
            }}
          >
            Система оформлення замовлень
          </p>

          <Button
            size="l"
            onClick={() => navigate('/catalog')}
            style={{
              width: '100%',
              background: colors.primary,
              color: colors.white,
              borderRadius: 12,
              border: 'none',
              fontWeight: 600,
            }}
          >
            Перейти в каталог
          </Button>

          <div
            style={{
              marginTop: 32,
              fontSize: 12,
              color: colors.textSecondary,
              opacity: 0.6,
            }}
          >
            Gardin Dealer App • v0.1
          </div>
        </div>
      </div>
    </Page>
  );
};