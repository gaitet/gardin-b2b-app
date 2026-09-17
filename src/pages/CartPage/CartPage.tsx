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
                  position: 'relative',
                  background: colors.white,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                {/* Кнопка видалення */}
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'transparent',
                    border: 'none',
                    fontSize: 24,
                    lineHeight: 1,
                    color: colors.textSecondary,
                    cursor: 'pointer',
                    padding: 4,
                  }}
                >
                  ×
                </button>

                {/* Назва */}
                <div
                  style={{
                    paddingRight: 30,
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
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

                {/* Інформація про товар */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Ціна */}
                  <div>
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
                        fontSize: 12,
                        color: colors.textSecondary,
                        textDecoration: 'line-through',
                        marginBottom: 2,
                      }}
                    >
                      {item.price.toFixed(2)} ₴ / {item.unit}
                    </div>

                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: colors.primary,
                      }}
                    >
                      {dealerPrice.toFixed(2)} ₴ / {item.unit}
                    </div>
                  </div>

                  {/* Кількість */}
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        marginBottom: 4,
                      }}
                    >
                      Кількість
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
                        style={{
                          width: 30,
                          height: 30,
                          padding: 0,
                          borderRadius: 6,
                        }}
                      >
                        −
                      </button>

                      <strong
                        style={{
                          minWidth: 24,
                          textAlign: 'center',
                        }}
                      >
                        {item.quantity}
                      </strong>

                      <button
                        onClick={() => increaseItem(item.id)}
                        style={{
                          width: 30,
                          height: 30,
                          padding: 0,
                          borderRadius: 6,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Сума */}
                  <div
                    style={{
                      textAlign: 'right',
                      marginLeft: 'auto',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        marginBottom: 4,
                      }}
                    >
                      Разом
                    </div>

                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {itemTotal.toFixed(2)} ₴
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Підсумок */}
          <div
            style={{
              marginTop: 24,
              borderTop: `1px solid ${colors.border}`,
              paddingTop: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              <span>Вартість товарів</span>
              <span>{(total / (1 - (dealer?.discount ?? 0) / 100)).toFixed(2)} ₴</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                fontSize: 14,
                color: colors.primary,
                marginBottom: 14,
              }}
            >
              <span>Знижка {dealer?.discount ?? 0}%</span>
              <span>
                −{(
                  (total / (1 - (dealer?.discount ?? 0) / 100)) -
                  total
                ).toFixed(2)} ₴
              </span>
            </div>

            <div
              style={{
                borderTop: `1px solid ${colors.border}`,
                paddingTop: 14,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                fontSize: 18,
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
    marginTop: 16,
    padding: 0,
    border: 'none',
    background: 'transparent',
    color: colors.text,
    fontSize: 14,
    cursor: 'pointer',
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