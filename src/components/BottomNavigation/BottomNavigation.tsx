import { colors } from '@/theme/colors';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, ShoppingCart, User } from 'lucide-react';

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        background: colors.white,
        borderTop: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <Link
        to="/catalog"
        style={{
          textDecoration: 'none',
          color: location.pathname === '/catalog' ? colors.primary : colors.text,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <LayoutGrid size={22} />
        <span style={{ fontSize: 12 }}>Каталог</span>
      </Link>

      <Link
        to="/cart"
        style={{
          textDecoration: 'none',
          color: location.pathname === '/cart' ? colors.primary : colors.text,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <ShoppingCart size={22} />
        <span style={{ fontSize: 12 }}>Кошик</span>
      </Link>

      <Link
        to="/profile"
        style={{
          textDecoration: 'none',
          color: location.pathname === '/profile' ? colors.primary : colors.text,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <User size={22} />
        <span style={{ fontSize: 12 }}>Профіль</span>
      </Link>
    </div>
  );
};