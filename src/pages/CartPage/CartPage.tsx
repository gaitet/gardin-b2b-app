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
                    background: colors.white,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                  }}
                >
                  <div
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
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

  <div
    style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: 32,
      flexWrap: 'wrap',
    }}
  >
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
          fontSize: 14,
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
          gap: 6,
        }}
      >
        <button
          onClick={() => decreaseItem(item.id)}
          style={{
            width: 30,
            height: 30,
            padding: 0,
          }}
        >
          −
        </button>

        <strong>{item.quantity}</strong>

        <button
          onClick={() => increaseItem(item.id)}
          style={{
            width: 30,
            height: 30,
            padding: 0,
          }}
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

    <div
      style={{
        textAlign: 'right',
      }}
    >
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
          fontSize: 16,
        }}
      >
        {itemTotal.toFixed(2)} ₴
      </strong>
    </div>
  </div>

  <button
    onClick={() => removeItem(item.id)}
    style={{
      alignSelf: 'flex-end',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: 18,
      padding: 4,
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