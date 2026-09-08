import { useEffect, type FC } from 'react';
import { Page } from '@/components/Page';
import { BottomNavigation } from '@/components/BottomNavigation/BottomNavigation';
import { useCart } from '@/context/CartContext';
import { colors } from '@/theme/colors';
import { useDealer } from '@/context/DealerContext';

export const CartPage: FC = () => {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    items,
    increaseItem,
    decreaseItem,
    removeItem,
  } = useCart();

  const { dealer } = useDealer();
  const getDealerPrice = (price: number) => {
  const discount = dealer?.discount ?? 0;
  return price * (1 - discount / 100);
};

  const total = items.reduce((sum, item) => {
  const dealerPrice = getDealerPrice(item.price);

  return sum + dealerPrice * item.quantity;
}, 0);

  const submitOrder = async () => {
    const response = await fetch('http://localhost:3001/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dealerName: dealer?.name,
        keepinClientId: dealer?.keepinClientId,
        items,
      }),
    });

    const result = await response.json();

    console.log(result);

    alert('Запит відправлено');
  };

  return (
    <Page back>
      <div
        style={{
          minHeight: '100vh',
          background: colors.background,
          color: colors.text,
          padding: 20,
          paddingBottom: 120,
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: 20,
          }}
        >
          Кошик
        </h1>

        {items.length === 0 ? (
          <p style={{ color: colors.textSecondary }}>
            Кошик порожній
          </p>
        ) : (
          <>
            {items.map((item) => {
  const dealerPrice = getDealerPrice(item.price);
  const itemTotal = dealerPrice * item.quantity;

  return (
                <div
                  key={item.id}
                  style={{
                    background: colors.white,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(180px, 1fr) auto auto auto auto',
                      alignItems: 'center',
                      gap: 20,
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.name}
                      </div>

                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 13,
                          color: colors.textSecondary,
                        }}
                      >
                        Арт. {item.article}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                        }}
                      >
                        Ціна
                      </div>

                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: colors.textSecondary,
                          textDecoration: 'line-through',
                        }}
                      >
                        {item.price.toFixed(2)} ₴
                      </div>

                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 15,
                          marginTop: 2,
                        }}
                      >
                        {dealerPrice.toFixed(2)} ₴
                      </div>
                    </div>

                    <div>
  <div
    style={{
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 6,
    }}
  >
    К-сть
  </div>

  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}
  >
    <button
      onClick={() => decreaseItem(item.id)}
    >
      −
    </button>

    <strong>
      {item.quantity}
    </strong>

    <button
      onClick={() => increaseItem(item.id)}
    >
      +
    </button>

    <span
      style={{
        fontSize: 12,
        color: colors.textSecondary,
      }}
    >
      {item.unit}
    </span>
  </div>
</div>

                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          color: colors.textSecondary,
                        }}
                      >
                        Разом
                      </div>

                      <strong
                        style={{
                          fontSize: 17,
                        }}
                      >
                        {itemTotal.toFixed(2)} ₴
                      </strong>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 18,
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}

            <div
              style={{
                marginTop: 24,
                borderTop: `1px solid ${colors.border}`,
                paddingTop: 16,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: colors.primary,
                }}
              >
                Разом: {total.toFixed(2)} ₴
              </h2>

              <button
                onClick={submitOrder}
                style={{
                  width: '100%',
                  marginTop: 20,
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: colors.primary,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Оформити замовлення
              </button>
            </div>
          </>
        )}
      
      </div>
      <BottomNavigation />
    </Page>
  );
};