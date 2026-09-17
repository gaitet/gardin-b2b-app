import { colors } from '@/theme/colors';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useDealer } from '@/context/DealerContext';

type ProductCardProps = {
  id: number;
  image: string;
  article: string;
  name: string;
  price: number;
  unit: string;
};

export const ProductCard = ({
  id,
  image,
  article,
  name,
  price,
  unit,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState('1');
  const { addItem } = useCart();
  const { dealer } = useDealer();
  const [addedMessage, setAddedMessage] = useState(false);

  const discount = dealer?.discount ?? 0;
  const dealerPrice = price * (1 - discount / 100);

  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
      }}
    >
      {addedMessage && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 320,
            minHeight: 72,
            background: 'rgba(55, 55, 55, 0.75)',
            borderRadius: 10,
            padding: '12px 14px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            zIndex: 10000,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              minWidth: 38,
              borderRadius: '50%',
              background: '#d4d4d4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7a7a7a',
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            i
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Успішно!
            </div>

            <div
              style={{
                color: '#ffffff',
                fontSize: 13,
                lineHeight: 1.25,
              }}
            >
              Товар додано до кошика
            </div>
          </div>

        </div>
      )}

      <img
        src={image}
        alt={name}
        style={{
          width: 72,
          height: 72,
          objectFit: 'cover',
          borderRadius: 8,
          flexShrink: 0,
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: 600,
          }}
        >
          {article}
        </div>

        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: colors.text,
            margin: '4px 0 10px',
          }}
        >
          {name}
        </div>

        <div>
          <div
            style={{
              color: colors.primary,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {price.toFixed(2)} ₴
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: colors.text,
              marginTop: 2,
            }}
          >
            {dealerPrice.toFixed(2)} ₴
            <span
              style={{
                fontSize: 12,
                fontWeight: 400,
                color: colors.textSecondary,
                marginLeft: 4,
              }}
            >
              (−{discount}%)
            </span>
          </div>

          <div
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              marginTop: 2,
            }}
          >
            за {unit}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 6,
            marginTop: 10,
          }}
        >
          <button
            onClick={() => {
              const qty = Number(quantity) || 1;

              if (qty > 1) {
                setQuantity(String(qty - 1));
              }
            }}
            style={{
              width: 36,
              height: 36,
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              background: colors.white,
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            −
          </button>

          <input
            type="text"
            inputMode="numeric"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{
              width: 50,
              height: 36,
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 600,
              boxSizing: 'border-box',
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
              appearance: 'textfield',
            }}
          />

          <button
            onClick={() => {
              const qty = Number(quantity) || 1;
              setQuantity(String(qty + 1));
            }}
            style={{
              width: 36,
              height: 36,
              border: `1px solid ${colors.border}`,
              borderRadius: 6,
              background: colors.white,
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            +
          </button>

          <span
            style={{
              fontSize: 13,
              color: colors.textSecondary,
              marginLeft: 2,
            }}
          >
            {unit}
          </span>

          <button
            onClick={() => {
              const qty = Number(quantity) || 1;

              addItem({
                id,
                article,
                name,
                price,
                unit,
                quantity: qty,
              });

              setAddedMessage(true);
              setTimeout(() => setAddedMessage(false), 2400);
              setQuantity('1');
            }}
            style={{
              background: colors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              width: 40,
              height: 40,
              cursor: 'pointer',
              fontSize: 18,
              marginLeft: 4,
            }}
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  );
};