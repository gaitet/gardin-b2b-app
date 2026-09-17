import { useEffect, type FC } from 'react';
import { Page } from '@/components/Page';
import { BottomNavigation } from '@/components/BottomNavigation/BottomNavigation';
import { useCart } from '@/context/CartContext';
import { colors } from '@/theme/colors';
import { useDealer } from '@/context/DealerContext';
import { retrieveRawInitData } from '@tma.js/sdk';

export const CartPage: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    items,
    increaseItem,
    decreaseItem,
    removeItem,
    clearCart,
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

  const getProductLength = (name: string): number | null => {
    const match = name.match(/(\d+(?:[.,]\d+)?)\s*m\b/i);

    if (!match) return null;

    const length = Number(match[1].replace(',', '.'));

    return Number.isFinite(length) ? length : null;
  };

  const getTotalMeters = (item: {
    name: string;
    unit: string;
    quantity: number;
  }): number | null => {
    const normalizedUnit = item.unit.toLowerCase().replace(/\s/g, '');

    if (
      normalizedUnit === 'м.п.' ||
      normalizedUnit === 'м.п' ||
      normalizedUnit === 'мп'
    ) {
      return item.quantity;
    }

    const length = getProductLength(item.name);

    if (length === null) return null;

    return item.quantity * length;
  };

  const formatMeters = (meters: number) => {
    return Number.isInteger(meters)
      ? String(meters)
      : meters.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
  };

  const submitOrder = async () => {
    const initDataRaw = retrieveRawInitData();

    const response = await fetch('https://gardin-b2b.vercel.app/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `tma ${initDataRaw}`,
      },
      body: JSON.stringify({
        items,
      }),
    });

    const result = await response.json();

    console.log(result);

    alert('Запит відправлено');
    clearCart();
  };

  const discount = dealer?.discount ?? 0;

  const originalTotal =
    discount > 0
      ? total / (1 - discount / 100)
      : total;

  const discountAmount = originalTotal - total;

  return (
    <Page back>
      <div
        style={{
          minHeight: '100vh',
          background: colors.background,
          color: colors.text,
          padding: 16,
          paddingBottom: 120,
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: 18,
            fontSize: 28,
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
              const totalMeters = getTotalMeters(item);

              return (
                <div
                  key={item.id}
                  style={{
                    position: 'relative',
                    background: colors.white,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 12,
                    boxSizing: 'border-box',
                  }}
                >
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Видалити товар"
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 32,
                      height: 32,
                      background: 'transparent',
                      border: 'none',
                      fontSize: 22,
                      lineHeight: 1,
                      color: colors.textSecondary,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    ×
                  </button>

                  <div
                    style={{
                      paddingRight: 32,
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        lineHeight: 1.35,
                        color: colors.text,
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

                  <div
                    style={{
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        marginBottom: 4,
                      }}
                    >
                      Ціна
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: colors.textSecondary,
                        textDecoration: 'line-through',
                        marginBottom: 3,
                      }}
                    >
                      {item.price.toFixed(2)} ₴ / {item.unit}
                    </div>

                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: colors.primary,
                      }}
                    >
                      {dealerPrice.toFixed(2)} ₴ / {item.unit}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      alignItems: 'end',
                      gap: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          color: colors.textSecondary,
                          marginBottom: 6,
                        }}
                      >
                        Кількість
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0,
                        }}
                      >
                        <button
                          onClick={() => decreaseItem(item.id)}
                          style={{
                            width: 36,
                            height: 36,
                            padding: 0,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '7px 0 0 7px',
                            background: colors.white,
                            cursor: 'pointer',
                            fontSize: 18,
                          }}
                        >
                          −
                        </button>

                        <div
                          style={{
                            width: 42,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTop: `1px solid ${colors.border}`,
                            borderBottom: `1px solid ${colors.border}`,
                            boxSizing: 'border-box',
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {item.quantity}
                        </div>

                        <button
                          onClick={() => increaseItem(item.id)}
                          style={{
                            width: 36,
                            height: 36,
                            padding: 0,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '0 7px 7px 0',
                            background: colors.white,
                            cursor: 'pointer',
                            fontSize: 18,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: 'right',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: colors.textSecondary,
                          marginBottom: 4,
                        }}
                      >
                        Сума
                      </div>

                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          color: colors.text,
                          lineHeight: 1.2,
                        }}
                      >
                        {itemTotal.toFixed(2)} ₴
                      </div>

                      {totalMeters !== null && (
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: colors.textSecondary,
                          }}
                        >
                          {formatMeters(totalMeters)} м.п.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              style={{
                marginTop: 20,
                background: colors.white,
                border: `1px solid ${colors.border}`,
                borderRadius: 14,
                padding: 18,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                <span>Сума</span>
                <span>{originalTotal.toFixed(2)} ₴</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 14,
                }}
              >
                <span>Знижка {discount}%</span>

                <span>
                  −{discountAmount.toFixed(2)} ₴
                </span>
              </div>

              <div
                style={{
                  borderTop: `1px solid ${colors.border}`,
                  paddingTop: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 19,
                  fontWeight: 700,
                }}
              >
                <span>До сплати</span>

                <span>{total.toFixed(2)} ₴</span>
              </div>

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

              <button
                onClick={() => {
                  window.location.hash = '/catalog';
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: 12,
                  padding: '12px 16px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  background: colors.white,
                  color: colors.text,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                ← Продовжити покупки
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </Page>
  );
};