import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

export type Dealer = {
  id: number;
  name: string;
  discount: number;
  keepinClientId: number;
};

type DealerContextType = {
  dealer: Dealer | null;
  isLoading: boolean;
};

const DealerContext = createContext<DealerContextType | null>(null);

export const DealerProvider = ({ children }: { children: ReactNode }) => {
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDealer = async () => {
      try {
        const initDataRaw = retrieveRawInitData();

        if (!initDataRaw) {
          console.error('Telegram initDataRaw не знайдено');
          return;
        }

        const response = await fetch('https://gardin-b2b.vercel.app/client-by-telegram', {
          headers: {
            Authorization: `tma ${initDataRaw}`,
          },
        });

        if (!response.ok) {
          console.error('Дилера не знайдено');
          return;
        }

        const client = await response.json();

        console.log('Знайдений дилер:', client);

        setDealer({
          id: client.id,
          name: client.company || client.person,
          discount: client.discount || 0,
          keepinClientId: client.id,
        });
      } catch (error) {
        console.error('Помилка завантаження дилера:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDealer();
  }, []);

  return (
    <DealerContext.Provider value={{ dealer, isLoading }}>
      {children}
    </DealerContext.Provider>
  );
};

export const useDealer = () => {
  const context = useContext(DealerContext);

  if (!context) {
    throw new Error('useDealer must be used inside DealerProvider');
  }

  return context;
};