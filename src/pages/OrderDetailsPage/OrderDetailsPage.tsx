import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Page } from '@/components/Page';
import { colors } from '@/theme/colors';
import { BottomNavigation } from '@/components/BottomNavigation/BottomNavigation';

export default function OrderDetailsPage() {
  const { id } = useParams();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/agreement/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не вдалося отримати замовлення');
        }

        return response.json();
      })
      .then((data) => {
        setOrder(data);
      })
      .catch((error) => {
        console.error(error);
        setError('Не вдалося завантажити замовлення');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Page back>
        <div
          style={{
            minHeight: '100vh',
            background: colors.background,
            padding: 20,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          Завантаження замовлення...
        </div>
      </Page>
    );
  }

  if (error || !order) {
    return (
      <Page back>
        <div
          style={{
            minHeight: '100vh',
            background: colors.background,
            padding: 20,
            color: colors.text,
            textAlign: 'center',
          }}
        >
          {error || 'Замовлення не знайдено'}
        </div>
      </Page>
    );
  }

  const items = order.jobs || order.items || [];

  return (
    <Page back>
      <div
        style={{
          minHeight: '100vh',
          background: colors.background,
          padding: 20,
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
              marginBottom: 8,
            }}
          >
            Замовлення №{order.id}
          </h1>

          <div
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString('uk-UA')
              : 'Дата не вказана'}
          </div>

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
                fontSize: 14,
                color: colors.textSecondary,
                marginBottom: 6,
              }}
            >
              Статус
            </div>

            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: colors.primary,
              }}
            >
              {order.stage?.title ||
                order.stage?.name ||
                'В обробці'}
            </div>
          </div>

          <h2
            style={{
              color: colors.text,
              fontSize: 18,
              marginBottom: 12,
            }}
          >
            Товари
          </h2>

          {items.length === 0 ? (
            <div
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 20,
                padding: 20,
                color: colors.textSecondary,
              }}
            >
              Товари не знайдено
            </div>
          ) : (
            items.map((item: any, index: number) => (
              <div
                key={item.id || index}
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    color: colors.text,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  {item.title || item.product?.title || 'Товар'}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: colors.textSecondary,
                    fontSize: 14,
                    marginBottom: 10,
                  }}
                >
                  <span>
                    Кількість: {item.amount ?? '—'} м.п.
                  </span>

                  <span>
                    Ціна:{' '}
                    {item.discounted_price_amount ??
                      item.price_amount ??
                      '—'}{' '}
                    грн/м.п.
                  </span>
                </div>

                <div
                  style={{
                    borderTop: `1px solid ${colors.border}`,
                    paddingTop: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: colors.text,
                    fontWeight: 600,
                  }}
                >
                  <span>Сума</span>

                  <span>
                    {item.total_amount ?? '—'} грн
                  </span>
                </div>
              </div>
            ))
          )}

          <div
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              padding: 20,
              marginTop: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: colors.textSecondary,
                marginBottom: 12,
              }}
            >
              <span>Сума без знижки</span>

              <span>
                {order.products_total_amount !== undefined
                  ? (
                      Number(order.products_total_amount) /
                      (1 - Number(order.discount || 0) / 100)
                    ).toFixed(2)
                  : '—'}{' '}
                грн
              </span>
            </div>

            {Number(order.discount) > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: colors.textSecondary,
                  marginBottom: 12,
                }}
              >
                <span>Знижка {order.discount}%</span>

                <span>
                  −
                  {order.products_total_amount !== undefined
                    ? (
                        Number(order.products_total_amount) /
                        (1 - Number(order.discount) / 100) -
                        Number(order.products_total_amount)
                      ).toFixed(2)
                    : '—'}{' '}
                  грн
                </span>
              </div>
            )}

            <div
              style={{
                borderTop: `1px solid ${colors.border}`,
                paddingTop: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: colors.text,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              <span>До сплати</span>

              <span>
                {order.total_amount ?? '—'} грн
              </span>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </Page>
  );
}