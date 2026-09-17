import { useEffect, useState } from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';
import { BottomNavigation } from '@/components/BottomNavigation/BottomNavigation';
import { colors } from '@/theme/colors';
import { retrieveRawInitData } from '@tma.js/sdk';

export default function OrdersPage() {
  const navigate = useNavigate();
   
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  const initDataRaw = retrieveRawInitData();

  if (!initDataRaw) {
    setError('Не знайдено Telegram авторизацію');
    setLoading(false);
    return;
  }

  fetch('https://gardin-b2b.vercel.app/orders', {
    headers: {
      Authorization: `tma ${initDataRaw}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не вдалося отримати замовлення');
      }

      return response.json();
    })
    .then((data) => {
      setOrders(data.items || []);
    })
    .catch((error) => {
      console.error(error);
      setError('Не вдалося завантажити замовлення');
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

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
            Історія замовлень
          </h1>

          {loading && (
            <div
              style={{
                color: colors.textSecondary,
                textAlign: 'center',
                padding: 40,
              }}
            >
              Завантаження замовлень...
            </div>
          )}

          {error && (
            <div
              style={{
                color: colors.text,
                textAlign: 'center',
                padding: 40,
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 32,
                textAlign: 'center',
                color: colors.textSecondary,
              }}
            >
              У вас поки немає замовлень
            </div>
          )}

          {!loading &&
            !error &&
            orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 20,
                  padding: 20,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: colors.text,
                    }}
                  >
                    Замовлення №{order.id}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: colors.primary,
                      fontWeight: 600,
                    }}
                  >
                    {order.stage?.title ||
                      order.stage?.name ||
                      'В обробці'}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginBottom: 16,
                  }}
                >
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString('uk-UA')
                    : 'Дата не вказана'}
                </div>

                <Button
                  size="m"
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{
                    width: '100%',
                    background: colors.primary,
                    color: colors.white,
                    borderRadius: 12,
                    border: 'none',
                    fontWeight: 600,
                  }}
                >
                  Переглянути замовлення
                </Button>
              </div>
            ))}
        </div>
      </div>

      <BottomNavigation />
    </Page>
  );
}