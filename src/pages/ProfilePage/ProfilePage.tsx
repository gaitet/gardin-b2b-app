import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';
import { useDealer } from '@/context/DealerContext';
import { Page } from '@/components/Page';
import { BottomNavigation } from '@/components/BottomNavigation/BottomNavigation';
import { colors } from '@/theme/colors';

export const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const { dealer } = useDealer();

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!dealer?.keepinClientId) return;
  fetch(`https://gardin-b2b.vercel.app/client/${dealer.keepinClientId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не вдалося отримати профіль');
        }

        return response.json();
      })
      .then((data) => {
        setClient(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dealer]);

  return (
    <Page back={false}>
      <div
        style={{
          minHeight: '100vh',
          background: colors.background,
          padding: 20,
          paddingBottom: 100,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 500,
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              color: colors.text,
              fontSize: 24,
              marginBottom: 24,
            }}
          >
            Профіль
          </h1>

          {loading ? (
            <div
              style={{
                color: colors.textSecondary,
              }}
            >
              Завантаження...
            </div>
          ) : client ? (
            <>
              <div
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: colors.text,
                    marginBottom: 20,
                  }}
                >
                  {client.company || 'Дилер'}
                </div>

                {client.person && (
                  <div
                    style={{
                      color: colors.textSecondary,
                      marginBottom: 12,
                    }}
                  >
                    Контактна особа: {client.person}
                  </div>
                )}

                {client.phones?.[0] && (
                  <div
                    style={{
                      color: colors.textSecondary,
                      marginBottom: 12,
                    }}
                  >
                    Телефон: {client.phones[0]}
                  </div>
                )}

                {client.emails?.[0] && (
                  <div
                    style={{
                      color: colors.textSecondary,
                    }}
                  >
                    Email: {client.emails[0]}
                  </div>
                )}
              </div>

              {client.discount !== null &&
                client.discount !== undefined && (
                  <div
                    style={{
                      background: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 20,
                      padding: 20,
                      marginBottom: 16,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        color: colors.textSecondary,
                      }}
                    >
                      Ваша знижка
                    </span>

                    <span
                      style={{
                        color: colors.primary,
                        fontSize: 22,
                        fontWeight: 600,
                      }}
                    >
                      {client.discount}%
                    </span>
                  </div>
                )}

              <Button
                size="l"
                onClick={() => navigate('/orders')}
                style={{
                  width: '100%',
                  background: colors.primary,
                  color: colors.white,
                  borderRadius: 12,
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                Історія замовлень
              </Button>
            </>
          ) : (
            <div
              style={{
                color: colors.textSecondary,
              }}
            >
              Не вдалося завантажити профіль
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </Page>
  );
};